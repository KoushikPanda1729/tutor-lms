"use client";

import { useState } from "react";
import {
  Plus,
  Mail,
  Phone,
  UserCheck,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  BookOpen,
  CalendarDays,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { mockTeachers, mockBatches, mockAttendance } from "@/lib/mock-data";
import { getInitials, formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Teacher } from "@/types";

// ── Teacher Detail Panel ─────────────────────────────────────────────
function TeacherDetailPanel({ teacher, onClose }: { teacher: Teacher; onClose: () => void }) {
  const assignedBatches = mockBatches.filter((b) => teacher.assignedBatches.includes(b.id));

  const totalStudents = assignedBatches.reduce((s, b) => s + b.studentCount, 0);
  const totalClasses = mockAttendance.filter((a) =>
    teacher.assignedBatches.includes(a.batchId)
  ).length;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-screen w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-indigo-600">
                  {getInitials(teacher.name)}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{teacher.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Joined {formatDate(teacher.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {teacher.email}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              {teacher.phone}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-center">
              <p className="text-xl font-black text-indigo-700">{assignedBatches.length}</p>
              <p className="text-[10px] text-indigo-500 mt-0.5">Batches</p>
            </div>
            <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-center">
              <p className="text-xl font-black text-green-700">{totalStudents}</p>
              <p className="text-[10px] text-green-500 mt-0.5">Students</p>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-center">
              <p className="text-xl font-black text-amber-700">{totalClasses}</p>
              <p className="text-[10px] text-amber-500 mt-0.5">Classes</p>
            </div>
          </div>

          {/* Assigned Batches */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Assigned Batches
            </p>
            {assignedBatches.length === 0 ? (
              <p className="text-xs text-slate-400">No batches assigned</p>
            ) : (
              <div className="space-y-2">
                {assignedBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{batch.name}</p>
                        <p className="text-xs text-slate-400">{batch.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Users className="h-3 w-3" /> {batch.studentCount}
                      </span>
                      <Badge
                        variant={batch.status === "active" ? "success" : "secondary"}
                        className="capitalize text-[10px]"
                      >
                        {batch.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Classes */}
          {totalClasses > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Recent Classes
              </p>
              <div className="space-y-1.5">
                {mockAttendance
                  .filter((a) => teacher.assignedBatches.includes(a.batchId))
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 5)
                  .map((att) => {
                    const batch = mockBatches.find((b) => b.id === att.batchId);
                    const present = att.records.filter((r) => r.present).length;
                    const total = att.records.length;
                    return (
                      <div
                        key={att.id}
                        className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5"
                      >
                        <div>
                          <p className="text-xs font-medium text-slate-700">{batch?.name}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <CalendarDays className="h-3 w-3" /> {formatDate(att.date)}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {present}/{total} present
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function TeachersPage() {
  const [teachers] = useState<Teacher[]>(mockTeachers);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>(
    Object.fromEntries(mockTeachers.map((t) => [t.id, true]))
  );
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const toggleActive = (id: string) => {
    setActiveMap((prev) => {
      const next = !prev[id];
      const t = teachers.find((t) => t.id === id);
      toast.success(`"${t?.name}" marked as ${next ? "active" : "inactive"}`);
      return { ...prev, [id]: next };
    });
  };

  const invite = async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`Invitation sent to ${email}`);
    setOpen(false);
    setEmail("");
  };

  return (
    <div>
      <PageHeader
        title="Teachers"
        description={`${teachers.length} teacher${teachers.length !== 1 ? "s" : ""}`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> Invite Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Teacher</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Send an invitation email to add a teacher to your institute.
                </p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Teacher Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="teacher@example.com"
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={invite} disabled={!email.trim()}>
                    Send Invite
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {teachers.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No teachers yet"
          description="Invite teachers to your institute."
        />
      ) : (
        <div className="space-y-3">
          {teachers.map((teacher) => {
            const assignedBatches = mockBatches.filter((b) =>
              teacher.assignedBatches.includes(b.id)
            );
            const isActive = activeMap[teacher.id];
            return (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm px-5 py-4 hover:border-indigo-200 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-indigo-600">
                      {getInitials(teacher.name)}
                    </span>
                  </div>

                  {/* Info + batches */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {teacher.name}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Mail className="h-3 w-3" /> {teacher.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Phone className="h-3 w-3" /> {teacher.phone}
                      </span>
                    </div>
                    {/* Batch tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {assignedBatches.map((b) => (
                        <span
                          key={b.id}
                          className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100"
                        >
                          <BookOpen className="h-3 w-3" />
                          {b.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActive(teacher.id);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors",
                        isActive
                          ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {isActive ? (
                        <>
                          <ToggleRight className="h-3.5 w-3.5" /> Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-3.5 w-3.5" /> Inactive
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`"${teacher.name}" removed`);
                      }}
                      className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Remove teacher"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTeacher && (
        <TeacherDetailPanel teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />
      )}
    </div>
  );
}
