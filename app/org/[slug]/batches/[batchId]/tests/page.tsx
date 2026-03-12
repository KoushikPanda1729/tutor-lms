"use client";

import { use } from "react";
import Link from "next/link";
import { Plus, ClipboardList, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { mockTests } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

function testStatusVariant(status: string) {
  const map: Record<string, "success" | "pending" | "secondary" | "outline"> = {
    available: "success",
    scheduled: "pending",
    closed: "secondary",
    draft: "outline",
  };
  return map[status] || "outline";
}

export default function TestsPage({
  params,
}: {
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { slug, batchId } = use(params);
  const tests = mockTests.filter((t) => t.batchId === batchId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">{tests.length} tests</p>
        <Link href={`/org/${slug}/batches/${batchId}/tests/new`}>
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> Create Test
          </Button>
        </Link>
      </div>

      {tests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tests yet"
          description="Create your first test for this batch."
        />
      ) : (
        <div className="space-y-3">
          {tests.map((test) => (
            <Card key={test.id} className="hover:border-indigo-200 transition-colors">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <ClipboardList className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold text-slate-900">{test.title}</p>
                    <Badge variant={testStatusVariant(test.status)} className="capitalize">
                      {test.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {test.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {test.totalMarks} marks
                    </span>
                    <span>{test.questions.length} questions</span>
                    <span className="hidden sm:inline">
                      From {formatDateTime(test.availableFrom)}
                    </span>
                  </div>
                </div>
                <Link href={`/org/${slug}/batches/${batchId}/tests/${test.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
