"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "A multiple bar chart for cell counts"

const chartData = [
  { sample: "Cell Size", normal: 120, cancerous: 30 },
  { sample: "Cell Count", normal: 95, cancerous: 45 },
  { sample: "Healthy Count", normal: 140, cancerous: 25 },
]

const chartConfig = {
  normal: {
    label: "Normal Cells",
    color: "var(--chart-1)",
  },
  cancerous: {
    label: "Cancerous Cells",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function ChartBarCellComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cell Count Comparison</CardTitle>
        <CardDescription>Normal vs Cancerous Cells</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} barCategoryGap="20%">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="sample"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="normal" fill="var(--color-normal)" radius={4} />
            <Bar dataKey="cancerous" fill="var(--color-cancerous)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Comparison of normal vs cancerous cells <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing counts for 6 samples
        </div>
      </CardFooter>
    </Card>
  )
}
