"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Pie, PieChart, Cell } from "recharts";
import { Line, LineChart } from "recharts";
import { Heart, AlertTriangle, TrendingUp, Activity } from "lucide-react";

// Mock data for risk predictions
const riskFactors = [
	{ factor: "Cholesterol", value: 240, risk: "High" },
	{ factor: "Blood Pressure", value: 150, risk: "High" },
	{ factor: "BMI", value: 28, risk: "Moderate" },
	{ factor: "Age", value: 55, risk: "Moderate" },
];

const riskTrend = [
	{ month: "Jan", riskScore: 65 },
	{ month: "Feb", riskScore: 70 },
	{ month: "Mar", riskScore: 68 },
	{ month: "Apr", riskScore: 75 },
	{ month: "May", riskScore: 72 },
	{ month: "Jun", riskScore: 78 },
];

const riskDistribution = [
	{ name: "Low Risk", value: 20 },
	{ name: "Moderate Risk", value: 50 },
	{ name: "High Risk", value: 30 },
];

// Mock computer vision results for images
const cvResults = [
	{
		image: "/images/heart/artery1.jpg",
		detections: ["Plaque buildup 15%", "Stenosis 20%"],
		confidence: 92,
	},
	{
		image: "/images/heart/artery2.jpg",
		detections: ["Calcification detected", "Narrowing 25%"],
		confidence: 88,
	},
	{
		image: "/images/heart/echo1.jpg",
		detections: ["Ejection fraction 55%", "Wall motion abnormal"],
		confidence: 95,
	},
];

export default function RiskPrediction() {
	return (
		<div className="p-8 space-y-8 full">
			{/* Header */}
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-800">Heart Risk Prediction</h1>
				<p className="text-gray-500">AI-based cardiovascular risk assessment and imaging analysis</p>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Heart className="w-5 h-5 text-red-600" /> Overall Risk Score
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">78%</p>
						<p className="text-sm text-gray-500">High risk</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-yellow-600" /> Key Factors
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">4</p>
						<p className="text-sm text-gray-500">Elevated</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="w-5 h-5 text-blue-600" /> Trend
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">+5%</p>
						<p className="text-sm text-gray-500">Last 6 months</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="w-5 h-5 text-green-600" /> AI Confidence
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">91%</p>
						<p className="text-sm text-gray-500">Reliable</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Bar Chart for Risk Factors */}
				<Card>
					<CardHeader>
						<CardTitle>Risk Factors Analysis</CardTitle>
						<CardDescription>Key indicators contributing to heart risk</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={riskFactors}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="factor" />
								<YAxis />
								<Bar dataKey="value" fill="var(--color-chart-1)" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Line Chart for Risk Trend */}
				<Card>
					<CardHeader>
						<CardTitle>Risk Score Trend</CardTitle>
						<CardDescription>Monthly evolution of cardiovascular risk</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={riskTrend}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Line type="monotone" dataKey="riskScore" stroke="var(--color-chart-2)" strokeWidth={3} />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Pie Chart for Risk Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Risk Level Distribution</CardTitle>
						<CardDescription>Breakdown of risk categories</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={riskDistribution}
									cx="50%"
									cy="50%"
									outerRadius={80}
									fill="var(--color-chart-1)"
									dataKey="value"
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
								>
									{riskDistribution.map((_, index) => (
										<Cell key={`cell-${index}`} fill={`var(--color-chart-${index + 1})`} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Computer Vision Results */}
				<Card>
					<CardHeader>
						<CardTitle>AI Imaging Insights</CardTitle>
						<CardDescription>Automated detections from heart scans</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{cvResults.map((result, index) => (
							<div key={index} className="flex items-center space-x-4">
								<img
									src={result.image}
									alt="Heart scan"
									className="w-20 h-20 object-cover rounded"
								/>
								<div>
									<p className="font-semibold">
										Detections: {result.detections.join(", ")}
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
					<CardDescription>Personalized advice based on analysis</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<p>• Reduce cholesterol through diet and medication.</p>
					<p>• Monitor blood pressure regularly; consider lifestyle changes.</p>
					<p>• Schedule follow-up imaging in 3 months.</p>
					<p>• Consult cardiologist for high-risk factors.</p>
				</CardContent>
			</Card>
		</div>
	);
}
