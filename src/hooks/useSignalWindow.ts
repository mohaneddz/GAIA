import { useEffect, useState } from "react"

// Fetches a signal window and replaces it every refreshMs, so the viewer keeps
// showing new data while the page is open.
export function useSignalWindow<T>(fetcher: (signal: AbortSignal) => Promise<T>, refreshMs = 10000) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const load = () =>
      fetcher(controller.signal)
        .then((next) => {
          setData(next)
          setError(null)
        })
        .catch((err) => {
          if (controller.signal.aborted) return
          setError(err instanceof TypeError ? "Signal server is not reachable" : String(err.message ?? err))
        })

    load()
    const timer = setInterval(load, refreshMs)
    return () => {
      controller.abort()
      clearInterval(timer)
    }
  }, [fetcher, refreshMs])

  return { data, error }
}
