"use client";

import { useState, use } from "react";
import {
  Search,
  Mail,
  Phone,
  BookOpen,
  Link2,
  Copy,
  X,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  ChevronRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { mockStudents, mockBatches } from "@/lib/mock-data";
import { getInitials, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Student } from "@/types";
import { cn } from "@/lib/utils";

const COLORS = [
  { bg: "bg-slate-200", light: "bg-indigo-50", text: "text-indigo-600" },
  { bg: "bg-slate-200", light: "bg-slate-50", text: "text-slate-600" },
  { bg: "bg-slate-200", light: "bg-violet-50", text: "text-violet-600" },
  { bg: "bg-slate-200", light: "bg-slate-50", text: "text-slate-600" },
  { bg: "bg-slate-200", light: "bg-amber-50", text: "text-amber-600" },
  { bg: "bg-slate-200", light: "bg-sky-50", text: "text-sky-600" },
];

function getStudentColor(id: string) {
  return COLORS[parseInt(id.replace(/\D/g, "")) % COLORS.length] ?? COLORS[0];
}

/* ─── Student Detail Panel ─── */
function StudentPanel({ student, onClose }: { student: Student; onClose: () => void }) {
  const batches = mockBatches.filter((b) => student.enrolledBatches.includes(b.id));
  const color = getStudentColor(student.id);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Student Profile
          </p>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile hero */}
          <div className="px-6 pt-6 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-slate-600">
                  {getInitials(student.name)}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
                <p className="text-sm text-slate-400">{student.email}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 border-b border-slate-100">
            {[
              { icon: BookOpen, label: "Batches", value: batches.length },
              { icon: ClipboardList, label: "Tests", value: 12 },
              { icon: CheckCircle2, label: "Attendance", value: "87%" },
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
                  { icon: Mail, value: student.email },
                  { icon: Phone, value: student.phone },
                  { icon: CalendarDays, value: `Joined ${formatDate(student.createdAt)}` },
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
                Enrolled Batches
              </p>
              {batches.length === 0 ? (
                <p className="text-sm text-slate-400">Not enrolled in any batch</p>
              ) : (
                <div className="space-y-2">
                  {batches.map((b) => (
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

            {/* Recent tests */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Recent Test Scores
              </p>
              <div className="space-y-2">
                {[
                  { name: "Physics Mock Test 3", score: 88, date: "5 Mar 2026" },
                  { name: "Chemistry Unit Test", score: 74, date: "28 Feb 2026" },
                  { name: "Maths Practice Test", score: 92, date: "20 Feb 2026" },
                ].map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.date}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span
                        className={cn(
                          "text-sm font-bold",
                          t.score >= 85
                            ? "text-emerald-600"
                            : t.score >= 70
                              ? "text-amber-500"
                              : "text-red-500"
                        )}
                      >
                        {t.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ─── */
export default function StudentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  void slug;
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);
  const [batchFilter, setBatchFilter] = useState("all");
  const inviteLink = `https://${slug}.tutorlms.com/join/abc123xyz`;

  const filtered = mockStudents.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchBatch = batchFilter === "all" || s.enrolledBatches.includes(batchFilter);
    return matchSearch && matchBatch;
  });

  const activeBatches = mockBatches.filter((b) => b.status === "active");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`${mockStudents.length} students enrolled`}
        action={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Link2 className="h-3.5 w-3.5" /> Invite Students
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Students</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Share this link with students to join your coaching center.
                </p>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="text-xs font-mono text-slate-700 flex-1 truncate">{inviteLink}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLink);
                      toast.success("Copied!");
                    }}
                    className="shrink-0 text-indigo-600 hover:text-indigo-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {activeBatches.map((batch) => (
                    <button
                      key={batch.id}
                      onClick={() => toast.success("Batch link copied!")}
                      className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
                    >
                      <BookOpen className="h-4 w-4 text-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {batch.name}
                        </p>
                        <p className="text-xs text-slate-400">Copy link</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="h-9 w-56 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "All", count: mockStudents.length },
            ...activeBatches.map((b) => ({
              id: b.id,
              label: b.subject,
              count: mockStudents.filter((s) => s.enrolledBatches.includes(b.id)).length,
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

      {/* Student list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="Try adjusting your search or filter."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Column headers — must match row layout exactly */}
          <div className="flex items-center px-5 py-2.5 bg-slate-50 border-b border-slate-100">
            <div className="w-56 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Student
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Contact
              </p>
            </div>
            <div className="w-48 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Batches
              </p>
            </div>
            <div className="w-28 shrink-0 text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Joined
              </p>
            </div>
            <div className="w-5 shrink-0" />
          </div>

          {filtered.map((student, i) => {
            const color = getStudentColor(student.id);
            const batches = mockBatches.filter((b) => student.enrolledBatches.includes(b.id));
            return (
              <div
                key={student.id}
                onClick={() => setSelected(student)}
                className={cn(
                  "flex items-center px-5 py-3 cursor-pointer group transition-colors hover:bg-slate-50",
                  i !== 0 && "border-t border-slate-100"
                )}
              >
                {/* Student — w-56 */}
                <div className="w-56 shrink-0 flex items-center gap-3 min-w-0">
                  <div
                    className={`h-8 w-8 rounded-full ${color.bg} flex items-center justify-center shrink-0`}
                  >
                    <span className="text-[11px] font-bold text-slate-600">
                      {getInitials(student.name)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {student.name}
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
                    <Mail className="h-3 w-3 text-slate-300 shrink-0" /> {student.email}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-slate-300 shrink-0" /> {student.phone}
                  </p>
                </div>

                {/* Batches — w-48 */}
                <div className="w-48 shrink-0 flex items-center gap-1.5">
                  {batches.slice(0, 2).map((b) => (
                    <span
                      key={b.id}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${color.light} ${color.text} whitespace-nowrap`}
                    >
                      {b.subject}
                    </span>
                  ))}
                  {batches.length > 2 && (
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-100 text-slate-500">
                      +{batches.length - 2}
                    </span>
                  )}
                </div>

                {/* Joined — w-28 */}
                <p className="w-28 shrink-0 text-right text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(student.createdAt)}
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

      {selected && <StudentPanel student={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
