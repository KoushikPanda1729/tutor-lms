"use client";

import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Users,
  FileText,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { mockBatches } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STUDENT_BATCH_IDS = ["batch-1", "batch-3"];
const myBatches = mockBatches.filter((b) => STUDENT_BATCH_IDS.includes(b.id));

const SUBJECT_COLORS: Record<string, { bg: string; icon: string; light: string }> = {
  Physics: { bg: "bg-indigo-50", icon: "text-indigo-600", light: "bg-indigo-100 text-indigo-700" },
  Chemistry: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    light: "bg-violet-100 text-violet-700",
  },
  Biology: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    light: "bg-emerald-100 text-emerald-700",
  },
  Mathematics: { bg: "bg-amber-50", icon: "text-amber-600", light: "bg-amber-100 text-amber-700" },
};

function getColor(subject: string) {
  return (
    SUBJECT_COLORS[subject] ?? {
      bg: "bg-sky-50",
      icon: "text-sky-600",
      light: "bg-sky-100 text-sky-700",
    }
  );
}

export default function StudentBatchesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Batches"
        description={`${myBatches.length} enrolled batch${myBatches.length !== 1 ? "es" : ""}`}
      />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {myBatches.map((batch, i) => {
          const color = getColor(batch.subject);
          return (
            <Link
              key={batch.id}
              href={`/student/batches/${batch.id}`}
              className={cn(
                "flex items-center gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors group relative",
                i !== 0 && "border-t border-slate-100"
              )}
            >
              {/* Left accent */}
              <div
                className={cn(
                  "absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-opacity opacity-0 group-hover:opacity-100",
                  color.icon.replace("text-", "bg-")
                )}
              />

              {/* Icon */}
              <div
                className={cn(
                  "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                  color.bg
                )}
              >
                <BookOpen className={cn("h-5 w-5", color.icon)} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {batch.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md", color.light)}
                  >
                    {batch.subject}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-5 shrink-0">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-bold text-slate-900">{batch.studentCount}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Users className="h-2.5 w-2.5" /> Students
                  </span>
                </div>
                <div className="w-px h-6 bg-slate-100" />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-bold text-slate-900">3</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <FileText className="h-2.5 w-2.5" /> Notes
                  </span>
                </div>
                <div className="w-px h-6 bg-slate-100" />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-bold text-slate-900">3</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <ClipboardList className="h-2.5 w-2.5" /> Tests
                  </span>
                </div>
                <div className="w-px h-6 bg-slate-100" />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-bold text-emerald-600">88%</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <CalendarCheck className="h-2.5 w-2.5" /> Attendance
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
