"use client";

import { useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Video,
  ClipboardList,
  CalendarCheck,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  mockOrganizations,
  mockBatches,
  mockStudents,
  mockTeachers,
  mockNotes,
  mockVideos,
  mockTests,
  mockAttendance,
} from "@/lib/mock-data";
import { formatDate, formatDateTime, getInitials, cn } from "@/lib/utils";
import { toast } from "sonner";

function statusVariant(status: string) {
  const map: Record<string, "success" | "pending" | "suspended" | "destructive"> = {
    active: "success",
    pending: "pending",
    suspended: "suspended",
    rejected: "destructive",
  };
  return map[status] || ("secondary" as "success");
}

function OrgDetailContent({ orgId }: { orgId: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "overview";
  const org = mockOrganizations.find((o) => o.id === orgId) || mockOrganizations[0];
  const [status, setStatus] = useState(org.status);

  // All org data (in real app, filtered by org.id)
  const batches = mockBatches.filter((b) => b.orgId === org.id);
  const students = mockStudents.filter((s) => s.orgId === org.id);
  const teachers = mockTeachers.filter((t) => t.orgId === org.id);
  const notes = mockNotes;
  const videos = mockVideos;
  const tests = mockTests;
  const attendance = mockAttendance;

  const handleApprove = () => {
    setStatus("active");
    toast.success(`${org.name} approved!`);
  };
  const handleReject = () => {
    setStatus("rejected");
    toast.error(`${org.name} rejected.`);
  };
  const handleSuspend = () => {
    setStatus("suspended");
    toast.warning(`${org.name} suspended.`);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/super-admin/organizations"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Organizations
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-medium text-slate-900">{org.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex flex-wrap items-center gap-2">
            {org.name}
            <Badge variant={statusVariant(status)} className="capitalize">
              {status}
            </Badge>
          </h2>
          <p className="text-sm text-slate-500 mt-0.5 break-all sm:break-normal">
            {org.slug}.tutorlms.com · {org.city} · {org.plan} plan
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {status === "pending" && (
            <>
              <Button variant="destructive" size="sm" onClick={handleReject}>
                <XCircle className="h-3.5 w-3.5" /> Reject
              </Button>
              <Button variant="success" size="sm" onClick={handleApprove}>
                <CheckCircle className="h-3.5 w-3.5" /> Approve
              </Button>
            </>
          )}
          {status === "active" && (
            <Button variant="warning" size="sm" onClick={handleSuspend}>
              <AlertTriangle className="h-3.5 w-3.5" /> Suspend
            </Button>
          )}
          {status === "suspended" && (
            <Button variant="success" size="sm" onClick={handleApprove}>
              <CheckCircle className="h-3.5 w-3.5" /> Reactivate
            </Button>
          )}
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Students"
          value={students.length}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Batches"
          value={batches.length}
          icon={BookOpen}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Teachers"
          value={teachers.length}
          icon={UserCheck}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Tests Created"
          value={tests.length}
          icon={ClipboardList}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Mobile tab bar — hidden on desktop (desktop uses sidebar) */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-1 mb-5 -mx-4 px-4 scrollbar-none">
        {[
          { label: "Overview", tab: "overview" },
          { label: "Batches", tab: "batches" },
          { label: "Students", tab: "students" },
          { label: "Teachers", tab: "teachers" },
          { label: "Content", tab: "content" },
          { label: "Tests", tab: "tests" },
          { label: "Attendance", tab: "attendance" },
        ].map((t) => (
          <Link
            key={t.tab}
            href={`/super-admin/organizations/${orgId}?tab=${t.tab}`}
            className={cn(
              "shrink-0 inline-flex items-center h-8 px-3.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border",
              activeTab === t.tab
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white border-slate-200 text-slate-500"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div>
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Center Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Building2, label: "Center Name", value: org.name },
                        { icon: MapPin, label: "City", value: org.city },
                        { icon: Mail, label: "Email", value: org.email },
                        { icon: Phone, label: "Phone", value: org.phone },
                        { icon: Users, label: "Total Students", value: org.totalStudents },
                        { icon: BookOpen, label: "Total Batches", value: org.totalBatches },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label}>
                          <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
                            <Icon className="h-3.5 w-3.5" /> {label}
                          </dt>
                          <dd className="text-sm font-semibold text-slate-800">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>

                {/* Recent batches */}
                <Card>
                  <CardHeader>
                    <CardTitle>Batches</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Mobile cards */}
                    <div className="sm:hidden divide-y divide-slate-50">
                      {batches.map((b) => (
                        <div
                          key={b.id}
                          className="px-4 py-3 flex items-start justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {b.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {b.subject} · {b.studentCount} students
                            </p>
                          </div>
                          <Badge
                            variant={b.status === "active" ? "success" : "secondary"}
                            className="capitalize shrink-0"
                          >
                            {b.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    {/* Desktop table */}
                    <table className="hidden sm:table w-full">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["Batch", "Subject", "Students", "Status"].map((h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {batches.map((b) => (
                          <tr key={b.id} className="border-b border-slate-50">
                            <td className="px-4 py-3 text-sm font-medium text-slate-800">
                              {b.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">{b.subject}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{b.studentCount}</td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={b.status === "active" ? "success" : "secondary"}
                                className="capitalize"
                              >
                                {b.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Plan</p>
                      <Badge variant="secondary" className="capitalize">
                        {org.plan}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Status</p>
                      <Badge variant={statusVariant(status)} className="capitalize">
                        {status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Joined</p>
                      <p className="text-sm font-medium text-slate-800">
                        {formatDate(org.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Subdomain</p>
                      <p className="text-sm font-mono text-slate-800">{org.slug}.tutorlms.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        icon: FileText,
                        label: "Notes",
                        value: notes.length,
                        color: "text-red-500",
                      },
                      {
                        icon: Video,
                        label: "Videos",
                        value: videos.length,
                        color: "text-purple-500",
                      },
                      {
                        icon: ClipboardList,
                        label: "Tests",
                        value: tests.length,
                        color: "text-amber-500",
                      },
                      {
                        icon: CalendarCheck,
                        label: "Attendance Records",
                        value: attendance.length,
                        color: "text-green-500",
                      },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Icon className={`h-4 w-4 ${color}`} /> {label}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* BATCHES */}
        {activeTab === "batches" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>All Batches ({batches.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-slate-50">
                  {batches.map((b) => (
                    <div key={b.id} className="px-4 py-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{b.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {b.subject} · {b.studentCount} students · {formatDate(b.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant={b.status === "active" ? "success" : "secondary"}
                        className="capitalize shrink-0"
                      >
                        {b.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                {/* Desktop table */}
                <table className="hidden sm:table w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Batch Name", "Subject", "Students", "Created", "Status"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((b) => (
                      <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-slate-900">{b.name}</p>
                          {b.description && (
                            <p className="text-xs text-slate-400">{b.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{b.subject}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{b.studentCount}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {formatDate(b.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={b.status === "active" ? "success" : "secondary"}
                            className="capitalize"
                          >
                            {b.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}

        {/* STUDENTS */}
        {activeTab === "students" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>All Students ({students.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-slate-50">
                  {students.map((s) => (
                    <div key={s.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-indigo-600">
                          {getInitials(s.name)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{s.name}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {s.email} · {s.phone}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {s.enrolledBatches.length}
                      </Badge>
                    </div>
                  ))}
                </div>
                {/* Desktop table */}
                <table className="hidden sm:table w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Student", "Email", "Phone", "Batches", "Joined"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-indigo-600">
                                {getInitials(s.name)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-slate-800">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{s.email}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{s.phone}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{s.enrolledBatches.length} batches</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {formatDate(s.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}

        {/* TEACHERS */}
        {activeTab === "teachers" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>All Teachers ({teachers.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-slate-50">
                  {teachers.map((t) => (
                    <div key={t.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-green-600">
                          {getInitials(t.name)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{t.name}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {t.email} · {t.phone}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {t.assignedBatches.length}
                      </Badge>
                    </div>
                  ))}
                </div>
                {/* Desktop table */}
                <table className="hidden sm:table w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Teacher", "Email", "Phone", "Assigned Batches", "Joined"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((t) => (
                      <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-green-600">
                                {getInitials(t.name)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-slate-800">{t.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{t.email}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{t.phone}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{t.assignedBatches.length} batches</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {formatDate(t.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}

        {/* CONTENT */}
        {activeTab === "content" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" /> Notes ({notes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notes.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{n.title}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {n.uploadedBy} · {n.fileSize} · {formatDate(n.createdAt)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0 whitespace-nowrap">
                        {n.fileSize}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-purple-500" /> Videos ({videos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {videos.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{v.title}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {v.uploadedBy} · {v.duration} · {formatDate(v.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="capitalize text-xs shrink-0 whitespace-nowrap"
                      >
                        {v.type}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* TESTS */}
        {activeTab === "tests" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>All Tests ({tests.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-slate-50">
                  {tests.map((t) => (
                    <div key={t.id} className="px-4 py-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{t.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {t.duration} min · {t.totalMarks} marks · {t.questions.length} questions
                        </p>
                      </div>
                      <Badge
                        variant={
                          t.status === "available"
                            ? "success"
                            : t.status === "scheduled"
                              ? "pending"
                              : "secondary"
                        }
                        className="capitalize shrink-0"
                      >
                        {t.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                {/* Desktop table */}
                <table className="hidden sm:table w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {[
                        "Test Name",
                        "Duration",
                        "Total Marks",
                        "Questions",
                        "Available From",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tests.map((t) => (
                      <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                          {t.instructions && (
                            <p className="text-xs text-slate-400 truncate max-w-xs">
                              {t.instructions}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{t.duration} min</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{t.totalMarks}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{t.questions.length}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {formatDateTime(t.availableFrom)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              t.status === "available"
                                ? "success"
                                : t.status === "scheduled"
                                  ? "pending"
                                  : "secondary"
                            }
                            className="capitalize"
                          >
                            {t.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}

        {/* ATTENDANCE */}
        {activeTab === "attendance" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records ({attendance.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-slate-50">
                  {attendance.map((a) => {
                    const present = a.records.filter((r) => r.present).length;
                    const total = a.records.length;
                    const pct = total ? Math.round((present / total) * 100) : 0;
                    const batch = mockBatches.find((b) => b.id === a.batchId);
                    return (
                      <div key={a.id} className="px-4 py-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {batch?.name || a.batchId}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatDate(a.date)} ·{" "}
                              <span className="text-green-600 font-medium">{present} present</span>{" "}
                              ·{" "}
                              <span className="text-red-500 font-medium">
                                {total - present} absent
                              </span>
                            </p>
                          </div>
                          <span
                            className={`text-sm font-bold ${pct >= 75 ? "text-green-600" : "text-red-500"}`}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full">
                          <div
                            className={`h-1.5 rounded-full ${pct >= 75 ? "bg-green-500" : "bg-red-400"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Desktop table */}
                <table className="hidden sm:table w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Date", "Batch", "Present", "Absent", "Attendance %"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a) => {
                      const present = a.records.filter((r) => r.present).length;
                      const total = a.records.length;
                      const pct = total ? Math.round((present / total) * 100) : 0;
                      const batch = mockBatches.find((b) => b.id === a.batchId);
                      return (
                        <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-800">{formatDate(a.date)}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {batch?.name || a.batchId}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-green-600">{present}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-red-500">
                              {total - present}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-20">
                                <div
                                  className={`h-1.5 rounded-full ${pct >= 75 ? "bg-green-500" : "bg-red-400"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span
                                className={`text-xs font-semibold ${pct >= 75 ? "text-green-600" : "text-red-500"}`}
                              >
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default function OrgDetailPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = use(params);
  return (
    <Suspense fallback={null}>
      <OrgDetailContent orgId={orgId} />
    </Suspense>
  );
}
