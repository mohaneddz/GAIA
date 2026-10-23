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
import type { SignalSample } from "@/lib/signalApi"

type Props = { data: SignalSample[] | null; error?: string | null }

export default function EEGChartInteractive({ data, error }: Props) {
  const channels = [
    "Fp1",
    "Fp2",
    "F3",
    "F4",
    "C3",
    "C4",
    "P3",
    "P4",
    "O1",
    "O2",
    "T3",
    "T4",
  ]
  const [activeChannel, setActiveChannel] = React.useState(channels[0])

  // minimal dummy config (required by ChartContainer)
  const chartConfig = {
    [activeChannel]: {
      label: activeChannel.toUpperCase(),
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0 mt-4">
          <CardTitle>EEG Channels</CardTitle>
          <CardDescription>
            {error && data ? `${error}, showing the last window` : "Showing 12-channel simulated EEG signals"}
          </CardDescription>
        </div>
        <div className="flex overflow-x-auto">
          {channels.map((ch) => (
            <button
              key={ch}
              data-active={activeChannel === ch}
              onClick={() => setActiveChannel(ch)}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 px-4 py-2 text-xs sm:text-sm sm:px-6 sm:py-3 border-l"
            >
              {ch.toUpperCase()}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        {!data ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            {error ?? "Loading signal..."}
          </div>
        ) : (
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
                  nameKey={activeChannel}
                  labelFormatter={(v) => `t=${Number(v).toFixed(2)}s`}
                />
              }
            />
            <Line
              dataKey={activeChannel}
              type="monotone"
              stroke="var(--color-foreground)"
              strokeWidth={1.8}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
