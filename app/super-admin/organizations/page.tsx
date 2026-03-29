"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Building2, MapPin, ChevronRight, Globe, Layers, ChevronLeft } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

// ─── API types ────────────────────────────────────────────────────────────────
type Organisation = {
  id: string;
  requester_id: string;
  status: "pending" | "approved" | "suspended" | "rejected";
  name: string;
  type: string;
  description: string;
  logo_url: string;
  cover_image_url: string;
  location_text: string;
  latitude: number;
  longitude: number;
  attendance_radius_meters: number;
  attendance_radius_enabled: boolean;
  is_profile_public: boolean;
  is_active: boolean;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
};

type OrganisationsResponse = {
  items: Organisation[];
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

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "active",
  },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", label: "pending" },
  suspended: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "suspended" },
  rejected: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400", label: "rejected" },
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
const PAGE_SIZE = 10;

export default function OrganizationsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever tab or search changes
  function handleTabChange(t: Tab) {
    setTab(t);
    setPage(1);
  }
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["organisations", page, PAGE_SIZE],
    queryFn: () =>
      api.get<OrganisationsResponse>(`/organisations?page=${page}&page_size=${PAGE_SIZE}`),
  });

  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta?.total_pages ?? 1;
  const totalItems = meta?.total_items ?? 0;

  const filtered = items.filter((o) => {
    const apiStatus = tab === "active" ? "approved" : tab;
    const matchTab = tab === "all" || o.status === apiStatus;
    const matchSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.location_text.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    all: items.length,
    pending: items.filter((o) => o.status === "pending").length,
    active: items.filter((o) => o.status === "approved").length,
    suspended: items.filter((o) => o.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizations"
        description={
          isLoading
            ? "Loading..."
            : `${totalItems} total coaching center${totalItems !== 1 ? "s" : ""}`
        }
      />

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name or city..."
            className="h-9 w-full sm:w-64 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
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
            <div className="w-10 shrink-0" />
          </div>

          {filtered.map((org, i) => {
            const typeKey = org.type?.toLowerCase();
            const typeStyle = TYPE_STYLES[typeKey] ?? TYPE_STYLES.other;
            const statusStyle = STATUS_STYLES[org.status] ?? STATUS_STYLES.rejected;
            const city = extractCity(org.location_text);

            return (
              <Link
                key={org.id}
                href={`/super-admin/organizations/${org.id}`}
                className={cn(
                  "group flex items-center px-5 py-3 transition-colors hover:bg-slate-50",
                  i !== 0 && "border-t border-slate-100"
                )}
              >
                <div className="flex-1 min-w-0 flex items-center gap-3">
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
                      {org.description.slice(0, 48)}
                      {org.description.length > 48 ? "…" : ""}
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
                    {org.type}
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
                    {statusStyle.label}
                  </span>
                </div>
                <div className="w-10 shrink-0 flex justify-end">
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-all" />
                </div>
              </Link>
            );
          })}
          {/* Pagination footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-400">
                Page <span className="font-semibold text-slate-600">{page}</span> of{" "}
                <span className="font-semibold text-slate-600">{totalPages}</span>
                <span className="ml-2 text-slate-300">·</span>
                <span className="ml-2">{totalItems} total</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-7 w-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "…" ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-xs text-slate-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={cn(
                          "h-7 min-w-[28px] px-2 rounded-lg text-xs font-semibold transition-all",
                          page === p
                            ? "bg-slate-900 text-white"
                            : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                        )}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-7 w-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
