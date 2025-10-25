"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Cell, Pie, PieChart } from "recharts";
import { AlertTriangle, CheckCircle, Clock, FlaskConical } from "lucide-react";

// Mock data for specimens
const specimenData = [
	{ id: "SP-001", type: "Blood", status: "Processed", date: "2024-10-01", location: "Lab A" },
	{ id: "SP-002", type: "Tissue", status: "Pending", date: "2024-10-02", location: "Lab B" },
	{ id: "SP-003", type: "Urine", status: "Analyzed", date: "2024-10-03", location: "Lab A" },
	{ id: "SP-004", type: "Blood", status: "Rejected", date: "2024-10-04", location: "Lab C" },
	{ id: "SP-005", type: "Tissue", status: "Processed", date: "2024-10-05", location: "Lab B" },
];

const statusCounts = [
	{ status: "Processed", count: 2 },
	{ status: "Pending", count: 1 },
	{ status: "Analyzed", count: 1 },
	{ status: "Rejected", count: 1 },
];

const typeDistribution = [
	{ type: "Blood", count: 2 },
	{ type: "Tissue", count: 2 },
	{ type: "Urine", count: 1 },
];

const getStatusBadge = (status: string) => {
	switch (status) {
		case "Processed":
			return <Badge variant="default" className="bg-blue-700 text-white">Processed</Badge>;
		case "Pending":
			return <Badge variant="secondary" className="bg-blue-500 text-white">Pending</Badge>;
		case "Analyzed":
			return <Badge variant="default" className="bg-blue-600 text-white">Analyzed</Badge>;
		case "Rejected":
			return <Badge variant="destructive" className="bg-red-500 text-white">Rejected</Badge>;
		default:
			return <Badge variant="outline" className="bg-gray-500 text-white">Unknown</Badge>;
	}
};

export default function Specimen() {
	return (
		<div className="full p-8 space-y-8">
			{/* Header */}
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-800">Specimen Tracker</h1>
				<p className="text-gray-500">Manage and monitor pathology specimens</p>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FlaskConical className="w-5 h-5 text-blue-600" /> Total Specimens
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">5</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-600" /> Processed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">2</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="w-5 h-5 text-yellow-600" /> Pending
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">1</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-red-600" /> Rejected
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">1</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Bar Chart for Status Counts */}
				<Card>
					<CardHeader>
						<CardTitle>Specimen Status Distribution</CardTitle>
						<CardDescription>Count of specimens by processing status</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={statusCounts}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="status" />
								<YAxis />
								<Bar dataKey="count" fill="var(--color-chart-1)" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Pie Chart for Type Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Specimen Type Distribution</CardTitle>
						<CardDescription>Proportion of specimens by type</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={typeDistribution}
									cx="50%"
									cy="50%"
									outerRadius={80}
									fill="var(--color-chart-1)"
									dataKey="count"
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
								>
									{typeDistribution.map((_, index) => (
										<Cell key={`cell-${index}`} fill={`var(--color-chart-${index + 1})`} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Specimen Table */}
			<Card>
				<CardHeader>
					<CardTitle>Specimen List</CardTitle>
					<CardDescription>Detailed list of all tracked specimens</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Location</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{specimenData.map((specimen) => (
								<TableRow key={specimen.id}>
									<TableCell>{specimen.id}</TableCell>
									<TableCell>{specimen.type}</TableCell>
									<TableCell>{getStatusBadge(specimen.status)}</TableCell>
									<TableCell>{specimen.date}</TableCell>
									<TableCell>{specimen.location}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
