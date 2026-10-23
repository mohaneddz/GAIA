export const signalApiUrl = import.meta.env.VITE_SIGNAL_API_URL ?? "http://127.0.0.1:5600"

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

async function getJson<T>(path: string, signal?: AbortSignal, init?: RequestInit): Promise<T> {
  const response = await fetch(`${signalApiUrl}${path}`, { signal, ...init })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? `Signal server returned ${response.status}`)
  }
  return response.json()
}

export const fetchEcg = (signal?: AbortSignal) => getJson<EcgWindow>("/api/ecg", signal)
export const fetchEeg = (signal?: AbortSignal) => getJson<EegWindow>("/api/eeg", signal)
export const fetchHealth = () => getJson<{ status: string; chat: boolean }>("/api/health")

export const sendChat = async (messages: ChatTurn[], addedFeatures: string[]) => {
  const body = await getJson<{ reply: string }>("/api/chat", undefined, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, addedFeatures }),
  })
  return body.reply
}
