"use client";

import {
  CalendarCheck,
  ClipboardList,
  BookOpen,
  Building2,
  Users,
  BarChart3,
  Video,
  Star,
  Zap,
  Shield,
} from "lucide-react";

const items = [
  {
    icon: Building2,
    value: "40+",
    label: "Centers Onboarded",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Users,
    value: "12,000+",
    label: "Active Students",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: CalendarCheck,
    value: "2,400+",
    label: "Attendance / Day",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: ClipboardList,
    value: "18,000+",
    label: "Tests Auto-graded",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: BookOpen,
    value: "95,000+",
    label: "Notes & Videos Served",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: BarChart3,
    value: "99.9%",
    label: "Uptime SLA",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  { icon: Video, value: "5,000+", label: "Video Lectures", color: "text-sky-600", bg: "bg-sky-50" },
  { icon: Star, value: "4.9★", label: "Avg. Rating", color: "text-orange-600", bg: "bg-orange-50" },
  {
    icon: Zap,
    value: "<10 min",
    label: "Setup Time",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  { icon: Shield, value: "SOC2", label: "Compliant", color: "text-teal-600", bg: "bg-teal-50" },
];

export function StatsMarquee() {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-4">
      {/* Left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
      {/* Right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />

      <div className="flex gap-4 w-max" style={{ animation: "marquee 30s linear infinite" }}>
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-sm shrink-0"
          >
            <div
              className={`h-9 w-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}
            >
              <item.icon
                className={`h-4.5 w-4.5 ${item.color}`}
                style={{ height: "18px", width: "18px" }}
              />
            </div>
            <div>
              <p className={`text-base font-extrabold ${item.color} leading-none`}>{item.value}</p>
              <p className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
