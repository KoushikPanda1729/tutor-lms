"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Building2, Users, TrendingUp, BookOpen } from "lucide-react";
import { mockPlatformStats } from "@/lib/mock-data";

const monthlyOrgs = [
  { month: "Aug", orgs: 22 },
  { month: "Sep", orgs: 26 },
  { month: "Oct", orgs: 30 },
  { month: "Nov", orgs: 35 },
  { month: "Dec", orgs: 38 },
  { month: "Jan", orgs: 42 },
];

const monthlyStudents = [
  { month: "Aug", students: 6200 },
  { month: "Sep", students: 7800 },
  { month: "Oct", students: 9100 },
  { month: "Nov", students: 10400 },
  { month: "Dec", students: 11200 },
  { month: "Jan", students: 12480 },
];

const revenueData = [
  { month: "Aug", revenue: 142 },
  { month: "Sep", revenue: 168 },
  { month: "Oct", revenue: 192 },
  { month: "Nov", revenue: 215 },
  { month: "Dec", revenue: 231 },
  { month: "Jan", revenue: 248 },
];

const planDist = [
  { plan: "Free", count: 18 },
  { plan: "Pro", count: 19 },
  { plan: "Enterprise", count: 5 },
];

export default function SuperAdminAnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Platform Analytics"
        description="Growth and usage across all organizations"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Orgs"
          value={mockPlatformStats.totalOrgs}
          icon={Building2}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          trend={{ value: 12, label: "this month" }}
        />
        <StatCard
          title="Total Students"
          value={mockPlatformStats.totalStudents.toLocaleString()}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend={{ value: 8, label: "this month" }}
        />
        <StatCard
          title="Active Batches"
          value={mockPlatformStats.totalBatches}
          icon={BookOpen}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="MRR"
          value={`₹${(mockPlatformStats.monthlyRevenue / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          trend={{ value: 15, label: "vs last month" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyOrgs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="orgs"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#4f46e5" }}
                  name="Organizations"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyStudents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  name="Students"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue (₹K)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v) => [`₹${v}K`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={planDist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis
                  type="category"
                  dataKey="plan"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  width={70}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} name="Orgs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
