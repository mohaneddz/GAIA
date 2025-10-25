import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import { motion } from "motion/react"

const electrodes = [
  { id: "F3", status: "connected" },
  { id: "F4", status: "connected" },
  { id: "C3", status: "disconnected" },
  { id: "C4", status: "connected" },
]

export default function EEGSampleQuality() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="full border-green-200">
        <CardHeader>
          <CardTitle >Signal Quality & Electrodes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Overall Quality: Good</span>
          </div>
          <p className="text-sm text-gray-600">Noise level: Low (5%)</p>
          <div className="grid grid-cols-2 gap-2">
            {electrodes.map((electrode) => (
              <div key={electrode.id} className="flex items-center space-x-2">
                {electrode.status === "connected" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs">{electrode.id}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
