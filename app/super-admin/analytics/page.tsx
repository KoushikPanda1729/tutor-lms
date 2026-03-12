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
  AreaChart,
  Area,
  Cell,
} from "recharts";
import { PageHeader } from "@/components/layout/page-header";
import { Building2, Users, TrendingUp, BookOpen, ArrowUpRight, IndianRupee } from "lucide-react";
import { mockPlatformStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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

const PLAN_COLORS = ["#94a3b8", "#6366f1", "#4f46e5"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2">
        <p className="text-[10px] font-semibold text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-900">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const statCards = [
  {
    title: "Total Orgs",
    value: mockPlatformStats.totalOrgs,
    icon: Building2,
    trend: 12,
    trendLabel: "this month",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    accent: "from-indigo-500 to-violet-500",
  },
  {
    title: "Total Students",
    value: mockPlatformStats.totalStudents.toLocaleString(),
    icon: Users,
    trend: 8,
    trendLabel: "this month",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    accent: "from-blue-500 to-sky-500",
  },
  {
    title: "Active Batches",
    value: mockPlatformStats.totalBatches,
    icon: BookOpen,
    trend: null,
    trendLabel: "",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    title: "MRR",
    value: `₹${(mockPlatformStats.monthlyRevenue / 1000).toFixed(0)}K`,
    icon: IndianRupee,
    trend: 15,
    trendLabel: "vs last month",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    accent: "from-amber-400 to-orange-500",
  },
];

export default function SuperAdminAnalyticsPage() {
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        description="Growth and usage across all organizations"
      />

      {/* ── Stat cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn("h-10 w-10 rounded-xl flex items-center justify-center", card.bg)}
                >
                  <Icon className={cn("h-5 w-5", card.iconColor)} />
                </div>
                {card.trend != null && (
                  <div className="flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" />
                    {card.trend}%
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs font-medium text-slate-400 mt-0.5">{card.title}</p>
                {card.trend != null && (
                  <p className="text-[11px] text-emerald-600 mt-1">
                    +{card.trend}% {card.trendLabel}
                  </p>
                )}
              </div>
              <div
                className={cn("h-1 w-full rounded-full bg-gradient-to-r opacity-30", card.accent)}
              />
            </div>
          );
        })}
      </div>

      {/* ── Growth charts ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Org Growth */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-bold text-slate-900">Organization Growth</p>
              <p className="text-xs text-slate-400 mt-0.5">Monthly onboarding trend</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span className="text-xs text-slate-400">Orgs</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyOrgs}>
              <defs>
                <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="orgs"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fill="url(#orgGrad)"
                dot={{ r: 4, fill: "#fff", stroke: "#4f46e5", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#4f46e5" }}
                name="Organizations"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Student Growth */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-bold text-slate-900">Student Growth</p>
              <p className="text-xs text-slate-400 mt-0.5">Total students across platform</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-400">Students</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyStudents}>
              <defs>
                <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="students"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#studentGrad)"
                dot={{ r: 4, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#3b82f6" }}
                name="Students"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Revenue + Plan distribution ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Revenue bar chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="mb-5">
            <p className="text-sm font-bold text-slate-900">Monthly Revenue</p>
            <p className="text-xs text-slate-400 mt-0.5">Revenue in ₹K per month</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} name="Revenue ₹K">
                {revenueData.map((entry, index) => (
                  <Cell key={index} fill={entry.revenue === maxRevenue ? "#4f46e5" : "#c7d2fe"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Plan distribution panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="mb-5">
            <p className="text-sm font-bold text-slate-900">Plan Distribution</p>
            <p className="text-xs text-slate-400 mt-0.5">Organizations by plan tier</p>
          </div>

          <div className="flex-1 space-y-4">
            {planDist.map((item, i) => {
              const pct = Math.round((item.count / mockPlatformStats.totalOrgs) * 100);
              const colors = ["bg-slate-400", "bg-indigo-400", "bg-indigo-600"];
              const lightColors = [
                "bg-slate-50 text-slate-500",
                "bg-indigo-50 text-indigo-600",
                "bg-indigo-100 text-indigo-700",
              ];
              return (
                <div key={item.plan}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("text-xs font-bold px-2 py-0.5 rounded-md", lightColors[i])}
                      >
                        {item.plan}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.count}</span>
                      <span className="text-[10px] text-slate-400">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", colors[i])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[11px] text-slate-400 font-medium">Total Orgs</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {mockPlatformStats.totalOrgs}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl px-3 py-2.5">
              <p className="text-[11px] text-indigo-400 font-medium">Paid Plans</p>
              <p className="text-base font-bold text-indigo-700 mt-0.5">
                {planDist.filter((p) => p.plan !== "Free").reduce((s, p) => s + p.count, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
