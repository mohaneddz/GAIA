"""Load each training set as uint8 RGB arrays: (images N×H×W×3, labels N)."""

import os
from pathlib import Path

import numpy as np
from PIL import Image

from .specs import VisionSpec

DATA_DIR = Path(os.environ.get("GAIA_DATA_DIR", Path(__file__).resolve().parent / "data"))
FOLDER_IMAGE_SIZE = 256


def to_rgb(images):
    if images.ndim == 3:
        images = np.repeat(images[..., None], 3, axis=-1)
    return images


def load_medmnist(spec: VisionSpec):
    path = DATA_DIR / f"{spec.location}.npz"
    if not path.exists():
        raise FileNotFoundError(f"{path} is missing; download it from MedMNIST on Zenodo first")
    data = np.load(path)
    return {
        split: (to_rgb(data[f"{split}_images"]), data[f"{split}_labels"].reshape(-1).astype(np.int64))
        for split in ("train", "val", "test")
    }


def _read_folder(root: Path, folder_names):
    images, labels = [], []
    for label, name in enumerate(folder_names):
        for path in sorted((root / name).iterdir()):
            with Image.open(path) as image:
                image = image.convert("RGB").resize((FOLDER_IMAGE_SIZE, FOLDER_IMAGE_SIZE), Image.BILINEAR)
                images.append(np.asarray(image))
            labels.append(label)
    return np.stack(images), np.array(labels, dtype=np.int64)


def load_folders(spec: VisionSpec, val_fraction=0.1, seed=0):
    root = DATA_DIR / spec.location
    train_images, train_labels = _read_folder(root / "Training", spec.folder_names)
    test_images, test_labels = _read_folder(root / "Testing", spec.folder_names)

    # Stratified validation split carved out of the training folder.
    rng = np.random.default_rng(seed)
    val_mask = np.zeros(len(train_labels), dtype=bool)
    for label in np.unique(train_labels):
        members = np.flatnonzero(train_labels == label)
        picked = rng.choice(members, size=max(1, int(len(members) * val_fraction)), replace=False)
        val_mask[picked] = True

    return {
        "train": (train_images[~val_mask], train_labels[~val_mask]),
        "val": (train_images[val_mask], train_labels[val_mask]),
        "test": (test_images, test_labels),
    }


def load(spec: VisionSpec):
    if spec.source == "medmnist":
        return load_medmnist(spec)
    if spec.source == "folders":
        return load_folders(spec)
    raise ValueError(f"unknown source {spec.source}")
