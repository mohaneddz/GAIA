"""What each GAIA vision model is trained on and how it is described in the UI."""

from dataclasses import dataclass, field

MEDMNIST_URL = "https://zenodo.org/records/10519652/files/{name}.npz?download=1"
MEDMNIST_CITATION = "Yang et al., MedMNIST v2, Scientific Data 2023"


@dataclass
class ClassInfo:
    name: str
    description: str
    # Saved results with this class predicted are flagged for review.
    attention: bool = False


@dataclass
class VisionSpec:
    id: str
    title: str
    modality: str
    source: str  # "medmnist" or "folders"
    dataset_name: str
    dataset_url: str
    dataset_license: str
    citation: str
    classes: list[ClassInfo]
    input_size: int
    # MedMNIST file stem, or the Kaggle dataset folder under the data dir.
    location: str
    # Folder datasets list one directory per class, in class order.
    folder_names: list[str] = field(default_factory=list)
    hflip: bool = True
    epochs: int = 25


SPECS = {
    "pneumonia": VisionSpec(
        id="pneumonia",
        title="Chest X-ray pneumonia screen",
        modality="Chest X-ray (paediatric, frontal)",
        source="medmnist",
        dataset_name="PneumoniaMNIST (128 px)",
        dataset_url="https://medmnist.com/",
        dataset_license="CC BY 4.0",
        citation=MEDMNIST_CITATION + "; Kermany et al., Cell 2018",
        classes=[
            ClassInfo("Normal", "No radiographic sign of pneumonia."),
            ClassInfo("Pneumonia", "Opacities consistent with bacterial or viral pneumonia.", attention=True),
        ],
        input_size=224,
        location="pneumoniamnist_128",
    ),
    "blood": VisionSpec(
        id="blood",
        title="Blood cell classifier",
        modality="Peripheral blood smear, single cell",
        source="medmnist",
        dataset_name="BloodMNIST (28 px)",
        dataset_url="https://medmnist.com/",
        dataset_license="CC BY 4.0",
        citation=MEDMNIST_CITATION + "; Acevedo et al., Data in Brief 2020",
        classes=[
            ClassInfo("Basophil", "Granulocyte with dark purple granules; under 1% of white cells."),
            ClassInfo("Eosinophil", "Granulocyte with orange-red granules; raised in allergy and parasitic infection."),
            ClassInfo("Erythroblast", "Nucleated red cell precursor; abnormal in adult peripheral blood.", attention=True),
            ClassInfo("Immature granulocyte", "Promyelocyte, myelocyte or metamyelocyte; suggests a left shift.", attention=True),
            ClassInfo("Lymphocyte", "Small round cell with a large nucleus; adaptive immunity."),
            ClassInfo("Monocyte", "Largest white cell, kidney-shaped nucleus; becomes a macrophage."),
            ClassInfo("Neutrophil", "Segmented nucleus; the main responder to bacterial infection."),
            ClassInfo("Platelet", "Anucleate fragment involved in clotting."),
        ],
        input_size=128,
        location="bloodmnist",
    ),
    "skin": VisionSpec(
        id="skin",
        title="Skin lesion classifier",
        modality="Dermatoscopy",
        source="medmnist",
        dataset_name="DermaMNIST (64 px, from HAM10000)",
        dataset_url="https://medmnist.com/",
        dataset_license="CC BY-NC 4.0",
        citation=MEDMNIST_CITATION + "; Tschandl et al., Scientific Data 2018",
        classes=[
            ClassInfo("Actinic keratosis", "Sun-damage lesion, including intraepithelial carcinoma; can progress to SCC.", attention=True),
            ClassInfo("Basal cell carcinoma", "The most common skin cancer; locally invasive, rarely metastasises.", attention=True),
            ClassInfo("Benign keratosis", "Seborrhoeic keratosis, solar lentigo or lichen planus-like keratosis."),
            ClassInfo("Dermatofibroma", "Benign fibrous nodule, often on the legs."),
            ClassInfo("Melanoma", "Malignant melanocytic tumour; needs urgent referral.", attention=True),
            ClassInfo("Melanocytic nevus", "Common benign mole."),
            ClassInfo("Vascular lesion", "Angioma, angiokeratoma, pyogenic granuloma or haemorrhage."),
        ],
        input_size=192,
        location="dermamnist_64",
    ),
    "breast": VisionSpec(
        id="breast",
        title="Breast ultrasound classifier",
        modality="Breast ultrasound",
        source="medmnist",
        dataset_name="BreastMNIST (128 px)",
        dataset_url="https://medmnist.com/",
        dataset_license="CC BY 4.0",
        citation=MEDMNIST_CITATION + "; Al-Dhabyani et al., Data in Brief 2020",
        classes=[
            ClassInfo("Malignant", "Features suspicious for carcinoma; biopsy is indicated.", attention=True),
            ClassInfo("Normal or benign", "No lesion, or a lesion with benign features such as a cyst or fibroadenoma."),
        ],
        input_size=224,
        location="breastmnist_128",
        epochs=40,
    ),
    "brain": VisionSpec(
        id="brain",
        title="Brain MRI tumour classifier",
        modality="Brain MRI (T1 contrast, mixed planes)",
        source="folders",
        dataset_name="Brain Tumor Classification (MRI)",
        dataset_url="https://www.kaggle.com/datasets/sartajbhuvaji/brain-tumor-classification-mri",
        dataset_license="MIT",
        citation="Bhuvaji et al., Kaggle 2020",
        classes=[
            ClassInfo("Glioma", "Tumour of glial cells, usually intra-axial within the brain parenchyma.", attention=True),
            ClassInfo("Meningioma", "Extra-axial tumour arising from the meninges; mostly benign.", attention=True),
            ClassInfo("No tumour", "No tumour visible on this slice."),
            ClassInfo("Pituitary tumour", "Sellar mass, usually a pituitary adenoma.", attention=True),
        ],
        input_size=224,
        location="brain_tumor",
        folder_names=["glioma_tumor", "meningioma_tumor", "no_tumor", "pituitary_tumor"],
        hflip=True,
    ),
}
