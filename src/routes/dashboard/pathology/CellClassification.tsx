"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ImageTabs from "@/components/charts/Cells/ImageTabs";
import VisualEnhancement from "@/components/charts/Cells/VisualEnhancement";
import ChartBarDefault from "@/components/charts/Cells/CellsChart";
import { Activity, Layers } from "lucide-react";

const cellTypes = ["Liver", "Skin", "Blood"];

export default function CellAnalyzer() {
  const [activeCellType, setActiveCellType] = useState("Liver");

  return (
    <div className="p-8 space-y-8 full">

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Cell Analysis</h1>
        <p className="text-gray-500">Automated detection and analysis of cell types</p>
      </div>

      {/* Top Tabs for Cell Types */}
      <Tabs value={activeCellType} onValueChange={setActiveCellType}>
        <TabsList className="mb-6">
          {cellTypes.map(type => (
            <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
          ))}
        </TabsList>

        {/* Each TabContent = Cell Type */}
        {cellTypes.map(type => (
          <TabsContent key={type} value={type}>
            <div className="space-y-8">

              {/* ImageTabs component */}
              <Card>
                <CardHeader>
                  <CardTitle>{type} Microscope Images</CardTitle>
                  <CardDescription>Click images to see detections</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageTabs cellType={type} />
                </CardContent>
              </Card>

              {/* Grid of Cards with metrics / empty placeholders */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Metrics Card Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5" /> {type} Cell Metrics</CardTitle>
                    <CardDescription>Cell counts and activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>Total Cells: <span className="font-semibold">12,345</span></p>
                    <p>Abnormal Cells: <span className="font-semibold text-red-600">123</span></p>
                    <p>Activity Index: <span className="font-semibold">0.87</span></p>
                  </CardContent>
                </Card>

                {/* Empty Placeholder Card */}
                <ChartBarDefault />

                {/* Another Metrics Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" /> Function Status</CardTitle>
                    <CardDescription>Key domain metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>Metabolic Index: <span className="font-semibold">0.92</span></p>
                    <p>Membrane Integrity: <span className="font-semibold">Good</span></p>
                    <p>Signal Transduction: <span className="font-semibold">Stable</span></p>
                  </CardContent>
                </Card>

                {/* Visual Enhancement Card */}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Visual Enhancement</CardTitle>
                  <CardDescription>Adjust image filters for clarity</CardDescription>
                </CardHeader>
                <CardContent>
                  <VisualEnhancement imageSrc={`/images/cells/${type.toLowerCase()}1.jpg`} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
