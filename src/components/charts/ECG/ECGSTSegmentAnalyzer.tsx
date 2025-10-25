import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { TrendingDown, Zap } from "lucide-react"

export default function ECGSTSegmentAnalyzer() {
  // Mock data based on Green Team.pdf (ST-segment analysis)
  const deviationData = [
    { lead: 'V2 (Chest)', deviation: -1.8, type: 'Depression', threshold: 1.0, color: 'text-red-600' },
    { lead: 'aVF (Limb)', deviation: 0.6, type: 'Elevation', threshold: 0.5, color: 'text-red-600' },
    { lead: 'V4 (Chest)', deviation: 0.1, type: 'Normal', threshold: 1.0, color: 'text-green-600' },
  ];

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-600" /> ST-Segment Deviation Analysis
        </CardTitle>
        <CardDescription>Automated quantification of deviation for potential ischemia.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Center Status Alert */}
        <div className="flex flex-col items-center justify-center py-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-base font-semibold text-red-800 flex items-center gap-1">
            <Zap className="w-4 h-4" /> Acute Changes Detected
          </p>
          <p className="text-xs text-red-600">ST depression in V2 suggests possible NSTEMI[cite: 6].</p>
        </div>

        {/* Deviation Metrics */}
        <div className="grid grid-cols-3 gap-x-2 text-sm text-neutral-600 font-medium border-b pb-1">
          <p className="font-bold">Lead</p>
          <p className="font-bold text-center">Deviation (mm)</p>
          <p className="font-bold text-right">Result</p>
        </div>
        {deviationData.map((data, index) => (
          <div key={index} className="grid grid-cols-3 gap-x-2 text-sm text-neutral-800">
            <p>{data.lead}</p>
            <p className={`text-center font-bold ${data.color}`}>{data.deviation.toFixed(1)} mm</p>
            <p className={`text-right font-medium ${data.color}`}>{data.type}</p>
          </div>
        ))}
        
        <p className="mt-2 text-xs text-neutral-500 italic">
          Quantitative report specifying mm deviation per lead is available[cite: 10].
        </p>
      </CardContent>
    </Card>
  )
}