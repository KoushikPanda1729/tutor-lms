import { Building2, Users, BookOpen, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockOrganizations, mockPlatformStats } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const pending = mockOrganizations.filter((o) => o.status === "pending");

  return (
    <div>
      <PageHeader
        title="Platform Overview"
        description="Monitor all coaching centers on TutorLMS"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Organizations"
          value={mockPlatformStats.totalOrgs}
          subtitle={`${mockPlatformStats.activeOrgs} active`}
          icon={Building2}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          trend={{ value: 12, label: "this month" }}
        />
        <StatCard
          title="Total Students"
          value={mockPlatformStats.totalStudents.toLocaleString()}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend={{ value: 8, label: "this month" }}
        />
        <StatCard
          title="Active Batches"
          value={mockPlatformStats.totalBatches}
          icon={BookOpen}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${(mockPlatformStats.monthlyRevenue / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          trend={{ value: 15, label: "vs last month" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" /> Pending Approvals
                <Badge variant="warning">{pending.length}</Badge>
              </CardTitle>
              <Link
                href="/super-admin/organizations?tab=pending"
                className="text-xs text-indigo-600 hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
                <CheckCircle className="h-4 w-4 text-green-500" /> All caught up!
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((org) => (
                  <div
                    key={org.id}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{org.name}</p>
                      <p className="text-xs text-slate-400">
                        {org.city} · {formatDate(org.createdAt)}
                      </p>
                    </div>
                    <Link
                      href={`/super-admin/organizations/${org.id}`}
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent orgs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Organizations</CardTitle>
              <Link
                href="/super-admin/organizations"
                className="text-xs text-indigo-600 hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockOrganizations.slice(0, 4).map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{org.name}</p>
                    <p className="text-xs text-slate-400">
                      {org.city} · {org.totalStudents} students
                    </p>
                  </div>
                  <Badge
                    variant={
                      org.status === "active"
                        ? "success"
                        : org.status === "pending"
                          ? "pending"
                          : org.status === "suspended"
                            ? "suspended"
                            : "destructive"
                    }
                  >
                    {org.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
