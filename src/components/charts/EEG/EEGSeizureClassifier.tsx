import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle } from "lucide-react"
import { motion } from "motion/react"

export default function EEGSeizureClassifier() {
  const confidence = 85
  const type = "Generalized"

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Card className=" border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            <AlertTriangle className="w-6 h-6" /> Seizure Classification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-lg font-semibold">Type: {type}</p>
            <p className="text-sm text-gray-600">Detected pattern</p>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Confidence</span>
              <span className="font-bold">{confidence}%</span>
            </div>
            <Progress value={confidence} className="mt-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
