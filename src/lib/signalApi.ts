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

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${signalApiUrl}${path}`, { signal })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? `Signal server returned ${response.status}`)
  }
  return response.json()
}

export const fetchEcg = (signal?: AbortSignal) => getJson<EcgWindow>("/api/ecg", signal)
export const fetchEeg = (signal?: AbortSignal) => getJson<EegWindow>("/api/eeg", signal)
