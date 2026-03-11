"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Plus, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { mockBatches } from "@/lib/mock-data";

export default function BatchesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");

  const filtered = mockBatches.filter((b) => filter === "all" || b.status === filter);

  return (
    <div>
      <PageHeader
        title="Batches"
        description={`${mockBatches.filter((b) => b.status === "active").length} active batches`}
        action={
          <Link href={`/org/${slug}/batches/new`}>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> New Batch
            </Button>
          </Link>
        }
      />

      <div className="flex gap-2 mb-6">
        {(["all", "active", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === f ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            {f}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((batch) => (
            <Link
              key={batch.id}
              href={`/org/${slug}/batches/${batch.id}`}
              className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <Badge
                  variant={batch.status === "active" ? "success" : "secondary"}
                  className="capitalize"
                >
                  {batch.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                {batch.name}
              </h3>
              <p className="text-xs text-slate-500 mb-3">{batch.subject}</p>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Users className="h-3.5 w-3.5" /> {batch.studentCount} students
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
