import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Zap } from "lucide-react";

// The event list has been updated with important ECG anomaly notices.
const unusualEvents = [
  // Document-relevant: Pattern suggesting acute myocardial infarction (STEMI)
  { timestamp: "2024-10-04 10:05", explanation: "Acute ST Elevation (Possible STEMI)", icon: AlertTriangle },
  // Document-relevant: High-risk ischemia pattern
  { timestamp: "2024-10-04 11:30", explanation: "Deep ST Depression (Reciprocal Changes)", icon: Zap },
  // Clinically critical: High risk of Torsades de Pointes
  { timestamp: "2024-10-04 14:15", explanation: "Pathological QTc Prolongation (> 500ms)", icon: AlertTriangle },
  // Clinically critical: Suggests Ventricular Tachycardia or severe block
  { timestamp: "2024-10-04 15:40", explanation: "Wide QRS Tachycardia (> 120ms)", icon: Zap },
  // Clinically critical: Indicates severe rate issue requiring immediate attention
  { timestamp: "2024-10-04 17:55", explanation: "New Severe Bradycardia (HR < 40 bpm)", icon: Zap },
  // Document-relevant: Baseline variability/noise (Artifact is a common issue)
  { timestamp: "2024-10-04 20:20", explanation: "Significant Baseline Artifact Detected", icon: AlertTriangle },
];

export default function ECGEventsList() {
  return (
    <Card className="shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          ECG Critical Notices
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          List of detected cardiac anomalies and high-risk patterns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4  overflow-y-auto">
          {unusualEvents.map((event, index) => {
            const Icon = event.icon;
            // Determine text color based on event type (using existing icons for color mapping)
            let textColor = "text-foreground";
            if (event.icon === AlertTriangle) {
                // Critical/Emergent warnings are typically red/orange
                textColor = "text-red-700 dark:text-red-600";
            } else if (event.icon === Zap) {
                // Electrical/Rhythm warnings are typically amber/blue
                textColor = "text-amber-700 dark:text-amber-600";
            }
            // Note: The 'Brain' icon is not used for ECG, but its color would be 'text-foreground' by default if kept.

            return (
              <div key={index} className="flex items-center space-x-4 p-3 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-border">
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}