import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain } from "lucide-react"
import { motion } from "motion/react"

export default function EEGAlphaWaveAnalyzer() {
  const alphaPower = 60
  const frequency = 10

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Card className=" border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            <Brain className="w-6 h-6" /> Alpha Wave Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-blue-700">Frequency: {frequency} Hz</p>
            <p className="text-sm text-gray-600">Optimal range: 8-12 Hz</p>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Alpha Power</span>
              <span className="font-bold">{alphaPower} μV²</span>
            </div>
          </div>
          <Progress value={alphaPower} className="mt-2" />
        </CardContent>
      </Card>
    </motion.div>
  )
}
