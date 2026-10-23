import ClassifierPage from "@/components/vision/ClassifierPage"

export default function CellClassification() {
  return (
    <ClassifierPage
      modelId="blood"
      title="Blood Cell Classifier"
      subtitle="Eight peripheral blood cell types from a single-cell smear crop"
      useFor={[
        "Labelling single-cell crops from a stained peripheral smear, such as analyser image galleries.",
        "Spot-checking a manual differential: immature granulocytes and erythroblasts are worth a second look in adults.",
      ]}
      limits={[
        "Expects one centred cell per image. A whole smear field will give a meaningless answer.",
        "Trained on donors without infection or haematological disease, so it has never seen blasts or atypical lymphocytes.",
        "Source images are 28 px, so nuclear chromatin detail is mostly gone.",
      ]}
    />
  )
}
