"use client";

import { useState, useEffect, useCallback, use } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{test.title}</h2>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {test.duration} minutes
            </span>
            <span>{test.questions.length} questions</span>
            <span>{test.totalMarks} marks</span>
          </div>
          {test.instructions && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-medium text-amber-800 mb-1">Instructions</p>
              <p className="text-sm text-amber-700">{test.instructions}</p>
            </div>
          )}
          <Button size="xl" onClick={() => setStarted(true)}>
            Start Test
          </Button>
        </div>
      </div>
    );
  }

  const q = test.questions[currentQ];
  const isAnswered = (id: string) => id in answers;

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Timer bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-3 mb-4 shadow-sm">
          <p className="text-sm font-medium text-slate-700">{test.title}</p>
          <div
            className={cn(
              "flex items-center gap-2 font-mono text-base font-bold",
              timeLeft < 300 ? "text-red-500" : "text-slate-800"
            )}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {answeredCount}/{test.questions.length} answered
            </span>
            <Button size="sm" variant="destructive" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Q{currentQ + 1}</Badge>
            <Badge variant="outline" className="capitalize">
              {q.type}
            </Badge>
            <span className="text-xs text-slate-400 ml-auto">
              {q.marks} marks · -{q.negativeMarks} negative
            </span>
          </div>
          <p className="text-base text-slate-900 font-medium mb-6">{q.text}</p>

          {q.type === "mcq" && q.options && (
            <div className="space-y-3">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left text-sm transition-all",
                    answers[q.id] === opt
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                      answers[q.id] === opt
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 text-slate-400"
                    )}
                  >
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {q.type === "integer" && (
            <input
              type="number"
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="Enter your answer"
              className="flex h-12 w-48 rounded-xl border-2 border-slate-200 bg-white px-4 text-lg font-mono focus-visible:outline-none focus-visible:border-indigo-600"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
            disabled={currentQ === 0}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={() => setCurrentQ((q) => Math.min(test.questions.length - 1, q + 1))}
            disabled={currentQ === test.questions.length - 1}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigator */}
      <div className="w-56 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 mb-3">QUESTION NAVIGATOR</p>
        <div className="grid grid-cols-4 gap-1.5 mb-4">
          {test.questions.map((question, i) => (
            <button
              key={question.id}
              onClick={() => setCurrentQ(i)}
              className={cn(
                "h-8 w-8 rounded-lg text-xs font-semibold transition-colors",
                i === currentQ
                  ? "bg-indigo-600 text-white"
                  : isAnswered(question.id)
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="space-y-1.5 text-xs">
          {[
            { color: "bg-indigo-600", label: "Current" },
            { color: "bg-green-100 border border-green-200", label: "Answered" },
            { color: "bg-slate-100", label: "Not visited" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={cn("h-4 w-4 rounded", color)} />
              <span className="text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
