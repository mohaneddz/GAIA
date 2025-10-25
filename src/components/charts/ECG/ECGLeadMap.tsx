"use client"

import { CardContent } from "@/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

type Electrode = {
  channel: string
  location: string
  value: number
  x: number
  y: number
  isGround?: boolean
}

const VIEWBOX = { width: 220, height: 280 }
const hubPoint = { x: 120, y: 160 }

const electrodes: Electrode[] = [
  { channel: "RA", location: "Right Arm", value: 5, x: 42, y: 90 },
  { channel: "LA", location: "Left Arm", value: 3, x: 178, y: 85 },
  { channel: "RL", location: "Right Leg (Ground)", value: 2, x: 60, y: 265, isGround: true },
  { channel: "LL", location: "Left Leg", value: 4, x: 170, y: 260 },
  { channel: "V1", location: "4th ICS • Right sternal border", value: 6, x: 112, y: 155 },
  { channel: "V2", location: "4th ICS • Left sternal border", value: 7, x: 130, y: 155 },
  { channel: "V3", location: "Midway between V2 & V4", value: 1, x: 138, y: 172 },
  { channel: "V4", location: "5th ICS • Midclavicular", value: 8, x: 148, y: 188 },
  { channel: "V5", location: "Horizontal to V4 • Ant. axillary", value: 9, x: 162, y: 205 },
  { channel: "V6", location: "Horizontal to V4 • Mid-axillary", value: 10, x: 175, y: 218 },
]

const getNoiseColor = (val: number) => {
  if (val <= 3) return "#16a34a"
  if (val <= 6) return "#eab308"
  return "#dc2626"
}

const getPatchFill = (val: number) => {
  if (val <= 3) return "rgba(34, 197, 94, 0.18)"
  if (val <= 6) return "rgba(250, 204, 21, 0.22)"
  return "rgba(248, 113, 113, 0.28)"
}

const getPatchShadow = (val: number) => {
  if (val <= 3) return "rgba(34, 197, 94, 0.25)"
  if (val <= 6) return "rgba(250, 204, 21, 0.25)"
  return "rgba(248, 113, 113, 0.35)"
}

const getPatchSize = (val: number) => Math.min(64, 28 + val * 2.2)
const getWireWidth = (val: number) => 2 + val * 0.2
const getNoiseLabel = (val: number) => (val <= 3 ? "Low noise" : val <= 6 ? "Moderate noise" : "High noise")

export default function ECGTopographicCard() {
  return (
    <div className="border p-4 rounded-lg">
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-emerald-500" /> Low
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-yellow-400" /> Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-red-500" /> High
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <svg viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`} className="h-full w-full ">
            <defs>
              <linearGradient id="torsoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(148, 163, 184, 0.25)" />
                <stop offset="100%" stopColor="rgba(71, 85, 105, 0.35)" />
              </linearGradient>
            </defs>
            <path
              d="M110 52.5 C137 52.5 159.5 88.5 159.5 129 L159.5 210 C159.5 246 137 277.5 110 277.5 C83 277.5 60.5 246 60.5 210 L60.5 129 C60.5 88.5 83 52.5 110 52.5 Z"
              fill="url(#torsoGradient)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />
            {electrodes.map((lead) => (
              <line
                key={`wire-${lead.channel}`}
                x1={lead.x}
                y1={lead.y}
                x2={hubPoint.x}
                y2={hubPoint.y}
                stroke={getNoiseColor(lead.value)}
                strokeWidth={getWireWidth(lead.value)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={lead.isGround ? "4 3" : undefined}
                strokeOpacity={lead.isGround ? 0.6 : 0.85}
              />
            ))}
          </svg>

          {electrodes.map((lead) => {
            const width = getPatchSize(lead.value)
            const height = Math.round(width * 0.55)
            return (
              <Tooltip key={`patch-${lead.channel}`}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="absolute flex cursor-pointer items-center justify-center border font-semibold text-[11px] text-black shadow-md transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    style={{
                      left: `${(lead.x / VIEWBOX.width) * 100}%`,
                      top: `${(lead.y / VIEWBOX.height) * 100}%`,
                      width: `${width}px`,
                      height: `${height}px`,
                      marginLeft: `${-width / 2}px`,
                      marginTop: `${-height / 2}px`,
                      backgroundColor: getPatchFill(lead.value),
                      borderColor: getNoiseColor(lead.value),
                      boxShadow: `0 6px 14px ${getPatchShadow(lead.value)}`,
                    }}
                  >
                    {lead.channel}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{lead.channel}</p>
                    <p className="text-muted-foreground">{lead.location}</p>
                    <p className="font-medium">
                      {getNoiseLabel(lead.value)} · {lead.value} µV
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </CardContent>
    </div>
  )
}
