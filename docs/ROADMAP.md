# GAIA roadmap

GAIA started as a 6-hour hackathon UI: about 40 routed pages, most of them hardcoded "AI results" or empty stubs. The goal now is a clinical imaging workstation where every tool on screen is backed by a model or computation that actually runs, and nothing appears twice.

## Principles

- **One tool, one page.** Each model gets exactly one home in the specialty that owns it. Pages that duplicated each other are merged or removed.
- **Shared building blocks.** All image classifiers use one workbench component and one server endpoint. Each page only supplies a model id and its clinical framing.
- **Small, honest models.** Each model is trained here on a public dataset of 100 MB or less and exported to ONNX at a few MB. The server only needs `onnxruntime`. Test-set metrics are shown next to every prediction, and the UI never invents a number.
- **Explainable by default.** Classifiers use a global-average-pool and linear head, so the server can return an exact class activation map (CAM) with every prediction.

## Information architecture

| Section | Tool | Backed by |
| --- | --- | --- |
| Overview | Home, Model registry | Server stats, model cards |
| Patients | Patient records, analysis history | Server SQLite |
| Cardiology | ECG monitor | Signal generator (done) |
| | Heart failure risk | Tabular model, heart-failure-prediction (918 patients) |
| Pulmonology | Chest X-ray pneumonia screen | CNN, PneumoniaMNIST 128 px |
| Neurology | EEG monitor | Signal generator (done) |
| | Brain MRI tumour classifier | CNN, Brain Tumor Classification (MRI), 4 classes |
| | Stroke risk | Tabular model, stroke-prediction-dataset |
| Radiology | Breast ultrasound classifier | CNN, BreastMNIST 128 px |
| Pathology | Blood cell classifier | CNN, BloodMNIST, 8 cell types |
| | Report summariser | Groq, via `/api/chat` infrastructure |
| Dermatology | Skin lesion classifier | CNN, DermaMNIST 64 px (HAM10000), 7 classes |
| Assistant | Chat | Groq (done) |

Removed as duplicates or empty: Cardiology "Imaging Utility" (the same file as Pulmonology's), Pulmonology "Heart Risk Prediction" (a cardiology page), and the empty Diagnosis, Symptom AI and Monitoring stubs. Their purpose is covered by Chat and analysis history.

## Milestones

1. **Vision models** (done). Training pipeline, five CNNs, `/api/models` and `/api/models/<id>/predict` with CAM, the shared workbench, the five classifier pages, the model registry page, and navigation cleanup.
2. **Risk models** (done). Heart failure and stroke risk, with per-feature contributions from the linear models.
3. **Patients and history** (done). Server-side SQLite for patients and saved analyses, an analysis history page, and Home stats computed from real data.
4. **Reports.** A Groq-written report from a saved analysis, plus the pathology report summariser.
