import { signalApiUrl } from "@/lib/signalApi"

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

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? `Server returned ${response.status}`)
  }
  return response.json()
}

export const fetchRiskModels = () => fetch(`${signalApiUrl}/api/risk`).then((r) => readJson<RiskCard[]>(r))

export const fetchRiskModel = (id: string) => fetch(`${signalApiUrl}/api/risk/${id}`).then((r) => readJson<RiskCard>(r))

export const scoreRisk = (id: string, inputs: RiskInputs, signal?: AbortSignal) =>
  fetch(`${signalApiUrl}/api/risk/${id}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputs }),
    signal,
  }).then((r) => readJson<RiskResult>(r))

export const riskRoutes: Record<string, string> = {
  heart: "/dashboard/cardiology/risk-prediction",
  stroke: "/dashboard/neurology/stroke-risk",
}
