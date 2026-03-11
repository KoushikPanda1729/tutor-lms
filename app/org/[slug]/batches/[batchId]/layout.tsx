"use client";

import { use } from "react";
import Link from "next/link";
import { mockBatches } from "@/lib/mock-data";

export default function BatchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { slug, batchId } = use(params);
  const batch = mockBatches.find((b) => b.id === batchId) || mockBatches[0];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href={`/org/${slug}/batches`} className="hover:text-slate-800 transition-colors">
            Batches
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{batch.name}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">{batch.name}</h2>
        <p className="text-sm text-slate-500">
          {batch.subject} · {batch.studentCount} students
        </p>
      </div>

      {children}
    </div>
  );
}
