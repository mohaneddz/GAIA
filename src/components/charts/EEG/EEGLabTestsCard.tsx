import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"

const tests = [
  { name: "CSF Analysis", status: "Normal", color: "bg-green-500" },
  { name: "Genetic Markers", status: "Pending", color: "bg-yellow-500" },
  { name: "Blood Tests", status: "Abnormal", color: "bg-red-500" },
]

export default function EEGLabTestsCard() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className=" border-purple-200">
        <CardHeader>
          <CardTitle >Neurological Lab Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tests.map((test, index) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 bg-white rounded shadow-sm"
            >
              <span className="text-sm font-medium">{test.name}</span>
              <Badge className={`${test.color} text-white`}>{test.status}</Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
