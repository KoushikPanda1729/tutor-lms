import Link from "next/link";
import { BookOpen, ClipboardList, CalendarCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { mockBatches, mockTests } from "@/lib/mock-data";

const STUDENT_BATCH_IDS = ["batch-1", "batch-3"];
const myBatches = mockBatches.filter((b) => STUDENT_BATCH_IDS.includes(b.id));
const myTests = mockTests.filter((t) => STUDENT_BATCH_IDS.includes(t.batchId));
const availableTests = myTests.filter((t) => t.status === "available");

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Dashboard" description="Welcome back, Aarav!" />

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          title="Enrolled Batches"
          value={myBatches.length}
          icon={BookOpen}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Available Tests"
          value={availableTests.length}
          icon={ClipboardList}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Attendance"
          value="88%"
          icon={CalendarCheck}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Batches</CardTitle>
              <Link
                href="/student/batches"
                className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {myBatches.map((batch) => (
              <Link
                key={batch.id}
                href={`/student/batches/${batch.id}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{batch.name}</p>
                  <p className="text-xs text-slate-400">{batch.subject}</p>
                </div>
                <Badge variant="success">Active</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableTests.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">
                No tests available right now.
              </p>
            )}
            {availableTests.map((test) => (
              <Link
                key={test.id}
                href={`/student/batches/${test.batchId}/tests/${test.id}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{test.title}</p>
                  <p className="text-xs text-slate-400">
                    {test.duration} min · {test.totalMarks} marks
                  </p>
                </div>
                <Badge variant="success">Attempt</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
