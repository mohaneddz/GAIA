import ClassifierPage from "@/components/vision/ClassifierPage"

export default function BreastUltrasound() {
  return (
    <ClassifierPage
      modelId="breast"
      title="Breast Ultrasound Classifier"
      subtitle="Malignant versus normal or benign on a single ultrasound frame"
      useFor={[
        "Flagging ultrasound frames whose lesion looks malignant, so they get a second look.",
        "Checking the heatmap against the lesion you can see, to judge whether the model's reasoning is plausible.",
      ]}
      limits={[
        "The source dataset has 780 images from one centre, so the test set is small and its metrics are noisy.",
        "Normal and benign are merged into one class, and no BI-RADS category is produced.",
        "Biopsy, not this model, decides malignancy.",
      ]}
    />
  )
}
