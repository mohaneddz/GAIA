import { requestJson, sendJson } from "@/lib/api"

export type RiskFeature =
  | { key: string; label: string; type: "number"; unit: string; min: number; max: number; default: number; step: number }
  | { key: string; label: string; type: "category"; options: { value: string; label: string }[]; default: string }

export type RiskCard = {
  id: string
  title: string
  outcome: string
  prevalence: number
  dataset: { name: string; url: string; license: string; citation: string }
  features: RiskFeature[]
  model: { type: string }
  splits: { train: number; test: number }
  metrics: {
    auc: number
    brier: number
    threshold: number
    sensitivity: number
    specificity: number
    calibration: { predicted: number; observed: number }[]
  }
  trainedAt: string
}

export type RiskResult = {
  probability: number
  referenceProbability: number
  aboveThreshold: boolean
  contributions: { feature: string; label: string; value: string; logOdds: number }[]
}

export type RiskInputs = Record<string, number | string>

export const fetchRiskModels = () => requestJson<RiskCard[]>("/api/risk")

export const fetchRiskModel = (id: string) => requestJson<RiskCard>(`/api/risk/${id}`)

export const scoreRisk = (id: string, inputs: RiskInputs, signal?: AbortSignal) =>
  sendJson<RiskResult>(`/api/risk/${id}/predict`, "POST", { inputs }, signal)

export const riskRoutes: Record<string, string> = {
  heart: "/dashboard/cardiology/risk-prediction",
  stroke: "/dashboard/neurology/stroke-risk",
}
