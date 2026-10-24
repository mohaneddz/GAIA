import ToolPage from "@/components/layout/ToolPage"
import RiskCalculator from "@/components/risk/RiskCalculator"

export default function RiskPrediction() {
  return (
    <ToolPage
      title="Heart Disease Risk"
      subtitle="Probability of coronary artery disease from history, vitals and an exercise ECG"
      useFor={[
        "Estimating pre-test probability of coronary disease for a patient referred with chest pain who has had an exercise test.",
        "Seeing which findings drive the estimate: ST slope, chest pain type and exercise angina usually dominate.",
      ]}
      limits={[
        "Built from five historical cohorts (Cleveland, Hungary, Switzerland, Long Beach, Statlog) referred for angiography, so baseline risk is far higher than in the general population.",
        "Needs exercise-test results; it cannot score a patient who has not had one.",
        "Not a substitute for validated tools such as the ESC pre-test probability tables.",
      ]}
    >
      <RiskCalculator modelId="heart" />
    </ToolPage>
  )
}
