import os

from flask import Flask, jsonify, request

from signals.ecg import LEAD_NAMES, ecg_vitals, generate_ecg
from signals.eeg import CHANNEL_NAMES, eeg_metrics, generate_eeg

app = Flask(__name__)

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
    return response


class BadParam(ValueError):
    pass


@app.errorhandler(BadParam)
def bad_param(error):
    return jsonify({"error": str(error)}), 400


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
    return jsonify({"status": "ok"})


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


if __name__ == "__main__":
    port = int(os.environ.get("GAIA_SIGNAL_PORT", 5600))
    app.run(host="127.0.0.1", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
