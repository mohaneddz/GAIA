import { apiUrl, requestJson, sendJson } from "@/lib/api"

export type ClassMetrics = { name: string; precision: number; recall: number; f1: number; support: number }

export type ModelCard = {
  id: string
  title: string
  modality: string
  architecture: string
  parameters: number
  onnxBytes: number
  input: { size: number }
  classes: { name: string; description: string }[]
  dataset: {
    name: string
    url: string
    license: string
    citation: string
    splits: { train: number; val: number; test: number }
  }
  training: {
    epochs: number
    bestValBalancedAccuracy: number
    seconds: number
    device: string
    trainedAt: string
    history: { epoch: number; trainLoss: number; valBalancedAccuracy: number }[]
  }
  metrics: {
    accuracy: number
    balancedAccuracy: number
    macroF1: number
    auc: number
    perClass: ClassMetrics[]
    confusionMatrix: number[][]
  }
  samples: { file: string; label: number }[]
}

export type Prediction = {
  model: string
  predicted: number
  probabilities: { name: string; probability: number }[]
  heatmap: string
}

export const fetchModels = () => requestJson<ModelCard[]>("/api/models")

export const fetchModel = (id: string) => requestJson<ModelCard>(`/api/models/${id}`)

export const sampleUrl = (id: string, file: string) => `${apiUrl}/api/models/${id}/samples/${file}`

export function predictFile(id: string, file: File) {
  const form = new FormData()
  form.append("image", file)
  return requestJson<Prediction>(`/api/models/${id}/predict`, { method: "POST", body: form })
}

export const predictSample = (id: string, sample: string) => sendJson<Prediction>(`/api/models/${id}/predict`, "POST", { sample })

export const percent = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`

// Where each model's tool lives in the dashboard.
export const toolRoutes: Record<string, string> = {
  pneumonia: "/dashboard/pulmonology/chest-xray",
  brain: "/dashboard/neurology/scan-analyzer",
  breast: "/dashboard/radiology/breast-ultrasound",
  blood: "/dashboard/pathology/cell-classification",
  skin: "/dashboard/dermatology/skin-lesion",
}
