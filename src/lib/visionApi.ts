import { signalApiUrl } from "@/lib/signalApi"

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

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? `Server returned ${response.status}`)
  }
  return response.json()
}

export const fetchModels = () => fetch(`${signalApiUrl}/api/models`).then((r) => readJson<ModelCard[]>(r))

export const fetchModel = (id: string) => fetch(`${signalApiUrl}/api/models/${id}`).then((r) => readJson<ModelCard>(r))

export const sampleUrl = (id: string, file: string) => `${signalApiUrl}/api/models/${id}/samples/${file}`

export function predictFile(id: string, file: File) {
  const form = new FormData()
  form.append("image", file)
  return fetch(`${signalApiUrl}/api/models/${id}/predict`, { method: "POST", body: form }).then((r) => readJson<Prediction>(r))
}

export function predictSample(id: string, sample: string) {
  return fetch(`${signalApiUrl}/api/models/${id}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sample }),
  }).then((r) => readJson<Prediction>(r))
}

export const percent = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`

// Where each model's tool lives in the dashboard.
export const toolRoutes: Record<string, string> = {
  pneumonia: "/dashboard/pulmonology/chest-xray",
  brain: "/dashboard/neurology/scan-analyzer",
  breast: "/dashboard/radiology/breast-ultrasound",
  blood: "/dashboard/pathology/cell-classification",
  skin: "/dashboard/dermatology/skin-lesion",
}
