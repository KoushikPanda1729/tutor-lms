"use client";

import { useState } from "react";
import { Search, Building2, Users, BookOpen, MapPin, ChevronRight, Globe } from "lucide-react";
import { mockOrganizations } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

const tabs = ["all", "pending", "active", "suspended"] as const;
type Tab = (typeof tabs)[number];

const PLAN_STYLES: Record<string, { bg: string; text: string }> = {
  enterprise: { bg: "bg-indigo-50", text: "text-indigo-700" },
  pro: { bg: "bg-violet-50", text: "text-violet-700" },
  free: { bg: "bg-slate-100", text: "text-slate-500" },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  suspended: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  rejected: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function OrganizationsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");

  const filtered = mockOrganizations.filter((o) => {
    const matchTab = tab === "all" || o.status === tab;
    const matchSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    all: mockOrganizations.length,
    pending: mockOrganizations.filter((o) => o.status === "pending").length,
    active: mockOrganizations.filter((o) => o.status === "active").length,
    suspended: mockOrganizations.filter((o) => o.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizations"
        description={`${mockOrganizations.length} total coaching centers`}
      />

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or city..."
            className="h-9 w-64 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "h-8 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 capitalize whitespace-nowrap",
                tab === t
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              {t}
              <span
                className={cn(
                  "text-[10px] font-bold rounded-full px-1.5 py-px",
                  tab === t ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                )}
              >
                {counts[t]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations found"
          description="Try adjusting your search or filter."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Column headers */}
          <div className="flex items-center px-5 py-2.5 bg-slate-50 border-b border-slate-100">
            <div className="w-64 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Organization
              </p>
            </div>
            <div className="w-32 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Location
              </p>
            </div>
            <div className="w-28 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Plan</p>
            </div>
            <div className="w-24 shrink-0 text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Students
              </p>
            </div>
            <div className="w-24 shrink-0 text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Batches
              </p>
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Joined
              </p>
            </div>
            <div className="w-28 shrink-0 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Status
              </p>
            </div>
            <div className="w-5 shrink-0" />
          </div>

          {filtered.map((org, i) => {
            const plan = PLAN_STYLES[org.plan?.toLowerCase()] ?? PLAN_STYLES.free;
            const status = STATUS_STYLES[org.status] ?? STATUS_STYLES.rejected;
            return (
              <Link
                key={org.id}
                href={`/super-admin/organizations/${org.id}`}
                className={cn(
                  "flex items-center px-5 py-3 cursor-pointer group transition-colors hover:bg-slate-50",
                  i !== 0 && "border-t border-slate-100"
                )}
              >
                {/* Organization — w-64 */}
                <div className="w-64 shrink-0 flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-indigo-600">
                      {getInitials(org.name)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {org.name}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                      <Globe className="h-2.5 w-2.5 shrink-0" />
                      {org.slug}.tutorlms.com
                    </p>
                  </div>
                </div>

                {/* Location — w-32 */}
                <div className="w-32 shrink-0 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-slate-300 shrink-0" />
                  <span className="text-sm text-slate-600 truncate">{org.city}</span>
                </div>

                {/* Plan — w-28 */}
                <div className="w-28 shrink-0">
                  <span
                    className={cn(
                      "text-[11px] font-bold px-2.5 py-1 rounded-lg capitalize",
                      plan.bg,
                      plan.text
                    )}
                  >
                    {org.plan}
                  </span>
                </div>

                {/* Students — w-24 */}
                <div className="w-24 shrink-0 flex items-center justify-end gap-1.5">
                  <Users className="h-3 w-3 text-slate-300 shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">{org.totalStudents}</span>
                </div>

                {/* Batches — w-24 */}
                <div className="w-24 shrink-0 flex items-center justify-end gap-1.5">
                  <BookOpen className="h-3 w-3 text-slate-300 shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">{org.totalBatches}</span>
                </div>

                {/* Joined — flex-1 */}
                <p className="flex-1 min-w-0 text-right text-xs text-slate-400 whitespace-nowrap">
                  {formatDate(org.createdAt)}
                </p>

                {/* Status — w-28 */}
                <div className="w-28 shrink-0 flex justify-center">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize",
                      status.bg,
                      status.text
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", status.dot)} />
                    {org.status}
                  </span>
                </div>

                {/* Arrow — w-5 */}
                <div className="w-5 shrink-0 flex justify-end">
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
