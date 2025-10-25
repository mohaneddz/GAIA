"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Pie, PieChart, Cell } from "recharts";
import { Line, LineChart } from "recharts";
import { Bone, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import ImageTabs from "@/components/charts/Xray/ImageTabs";

// Mock data for fracture analysis
const fractureData = [
	{ type: "Femur", count: 5 },
	{ type: "Humerus", count: 3 },
	{ type: "Tibia", count: 4 },
	{ type: "Radius", count: 2 },
];

const trendData = [
	{ month: "Jan", fractures: 8 },
	{ month: "Feb", fractures: 12 },
	{ month: "Mar", fractures: 10 },
	{ month: "Apr", fractures: 15 },
	{ month: "May", fractures: 9 },
	{ month: "Jun", fractures: 11 },
];

const severityData = [
	{ name: "Minor", value: 40 },
	{ name: "Moderate", value: 35 },
	{ name: "Severe", value: 25 },
];

// Mock imaging results
const imagingResults = [
	{
		image: "/images/bones/image2.jpg",
		fractures: ["Femoral neck fracture", "Comminuted"],
		confidence: 95,
	},
	{ image: "/images/bones/image3.jpg", fractures: ["Mid-shaft fracture"], confidence: 88 },
];

export default function AiImaging() {
	return (
		<div className="full p-8 space-y-8">
			{/* Header */}
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-800">AI Bone Fracture Imaging</h1>
				<p className="text-gray-500">Automated detection and analysis of bone fractures</p>
			</div>

			<Card className="col-span-2">
				<CardHeader>
					<CardTitle>Brain Scan Viewer</CardTitle>
					<CardDescription>MRI / CT scans with AI-assisted overlays</CardDescription>
				</CardHeader>
				<CardContent>
					<ImageTabs />
				</CardContent>
			</Card>


			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bone className="w-5 h-5 text-blue-600" /> Total Fractures
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">14</p>
						<p className="text-sm text-gray-500">Detected this month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-red-600" /> Severe Cases
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">4</p>
						<p className="text-sm text-gray-500">Require immediate attention</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="w-5 h-5 text-green-600" /> Detection Rate
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">96%</p>
						<p className="text-sm text-gray-500">AI accuracy</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="w-5 h-5 text-purple-600" /> Processing Time
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">2.3s</p>
						<p className="text-sm text-gray-500">Average per image</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Bar Chart for Fracture Types */}
				<Card>
					<CardHeader>
						<CardTitle>Fractures by Bone Type</CardTitle>
						<CardDescription>Distribution of detected fractures</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={fractureData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="type" />
								<YAxis />
								<Bar dataKey="count" fill="var(--color-chart-1)" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Line Chart for Trends */}
				<Card>
					<CardHeader>
						<CardTitle>Fracture Detection Trends</CardTitle>
						<CardDescription>Monthly fracture counts</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={trendData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Line
									type="monotone"
									dataKey="fractures"
									stroke="var(--color-chart-2)"
									strokeWidth={3}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Pie Chart for Severity */}
				<Card>
					<CardHeader>
						<CardTitle>Fracture Severity</CardTitle>
						<CardDescription>Breakdown by severity level</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={severityData}
									cx="50%"
									cy="50%"
									outerRadius={80}
									fill="var(--color-chart-1)"
									dataKey="value"
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
								>
									{severityData.map((_, index) => (
										<Cell key={`cell-${index}`} fill={`var(--color-chart-${index + 1})`} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Imaging Results */}
				<Card>
					<CardHeader>
						<CardTitle>AI Fracture Detection</CardTitle>
						<CardDescription>Annotated images with detected fractures</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{imagingResults.map((result, index) => (
							<div key={index} className="flex items-center space-x-4">
								<img
									src={result.image}
									alt="Bone scan"
									className="w-32 h-32 object-cover rounded border"
								/>
								<div>
									<p className="font-semibold">
										Fractures: {result.fractures.join(", ")}
									</p>
									<p className="text-sm text-gray-500">
										Confidence: {result.confidence}%
									</p>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Recommendations */}
			<Card>
				<CardHeader>
					<CardTitle>AI Recommendations</CardTitle>
					<CardDescription>Insights for fracture management</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<p>
						• Prioritize severe femur fractures for immediate surgical intervention.
					</p>
					<p>
						• Monitor trends in humerus fractures; consider preventive measures.
					</p>
					<p>
						• High detection accuracy; re-scan if confidence &gt; 90%.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
