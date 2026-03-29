"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  Video,
  ClipboardList,
  CalendarCheck,
  Users,
  Pencil,
  X,
  Loader2,
  Atom,
  FlaskConical,
  Dna,
  Calculator,
  BookMarked,
  BookOpen,
  Globe,
  Laptop,
  TrendingUp,
} from "lucide-react";

type Batch = {
  id: string;
  name: string;
  description?: string;
  subject?: string;
  is_active: boolean;
};

const SUBJECT_OPTIONS = [
  {
    value: "Mathematics",
    icon: Calculator,
    active: "bg-blue-600 border-blue-600 text-white",
    idle: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    value: "Physics",
    icon: Atom,
    active: "bg-indigo-600 border-indigo-600 text-white",
    idle: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    value: "Chemistry",
    icon: FlaskConical,
    active: "bg-violet-600 border-violet-600 text-white",
    idle: "bg-violet-50 border-violet-200 text-violet-700",
  },
  {
    value: "Biology",
    icon: Dna,
    active: "bg-emerald-600 border-emerald-600 text-white",
    idle: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    value: "English",
    icon: BookMarked,
    active: "bg-amber-600 border-amber-600 text-white",
    idle: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    value: "History",
    icon: BookOpen,
    active: "bg-orange-600 border-orange-600 text-white",
    idle: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    value: "Geography",
    icon: Globe,
    active: "bg-sky-600 border-sky-600 text-white",
    idle: "bg-sky-50 border-sky-200 text-sky-700",
  },
  {
    value: "Computer Science",
    icon: Laptop,
    active: "bg-slate-700 border-slate-700 text-white",
    idle: "bg-slate-100 border-slate-200 text-slate-700",
  },
  {
    value: "Economics",
    icon: TrendingUp,
    active: "bg-teal-600 border-teal-600 text-white",
    idle: "bg-teal-50 border-teal-200 text-teal-700",
  },
];

const editSchema = z.object({
  name: z.string().min(3, "Batch name is required"),
  subject: z.string().optional(),
  description: z.string().optional(),
});
type EditForm = z.infer<typeof editSchema>;

export default function BatchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { slug, batchId } = use(params);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["batch", slug, batchId],
    queryFn: () => api.get<Batch>(`/organisations/${slug}/batches/${batchId}`),
  });

  const batch = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditForm>({ resolver: zodResolver(editSchema) });

  const selectedSubject = watch("subject") ?? "";

  useEffect(() => {
    if (batch) {
      const matched = SUBJECT_OPTIONS.find(
        (s) => s.value.toLowerCase() === (batch.subject ?? "").toLowerCase()
      );
      const subjectVal = matched?.value ?? batch.subject ?? "";
      reset({ name: batch.name, subject: subjectVal, description: batch.description ?? "" });
    }
  }, [batch, reset]);

  const editMutation = useMutation({
    mutationFn: (body: EditForm) =>
      api.patch(`/organisations/${slug}/batches/${batchId}`, {
        name: body.name,
        ...(body.subject ? { subject: body.subject } : {}),
        ...(body.description ? { description: body.description } : {}),
      }),
    onSuccess: () => {
      toast.success("Batch updated");
      setEditOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["batch", slug, batchId] });
      void queryClient.invalidateQueries({ queryKey: ["batches", slug] });
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to update"),
  });

  const tabs = [
    {
      label: "Overview",
      href: `/org/${slug}/batches/${batchId}`,
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "Notes", href: `/org/${slug}/batches/${batchId}/notes`, icon: FileText, exact: false },
    { label: "Videos", href: `/org/${slug}/batches/${batchId}/videos`, icon: Video, exact: false },
    {
      label: "Tests",
      href: `/org/${slug}/batches/${batchId}/tests`,
      icon: ClipboardList,
      exact: false,
    },
    {
      label: "Attendance",
      href: `/org/${slug}/batches/${batchId}/attendance`,
      icon: CalendarCheck,
      exact: false,
    },
    {
      label: "Students",
      href: `/org/${slug}/batches/${batchId}/students`,
      icon: Users,
      exact: false,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href={`/org/${slug}/batches`} className="hover:text-slate-800 transition-colors">
            Batches
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{batch?.name ?? "..."}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900">{batch?.name ?? "Loading..."}</h2>
            {batch?.subject && <p className="text-sm text-slate-500 capitalize">{batch.subject}</p>}
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shrink-0"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-none mb-5 pb-1">
        {tabs.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap shrink-0",
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}

      {/* Edit slide-over */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-[420px] bg-white shadow-2xl flex flex-col h-full">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-900">Edit Batch</p>
                <p className="text-xs text-slate-400 mt-0.5">Update batch details</p>
              </div>
              <button
                onClick={() => setEditOpen(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit((d) => editMutation.mutate(d))}
              className="flex-1 overflow-y-auto p-6 space-y-5"
            >
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Batch Name
                </label>
                <input
                  {...register("name")}
                  className="mt-2 flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 focus:bg-white transition-all"
                  placeholder="e.g. JEE Advanced 2026 — Batch A"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Subject <span className="normal-case font-normal">(optional)</span>
                </label>
                <input type="hidden" {...register("subject")} />
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {SUBJECT_OPTIONS.map((s) => {
                    const Icon = s.icon;
                    const isActive = selectedSubject === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setValue("subject", isActive ? "" : s.value)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-medium transition-all",
                          isActive ? s.active : `${s.idle} hover:opacity-80`
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {s.value}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Description <span className="normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="mt-2 flex w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 focus:bg-white transition-all resize-none"
                  placeholder="Add a description for this batch..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className="flex-1 h-10 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                >
                  {editMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
