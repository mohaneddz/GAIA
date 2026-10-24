import { useState, type FormEvent } from "react"

import { Input } from "@/components/ui/input"
import { errorMessage } from "@/lib/api"
import type { Patient, PatientFields, Sex } from "@/lib/recordsApi"

type Props = {
  initial?: Patient
  submitLabel: string
  onSubmit: (fields: PatientFields) => Promise<void>
  onCancel: () => void
}

const sexOptions: { value: Sex; label: string }[] = [
  { value: "F", label: "Female" },
  { value: "M", label: "Male" },
  { value: "X", label: "Other" },
]

export default function PatientForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "")
  const [mrn, setMrn] = useState(initial?.mrn ?? "")
  const [birthYear, setBirthYear] = useState(initial?.birthYear?.toString() ?? "")
  const [sex, setSex] = useState<Sex | null>(initial?.sex ?? null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onSubmit({ name, mrn: mrn.trim() || null, birthYear: birthYear ? Number(birthYear) : null, sex })
    } catch (err) {
      setError(errorMessage(err))
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border bg-slate-50 p-3">
      <label className="block text-sm text-gray-700">
        Full name
        <Input value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} className="mt-1 bg-white" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm text-gray-700">
          MRN
          <Input value={mrn} onChange={(e) => setMrn(e.target.value)} maxLength={40} className="mt-1 bg-white" />
        </label>
        <label className="block text-sm text-gray-700">
          Birth year
          <Input
            type="number"
            min={1900}
            max={new Date().getFullYear()}
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="mt-1 bg-white"
          />
        </label>
      </div>
      <div className="flex gap-1.5">
        {sexOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSex(sex === option.value ? null : option.value)}
            className={`rounded-full border px-3 py-1 text-xs ${sex === option.value ? "border-primary bg-primary text-white" : "bg-white text-gray-700"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-slate-200">
          Cancel
        </button>
        <button type="submit" disabled={busy} className="rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90 disabled:opacity-60">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
