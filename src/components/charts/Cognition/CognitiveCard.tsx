import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { motion } from "motion/react"

type Status = "Excellent" | "Normal" | "Mild Concern" | "Low";

interface CognitiveCardProps {
  title: string;
  value: number;
  status: Status;
  description: string;
}

export default function CognitiveCard({ title, value, status, description }: CognitiveCardProps) {
  // Status pastel colors
  const statusColors = {
    Excellent: "bg-green-100 text-green-800",
    Normal: "bg-blue-100 text-blue-800",
    "Mild Concern": "bg-yellow-100 text-yellow-800",
    Low: "bg-red-100 text-red-800",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col justify-between gap-4 p-5 border rounded-2xl bg-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
        {/* Header */}
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
          <CardDescription className="text-gray-500 text-sm">{description}</CardDescription>
        </CardHeader>

        {/* Main Value */}
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-gray-800">{value}%</span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
              {status}
            </span>
          </div>

          {/* Progress visualization */}
          <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${value}%` }}
              className={`h-4 rounded-full ${statusColors[status].split(" ")[0]} transition-all duration-500`}
            />
          </div>

          {/* Mini bar visualization */}
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
          </div>

          {/* Symbolic circular indicators */}
          <div className="flex justify-center mt-2 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= Math.ceil(value / 20) ? statusColors[status].split(" ")[0] : "bg-gray-200"
                } transition-all duration-500`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
