import ToolPage from "@/components/layout/ToolPage"
import ClassifierWorkbench from "@/components/vision/ClassifierWorkbench"

export default function SkinLesion() {
  return (
    <ToolPage
      title="Skin Lesion Classifier"
      subtitle="Seven diagnostic categories from a dermatoscopic image"
      useFor={[
        "Triage of dermatoscopic images into the seven HAM10000 categories.",
        "Highlighting lesions where melanoma or basal cell carcinoma has meaningful probability, even when it is not the top class.",
      ]}
      limits={[
        "Dermatoscopy only. Phone photos and clinical close-ups are a different kind of image.",
        "About two thirds of the training images are benign nevi, and lighter skin types dominate HAM10000.",
        "Check melanoma recall in the model card before trusting a negative result. Source images are 64 px.",
      ]}
    >
      <ClassifierWorkbench modelId="skin" />
    </ToolPage>
  )
}
