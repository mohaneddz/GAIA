import { useEffect, useRef, useState } from "react"
import { AlertTriangle, CheckCircle2, ImageUp, Info, Loader2, XCircle } from "lucide-react"
import { Link } from "react-router-dom"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ConfusionMatrix from "@/components/vision/ConfusionMatrix"
import {
  fetchModel,
  percent,
  predictFile,
  predictSample,
  sampleUrl,
  type ModelCard,
  type Prediction,
} from "@/lib/visionApi"

const LOW_CONFIDENCE = 0.6

type Selection = { imageUrl: string; trueLabel: number | null; name: string }

export default function ClassifierWorkbench({ modelId }: { modelId: string }) {
  const [card, setCard] = useState<ModelCard | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState<string | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const uploadUrl = useRef<string | null>(null)

  useEffect(() => {
    fetchModel(modelId)
      .then(setCard)
      .catch((err) => setLoadError(err instanceof TypeError ? "The GAIA server is not reachable. Start it with python server/app.py." : err.message))
    return () => {
      if (uploadUrl.current) URL.revokeObjectURL(uploadUrl.current)
    }
  }, [modelId])

  const run = async (next: Selection, request: () => Promise<Prediction>) => {
    setSelection(next)
    setPrediction(null)
    setRunError(null)
    setRunning(true)
    try {
      setPrediction(await request())
    } catch (err) {
      setRunError(err instanceof Error ? err.message : "Prediction failed")
    } finally {
      setRunning(false)
    }
  }

  const runFile = (file: File) => {
    if (uploadUrl.current) URL.revokeObjectURL(uploadUrl.current)
    uploadUrl.current = URL.createObjectURL(file)
    run({ imageUrl: uploadUrl.current, trueLabel: null, name: file.name }, () => predictFile(modelId, file))
  }

  const runSample = (file: string, label: number) =>
    run({ imageUrl: sampleUrl(modelId, file), trueLabel: label, name: file }, () => predictSample(modelId, file))

  if (loadError) {
    return (
      <Card className="w-full">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">{loadError}</CardContent>
      </Card>
    )
  }
  if (!card) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Loading model…</div>
  }

  const classNames = card.classes.map((c) => c.name)
  const top = prediction ? prediction.probabilities[prediction.predicted] : null
  const ranked = prediction ? [...prediction.probabilities].sort((a, b) => b.probability - a.probability) : []
  const topStats = prediction ? card.metrics.perClass[prediction.predicted] : null

  return (
    <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Image</CardTitle>
          <CardDescription>
            Drop a {card.modality.toLowerCase()} image or pick a held-out test sample. Images are resized to {card.input.size}×{card.input.size}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInput.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInput.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              const file = e.dataTransfer.files[0]
              if (file) runFile(file)
            }}
            className={`relative mx-auto flex aspect-square w-full max-w-md cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-slate-50 transition-colors ${dragging ? "border-primary bg-blue-50" : "border-slate-300 hover:border-primary/60"}`}
          >
            {selection ? (
              <img
                src={showHeatmap && prediction ? prediction.heatmap : selection.imageUrl}
                alt={showHeatmap && prediction ? "Class activation map over the image" : "Selected image"}
                className="h-full w-full object-contain [image-rendering:auto]"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <ImageUp className="h-10 w-10" />
                <span>Drop an image here, or click to browse</span>
                <span className="text-xs">PNG or JPEG, under 10 MB</span>
              </div>
            )}
            {running && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/bmp,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) runFile(file)
                e.target.value = ""
              }}
            />
          </div>

          {prediction && (
            <div className="flex justify-center gap-2 text-sm">
              {[
                { value: false, label: "Image" },
                { value: true, label: "Attention heatmap" },
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => setShowHeatmap(option.value)}
                  className={`rounded-full px-4 py-1.5 transition-colors ${showHeatmap === option.value ? "bg-primary text-white" : "bg-slate-100 text-gray-700 hover:bg-slate-200"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Test-set samples (never seen in training)</p>
            <div className="flex flex-wrap gap-2">
              {card.samples.map((sample) => (
                <button
                  key={sample.file}
                  onClick={() => runSample(sample.file, sample.label)}
                  title={`True label: ${classNames[sample.label]}`}
                  className={`group w-20 overflow-hidden rounded-lg border bg-white text-left transition-shadow hover:shadow-md ${selection?.name === sample.file ? "ring-2 ring-primary" : ""}`}
                >
                  <img src={sampleUrl(modelId, sample.file)} alt={classNames[sample.label]} className="h-20 w-20 object-cover" />
                  <span className="block truncate px-1.5 py-1 text-[10px] text-gray-600">{classNames[sample.label]}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>Class probabilities from the model, highest first</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {runError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{runError}</p>}
          {!prediction && !runError && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {running ? "Running the model…" : "Results appear here once an image is selected."}
            </p>
          )}
          {prediction && top && topStats && (
            <>
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Prediction</p>
                <p className="text-2xl font-bold text-gray-900">{top.name}</p>
                <p className="text-sm text-gray-600">{percent(top.probability)} probability</p>
                <p className="mt-2 text-sm text-gray-700">{card.classes[prediction.predicted].description}</p>
                {selection?.trueLabel !== null && selection?.trueLabel !== undefined && (
                  <p className={`mt-3 flex items-center gap-1.5 text-sm font-medium ${selection.trueLabel === prediction.predicted ? "text-green-700" : "text-red-700"}`}>
                    {selection.trueLabel === prediction.predicted ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    Ground truth: {classNames[selection.trueLabel]}
                  </p>
                )}
              </div>

              {top.probability < LOW_CONFIDENCE && (
                <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  Low confidence: the model is split between classes. Treat this result as inconclusive.
                </p>
              )}

              <ul className="space-y-2">
                {ranked.map((entry) => (
                  <li key={entry.name}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{entry.name}</span>
                      <span className="tabular-nums text-gray-600">{percent(entry.probability)}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${entry.probability * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>

              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                On the test set, {percent(topStats.precision, 0)} of "{top.name}" predictions were correct, and the model found {percent(topStats.recall, 0)} of true {top.name.toLowerCase()} cases.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="xl:col-span-5">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle>About this model</CardTitle>
            <CardDescription>
              Trained on {card.dataset.name}, evaluated on {card.dataset.splits.test.toLocaleString()} held-out test images.
            </CardDescription>
          </div>
          <Link to="/models" className="text-sm text-primary hover:underline">
            All models
          </Link>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Accuracy", value: card.metrics.accuracy },
                { label: "Balanced acc.", value: card.metrics.balancedAccuracy },
                { label: "Macro F1", value: card.metrics.macroF1 },
                { label: "ROC AUC", value: card.metrics.auc },
              ].map((metric) => (
                <div key={metric.label} className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{metric.label === "ROC AUC" ? metric.value.toFixed(3) : percent(metric.value)}</p>
                </div>
              ))}
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className="text-muted-foreground">Architecture</dt>
              <dd className="text-gray-800">{card.architecture}</dd>
              <dt className="text-muted-foreground">Size</dt>
              <dd className="text-gray-800">
                {(card.parameters / 1e6).toFixed(2)}M parameters, {(card.onnxBytes / 1e6).toFixed(1)} MB ONNX
              </dd>
              <dt className="text-muted-foreground">Data splits</dt>
              <dd className="text-gray-800">
                {card.dataset.splits.train.toLocaleString()} train, {card.dataset.splits.val.toLocaleString()} validation, {card.dataset.splits.test.toLocaleString()} test
              </dd>
              <dt className="text-muted-foreground">Source</dt>
              <dd className="text-gray-800">
                <a href={card.dataset.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  {card.dataset.name}
                </a>{" "}
                ({card.dataset.license}). {card.dataset.citation}.
              </dd>
            </dl>
            <Badge variant="outline" className="whitespace-normal text-left font-normal text-amber-800">
              Research demo trained on a public dataset. Not validated for clinical use.
            </Badge>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Confusion matrix (test set)</p>
            <ConfusionMatrix matrix={card.metrics.confusionMatrix} classes={classNames} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
