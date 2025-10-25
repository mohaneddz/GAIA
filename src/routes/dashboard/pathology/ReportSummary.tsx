"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Area, AreaChart } from "recharts";
import { Pie, PieChart, Cell } from "recharts";
import { Activity, Layers, AlertTriangle } from "lucide-react";

// Mock data for cell count results
const cellCountData = [
  { type: "Liver Cells", total: 15000, abnormal: 1200 },
  { type: "Skin Cells", total: 12000, abnormal: 800 },
  { type: "Blood Cells", total: 18000, abnormal: 1500 },
];

const trendData = [
  { month: "Jan", totalCells: 14000, abnormalCells: 1100 },
  { month: "Feb", totalCells: 15500, abnormalCells: 1250 },
  { month: "Mar", totalCells: 16000, abnormalCells: 1300 },
  { month: "Apr", totalCells: 17000, abnormalCells: 1400 },
  { month: "May", totalCells: 17500, abnormalCells: 1450 },
  { month: "Jun", totalCells: 18000, abnormalCells: 1500 },
];

const pieData = [
  { name: "Normal Cells", value: 85 },
  { name: "Abnormal Cells", value: 15 },
];

export default function ReportSummary() {
  return (
    <div className="full p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Pathology Report Summary
        </h1>
        <p className="text-gray-500">
          AI-analyzed cell count results and trends
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" /> Total Cell Count
            </CardTitle>
            <CardDescription>Overall cells analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">45,000</p>
            <p className="text-sm text-gray-500">Across all samples</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" /> Abnormal Cells
            </CardTitle>
            <CardDescription>Detected anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3,500</p>
            <p className="text-sm text-gray-500">7.8% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" /> Analysis Confidence
            </CardTitle>
            <CardDescription>AI accuracy score</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">92%</p>
            <p className="text-sm text-gray-500">High reliability</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart for Cell Counts by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Cell Counts by Type</CardTitle>
            <CardDescription>
              Total and abnormal cells per category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cellCountData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Bar dataKey="total" fill="var(--color-chart-1)" name="Total" />
                <Bar dataKey="abnormal" fill="var(--color-chart-2)" name="Abnormal" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Area Chart for Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Cell Count Trends</CardTitle>
            <CardDescription>
              Monthly progression of total and abnormal cells
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="totalCells"
                  stackId="1"
                  stroke="var(--color-chart-1)"
                  fill="var(--color-chart-1)"
                />
                <Area
                  type="monotone"
                  dataKey="abnormalCells"
                  stackId="1"
                  stroke="var(--color-chart-2)"
                  fill="var(--color-chart-2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart for Proportions */}
        <Card>
          <CardHeader>
            <CardTitle>Cell Distribution</CardTitle>
            <CardDescription>
              Proportion of normal vs abnormal cells
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="var(--color-chart-1)"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`var(--color-chart-${index + 1})`} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Additional Bar Chart for Detailed Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Abnormal Cell Breakdown</CardTitle>
            <CardDescription>Types of abnormalities detected</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cellCountData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Bar dataKey="abnormal" fill="var(--color-chart-3)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Footer Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Insights based on analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            • Monitor abnormal cell trends closely, especially in Blood samples.
          </p>
          <p>• Reassess in 3 months or upon symptom changes.</p>
          <p>• Confidence in detection: High (92%).</p>
        </CardContent>
      </Card>
    </div>
  );
}
