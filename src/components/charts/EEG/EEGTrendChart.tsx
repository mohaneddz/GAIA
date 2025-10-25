"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { motion } from "motion/react"

const data = [
  { hour: 1, alphaPower: 50, thetaActivity: 30 },
  { hour: 2, alphaPower: 55, thetaActivity: 35 },
  { hour: 3, alphaPower: 52, thetaActivity: 32 },
  { hour: 4, alphaPower: 58, thetaActivity: 38 },
  { hour: 5, alphaPower: 60, thetaActivity: 40 },
]

export default function EEGTrendChart() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Power/Activity', angle: -90, position: 'insideLeft' }} />
          <Tooltip contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }} />
          <Legend />
          <Area type="monotone" dataKey="alphaPower" stackId="1" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.6} />
          <Area type="monotone" dataKey="thetaActivity" stackId="1" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
