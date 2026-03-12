"use client";

import { useState, useEffect, useCallback, use } from "react";
import { Clock, ChevronLeft, ChevronRight, AlertCircle, BookOpen } from "lucide-react";
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
      <div className="max-w-xl mx-auto pt-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

          <div className="p-8">
            {/* Icon + title */}
            <div className="flex flex-col items-center text-center mb-7">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{test.title}</h2>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Duration", value: `${test.duration} min`, icon: Clock },
                { label: "Questions", value: `${test.questions.length}`, icon: ChevronRight },
                { label: "Total Marks", value: `${test.totalMarks}`, icon: AlertCircle },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-center"
                >
                  <p className="text-lg font-bold text-slate-900">{value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Instructions */}
            {test.instructions && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex gap-3">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-700 mb-0.5">Instructions</p>
                  <p className="text-sm text-amber-700 leading-relaxed">{test.instructions}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setStarted(true)}
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors"
            >
              Start Test
            </button>
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
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Timer bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-3 mb-4 shadow-sm">
          <p className="text-sm font-bold text-slate-800 truncate">{test.title}</p>
          <div
            className={cn(
              "flex items-center gap-2 font-mono text-base font-bold px-3 py-1 rounded-lg",
              isLowTime ? "text-red-600 bg-red-50" : "text-slate-800 bg-slate-100"
            )}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {answeredCount}/{test.questions.length} answered
            </span>
            <button
              onClick={handleSubmit}
              className="h-8 px-3 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Question card */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-y-auto">
          {/* Progress bar */}
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden mx-5 mt-4">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6">
            {/* Q meta */}
            <div className="flex items-center gap-2 mb-5">
              <span className="h-7 px-2.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center">
                Q{currentQ + 1}
              </span>
              <span className="h-7 px-2.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold flex items-center capitalize">
                {q.type}
              </span>
              <span className="ml-auto text-xs text-slate-400">
                {q.marks} marks
                {q.negativeMarks > 0 && ` · -${q.negativeMarks} negative`}
              </span>
            </div>

            {/* Question text */}
            <p className="text-base text-slate-900 font-medium leading-relaxed mb-6">{q.text}</p>

            {/* MCQ options */}
            {q.type === "mcq" && q.options && (
              <div className="space-y-2.5">
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={oi}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                      className={cn(
                        "w-full flex items-center gap-3.5 rounded-xl border-2 px-4 py-3.5 text-left text-sm transition-all",
                        selected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-all",
                          selected
                            ? "border-indigo-500 bg-indigo-500 text-white"
                            : "border-slate-300 text-slate-500"
                        )}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className={selected ? "text-indigo-900 font-medium" : "text-slate-700"}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Integer input */}
            {q.type === "integer" && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Enter your answer</p>
                <input
                  type="number"
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="0"
                  className="flex h-12 w-40 rounded-xl border-2 border-slate-200 bg-white px-4 text-lg font-mono text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <button
            onClick={() => setCurrentQ((q) => Math.min(test.questions.length - 1, q + 1))}
            disabled={currentQ === test.questions.length - 1}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Question navigator */}
      <div className="w-56 shrink-0 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Question Navigator
        </p>
        <div className="grid grid-cols-4 gap-1.5 mb-5">
          {test.questions.map((question, i) => (
            <button
              key={question.id}
              onClick={() => setCurrentQ(i)}
              className={cn(
                "h-8 w-8 rounded-lg text-xs font-bold transition-all",
                i === currentQ
                  ? "bg-indigo-600 text-white shadow-sm"
                  : isAnswered(question.id)
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="space-y-2 mt-auto">
          {[
            { label: "Current", cls: "bg-indigo-600" },
            { label: "Answered", cls: "bg-emerald-100 border border-emerald-200" },
            { label: "Not visited", cls: "bg-slate-100" },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={cn("h-4 w-4 rounded-md", cls)} />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Answered count */}
        <div className="mt-4 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
          <p className="text-[11px] text-slate-400">Answered</p>
          <p className="text-base font-bold text-slate-900">
            {answeredCount}
            <span className="text-xs font-normal text-slate-400"> / {test.questions.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
