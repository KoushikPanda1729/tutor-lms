"use client";

import { useState, use } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  title: z.string().min(1, "Title required"),
  instructions: z.string().optional(),
  availableFrom: z.string().min(1, "Start time required"),
  availableTo: z.string().min(1, "End time required"),
  duration: z.number().min(5, "Minimum 5 minutes"),
});

type FormData = z.infer<typeof schema>;

interface MCQQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  marks: number;
  negativeMarks: number;
}

export default function NewTestPage({
  params,
}: {
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { slug, batchId } = use(params);
  const router = useRouter();
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { duration: 60 },
  });

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 4,
        negativeMarks: 1,
      },
    ]);
  };

  const removeQuestion = (id: string) => setQuestions((prev) => prev.filter((q) => q.id !== id));

  const updateQuestion = (
    id: string,
    field: keyof MCQQuestion,
    value: string | number | string[]
  ) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Test created!");
    router.push(`/org/${slug}/batches/${batchId}/tests`);
  };

  return (
    <div>
      <Link
        href={`/org/${slug}/batches/${batchId}/tests`}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tests
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        {/* Test Details */}
        <Card>
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Test Title</label>
              <input
                {...register("title")}
                placeholder="Unit Test 1 — Mechanics"
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Instructions (optional)
              </label>
              <textarea
                {...register("instructions")}
                rows={2}
                placeholder="Read all questions carefully..."
                className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Available From
                </label>
                <input
                  type="datetime-local"
                  {...register("availableFrom")}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                {errors.availableFrom && (
                  <p className="mt-1 text-xs text-red-500">{errors.availableFrom.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Available To
                </label>
                <input
                  type="datetime-local"
                  {...register("availableTo")}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                {errors.availableTo && (
                  <p className="mt-1 text-xs text-red-500">{errors.availableTo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  {...register("duration", { valueAsNumber: true })}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                {errors.duration && (
                  <p className="mt-1 text-xs text-red-500">{errors.duration.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Questions <Badge variant="secondary">{questions.length}</Badge>
              </CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={addQuestion}>
                <Plus className="h-3.5 w-3.5" /> Add MCQ
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">No questions yet. Click &quot;Add MCQ&quot; to start.</p>
              </div>
            )}
            {questions.map((q, i) => (
              <div key={q.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Q{i + 1} · MCQ</span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                  placeholder="Question text..."
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <input
                      key={oi}
                      value={opt}
                      onChange={(e) => {
                        const opts = [...q.options];
                        opts[oi] = e.target.value;
                        updateQuestion(q.id, "options", opts);
                      }}
                      placeholder={`Option ${oi + 1}`}
                      className="flex h-8 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestion(q.id, "correctAnswer", e.target.value)}
                    placeholder="Correct answer"
                    className="flex h-8 w-full sm:flex-1 rounded-lg border border-green-200 bg-green-50 px-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  />
                  <div className="flex items-center gap-2 sm:w-28">
                    <span className="text-xs text-slate-500 shrink-0">Marks</span>
                    <input
                      type="number"
                      value={q.marks}
                      onChange={(e) => updateQuestion(q.id, "marks", Number(e.target.value))}
                      className="flex h-8 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:w-24">
                    <span className="text-xs text-slate-500 shrink-0">-ve</span>
                    <input
                      type="number"
                      value={q.negativeMarks}
                      onChange={(e) =>
                        updateQuestion(q.id, "negativeMarks", Number(e.target.value))
                      }
                      className="flex h-8 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Link href={`/org/${slug}/batches/${batchId}/tests`}>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Test"}
          </Button>
        </div>
      </form>
    </div>
  );
}
