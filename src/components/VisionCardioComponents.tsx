import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// --- Typescript Interface for Model Findings ---
export type ModelFinding = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  severity: 'Negative' | 'Low' | 'Moderate' | 'High';
  result: string;
  modelObservation: string;
};

// --- ShadCN Chart Placeholder Component ---
export const ModelConfidenceChart: React.FC = () => {
  // Sample data for demonstration, with risk mapped to numerical scores
  const data = [
    { pathology: "ST Elevation", confidence: 95, riskScore: 100 },
    { pathology: "Atrial Fibrillation", confidence: 85, riskScore: 60 },
    { pathology: "Ventricular Tachycardia", confidence: 78, riskScore: 70 },
    { pathology: "Heart Block", confidence: 92, riskScore: 90 },
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <span>Cardiology Model Confidence & Risk Scores</span>
        </CardTitle>
        <CardDescription>
          Confidence level of computer vision models for major cardiac pathologies (ECG and Imaging).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          confidence: { label: "Confidence (%)", color: "hsl(var(--color-chart-1))" },
          riskScore: { label: "Risk Score", color: "hsl(var(--color-chart-2))" }
        }} className="h-64">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="pathology" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="confidence" fill="var(--color-confidence)" />
            <Bar dataKey="riskScore" fill="var(--color-riskScore)" />
          </BarChart>
        </ChartContainer>
        <p className='text-sm mt-4 text-muted-foreground'>
          The model shows extremely high confidence for the ST Elevation findings, demanding immediate review.
        </p>
      </CardContent>
    </Card>
  );
};

// --- Finding Card Component for Displaying Model Results ---
export const FindingCard: React.FC<{ finding: ModelFinding }> = ({ finding }) => {
  const { title, result, description, severity, icon: Icon, modelObservation } = finding;

  let resultClass = 'text-green-600 border-green-200 bg-green-50';
  let severityLabel = 'Normal';

  if (severity === 'Low') {
    resultClass = 'text-blue-600 border-blue-200 bg-blue-50';
    severityLabel = 'Minor';
  } else if (severity === 'Moderate') {
    resultClass = 'text-amber-700 border-amber-300 bg-amber-50';
    severityLabel = 'Alert';
  } else if (severity === 'High') {
    resultClass = 'text-red-700 border-red-300 bg-red-50';
    severityLabel = 'Critical';
  }

  return (
    <Card className={`transition-all hover:shadow-xl hover:scale-[1.01] ${resultClass}`}>
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className='flex items-center space-x-3'>
          <Icon className={`h-5 w-5 ${resultClass.split(' ')[0]}`} />
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${resultClass.replace('bg-green-50', 'bg-green-100').replace('bg-blue-50', 'bg-blue-100').replace('bg-amber-50', 'bg-amber-100').replace('bg-red-50', 'bg-red-100')}`}>
          {severityLabel}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 pt-3">
        <p className={`text-xl font-extrabold mb-2 ${resultClass.split(' ')[0]}`}>{result}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className='text-xs mt-2 italic text-gray-500'>
          <strong className='font-medium'>CV/ECG Model Observation:</strong> {modelObservation}
        </p>
      </CardContent>
    </Card>
  );
};
