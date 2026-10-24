import pytest

import risk
import store
from app import app
from vision import REGISTRY

DOT_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(store, "DB_PATH", tmp_path / "gaia.sqlite3")
    return app.test_client()


def add_patient(client, **fields):
    response = client.post("/api/patients", json={"name": "Amina Haddad", "mrn": "MRN-001", "birthYear": 1970, "sex": "F", **fields})
    assert response.status_code == 201
    return response.get_json()


def vision_result(model_id, predicted):
    classes = REGISTRY[model_id].card["classes"]
    probabilities = [{"name": c["name"], "probability": 0.9 if i == predicted else 0.1 / (len(classes) - 1)} for i, c in enumerate(classes)]
    return {"predicted": predicted, "probabilities": probabilities, "heatmap": "data:image/png;base64,AAAA"}


def risk_inputs(model_id, **changes):
    return {**{f["key"]: f["default"] for f in risk.CARDS[model_id]["features"]}, **changes}


def test_patient_lifecycle(client):
    patient = add_patient(client)
    assert patient["analysisCount"] == 0

    updated = client.patch(f"/api/patients/{patient['id']}", json={"notes": "Penicillin allergy"}).get_json()
    assert updated["notes"] == "Penicillin allergy"
    assert updated["name"] == "Amina Haddad"

    assert [p["id"] for p in client.get("/api/patients?q=amina").get_json()] == [patient["id"]]
    assert client.get("/api/patients?q=MRN-001").get_json()[0]["id"] == patient["id"]
    assert client.get("/api/patients?q=nobody").get_json() == []

    assert client.delete(f"/api/patients/{patient['id']}").status_code == 204
    assert client.get(f"/api/patients/{patient['id']}").status_code == 404


@pytest.mark.parametrize("body, message", [
    ({"name": ""}, "name"),
    ({"name": "A", "birthYear": 1800}, "birthYear"),
    ({"name": "A", "sex": "male"}, "sex"),
    ({"name": "A", "mrn": 42}, "mrn"),
])
def test_invalid_patients_are_rejected(client, body, message):
    response = client.post("/api/patients", json=body)
    assert response.status_code == 400
    assert message in response.get_json()["error"]


def test_duplicate_mrn_is_rejected(client):
    add_patient(client)
    response = client.post("/api/patients", json={"name": "Someone Else", "mrn": "MRN-001"})
    assert response.status_code == 400


@pytest.mark.skipif("pneumonia" not in REGISTRY, reason="pneumonia model not trained")
def test_vision_result_is_summarised_and_flagged_by_the_server(client):
    patient = add_patient(client)
    response = client.post("/api/analyses", json={
        "kind": "vision", "model": "pneumonia", "patientId": patient["id"],
        "result": vision_result("pneumonia", 1), "thumbnail": DOT_PNG, "note": "Cough for 5 days",
    })
    saved = response.get_json()
    assert response.status_code == 201
    assert saved["summary"] == "Pneumonia, 90%"
    assert saved["flagged"] is True
    assert "heatmap" not in saved["result"]
    assert saved["patientName"] == "Amina Haddad"

    normal = client.post("/api/analyses", json={"kind": "vision", "model": "pneumonia", "result": vision_result("pneumonia", 0)}).get_json()
    assert normal["flagged"] is False
    assert normal["patientId"] is None


def test_risk_is_rescored_from_inputs(client):
    inputs = risk_inputs("heart")
    expected = risk.predict("heart", inputs)
    saved = client.post("/api/analyses", json={"kind": "risk", "model": "heart", "inputs": inputs, "probability": 0.01}).get_json()
    assert saved["result"]["probability"] == expected["probability"]
    assert saved["flagged"] == expected["aboveThreshold"]
    assert saved["result"]["inputs"] == inputs


@pytest.mark.parametrize("body", [
    {"kind": "xray", "model": "pneumonia"},
    {"kind": "vision", "model": "nope", "result": {}},
    {"kind": "vision", "model": "pneumonia", "result": {"predicted": 7, "probabilities": []}},
    {"kind": "risk", "model": "heart", "inputs": {"age": 50}},
    {"kind": "vision", "model": "pneumonia", "result": None, "thumbnail": "javascript:alert(1)"},
])
def test_bad_analyses_are_rejected(client, body):
    assert client.post("/api/analyses", json=body).status_code in (400, 404)


def test_analysis_needs_an_existing_patient(client):
    response = client.post("/api/analyses", json={"kind": "risk", "model": "stroke", "inputs": risk_inputs("stroke"), "patientId": 999})
    assert response.status_code == 404


def test_history_filters_and_stats(client):
    patient = add_patient(client)
    for age in (40, 75):
        client.post("/api/analyses", json={"kind": "risk", "model": "stroke", "inputs": risk_inputs("stroke", age=age), "patientId": patient["id"]})
    client.post("/api/analyses", json={"kind": "risk", "model": "heart", "inputs": risk_inputs("heart")})

    everything = client.get("/api/analyses").get_json()
    assert len(everything) == 3
    assert "result" not in everything[0]
    assert len(client.get(f"/api/analyses?patient={patient['id']}").get_json()) == 2
    assert len(client.get("/api/analyses?model=heart").get_json()) == 1
    flagged = client.get("/api/analyses?flagged=1").get_json()
    assert all(a["flagged"] for a in flagged)

    stats = client.get("/api/stats").get_json()
    assert stats["patients"] == 1
    assert stats["analyses"] == 3
    assert stats["flagged"] == len(flagged)
    assert sum(day["count"] for day in stats["perDay"]) == 3
    assert {m["model"] for m in stats["byModel"]} == {"stroke", "heart"}

    listed = client.get("/api/patients").get_json()[0]
    assert listed["analysisCount"] == 2


def test_deleting_a_patient_keeps_their_analyses_unlinked(client):
    patient = add_patient(client)
    saved = client.post("/api/analyses", json={"kind": "risk", "model": "heart", "inputs": risk_inputs("heart"), "patientId": patient["id"]}).get_json()
    client.delete(f"/api/patients/{patient['id']}")
    assert client.get(f"/api/analyses/{saved['id']}").get_json()["patientId"] is None


def test_analysis_delete_and_missing(client):
    saved = client.post("/api/analyses", json={"kind": "risk", "model": "heart", "inputs": risk_inputs("heart")}).get_json()
    assert client.delete(f"/api/analyses/{saved['id']}").status_code == 204
    assert client.delete(f"/api/analyses/{saved['id']}").status_code == 404
    assert client.get("/api/analyses?limit=0").status_code == 400
