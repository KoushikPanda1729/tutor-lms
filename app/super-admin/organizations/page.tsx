"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Building2, MapPin, ChevronRight, Globe, Layers, Loader2 } from "lucide-react";
import { api, ApiResponse } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

// ─── API types ────────────────────────────────────────────────────────────────
type OrgRequest = {
  id: string;
  requester_id: string;
  status: "pending" | "active" | "suspended" | "rejected";
  org_name: string;
  org_type: string;
  org_description: string;
  org_logo_url: string;
  org_cover_image_url: string;
  org_location_text: string;
  org_latitude: number;
  org_longitude: number;
  org_attendance_radius_meters: number;
  org_attendance_radius_enabled: boolean;
  created_at: string;
  updated_at: string;
};

type OrgRequestsResponse = {
  items: OrgRequest[];
  meta: { page: number; page_size: number; total_items: number; total_pages: number };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function extractCity(locationText: string) {
  return locationText.split(",")[0]?.trim() ?? locationText;
}

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  institute: { bg: "bg-indigo-50", text: "text-indigo-700" },
  tutoring: { bg: "bg-violet-50", text: "text-violet-700" },
  school: { bg: "bg-sky-50", text: "text-sky-700" },
  university: { bg: "bg-purple-50", text: "text-purple-700" },
  other: { bg: "bg-slate-100", text: "text-slate-500" },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  suspended: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  rejected: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
};

const tabs = ["all", "pending", "active", "suspended"] as const;
type Tab = (typeof tabs)[number];

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center px-5 py-3 gap-3 border-t border-slate-100 first:border-0 animate-pulse">
      <div className="h-8 w-8 rounded-lg bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-40 bg-slate-100 rounded" />
        <div className="h-2.5 w-28 bg-slate-100 rounded" />
      </div>
      <div className="h-3 w-20 bg-slate-100 rounded hidden lg:block" />
      <div className="h-5 w-16 bg-slate-100 rounded-lg hidden lg:block" />
      <div className="h-5 w-16 bg-slate-100 rounded-full" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrganizationsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["organisation-requests"],
    queryFn: () => api.get<OrgRequestsResponse>("/organisation-requests"),
  });

  const items = data?.data?.items ?? [];

  const filtered = items.filter((o) => {
    const matchTab = tab === "all" || o.status === tab;
    const matchSearch =
      o.org_name.toLowerCase().includes(search.toLowerCase()) ||
      o.org_location_text.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    all: items.length,
    pending: items.filter((o) => o.status === "pending").length,
    active: items.filter((o) => o.status === "active").length,
    suspended: items.filter((o) => o.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizations"
        description={
          isLoading
            ? "Loading..."
            : `${items.length} total coaching center${items.length !== 1 ? "s" : ""}`
        }
      />

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or city..."
            className="h-9 w-full sm:w-64 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
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
                {isLoading ? "—" : counts[t]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ── */}
      {isError && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-sm text-red-600 font-medium">
          Failed to load organizations. Please try again.
        </div>
      )}

      {/* ── Table ── */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : !isError && filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations found"
          description="Try adjusting your search or filter."
        />
      ) : !isError ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Column headers */}
          <div className="hidden md:flex items-center px-5 py-2.5 bg-slate-50 border-b border-slate-100">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Organization
              </p>
            </div>
            <div className="w-36 shrink-0 hidden lg:block">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Location
              </p>
            </div>
            <div className="w-28 shrink-0 hidden lg:block">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Type</p>
            </div>
            <div className="w-32 shrink-0 text-right hidden lg:block">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Requested
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
            const typeKey = org.org_type?.toLowerCase();
            const typeStyle = TYPE_STYLES[typeKey] ?? TYPE_STYLES.other;
            const statusStyle = STATUS_STYLES[org.status] ?? STATUS_STYLES.rejected;
            const city = extractCity(org.org_location_text);

            return (
              <Link
                key={org.id}
                href={`/super-admin/organizations/${org.id}`}
                className={cn(
                  "group transition-colors hover:bg-slate-50 block",
                  i !== 0 && "border-t border-slate-100"
                )}
              >
                {/* Mobile */}
                <div className="flex items-center gap-3 px-4 py-3 md:hidden">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-indigo-600">
                      {getInitials(org.org_name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {org.org_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400 truncate">{city}</span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded capitalize",
                          typeStyle.bg,
                          typeStyle.text
                        )}
                      >
                        {org.org_type}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full capitalize shrink-0",
                      statusStyle.bg,
                      statusStyle.text
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusStyle.dot)} />
                    {org.status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                </div>

                {/* Desktop */}
                <div className="hidden md:flex items-center px-5 py-3">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-indigo-600">
                        {getInitials(org.org_name)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {org.org_name}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                        <Globe className="h-2.5 w-2.5 shrink-0" />
                        {org.org_description.slice(0, 48)}
                        {org.org_description.length > 48 ? "…" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="w-36 shrink-0 hidden lg:flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-slate-300 shrink-0" />
                    <span className="text-sm text-slate-600 truncate">{city}</span>
                  </div>
                  <div className="w-28 shrink-0 hidden lg:block">
                    <span
                      className={cn(
                        "text-[11px] font-bold px-2.5 py-1 rounded-lg capitalize inline-flex items-center gap-1",
                        typeStyle.bg,
                        typeStyle.text
                      )}
                    >
                      <Layers className="h-2.5 w-2.5" />
                      {org.org_type}
                    </span>
                  </div>
                  <p className="w-32 shrink-0 text-right text-xs text-slate-400 hidden lg:block whitespace-nowrap">
                    {formatDate(org.created_at)}
                  </p>
                  <div className="w-28 shrink-0 flex justify-center">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize",
                        statusStyle.bg,
                        statusStyle.text
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusStyle.dot)} />
                      {org.status}
                    </span>
                  </div>
                  <div className="w-5 shrink-0 flex justify-end">
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
