"""Patients and saved analyses over HTTP."""

from flask import Blueprint, jsonify, request

import risk
import store
from vision import get_model

records = Blueprint("records", __name__, url_prefix="/api")


@records.app_errorhandler(store.NotFound)
def not_found(error):
    return jsonify({"error": f"not found: {error.args[0]}"}), 404


@records.app_errorhandler(store.Invalid)
def invalid(error):
    return jsonify({"error": str(error)}), 400


def describe_vision(model_id, result):
    """Validate a classifier result and derive its summary on the server."""
    card = get_model(model_id).card
    classes = card["classes"]
    if not isinstance(result, dict):
        raise store.Invalid("result must be an object")
    predicted, probabilities = result.get("predicted"), result.get("probabilities")
    if (
        isinstance(predicted, bool) or not isinstance(predicted, int) or not 0 <= predicted < len(classes)
        or not isinstance(probabilities, list) or len(probabilities) != len(classes)
        or not all(isinstance(p, dict) and isinstance(p.get("probability"), (int, float)) for p in probabilities)
    ):
        raise store.Invalid(f"result does not match the {model_id} model's classes")
    top = classes[predicted]
    kept = {"predicted": predicted, "probabilities": [{"name": c["name"], "probability": p["probability"]} for c, p in zip(classes, probabilities)]}
    return card["title"], f"{top['name']}, {probabilities[predicted]['probability']:.0%}", top.get("attention", False), kept


def describe_risk(model_id, inputs):
    """Re-score from the inputs so a saved risk always matches the model."""
    card = risk.get_card(model_id)
    try:
        result = risk.predict(model_id, inputs)
    except risk.InvalidInputs as error:
        raise store.Invalid(str(error))
    flagged = result["aboveThreshold"]
    summary = f"{result['probability']:.1%} risk, {'above' if flagged else 'below'} the {card['metrics']['threshold']:.0%} threshold"
    return card["title"], summary, flagged, {**result, "inputs": inputs}


@records.get("/patients")
def list_patients():
    return jsonify(store.list_patients(request.args.get("q", "")))


@records.post("/patients")
def create_patient():
    return jsonify(store.create_patient(request.get_json(silent=True))), 201


@records.get("/patients/<int:patient_id>")
def get_patient(patient_id):
    return jsonify(store.get_patient(patient_id))


@records.patch("/patients/<int:patient_id>")
def update_patient(patient_id):
    return jsonify(store.update_patient(patient_id, request.get_json(silent=True)))


@records.delete("/patients/<int:patient_id>")
def delete_patient(patient_id):
    store.delete_patient(patient_id)
    return "", 204


@records.get("/analyses")
def list_analyses():
    patient = request.args.get("patient")
    if patient is not None and not patient.isdigit():
        raise store.Invalid("patient must be an id")
    limit = request.args.get("limit", "100")
    if not limit.isdigit() or not 1 <= int(limit) <= 500:
        raise store.Invalid("limit must be between 1 and 500")
    return jsonify(store.list_analyses(
        patient_id=int(patient) if patient else None,
        model=request.args.get("model") or None,
        flagged_only=request.args.get("flagged") == "1",
        limit=int(limit),
    ))


@records.post("/analyses")
def save_analysis():
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        raise store.Invalid("expected a JSON object")
    kind, model_id = body.get("kind"), body.get("model")
    if kind == "vision":
        title, summary, flagged, result = describe_vision(model_id, body.get("result"))
    elif kind == "risk":
        title, summary, flagged, result = describe_risk(model_id, body.get("inputs"))
    else:
        raise store.Invalid("kind must be vision or risk")
    saved = store.save_analysis({
        "kind": kind, "model": model_id, "patientId": body.get("patientId"), "note": body.get("note", ""),
        "thumbnail": body.get("thumbnail"), "title": title, "summary": summary, "flagged": flagged, "result": result,
    })
    return jsonify(saved), 201


@records.get("/analyses/<int:analysis_id>")
def get_analysis(analysis_id):
    return jsonify(store.get_analysis(analysis_id))


@records.delete("/analyses/<int:analysis_id>")
def delete_analysis(analysis_id):
    store.delete_analysis(analysis_id)
    return "", 204


@records.get("/stats")
def stats():
    return jsonify(store.stats())
