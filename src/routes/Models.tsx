import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Cpu, Database, Layers } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ConfusionMatrix from "@/components/vision/ConfusionMatrix"
import { fetchModels, percent, toolRoutes, type ModelCard } from "@/lib/visionApi"
import { fetchRiskModels, riskRoutes, type RiskCard } from "@/lib/riskApi"
import { errorMessage } from "@/lib/api"

function Summary({ models, riskModels }: { models: ModelCard[]; riskModels: RiskCard[] }) {
  const totals = [
    { icon: Layers, label: "Models", value: `${models.length} imaging, ${riskModels.length} risk` },
    { icon: Database, label: "Held-out test images", value: models.reduce((n, m) => n + m.dataset.splits.test, 0).toLocaleString() },
    { icon: Cpu, label: "Total ONNX size", value: `${(models.reduce((n, m) => n + m.onnxBytes, 0) / 1e6).toFixed(1)} MB` },
  ]
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {totals.map(({ icon: Icon, label, value }) => (
        <Card key={label} className="py-4">
          <CardContent className="flex items-center gap-4">
            <Icon className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const duration = (seconds: number) => (seconds < 90 ? `${seconds} s` : `${Math.round(seconds / 60)} min`)

function ModelEntry({ model }: { model: ModelCard }) {
  const tiles = [
    { label: "Accuracy", value: percent(model.metrics.accuracy) },
    { label: "Balanced acc.", value: percent(model.metrics.balancedAccuracy) },
    { label: "Macro F1", value: percent(model.metrics.macroF1) },
    { label: "ROC AUC", value: model.metrics.auc.toFixed(3) },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
        <div>
          <CardTitle>{model.title}</CardTitle>
          <CardDescription>
            {model.modality} · {model.classes.length} classes · trained {model.training.trainedAt} in {duration(model.training.seconds)} on {model.training.device}
          </CardDescription>
        </div>
        {toolRoutes[model.id] && (
          <Link to={toolRoutes[model.id]} className="flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm text-white hover:bg-primary/90">
            Open tool <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tiles.map((tile) => (
              <div key={tile.label} className="rounded-lg border p-2 text-center">
                <p className="text-xs text-muted-foreground">{tile.label}</p>
                <p className="font-semibold text-gray-900">{tile.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {model.dataset.name}: {model.dataset.splits.train.toLocaleString()} / {model.dataset.splits.val.toLocaleString()} / {model.dataset.splits.test.toLocaleString()} train / val / test.{" "}
            {(model.parameters / 1e6).toFixed(2)}M parameters, {(model.onnxBytes / 1e6).toFixed(1)} MB.
          </p>
          <div>
          <p className="mb-1 text-sm font-medium text-gray-700">Validation balanced accuracy by epoch</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={model.training.history} margin={{ left: -20, right: 8, top: 4 }}>
              <XAxis dataKey="epoch" tickLine={false} fontSize={11} />
              <YAxis domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} tickLine={false} fontSize={11} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
              <Tooltip formatter={(v: number) => percent(v)} labelFormatter={(e) => `Epoch ${e}`} />
              <Line dataKey="valBalancedAccuracy" stroke="var(--primary)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium text-gray-700">Test confusion matrix</p>
          <ConfusionMatrix matrix={model.metrics.confusionMatrix} classes={model.classes.map((c) => c.name)} />
        </div>
      </CardContent>
    </Card>
  )
}

function RiskEntry({ model }: { model: RiskCard }) {
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
        <div>
          <CardTitle>{model.title}</CardTitle>
          <CardDescription>
            Logistic regression · {model.features.length} inputs · {model.dataset.name}
          </CardDescription>
        </div>
        <Link to={riskRoutes[model.id]} className="flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm text-white hover:bg-primary/90">
          Open tool <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "ROC AUC", value: model.metrics.auc.toFixed(3) },
          { label: "Brier score", value: model.metrics.brier.toFixed(3) },
          { label: "Sensitivity", value: percent(model.metrics.sensitivity) },
          { label: "Specificity", value: percent(model.metrics.specificity) },
        ].map((tile) => (
          <div key={tile.label} className="rounded-lg border p-2 text-center">
            <p className="text-xs text-muted-foreground">{tile.label}</p>
            <p className="font-semibold text-gray-900">{tile.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function Models() {
  const [models, setModels] = useState<ModelCard[] | null>(null)
  const [riskModels, setRiskModels] = useState<RiskCard[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchModels(), fetchRiskModels()])
      .then(([vision, risk]) => {
        setModels(vision)
        setRiskModels(risk)
      })
      .catch((err) => setError(errorMessage(err)))
  }, [])

  return (
    <div className="col w-full max-w-7xl gap-6 p-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Model Registry</h1>
        <p className="text-gray-500">Every model GAIA runs, how it was trained, and how it scored on data it never saw</p>
      </header>
      {error && <p className="text-sm text-muted-foreground">{error}</p>}
      {!models && !error && <p className="text-sm text-muted-foreground">Loading models…</p>}
      {models && (
        <>
          <Summary models={models} riskModels={riskModels} />
          <h2 className="w-full text-lg font-semibold text-gray-800">Imaging models</h2>
          {models.map((model) => <ModelEntry key={model.id} model={model} />)}
          <h2 className="w-full text-lg font-semibold text-gray-800">Risk models</h2>
          <div className="grid w-full gap-6 lg:grid-cols-2">
            {riskModels.map((model) => <RiskEntry key={model.id} model={model} />)}
          </div>
        </>
      )}
    </div>
  )
}
