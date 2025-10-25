"use client"

import { Zap, Brain, Activity, Target } from "lucide-react"
import { motion } from "motion/react"

const stats = {
  alphaBetaRatio: { value: 1.2, max: 2, unit: "" },
  thetaPower: { value: 45, max: 100, unit: "μV²" },
  waveVariability: { value: 0.35, max: 1, unit: "" },
  deltaActivity: { value: 0.25, max: 1, unit: "" },
}

const statIcons = {
  alphaBetaRatio: Brain,
  thetaPower: Activity,
  waveVariability: Zap,
  deltaActivity: Target,
}

export default function EEGStatsChart() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      {Object.entries(stats).map(([key, { value,  unit }], index) => {
        const Icon = statIcons[key as keyof typeof statIcons]
        return (
          <motion.div
            key={key}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Icon className="h-10 w-10 mb-2" />
            <span className="text-sm font-medium capitalize text-gray-700">{key.replace(/([A-Z])/g, " $1")}</span>
            <span className="text-2xl font-bold text-blue-800">{value}{unit}</span>
          </motion.div>
        )
      })}
    </div>
  )
}
