"use client";

import { useState, use } from "react";
import {
  Users,
  Mail,
  Phone,
  X,
  BookOpen,
  CalendarDays,
  Trophy,
  FileText,
  Video,
  BarChart2,
  CheckCircle2,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  mockStudents,
  mockBatches,
  mockAttendance,
  mockTestSubmissions,
  mockTests,
  mockNotes,
  mockVideos,
} from "@/lib/mock-data";
import { getInitials, formatDate, cn } from "@/lib/utils";
import type { Student } from "@/types";

function StudentDetailPanel({ student, onClose }: { student: Student; onClose: () => void }) {
  const batches = mockBatches.filter((b) => student.enrolledBatches.includes(b.id));

  const allAttendance = mockAttendance.filter((a) => student.enrolledBatches.includes(a.batchId));
  const totalClasses = allAttendance.reduce(
    (s, a) => s + a.records.filter((r) => r.studentId === student.id).length,
    0
  );
  const presentClasses = allAttendance.reduce(
    (s, a) => s + a.records.filter((r) => r.studentId === student.id && r.present).length,
    0
  );
  const attendancePct = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  const submissions = mockTestSubmissions.filter((s) => s.studentId === student.id);
  const avgScore = submissions.length
    ? Math.round(
        submissions.reduce((a, s) => a + (s.score / s.totalMarks) * 100, 0) / submissions.length
      )
    : 0;
  const topSubmission = submissions.length
    ? submissions.reduce(
        (best, s) => (s.score / s.totalMarks > best.score / best.totalMarks ? s : best),
        submissions[0]
      )
    : null;

  const batchNotes = mockNotes.filter((n) => student.enrolledBatches.includes(n.batchId));
  const batchVideos = mockVideos.filter((v) => student.enrolledBatches.includes(v.batchId));

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-base font-bold text-indigo-600">
                  {getInitials(student.name)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{student.name}</h3>
                <p className="text-xs text-slate-500">{student.email}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Joined {formatDate(student.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Phone className="h-3 w-3" /> {student.phone}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <BookOpen className="h-3 w-3" /> {batches.length} batch
              {batches.length !== 1 ? "es" : ""}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                <span className="text-xs text-indigo-600 font-medium">Attendance</span>
              </div>
              <p className="text-2xl font-bold text-indigo-700">{attendancePct}%</p>
              <p className="text-xs text-indigo-500 mt-0.5">
                {presentClasses}/{totalClasses} classes
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs text-amber-600 font-medium">Avg Score</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{avgScore}%</p>
              <p className="text-xs text-amber-500 mt-0.5">{submissions.length} tests taken</p>
            </div>
            <div className="rounded-xl bg-green-50 border border-green-100 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <FileText className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Notes</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{batchNotes.length}</p>
              <p className="text-xs text-green-500 mt-0.5">available</p>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Video className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs text-blue-600 font-medium">Videos</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{batchVideos.length}</p>
              <p className="text-xs text-blue-500 mt-0.5">available</p>
            </div>
          </div>

          {/* Enrolled Batches */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Enrolled Batches
            </p>
            <div className="space-y-2">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{batch.name}</p>
                    <p className="text-xs text-slate-400">{batch.subject}</p>
                  </div>
                  <Badge
                    variant={batch.status === "active" ? "success" : "secondary"}
                    className="capitalize text-xs"
                  >
                    {batch.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Test Performance */}
          {submissions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Test Performance
              </p>
              <div className="space-y-2">
                {submissions.map((sub) => {
                  const test = mockTests.find((t) => t.id === sub.testId);
                  const pct = Math.round((sub.score / sub.totalMarks) * 100);
                  return (
                    <div key={sub.id} className="rounded-lg border border-slate-200 px-3 py-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-medium text-slate-800 truncate flex-1">
                          {test?.title || "Test"}
                        </p>
                        <span
                          className={cn(
                            "text-xs font-bold ml-2",
                            pct >= 70
                              ? "text-green-600"
                              : pct >= 40
                                ? "text-amber-600"
                                : "text-red-500"
                          )}
                        >
                          {sub.score}/{sub.totalMarks}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className={cn(
                            "h-1.5 rounded-full",
                            pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-amber-400" : "bg-red-500"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-400">{sub.timeTaken} min</span>
                        <span className="text-xs text-slate-400">
                          {formatDate(sub.submittedAt.split("T")[0])}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Best test highlight */}
          {topSubmission && (
            <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                <p className="text-xs font-semibold text-amber-700">Best Performance</p>
              </div>
              <p className="text-sm font-bold text-amber-900">
                {mockTests.find((t) => t.id === topSubmission.testId)?.title}
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                {topSubmission.score}/{topSubmission.totalMarks} ·{" "}
                {Math.round((topSubmission.score / topSubmission.totalMarks) * 100)}%
              </p>
            </div>
          )}

          {/* Attendance history */}
          {allAttendance.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Attendance History
              </p>
              <div className="space-y-0">
                {allAttendance.map((att) => {
                  const rec = att.records.find((r) => r.studentId === student.id);
                  if (!rec) return null;
                  return (
                    <div
                      key={att.id}
                      className="flex items-center justify-between py-2 border-b border-slate-50"
                    >
                      <span className="text-xs text-slate-600">{formatDate(att.date)}</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-xs font-medium",
                          rec.present ? "text-green-600" : "text-red-500"
                        )}
                      >
                        {rec.present ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Present
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3" /> Absent
                          </>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function BatchStudentsPage({
  params,
}: {
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { batchId } = use(params);
  const students = mockStudents.filter((s) => s.enrolledBatches.includes(batchId));
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">{students.length} students enrolled</p>

      {students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students yet"
          description="Invite students to this batch."
        />
      ) : (
        <div className="space-y-2">
          {students.map((student) => {
            const submissions = mockTestSubmissions.filter((s) => s.studentId === student.id);
            const allAtt = mockAttendance.filter((a) =>
              student.enrolledBatches.includes(a.batchId)
            );
            const total = allAtt.reduce(
              (s, a) => s + a.records.filter((r) => r.studentId === student.id).length,
              0
            );
            const present = allAtt.reduce(
              (s, a) => s + a.records.filter((r) => r.studentId === student.id && r.present).length,
              0
            );
            const pct = total > 0 ? Math.round((present / total) * 100) : null;

            return (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="w-full flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all text-left group"
              >
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-indigo-600">
                    {getInitials(student.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {student.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Mail className="h-3 w-3" /> {student.email}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Phone className="h-3 w-3" /> {student.phone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5 shrink-0">
                  {pct !== null && (
                    <div className="text-center">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          pct >= 75
                            ? "text-green-600"
                            : pct >= 50
                              ? "text-amber-500"
                              : "text-red-500"
                        )}
                      >
                        {pct}%
                      </p>
                      <p className="text-[10px] text-slate-400">attend.</p>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm font-bold text-indigo-600">{submissions.length}</p>
                    <p className="text-[10px] text-slate-400">tests</p>
                  </div>
                  <BarChart2 className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedStudent && (
        <StudentDetailPanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}
