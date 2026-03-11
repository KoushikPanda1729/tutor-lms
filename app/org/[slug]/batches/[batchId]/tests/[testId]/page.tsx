"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Clock,
  Users,
  BarChart2,
  CheckCircle2,
  XCircle,
  Hash,
  ListChecks,
  X,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTests, mockTestSubmissions } from "@/lib/mock-data";
import { formatDateTime, cn } from "@/lib/utils";
import type { TestSubmission } from "@/types";

type PanelState = { type: "questions" } | { type: "student"; submission: TestSubmission } | null;

export default function TestDetailPage({
  params,
}: {
  params: Promise<{ slug: string; batchId: string; testId: string }>;
}) {
  const { slug, batchId, testId } = use(params);
  const test = mockTests.find((t) => t.id === testId) || mockTests[0];
  const submissions = mockTestSubmissions.filter((s) => s.testId === testId);

  const [panel, setPanel] = useState<PanelState>(null);

  const avgScore = submissions.length
    ? Math.round(submissions.reduce((a, s) => a + s.score, 0) / submissions.length)
    : 0;
  const topScore = submissions.length ? Math.max(...submissions.map((s) => s.score)) : 0;

  const sortedSubmissions = [...submissions].sort((a, b) => b.score - a.score);

  return (
    <div className="relative">
      {/* Back link */}
      <Link
        href={`/org/${slug}/batches/${batchId}/tests`}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tests
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{test.title}</h2>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {test.duration} min
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              {test.totalMarks} marks
            </span>
            <span>{test.questions.length} questions</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setPanel({ type: "questions" })}
          >
            <ListChecks className="h-4 w-4" />
            View Question Set
          </Button>
          <Badge
            variant={
              test.status === "available"
                ? "success"
                : test.status === "scheduled"
                  ? "pending"
                  : "secondary"
            }
            className="capitalize"
          >
            {test.status}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Attempts",
            value: submissions.length,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Avg Score",
            value: `${avgScore}/${test.totalMarks}`,
            icon: BarChart2,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Top Score",
            value: `${topScore}/${test.totalMarks}`,
            icon: Trophy,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Duration",
            value: `${test.duration} min`,
            icon: Clock,
            color: "text-green-600",
            bg: "bg-green-50",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3"
          >
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-base font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Student Results</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {submissions.length === 0 ? (
                <p className="text-sm text-slate-400 p-6 text-center">No submissions yet.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Rank", "Student", "Score", "Time Taken", "Submitted", ""].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSubmissions.map((sub, i) => (
                      <tr
                        key={sub.id}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                              i === 0
                                ? "bg-amber-100 text-amber-700"
                                : i === 1
                                  ? "bg-slate-100 text-slate-700"
                                  : i === 2
                                    ? "bg-orange-100 text-orange-700"
                                    : "text-slate-400"
                            )}
                          >
                            {i + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                          {sub.studentName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-bold text-slate-900">{sub.score}</span>
                          <span className="text-xs text-slate-400">/{sub.totalMarks}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{sub.timeTaken} min</td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {formatDateTime(sub.submittedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setPanel({ type: "student", submission: sub })}
                            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Responses
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Info */}
        <Card>
          <CardHeader>
            <CardTitle>Test Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Available From</p>
              <p className="font-medium text-slate-800">{formatDateTime(test.availableFrom)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Available To</p>
              <p className="font-medium text-slate-800">{formatDateTime(test.availableTo)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Shuffle Questions</p>
              <Badge variant={test.shuffleQuestions ? "success" : "secondary"}>
                {test.shuffleQuestions ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Show Result Immediately</p>
              <Badge variant={test.showResultImmediately ? "success" : "secondary"}>
                {test.showResultImmediately ? "Yes" : "No"}
              </Badge>
            </div>
            {test.instructions && (
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Instructions</p>
                <p className="text-sm text-slate-700">{test.instructions}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Right Slide-over Panel ── */}
      {panel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => setPanel(null)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              {panel.type === "questions" ? (
                <div>
                  <h3 className="font-semibold text-slate-900">Question Set</h3>
                  <p className="text-xs text-slate-500">
                    {test.questions.length} questions · {test.totalMarks} marks
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-slate-900">{panel.submission.studentName}</h3>
                  <p className="text-xs text-slate-500">
                    Score: {panel.submission.score}/{panel.submission.totalMarks} ·{" "}
                    {panel.submission.timeTaken} min
                  </p>
                </div>
              )}
              <button
                onClick={() => setPanel(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Score bar for student panel */}
            {panel.type === "student" && (
              <div className="px-5 py-3 border-b border-slate-100 bg-white shrink-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500">Performance</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {Math.round((panel.submission.score / panel.submission.totalMarks) * 100)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      panel.submission.score / panel.submission.totalMarks >= 0.7
                        ? "bg-green-500"
                        : panel.submission.score / panel.submission.totalMarks >= 0.4
                          ? "bg-amber-500"
                          : "bg-red-500"
                    )}
                    style={{
                      width: `${(panel.submission.score / panel.submission.totalMarks) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {panel.type === "questions" ? (
                // ── Questions View ──
                test.questions.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No questions added yet.</p>
                ) : (
                  test.questions.map((q, idx) => (
                    <div key={q.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-start gap-2.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                            {idx + 1}
                          </span>
                          <p className="text-sm font-medium text-slate-800 leading-relaxed">
                            {q.text}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge
                            variant={q.type === "mcq" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {q.type === "mcq" ? "MCQ" : "Integer"}
                          </Badge>
                          <span className="text-xs text-slate-500">+{q.marks}</span>
                          {q.negativeMarks > 0 && (
                            <span className="text-xs text-red-500">-{q.negativeMarks}</span>
                          )}
                        </div>
                      </div>

                      {q.type === "mcq" && q.options && (
                        <div className="ml-8 space-y-1.5">
                          {q.options.map((opt, i) => {
                            const isCorrect = opt === q.correctAnswer;
                            return (
                              <div
                                key={i}
                                className={cn(
                                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                                  isCorrect
                                    ? "border-green-300 bg-green-50 text-green-800"
                                    : "border-slate-200 bg-white text-slate-600"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                                    isCorrect
                                      ? "bg-green-200 text-green-700"
                                      : "bg-slate-100 text-slate-500"
                                  )}
                                >
                                  {["A", "B", "C", "D"][i]}
                                </span>
                                <span className="flex-1">{opt}</span>
                                {isCorrect && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {q.type === "integer" && (
                        <div className="ml-8">
                          <div className="inline-flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm">
                            <Hash className="h-4 w-4 text-green-600" />
                            <span className="text-green-800 font-medium">
                              Answer: {q.correctAnswer}
                            </span>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )
              ) : (
                // ── Student Submission View ──
                test.questions.map((q, idx) => {
                  const studentAnswer = panel.submission.answers[q.id];
                  const isCorrect = studentAnswer === q.correctAnswer;
                  const isSkipped = !studentAnswer;

                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "rounded-xl border p-4",
                        isSkipped
                          ? "border-slate-200 bg-slate-50"
                          : isCorrect
                            ? "border-green-200 bg-green-50/50"
                            : "border-red-200 bg-red-50/50"
                      )}
                    >
                      {/* Question */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                              isSkipped
                                ? "bg-slate-200 text-slate-500"
                                : isCorrect
                                  ? "bg-green-200 text-green-700"
                                  : "bg-red-200 text-red-700"
                            )}
                          >
                            {idx + 1}
                          </span>
                          <p className="text-sm font-medium text-slate-800 leading-relaxed">
                            {q.text}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {isSkipped ? (
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              Skipped
                            </span>
                          ) : isCorrect ? (
                            <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> +{q.marks}
                            </span>
                          ) : (
                            <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              {q.negativeMarks > 0 ? `-${q.negativeMarks}` : "Wrong"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* MCQ answer comparison */}
                      {q.type === "mcq" && q.options && (
                        <div className="ml-8 space-y-1.5">
                          {q.options.map((opt, i) => {
                            const isThisCorrect = opt === q.correctAnswer;
                            const isStudentPick = opt === studentAnswer;
                            const isWrongPick = isStudentPick && !isThisCorrect;

                            return (
                              <div
                                key={i}
                                className={cn(
                                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                                  isThisCorrect && isStudentPick
                                    ? "border-green-300 bg-green-50 text-green-800"
                                    : isThisCorrect
                                      ? "border-green-200 bg-green-50/60 text-green-700"
                                      : isWrongPick
                                        ? "border-red-300 bg-red-50 text-red-700"
                                        : "border-slate-200 bg-white text-slate-500"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                                    isThisCorrect
                                      ? "bg-green-200 text-green-700"
                                      : isWrongPick
                                        ? "bg-red-200 text-red-700"
                                        : "bg-slate-100 text-slate-400"
                                  )}
                                >
                                  {["A", "B", "C", "D"][i]}
                                </span>
                                <span className="flex-1">{opt}</span>
                                {isThisCorrect && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                )}
                                {isWrongPick && (
                                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                                )}
                                {isStudentPick && (
                                  <span className="text-[10px] font-semibold text-current opacity-60 ml-1">
                                    Your answer
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Integer answer comparison */}
                      {q.type === "integer" && (
                        <div className="ml-8 flex flex-wrap gap-2">
                          <div
                            className={cn(
                              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                              isSkipped
                                ? "border-slate-200 bg-slate-100 text-slate-500"
                                : isCorrect
                                  ? "border-green-300 bg-green-50 text-green-800"
                                  : "border-red-300 bg-red-50 text-red-700"
                            )}
                          >
                            <Hash className="h-4 w-4" />
                            <span className="font-medium">
                              Student: {isSkipped ? "—" : studentAnswer}
                            </span>
                            {!isSkipped &&
                              (isCorrect ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              ))}
                          </div>
                          {!isCorrect && (
                            <div className="inline-flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800">
                              <Hash className="h-4 w-4 text-green-600" />
                              <span className="font-medium">Correct: {q.correctAnswer}</span>
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
