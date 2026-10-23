import ToolPage from "@/components/layout/ToolPage"
import ClassifierWorkbench from "@/components/vision/ClassifierWorkbench"

export default function ScanAnalyzer() {
  return (
    <ToolPage
      title="Brain MRI Tumour Classifier"
      subtitle="Glioma, meningioma, pituitary tumour or no tumour on a single MRI slice"
      useFor={[
        "Sorting individual contrast-enhanced MRI slices into the three most common primary tumour types.",
        "Teaching: the heatmap shows whether the model attends to the lesion, the sella or the meninges.",
      ]}
      limits={[
        "Works on one 2D slice, not a volume. \"No tumour\" only means none is visible on that slice.",
        "Gives no segmentation, size, grade or enhancement pattern.",
        "The source dataset's test folder was collected differently from its training folder, so test accuracy is lower than validation accuracy. The model card reports the test figures.",
      ]}
    >
      <ClassifierWorkbench modelId="brain" />
    </ToolPage>
  )
}
