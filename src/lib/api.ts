export const apiUrl = import.meta.env.VITE_SIGNAL_API_URL ?? "http://127.0.0.1:5600"

export const serverDownMessage = "The GAIA server is not reachable. Start it with python server/app.py."

// fetch() rejects with a TypeError only when the request never reached a server.
export const errorMessage = (err: unknown) =>
  err instanceof TypeError ? serverDownMessage : err instanceof Error ? err.message : String(err)

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, init)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? `Server returned ${response.status}`)
  }
  return response.status === 204 ? (undefined as T) : response.json()
}

export const sendJson = <T>(path: string, method: string, body: unknown, signal?: AbortSignal) =>
  requestJson<T>(path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal })
