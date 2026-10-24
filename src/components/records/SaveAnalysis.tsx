import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Check, Loader2, Save } from "lucide-react"

import { errorMessage } from "@/lib/api"
import { listPatients, saveAnalysis, type NewAnalysis, type Patient } from "@/lib/recordsApi"

type Props = {
  // Built at save time, so the thumbnail is only made when it is needed.
  build: () => Promise<NewAnalysis>
  // Changes whenever the result changes, so a new result can be saved again.
  resultKey: string
}

export default function SaveAnalysis({ build, resultKey }: Props) {
  const [searchParams] = useSearchParams()
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientId, setPatientId] = useState<number | null>(() => Number(searchParams.get("patient")) || null)
  const [note, setNote] = useState("")
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listPatients().then(setPatients).catch((err) => setError(errorMessage(err)))
  }, [])

  useEffect(() => {
    setState("idle")
    setError(null)
  }, [resultKey])

  const save = async () => {
    setState("saving")
    setError(null)
    try {
      await saveAnalysis({ ...(await build()), patientId, note })
      setState("saved")
    } catch (err) {
      setError(errorMessage(err))
      setState("idle")
    }
  }

  if (state === "saved") {
    return (
      <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4" /> Saved to {patientId ? patients.find((p) => p.id === patientId)?.name : "history"}
        </span>
        <Link to={patientId ? `/patients?selected=${patientId}` : "/history"} className="font-medium hover:underline">
          View
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2 rounded-lg border bg-slate-50 p-3">
      <p className="text-sm font-medium text-gray-700">Save this result</p>
      <select
        value={patientId ?? ""}
        onChange={(e) => setPatientId(e.target.value ? Number(e.target.value) : null)}
        className="w-full rounded-md border bg-white px-2 py-1.5 text-sm"
      >
        <option value="">No patient (history only)</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
            {p.mrn ? ` · ${p.mrn}` : ""}
          </option>
        ))}
      </select>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        rows={2}
        maxLength={2000}
        className="w-full resize-none rounded-md border bg-white px-2 py-1.5 text-sm"
      />
      {error && <p className="text-xs text-red-700">{error}</p>}
      <button
        onClick={save}
        disabled={state === "saving"}
        className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90 disabled:opacity-60"
      >
        {state === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save{patientId ? " to patient" : ""}
      </button>
    </div>
  )
}
