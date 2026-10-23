import { useEffect, useState } from "react"
import { RotateCcw } from "lucide-react"
import { CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { percent } from "@/lib/visionApi"
import { fetchRiskModel, scoreRisk, type RiskCard, type RiskFeature, type RiskInputs, type RiskResult } from "@/lib/riskApi"

const defaultsOf = (card: RiskCard): RiskInputs => Object.fromEntries(card.features.map((f) => [f.key, f.default]))

function FeatureField({ feature, value, onChange }: { feature: RiskFeature; value: number | string; onChange: (v: number | string) => void }) {
  if (feature.type === "number") {
    return (
      <label className="block">
        <span className="text-sm text-gray-700">{feature.label}</span>
        <div className="mt-1 flex items-center gap-2">
          <Input
            type="number"
            min={feature.min}
            max={feature.max}
            step={feature.step}
            value={value}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-28"
          />
          <span className="text-xs text-muted-foreground">{feature.unit}</span>
        </div>
      </label>
    )
  }
  return (
    <div>
      <span className="text-sm text-gray-700">{feature.label}</span>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {feature.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${value === option.value ? "border-primary bg-primary text-white" : "bg-white text-gray-700 hover:border-primary/50"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Contributions({ result }: { result: RiskResult }) {
  const largest = Math.max(...result.contributions.map((c) => Math.abs(c.logOdds)), 0.01)
  return (
    <ul className="space-y-2">
      {result.contributions.map((c) => {
        const width = (Math.abs(c.logOdds) / largest) * 50
        const raises = c.logOdds > 0
        return (
          <li key={c.feature} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-3 text-sm">
            <span className="truncate text-gray-700" title={`${c.label}: ${c.value}`}>
              {c.label} <span className="text-muted-foreground">({c.value})</span>
            </span>
            <div className="relative h-4">
              <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300" />
              <div
                className={`absolute inset-y-0.5 rounded ${raises ? "bg-red-500" : "bg-emerald-500"}`}
                style={raises ? { left: "50%", width: `${width}%` } : { right: "50%", width: `${width}%` }}
                title={`${raises ? "+" : ""}${c.logOdds.toFixed(2)} log-odds`}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default function RiskCalculator({ modelId }: { modelId: string }) {
  const [card, setCard] = useState<RiskCard | null>(null)
  const [inputs, setInputs] = useState<RiskInputs>({})
  const [result, setResult] = useState<RiskResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRiskModel(modelId)
      .then((loaded) => {
        setCard(loaded)
        setInputs(defaultsOf(loaded))
      })
      .catch((err) => setError(err instanceof TypeError ? "The GAIA server is not reachable. Start it with python server/app.py." : err.message))
  }, [modelId])

  // Rescore shortly after each edit; abort the previous request if still in flight.
  useEffect(() => {
    if (!card) return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      scoreRisk(modelId, inputs, controller.signal)
        .then((next) => {
          setResult(next)
          setError(null)
        })
        .catch((err) => {
          if (!controller.signal.aborted) setError(err.message)
        })
    }, 200)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [card, inputs, modelId])

  if (!card) {
    return <p className="py-16 text-center text-sm text-muted-foreground">{error ?? "Loading model…"}</p>
  }

  const ratio = result ? result.probability / result.referenceProbability : 1

  return (
    <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Patient</CardTitle>
            <CardDescription>The score updates as you edit</CardDescription>
          </div>
          <button onClick={() => setInputs(defaultsOf(card))} className="flex items-center gap-1 text-sm text-primary hover:underline">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {card.features.map((feature) => (
            <FeatureField
              key={feature.key}
              feature={feature}
              value={inputs[feature.key] ?? ""}
              onChange={(value) => setInputs((prev) => ({ ...prev, [feature.key]: value }))}
            />
          ))}
        </CardContent>
      </Card>

      <div className="col gap-6 xl:col-span-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Estimated risk</CardTitle>
            <CardDescription>{card.outcome}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            {result && (
              <>
                <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
                  <p className="text-5xl font-bold tabular-nums text-gray-900">{percent(result.probability)}</p>
                  <div className="pb-1 text-sm text-gray-600">
                    <p>
                      {ratio >= 1 ? `${ratio.toFixed(1)}× higher` : `${(1 / ratio).toFixed(1)}× lower`} than an average patient in the dataset (
                      {percent(result.referenceProbability)})
                    </p>
                    <Badge className={`mt-1 ${result.aboveThreshold ? "bg-red-600" : "bg-emerald-600"}`}>
                      {result.aboveThreshold ? "Above" : "Below"} the {percent(card.metrics.threshold)} screening threshold
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">What moved the score</p>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Bars are each input's exact share of the model's log-odds relative to the average patient: red raises risk, green lowers it.
                  </p>
                  <Contributions result={result} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>About this model</CardTitle>
            <CardDescription>
              {card.model.type} trained on {card.dataset.name}; {card.splits.test.toLocaleString()} patients held out for testing
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "ROC AUC", value: card.metrics.auc.toFixed(3) },
                  { label: "Brier score", value: card.metrics.brier.toFixed(3) },
                  { label: "Sensitivity", value: percent(card.metrics.sensitivity) },
                  { label: "Specificity", value: percent(card.metrics.specificity) },
                ].map((tile) => (
                  <div key={tile.label} className="rounded-lg border p-2 text-center">
                    <p className="text-xs text-muted-foreground">{tile.label}</p>
                    <p className="font-semibold text-gray-900">{tile.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Sensitivity and specificity are at the {percent(card.metrics.threshold)} threshold, chosen on training data. Outcome rate in the
                training data: {percent(card.prevalence)}.{" "}
                <a href={card.dataset.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  Dataset
                </a>{" "}
                ({card.dataset.license}). {card.dataset.citation}.
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-gray-700">Calibration on the test set</p>
              <ResponsiveContainer width="100%" height={170}>
                <ScatterChart margin={{ left: -16, right: 8, top: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="predicted" name="Predicted" domain={[0, "dataMax"]} tickFormatter={(v) => `${Math.round(v * 100)}%`} fontSize={11} />
                  <YAxis type="number" dataKey="observed" name="Observed" domain={[0, "dataMax"]} tickFormatter={(v) => `${Math.round(v * 100)}%`} fontSize={11} />
                  <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="#94a3b8" strokeDasharray="4 4" ifOverflow="hidden" />
                  <Tooltip formatter={(v: number) => percent(v)} />
                  <Scatter data={card.metrics.calibration} fill="var(--primary)" isAnimationActive={false} />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground">Points near the dashed line mean predicted risks match observed rates.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
