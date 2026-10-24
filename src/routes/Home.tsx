import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, ArrowRight, Boxes, ClipboardList, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AnalysisList from "@/components/records/AnalysisList"
import { errorMessage } from "@/lib/api"
import { pageName } from "@/lib/pageNames"
import { fetchRiskModels, riskRoutes } from "@/lib/riskApi"
import { fetchModels, toolRoutes } from "@/lib/visionApi"
import { fetchStats, listAnalyses, routeForModel, type Analysis, type Stats } from "@/lib/recordsApi"

const tools = [...Object.values(toolRoutes), ...Object.values(riskRoutes)].map((route) => ({ route, name: pageName(route) }))
const shortDay = (day: string) => new Date(`${day}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" })

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [flagged, setFlagged] = useState<Analysis[]>([])
  const [modelCount, setModelCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchStats(), listAnalyses({ flagged: true, limit: 5 }), fetchModels(), fetchRiskModels()])
      .then(([nextStats, nextFlagged, vision, risk]) => {
        setStats(nextStats)
        setFlagged(nextFlagged)
        setModelCount(vision.length + risk.length)
      })
      .catch((err) => setError(errorMessage(err)))
  }, [])

  const tiles = [
    { icon: Users, label: "Patients", value: stats?.patients, to: "/patients" },
    { icon: ClipboardList, label: "Saved analyses", value: stats?.analyses, to: "/history" },
    { icon: AlertTriangle, label: "Flagged for review", value: stats?.flagged, to: "/history" },
    { icon: Boxes, label: "Models available", value: modelCount, to: "/models" },
  ]

  return (
    <div className="col w-full max-w-7xl gap-6 p-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Clinic Overview</h1>
        <p className="text-gray-500">{new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </header>

      {error && (
        <Card className="w-full">
          <CardContent className="py-6 text-center text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      )}

      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(({ icon: Icon, label, value, to }) => (
          <Link key={label} to={to}>
            <Card className="py-4 transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4">
                <Icon className={`h-8 w-8 ${label === "Flagged for review" && value ? "text-amber-600" : "text-primary"}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold tabular-nums text-gray-900">{value ?? "–"}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid w-full gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Analyses saved, last 14 days</CardTitle>
            <CardDescription>Imaging and risk results saved from any tool</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.perDay ?? []} margin={{ left: -24, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickFormatter={shortDay} tickLine={false} fontSize={11} interval={1} />
                <YAxis allowDecimals={false} tickLine={false} fontSize={11} />
                <Tooltip labelFormatter={(day) => shortDay(String(day))} formatter={(v: number) => [v, "Analyses"]} />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By tool</CardTitle>
            <CardDescription>All saved results</CardDescription>
          </CardHeader>
          <CardContent>
            {stats && stats.byModel.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Nothing saved yet.</p>}
            <ul className="space-y-3">
              {stats?.byModel.map((entry) => (
                <li key={entry.model}>
                  <div className="flex justify-between text-sm">
                    <Link to={routeForModel(entry.model)} className="text-gray-700 hover:text-primary">
                      {entry.title}
                    </Link>
                    <span className="tabular-nums text-gray-600">
                      {entry.count}
                      {entry.flagged > 0 && <span className="text-amber-700"> · {entry.flagged} flagged</span>}
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${(entry.count / stats.analyses) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid w-full gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Needs review</CardTitle>
              <CardDescription>The latest flagged results</CardDescription>
            </div>
            <Link to="/history" className="flex items-center gap-1 text-sm text-primary hover:underline">
              All history <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <AnalysisList analyses={flagged} showPatient empty="No flagged results. Positive findings and above-threshold risks appear here." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tools</CardTitle>
            <CardDescription>Every model-backed tool in GAIA</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {tools.map((tool) => (
                <li key={tool.route}>
                  <Link to={tool.route} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-slate-100 hover:text-primary">
                    {tool.name} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
