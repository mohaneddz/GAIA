import ToolPage from "@/components/layout/ToolPage"
import ClassifierWorkbench from "@/components/vision/ClassifierWorkbench"

export default function ChestXray() {
  return (
    <ToolPage
      title="Chest X-ray Pneumonia Screen"
      subtitle="Normal versus pneumonia on frontal paediatric radiographs"
      useFor={[
        "Second-reader check on frontal chest X-rays from children.",
        "Ordering a reading list so likely pneumonia cases are seen first.",
        "The heatmap shows which lung regions drove the call, which helps catch a model looking at labels or tubes instead of lungs.",
      ]}
      limits={[
        "Trained on children aged 1 to 5 from a single hospital in Guangzhou. Adult films are outside what it has seen.",
        "Does not separate bacterial from viral pneumonia, and does not report effusion, pneumothorax, lines or devices.",
        "Source images are 128 px, so fine interstitial detail is lost before the model sees it.",
      ]}
    >
      <ClassifierWorkbench modelId="pneumonia" />
    </ToolPage>
  )
}
