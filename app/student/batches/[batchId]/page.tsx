import Link from "next/link";
import {
  FileText,
  Video,
  ClipboardList,
  CalendarCheck,
  Users,
  BookOpen,
  ChevronRight,
  Download,
  PlayCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { BatchTabBar } from "@/components/student/batch-tab-bar";
import { mockBatches, mockNotes, mockVideos, mockTests } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SUBJECT_COLORS: Record<string, { bg: string; icon: string; badge: string; grad: string }> = {
  Physics: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
    grad: "from-indigo-500 to-violet-500",
  },
  Chemistry: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
    grad: "from-violet-500 to-purple-500",
  },
  Biology: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    grad: "from-emerald-500 to-teal-500",
  },
  Mathematics: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    grad: "from-amber-500 to-orange-500",
  },
};

export default async function StudentBatchPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const batch = mockBatches.find((b) => b.id === batchId) || mockBatches[0];
  const notes = mockNotes.filter((n) => n.batchId === batchId);
  const videos = mockVideos.filter((v) => v.batchId === batchId);
  const tests = mockTests.filter((t) => t.batchId === batchId);

  const color = SUBJECT_COLORS[batch.subject] ?? {
    bg: "bg-sky-50",
    icon: "text-sky-600",
    badge: "bg-sky-100 text-sky-700",
    grad: "from-sky-500 to-blue-500",
  };

  const availableTests = tests.filter((t) => t.status === "available");
  const upcomingTests = tests.filter((t) => t.status === "scheduled");

  return (
    <div className="space-y-5">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className={cn("h-1 w-full bg-gradient-to-r", color.grad)} />
        <div className="px-6 py-5 flex items-center gap-4">
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
              color.bg
            )}
          >
            <BookOpen className={cn("h-6 w-6", color.icon)} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">{batch.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-md", color.badge)}>
                {batch.subject}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-5 shrink-0 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span className="font-bold text-slate-700">{batch.studentCount}</span> students
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg">
              <ArrowUpRight className="h-3.5 w-3.5" />
              88% Attendance
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile tab bar ──────────────────────────────────────────── */}
      <BatchTabBar batchId={batchId} active="overview" />

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Notes + Videos */}
        <div className="lg:col-span-2 space-y-5">
          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Study Notes</p>
                  <p className="text-[11px] text-slate-400">{notes.length} files available</p>
                </div>
              </div>
              <Link
                href={`/student/batches/${batchId}/notes`}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {notes.length === 0 ? (
                <p className="px-5 py-6 text-sm text-slate-400 text-center">
                  No notes uploaded yet
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-rose-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                        {note.title}
                      </p>
                      {note.description && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {note.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {note.fileSize && (
                        <span className="text-[11px] text-slate-400">{note.fileSize}</span>
                      )}
                      <button className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-indigo-100 flex items-center justify-center transition-colors">
                        <Download className="h-3.5 w-3.5 text-slate-500 hover:text-indigo-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Videos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Video className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Lecture Videos</p>
                  <p className="text-[11px] text-slate-400">{videos.length} recordings</p>
                </div>
              </div>
              <Link
                href={`/student/batches/${batchId}/videos`}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {videos.length === 0 ? (
                <p className="px-5 py-6 text-sm text-slate-400 text-center">
                  No videos uploaded yet
                </p>
              ) : (
                videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                      <PlayCircle className="h-4 w-4 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                        {video.title}
                      </p>
                      {video.description && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {video.description}
                        </p>
                      )}
                    </div>
                    {video.duration && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Tests + Attendance */}
        <div className="space-y-5">
          {/* Tests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <ClipboardList className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Tests</p>
                  <p className="text-[11px] text-slate-400">{tests.length} total</p>
                </div>
              </div>
              <Link
                href={`/student/batches/${batchId}/tests`}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {availableTests.length > 0 && (
              <div className="px-5 py-3 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Available Now
                </p>
                {availableTests.map((test) => (
                  <Link
                    key={test.id}
                    href={`/student/batches/${batchId}/tests/${test.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors group mb-2 last:mb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-amber-700">
                        {test.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {test.totalMarks} marks · {test.duration} min
                      </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-amber-400 shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            )}

            {upcomingTests.length > 0 && (
              <div className="px-5 py-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Upcoming
                </p>
                {upcomingTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 mb-2 last:mb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{test.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {test.totalMarks} marks · {test.duration} min
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                      Soon
                    </span>
                  </div>
                ))}
              </div>
            )}

            {tests.length === 0 && (
              <p className="px-5 py-6 text-sm text-slate-400 text-center">No tests yet</p>
            )}
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CalendarCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Attendance</p>
                  <p className="text-[11px] text-slate-400">Last 30 days</p>
                </div>
              </div>
              <Link
                href={`/student/batches/${batchId}/attendance`}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Details <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="px-5 py-5">
              <div className="flex items-end justify-between mb-3">
                <p className="text-4xl font-bold text-emerald-600">88%</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Good
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "88%" }} />
              </div>
              <div className="flex justify-between mt-2 text-[11px] text-slate-400">
                <span>22 present</span>
                <span>3 absent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
