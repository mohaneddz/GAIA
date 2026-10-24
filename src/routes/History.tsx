import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AnalysisList from "@/components/records/AnalysisList"
import { errorMessage } from "@/lib/api"
import { pageName } from "@/lib/pageNames"
import { riskRoutes } from "@/lib/riskApi"
import { toolRoutes } from "@/lib/visionApi"
import { deleteAnalysis, listAnalyses, type Analysis } from "@/lib/recordsApi"

const models = Object.entries({ ...toolRoutes, ...riskRoutes }).map(([id, route]) => ({ id, name: pageName(route) }))

export default function History() {
  const [model, setModel] = useState("")
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listAnalyses({ model, flagged: flaggedOnly, limit: 200 })
      .then((list) => {
        setAnalyses(list)
        setError(null)
      })
      .catch((err) => setError(errorMessage(err)))
  }, [model, flaggedOnly])

  const remove = async (analysis: Analysis) => {
    if (!window.confirm(`Delete this ${analysis.title.toLowerCase()} result?`)) return
    await deleteAnalysis(analysis.id)
    setAnalyses((prev) => prev?.filter((a) => a.id !== analysis.id) ?? null)
  }

  return (
    <div className="col w-full max-w-5xl gap-6 p-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Analysis History</h1>
        <p className="text-gray-500">Every saved imaging and risk result, with or without a patient</p>
      </header>

      <Card className="w-full">
        <CardHeader className="flex flex-row flex-wrap items-end justify-between gap-4">
          <div>
            <CardTitle>{analyses ? `${analyses.length} result${analyses.length === 1 ? "" : "s"}` : "Results"}</CardTitle>
            <CardDescription>Newest first, up to 200</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <select value={model} onChange={(e) => setModel(e.target.value)} className="rounded-md border bg-white px-2 py-1.5">
              <option value="">All tools</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 text-gray-700">
              <input type="checkbox" checked={flaggedOnly} onChange={(e) => setFlaggedOnly(e.target.checked)} />
              Flagged for review only
            </label>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-muted-foreground">{error}</p>}
          {analyses && (
            <AnalysisList
              analyses={analyses}
              showPatient
              onDelete={remove}
              empty={model || flaggedOnly ? "Nothing matches these filters." : "No saved results yet. Run any imaging or risk tool and press Save."}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
