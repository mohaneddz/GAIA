import { requestJson, sendJson } from "@/lib/api"
import { riskRoutes, type RiskInputs } from "@/lib/riskApi"
import { toolRoutes } from "@/lib/visionApi"

export type Sex = "F" | "M" | "X"

export type Patient = {
  id: number
  name: string
  mrn: string | null
  birthYear: number | null
  sex: Sex | null
  notes: string
  createdAt: string
  analysisCount: number
  lastAnalysisAt: string | null
  flaggedCount: number
}

export type PatientFields = Partial<Pick<Patient, "name" | "mrn" | "birthYear" | "sex" | "notes">>

export type Analysis = {
  id: number
  patientId: number | null
  patientName: string | null
  kind: "vision" | "risk"
  model: string
  title: string
  summary: string
  flagged: boolean
  thumbnail: string | null
  note: string
  createdAt: string
}

export type Stats = {
  patients: number
  analyses: number
  flagged: number
  byModel: { model: string; title: string; count: number; flagged: number }[]
  perDay: { day: string; count: number }[]
}

export type NewAnalysis =
  | { kind: "vision"; model: string; result: unknown; thumbnail?: string | null }
  | { kind: "risk"; model: string; inputs: RiskInputs }

export const listPatients = (query = "") => requestJson<Patient[]>(`/api/patients?q=${encodeURIComponent(query)}`)
export const getPatient = (id: number) => requestJson<Patient>(`/api/patients/${id}`)
export const createPatient = (fields: PatientFields) => sendJson<Patient>("/api/patients", "POST", fields)
export const updatePatient = (id: number, fields: PatientFields) => sendJson<Patient>(`/api/patients/${id}`, "PATCH", fields)
export const deletePatient = (id: number) => requestJson<void>(`/api/patients/${id}`, { method: "DELETE" })

export function listAnalyses(filters: { patient?: number; model?: string; flagged?: boolean; limit?: number } = {}) {
  const params = new URLSearchParams()
  if (filters.patient !== undefined) params.set("patient", String(filters.patient))
  if (filters.model) params.set("model", filters.model)
  if (filters.flagged) params.set("flagged", "1")
  params.set("limit", String(filters.limit ?? 100))
  return requestJson<Analysis[]>(`/api/analyses?${params}`)
}

export const saveAnalysis = (analysis: NewAnalysis & { patientId: number | null; note: string }) =>
  sendJson<Analysis>("/api/analyses", "POST", analysis)
export const deleteAnalysis = (id: number) => requestJson<void>(`/api/analyses/${id}`, { method: "DELETE" })
export const fetchStats = () => requestJson<Stats>("/api/stats")

export const routeForModel = (model: string) => toolRoutes[model] ?? riskRoutes[model] ?? "/models"

export const ageOf = (patient: Pick<Patient, "birthYear">) =>
  patient.birthYear ? new Date().getFullYear() - patient.birthYear : null

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })

// Downscale an image to a small JPEG data URL for the history list.
export async function makeThumbnail(src: string, size = 160): Promise<string | null> {
  const image = new Image()
  image.crossOrigin = "anonymous"
  image.src = src
  try {
    await image.decode()
  } catch {
    return null
  }
  const scale = size / Math.max(image.naturalWidth, image.naturalHeight)
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(image.naturalWidth * Math.min(scale, 1)))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * Math.min(scale, 1)))
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height)
  try {
    return canvas.toDataURL("image/jpeg", 0.8)
  } catch {
    return null
  }
}
