"""Serve the exported vision models: probabilities plus a class activation map."""

import base64
import io
import json
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

MODELS_DIR = Path(__file__).resolve().parent / "models"
SAMPLES_DIR = MODELS_DIR / "samples"
HEATMAP_SIZE = 320

# Inferno anchor colours, low to high activation.
INFERNO = np.array([
    [0, 0, 4], [87, 16, 110], [188, 55, 84], [249, 142, 9], [252, 255, 164],
], dtype=np.float32)


class UnknownModel(KeyError):
    pass


def colorize(values):
    """Map values in [0, 1] (H×W) to RGB with the inferno anchors."""
    position = values * (len(INFERNO) - 1)
    low = np.floor(position).astype(int).clip(0, len(INFERNO) - 2)
    weight = (position - low)[..., None]
    return INFERNO[low] * (1 - weight) + INFERNO[low + 1] * weight


def to_data_url(image: Image.Image):
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode()


class VisionModel:
    def __init__(self, card):
        self.card = card
        self.id = card["id"]
        self.size = card["input"]["size"]
        self.mean = np.array(card["input"]["mean"], dtype=np.float32)
        self.std = np.array(card["input"]["std"], dtype=np.float32)
        self._session = None

    @property
    def session(self):
        if self._session is None:
            self._session = ort.InferenceSession(str(MODELS_DIR / f"{self.id}.onnx"), providers=["CPUExecutionProvider"])
        return self._session

    def predict(self, image: Image.Image):
        rgb = image.convert("RGB").resize((self.size, self.size), Image.BILINEAR)
        pixels = (np.asarray(rgb, dtype=np.float32) / 255 - self.mean) / self.std
        batch = pixels.transpose(2, 0, 1)[None]
        logits, cams = self.session.run(["logits", "cams"], {"image": batch})

        shifted = np.exp(logits[0] - logits[0].max())
        probabilities = shifted / shifted.sum()
        predicted = int(probabilities.argmax())

        return {
            "model": self.id,
            "predicted": predicted,
            "probabilities": [
                {"name": c["name"], "probability": round(float(p), 4)}
                for c, p in zip(self.card["classes"], probabilities)
            ],
            "heatmap": self.heatmap(rgb, cams[0, predicted]),
        }

    def heatmap(self, rgb: Image.Image, cam):
        cam = np.maximum(cam, 0)
        if cam.max() > 0:
            cam = cam / cam.max()
        cam_image = Image.fromarray((cam * 255).astype(np.uint8)).resize((HEATMAP_SIZE, HEATMAP_SIZE), Image.BICUBIC)
        strength = np.asarray(cam_image, dtype=np.float32)[..., None] / 255
        base = np.asarray(rgb.resize((HEATMAP_SIZE, HEATMAP_SIZE), Image.BILINEAR), dtype=np.float32)
        # Weak activations stay see-through so the anatomy underneath is readable.
        alpha = 0.65 * strength
        blended = base * (1 - alpha) + colorize(strength[..., 0]) * alpha
        return to_data_url(Image.fromarray(blended.clip(0, 255).astype(np.uint8)))


def load_registry():
    models = {}
    for path in sorted(MODELS_DIR.glob("*.json")):
        card = json.loads(path.read_text())
        if (MODELS_DIR / f"{card['id']}.onnx").exists():
            models[card["id"]] = VisionModel(card)
    return models


REGISTRY = load_registry()


def get_model(model_id):
    if model_id not in REGISTRY:
        raise UnknownModel(model_id)
    return REGISTRY[model_id]


def sample_path(model_id, file_name):
    get_model(model_id)
    names = {sample["file"] for sample in REGISTRY[model_id].card["samples"]}
    if file_name not in names:
        raise UnknownModel(file_name)
    return SAMPLES_DIR / model_id / file_name
