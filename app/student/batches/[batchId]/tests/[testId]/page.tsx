"use client";

import { useState, useEffect, useCallback, use } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Trophy,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockTests } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AnswerMap = Record<string, string>;

export default function TestAttemptPage({
  params,
}: {
  params: Promise<{ batchId: string; testId: string }>;
}) {
  const { batchId, testId } = use(params);
  const router = useRouter();
  const test = mockTests.find((t) => t.id === testId) || mockTests[0];
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    toast.success("Test submitted successfully!");
    router.push(`/student/batches/${batchId}/tests/${testId}/result`);
  }, [batchId, testId, router]);

  useEffect(() => {
    if (!started || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted, handleSubmit]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(answers).length;
  const isLowTime = timeLeft < 300;

  /* ── Start screen ──────────────────────────────────────────────── */
  if (!started) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-7 pt-8 pb-6 border-b border-slate-100 text-center">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{test.title}</h2>
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Available
              </span>
            </div>

            <div className="px-7 py-6 space-y-5">
              {/* Stats row */}
              <div className="flex items-center divide-x divide-slate-100 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                {[
                  { label: "Duration", value: `${test.duration} min`, icon: Clock },
                  { label: "Questions", value: `${test.questions.length}`, icon: ClipboardList },
                  { label: "Max Marks", value: `${test.totalMarks}`, icon: Trophy },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex-1 flex flex-col items-center py-4 gap-1">
                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                    <p className="text-base font-bold text-slate-900">{value}</p>
                    <p className="text-[10px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              {test.instructions && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 mb-0.5">Instructions</p>
                    <p className="text-sm text-amber-700 leading-relaxed">{test.instructions}</p>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="space-y-2 py-1">
                {[
                  "Ensure a stable internet connection before starting",
                  "Do not refresh or close the browser tab",
                  "Timer starts immediately when you click Start",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-2.5 text-xs text-slate-500">
                    <div className="h-4 w-4 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    </div>
                    {tip}
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={() => setStarted(true)}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors active:scale-[0.98]"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Test taking ───────────────────────────────────────────────── */
  const q = test.questions[currentQ];
  const isAnswered = (id: string) => id in answers;
  const progress = (answeredCount / test.questions.length) * 100;

  return (
    <div className="flex gap-5 -mx-6 -mt-6 px-6 pt-5 pb-6 bg-slate-100/60 min-h-[calc(100vh-4rem)] items-start">
      {/* ── Main column ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
          <p className="flex-1 text-sm font-semibold text-slate-800 truncate">{test.title}</p>

          {/* Timer */}
          <div
            className={cn(
              "flex items-center gap-1.5 font-mono text-lg font-black tabular-nums transition-colors",
              isLowTime ? "text-red-600 animate-pulse" : "text-slate-900"
            )}
          >
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formatTime(timeLeft)}
          </div>

          <div className="w-px h-5 bg-slate-200" />

          {/* Answered count */}
          <span className="text-xs text-slate-500 shrink-0">
            {answeredCount}/{test.questions.length} answered
          </span>

          <button
            onClick={handleSubmit}
            className="h-8 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold transition-all"
          >
            Submit
          </button>
        </div>

        {/* Question card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Thin progress bar */}
          <div className="h-[3px] bg-slate-100">
            <div
              className="h-full bg-slate-800 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="px-8 py-7">
            {/* Q meta row */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Question {currentQ + 1} of {test.questions.length}
              </span>
              <span className="text-slate-200">·</span>
              <span className="text-[11px] text-slate-400">
                {q.type === "mcq" ? "Multiple Choice" : "Integer Type"}
              </span>
              <div className="ml-auto flex items-center gap-3 text-[11px] text-slate-400">
                <span>+{q.marks} pts</span>
                {q.negativeMarks > 0 && <span>−{q.negativeMarks} neg</span>}
              </div>
            </div>

            {/* Question text */}
            <p className="text-[15px] text-slate-900 font-medium leading-relaxed mb-6">{q.text}</p>

            {/* MCQ options */}
            {q.type === "mcq" && q.options && (
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === opt;
                  const letter = String.fromCharCode(65 + oi);
                  return (
                    <button
                      key={oi}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all duration-150",
                        selected
                          ? "border-slate-900 bg-slate-900"
                          : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                          selected
                            ? "bg-white/20 text-white"
                            : "bg-white border border-slate-200 text-slate-500"
                        )}
                      >
                        {letter}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          selected ? "text-white font-medium" : "text-slate-700"
                        )}
                      >
                        {opt}
                      </span>
                      <div
                        className={cn(
                          "shrink-0 h-4 w-4 rounded-full border-2 flex items-center justify-center",
                          selected ? "border-white bg-white/20" : "border-slate-300"
                        )}
                      >
                        {selected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Integer input */}
            {q.type === "integer" && (
              <div className="mt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Your Answer
                </p>
                <input
                  type="number"
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Enter integer"
                  className="h-12 w-48 rounded-xl border border-slate-200 bg-slate-50 px-4 text-lg font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
                />
              </div>
            )}
          </div>
        </div>

        {/* Nav bar */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {test.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={cn(
                  "rounded-full transition-all duration-200",
                  i === currentQ
                    ? "h-2.5 w-2.5 bg-slate-900"
                    : isAnswered(test.questions[i].id)
                      ? "h-2 w-2 bg-slate-400"
                      : "h-2 w-2 bg-slate-300 hover:bg-slate-400"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentQ((q) => Math.min(test.questions.length - 1, q + 1))}
            disabled={currentQ === test.questions.length - 1}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Right sidebar ───────────────────────────────────────────── */}
      <div className="w-[200px] shrink-0 flex flex-col gap-3">
        {/* Question palette */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Questions
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {test.questions.map((question, i) => (
              <button
                key={question.id}
                onClick={() => setCurrentQ(i)}
                className={cn(
                  "h-9 w-9 rounded-xl text-xs font-bold transition-all duration-150",
                  i === currentQ
                    ? "bg-slate-900 text-white scale-105"
                    : isAnswered(question.id)
                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            {[
              { label: "Current", cls: "bg-slate-900", text: "text-slate-700" },
              { label: "Answered", cls: "bg-slate-400", text: "text-slate-500" },
              { label: "Not visited", cls: "bg-slate-200", text: "text-slate-400" },
            ].map(({ label, cls, text }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 rounded-full", cls)} />
                <span className={cn("text-[11px] font-medium", text)}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Progress
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Answered</span>
              <span className="text-sm font-black text-slate-800">{answeredCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Remaining</span>
              <span className="text-sm font-black text-slate-700">
                {test.questions.length - answeredCount}
              </span>
            </div>
          </div>

          {/* Circular-ish progress */}
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-slate-800 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] font-bold text-slate-400 text-right">{Math.round(progress)}%</p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all active:scale-95"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}
