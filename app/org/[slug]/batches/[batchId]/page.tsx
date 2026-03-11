import { Users, FileText, Video, ClipboardList } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockNotes, mockVideos, mockTests, mockStudents } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default async function BatchOverview({
  params,
}: {
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { batchId } = await params;
  const batchNotes = mockNotes.filter((n) => n.batchId === batchId);
  const batchVideos = mockVideos.filter((v) => v.batchId === batchId);
  const batchTests = mockTests.filter((t) => t.batchId === batchId);
  const batchStudents = mockStudents.filter((s) => s.enrolledBatches.includes(batchId));

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Students"
          value={batchStudents.length}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Notes"
          value={batchNotes.length}
          icon={FileText}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Videos"
          value={batchVideos.length}
          icon={Video}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Tests"
          value={batchTests.length}
          icon={ClipboardList}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {batchTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{test.title}</p>
                  <p className="text-xs text-slate-400">
                    {formatDate(test.availableFrom)} · {test.duration}min · {test.totalMarks} marks
                  </p>
                </div>
                <Badge
                  variant={
                    test.status === "available"
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
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {batchNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{note.title}</p>
                  <p className="text-xs text-slate-400">
                    {note.uploadedBy} · {note.fileSize}
                  </p>
                </div>
                <button className="text-xs text-indigo-600 hover:underline">Download</button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
