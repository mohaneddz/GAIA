import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Brain, Activity } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageTabs from "@/components/charts/Brain/ImageTabs"
import VisualEnhancement from "@/components/charts/Brain/VisualEnhancement"

const ScanAnalyzer = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 full">

      <div className="text-center col-span-2">
        <h1 className="text-3xl font-bold text-gray-800">AI MRI Analyzer</h1>
        <p className="text-gray-500">Automated detection and analysis of brain MRI</p>
      </div>

      {/* New Input Section */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Input Brain Scan Data</CardTitle>
          <CardDescription>Enter patient details and upload MRI/CT scan file for analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input placeholder="Patient ID" />
            <Input type="file" accept=".jpg,.png,.dicom,.nii" />
            <Button>Submit</Button>
          </div>
        </CardContent>
      </Card>

      {/* 1. Core Image Viewer */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Brain Scan Viewer</CardTitle>
          <CardDescription>MRI / CT scans with AI-assisted overlays</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageTabs />
        </CardContent>
      </Card>

      {/* 2. Tumor Segmentation & Analysis */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" /> Tumor Segmentation & Analysis
          </CardTitle>
          <CardDescription>AI-driven tumor detection and medical metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Center status */}
          <div className="flex flex-col items-center justify-center py-3 rounded-xl bg-neutral-50 border">
            <p className="text-base font-semibold text-neutral-800">
              Low-Grade Glioma (Stage II)
            </p>
            <p className="text-xs text-neutral-500">Benign growth — monitor progression</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-y-1 text-sm text-neutral-600 mt-2">
            <p>Volume:</p><p className="text-right font-medium text-neutral-800">23.6 mm³</p>
            <p>Max Diameter:</p><p className="text-right font-medium text-neutral-800">7.2 mm</p>
            <p>Density Index:</p><p className="text-right font-medium text-neutral-800">0.78</p>
            <p>Confidence:</p><p className="text-right font-medium text-neutral-800">92%</p>
          </div>

          <p className="mt-2 text-xs text-neutral-500 italic">
            Recommendation: MRI contrast follow-up in 6 months.
          </p>
        </CardContent>
      </Card>

      {/* 3. Neural Activity Classification */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" /> Neural Activity Classification
          </CardTitle>
          <CardDescription>ECG / fMRI pattern classification results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Main status */}
          <div className="flex flex-col items-center justify-center py-3 rounded-xl bg-neutral-50 border">
            <p className="text-base font-semibold text-neutral-800">Unusual Activity Detected</p>
            <p className="text-xs text-neutral-500">Mild frontal lobe hyperactivity — review advised</p>
          </div>

          <div className="grid grid-cols-2 gap-y-1 text-sm text-neutral-600 mt-2">
            <p>Detected Pattern:</p><p className="text-right font-medium text-neutral-800">Frontal Hyperactivity</p>
            <p>Power Spectrum:</p><p className="text-right font-medium text-neutral-800">Beta 18–25 Hz</p>
            <p>Hemisphere:</p><p className="text-right font-medium text-neutral-800">Left Dominant</p>
            <p>Connectivity:</p><p className="text-right font-medium text-neutral-800">0.67 (Moderate)</p>
          </div>

          <p className="mt-2 text-xs text-neutral-500 italic">
            Clinical Note: Suggests localized over-excitation — follow-up ECG recommended.
          </p>
        </CardContent>
      </Card>

      {/* 4. Visual Enhancement Tools */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Visual Enhancement</CardTitle>
          <CardDescription>Adjust filters for clearer diagnostic imaging</CardDescription>
        </CardHeader>
        <CardContent>
          <VisualEnhancement imageSrc="/images/brain/image3.png" />
        </CardContent>
      </Card>

    </div>
  )
}

export default ScanAnalyzer
