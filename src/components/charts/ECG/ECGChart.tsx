"use client"

import * as React from "react"
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { chartData } from "@/data/chartData"

export default function ECGChartInteractive({ data = chartData }) {
  const leads = [
    "lead1",
    "lead2",
    "lead3",
    "lead4",
    "lead5",
    "lead6",
    "lead7",
    "lead8",
    "lead9",
  ]
  const [activeLead, setActiveLead] = React.useState(leads[0])

  // minimal dummy config (required by ChartContainer)
  const chartConfig = {
    [activeLead]: {
      label: activeLead.toUpperCase(),
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0 mt-4">
          <CardTitle>ECG Channels</CardTitle>
          <CardDescription>
            Showing 9-lead simulated ECG signals
          </CardDescription>
        </div>
        <div className="flex overflow-x-auto">
          {leads.map((lead) => (
            <button
              key={lead}
              data-active={activeLead === lead}
              onClick={() => setActiveLead(lead)}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 px-4 py-2 text-xs sm:text-sm sm:px-6 sm:py-3 border-l"
            >
              {lead.toUpperCase()}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => Number(v).toFixed(1)}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[100px]"
                  nameKey={activeLead}
                  labelFormatter={(v) => `t=${Number(v).toFixed(2)}s`}
                />
              }
            />
            <Line
              dataKey={activeLead}
              type="monotone"
              stroke="var(--color-foreground)"
              strokeWidth={1.8}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
