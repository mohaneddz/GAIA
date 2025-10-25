import React, { useState } from 'react';
import { Upload, X, Droplet, HeartPulse, Stethoscope, BarChart3 } from 'lucide-react';

// --- ShadCN Component Imports (Assumed to be in your project) ---
// Note: Replace these paths with your actual ShadCN component location
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

// --- Mock Chart Component Placeholder (for ShadCN Chart request) ---
// This acts as a placeholder for a real chart (e.g., Recharts or a dedicated ShadCN chart component)
const LungVolumeChart: React.FC = () => {
  // Sample data for FEV1/FVC over time
  const data = [
    { time: "Jan", fev1: 85, fvc: 90 },
    { time: "Feb", fev1: 87, fvc: 92 },
    { time: "Mar", fev1: 84, fvc: 89 },
    { time: "Apr", fev1: 86, fvc: 91 },
    { time: "May", fev1: 88, fvc: 93 },
  ];

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <span>Lung Capacity Over Time (FEV1/FVC)</span>
        </CardTitle>
        <CardDescription>
          Simulated data showing lung function metrics post-imaging.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          fev1: { label: "FEV1 (%)", color: "hsl(var(--color-chart-1))" },
          fvc: { label: "FVC (%)", color: "hsl(var(--color-chart-2))" }
        }} className="h-64">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="fev1" stroke="var(--color-fev1)" strokeWidth={2} />
            <Line type="monotone" dataKey="fvc" stroke="var(--color-fvc)" strokeWidth={2} />
          </LineChart>
        </ChartContainer>
        <div className='mt-4 text-sm'>
          <p className='font-medium'>Analysis Summary:</p>
          <p className='text-muted-foreground'>FEV1 is 85% of predicted. FVC is 90% of predicted. Suggests normal ventilatory capacity.</p>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Finding Card Component ---
type FindingProps = {
    title: string;
    description: string;
    value: string;
    icon: React.ElementType;
    alertStyle: 'normal' | 'warning' | 'critical';
};

const FindingCard: React.FC<FindingProps> = ({ title, description, value, icon: Icon, alertStyle }) => {
    let borderColor = 'border-gray-200';
    let textColor = 'text-gray-900';
    let iconColor = 'text-blue-500';

    if (alertStyle === 'warning') {
        borderColor = 'border-amber-400/50 bg-amber-50';
        textColor = 'text-amber-700';
        iconColor = 'text-amber-500';
    } else if (alertStyle === 'critical') {
        borderColor = 'border-red-500/50 bg-red-50';
        textColor = 'text-red-700';
        iconColor = 'text-red-500';
    }

    return (
        <Card className={`transition-shadow hover:shadow-lg ${borderColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
                <p className="text-xs text-muted-foreground pt-1">{description}</p>
            </CardContent>
        </Card>
    );
};

// --- Main Imaging Component ---
const Imaging: React.FC = () => {
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const handleUploadClick = () => {
    // In a real app, this would trigger a file input dialog
    console.log("Simulating image upload...");
    setIsImageUploaded(true);
  };

  const handleRemoveClick = () => {
    console.log("Removing image...");
    setIsImageUploaded(false);
  };

  return (
    <div className="px-6 space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Imaging Utility</h1>
          <p className="text-sm text-muted-foreground">Chest X-Ray Analysis and Interpretation</p>
        </div>
        
        {/* Button to Input the Lungs Image */}
        {!isImageUploaded ? (
          <Button 
            onClick={handleUploadClick} 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Upload className="mr-2 h-4 w-4" />
            Input Lungs Image
          </Button>
        ) : (
          <div className="flex items-center space-x-2 p-2 border border-green-500 rounded-md bg-green-50/70">
            <span className="text-sm font-medium text-green-700">Image: `Lungs_Scan_2024.dcm` uploaded.</span>
            <Button variant="ghost" size="icon" onClick={handleRemoveClick} className="text-red-500 hover:text-red-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Analysis Section */}
      {isImageUploaded ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <img src="/images/heart/image1.jpg" alt="Heart Image" className="w-80 h-80 object-cover rounded-lg" />
                <div className="w-full">
                  <h4 className="text-lg font-semibold mb-4 text-foreground">Key Findings</h4>
                  <ul className="grid grid-cols-2 gap-4 w-full">
                    <li className="flex items-center space-x-3 p-2 bg-muted rounded-md border">
                      <HeartPulse className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Cardiothoracic Ratio (CTR)</p>
                        <p className="text-xs text-muted-foreground">0.55 - Critical</p>
                      </div>
                    </li>
                    <li className="flex items-center space-x-3 p-2 bg-muted rounded-md border">
                      <Droplet className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Pleural Effusion</p>
                        <p className="text-xs text-muted-foreground">Detected (Left Base)</p>
                      </div>
                    </li>
                    <li className="flex items-center space-x-3 p-2 bg-muted rounded-md border">
                      <Stethoscope className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Pulmonary Nodules</p>
                        <p className="text-xs text-muted-foreground">0</p>
                      </div>
                    </li>
                    <li className="flex items-center space-x-3 p-2 bg-muted rounded-md border">
                      <Stethoscope className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Consolidation / Infiltrate</p>
                        <p className="text-xs text-muted-foreground">None Detected</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FindingCard 
              title="Cardiothoracic Ratio (CTR)"
              description="Max width of heart relative to max internal width of chest."
              value="0.55"
              icon={HeartPulse}
              alertStyle="critical" // > 0.50 is often considered critical
            />
            <FindingCard 
              title="Pleural Effusion"
              description="Presence of fluid in the pleural space."
              value="Detected (Left Base)"
              icon={Droplet}
              alertStyle="warning"
            />
            <FindingCard 
              title="Pulmonary Nodules"
              description="Count of discrete masses identified in lung parenchyma."
              value="0"
              icon={Stethoscope}
              alertStyle="normal"
            />
            <FindingCard 
              title="Consolidation / Infiltrate"
              description="Presence of opacity suggesting pneumonia or inflammation."
              value="None Detected"
              icon={Stethoscope}
              alertStyle="normal"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ShadCN Chart Placeholder */}
            <LungVolumeChart />

            {/* Detailed Summary Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>AI Diagnostic Summary</CardTitle>
                <CardDescription>
                  Based on image analysis of the uploaded scan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-red-600">
                  CRITICAL ALERT: Cardiomegaly suspected (CTR 0.55). Recommend Echocardiogram for functional assessment.
                </p>
                <p className="text-sm mt-3 text-gray-700">
                  Mild blunting of the left costophrenic angle is consistent with a small pleural effusion, estimated at <strong className='font-semibold'>~150ml</strong>. No evidence of pneumothorax or acute consolidation. Diaphragm contours appear normal.
                </p>
                <Separator className="my-4" />
                <p className='text-xs text-muted-foreground'>
                    Analysis Time: 4.2 seconds
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Initial State when no image is uploaded
        <Card className="border-dashed border-2 p-12 text-center bg-gray-50">
          <div className='flex justify-center mb-4'>
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">
            Upload a Chest X-ray to begin analysis.
          </h3>
          <p className="text-gray-500 mt-2">
            The utility will process the image and display key pathological findings here.
          </p>
        </Card>
      )}

    </div>
  );
};

export default Imaging;