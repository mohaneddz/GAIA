import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { HeartPulse, Activity, TrendingUp, LayoutGrid, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Core Components (Existing and Provided)
import ECGChart from "@/components/charts/ECG/ECGChart";
import StatsCard from "@/components/charts/ECG/ECGStatsChart"; // Key Metrics (HR, QTc, etc.)
import ECGEventsList from "@/components/charts/ECG/ECGEventsList"; // Arrhythmia List
import ECGTrendChart from "@/components/charts/ECG/ECGTrendChart"; // Time-Series Trends
import ECGLeadMap from "@/components/charts/ECG/ECGLeadMap"; // Lead Localization (Renamed for clarity)

// New Components for Missing Features
import ECGSTSegmentAnalyzer from "@/components/charts/ECG/ECGSTSegmentAnalyzer";
import ECGTachycardiaClassifier from "@/components/charts/ECG/ECGTachycardiaClassifier";
import ECGSampleQuality from "@/components/charts/ECG/ECGSampleQuality";
import ECGLabTestsCard from "@/components/charts/ECG/ECGLabTestsCard";


const EcgAi = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
      <div className="text-center col-span-2">
        <h1 className="text-3xl font-bold text-gray-800">AI ECG Analysis</h1>
        <p className="text-gray-500">Automated detection and analysis of ECG signals</p>
      </div>
      {/* New Input Section */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Input ECG Data</CardTitle>
          <CardDescription>Enter patient details and upload ECG file for analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input placeholder="Patient ID" />
            <Input type="file" accept=".ecg,.txt" />
            <Button>Submit</Button>
          </div>
        </CardContent>
      </Card>

      {/* 1. Main ECG Waveform Chart (Spans 2 Columns) */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-600" /> Real-Time ECG Viewer
          </CardTitle>
          <CardDescription>12-Lead Display with P-QRS-T complex segmentation</CardDescription>
        </CardHeader>
        <CardContent>
          <ECGChart />
        </CardContent>
      </Card>

      {/* 2. Statistical Summary Card (The existing StatsCard) */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" /> Key Cardiac Metrics
          </CardTitle>
          <CardDescription>HR, QTc, ST-Deviation, and Rhythm Variability</CardDescription>
        </CardHeader>
        <CardContent>
          <StatsCard />
        </CardContent>
      </Card>

      {/* 3. Arrhythmia and Event List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" /> Detected Cardiac Events
          </CardTitle>
          <CardDescription>A list of P-wave, QRS, and T-wave abnormalities</CardDescription>
        </CardHeader>
        <CardContent>
          <ECGEventsList />
        </CardContent>
      </Card>

      <div className="col justify-between">
        {/* 4. ST-Segment Analysis (New Feature) */}
        <ECGSTSegmentAnalyzer />
        {/* 5. Tachycardia Classification (New Feature) */}
        <ECGTachycardiaClassifier />
      </div>

      {/* 6. Metric Trend Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" /> Time-Series Trend Analysis
          </CardTitle>
          <CardDescription>Hourly evolution of Heart Rate and QTc interval</CardDescription>
        </CardHeader>
        <CardContent>
          <ECGTrendChart />
        </CardContent>
      </Card>

      {/* 7. Ischemia Localization Map (ECGMindMap) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-purple-600" /> Ischemia Localization Map
          </CardTitle>
          <CardDescription>Suggested area of involvement based on lead grouping</CardDescription>
        </CardHeader>
        <CardContent>
          <ECGLeadMap />
        </CardContent>
      </Card>

      {/* 8. Signal Quality & Electrode Check (New Feature) */}
      <ECGSampleQuality />

      {/* 9. Cardiac Lab Tests (New Feature) */}
      <ECGLabTestsCard />

    </div>
  );
};

export default EcgAi;