import math

import pytest

import risk
from app import app


@pytest.fixture
def client():
    return app.test_client()


def defaults(model_id):
    return {f["key"]: f["default"] for f in risk.CARDS[model_id]["features"]}


def log_odds(p):
    return math.log(p / (1 - p))


@pytest.mark.parametrize("model_id", sorted(risk.CARDS))
def test_contributions_add_up_to_the_score(model_id):
    result = risk.predict(model_id, defaults(model_id))
    explained = log_odds(result["referenceProbability"]) + sum(c["logOdds"] for c in result["contributions"])
    assert explained == pytest.approx(log_odds(result["probability"]), abs=0.01)
    assert len(result["contributions"]) == len(risk.CARDS[model_id]["features"])


def test_older_patients_score_higher_for_stroke():
    young, old = defaults("stroke"), defaults("stroke")
    young["age"], old["age"] = 30, 80
    assert risk.predict("stroke", old)["probability"] > risk.predict("stroke", young)["probability"]


def test_angina_and_flat_st_raise_heart_risk():
    low, high = defaults("heart"), defaults("heart")
    low.update(exerciseAngina="N", stSlope="Up")
    high.update(exerciseAngina="Y", stSlope="Flat")
    assert risk.predict("heart", high)["probability"] > risk.predict("heart", low)["probability"]


def test_endpoint_round_trip(client):
    assert {card["id"] for card in client.get("/api/risk").get_json()} == set(risk.CARDS)
    body = client.post("/api/risk/heart/predict", json={"inputs": defaults("heart")}).get_json()
    assert 0 < body["probability"] < 1


@pytest.mark.parametrize("change, message", [
    ({"age": None}, "required"),
    ({"age": "sixty"}, "number"),
    ({"age": 140}, "between"),
    ({"sex": "X"}, "unknown option"),
])
def test_bad_inputs_are_rejected(client, change, message):
    inputs = {**defaults("heart"), **change}
    response = client.post("/api/risk/heart/predict", json={"inputs": inputs})
    assert response.status_code == 400
    assert message in response.get_json()["error"]


def test_unknown_risk_model_is_404(client):
    assert client.post("/api/risk/nope/predict", json={"inputs": {}}).status_code == 404
