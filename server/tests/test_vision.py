import io

import numpy as np
import pytest
from PIL import Image

from app import app
from vision import REGISTRY

pytestmark = pytest.mark.skipif(not REGISTRY, reason="no trained models in server/models")


@pytest.fixture
def client():
    return app.test_client()


@pytest.fixture(params=sorted(REGISTRY))
def model_id(request):
    return request.param


def png_bytes(size=(96, 96)):
    pixels = np.random.default_rng(0).integers(0, 255, (*size, 3), dtype=np.uint8)
    buffer = io.BytesIO()
    Image.fromarray(pixels).save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


def test_registry_lists_cards(client):
    cards = client.get("/api/models").get_json()
    assert {card["id"] for card in cards} == set(REGISTRY)
    for card in cards:
        assert len(card["metrics"]["confusionMatrix"]) == len(card["classes"])
        assert card["samples"]


def test_sample_prediction(client, model_id):
    card = REGISTRY[model_id].card
    sample = card["samples"][0]["file"]
    body = client.post(f"/api/models/{model_id}/predict", json={"sample": sample}).get_json()

    assert len(body["probabilities"]) == len(card["classes"])
    assert sum(p["probability"] for p in body["probabilities"]) == pytest.approx(1, abs=1e-3)
    assert body["predicted"] == max(range(len(card["classes"])), key=lambda i: body["probabilities"][i]["probability"])
    assert body["heatmap"].startswith("data:image/png;base64,")


def test_upload_prediction(client, model_id):
    response = client.post(f"/api/models/{model_id}/predict", data={"image": (png_bytes(), "scan.png")})
    assert response.status_code == 200


def test_sample_images_are_served(client, model_id):
    sample = REGISTRY[model_id].card["samples"][0]["file"]
    response = client.get(f"/api/models/{model_id}/samples/{sample}")
    assert response.status_code == 200
    assert response.mimetype == "image/png"


@pytest.mark.parametrize("path", [
    "/api/models/nope",
    "/api/models/nope/samples/0_1.png",
])
def test_unknown_model_is_404(client, path):
    assert client.get(path).status_code == 404


def test_only_listed_samples_are_served(client, model_id):
    assert client.get(f"/api/models/{model_id}/samples/..%2F..%2Fapp.py").status_code == 404
    response = client.post(f"/api/models/{model_id}/predict", json={"sample": "../../app.py"})
    assert response.status_code == 404


def test_non_image_upload_is_rejected(client, model_id):
    response = client.post(f"/api/models/{model_id}/predict", data={"image": (io.BytesIO(b"not an image"), "notes.txt")})
    assert response.status_code == 400


def test_missing_input_is_rejected(client, model_id):
    assert client.post(f"/api/models/{model_id}/predict", json={}).status_code == 400
