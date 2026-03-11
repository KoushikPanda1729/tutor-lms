"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Users, ClipboardList, TrendingUp, CalendarCheck } from "lucide-react";
import { mockBatches, mockStudents } from "@/lib/mock-data";

const attendanceData = [
  { week: "Week 1", present: 85 },
  { week: "Week 2", present: 90 },
  { week: "Week 3", present: 78 },
  { week: "Week 4", present: 88 },
  { week: "Week 5", present: 92 },
  { week: "Week 6", present: 86 },
];

const testScoresData = [
  { test: "UT1", avg: 68 },
  { test: "UT2", avg: 72 },
  { test: "Minor1", avg: 65 },
  { test: "UT3", avg: 78 },
  { test: "Mock1", avg: 70 },
];

const batchStrengthData = mockBatches
  .filter((b) => b.status === "active")
  .map((b) => ({
    name: b.name.split(" ").slice(0, 2).join(" "),
    students: b.studentCount,
  }));

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Performance overview of your institute"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Students"
          value={mockStudents.length}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend={{ value: 5, label: "this month" }}
        />
        <StatCard
          title="Active Batches"
          value={mockBatches.filter((b) => b.status === "active").length}
          icon={ClipboardList}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Avg Attendance"
          value="86%"
          icon={CalendarCheck}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Avg Test Score"
          value="71%"
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend (Weekly %)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#4f46e5" }}
                  name="Attendance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Test Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={testScoresData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="test" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Bar dataKey="avg" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch Strength</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={batchStrengthData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                width={100}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
              />
              <Bar dataKey="students" fill="#22c55e" radius={[0, 4, 4, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
