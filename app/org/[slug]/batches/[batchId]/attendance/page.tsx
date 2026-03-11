"use client";

import { useState, use } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isFuture,
  isToday,
  subMonths,
  addMonths,
  parseISO,
} from "date-fns";
import { Check, X, Save, ChevronLeft, ChevronRight, CheckCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockStudents, mockAttendance } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn, getInitials } from "@/lib/utils";
import type { Student } from "@/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Student History Panel ──────────────────────────────────────────
function StudentHistoryPanel({
  student,
  batchId,
  onClose,
}: {
  student: Student;
  batchId: string;
  onClose: () => void;
}) {
  const allRecords = mockAttendance
    .filter((a) => a.batchId === batchId)
    .map((a) => ({
      date: a.date,
      present: a.records.find((r) => r.studentId === student.id)?.present ?? null,
    }))
    .filter((r) => r.present !== null) as { date: string; present: boolean }[];

  const mostRecentDate =
    allRecords.length > 0
      ? parseISO([...allRecords].sort((a, b) => b.date.localeCompare(a.date))[0].date)
      : new Date();

  const [panelMonth, setPanelMonth] = useState(mostRecentDate);

  const totalClasses = allRecords.length;
  const presentCount = allRecords.filter((r) => r.present).length;
  const absentCount = totalClasses - presentCount;
  const attendancePct = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  const getStatusForDate = (date: Date) => {
    const d = format(date, "yyyy-MM-dd");
    return allRecords.find((r) => r.date === d) ?? null;
  };

  const days = eachDayOfInterval({ start: startOfMonth(panelMonth), end: endOfMonth(panelMonth) });
  const startPad = getDay(startOfMonth(panelMonth));
  const monthRecords = allRecords.filter((r) => r.date.startsWith(format(panelMonth, "yyyy-MM")));

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-screen w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-base font-bold text-indigo-600">
                  {getInitials(student.name)}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{student.name}</h3>
                <p className="text-xs text-slate-400">{student.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 3 stat cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
              <p className="text-xl font-black text-slate-800">{totalClasses}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Classes</p>
            </div>
            <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-center">
              <p className="text-xl font-black text-green-700">{presentCount}</p>
              <p className="text-[10px] text-green-500 mt-0.5">Present</p>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-center">
              <p className="text-xl font-black text-red-600">{absentCount}</p>
              <p className="text-[10px] text-red-400 mt-0.5">Absent</p>
            </div>
          </div>

          {/* Overall % bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-500 font-medium">Overall Attendance</span>
              <span
                className={cn(
                  "text-sm font-bold",
                  attendancePct >= 75
                    ? "text-green-600"
                    : attendancePct >= 50
                      ? "text-amber-500"
                      : "text-red-500"
                )}
              >
                {attendancePct}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  attendancePct >= 75
                    ? "bg-green-500"
                    : attendancePct >= 50
                      ? "bg-amber-400"
                      : "bg-red-500"
                )}
                style={{ width: `${attendancePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Calendar + Log */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 border-b border-slate-100">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setPanelMonth((m) => subMonths(m, 1))}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">
                  {format(panelMonth, "MMMM yyyy")}
                </p>
                {monthRecords.length > 0 && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {monthRecords.filter((r) => r.present).length}P ·{" "}
                    {monthRecords.filter((r) => !r.present).length}A
                  </p>
                )}
              </div>
              <button
                onClick={() => setPanelMonth((m) => addMonths(m, 1))}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-bold text-slate-400 uppercase py-1"
                >
                  {d.slice(0, 1)}
                </div>
              ))}
            </div>

            {/* Calendar cells — fully colored */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startPad }).map((_, i) => (
                <div key={`p-${i}`} />
              ))}
              {days.map((day) => {
                const status = getStatusForDate(day);
                const future = isFuture(day) && !isToday(day);
                const todayDay = isToday(day);
                return (
                  <div
                    key={format(day, "yyyy-MM-dd")}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl min-h-11 text-xs font-semibold select-none",
                      future
                        ? "text-slate-200"
                        : status?.present === true
                          ? "bg-green-500 text-white shadow-sm shadow-green-200"
                          : status?.present === false
                            ? "bg-red-500 text-white shadow-sm shadow-red-200"
                            : "text-slate-400",
                      todayDay &&
                        !status &&
                        "ring-2 ring-indigo-400 ring-offset-1 text-indigo-700 font-black"
                    )}
                    title={
                      status
                        ? `${format(day, "dd MMM")} — ${status.present ? "Present" : "Absent"}`
                        : undefined
                    }
                  >
                    <span>{format(day, "d")}</span>
                    {status && (
                      <span className="text-[9px] opacity-90">{status.present ? "✓" : "✗"}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-lg bg-green-500 inline-block" /> Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-lg bg-red-500 inline-block" /> Absent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-lg bg-slate-100 border border-slate-200 inline-block" />{" "}
                No class
              </span>
            </div>
          </div>

          {/* History log */}
          <div className="px-5 py-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Attendance Log
            </p>
            {allRecords.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No records yet</p>
            ) : (
              <div className="space-y-1.5">
                {[...allRecords]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((rec) => (
                    <div
                      key={rec.date}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5",
                        rec.present ? "bg-green-50" : "bg-red-50"
                      )}
                    >
                      <span className="text-xs font-medium text-slate-700">
                        {format(parseISO(rec.date), "EEE, dd MMM yyyy")}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1",
                          rec.present ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        )}
                      >
                        {rec.present ? (
                          <>
                            <Check className="h-3 w-3" />
                            Present
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3" />
                            Absent
                          </>
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Attendance Page ───────────────────────────────────────────
export default function AttendancePage({
  params,
}: {
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { batchId } = use(params);
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(format(today, "yyyy-MM-dd"));
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);
  const batchStudents = mockStudents.filter((s) => s.enrolledBatches.includes(batchId));

  const getExisting = (date: string) =>
    mockAttendance.find((a) => a.batchId === batchId && a.date === date);

  const buildInit = (date: string) => {
    const existing = getExisting(date);
    return batchStudents.reduce(
      (acc, s) => {
        const rec = existing?.records.find((r) => r.studentId === s.id);
        acc[s.id] = rec ? rec.present : true;
        return acc;
      },
      {} as Record<string, boolean>
    );
  };

  const [attendance, setAttendance] = useState<Record<string, boolean>>(buildInit(selectedDate));

  const selectDate = (date: Date) => {
    if (isFuture(date) && !isToday(date)) return;
    const d = format(date, "yyyy-MM-dd");
    setSelectedDate(d);
    setAttendance(buildInit(d));
  };

  const toggle = (id: string) => setAttendance((p) => ({ ...p, [id]: !p[id] }));
  const markAll = (v: boolean) =>
    setAttendance(
      batchStudents.reduce((a, s) => ({ ...a, [s.id]: v }), {} as Record<string, boolean>)
    );

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const save = () =>
    toast.success(
      `Attendance saved for ${format(new Date(selectedDate + "T00:00:00"), "dd MMM yyyy")}`
    );

  const days = eachDayOfInterval({
    start: startOfMonth(calendarMonth),
    end: endOfMonth(calendarMonth),
  });
  const startPad = getDay(startOfMonth(calendarMonth));

  const getDateStatus = (date: Date) => {
    const d = format(date, "yyyy-MM-dd");
    const rec = mockAttendance.find((a) => a.batchId === batchId && a.date === d);
    if (!rec) return null;
    return { present: rec.records.filter((r) => r.present).length, total: rec.records.length };
  };

  const getStudentStats = (studentId: string) => {
    const recs = mockAttendance
      .filter((a) => a.batchId === batchId)
      .flatMap((a) => a.records.filter((r) => r.studentId === studentId));
    const total = recs.length;
    const present = recs.filter((r) => r.present).length;
    return { pct: total > 0 ? Math.round((present / total) * 100) : null };
  };

  return (
    <div>
      {/* Single unified card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* ── Top bar: date + actions ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-base font-semibold text-slate-900">
              {format(new Date(selectedDate + "T00:00:00"), "EEEE, dd MMMM yyyy")}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              <span className="text-green-600 font-medium">{presentCount} present</span>
              {" · "}
              <span className="text-red-500 font-medium">
                {batchStudents.length - presentCount} absent
              </span>
              {" · "}
              {batchStudents.length} students
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => markAll(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-green-600 transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" /> All Present
            </button>
            <span className="text-slate-200">|</span>
            <button
              onClick={() => markAll(false)}
              className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" /> All Absent
            </button>
            <Button size="sm" onClick={save}>
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
          </div>
        </div>

        {/* ── Body: calendar + students side by side ── */}
        <div className="flex divide-x divide-slate-100">
          {/* Calendar */}
          <div className="w-72 shrink-0 p-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setCalendarMonth((m) => subMonths(m, 1))}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-sm font-semibold text-slate-800">
                {format(calendarMonth, "MMMM yyyy")}
              </p>
              <button
                onClick={() => setCalendarMonth((m) => addMonths(m, 1))}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">
                  {d.slice(0, 1)}
                </div>
              ))}
            </div>

            {/* Date cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: startPad }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const status = getDateStatus(day);
                const isSelected = dateStr === selectedDate;
                const future = isFuture(day) && !isToday(day);
                const todayDay = isToday(day);
                return (
                  <button
                    key={dateStr}
                    disabled={future}
                    onClick={() => selectDate(day)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg h-8 text-xs font-medium transition-all",
                      future
                        ? "text-slate-300 cursor-not-allowed"
                        : isSelected
                          ? "bg-indigo-600 text-white"
                          : "text-slate-700 hover:bg-slate-100 cursor-pointer",
                      todayDay && !isSelected && "ring-1 ring-indigo-400 text-indigo-600 font-bold"
                    )}
                  >
                    <span>{format(day, "d")}</span>
                    {status && (
                      <span
                        className={cn(
                          "h-1 w-1 rounded-full mt-0.5",
                          isSelected
                            ? "bg-white/60"
                            : status.present === status.total
                              ? "bg-green-500"
                              : status.present === 0
                                ? "bg-red-500"
                                : "bg-amber-400"
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Present
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Partial
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Absent
              </span>
            </div>
          </div>

          {/* Students */}
          <div className="flex-1 divide-y divide-slate-50">
            {batchStudents.map((student, i) => {
              const present = attendance[student.id];
              const stats = getStudentStats(student.id);
              return (
                <div
                  key={student.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-xs text-slate-300 w-4 shrink-0 text-center">{i + 1}</span>
                  <button
                    onClick={() => setHistoryStudent(student)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left group"
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs font-semibold text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {student.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-slate-400">{student.email}</p>
                        {stats.pct !== null && (
                          <span
                            className={cn(
                              "text-[10px] font-semibold",
                              stats.pct >= 75
                                ? "text-green-600"
                                : stats.pct >= 50
                                  ? "text-amber-500"
                                  : "text-red-500"
                            )}
                          >
                            {stats.pct}%
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => toggle(student.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors shrink-0",
                      present
                        ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        : "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                    )}
                  >
                    {present ? (
                      <>
                        <Check className="h-3 w-3" /> Present
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" /> Absent
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {historyStudent && (
        <StudentHistoryPanel
          student={historyStudent}
          batchId={batchId}
          onClose={() => setHistoryStudent(null)}
        />
      )}
    </div>
  );
}
