import pytest

import chat
from app import app


@pytest.fixture
def client():
    return app.test_client()


@pytest.fixture
def groq(monkeypatch):
    """Stub the Groq call and record what would have been sent."""
    sent = {}

    def fake_post(url, payload, api_key):
        sent.update(url=url, payload=payload, api_key=api_key)
        return {"choices": [{"message": {"content": "## Answer\nOK"}}]}

    monkeypatch.setenv("GROQ_API_KEY", "test-key")
    monkeypatch.setattr(chat, "post_json", fake_post)
    return sent


def ask(client, **body):
    body.setdefault("messages", [{"role": "user", "content": "How to read an ECG?"}])
    return client.post("/api/chat", json=body)


def test_reply_comes_from_groq(client, groq):
    response = ask(client)
    assert response.status_code == 200
    assert response.get_json() == {"reply": "## Answer\nOK"}
    assert groq["api_key"] == "test-key"
    assert groq["payload"]["messages"][0]["role"] == "system"
    assert groq["payload"]["messages"][-1]["content"] == "How to read an ECG?"


def test_added_features_go_into_the_system_prompt(client, groq):
    ask(client, addedFeatures=["ECG Interpretation (AI)"])
    assert "ECG Interpretation (AI)" in groq["payload"]["messages"][0]["content"]


def test_history_is_capped(client, groq):
    turns = [{"role": "user" if i % 2 == 0 else "assistant", "content": str(i)} for i in range(31)]
    ask(client, messages=turns)
    assert len(groq["payload"]["messages"]) == chat.HISTORY_LIMIT + 1


def test_missing_key_returns_503(client, monkeypatch):
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    response = ask(client)
    assert response.status_code == 503
    assert "GROQ_API_KEY" in response.get_json()["error"]
    assert client.get("/api/health").get_json()["chat"] is False


@pytest.mark.parametrize("body", [
    {},
    {"messages": []},
    {"messages": [{"role": "system", "content": "x"}]},
    {"messages": [{"role": "user", "content": 3}]},
    {"messages": [{"role": "assistant", "content": "x"}]},
    {"messages": [{"role": "user", "content": "x"}], "addedFeatures": "ECG"},
])
def test_bad_bodies_are_rejected(client, groq, body):
    assert client.post("/api/chat", json=body).status_code == 400


def test_preflight_allows_json_posts(client):
    response = client.options("/api/chat", headers={"Origin": "http://localhost:1420"})
    assert response.headers["Access-Control-Allow-Headers"] == "Content-Type"
    assert "POST" in response.headers["Access-Control-Allow-Methods"]
