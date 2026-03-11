"use client";

import { useState, use } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { formatDate, formatDateTime, getInitials } from "@/lib/utils";
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

export default function OrgDetailPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = use(params);
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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {org.name}
            <Badge variant={statusVariant(status)} className="capitalize">
              {status}
            </Badge>
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {org.slug}.tutorlms.com · {org.city} · {org.plan} plan
          </p>
        </div>
        <div className="flex gap-2">
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

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
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
                  <table className="w-full">
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
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{b.name}</td>
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
                    { icon: FileText, label: "Notes", value: notes.length, color: "text-red-500" },
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
        </TabsContent>

        {/* BATCHES */}
        <TabsContent value="batches">
          <Card>
            <CardHeader>
              <CardTitle>All Batches ({batches.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
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
                        {b.description && <p className="text-xs text-slate-400">{b.description}</p>}
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
        </TabsContent>

        {/* STUDENTS */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>All Students ({students.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
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
        </TabsContent>

        {/* TEACHERS */}
        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>All Teachers ({teachers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
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
        </TabsContent>

        {/* CONTENT */}
        <TabsContent value="content">
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
                    className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-400">
                        {n.uploadedBy} · {n.fileSize} · {formatDate(n.createdAt)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
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
                    className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{v.title}</p>
                      <p className="text-xs text-slate-400">
                        {v.uploadedBy} · {v.duration} · {formatDate(v.createdAt)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {v.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TESTS */}
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>All Tests ({tests.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
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
        </TabsContent>

        {/* ATTENDANCE */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records ({attendance.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
