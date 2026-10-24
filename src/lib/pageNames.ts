// Display names for routes, used by "Add to Folder" and to tell the chat
// assistant which tools the user has pinned.
export const pageNames: Record<string, string> = {
  "/": "Clinic Overview",
  "/patients": "Patients",
  "/chat": "Ask GAIA",
  "/models": "Model Registry",
  "/history": "Analysis History",
  "/settings": "Settings",
  "/dashboard/general/treatment": "Treatment Recommendations",
  "/dashboard/general/blood-analysis": "Blood Analysis",
  "/dashboard/cardiology/ecg-ai": "ECG Monitor",
  "/dashboard/cardiology/risk-prediction": "Heart Disease Risk",
  "/dashboard/pulmonology/chest-xray": "Chest X-ray Pneumonia Screen",
  "/dashboard/neurology/eeg-ai": "EEG Monitor",
  "/dashboard/neurology/scan-analyzer": "Brain MRI Tumour Classifier",
  "/dashboard/neurology/ai-cognition": "Cognitive Assessment",
  "/dashboard/neurology/stroke-risk": "Stroke Risk",
  "/dashboard/radiology/breast-ultrasound": "Breast Ultrasound Classifier",
  "/dashboard/pathology/cell-classification": "Blood Cell Classifier",
  "/dashboard/pathology/report-summary": "Pathology Report Summarizer",
  "/dashboard/pathology/specimen": "Specimen Tracker",
  "/dashboard/dermatology/skin-lesion": "Skin Lesion Classifier",
}

export const pageName = (path: string) => pageNames[path] ?? path
