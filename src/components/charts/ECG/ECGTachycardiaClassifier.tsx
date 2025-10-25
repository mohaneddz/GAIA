import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AlertOctagon } from "lucide-react"

export default function ECGTachycardiaClassifier() {
  // Mock data based on Green Team.pdf (VT/SVT analysis)
  const classificationData = {
    heartRate: 175,
    QRSWidth: 140, // >120 ms suggests VT [cite: 68]
    rhythm: 'Regular',
    AVAssociation: 'Dissociation detected', // Favors VT [cite: 69]
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-purple-600" /> Tachycardia Classification
        </CardTitle>
        <CardDescription>Differentiating Monomorphic VT from SVT with Aberrancy[cite: 65].</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main Status */}
        <div className="flex flex-col items-center justify-center py-3 rounded-xl bg-purple-50 border border-purple-200">
          <p className="text-base font-semibold text-purple-800">
            High Likelihood: Ventricular Tachycardia (VT)
          </p>
          <p className="text-xs text-purple-600">Wide QRS and AV dissociation indicate ventricular origin.</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-y-1 text-sm text-neutral-600 mt-2">
          <p>Heart Rate:</p><p className="text-right font-medium text-neutral-800">{classificationData.heartRate} bpm</p>
          <p>QRS Width:</p><p className="text-right font-medium text-red-600">{classificationData.QRSWidth} ms (Wide)</p>
          <p>Rhythm:</p><p className="text-right font-medium text-neutral-800">{classificationData.rhythm}</p>
          <p>P-QRS Relation:</p><p className="text-right font-medium text-red-600">{classificationData.AVAssociation}</p>
        </div>

        <p className="mt-2 text-xs text-neutral-500 italic">
          Alert clinician for urgent review if VT suspected[cite: 73].
        </p>
      </CardContent>
    </Card>
  )
}