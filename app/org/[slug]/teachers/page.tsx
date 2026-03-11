"use client";

import { useState } from "react";
import {
  Plus,
  Mail,
  Phone,
  UserCheck,
  Trash2,
  X,
  BookOpen,
  CalendarDays,
  Users,
  ChevronRight,
  Search,
  ClipboardList,
  CheckCircle2,
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

// ── Teacher Detail Panel ──────────────────────────────────────────────
function TeacherDetailPanel({ teacher, onClose }: { teacher: Teacher; onClose: () => void }) {
  const assignedBatches = mockBatches.filter((b) => teacher.assignedBatches.includes(b.id));
  const totalStudents = assignedBatches.reduce((s, b) => s + b.studentCount, 0);
  const totalClasses = mockAttendance.filter((a) =>
    teacher.assignedBatches.includes(a.batchId)
  ).length;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Teacher Profile
          </p>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile */}
          <div className="px-6 pt-6 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-slate-600">
                  {getInitials(teacher.name)}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{teacher.name}</h2>
                <p className="text-sm text-slate-400">{teacher.email}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
            {[
              { icon: BookOpen, label: "Batches", value: assignedBatches.length },
              { icon: Users, label: "Students", value: totalStudents },
              { icon: ClipboardList, label: "Classes", value: totalClasses },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center py-4 gap-1">
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <s.icon className="h-3 w-3" /> {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Contact */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Contact
              </p>
              <div className="space-y-2">
                {[
                  { icon: Mail, value: teacher.email },
                  { icon: Phone, value: teacher.phone },
                  { icon: CalendarDays, value: `Joined ${formatDate(teacher.createdAt)}` },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-2.5"
                  >
                    <item.icon className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Batches */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Assigned Batches
              </p>
              {assignedBatches.length === 0 ? (
                <p className="text-sm text-slate-400">No batches assigned</p>
              ) : (
                <div className="space-y-2">
                  {assignedBatches.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3"
                    >
                      <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{b.name}</p>
                        <p className="text-xs text-slate-400">{b.subject}</p>
                      </div>
                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0",
                          b.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        )}
                      >
                        {b.status === "active" ? "Active" : "Archived"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent classes */}
            {totalClasses > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Recent Classes
                </p>
                <div className="space-y-2">
                  {mockAttendance
                    .filter((a) => teacher.assignedBatches.includes(a.batchId))
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .slice(0, 4)
                    .map((att) => {
                      const batch = mockBatches.find((b) => b.id === att.batchId);
                      const present = att.records.filter((r) => r.present).length;
                      const total = att.records.length;
                      return (
                        <div
                          key={att.id}
                          className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {batch?.name}
                            </p>
                            <p className="text-xs text-slate-400">{formatDate(att.date)}</p>
                          </div>
                          <span className="text-sm font-bold text-emerald-600 shrink-0">
                            {present}/{total}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function TeachersPage() {
  const [teachers] = useState<Teacher[]>(mockTeachers);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const activeBatches = mockBatches.filter((b) => b.status === "active");

  const filtered = teachers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchBatch = batchFilter === "all" || t.assignedBatches.includes(batchFilter);
    return matchSearch && matchBatch;
  });

  const invite = async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`Invitation sent to ${email}`);
    setOpen(false);
    setEmail("");
  };

  return (
    <div className="space-y-6">
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

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teachers..."
            className="h-9 w-56 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "All", count: teachers.length },
            ...activeBatches.map((b) => ({
              id: b.id,
              label: b.subject,
              count: teachers.filter((t) => t.assignedBatches.includes(b.id)).length,
            })),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setBatchFilter(tab.id)}
              className={cn(
                "h-8 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap",
                batchFilter === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-[10px] font-bold rounded-full px-1.5 py-px",
                  batchFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No teachers found"
          description="Try adjusting your search."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Column headers */}
          <div className="flex items-center px-5 py-2.5 bg-slate-50 border-b border-slate-100">
            <div className="w-52 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Teacher
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Contact
              </p>
            </div>
            <div className="w-64 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Batches
              </p>
            </div>
            <div className="w-24 shrink-0 text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Joined
              </p>
            </div>
            <div className="w-5 shrink-0" />
          </div>

          {filtered.map((teacher, i) => {
            const assignedBatches = mockBatches.filter((b) =>
              teacher.assignedBatches.includes(b.id)
            );
            return (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className={cn(
                  "flex items-center px-5 py-3 cursor-pointer group transition-colors hover:bg-slate-50",
                  i !== 0 && "border-t border-slate-100"
                )}
              >
                {/* Teacher — w-52 */}
                <div className="w-52 shrink-0 flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-slate-600">
                      {getInitials(teacher.name)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {teacher.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs text-slate-400">Active</span>
                    </div>
                  </div>
                </div>

                {/* Contact — flex-1 */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 truncate">
                    <Mail className="h-3 w-3 text-slate-300 shrink-0" /> {teacher.email}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-slate-300 shrink-0" /> {teacher.phone}
                  </p>
                </div>

                {/* Batches — w-64 */}
                <div className="w-64 shrink-0 flex items-center gap-1.5 flex-wrap">
                  {assignedBatches.slice(0, 2).map((b) => (
                    <span
                      key={b.id}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 whitespace-nowrap"
                    >
                      {b.subject}
                    </span>
                  ))}
                  {assignedBatches.length > 2 && (
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-100 text-slate-500">
                      +{assignedBatches.length - 2}
                    </span>
                  )}
                </div>

                {/* Joined — w-24 */}
                <p className="w-24 shrink-0 text-right text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(teacher.createdAt)}
                </p>

                {/* Arrow — w-5 */}
                <div className="w-5 shrink-0 flex justify-end">
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
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
