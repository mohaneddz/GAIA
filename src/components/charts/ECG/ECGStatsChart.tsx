"use client"
// Updated icons to be more relevant to cardiac function and rhythm
import { Zap, HeartPulse, Clock, TrendingDown, Maximize, Target } from "lucide-react"

export const description = "Statistical summary card"
export const iframeHeight = "600px"
export const containerClassName =
  "[&>div]:w-full [&>div]:max-w-md flex items-center justify-center min-h-svh"

// Example ECG statistical values (replace with computed values from data as needed)
const stats = {
  // ST-segment Amplitude Deviation (mm)
  ST_dev: 1.2, 
  // Corrected QT Interval (ms)
  QTc: 485,
  // Heart Rate (bpm)
  HR: 85,
  // QRS Complex Width (ms)
  QRS_width: 105,
  // R-R Interval Standard Deviation (ms) - Rhythm regularity
  RR_std: 35.8,
  // P-wave Correlation Index (Unitless, e.g., 0-1) - Consistency of P-waves
  P_corr: 0.25, 
}

const statIcons = {
  ST_dev: TrendingDown, // For deviation/depression
  QTc: Clock, // For time interval
  HR: HeartPulse, // For rate
  QRS_width: Maximize, // For width
  RR_std: Zap, // For irregularity/variability
  P_corr: Target, // For consistency/correlation
}

export default function ECGStatsChart() {
  // Helper function to determine if a stat is good or dangerous
  const getValueColor = (key: string, value: number) => {
    switch (key) {
      case 'ST_dev':
        return value <= 1.0 ? 'text-green-600' : 'text-red-600'; // Low deviation good
      case 'QTc':
        return value >= 350 && value <= 450 ? 'text-green-600' : 'text-red-600'; // Normal range
      case 'HR':
        return value >= 60 && value <= 100 ? 'text-green-600' : 'text-red-600'; // Normal HR
      case 'QRS_width':
        return value <= 120 ? 'text-green-600' : 'text-red-600'; // Normal width
      case 'RR_std':
        return value <= 50 ? 'text-green-600' : 'text-red-600'; // Low variability good
      case 'P_corr':
        return value >= 0.5 ? 'text-green-600' : 'text-red-600'; // High correlation good
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="shadow-lg bg-card ">
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          {Object.entries(stats).map(([key, value]) => {
            const Icon = statIcons[key as keyof typeof statIcons]
            // Format for display
            let displayValue = '';
            let unit = '';
            if (key === 'ST_dev') {
              displayValue = value.toFixed(1);
              unit = 'mm';
            } else if (key === 'QTc' || key === 'QRS_width' || key === 'RR_std') {
              displayValue = value.toFixed(0);
              unit = 'ms';
            } else if (key === 'HR') {
              displayValue = value.toFixed(0);
              unit = 'bpm';
            } else if (key === 'P_corr') {
              displayValue = value.toFixed(2);
              unit = '';
            }
            
            const valueColor = getValueColor(key, value);
            
            return (
              <div key={key} className="flex flex-col items-center justify-center p-4 bg-background border rounded-lg shadow-sm hover:shadow-md hover:bg-muted/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
                <Icon className="h-8 w-8 text-foreground mb-2" />
                <span className="text-sm font-medium capitalize text-muted-foreground">{key.replace('_', ' ')}</span>
                <span className={`text-xl font-bold ${valueColor}`}>
                  {displayValue} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
                </span>
              </div>
            )
          })}
        </div>
    </div>
  )
}