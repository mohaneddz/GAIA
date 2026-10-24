import { useCallback, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { AlertTriangle, Pencil, Plus, Search, Trash2, UserRound } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AnalysisList from "@/components/records/AnalysisList"
import PatientForm from "@/components/records/PatientForm"
import { errorMessage } from "@/lib/api"
import { pageName } from "@/lib/pageNames"
import { riskRoutes } from "@/lib/riskApi"
import { toolRoutes } from "@/lib/visionApi"
import {
  ageOf,
  createPatient,
  deleteAnalysis,
  deletePatient,
  formatDate,
  listAnalyses,
  listPatients,
  updatePatient,
  type Analysis,
  type Patient,
} from "@/lib/recordsApi"

const tools = [...Object.values(toolRoutes), ...Object.values(riskRoutes)].map((route) => ({ route, name: pageName(route) }))
const sexLabel = { F: "Female", M: "Male", X: "Other" }

function describe(patient: Patient) {
  const age = ageOf(patient)
  return [patient.mrn, age !== null ? `${age} y` : null, patient.sex ? sexLabel[patient.sex] : null].filter(Boolean).join(" · ")
}

function PatientDetail({ patient, onChanged, onDeleted }: { patient: Patient; onChanged: (p: Patient) => void; onDeleted: () => void }) {
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null)
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(patient.notes)
  const [error, setError] = useState<string | null>(null)

  // The parent remounts this per patient, so this runs once per selection.
  useEffect(() => {
    listAnalyses({ patient: patient.id }).then(setAnalyses).catch((err) => setError(errorMessage(err)))
  }, [patient.id])

  const saveNotes = async () => {
    if (notes === patient.notes) return
    try {
      onChanged(await updatePatient(patient.id, { notes }))
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const remove = async () => {
    if (!window.confirm(`Delete ${patient.name}? Their saved analyses stay in the history without a patient.`)) return
    try {
      await deletePatient(patient.id)
      onDeleted()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const removeAnalysis = async (analysis: Analysis) => {
    if (!window.confirm(`Delete this ${analysis.title.toLowerCase()} result?`)) return
    await deleteAnalysis(analysis.id)
    setAnalyses((prev) => prev?.filter((a) => a.id !== analysis.id) ?? null)
    onChanged({ ...patient, analysisCount: patient.analysisCount - 1, flaggedCount: patient.flaggedCount - Number(analysis.flagged) })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">{patient.name}</CardTitle>
            <CardDescription>{describe(patient) || "No details recorded"} · added {formatDate(patient.createdAt)}</CardDescription>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditing(!editing)} title="Edit details" className="rounded p-2 text-gray-500 hover:bg-slate-100">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={remove} title="Delete patient" className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing && (
            <PatientForm
              initial={patient}
              submitLabel="Save details"
              onCancel={() => setEditing(false)}
              onSubmit={async (fields) => {
                onChanged(await updatePatient(patient.id, fields))
                setEditing(false)
              }}
            />
          )}
          <label className="block text-sm text-gray-700">
            Clinical notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              rows={3}
              maxLength={4000}
              placeholder="Allergies, history, current medication… saved when you click away"
              className="mt-1 w-full resize-y rounded-md border px-3 py-2 text-sm"
            />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Run a tool for this patient</p>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <Link
                  key={tool.route}
                  to={`${tool.route}?patient=${patient.id}`}
                  className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700 hover:border-primary hover:text-primary"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved analyses</CardTitle>
          <CardDescription>Newest first. Flagged results predicted a class or risk level that needs review.</CardDescription>
        </CardHeader>
        <CardContent>
          {analyses === null ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <AnalysisList analyses={analyses} onDelete={removeAnalysis} empty="No saved analyses yet. Run a tool above and save its result." />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function Patients() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = Number(searchParams.get("selected")) || null
  const [query, setQuery] = useState("")
  const [patients, setPatients] = useState<Patient[] | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    listPatients(query)
      .then((list) => {
        setPatients(list)
        setError(null)
      })
      .catch((err) => setError(errorMessage(err)))
  }, [query])

  useEffect(() => {
    const timer = setTimeout(load, 150)
    return () => clearTimeout(timer)
  }, [load])

  const select = (id: number | null) => setSearchParams(id ? { selected: String(id) } : {})
  const selected = patients?.find((p) => p.id === selectedId) ?? null
  const replace = (next: Patient) => setPatients((prev) => prev?.map((p) => (p.id === next.id ? next : p)) ?? null)

  return (
    <div className="col w-full max-w-7xl gap-6 p-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
        <p className="text-gray-500">Records and every analysis saved for them, stored locally on this machine</p>
      </header>

      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Card className="h-fit">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle>{patients ? `${patients.length} patient${patients.length === 1 ? "" : "s"}` : "Patients"}</CardTitle>
              <button
                onClick={() => setCreating(!creating)}
                className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" /> New
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or MRN" className="pl-8" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {creating && (
              <PatientForm
                submitLabel="Add patient"
                onCancel={() => setCreating(false)}
                onSubmit={async (fields) => {
                  const patient = await createPatient(fields)
                  setCreating(false)
                  setQuery("")
                  load()
                  select(patient.id)
                }}
              />
            )}
            {error && <p className="text-sm text-muted-foreground">{error}</p>}
            {patients?.length === 0 && !creating && (
              <p className="py-6 text-center text-sm text-muted-foreground">{query ? "No patient matches that search." : "No patients yet. Add one to start saving results."}</p>
            )}
            <ul className="space-y-1">
              {patients?.map((patient) => (
                <li key={patient.id}>
                  <button
                    onClick={() => select(patient.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${patient.id === selectedId ? "bg-primary/10" : "hover:bg-slate-100"}`}
                  >
                    <UserRound className="h-8 w-8 shrink-0 rounded-full bg-slate-100 p-1.5 text-slate-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{patient.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{describe(patient) || "No details"}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 text-xs text-muted-foreground">
                      <span>{patient.analysisCount} saved</span>
                      {patient.flaggedCount > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-700">
                          <AlertTriangle className="h-3 w-3" /> {patient.flaggedCount}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {selected ? (
          <PatientDetail
            key={selected.id}
            patient={selected}
            onChanged={replace}
            onDeleted={() => {
              select(null)
              load()
            }}
          />
        ) : (
          <Card className="flex items-center justify-center py-24">
            <p className="text-sm text-muted-foreground">Select a patient to see their record and saved analyses.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
