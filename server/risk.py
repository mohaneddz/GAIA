"""Score the exported logistic-regression risk models and explain each score."""

import json
import math
from pathlib import Path

RISK_DIR = Path(__file__).resolve().parent / "models" / "risk"


class UnknownRiskModel(KeyError):
    pass


class InvalidInputs(ValueError):
    pass


def sigmoid(value):
    return 1 / (1 + math.exp(-value))


def load_cards():
    return {path.stem: json.loads(path.read_text(encoding="utf-8")) for path in sorted(RISK_DIR.glob("*.json"))}


CARDS = load_cards()


def get_card(model_id):
    if model_id not in CARDS:
        raise UnknownRiskModel(model_id)
    return CARDS[model_id]


def validate(card, inputs):
    if not isinstance(inputs, dict):
        raise InvalidInputs("inputs must be an object")
    clean = {}
    for feature in card["features"]:
        key, value = feature["key"], inputs.get(feature["key"])
        if value is None:
            raise InvalidInputs(f"{feature['label']} is required")
        if feature["type"] == "number":
            if isinstance(value, bool) or not isinstance(value, (int, float)):
                raise InvalidInputs(f"{feature['label']} must be a number")
            if not feature["min"] <= value <= feature["max"]:
                raise InvalidInputs(f"{feature['label']} must be between {feature['min']} and {feature['max']}")
        elif str(value) not in {option["value"] for option in feature["options"]}:
            raise InvalidInputs(f"{feature['label']} has an unknown option")
        clean[key] = value if feature["type"] == "number" else str(value)
    return clean


def predict(model_id, inputs):
    card = get_card(model_id)
    values = validate(card, inputs)
    model = card["model"]

    # Logit = reference (an average training patient) + one exact term per feature.
    reference = model["intercept"]
    contributions = {}
    for term in model["terms"]:
        feature = term["feature"]
        if term["kind"] == "number":
            amount = term["weight"] * (values[feature] - term["mean"]) / term["std"]
        else:
            reference += term["weight"] * term["share"]
            amount = term["weight"] * ((values[feature] == term["value"]) - term["share"])
        contributions[feature] = contributions.get(feature, 0.0) + amount

    logit = reference + sum(contributions.values())
    probability = sigmoid(logit)
    labels = {f["key"]: f for f in card["features"]}

    def shown(feature):
        value = values[feature["key"]]
        if feature["type"] == "number":
            return f"{value:g} {feature['unit']}"
        return next(o["label"] for o in feature["options"] if o["value"] == value)

    return {
        "model": model_id,
        "probability": round(probability, 4),
        "referenceProbability": round(sigmoid(reference), 4),
        "aboveThreshold": probability >= card["metrics"]["threshold"],
        "contributions": sorted(
            (
                {"feature": key, "label": labels[key]["label"], "value": shown(labels[key]), "logOdds": round(amount, 4)}
                for key, amount in contributions.items()
            ),
            key=lambda item: abs(item["logOdds"]),
            reverse=True,
        ),
    }
