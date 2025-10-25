import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FlaskConical, AlertTriangle } from "lucide-react"

export default function ECGLabTestsCard() {
  // Mock data based on Green Team.pdf (Troponin, BNP, Electrolytes)
  const labMetrics = [
    { name: 'Troponin I (cTnI)', value: '1.5 ng/mL', status: 'Elevated (Acute MI)', color: 'text-red-600', range: '<0.04 ng/mL' }, // [cite: 155, 157, 160]
    { name: 'NT-proBNP', value: '1250 pg/mL', status: 'High (Heart Failure)', color: 'text-red-600', range: '<125 pg/mL' }, // [cite: 186, 189, 191]
    { name: 'Potassium (K⁺)', value: '3.1 mmol/L', status: 'Low (Arrhythmia Risk)', color: 'text-yellow-600', range: '3.5–5.0 mmol/L' }, // [cite: 201, 202, 205]
    { name: 'CK-MB', value: '4% (of total CK)', status: 'Normal', color: 'text-green-600', range: '<5-6%' }, // [cite: 174]
  ];

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-teal-600" /> Cardiac Lab Tests Summary
        </CardTitle>
        <CardDescription>Key biomarkers for myocardial injury and cardiac strain.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main Status */}
        <div className="flex flex-col items-center justify-center py-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-base font-semibold text-red-800 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Urgent Correlation Required
          </p>
          <p className="text-xs text-red-600">Troponin I and NT-proBNP highly elevated; check ECG for STEMI[cite: 160, 191].</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-y-1 text-sm text-neutral-600 mt-2">
          {labMetrics.map((data, index) => (
            <div key={index} className="col-span-2 border-b border-dashed py-1 last:border-b-0">
              <p className="font-medium text-neutral-800">{data.name}</p>
              <div className="flex justify-between text-xs">
                <p className={`font-bold ${data.color}`}>{data.value}</p>
                <p className="text-neutral-500 italic">Normal Range: {data.range}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-2 text-xs text-neutral-500 italic">
          Electrolyte disturbances (K⁺/Mg²⁺) can provoke arrhythmias like Torsades de Pointes[cite: 205].
        </p>
      </CardContent>
    </Card>
  )
}