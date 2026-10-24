import { Link } from "react-router-dom"
import { AlertTriangle, Calculator, Trash2 } from "lucide-react"

import { formatDate, routeForModel, type Analysis } from "@/lib/recordsApi"

type Props = {
  analyses: Analysis[]
  showPatient?: boolean
  onDelete?: (analysis: Analysis) => void
  empty: string
}

export default function AnalysisList({ analyses, showPatient = false, onDelete, empty }: Props) {
  if (analyses.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>
  }

  return (
    <ul className="divide-y">
      {analyses.map((analysis) => (
        <li key={analysis.id} className="flex items-start gap-3 py-3">
          {analysis.thumbnail ? (
            <img src={analysis.thumbnail} alt="" className="h-14 w-14 shrink-0 rounded-md border object-cover" />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border bg-slate-50 text-slate-400">
              <Calculator className="h-6 w-6" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link to={routeForModel(analysis.model)} className="text-sm font-medium text-gray-900 hover:text-primary">
                {analysis.title}
              </Link>
              {analysis.flagged && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                  <AlertTriangle className="h-3 w-3" /> Review
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700">{analysis.summary}</p>
            {analysis.note && <p className="mt-0.5 text-xs text-gray-600">“{analysis.note}”</p>}
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatDate(analysis.createdAt)}
              {showPatient && (
                <>
                  {" · "}
                  {analysis.patientId ? (
                    <Link to={`/patients?selected=${analysis.patientId}`} className="text-primary hover:underline">
                      {analysis.patientName}
                    </Link>
                  ) : (
                    "No patient"
                  )}
                </>
              )}
            </p>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(analysis)}
              title="Delete this analysis"
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
