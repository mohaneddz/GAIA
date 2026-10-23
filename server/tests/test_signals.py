import numpy as np
import pytest

from app import app
from signals.ecg import LEAD_NAMES, ecg_vitals, generate_ecg
from signals.eeg import CHANNEL_NAMES, eeg_metrics, generate_eeg


@pytest.fixture
def client():
    return app.test_client()


def test_ecg_shape_matches_duration():
    times, leads = generate_ecg(duration_sec=10, fs=250, seed=1)
    assert leads.shape == (len(LEAD_NAMES), len(times))
    assert times[-1] < 10
    assert len(times) == pytest.approx(2500, abs=1)


@pytest.mark.parametrize("heart_rate", [50, 72, 120])
def test_measured_heart_rate_tracks_requested(heart_rate):
    _, leads = generate_ecg(duration_sec=30, heart_rate=heart_rate, seed=7)
    vitals = ecg_vitals(leads, 250)
    assert vitals["heartRate"] == pytest.approx(heart_rate, rel=0.05)


def test_hrv_shows_up_in_rr_spread():
    _, steady = generate_ecg(duration_sec=30, hrv_ms=0, seed=3)
    _, variable = generate_ecg(duration_sec=30, hrv_ms=60, seed=3)
    assert ecg_vitals(variable, 250)["rrStdMs"] > ecg_vitals(steady, 250)["rrStdMs"]


def test_seed_is_reproducible():
    _, first = generate_eeg(seed=42)
    _, second = generate_eeg(seed=42)
    np.testing.assert_array_equal(first, second)


def test_eeg_band_fractions_sum_to_one():
    _, channels = generate_eeg(seed=5)
    metrics = eeg_metrics(channels, 250)
    assert len(channels) == len(CHANNEL_NAMES)
    assert sum(metrics["bandRelative"].values()) == pytest.approx(1, abs=0.01)
    assert metrics["alphaBetaRatio"] > 0


def test_ecg_endpoint(client):
    response = client.get("/api/ecg?duration=5&hr=80&seed=1")
    body = response.get_json()
    assert response.status_code == 200
    assert body["leads"] == LEAD_NAMES
    assert set(body["samples"][0]) == {"time", *LEAD_NAMES}
    assert body["vitals"]["heartRate"] is not None


def test_eeg_endpoint(client):
    body = client.get("/api/eeg?duration=2&seed=1").get_json()
    assert set(body["samples"][0]) == {"time", *CHANNEL_NAMES}
    assert "alphaBetaRatio" in body["metrics"]


@pytest.mark.parametrize("query", ["hr=abc", "hr=500", "duration=0", "seed=-1"])
def test_bad_params_are_rejected(client, query):
    response = client.get(f"/api/ecg?{query}")
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_cors_only_for_dashboard_origins(client):
    allowed = client.get("/api/health", headers={"Origin": "http://localhost:1420"})
    other = client.get("/api/health", headers={"Origin": "https://example.com"})
    assert allowed.headers["Access-Control-Allow-Origin"] == "http://localhost:1420"
    assert "Access-Control-Allow-Origin" not in other.headers
