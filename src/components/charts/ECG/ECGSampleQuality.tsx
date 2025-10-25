import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SlidersHorizontal, AlertCircle, Wrench } from "lucide-react"

export default function ECGSampleQuality() {
  // Mock data based on Green Team.pdf (Electrode and Noise analysis)
  const qualityMetrics = {
    signalToNoise: '78%',
    misplacement: 'Suspected RA/LA reversal [cite: 93]',
    noiseLevel: 'High Baseline Wander in Lead I [cite: 135]',
    qualityScore: 3.5,
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-500" /> Signal Quality & Setup
        </CardTitle>
        <CardDescription>Real-time check for artifact, noise, and electrode misplacement.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main Status */}
        <div className="flex flex-col items-center justify-center py-3 rounded-xl bg-yellow-50 border border-yellow-200">
          <p className="text-base font-semibold text-yellow-800 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> Technical Error Detected
          </p>
          <p className="text-xs text-yellow-600">Possible lead reversal requiring immediate re-check[cite: 93].</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-y-1 text-sm text-neutral-600 mt-2">
          <p>Quality Score (0–5):</p><p className="text-right font-medium text-neutral-800">{qualityMetrics.qualityScore.toFixed(1)} / 5.0</p>
          <p>Signal-to-Noise:</p><p className="text-right font-medium text-neutral-800">{qualityMetrics.signalToNoise}</p>
          <p>Dominant Noise:</p><p className="text-right font-medium text-neutral-800">Baseline Wander</p>
          <p>Misplacement Check:</p><p className="text-right font-medium text-red-600">RA/LA Reversed</p>
        </div>

        <p className="mt-2 text-xs text-neutral-500 italic flex items-center gap-1">
          <Wrench className="w-3 h-3" /> Suggests repositioning electrodes before interpretation[cite: 93].
        </p>
      </CardContent>
    </Card>
  )
}