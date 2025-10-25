import React, { useState } from 'react';
import { Upload, X, Droplet, BarChart3 } from 'lucide-react';
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
        <Droplet className={`h-4 w-4 ${textColor}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textColor}`}>{value} {unit}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

// --- Main Chart Component ---
const BloodMarkersChart: React.FC = () => {
  const data = [
    { marker: "Total Cholesterol", value: 220 },
    { marker: "LDL-C", value: 140 },
    { marker: "HDL-C", value: 45 },
    { marker: "Triglycerides", value: 180 },
    { marker: "Troponin I", value: 0.02 },
    { marker: "BNP", value: 80 },
    { marker: "Glucose", value: 95 },
    { marker: "Creatinine", value: 1.0 },
    { marker: "Sodium", value: 140 },
    { marker: "Potassium", value: 4.2 },
    { marker: "Calcium", value: 9.5 },
  ];

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <span>Blood Markers Levels</span>
        </CardTitle>
        <CardDescription>
          Overview of key blood biomarkers from the uploaded lab results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          value: { label: "Value", color: "hsl(var(--color-chart-1))" }
        }} className="h-64">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="marker" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" />
          </BarChart>
        </ChartContainer>
        <div className='mt-4 text-sm'>
          <p className='font-medium'>Analysis Summary:</p>
          <p className='text-muted-foreground'>Cholesterol levels are elevated; recommend lifestyle changes. Other markers are within normal ranges.</p>
        </div>
      </CardContent>
    </Card>
  );
};

const BloodAnalysis: React.FC = () => {
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
          <h1 className="text-3xl font-bold tracking-tight">General Blood Analysis</h1>
          <p className="text-sm text-muted-foreground">Comprehensive Blood Marker Evaluation</p>
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
            <span className="text-sm font-medium text-green-700">File: `Blood_Test_2024.pdf` uploaded.</span>
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
              title="Total Cholesterol"
              description="Overall cholesterol level."
              value="220"
              unit="mg/dL"
              severity="critical"
            />
            <MarkerCard 
              title="LDL-C"
              description="Low-density lipoprotein."
              value="140"
              unit="mg/dL"
              severity="warning"
            />
            <MarkerCard 
              title="HDL-C"
              description="High-density lipoprotein."
              value="45"
              unit="mg/dL"
              severity="normal"
            />
            <MarkerCard 
              title="Triglycerides"
              description="Fat in the blood."
              value="180"
              unit="mg/dL"
              severity="warning"
            />
            <MarkerCard 
              title="Troponin I"
              description="Cardiac muscle injury marker."
              value="0.02"
              unit="ng/mL"
              severity="normal"
            />
            <MarkerCard 
              title="BNP"
              description="Heart failure marker."
              value="80"
              unit="pg/mL"
              severity="normal"
            />
            <MarkerCard 
              title="Glucose (BMP)"
              description="Blood sugar level."
              value="95"
              unit="mg/dL"
              severity="normal"
            />
            <MarkerCard 
              title="Creatinine (BMP)"
              description="Kidney function marker."
              value="1.0"
              unit="mg/dL"
              severity="normal"
            />
            <MarkerCard 
              title="Sodium (BMP)"
              description="Electrolyte balance."
              value="140"
              unit="mmol/L"
              severity="normal"
            />
            <MarkerCard 
              title="Potassium (BMP)"
              description="Electrolyte balance."
              value="4.2"
              unit="mmol/L"
              severity="normal"
            />
            <MarkerCard 
              title="Calcium (BMP)"
              description="Bone and nerve health."
              value="9.5"
              unit="mg/dL"
              severity="normal"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BloodMarkersChart />

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>AI Blood Analysis Summary</CardTitle>
                <CardDescription>
                  Based on analysis of uploaded lab results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-red-600">
                  HIGH CHOLESTEROL: Total cholesterol elevated. Recommend dietary changes and monitoring.
                </p>
                <p className="text-sm mt-3 text-gray-700">
                  BMP results are normal, indicating good metabolic health. Troponin and BNP are within range, no acute cardiac issues detected.
                </p>
                <Separator className="my-4" />
                <p className='text-xs text-muted-foreground'>
                  Analysis Time: 4.1 seconds
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
            Upload Blood Test Results to begin analysis.
          </h3>
          <p className="text-gray-500 mt-2">
            The utility will analyze blood markers and provide comprehensive insights here.
          </p>
        </Card>
      )}
    </div>
  );
};

export default BloodAnalysis;
