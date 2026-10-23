"use client"

import { Zap, Brain, Activity, Target } from "lucide-react"
import { motion } from "motion/react"
import type { EegMetrics } from "@/lib/signalApi"

const statIcons = {
  alphaBetaRatio: Brain,
  thetaPower: Activity,
  waveVariability: Zap,
  deltaActivity: Target,
}

const percent = (fraction: number) => `${(fraction * 100).toFixed(1)}%`

export default function EEGStatsChart({ metrics }: { metrics: EegMetrics | null }) {
  const stats = {
    alphaBetaRatio: metrics ? metrics.alphaBetaRatio.toFixed(2) : "--",
    thetaPower: metrics ? percent(metrics.thetaRelative) : "--",
    waveVariability: metrics ? metrics.waveVariability.toFixed(2) : "--",
    deltaActivity: metrics ? percent(metrics.deltaRelative) : "--",
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      {Object.entries(stats).map(([key, value], index) => {
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
            <span className="text-2xl font-bold text-blue-800">{value}</span>
          </motion.div>
        )
      })}
    </div>
  )
}
