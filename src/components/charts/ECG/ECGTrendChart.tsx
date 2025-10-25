"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A mixed bar chart visualizing the frequency of eight high-risk ECG events."

// --- 1. ECG Specific Data (Updated to 8 Bars) ---
const ecgChartData = [
  // Ischemic Events
  { event: "stemi", count: 2, fill: "var(--color-stemi)" },       // ST Elevation
  { event: "nsemi", count: 4, fill: "var(--color-nsemi)" },       // ST Depression/Ischemia
  // Rate/Rhythm Events
  { event: "tachycardia", count: 15, fill: "var(--color-tachycardia)" }, // Heart Rate > 100 bpm
  { event: "bradycardia", count: 6, fill: "var(--color-bradycardia)" },   // Heart Rate < 60 bpm
  // Severe Arrhythmias / Conduction
  { event: "afib", count: 12, fill: "var(--color-afib)" },         // Atrial Fibrillation episode
  { event: "vt", count: 1, fill: "var(--color-vt)" },             // Ventricular Tachycardia episode
  { event: "pause", count: 3, fill: "var(--color-pause)" },       // Significant Pause/Asystole
  { event: "bbb", count: 5, fill: "var(--color-bbb)" },           // New-Onset Bundle Branch Block
]

// --- 2. ECG Specific Configuration (Updated) ---
const ecgChartConfig = {
  count: {
    label: "Event Count",
  },
  stemi: {
    label: "ST-Elevation Alert",
    color: "hsl(217, 93%, 30%)", // Variation of #0958ee
  },
  nsemi: {
    label: "Ischemia Alert (ST Dep)",
    color: "hsl(217, 93%, 40%)", // Variation of #0958ee
  },
  tachycardia: {
    label: "Tachycardia",
    color: "hsl(217, 93%, 50%)", // Variation of #0958ee
  },
  bradycardia: {
    label: "Bradycardia",
    color: "hsl(217, 93%, 60%)", // Variation of #0958ee
  },
  afib: {
    label: "Atrial Fibrillation",
    color: "hsl(217, 93%, 70%)", // Variation of #0958ee
  },
  vt: {
    label: "Ventricular Tachycardia",
    color: "hsl(217, 93%, 80%)", // Variation of #0958ee
  },
  pause: {
    label: "Pause/Asystole (>3s)",
    color: "hsl(217, 93%, 90%)", // Variation of #0958ee
  },
  bbb: {
    label: "New BBB",
    color: "hsl(217, 93%, 35%)", // Variation of #0958ee
  },
} satisfies ChartConfig

export default function HighRiskECGEventsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical ECG Event Frequency</CardTitle>
        <CardDescription>Count of 8 critical findings detected in the Last 24 Hours</CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={ecgChartConfig} className="h-full min-h-110 w-full">
          <BarChart
            accessibilityLayer
            data={ecgChartData} 
            layout="vertical"
            height={400}
            margin={{
              left: 40,
            }}
          >
            <YAxis
              dataKey="event" 
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                ecgChartConfig[value as keyof typeof ecgChartConfig]?.label
              }
            />
            <XAxis dataKey="count" type="number" hide /> 
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />} 
            />
            <Bar dataKey="count" layout="vertical" radius={5} /> 
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Tachycardia (15) and Atrial Fibrillation (12) are the most frequent. <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Last 24 hours.
        </div>
      </CardFooter>
    </Card>
  )
}
