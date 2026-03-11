import { BookOpen, Users, FileText, CalendarCheck, Plus, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockBatches, mockStudents, mockTests } from "@/lib/mock-data";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function OrgDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activeBatches = mockBatches.filter((b) => b.status === "active");
  const availableTests = mockTests.filter((t) => t.status === "available");

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Rajesh"
        action={
          <Link href={`/org/${slug}/batches/new`}>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> New Batch
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Batches"
          value={activeBatches.length}
          icon={BookOpen}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Total Students"
          value={mockStudents.length}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend={{ value: 5, label: "this week" }}
        />
        <StatCard
          title="Notes Uploaded"
          value={12}
          icon={FileText}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Tests Scheduled"
          value={availableTests.length}
          icon={CalendarCheck}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batches */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Batches</CardTitle>
              <Link
                href={`/org/${slug}/batches`}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeBatches.map((batch) => (
              <Link
                key={batch.id}
                href={`/org/${slug}/batches/${batch.id}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{batch.name}</p>
                  <p className="text-xs text-slate-400">
                    {batch.subject} · {batch.studentCount} students
                  </p>
                </div>
                <Badge variant="success">Active</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Tests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Tests</CardTitle>
              <Link
                href={`/org/${slug}/batches`}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{test.title}</p>
                  <p className="text-xs text-slate-400">
                    {formatDate(test.availableFrom)} · {test.duration} min
                  </p>
                </div>
                <Badge
                  variant={
                    test.status === "available"
                      ? "success"
                      : test.status === "scheduled"
                        ? "pending"
                        : test.status === "closed"
                          ? "secondary"
                          : "outline"
                  }
                  className="capitalize"
                >
                  {test.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
