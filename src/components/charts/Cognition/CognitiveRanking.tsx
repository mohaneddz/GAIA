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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A grouped bar chart comparing user scores with average"

const chartData = [
  { domain: "Memory", user: 86, average: 75 },
  { domain: "Attention", user: 79, average: 70 },
  { domain: "Language", user: 91, average: 80 },
  { domain: "Perception", user: 84, average: 78 },
  { domain: "Executive", user: 77, average: 72 },
]

const chartConfig = {
  user: {
    label: "User",
    color: "var(--chart-1)",
  },
  average: {
    label: "Average",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartBarActive() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cognitive Performance vs Average</CardTitle>
        <CardDescription>Your scores compared to population average</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="domain"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="user"
              fill="var(--color-user)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="average"
              fill="var(--color-average)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          You are above average in most domains <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing cognitive domain scores
        </div>
      </CardFooter>
    </Card>
  )
}
