"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  Trophy,
  Lock,
  ChevronRight,
  CheckCircle2,
  CalendarClock,
  Search,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { mockTests } from "@/lib/mock-data";
import { BatchTabBar } from "@/components/student/batch-tab-bar";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  available: {
    label: "Available",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  scheduled: {
    label: "Scheduled",
    badge: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
    icon: CalendarClock,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  closed: {
    label: "Closed",
    badge: "bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
    icon: Lock,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-400",
  },
} as const;

const FILTERS = ["all", "available", "scheduled", "closed"] as const;
type Filter = (typeof FILTERS)[number];

export default function StudentTestsPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = use(params);
  const allTests = mockTests.filter((t) => t.batchId === batchId);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts: Record<Filter, number> = {
    all: allTests.length,
    available: allTests.filter((t) => t.status === "available").length,
    scheduled: allTests.filter((t) => t.status === "scheduled").length,
    closed: allTests.filter((t) => t.status === "closed").length,
  };

  const tests = allTests.filter((t) => {
    const matchFilter = filter === "all" || t.status === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-4">
      <BatchTabBar batchId={batchId} active="tests" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Tests</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {allTests.length} total · {counts.available} available now
          </p>
        </div>
        {counts.available > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {counts.available} live
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tests..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "h-7 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 capitalize whitespace-nowrap shrink-0",
                filter === f
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              {f}
              <span
                className={cn(
                  "text-[10px] font-bold rounded-full px-1.5 py-px",
                  filter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                )}
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {tests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tests yet"
          description="Your teacher hasn't scheduled any tests yet."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Column headers — hidden on mobile */}
          <div className="hidden sm:flex items-center px-5 py-2.5 bg-slate-50 border-b border-slate-100">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Test</p>
            </div>
            <div className="w-28 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Duration
              </p>
            </div>
            <div className="w-24 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Marks
              </p>
            </div>
            <div className="w-28 shrink-0 hidden md:block">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Questions
              </p>
            </div>
            <div className="w-32 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Status
              </p>
            </div>
            <div className="w-24 shrink-0 text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Action
              </p>
            </div>
          </div>

          {/* Rows */}
          {tests.map((test, i) => {
            const status =
              (test.status as keyof typeof STATUS_CONFIG) in STATUS_CONFIG
                ? (test.status as keyof typeof STATUS_CONFIG)
                : "closed";
            const cfg = STATUS_CONFIG[status];
            const StatusIcon = cfg.icon;
            const isAvailable = status === "available";

            return (
              <div
                key={test.id}
                className={cn(
                  "group transition-colors hover:bg-slate-50",
                  i !== 0 && "border-t border-slate-100"
                )}
              >
                {/* ── Mobile layout ── */}
                <div className="sm:hidden flex items-center gap-3 px-4 py-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                      cfg.iconBg
                    )}
                  >
                    <StatusIcon className={cn("h-4 w-4", cfg.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{test.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
                          cfg.badge
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                        {cfg.label}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        {test.duration}m
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Trophy className="h-3 w-3" />
                        {test.totalMarks} marks
                      </span>
                    </div>
                    {status === "scheduled" && test.availableFrom && (
                      <p className="text-[11px] text-blue-500 font-medium mt-0.5">
                        Opens {formatDateTime(test.availableFrom)}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {isAvailable ? (
                      <Link
                        href={`/student/batches/${batchId}/tests/${test.id}`}
                        className="flex items-center gap-1 h-8 px-3 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
                      >
                        Attempt <ChevronRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Lock className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Desktop layout ── */}
                <div className="hidden sm:flex items-center px-5 py-3">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                        cfg.iconBg
                      )}
                    >
                      <StatusIcon className={cn("h-4 w-4", cfg.iconColor)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {test.title}
                      </p>
                      {status === "scheduled" && test.availableFrom && (
                        <p className="text-[11px] text-blue-500 font-medium mt-0.5">
                          Opens {formatDateTime(test.availableFrom)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-28 shrink-0 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3 w-3 text-slate-300" />
                    {test.duration} min
                  </div>
                  <div className="w-24 shrink-0 flex items-center gap-1.5 text-xs text-slate-500">
                    <Trophy className="h-3 w-3 text-slate-300" />
                    {test.totalMarks}
                  </div>
                  <div className="w-28 shrink-0 hidden md:flex items-center gap-1.5 text-xs text-slate-500">
                    <ClipboardList className="h-3 w-3 text-slate-300" />
                    {test.questions.length}
                  </div>
                  <div className="w-32 shrink-0">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full",
                        cfg.badge
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="w-24 shrink-0 flex justify-end">
                    {isAvailable ? (
                      <Link
                        href={`/student/batches/${batchId}/tests/${test.id}`}
                        className="flex items-center gap-1 h-8 px-3 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
                      >
                        Attempt{" "}
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ) : (
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Lock className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
