import React, { useState } from 'react';
import { Upload, X, HeartPulse, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// --- Marker Card Component ---
type MarkerCardProps = {
  title: string;
  description: string;
  value: string;
  unit: string;
  severity: 'normal' | 'warning' | 'critical';
};

const MarkerCard: React.FC<MarkerCardProps> = ({ title, description, value, unit, severity }) => {
  let borderColor = 'border-gray-200';
  let textColor = 'text-gray-900';
  let bgColor = 'bg-white';

  if (severity === 'warning') {
    borderColor = 'border-amber-400/50';
    textColor = 'text-amber-700';
    bgColor = 'bg-amber-50';
  } else if (severity === 'critical') {
    borderColor = 'border-red-500/50';
    textColor = 'text-red-700';
    bgColor = 'bg-red-50';
  }

  return (
    <Card className={`transition-shadow hover:shadow-lg ${borderColor} ${bgColor}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <HeartPulse className={`h-4 w-4 ${textColor}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textColor}`}>{value} {unit}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

// --- Main Chart Component ---
const CardiacMarkersChart: React.FC = () => {
  const data = [
    { marker: "cTnI", current: 0.05, reference: 0.04 },
    { marker: "CK-MB", current: 12, reference: 25 },
    { marker: "BNP", current: 150, reference: 100 },
    { marker: "LDL-C", current: 120, reference: 100 },
    { marker: "hs-CRP", current: 2.5, reference: 3.0 },
    { marker: "Myoglobin", current: 80, reference: 110 },
    { marker: "K+", current: 4.5, reference: 5.0 },
    { marker: "Glucose", current: 110, reference: 100 },
    { marker: "Creatinine", current: 1.2, reference: 1.3 },
    { marker: "AST", current: 35, reference: 40 },
    { marker: "INR", current: 1.1, reference: 1.0 },
  ];

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <span>Cardiac Markers Levels</span>
        </CardTitle>
        <CardDescription>
          Overview of key cardiac biomarkers from the uploaded lab results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          current: { label: "Current Value", color: "hsl(var(--color-chart-1))" },
          reference: { label: "Reference Value", color: "hsl(var(--color-chart-2))" }
        }} className="h-64">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="marker" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="current" fill="var(--color-current)" />
            <Bar dataKey="reference" fill="var(--color-reference)" />
          </BarChart>
        </ChartContainer>
        <div className='mt-4 text-sm'>
          <p className='font-medium'>Analysis Summary:</p>
          <p className='text-muted-foreground'>Elevated BNP and hs-CRP suggest potential heart failure risk. Recommend further evaluation.</p>
        </div>
      </CardContent>
    </Card>
  );
};

const RiskPrediction: React.FC = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleUploadClick = () => {
    console.log("Simulating file upload...");
    setIsFileUploaded(true);
  };

  const handleRemoveClick = () => {
    console.log("Removing file...");
    setIsFileUploaded(false);
  };

  return (
    <div className="px-6 space-y-8 mx-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Heart Risk Prediction</h1>
          <p className="text-sm text-muted-foreground">Cardiac Markers Analysis from Lab Results</p>
        </div>
        
        {!isFileUploaded ? (
          <Button 
            onClick={handleUploadClick} 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Upload className="mr-2 h-4 w-4" />
            Input Lab Results
          </Button>
        ) : (
          <div className="flex items-center space-x-2 p-2 border border-green-500 rounded-md bg-green-50/70">
            <span className="text-sm font-medium text-green-700">File: `Cardiac_Markers_2024.pdf` uploaded.</span>
            <Button variant="ghost" size="icon" onClick={handleRemoveClick} className="text-red-500 hover:text-red-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {isFileUploaded ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MarkerCard 
              title="Cardiac Troponin (cTnI)"
              description="Indicates myocardial injury."
              value="0.05"
              unit="ng/mL"
              severity="warning"
            />
            <MarkerCard 
              title="CK-MB"
              description="Indicates myocardial necrosis."
              value="12"
              unit="IU/L"
              severity="normal"
            />
            <MarkerCard 
              title="BNP"
              description="Indicates ventricular strain."
              value="150"
              unit="pg/mL"
              severity="critical"
            />
            <MarkerCard 
              title="LDL-C"
              description="Part of lipid profile for CV risk."
              value="120"
              unit="mg/dL"
              severity="warning"
            />
            <MarkerCard 
              title="hs-CRP"
              description="Indicates systemic inflammation."
              value="2.5"
              unit="mg/L"
              severity="warning"
            />
            <MarkerCard 
              title="Myoglobin"
              description="Early marker of myocardial injury."
              value="80"
              unit="ng/mL"
              severity="normal"
            />
            <MarkerCard 
              title="Potassium (K+)"
              description="Electrolyte for arrhythmia risk."
              value="4.5"
              unit="mmol/L"
              severity="normal"
            />
            <MarkerCard 
              title="Blood Glucose"
              description="Increases CAD and HF risk."
              value="110"
              unit="mg/dL"
              severity="warning"
            />
            <MarkerCard 
              title="Creatinine"
              description="Kidney function affecting biomarkers."
              value="1.2"
              unit="mg/dL"
              severity="normal"
            />
            <MarkerCard 
              title="AST"
              description="Liver function, may rise in cardiac injury."
              value="35"
              unit="IU/L"
              severity="normal"
            />
            <MarkerCard 
              title="INR"
              description="Coagulation for bleeding/thrombotic risk."
              value="1.1"
              unit=""
              severity="normal"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CardiacMarkersChart />

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>AI Risk Assessment Summary</CardTitle>
                <CardDescription>
                  Based on analysis of uploaded lab results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-red-600">
                  MODERATE RISK: Elevated BNP and hs-CRP suggest increased cardiovascular risk. Lifestyle modifications recommended.
                </p>
                <p className="text-sm mt-3 text-gray-700">
                  Lipid profile shows borderline LDL-C. Glucose is slightly elevated, monitor for diabetes. Kidney and liver functions are normal.
                </p>
                <Separator className="my-4" />
                <p className='text-xs text-muted-foreground'>
                  Analysis Time: 3.8 seconds
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="border-dashed border-2 p-12 text-center bg-gray-50">
          <div className='flex justify-center mb-4'>
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">
            Upload Lab Results to begin risk prediction.
          </h3>
          <p className="text-gray-500 mt-2">
            The utility will analyze cardiac markers and provide risk assessment here.
          </p>
        </Card>
      )}
    </div>
  );
};

export default RiskPrediction;
