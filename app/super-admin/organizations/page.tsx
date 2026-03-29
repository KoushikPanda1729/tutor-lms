"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Building2,
  MapPin,
  ChevronRight,
  Globe,
  Layers,
  Loader2,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
type ActionType = "approve" | "deny";

// ─── Review Note Dialog ───────────────────────────────────────────────────────
function ReviewNoteDialog({
  action,
  orgName,
  isPending,
  onConfirm,
  onCancel,
}: {
  action: ActionType;
  orgName: string;
  isPending: boolean;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}) {
  const [note, setNote] = useState(
    action === "approve"
      ? "Approved. Welcome aboard!"
      : "Denied. Please provide more details about your institute."
  );
  const isApprove = action === "approve";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div
          className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center",
            isApprove ? "bg-emerald-50" : "bg-red-50"
          )}
        >
          {isApprove ? (
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {isApprove ? "Approve Organization" : "Deny Request"}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {isApprove
              ? `Approving "${orgName}" will activate their account.`
              : `Denying "${orgName}"'s request will notify the requester.`}
          </p>
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            <MessageSquare className="h-3 w-3" /> Review Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Add a review note..."
          />
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant={isApprove ? "success" : "destructive"}
            size="sm"
            className="flex-1"
            onClick={() => onConfirm(note)}
            disabled={isPending}
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isApprove ? "Approve" : "Deny"}
          </Button>
        </div>
      </div>
    </div>
  );
}

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
  const [dialog, setDialog] = useState<{
    orgId: string;
    orgName: string;
    action: ActionType;
  } | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["organisations"],
    queryFn: () => api.get<OrganisationsResponse>("/organisations"),
  });

  const { mutate: submitAction, isPending: isActioning } = useMutation({
    mutationFn: ({ orgId, action, note }: { orgId: string; action: ActionType; note: string }) =>
      api.post(`/organisations/${orgId}/${action}`, { review_note: note }),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      toast.success(action === "approve" ? "Organization approved!" : "Request denied.");
      setDialog(null);
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to update status.");
    },
  });

  const items = data?.data?.items ?? [];

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
      {dialog && (
        <ReviewNoteDialog
          action={dialog.action}
          orgName={dialog.orgName}
          isPending={isActioning}
          onConfirm={(note) => submitAction({ orgId: dialog.orgId, action: dialog.action, note })}
          onCancel={() => setDialog(null)}
        />
      )}
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
            <div className="w-40 shrink-0 text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Actions
              </p>
            </div>
          </div>

          {filtered.map((org, i) => {
            const typeKey = org.type?.toLowerCase();
            const typeStyle = TYPE_STYLES[typeKey] ?? TYPE_STYLES.other;
            const statusStyle = STATUS_STYLES[org.status] ?? STATUS_STYLES.rejected;
            const city = extractCity(org.location_text);

            return (
              <div
                key={org.id}
                className={cn(
                  "group transition-colors hover:bg-slate-50",
                  i !== 0 && "border-t border-slate-100"
                )}
              >
                {/* Mobile */}
                <Link
                  href={`/super-admin/organizations/${org.id}`}
                  className="flex items-center gap-3 px-4 py-3 md:hidden"
                >
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-indigo-600">
                      {getInitials(org.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {org.name}
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
                        {org.type}
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
                    {statusStyle.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                </Link>
                {org.status === "pending" && (
                  <div className="flex gap-2 px-4 pb-3 md:hidden">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 h-7 text-xs"
                      onClick={() =>
                        setDialog({ orgId: org.id, orgName: org.name, action: "deny" })
                      }
                    >
                      <XCircle className="h-3 w-3" /> Deny
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-1 h-7 text-xs"
                      onClick={() =>
                        setDialog({ orgId: org.id, orgName: org.name, action: "approve" })
                      }
                    >
                      <CheckCircle className="h-3 w-3" /> Approve
                    </Button>
                  </div>
                )}

                {/* Desktop */}
                <div className="hidden md:flex items-center px-5 py-3">
                  <Link
                    href={`/super-admin/organizations/${org.id}`}
                    className="flex-1 min-w-0 flex items-center gap-3"
                  >
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
                  </Link>
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
                  <div className="w-40 shrink-0 flex items-center justify-end gap-1.5">
                    {org.status === "pending" ? (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 px-2.5 text-xs"
                          onClick={() =>
                            setDialog({ orgId: org.id, orgName: org.name, action: "deny" })
                          }
                        >
                          <XCircle className="h-3 w-3" /> Deny
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          className="h-7 px-2.5 text-xs"
                          onClick={() =>
                            setDialog({ orgId: org.id, orgName: org.name, action: "approve" })
                          }
                        >
                          <CheckCircle className="h-3 w-3" /> Approve
                        </Button>
                      </>
                    ) : (
                      <Link href={`/super-admin/organizations/${org.id}`}>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-all" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
