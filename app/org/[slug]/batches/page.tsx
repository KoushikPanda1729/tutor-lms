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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { mockBatches } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Batch } from "@/types";

export default function BatchesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");

  const filtered = batches.filter((b) => filter === "all" || b.status === filter);

  const toggleStatus = (id: string) => {
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

  const deleteBatch = (id: string) => {
    const batch = batches.find((b) => b.id === id);
    setBatches((prev) => prev.filter((b) => b.id !== id));
    toast.success(`"${batch?.name}" deleted`);
  };

  const activeCnt = batches.filter((b) => b.status === "active").length;

  return (
    <div>
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

      {/* Filter pills */}
      <div className="flex gap-2 mb-5">
        {(["all", "active", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors",
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            {f === "all"
              ? `All (${batches.length})`
              : f === "active"
                ? `Active (${batches.filter((b) => b.status === "active").length})`
                : `Archived (${batches.filter((b) => b.status === "archived").length})`}
          </button>
        ))}
      </div>

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
          {filtered.map((batch, i) => (
            <div
              key={batch.id}
              className={cn(
                "flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors group",
                i !== 0 && "border-t border-slate-100"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                  batch.status === "active" ? "bg-indigo-50" : "bg-slate-100"
                )}
              >
                <BookOpen
                  className={cn(
                    "h-5 w-5",
                    batch.status === "active" ? "text-indigo-600" : "text-slate-400"
                  )}
                />
              </div>

              {/* Info */}
              <Link href={`/org/${slug}/batches/${batch.id}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {batch.name}
                  </p>
                  {batch.status === "archived" && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 shrink-0">
                      Archived
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{batch.subject}</p>
              </Link>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-5 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>{batch.studentCount} students</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <FileText className="h-3.5 w-3.5" />
                  <span>3 notes</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <ClipboardList className="h-3.5 w-3.5" />
                  <span>3 tests</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Toggle active/archived */}
                <button
                  onClick={() => toggleStatus(batch.id)}
                  title={batch.status === "active" ? "Archive batch" : "Set active"}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors",
                    batch.status === "active"
                      ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {batch.status === "active" ? (
                    <>
                      <ToggleRight className="h-3.5 w-3.5" /> Active
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-3.5 w-3.5" /> Archived
                    </>
                  )}
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteBatch(batch.id)}
                  title="Delete batch"
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Chevron */}
              <Link href={`/org/${slug}/batches/${batch.id}`} className="shrink-0">
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
