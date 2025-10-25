import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type EEGLead = {
  id: string;
  angle: number; // in degrees around the head
  radius: number; // distance from hub
  active: boolean;
};

// Center point
const hubPoint = { x: 100, y: 100 };

// Leads placed in a circular layout
const leads: EEGLead[] = [
  { id: "Fp1", angle: 110, radius: 70, active: true },
  { id: "Fp2", angle: 70, radius: 70, active: true },
  { id: "F3", angle: 140, radius: 70, active: true },
  { id: "F4", angle: 40, radius: 70, active: false },
  { id: "C3", angle: 160, radius: 50, active: true },
  { id: "C4", angle: 20, radius: 50, active: true },
  { id: "P3", angle: 200, radius: 60, active: false },
  { id: "P4", angle: 340, radius: 60, active: true },
  { id: "O1", angle: 240, radius: 75, active: true },
  { id: "O2", angle: 300, radius: 75, active: false },
  { id: "T3", angle: 180, radius: 55, active: true },
  { id: "T4", angle: 0, radius: 55, active: true },
];

// Convert polar coordinates to SVG coordinates
const polarToCartesian = (angleDeg: number, radius: number) => {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: hubPoint.x + radius * Math.cos(angleRad),
    y: hubPoint.y - radius * Math.sin(angleRad),
  };
};

const getLeadColor = (active: boolean) =>
  active ? "bg-green-500 border-green-700 text-white" : "bg-gray-300 border-gray-500 text-gray-700";

export default function EEGCircularMap() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <div className="relative w-full h-[220px] bg-linear-to-b from-blue-100 to-blue-200 rounded-lg border">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            {/* Head outline */}
            <circle cx={hubPoint.x} cy={hubPoint.y} r={80} fill="none" stroke="#3b82f6" strokeWidth="2" />

            {/* Wires */}
            {leads.map((lead) => {
              const { x, y } = polarToCartesian(lead.angle, lead.radius);
              return (
                <line
                  key={`wire-${lead.id}`}
                  x1={hubPoint.x}
                  y1={hubPoint.y}
                  x2={x}
                  y2={y}
                  stroke={lead.active ? "#16a34a" : "#6b7280"}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray={lead.active ? undefined : "4 3"}
                />
              );
            })}
          </svg>

          {/* Leads */}
          {leads.map((lead, index) => {
            const { x, y } = polarToCartesian(lead.angle, lead.radius);
            return (
              <Tooltip key={lead.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`absolute w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-pointer ${getLeadColor(
                      lead.active
                    )}`}
                    style={{
                      left: x + 90,
                      top: y,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {lead.id}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{lead.id}</p>
                    <p className="text-muted-foreground">{lead.active ? "Active" : "Inactive"}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
