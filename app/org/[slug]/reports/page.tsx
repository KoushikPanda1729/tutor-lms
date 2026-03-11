"use client";

import {
  BarChart,
  Bar,
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
import { Users, BookOpen, CalendarCheck, Award, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { mockBatches, mockStudents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-left">
        <p className="text-[10px] font-semibold text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-900">
          {payload[0].value}
          {payload[0].name?.includes("%") || payload[0].dataKey === "present" ? "%" : ""}
        </p>
      </div>
    );
  }
  return null;
};

const statCards = [
  {
    title: "Total Students",
    value: mockStudents.length,
    icon: Users,
    trend: 5,
    trendLabel: "this month",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    accent: "from-indigo-500 to-violet-500",
  },
  {
    title: "Active Batches",
    value: mockBatches.filter((b) => b.status === "active").length,
    icon: BookOpen,
    trend: null,
    trendLabel: "",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    accent: "from-violet-500 to-purple-500",
  },
  {
    title: "Avg Attendance",
    value: "86%",
    icon: CalendarCheck,
    trend: 2,
    trendLabel: "vs last week",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    title: "Avg Test Score",
    value: "71%",
    icon: Award,
    trend: -3,
    trendLabel: "vs last test",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    accent: "from-amber-400 to-orange-500",
  },
];

const BAR_COLORS = ["#4f46e5", "#7c3aed", "#0ea5e9"];
const LIGHT_COLORS = ["bg-indigo-50", "bg-violet-50", "bg-sky-50"];
const ICON_COLORS = ["text-indigo-600", "text-violet-600", "text-sky-600"];
const FILL_COLORS = ["bg-indigo-500", "bg-violet-500", "bg-sky-500"];

export default function ReportsPage() {
  const activeBatches = mockBatches.filter((b) => b.status === "active");
  const maxStudents = Math.max(...activeBatches.map((b) => b.studentCount), 1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Performance overview of your institute"
      />

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.trend == null || card.trend >= 0;
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
                  <div
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg",
                      isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(card.trend)}%
                  </div>
                )}
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs font-medium text-slate-400 mt-0.5">{card.title}</p>
                {card.trend != null && (
                  <p
                    className={cn(
                      "text-[11px] mt-1",
                      isPositive ? "text-emerald-600" : "text-red-500"
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {card.trend}% {card.trendLabel}
                  </p>
                )}
              </div>

              {/* Accent bar */}
              <div
                className={cn("h-1 w-full rounded-full bg-gradient-to-r opacity-30", card.accent)}
              />
            </div>
          );
        })}
      </div>

      {/* ── Charts row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Attendance Trend — wider */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-bold text-slate-900">Attendance Trend</p>
              <p className="text-xs text-slate-400 mt-0.5">Weekly attendance percentage</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span className="text-xs text-slate-400">Attendance %</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                domain={[60, 100]}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="present"
                stroke="#4f46e5"
                strokeWidth={2.5}
                fill="url(#attendanceGrad)"
                dot={{ r: 4, fill: "#fff", stroke: "#4f46e5", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#4f46e5" }}
                name="Attendance %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Test Scores — narrower */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="mb-5">
            <p className="text-sm font-bold text-slate-900">Test Scores</p>
            <p className="text-xs text-slate-400 mt-0.5">Average score per test</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={testScoresData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="test"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]} name="Avg Score">
                {testScoresData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.avg >= 75 ? "#4f46e5" : entry.avg >= 65 ? "#6366f1" : "#a5b4fc"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Batch strength + overview ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Batch Strength bar chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="mb-5">
            <p className="text-sm font-bold text-slate-900">Batch Strength</p>
            <p className="text-xs text-slate-400 mt-0.5">Number of students per batch</p>
          </div>
          <ResponsiveContainer width="100%" height={Math.max(160, batchStrengthData.length * 52)}>
            <BarChart data={batchStrengthData} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                width={110}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="students" radius={[0, 6, 6, 0]} name="Students">
                {batchStrengthData.map((_, index) => (
                  <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Batch overview panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="mb-5">
            <p className="text-sm font-bold text-slate-900">Batch Overview</p>
            <p className="text-xs text-slate-400 mt-0.5">Active batches at a glance</p>
          </div>

          <div className="flex-1 space-y-4">
            {activeBatches.map((batch, i) => {
              const pct = Math.round((batch.studentCount / maxStudents) * 100);
              return (
                <div key={batch.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-lg flex items-center justify-center shrink-0",
                          LIGHT_COLORS[i % LIGHT_COLORS.length]
                        )}
                      >
                        <BookOpen className={cn("h-3 w-3", ICON_COLORS[i % ICON_COLORS.length])} />
                      </div>
                      <p className="text-xs font-semibold text-slate-700 truncate">{batch.name}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 shrink-0 ml-2">
                      {batch.studentCount} students
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        FILL_COLORS[i % FILL_COLORS.length]
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[11px] text-slate-400 font-medium">Total Capacity</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {activeBatches.reduce((s, b) => s + b.studentCount, 0)}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl px-3 py-2.5">
              <p className="text-[11px] text-indigo-400 font-medium">Active Batches</p>
              <p className="text-base font-bold text-indigo-700 mt-0.5">{activeBatches.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
