"use client";

import { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Link2, Copy, X, CalendarDays, ChevronRight, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { api } from "@/lib/api";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Student = {
  id: string;
  user_id: string;
  organisation_id: string;
  is_active: boolean;
  joined_at: string;
  user_name: string;
};

type StudentsResponse = {
  items: Student[];
  meta: { page: number; page_size: number; total_items: number; total_pages: number };
};

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-600",
  "bg-violet-100 text-violet-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-sky-100 text-sky-600",
  "bg-rose-100 text-rose-600",
];

function getAvatarColor(id: string) {
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length] ?? AVATAR_COLORS[0];
}

function formatJoined(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ─── Student Detail Panel ─── */
function StudentPanel({ student, onClose }: { student: Student; onClose: () => void }) {
  const avatarColor = getAvatarColor(student.id);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
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
          <div className="px-5 pt-6 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div
                className={`h-14 w-14 rounded-full flex items-center justify-center shrink-0 ring-4 ring-slate-50 text-base font-bold ${avatarColor}`}
              >
                {getInitials(student.user_name)}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 truncate">{student.user_name}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                  {student.user_id}
                </p>
                <div
                  className={`inline-flex items-center gap-1.5 mt-2 rounded-full px-2.5 py-0.5 ${
                    student.is_active
                      ? "bg-emerald-50 border border-emerald-100"
                      : "bg-slate-100 border border-slate-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${student.is_active ? "bg-emerald-500" : "bg-slate-400"}`}
                  />
                  <span
                    className={`text-[11px] font-semibold ${student.is_active ? "text-emerald-600" : "text-slate-500"}`}
                  >
                    {student.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-5 space-y-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                Details
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400">Joined</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {formatJoined(student.joined_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400">Member ID</p>
                    <p className="text-xs font-mono text-slate-700 break-all">{student.id}</p>
                  </div>
                </div>
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
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["students", slug],
    queryFn: () => api.get<StudentsResponse>(`/organisations/${slug}/students`),
  });

  const students = data?.data?.items ?? [];
  const totalItems = data?.data?.meta?.total_items ?? 0;

  const filtered = students.filter((s) => {
    const matchSearch = s.user_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "active" && s.is_active) ||
      (filter === "inactive" && !s.is_active);
    return matchSearch && matchFilter;
  });

  const activeCnt = students.filter((s) => s.is_active).length;
  const inactiveCnt = students.filter((s) => !s.is_active).length;

  const orgLink = `${slug}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`${totalItems} student${totalItems !== 1 ? "s" : ""} enrolled`}
        action={
          <>
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <Link2 className="h-3.5 w-3.5" /> Invite Students
            </Button>

            {/* Invite modal */}
            {inviteOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setInviteOpen(false)}
                />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-slate-900">Invite Students</p>
                    <button
                      onClick={() => setInviteOpen(false)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">
                    Share your Organization ID with students so they can join your institute.
                  </p>
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-3 border border-slate-200">
                    <p className="text-xs font-mono text-slate-700 flex-1 min-w-0 truncate">
                      {orgLink}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(slug);
                        toast.success("Organization ID copied!");
                      }}
                      className="shrink-0 h-7 w-7 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Students can use this ID on the onboarding screen to send a join request.
                  </p>
                </div>
              </div>
            )}
          </>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="h-9 w-full sm:w-56 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: "all" as const, label: "All", count: students.length },
            { id: "active" as const, label: "Active", count: activeCnt },
            { id: "inactive" as const, label: "Inactive", count: inactiveCnt },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "h-8 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0",
                filter === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-[10px] font-bold rounded-full px-1.5 py-px",
                  filter === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Student list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="No students have joined this organization yet."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Column headers */}
          <div className="flex items-center px-4 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-100">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Student
              </p>
            </div>
            <div className="hidden sm:block w-28 shrink-0 text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Joined
              </p>
            </div>
            <div className="w-24 shrink-0 text-center hidden sm:block">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Status
              </p>
            </div>
            <div className="w-5 shrink-0" />
          </div>

          {filtered.map((student, i) => {
            const avatarColor = getAvatarColor(student.id);
            return (
              <div
                key={student.id}
                onClick={() => setSelected(student)}
                className={cn(
                  "flex items-center px-4 sm:px-5 py-3 cursor-pointer group transition-colors hover:bg-slate-50",
                  i !== 0 && "border-t border-slate-100"
                )}
              >
                {/* Student */}
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${avatarColor}`}
                  >
                    {getInitials(student.user_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {student.user_name}
                    </p>
                    {/* Status visible on mobile inline */}
                    <div className="sm:hidden flex items-center gap-1 mt-0.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${student.is_active ? "bg-emerald-500" : "bg-slate-300"}`}
                      />
                      <span className="text-xs text-slate-400">
                        {student.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Joined */}
                <p className="hidden sm:block w-28 shrink-0 text-right text-xs text-slate-400 whitespace-nowrap">
                  {formatJoined(student.joined_at)}
                </p>

                {/* Status badge */}
                <div className="hidden sm:flex w-24 shrink-0 justify-center">
                  <span
                    className={cn(
                      "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
                      student.is_active
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    )}
                  >
                    {student.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Arrow */}
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
