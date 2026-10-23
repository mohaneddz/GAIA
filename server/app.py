import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_file
from PIL import Image, UnidentifiedImageError

load_dotenv(Path(__file__).with_name(".env"))

from chat import ChatUnavailable, chat_enabled, complete
from signals.ecg import LEAD_NAMES, ecg_vitals, generate_ecg
from signals.eeg import CHANNEL_NAMES, eeg_metrics, generate_eeg
from vision import REGISTRY, UnknownModel, get_model, sample_path

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

# Vite dev server, plus the origins the Tauri webview uses on each platform.
ALLOWED_ORIGINS = {
    "http://localhost:1420",
    "http://127.0.0.1:1420",
    "tauri://localhost",
    "http://tauri.localhost",
}


@app.after_request
def allow_dashboard_origin(response):
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST"
    return response


class BadParam(ValueError):
    pass


@app.errorhandler(BadParam)
def bad_param(error):
    return jsonify({"error": str(error)}), 400


@app.errorhandler(UnknownModel)
def unknown_model(error):
    return jsonify({"error": f"unknown model or sample: {error.args[0]}"}), 404


@app.errorhandler(413)
def too_large(_error):
    return jsonify({"error": "image must be under 10 MB"}), 413


def number_param(name, default, low, high):
    raw = request.args.get(name)
    if raw is None:
        return default
    try:
        value = float(raw)
    except ValueError:
        raise BadParam(f"{name} must be a number")
    if not low <= value <= high:
        raise BadParam(f"{name} must be between {low} and {high}")
    return value


def seed_param():
    raw = request.args.get("seed")
    if raw is None:
        return None
    if not raw.isdigit():
        raise BadParam("seed must be a non-negative integer")
    return int(raw)


def rows(times, names, values):
    """Recharts wants one object per sample: {time, <name>: value, ...}."""
    rounded = values.round(4).tolist()
    return [
        {"time": round(float(t), 3), **{name: series[i] for name, series in zip(names, rounded)}}
        for i, t in enumerate(times)
    ]


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "chat": chat_enabled()})


@app.get("/api/ecg")
def ecg():
    duration = number_param("duration", 10, 1, 60)
    fs = int(number_param("fs", 250, 100, 1000))
    heart_rate = number_param("hr", 72, 30, 200)
    hrv_ms = number_param("hrv", 30, 0, 200)

    times, leads = generate_ecg(duration, fs, heart_rate, hrv_ms, seed_param())
    return jsonify({
        "fs": fs,
        "duration": duration,
        "leads": LEAD_NAMES,
        "samples": rows(times, LEAD_NAMES, leads),
        "vitals": ecg_vitals(leads, fs),
    })


@app.get("/api/eeg")
def eeg():
    duration = number_param("duration", 10, 1, 60)
    fs = int(number_param("fs", 250, 100, 1000))

    times, channels = generate_eeg(duration, fs, seed_param())
    return jsonify({
        "fs": fs,
        "duration": duration,
        "channels": CHANNEL_NAMES,
        "samples": rows(times, CHANNEL_NAMES, channels),
        "metrics": eeg_metrics(channels, fs),
    })


def chat_history(body):
    messages = body.get("messages") if isinstance(body, dict) else None
    if not isinstance(messages, list) or not messages:
        raise BadParam("messages must be a non-empty list")
    history = []
    for message in messages:
        if (
            not isinstance(message, dict)
            or message.get("role") not in ("user", "assistant")
            or not isinstance(message.get("content"), str)
        ):
            raise BadParam("each message needs a role of user or assistant and string content")
        history.append({"role": message["role"], "content": message["content"]})
    if history[-1]["role"] != "user":
        raise BadParam("the last message must be from the user")
    return history


@app.post("/api/chat")
def chat():
    body = request.get_json(silent=True)
    history = chat_history(body)
    features = body.get("addedFeatures", [])
    if not isinstance(features, list) or not all(isinstance(name, str) for name in features):
        raise BadParam("addedFeatures must be a list of strings")

    try:
        reply = complete(history, features)
    except ChatUnavailable as error:
        return jsonify({"error": str(error)}), 503
    return jsonify({"reply": reply})


@app.get("/api/models")
def list_models():
    return jsonify([model.card for model in REGISTRY.values()])


@app.get("/api/models/<model_id>")
def model_card(model_id):
    return jsonify(get_model(model_id).card)


@app.get("/api/models/<model_id>/samples/<file_name>")
def model_sample(model_id, file_name):
    return send_file(sample_path(model_id, file_name), mimetype="image/png")


@app.post("/api/models/<model_id>/predict")
def predict(model_id):
    model = get_model(model_id)
    upload = request.files.get("image")
    if upload is not None:
        source = upload.stream
    else:
        body = request.get_json(silent=True) or {}
        if not isinstance(body.get("sample"), str):
            raise BadParam("send an image file field, or JSON with a sample file name")
        source = sample_path(model_id, body["sample"])
    try:
        with Image.open(source) as image:
            image.load()
            return jsonify(model.predict(image))
    except UnidentifiedImageError:
        raise BadParam("could not read the file as an image")


if __name__ == "__main__":
    port = int(os.environ.get("GAIA_SIGNAL_PORT", 5600))
    app.run(host="127.0.0.1", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
