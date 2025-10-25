import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { HeartPulse, Activity, TrendingUp, LayoutGrid, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Core Components (EEG-specific)
import EEGChart from "@/components/charts/EEG/EEGChart";
import EEGStatsChart from "@/components/charts/EEG/EEGStatsChart"; // Key Metrics (Alpha/Beta, Theta, etc.)
import EEGEventsList from "@/components/charts/EEG/EEGEventsList"; // Abnormal Patterns List
import EEGTrendChart from "@/components/charts/EEG/EEGTrendChart"; // Time-Series Trends
import EEGLeadMap from "@/components/charts/EEG/EEGLeadMap"; // Brain Localization

// New Components for Missing Features
import EEGAlphaWaveAnalyzer from "@/components/charts/EEG/EEGAlphaWaveAnalyzer";
import EEGSeizureClassifier from "@/components/charts/EEG/EEGSeizureClassifier";
import EEGSampleQuality from "@/components/charts/EEG/EEGSampleQuality";
import EEGLabTestsCard from "@/components/charts/EEG/EEGLabTestsCard";

const EcgAi = () => {
  return (
    <div className="full grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">

      <div className="w-full text-center col-span-2">
        <h1 className="text-3xl font-bold text-gray-800">AI EEG Analysis</h1>
        <p className="text-gray-500">Automated detection and analysis of ECG signals</p>
      </div>

      {/* New Input Section */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Input EEG Data</CardTitle>
          <CardDescription>Enter patient details and upload EEG file for analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input placeholder="Patient ID" />
            <Input type="file" accept=".eeg,.txt" />
            <Button>Submit</Button>
          </div>
        </CardContent>
      </Card>

      {/* 1. Main EEG Waveform Chart (Spans 2 Columns) */}
      <Card className="col-span-1 lg:col-span-2  min-h-64">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-600" /> Real-Time EEG Viewer
          </CardTitle>
          <CardDescription>Multi-channel display with alpha, beta, theta wave segmentation</CardDescription>
        </CardHeader>
        <CardContent>
          <EEGChart />
        </CardContent>
      </Card>

      {/* 2. Statistical Summary Card */}
      <Card className="col-span-2  min-h-64">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" /> Key Brain Metrics
          </CardTitle>
          <CardDescription>Alpha/Beta ratio, Theta power, and Wave Variability</CardDescription>
        </CardHeader>
        <CardContent>
          <EEGStatsChart />
        </CardContent>
      </Card>

      {/* 3. Abnormal Patterns and Event List */}
      <Card className=" min-h-64">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" /> Detected Brain Events
          </CardTitle>
          <CardDescription>A list of spike, seizure, and wave abnormalities</CardDescription>
        </CardHeader>
        <CardContent>
          <EEGEventsList />
        </CardContent>
      </Card>

      <div className="col justify-between gap-4">
        {/* 4. Alpha Wave Analysis */}
        <EEGAlphaWaveAnalyzer />
        {/* 5. Seizure Classification */}
        <EEGSeizureClassifier />
      </div>

      {/* 6. Metric Trend Over Time */}
      <Card className=" min-h-64">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" /> Time-Series Trend Analysis
          </CardTitle>
          <CardDescription>Hourly evolution of Alpha power and Theta activity</CardDescription>
        </CardHeader>
        <CardContent>
          <EEGTrendChart />
        </CardContent>
      </Card>

      {/* 7. Brain Activity Localization Map */}
      <Card className=" min-h-64">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-purple-600" /> Brain Activity Localization Map
          </CardTitle>
          <CardDescription>Suggested areas of activity based on electrode grouping</CardDescription>
        </CardHeader>
        <CardContent>
          <EEGLeadMap />
        </CardContent>
      </Card>

      {/* 8. Signal Quality & Electrode Check */}
      <EEGSampleQuality />

      {/* 9. Neurological Lab Tests */}
      <EEGLabTestsCard />

    </div>
  );
};

export default EcgAi;