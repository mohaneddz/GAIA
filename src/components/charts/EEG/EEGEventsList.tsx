import {
  CardContent,
} from "@/components/ui/card"
import { AlertTriangle, Zap } from "lucide-react"

// EEG-specific events
const eegEvents = [
  { timestamp: "10:05", explanation: "High amplitude spike in frontal lobe", icon: AlertTriangle },
  { timestamp: "10:12", explanation: "Generalized seizure activity detected", icon: Zap },
  { timestamp: "10:18", explanation: "Abnormal theta wave burst", icon: AlertTriangle },
]

export default function EEGEventsList() {
  return (
    <div >
      <CardContent>
        <div className="space-y-4 overflow-y-auto">
          {eegEvents.map((event, index) => {
            const Icon = event.icon
            let textColor = "text-foreground"
            if (event.icon === AlertTriangle) {
              textColor = "text-red-700 dark:text-red-600"
            } else if (event.icon === Zap) {
              textColor = "text-amber-700 dark:text-amber-600"
            }

            return (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-border"
              >
                <Icon className={`h-6 w-6 ${textColor}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {event.timestamp}
                  </p>
                  <p className={`text-sm truncate font-bold ${textColor}`}>
                    {event.explanation}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </div>
  )
}
