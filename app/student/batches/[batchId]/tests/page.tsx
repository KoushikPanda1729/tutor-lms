import Link from "next/link";
import { ClipboardList, Clock, Trophy, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { mockTests } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default async function StudentTestsPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const tests = mockTests.filter((t) => t.batchId === batchId);

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900 mb-4">Tests</h3>
      {tests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tests yet"
          description="Your teacher hasn't scheduled any tests yet."
        />
      ) : (
        <div className="space-y-3">
          {tests.map((test) => {
            const isAvailable = test.status === "available";
            return (
              <Card key={test.id} className={isAvailable ? "border-green-200" : ""}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isAvailable ? "bg-green-50" : "bg-slate-50"}`}
                  >
                    {isAvailable ? (
                      <ClipboardList className="h-5 w-5 text-green-600" />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-slate-900">{test.title}</p>
                      <Badge
                        variant={
                          isAvailable
                            ? "success"
                            : test.status === "scheduled"
                              ? "pending"
                              : "secondary"
                        }
                        className="capitalize"
                      >
                        {test.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {test.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {test.totalMarks} marks
                      </span>
                      {test.status === "scheduled" && (
                        <span>Opens {formatDateTime(test.availableFrom)}</span>
                      )}
                    </div>
                  </div>
                  {isAvailable && (
                    <Link href={`/student/batches/${batchId}/tests/${test.id}`}>
                      <Button size="sm">Attempt</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
