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
        "Gliomas are the weak spot. Validation accuracy is 99%, but on the dataset's separately collected test folder only about a third of gliomas are called correctly, and most of the rest come out as meningioma. Do not use a negative glioma call to rule one out.",
      ]}
    >
      <ClassifierWorkbench modelId="brain" />
    </ToolPage>
  )
}
