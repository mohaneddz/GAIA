"""Train the tabular risk models and export them as plain JSON.

    python -m ml.train_risk                (run from server/)

Logistic regression on standardised numeric features and one-hot categories.
The server rebuilds the score from the exported coefficients, so it needs no
scikit-learn, and each feature's contribution to the log-odds is exact.
"""

import json
from datetime import datetime, timezone

import numpy as np
import pandas as pd
from sklearn import metrics
from sklearn.calibration import calibration_curve
from sklearn.linear_model import LogisticRegressionCV
from sklearn.model_selection import train_test_split

from .datasets import DATA_DIR
from .train import MODELS_DIR

RISK_DIR = MODELS_DIR / "risk"


def number(key, label, unit, low, high, default, step=1):
    return {"key": key, "label": label, "type": "number", "unit": unit, "min": low, "max": high, "default": default, "step": step}


def category(key, label, options, default):
    return {"key": key, "label": label, "type": "category", "options": [{"value": v, "label": l} for v, l in options], "default": default}


HEART = {
    "id": "heart",
    "title": "Heart disease risk",
    "outcome": "Coronary artery disease on angiography or clinical diagnosis",
    "dataset": {
        "name": "Heart Failure Prediction (918 patients)",
        "url": "https://www.kaggle.com/datasets/fedesoriano/heart-failure-prediction",
        "license": "ODbL 1.0",
        "citation": "fedesoriano 2021, combining the Cleveland, Hungarian, Swiss, Long Beach VA and Statlog heart datasets (UCI)",
    },
    "features": [
        number("age", "Age", "years", 18, 100, 54),
        category("sex", "Sex", [("M", "Male"), ("F", "Female")], "M"),
        category("chestPain", "Chest pain type", [("ASY", "Asymptomatic"), ("ATA", "Atypical angina"), ("NAP", "Non-anginal pain"), ("TA", "Typical angina")], "ASY"),
        number("restingBp", "Resting blood pressure", "mmHg", 80, 220, 130),
        number("cholesterol", "Serum cholesterol", "mg/dL", 100, 600, 240),
        category("fastingSugar", "Fasting blood sugar above 120 mg/dL", [("0", "No"), ("1", "Yes")], "0"),
        category("restingEcg", "Resting ECG", [("Normal", "Normal"), ("ST", "ST-T wave abnormality"), ("LVH", "Left ventricular hypertrophy")], "Normal"),
        number("maxHr", "Maximum heart rate on exercise test", "bpm", 60, 220, 138),
        category("exerciseAngina", "Exercise-induced angina", [("N", "No"), ("Y", "Yes")], "N"),
        number("oldpeak", "ST depression on exercise (oldpeak)", "mm", -3, 7, 0.9, 0.1),
        category("stSlope", "Peak exercise ST slope", [("Up", "Upsloping"), ("Flat", "Flat"), ("Down", "Downsloping")], "Flat"),
    ],
}

STROKE = {
    "id": "stroke",
    "title": "Stroke risk",
    "outcome": "History of stroke",
    "dataset": {
        "name": "Stroke Prediction Dataset (5,110 people)",
        "url": "https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset",
        "license": "Data files © original authors",
        "citation": "fedesoriano 2021",
    },
    "features": [
        number("age", "Age", "years", 1, 100, 60),
        category("sex", "Sex", [("Male", "Male"), ("Female", "Female")], "Male"),
        category("hypertension", "Hypertension", [("0", "No"), ("1", "Yes")], "0"),
        category("heartDisease", "Heart disease", [("0", "No"), ("1", "Yes")], "0"),
        number("glucose", "Average glucose level", "mg/dL", 50, 300, 105, 0.1),
        number("bmi", "Body mass index", "kg/m²", 10, 70, 28.5, 0.1),
        category("smoking", "Smoking", [("never smoked", "Never"), ("formerly smoked", "Former"), ("smokes", "Current"), ("Unknown", "Unknown")], "never smoked"),
    ],
}


def load_heart():
    frame = pd.read_csv(DATA_DIR / "heart_failure" / "heart.csv")
    # Zero cholesterol and blood pressure are missing values in the source.
    for column in ("Cholesterol", "RestingBP"):
        frame[column] = frame[column].replace(0, np.nan)
        frame[column] = frame[column].fillna(frame[column].median())
    frame = frame.rename(columns={
        "Age": "age", "Sex": "sex", "ChestPainType": "chestPain", "RestingBP": "restingBp",
        "Cholesterol": "cholesterol", "FastingBS": "fastingSugar", "RestingECG": "restingEcg",
        "MaxHR": "maxHr", "ExerciseAngina": "exerciseAngina", "Oldpeak": "oldpeak", "ST_Slope": "stSlope",
    })
    frame["fastingSugar"] = frame["fastingSugar"].astype(str)
    return frame, frame.pop("HeartDisease").to_numpy()


def load_stroke():
    frame = pd.read_csv(DATA_DIR / "stroke" / "healthcare-dataset-stroke-data.csv")
    frame = frame[frame["gender"] != "Other"].copy()
    frame["bmi"] = frame["bmi"].fillna(frame["bmi"].median())
    frame = frame.rename(columns={
        "gender": "sex", "heart_disease": "heartDisease", "avg_glucose_level": "glucose", "smoking_status": "smoking",
    })
    for column in ("hypertension", "heartDisease"):
        frame[column] = frame[column].astype(str)
    outcome = frame.pop("stroke").to_numpy()
    return frame[[f["key"] for f in STROKE["features"]]], outcome


def design_matrix(frame, spec, scaling=None):
    columns, terms = [], []
    scaling = scaling or {}
    for feature in spec["features"]:
        key = feature["key"]
        if feature["type"] == "number":
            values = frame[key].astype(float)
            mean, std = scaling.get(key) or (float(values.mean()), float(values.std()))
            scaling[key] = (mean, std)
            columns.append(((values - mean) / std).to_numpy())
            terms.append({"feature": key, "kind": "number", "mean": round(mean, 6), "std": round(std, 6)})
        else:
            # Drop the first level as the reference to keep the model identifiable.
            for option in feature["options"][1:]:
                columns.append((frame[key].astype(str) == option["value"]).astype(float).to_numpy())
                terms.append({"feature": key, "kind": "category", "value": option["value"]})
    return np.column_stack(columns), terms, scaling


def train_one(spec, loader):
    frame, outcome = loader()
    train_frame, test_frame, train_y, test_y = train_test_split(frame, outcome, test_size=0.2, stratify=outcome, random_state=0)
    train_x, terms, scaling = design_matrix(train_frame, spec)
    test_x, _, _ = design_matrix(test_frame, spec, scaling)

    model = LogisticRegressionCV(Cs=10, cv=5, scoring="neg_log_loss", max_iter=5000).fit(train_x, train_y)
    probabilities = model.predict_proba(test_x)[:, 1]

    # Youden's J on the training set picks the operating point shown in the UI.
    train_probabilities = model.predict_proba(train_x)[:, 1]
    fpr, tpr, thresholds = metrics.roc_curve(train_y, train_probabilities)
    threshold = float(thresholds[np.argmax(tpr - fpr)])
    predicted = probabilities >= threshold
    tn, fp, fn, tp = metrics.confusion_matrix(test_y, predicted).ravel()

    observed, expected = calibration_curve(test_y, probabilities, n_bins=5, strategy="quantile")
    for term, weight in zip(terms, model.coef_[0]):
        term["weight"] = round(float(weight), 6)
        if term["kind"] == "category":
            # Training share of this level: the "average patient" reference.
            term["share"] = round(float((train_frame[term["feature"]].astype(str) == term["value"]).mean()), 6)

    card = {
        **spec,
        "kind": "risk",
        "prevalence": round(float(train_y.mean()), 4),
        "model": {"type": "logistic regression", "intercept": round(float(model.intercept_[0]), 6), "regularisationC": float(model.C_[0]), "terms": terms},
        "splits": {"train": int(len(train_y)), "test": int(len(test_y))},
        "metrics": {
            "auc": round(float(metrics.roc_auc_score(test_y, probabilities)), 4),
            "brier": round(float(metrics.brier_score_loss(test_y, probabilities)), 4),
            "threshold": round(threshold, 4),
            "sensitivity": round(float(tp / (tp + fn)), 4),
            "specificity": round(float(tn / (tn + fp)), 4),
            "calibration": [{"predicted": round(float(e), 4), "observed": round(float(o), 4)} for o, e in zip(observed, expected)],
        },
        "trainedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    }
    RISK_DIR.mkdir(parents=True, exist_ok=True)
    (RISK_DIR / f"{spec['id']}.json").write_text(json.dumps(card, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[{spec['id']}] test AUC {card['metrics']['auc']}  Brier {card['metrics']['brier']}  "
          f"sens {card['metrics']['sensitivity']}  spec {card['metrics']['specificity']} at {threshold:.3f}")
    return card


def main():
    train_one(HEART, load_heart)
    train_one(STROKE, load_stroke)


if __name__ == "__main__":
    main()
