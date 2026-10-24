import { requestJson, sendJson } from "@/lib/api"

export type SignalSample = { time: number } & Record<string, number>

export type EcgVitals = {
  heartRate: number | null
  rrStdMs: number | null
  rrMeanMs: number | null
  beatCount: number
}

export type EegMetrics = {
  alphaBetaRatio: number
  thetaRelative: number
  deltaRelative: number
  waveVariability: number
  bandRelative: Record<"delta" | "theta" | "alpha" | "beta" | "gamma", number>
}

export type EcgWindow = {
  fs: number
  duration: number
  leads: string[]
  samples: SignalSample[]
  vitals: EcgVitals
}

export type EegWindow = {
  fs: number
  duration: number
  channels: string[]
  samples: SignalSample[]
  metrics: EegMetrics
}

export type ChatTurn = { role: "user" | "assistant"; content: string }

export const fetchEcg = (signal?: AbortSignal) => requestJson<EcgWindow>("/api/ecg", { signal })
export const fetchEeg = (signal?: AbortSignal) => requestJson<EegWindow>("/api/eeg", { signal })
export const fetchHealth = () => requestJson<{ status: string; chat: boolean }>("/api/health")

export const sendChat = async (messages: ChatTurn[], addedFeatures: string[]) =>
  (await sendJson<{ reply: string }>("/api/chat", "POST", { messages, addedFeatures })).reply
