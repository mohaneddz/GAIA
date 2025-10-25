import React, { useState, useRef } from 'react';
import { HeartPulse, ShieldAlert, Droplet, AlertTriangle, TrendingUp, TrendingDown, Upload, X } from 'lucide-react';
import CardioImageTabs from '@/components/charts/Cardiology/CardioImageTabs';
import CardioVisualEnhancement from '@/components/charts/Cardiology/CardioVisualEnhancement';
import { ModelConfidenceChart, FindingCard, ModelFinding } from '@/components/VisionCardioComponents';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// --- Mock Data: Heart Statistics and Vision Model Results ---
// Data is derived from ECG and Mediastinum/Aorta analysis points in the document.
const mockAnalysisResults: ModelFinding[] = [
  {
    id: 'st_elev',
    title: "Acute STEMI Detection",
    description: "Automated analysis of ST-segment elevation in contiguous leads.",
    icon: AlertTriangle,
    severity: 'High',
    result: "Elevation in V2-V4 (+3mm)",
    modelObservation: "Pattern suggestive of acute anterior STEMI. Threshold (>1mm) exceeded."
  },
  {
    id: 'ctr',
    title: "Cardiothoracic Ratio (CTR)",
    description: "Assessment of heart size on Chest X-ray (CTR on PA view).",
    icon: HeartPulse,
    severity: 'Moderate',
    result: "0.58 (Mildly Enlarged)",
    modelObservation: "CTR >0.5 suggests cardiomegaly. Recommend Echo correlation."
  },
  {
    id: 'aortic_wid',
    title: "Aortic Widening / Aneurysm",
    description: "Detects abnormal aortic contour or mediastinal widening.",
    icon: ShieldAlert,
    severity: 'Low',
    result: "Mild Aortic Ectasia (4.2cm)",
    modelObservation: "Aortic silhouette slightly widened. Rule out."
  },
  {
    id: 'st_dep',
    title: "Ischemia / NSTEMI Risk",
    description: "Detects downsloping or horizontal ST depression.",
    icon: TrendingDown,
    severity: 'Low',
    result: "Downsloping Depression (II, aVF)",
    modelObservation: "Suggestive of inferior ischemia. Check for reciprocal changes."
  },
  {
    id: 'qrs_abn',
    title: "QRS Complex Abnormality",
    description: "Screens for widened QRS, bundle branch block (BBB), and axis deviation.",
    icon: Droplet,
    severity: 'Negative',
    result: "Normal QRS Axis/Duration",
    modelObservation: "No LBBB, RBBB, or significant axis deviation detected."
  },
  {
    id: 'reciprocal',
    title: "Reciprocal Changes",
    description: "Detection of reciprocal ST depression opposite to ST elevation.",
    icon: TrendingUp,
    severity: 'High',
    result: "Depression in II, III, aVF (Reciprocal)",
    modelObservation: "Strongly supports acute transmural injury pattern (STEMI)."
  },
];

// --- Main Imaging Component --- (Renamed to VisionCardio)
const VisionCardio: React.FC = () => {
  // Use a mock state for selected image/tab to pass to the visual enhancement component
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setIsImageUploaded(true);
    }
  };

  const handleRemoveClick = () => {
    setUploadedFile(null);
    setIsImageUploaded(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 full">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Cardiology Imaging & ECG Utility</h1>
          <p className="text-sm text-muted-foreground">Computer Vision (CV) model results for Chest X-ray and ECG interpretation.</p>
        </div>
        {!isImageUploaded ? (
          <Button 
            onClick={handleUploadClick} 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Upload className="mr-2 h-4 w-4" />
            Image
          </Button>
        ) : (
          <div className="flex items-center space-x-2 p-2 border border-green-500 rounded-md bg-green-50/70">
            <span className="text-sm font-medium text-green-700">Image: `{uploadedFile?.name || 'Cardio_Scan_2024.dcm'}` uploaded.</span>
            <Button variant="ghost" size="icon" onClick={handleRemoveClick} className="text-red-500 hover:text-red-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </header>

      <Separator />

      {/* Conditional Rendering: Show analysis only if image is uploaded */}
      {isImageUploaded ? (
        <>
          {/* Image Tabs and Filtering */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl font-semibold'>Input Image Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardioImageTabs />
              </CardContent>
            </Card>

            <Separator />

            <Card>
              <CardHeader>
                <CardTitle className='text-2xl font-semibold'>CV Visual Enhancement</CardTitle>
              </CardHeader>
              <CardContent>
                <CardioVisualEnhancement imageSrc={`/images/heart/image3.jpg`} />
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Analysis Results Section */}
          <div className="space-y-6">
            <h2 className='text-2xl font-semibold'>ECG & Imaging Model Findings</h2>

            {/* Main Findings Cards (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockAnalysisResults.map(finding => (
                <FindingCard key={finding.id} finding={finding} />
              ))}
            </div>

            <Separator className="my-6" />

            {/* Chart and Detailed Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ModelConfidenceChart />

              {/* Overall Interpretation Card (Focus on Acute Cardiac Event) */}
              <Card className="lg:col-span-1 border-4 border-red-500/50 bg-red-50">
                <CardHeader>
                  <CardTitle className='text-red-700'>Clinical Action Protocol</CardTitle>
                  <CardDescription>Consolidated interpretation for urgent patient care.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-red-800">
                    <span className="font-bold">EMERGENCY:</span> Model detects **ST Elevation** in contiguous anterior leads with **Reciprocal Changes**. This pattern is diagnostic for **Acute Anterior STEMI**.
                  </p>
                  <ul className='list-disc pl-5 mt-3 text-sm text-gray-700 space-y-1'>
                    <li><span className="font-bold">Action:</span> Activate Cath Lab immediately.</li>
                    <li><span className="font-bold">Secondary Finding:</span> Cardiomegaly noted (CTR 0.58). This may predispose to future events.</li>
                    <li><span className="font-bold">Aorta:</span> Mild ectasia noted; monitor blood pressure closely.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        // Initial State when no image is uploaded (copied style from Imaging.tsx)
        <Card className="border-dashed border-2 p-12 text-center bg-gray-50">
          <div className='flex justify-center mb-4'>
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">
            Upload a Cardiology Image to begin analysis.
          </h3>
          <p className="text-gray-500 mt-2">
            The utility will process the image and display key pathological findings here.
          </p>
        </Card>
      )}
    </div>
  );
};

export default VisionCardio;