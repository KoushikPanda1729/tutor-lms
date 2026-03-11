"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  Users,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  FileText,
  ClipboardList,
  AlertTriangle,
  Search,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { mockBatches } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Batch } from "@/types";

// Subject → color palette
const SUBJECT_COLORS: Record<string, { bg: string; icon: string; accent: string; light: string }> =
  {
    Physics: {
      bg: "bg-indigo-50",
      icon: "text-indigo-600",
      accent: "bg-indigo-500",
      light: "bg-indigo-100",
    },
    Chemistry: {
      bg: "bg-violet-50",
      icon: "text-violet-600",
      accent: "bg-violet-500",
      light: "bg-violet-100",
    },
    Biology: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      accent: "bg-emerald-500",
      light: "bg-emerald-100",
    },
    Mathematics: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      accent: "bg-amber-500",
      light: "bg-amber-100",
    },
  };

function getSubjectColor(subject: string) {
  return (
    SUBJECT_COLORS[subject] ?? {
      bg: "bg-sky-50",
      icon: "text-sky-600",
      accent: "bg-sky-500",
      light: "bg-sky-100",
    }
  );
}

export default function BatchesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Batch | null>(null);

  const filtered = batches.filter((b) => {
    const matchFilter = filter === "all" || b.status === filter;
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const toggleStatus = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBatches((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: b.status === "active" ? "archived" : "active" } : b
      )
    );
    const batch = batches.find((b) => b.id === id);
    toast.success(
      `"${batch?.name}" marked as ${batch?.status === "active" ? "archived" : "active"}`
    );
  };

  const deleteBatch = () => {
    if (!deleteTarget) return;
    setBatches((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  };

  const activeCnt = batches.filter((b) => b.status === "active").length;
  const archivedCnt = batches.filter((b) => b.status === "archived").length;

  const filterPills = [
    { id: "all" as const, label: "All", count: batches.length },
    { id: "active" as const, label: "Active", count: activeCnt },
    { id: "archived" as const, label: "Archived", count: archivedCnt },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batches"
        description={`${activeCnt} active batch${activeCnt !== 1 ? "es" : ""}`}
        action={
          <Link href={`/org/${slug}/batches/new`}>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> New Batch
            </Button>
          </Link>
        }
      />

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search batches..."
            className="h-9 w-56 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {filterPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilter(pill.id)}
              className={cn(
                "h-8 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap",
                filter === pill.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              {pill.label}
              <span
                className={cn(
                  "text-[10px] font-bold rounded-full px-1.5 py-px",
                  filter === pill.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                )}
              >
                {pill.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Batch list ──────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No batches found"
          description="Create your first batch to get started."
          action={
            <Link href={`/org/${slug}/batches/new`}>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> New Batch
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {filtered.map((batch, i) => {
            const color = getSubjectColor(batch.subject);
            const isActive = batch.status === "active";
            return (
              <div
                key={batch.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors group relative",
                  i !== 0 && "border-t border-slate-100"
                )}
              >
                {/* Left accent bar */}
                <div
                  className={cn(
                    "absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-opacity",
                    isActive ? color.accent : "bg-slate-200",
                    "opacity-0 group-hover:opacity-100"
                  )}
                />

                {/* Icon */}
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    isActive ? color.bg : "bg-slate-100"
                  )}
                >
                  <BookOpen className={cn("h-5 w-5", isActive ? color.icon : "text-slate-400")} />
                </div>

                {/* Info */}
                <Link href={`/org/${slug}/batches/${batch.id}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {batch.name}
                    </p>
                    {!isActive && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0">
                        <Archive className="h-2.5 w-2.5" /> Archived
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={cn(
                        "text-[11px] font-semibold px-2 py-0.5 rounded-md",
                        isActive ? color.light + " " + color.icon : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {batch.subject}
                    </span>
                  </div>
                </Link>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-5 shrink-0">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-bold text-slate-900">{batch.studentCount}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Users className="h-2.5 w-2.5" /> Students
                    </span>
                  </div>
                  <div className="w-px h-6 bg-slate-100" />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-bold text-slate-900">3</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <FileText className="h-2.5 w-2.5" /> Notes
                    </span>
                  </div>
                  <div className="w-px h-6 bg-slate-100" />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-bold text-slate-900">3</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ClipboardList className="h-2.5 w-2.5" /> Tests
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-3">
                  <button
                    onClick={(e) => toggleStatus(batch.id, e)}
                    title={isActive ? "Archive batch" : "Set active"}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-colors",
                      isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {isActive ? (
                      <>
                        <ToggleRight className="h-3.5 w-3.5" /> Active
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-3.5 w-3.5" /> Archived
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(batch);
                    }}
                    className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Chevron */}
                <Link href={`/org/${slug}/batches/${batch.id}`} className="shrink-0">
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Delete confirmation ──────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Delete Batch?</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  &ldquo;{deleteTarget.name}&rdquo;
                </span>
                ?
                <br />
                This will permanently remove all students, tests, notes, and attendance records.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                <BookOpen className="h-4 w-4 text-red-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{deleteTarget.name}</p>
                <p className="text-xs text-slate-500">
                  {deleteTarget.subject} · {deleteTarget.studentCount} students
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-11 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteBatch}
                className="flex-1 h-11 rounded-xl bg-red-500 text-sm font-bold text-white hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
