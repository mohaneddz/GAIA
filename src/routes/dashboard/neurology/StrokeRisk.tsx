import ToolPage from "@/components/layout/ToolPage"
import RiskCalculator from "@/components/risk/RiskCalculator"

export default function StrokeRisk() {
  return (
    <ToolPage
      title="Stroke Risk"
      subtitle="Probability of a prior stroke from age, comorbidities, glucose, BMI and smoking"
      useFor={[
        "A quick look at how age, hypertension, heart disease and glucose combine for an individual patient.",
        "Teaching how a small number of risk factors shifts the odds in a low-prevalence outcome.",
      ]}
      limits={[
        "The dataset records whether a stroke has already happened, not future risk; read the output as association, not a 10-year prediction.",
        "Only 5% of people in the data had a stroke, so most scores are low and sensitivity at the threshold is modest.",
        "Atrial fibrillation, cholesterol and prior TIA are not in the data. For clinical use, prefer CHA₂DS₂-VASc or QRISK.",
      ]}
    >
      <RiskCalculator modelId="stroke" />
    </ToolPage>
  )
}
