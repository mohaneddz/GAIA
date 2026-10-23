"""Train one GAIA vision model and export it for the server.

    python -m ml.train pneumonia          (run from server/)

Writes models/<id>.onnx, models/<id>.json (the model card read by the API and
the registry page) and a few test-set sample images under models/samples/<id>/.
"""

import argparse
import json
import time
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path

import math

import numpy as np
import onnxruntime as ort
import torch
import torch.nn.functional as F
from PIL import Image
from sklearn import metrics
from torch import nn

from . import datasets
from .network import CamClassifier, ExportWrapper
from .specs import SPECS, VisionSpec

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]
SAMPLES_PER_CLASS = 2


class GpuBatches:
    """Whole split on the GPU as uint8, augmented per sample inside each batch.

    DataLoader workers on Windows re-pickle the full image array per process,
    which stalls for minutes; these datasets fit in VRAM, so skip them.
    """

    def __init__(self, images, labels, spec: VisionSpec, device, batch_size, train):
        self.images = torch.from_numpy(images).permute(0, 3, 1, 2).contiguous().to(device)
        self.labels = torch.from_numpy(labels).to(device)
        self.spec, self.batch_size, self.train = spec, batch_size, train
        self.mean = torch.tensor(MEAN, device=device).view(1, 3, 1, 1)
        self.std = torch.tensor(STD, device=device).view(1, 3, 1, 1)

    def __len__(self):
        return math.ceil(len(self.labels) / self.batch_size)

    def __iter__(self):
        order = torch.randperm(len(self.labels), device=self.labels.device) if self.train else torch.arange(len(self.labels), device=self.labels.device)
        for start in range(0, len(order), self.batch_size):
            index = order[start:start + self.batch_size]
            batch = prepare(self.images[index], self.spec.input_size)
            if self.train:
                batch = augment(batch, self.spec.hflip)
            yield (batch - self.mean) / self.std, self.labels[index]


def prepare(images_uint8, size):
    """uint8 N×3×H×W to float in [0, 1] at the model's input size."""
    images = images_uint8.float() / 255
    if images.shape[-1] != size:
        images = F.interpolate(images, size=(size, size), mode="bilinear", align_corners=False, antialias=True)
    return images


def augment(images, hflip):
    """Random zoom, rotation, shift, flip, brightness and contrast, per sample."""
    n, device = len(images), images.device
    angle = torch.empty(n, device=device).uniform_(-10, 10).deg2rad()
    scale = torch.empty(n, device=device).uniform_(0.82, 1.0)
    shift = torch.empty(n, 2, device=device).uniform_(-0.06, 0.06)
    flip = torch.where(torch.rand(n, device=device) < 0.5, -1.0, 1.0) if hflip else torch.ones(n, device=device)

    theta = torch.zeros(n, 2, 3, device=device)
    theta[:, 0, 0] = scale * torch.cos(angle) * flip
    theta[:, 0, 1] = -scale * torch.sin(angle)
    theta[:, 1, 0] = scale * torch.sin(angle) * flip
    theta[:, 1, 1] = scale * torch.cos(angle)
    theta[:, :, 2] = shift
    grid = F.affine_grid(theta, images.shape, align_corners=False)
    images = F.grid_sample(images, grid, mode="bilinear", padding_mode="border", align_corners=False)

    contrast = torch.empty(n, 1, 1, 1, device=device).uniform_(0.85, 1.15)
    brightness = torch.empty(n, 1, 1, 1, device=device).uniform_(-0.08, 0.08)
    mean = images.mean(dim=(1, 2, 3), keepdim=True)
    return ((images - mean) * contrast + mean + brightness).clamp(0, 1)


def class_weights(labels, num_classes):
    counts = np.bincount(labels, minlength=num_classes).astype(np.float64)
    # Square-root inverse frequency: helps rare classes without swamping the loss.
    weights = np.sqrt(len(labels) / (num_classes * np.maximum(counts, 1)))
    return torch.tensor(weights, dtype=torch.float32)


@torch.no_grad()
def predict(model, loader, device):
    model.eval()
    probabilities, labels = [], []
    for images, targets in loader:
        with torch.autocast(device.type, enabled=device.type == "cuda"):
            logits = model(images)
        probabilities.append(torch.softmax(logits.float(), dim=1).cpu())
        labels.append(targets.cpu())
    return torch.cat(probabilities).numpy(), torch.cat(labels).numpy()


def evaluate(probabilities, labels, class_names):
    predicted = probabilities.argmax(axis=1)
    if len(class_names) == 2:
        auc = metrics.roc_auc_score(labels, probabilities[:, 1])
    else:
        auc = metrics.roc_auc_score(labels, probabilities, multi_class="ovr", average="macro")
    precision, recall, f1, support = metrics.precision_recall_fscore_support(
        labels, predicted, labels=range(len(class_names)), zero_division=0
    )
    return {
        "accuracy": round(float(metrics.accuracy_score(labels, predicted)), 4),
        "balancedAccuracy": round(float(metrics.balanced_accuracy_score(labels, predicted)), 4),
        "macroF1": round(float(metrics.f1_score(labels, predicted, average="macro")), 4),
        "auc": round(float(auc), 4),
        "perClass": [
            {"name": name, "precision": round(float(p), 4), "recall": round(float(r), 4),
             "f1": round(float(f), 4), "support": int(s)}
            for name, p, r, f, s in zip(class_names, precision, recall, f1, support)
        ],
        "confusionMatrix": metrics.confusion_matrix(labels, predicted, labels=range(len(class_names))).tolist(),
    }


def export_onnx(model, spec, path):
    wrapper = ExportWrapper(model).eval().cpu()
    dummy = torch.zeros(1, 3, spec.input_size, spec.input_size)
    torch.onnx.export(
        wrapper, dummy, path, input_names=["image"], output_names=["logits", "cams"],
        dynamic_axes={"image": {0: "batch"}, "logits": {0: "batch"}, "cams": {0: "batch"}},
        opset_version=17, dynamo=False,
    )


def check_onnx_matches(model, path, images):
    """The exported graph must give the same logits as the PyTorch model."""
    session = ort.InferenceSession(str(path), providers=["CPUExecutionProvider"])
    batch = images[:8]
    onnx_logits = session.run(["logits"], {"image": batch.numpy()})[0]
    with torch.no_grad():
        torch_logits = model.eval().cpu()(batch).numpy()
    gap = float(np.abs(onnx_logits - torch_logits).max())
    if gap > 1e-3:
        raise RuntimeError(f"ONNX export drifted from PyTorch by {gap}")
    return gap


def save_samples(spec, images, labels, seed=0):
    folder = MODELS_DIR / "samples" / spec.id
    folder.mkdir(parents=True, exist_ok=True)
    for old in folder.glob("*.png"):
        old.unlink()
    rng = np.random.default_rng(seed)
    samples = []
    for label in range(len(spec.classes)):
        members = np.flatnonzero(labels == label)
        for index in rng.choice(members, size=min(SAMPLES_PER_CLASS, len(members)), replace=False):
            name = f"{label}_{index}.png"
            Image.fromarray(images[index]).save(folder / name, optimize=True)
            samples.append({"file": name, "label": label})
    return samples


def train(spec: VisionSpec, batch_size=64, lr=1e-3):
    torch.manual_seed(0)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    splits = datasets.load(spec)
    class_names = [c.name for c in spec.classes]
    num_classes = len(class_names)

    loader = lambda split, train: GpuBatches(*splits[split], spec, device, batch_size, train)
    train_loader, val_loader, test_loader = loader("train", True), loader("val", False), loader("test", False)

    model = CamClassifier(num_classes).to(device)
    criterion = nn.CrossEntropyLoss(weight=class_weights(splits["train"][1], num_classes).to(device), label_smoothing=0.05)
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.OneCycleLR(optimizer, max_lr=lr, total_steps=spec.epochs * len(train_loader))
    scaler = torch.amp.GradScaler(enabled=device.type == "cuda")

    history, best_score, best_state = [], -1.0, None
    started = time.time()
    for epoch in range(spec.epochs):
        model.train()
        running = 0.0
        for images, targets in train_loader:
            optimizer.zero_grad(set_to_none=True)
            with torch.autocast(device.type, enabled=device.type == "cuda"):
                loss = criterion(model(images), targets)
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            scheduler.step()
            running += loss.item() * len(targets)

        probabilities, labels = predict(model, val_loader, device)
        val_score = metrics.balanced_accuracy_score(labels, probabilities.argmax(axis=1))
        train_loss = running / len(splits["train"][1])
        history.append({"epoch": epoch + 1, "trainLoss": round(train_loss, 4), "valBalancedAccuracy": round(float(val_score), 4)})
        print(f"[{spec.id}] epoch {epoch + 1:2d}/{spec.epochs}  loss {train_loss:.4f}  val bal-acc {val_score:.4f}", flush=True)
        if val_score > best_score:
            best_score = val_score
            best_state = {k: v.detach().clone() for k, v in model.state_dict().items()}

    model.load_state_dict(best_state)
    test_metrics = evaluate(*predict(model, test_loader, device), class_names)
    print(f"[{spec.id}] test {json.dumps({k: v for k, v in test_metrics.items() if not isinstance(v, list)})}", flush=True)

    MODELS_DIR.mkdir(exist_ok=True)
    onnx_path = MODELS_DIR / f"{spec.id}.onnx"
    export_onnx(model, spec, onnx_path)
    check_batch = (prepare(torch.from_numpy(splits["test"][0][:8]).permute(0, 3, 1, 2), spec.input_size) - torch.tensor(MEAN).view(1, 3, 1, 1)) / torch.tensor(STD).view(1, 3, 1, 1)
    drift = check_onnx_matches(model, onnx_path, check_batch)

    card = {
        "id": spec.id,
        "title": spec.title,
        "modality": spec.modality,
        "architecture": "MobileNetV3-Small (ImageNet-pretrained) + global-average-pool linear head",
        "parameters": sum(p.numel() for p in model.parameters()),
        "onnxBytes": onnx_path.stat().st_size,
        "input": {"size": spec.input_size, "mean": MEAN, "std": STD},
        "classes": [asdict(c) for c in spec.classes],
        "dataset": {
            "name": spec.dataset_name, "url": spec.dataset_url, "license": spec.dataset_license,
            "citation": spec.citation,
            "splits": {split: int(len(labels)) for split, (_, labels) in splits.items()},
        },
        "training": {
            "epochs": spec.epochs, "bestValBalancedAccuracy": round(float(best_score), 4),
            "seconds": round(time.time() - started), "device": torch.cuda.get_device_name(0) if device.type == "cuda" else "cpu",
            "onnxMaxLogitDrift": drift, "history": history,
            "trainedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        },
        "metrics": test_metrics,
        "samples": save_samples(spec, *splits["test"]),
    }
    (MODELS_DIR / f"{spec.id}.json").write_text(json.dumps(card, indent=2))
    print(f"[{spec.id}] wrote {onnx_path.name} ({card['onnxBytes'] / 1e6:.1f} MB)", flush=True)
    return card


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("models", nargs="+", choices=[*SPECS, "all"])
    parser.add_argument("--epochs", type=int)
    args = parser.parse_args()
    for model_id in SPECS if "all" in args.models else args.models:
        spec = SPECS[model_id]
        if args.epochs:
            spec.epochs = args.epochs
        train(spec)


if __name__ == "__main__":
    main()
