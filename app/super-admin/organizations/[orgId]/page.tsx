"use client";

import { useState, use, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Layers,
  Navigation,
  Radio,
  Loader2,
  MessageSquare,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type Organisation = {
  id: string;
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
  requester_id?: string;
  created_at: string;
  updated_at: string;
};

type ReviewAction = "approve" | "deny" | null;

function statusVariant(status: string) {
  const map: Record<string, "success" | "pending" | "suspended" | "destructive"> = {
    approved: "success",
    pending: "pending",
    suspended: "suspended",
    rejected: "destructive",
  };
  return map[status] || ("secondary" as "success");
}

function statusLabel(status: string) {
  return status === "approved" ? "active" : status;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Review Dialog ────────────────────────────────────────────────────────────
function ReviewDialog({
  action,
  orgName,
  isPending,
  onConfirm,
  onCancel,
}: {
  action: ReviewAction;
  orgName: string;
  isPending: boolean;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}) {
  const [note, setNote] = useState(
    action === "approve"
      ? "Looks good. Approved."
      : "Denied. Please provide more details about your institute."
  );

  if (!action) return null;
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
            size="sm"
            className={cn(
              "flex-1",
              isApprove
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            )}
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

// ─── Delete Confirmation Dialog ───────────────────────────────────────────────
function DeleteDialog({
  orgName,
  isPending,
  onConfirm,
  onCancel,
}: {
  orgName: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Delete Organization</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            This will permanently delete{" "}
            <span className="font-semibold text-slate-800">&quot;{orgName}&quot;</span>. This action
            cannot be undone.
          </p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
          {orgName}
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
            size="sm"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-48 bg-slate-100 rounded" />
      <div className="space-y-2">
        <div className="h-7 w-64 bg-slate-100 rounded" />
        <div className="h-4 w-40 bg-slate-100 rounded" />
      </div>
      <div className="h-48 bg-slate-100 rounded-xl" />
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <div className="text-sm font-medium text-slate-800 break-words">{value}</div>
      </div>
    </div>
  );
}

// ─── Stat mini card ───────────────────────────────────────────────────────────
function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl px-4 py-3">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ─── Detail Content ───────────────────────────────────────────────────────────
function OrgDetailContent({ orgId }: { orgId: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "overview";
  const queryClient = useQueryClient();
  const router = useRouter();

  const [pendingAction, setPendingAction] = useState<ReviewAction>(null);
  const [showDelete, setShowDelete] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["organisation", orgId],
    queryFn: () => api.get<Organisation>(`/organisations/${orgId}`),
  });

  const org = data?.data ?? null;

  // Approve / Deny — PATCH /organisations/{id}
  const { mutate: submitAction, isPending: isActioning } = useMutation({
    mutationFn: ({ action, note }: { action: ReviewAction; note: string }) =>
      api.patch(`/organisations/${orgId}`, {
        status: action === "approve" ? "approved" : "denied",
        review_note: note,
      }),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["organisation", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      toast.success(action === "approve" ? "Organization approved!" : "Request denied.");
      setPendingAction(null);
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to update status."),
  });

  // Delete — DELETE /organisations/{id}
  const { mutate: deleteOrg, isPending: isDeleting } = useMutation({
    mutationFn: () => api.delete(`/organisations/${orgId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      toast.success("Organization deleted.");
      router.push("/super-admin/organizations");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to delete organization."),
  });

  if (isLoading) return <DetailSkeleton />;
  if (isError || !org) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-sm text-red-600 font-medium">
        Failed to load organization details. Please try again.
      </div>
    );
  }

  const status = org.status;
  const city = org.location_text.split(",")[0]?.trim() ?? org.location_text;
  const tabs = [
    { label: "Overview", tab: "overview" },
    { label: "Location", tab: "location" },
  ];

  return (
    <>
      {pendingAction && (
        <ReviewDialog
          action={pendingAction}
          orgName={org.name}
          isPending={isActioning}
          onConfirm={(note) => submitAction({ action: pendingAction, note })}
          onCancel={() => setPendingAction(null)}
        />
      )}
      {showDelete && (
        <DeleteDialog
          orgName={org.name}
          isPending={isDeleting}
          onConfirm={() => deleteOrg()}
          onCancel={() => setShowDelete(false)}
        />
      )}

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
          <span className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
            {org.name}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <span className="text-base font-bold text-indigo-600">{getInitials(org.name)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex flex-wrap items-center gap-2">
                {org.name}
                <Badge variant={statusVariant(status)} className="capitalize">
                  {statusLabel(status)}
                </Badge>
              </h2>
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                <MapPin className="h-3 w-3 shrink-0" />
                {city}
                <span className="text-slate-300">·</span>
                <Layers className="h-3 w-3 shrink-0" />
                <span className="capitalize">{org.type}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Delete — always visible */}
            <button
              onClick={() => setShowDelete(true)}
              className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            {status === "pending" && (
              <>
                {/* Deny — outline */}
                <button
                  onClick={() => setPendingAction("deny")}
                  className="h-9 px-4 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 text-sm font-semibold flex items-center gap-1.5 transition-all"
                >
                  <XCircle className="h-4 w-4" /> Deny
                </button>
                {/* Approve — solid */}
                <button
                  onClick={() => setPendingAction("approve")}
                  className="h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <CheckCircle className="h-4 w-4" /> Approve
                </button>
              </>
            )}
            {status === "approved" && (
              <button
                onClick={() => setPendingAction("deny")}
                className="h-9 px-4 rounded-lg border border-amber-200 text-amber-700 bg-white hover:bg-amber-50 hover:border-amber-300 text-sm font-semibold flex items-center gap-1.5 transition-all"
              >
                <AlertTriangle className="h-4 w-4" /> Suspend
              </button>
            )}
            {status === "suspended" && (
              <button
                onClick={() => setPendingAction("approve")}
                className="h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <CheckCircle className="h-4 w-4" /> Reactivate
              </button>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-5 -mx-4 px-4 scrollbar-none">
          {tabs.map((t) => (
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

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Information</CardTitle>
                </CardHeader>
                <CardContent className="px-5 py-2">
                  <InfoRow icon={Building2} label="Name" value={org.name} />
                  <InfoRow
                    icon={Layers}
                    label="Type"
                    value={<span className="capitalize">{org.type}</span>}
                  />
                  <InfoRow icon={MapPin} label="Location" value={org.location_text} />
                  <InfoRow
                    icon={FileText}
                    label="Description"
                    value={
                      org.description || (
                        <span className="text-slate-400 italic">No description provided</span>
                      )
                    }
                  />
                  {org.logo_url && (
                    <InfoRow
                      icon={FileText}
                      label="Logo URL"
                      value={
                        <a
                          href={org.logo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline break-all text-xs"
                        >
                          {org.logo_url}
                        </a>
                      }
                    />
                  )}
                  {org.cover_image_url && (
                    <InfoRow
                      icon={FileText}
                      label="Cover Image URL"
                      value={
                        <a
                          href={org.cover_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline break-all text-xs"
                        >
                          {org.cover_image_url}
                        </a>
                      }
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-green-500" />
                    Attendance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <MiniStat
                      label="Radius (meters)"
                      value={org.attendance_radius_meters}
                      color="text-indigo-600"
                    />
                    <MiniStat
                      label="Radius Enabled"
                      value={org.attendance_radius_enabled ? "Yes" : "No"}
                      color={org.attendance_radius_enabled ? "text-green-600" : "text-slate-400"}
                    />
                    <MiniStat
                      label="Coordinates"
                      value={`${org.latitude.toFixed(4)}, ${org.longitude.toFixed(4)}`}
                      color="text-slate-700"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Status</p>
                    <Badge variant={statusVariant(status)} className="capitalize">
                      {statusLabel(status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Type</p>
                    <Badge variant="secondary" className="capitalize">
                      {org.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Created</p>
                    <p className="text-sm font-medium text-slate-800">
                      {formatDate(org.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Last Updated</p>
                    <p className="text-sm font-medium text-slate-800">
                      {formatDate(org.updated_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">ID</p>
                    <p className="text-xs font-mono text-slate-500 break-all">{org.id}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Danger zone */}
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-500 mb-3">
                    Permanently delete this organization and all associated data.
                  </p>
                  <button
                    onClick={() => setShowDelete(true)}
                    className="w-full h-9 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Organization
                  </button>
                </CardContent>
              </Card>

              {status === "rejected" && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-400 text-center">
                  This request has been denied.
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOCATION */}
        {activeTab === "location" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-indigo-500" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Full Address
                      </p>
                      <p className="text-sm font-medium text-slate-800">{org.location_text}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Latitude
                        </p>
                        <p className="text-sm font-mono text-slate-800">{org.latitude}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Longitude
                        </p>
                        <p className="text-sm font-mono text-slate-800">{org.longitude}</p>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${org.latitude}&mlon=${org.longitude}&zoom=15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    View on OpenStreetMap
                  </a>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-amber-500" />
                    Attendance Radius
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Radius Enabled</span>
                    <Badge variant={org.attendance_radius_enabled ? "success" : "secondary"}>
                      {org.attendance_radius_enabled ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Radius</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {org.attendance_radius_meters} m
                    </span>
                  </div>
                  {org.attendance_radius_enabled && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
                      Students must be within {org.attendance_radius_meters}m of the org location to
                      mark attendance.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
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
