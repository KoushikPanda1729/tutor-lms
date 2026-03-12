import Link from "next/link";
import {
  ClipboardList,
  Clock,
  Trophy,
  Lock,
  ChevronRight,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { mockTests } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  available: {
    label: "Available",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  scheduled: {
    label: "Scheduled",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    border: "border-l-blue-400",
    icon: CalendarClock,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  closed: {
    label: "Closed",
    badge: "bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
    border: "border-l-slate-300",
    icon: Lock,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-400",
  },
} as const;

export default async function StudentTestsPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const tests = mockTests.filter((t) => t.batchId === batchId);
  const available = tests.filter((t) => t.status === "available").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Tests</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {tests.length} total · {available} available now
          </p>
        </div>
        {available > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {available} live
          </div>
        )}
      </div>

      {tests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tests yet"
          description="Your teacher hasn't scheduled any tests yet."
        />
      ) : (
        <div className="space-y-3">
          {tests.map((test) => {
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
                  "bg-white rounded-2xl border border-slate-200 border-l-4 shadow-sm hover:shadow-md transition-all px-5 py-4 flex items-center gap-4",
                  cfg.border
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                    cfg.iconBg
                  )}
                >
                  <StatusIcon className={cn("h-5 w-5", cfg.iconColor)} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-900">{test.title}</p>
                    <span
                      className={cn(
                        "text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                        cfg.badge
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {test.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {test.totalMarks} marks
                    </span>
                    <span className="flex items-center gap-1">
                      <ClipboardList className="h-3 w-3" />
                      {test.questions.length} questions
                    </span>
                    {status === "scheduled" && test.availableFrom && (
                      <span className="text-blue-500 font-medium">
                        Opens {formatDateTime(test.availableFrom)}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                {isAvailable ? (
                  <Link
                    href={`/student/batches/${batchId}/tests/${test.id}`}
                    className="shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Attempt <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <div className="shrink-0 h-9 px-4 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold flex items-center">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
