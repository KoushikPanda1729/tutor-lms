"use client";

import { use, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  FlaskConical,
  Atom,
  Calculator,
  Globe,
  Laptop,
  TrendingUp,
  BookMarked,
  Dna,
  Users,
  CheckCircle2,
  Lightbulb,
  GraduationCap,
  ClipboardList,
  CalendarCheck,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(3, "Batch name is required"),
  subject: z.string().min(1, "Select a subject"),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const SUBJECT_OPTIONS = [
  {
    value: "Mathematics",
    label: "Mathematics",
    icon: Calculator,
    active: "bg-blue-600 border-blue-600 text-white",
    idle: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    value: "Physics",
    label: "Physics",
    icon: Atom,
    active: "bg-indigo-600 border-indigo-600 text-white",
    idle: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    value: "Chemistry",
    label: "Chemistry",
    icon: FlaskConical,
    active: "bg-violet-600 border-violet-600 text-white",
    idle: "bg-violet-50 border-violet-200 text-violet-700",
  },
  {
    value: "Biology",
    label: "Biology",
    icon: Dna,
    active: "bg-emerald-600 border-emerald-600 text-white",
    idle: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    value: "English",
    label: "English",
    icon: BookMarked,
    active: "bg-amber-600 border-amber-600 text-white",
    idle: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    value: "History",
    label: "History",
    icon: BookOpen,
    active: "bg-orange-600 border-orange-600 text-white",
    idle: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    value: "Geography",
    label: "Geography",
    icon: Globe,
    active: "bg-sky-600 border-sky-600 text-white",
    idle: "bg-sky-50 border-sky-200 text-sky-700",
  },
  {
    value: "Computer Science",
    label: "Computer Sci.",
    icon: Laptop,
    active: "bg-slate-700 border-slate-700 text-white",
    idle: "bg-slate-100 border-slate-200 text-slate-700",
  },
  {
    value: "Economics",
    label: "Economics",
    icon: TrendingUp,
    active: "bg-teal-600 border-teal-600 text-white",
    idle: "bg-teal-50 border-teal-200 text-teal-700",
  },
  {
    value: "Accountancy",
    label: "Accountancy",
    icon: Users,
    active: "bg-rose-600 border-rose-600 text-white",
    idle: "bg-rose-50 border-rose-200 text-rose-700",
  },
];

export default function NewBatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [watchedName, setWatchedName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Batch created successfully!");
    router.push(`/org/${slug}/batches`);
  };

  const handleSubjectSelect = (value: string) => {
    setSelectedSubject(value);
    setValue("subject", value, { shouldValidate: true });
  };

  const selectedSubjectOption = SUBJECT_OPTIONS.find((s) => s.value === selectedSubject);
  const SubjectIcon = selectedSubjectOption?.icon ?? GraduationCap;

  return (
    <div>
      <Link
        href={`/org/${slug}/batches`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Batches
      </Link>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* LEFT — Form (3 cols) */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Create New Batch</h1>
            <p className="text-sm text-slate-500 mt-1">
              Set up a new batch for your coaching center
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Batch Name */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <label className="block text-sm font-semibold text-slate-900 mb-0.5">
                Batch Name
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Give your batch a clear, descriptive name
              </p>
              <input
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e);
                  setWatchedName(e.target.value);
                }}
                placeholder="e.g. JEE Advanced 2026 — Batch A"
                className="flex h-11 w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Subject */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <label className="block text-sm font-semibold text-slate-900 mb-0.5">Subject</label>
              <p className="text-xs text-slate-400 mb-4">
                Choose the primary subject for this batch
              </p>
              <input type="hidden" {...register("subject")} value={selectedSubject} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUBJECT_OPTIONS.map((s) => {
                  const Icon = s.icon;
                  const isActive = selectedSubject === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => handleSubjectSelect(s.value)}
                      className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all ${isActive ? s.active : `${s.idle} hover:opacity-80`}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
              {errors.subject && (
                <p className="mt-2 text-xs text-red-500">{errors.subject.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <label className="block text-sm font-semibold text-slate-900 mb-0.5">
                Description <span className="text-xs font-normal text-slate-400">(optional)</span>
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Add any notes or details about this batch
              </p>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="e.g. Morning batch for JEE Advanced droppers. Focus on Physics and Maths..."
                className="flex w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Link href={`/org/${slug}/batches`} className="flex-1">
                <button
                  type="button"
                  className="w-full h-11 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" /> Create Batch
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT — Preview + Tips (2 cols) */}
        <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-6">
          {/* Live preview card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Live Preview
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${selectedSubject ? "bg-indigo-100" : "bg-slate-100"}`}
                >
                  <SubjectIcon
                    className={`h-5 w-5 ${selectedSubject ? "text-indigo-600" : "text-slate-400"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm truncate ${watchedName ? "text-slate-900" : "text-slate-400"}`}
                  >
                    {watchedName || "Batch name will appear here"}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${selectedSubject ? "text-indigo-600" : "text-slate-400"}`}
                  >
                    {selectedSubject || "Subject not selected"}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                  Active
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: Users, label: "Students", val: "0" },
                  { icon: FileText, label: "Notes", val: "0" },
                  { icon: ClipboardList, label: "Tests", val: "0" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-50 rounded-xl p-2.5">
                    <stat.icon className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-slate-700">{stat.val}</p>
                    <p className="text-[10px] text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What you get */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-sm font-semibold text-slate-900">What&apos;s included</p>
            </div>
            <ul className="space-y-3">
              {[
                { icon: Users, text: "Enroll unlimited students" },
                { icon: FileText, text: "Upload notes & PDFs" },
                { icon: ClipboardList, text: "Create & auto-grade tests" },
                { icon: CalendarCheck, text: "Daily attendance tracking" },
                { icon: CheckCircle2, text: "Performance analytics" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <div className="h-6 w-6 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <item.icon className="h-3.5 w-3.5 text-indigo-500" />
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro tip */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-xs font-semibold text-amber-700 mb-1">Pro tip</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Name batches consistently — e.g.{" "}
              <span className="font-semibold">JEE 2026 Batch A</span> — so students and teachers can
              easily identify them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
