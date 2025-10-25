// src/components/charts/Cognition/CognitiveAssessment.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import CognitiveCard from "@/components/charts/Cognition/CognitiveCard"
import { ChartAreaStacked } from "@/components/charts/Cognition/CognitionDecline"
import { ChartBarActive } from "@/components/charts/Cognition/CognitiveRanking"

type Status = "Excellent" | "Normal" | "Mild Concern" | "Low";

type Domain = {
  title: string;
  value: number;
  status: Status;
  description: string;
};

export default function CognitiveAssessment() {
  return (
    <div className="col full p-10 space-y-8 ">
      {/* Header Section */}
      <div className="center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">AI Cognitive Assessment</h1>
          <p className="text-gray-500 text-sm">AI-based analysis of neural and behavioral function</p>
        </div>
      </div>

      {/* Overall Health Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="p-6 rounded-2xl border bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">Overall Cognitive Health</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row justify-between items-center">
            <div className="">
              <div className="text-4xl font-extrabold text-green-700 mb-2">Healthy</div>
              <p className="text-gray-600 text-sm">
                No anomalies detected. Neural activity consistent with optimal cognitive balance.
              </p>
            </div>
            <div className="text-sm text-gray-500 mt-4 md:mt-0">
              <p>Confidence: <span className="font-medium text-gray-800">97%</span></p>
              <p>Last Updated: <span className="font-medium text-gray-800">26 Oct 2025</span></p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cognitive Domains */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {([
          { title: "Memory", value: 86, status: "Excellent" as Status, description: "AI evaluation of memory performance" },
          { title: "Attention", value: 79, status: "Normal" as Status, description: "Focus and sustained attention" },
          { title: "Language", value: 91, status: "Excellent" as Status, description: "Verbal comprehension & fluency" },
          { title: "Perception", value: 84, status: "Normal" as Status, description: "Visual-spatial & sensory processing" },
          { title: "Executive Control", value: 77, status: "Normal" as Status, description: "Planning, flexibility & decision-making" },
          { title: "Emotional Processing", value: 88, status: "Excellent" as Status, description: "AI analysis of emotional regulation" },
        ] as Domain[]).map((domain) => (
          <CognitiveCard
            key={domain.title}
            title={domain.title}
            value={domain.value}
            status={domain.status}
            description={domain.description}
          />
        ))}
      </motion.div>

      {/* Cognitive Prediction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <ChartAreaStacked />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <ChartBarActive />
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card className="p-4 border rounded-2xl bg-white shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">AI Recommendations</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Personalized insights based on analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-600 text-sm">
            <ul className="list-disc list-inside space-y-1">
              <li>Continue daily cognitive challenges (reading, memory games).</li>
              <li>Maintain consistent sleep, hydration, and light physical activity.</li>
              <li>Reassess every 6–8 months or upon cognitive change.</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" className="text-sm rounded-xl">
              Export Report
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
