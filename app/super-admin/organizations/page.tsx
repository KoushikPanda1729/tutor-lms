"use client";

import { useState } from "react";
import { Search, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockOrganizations } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

const tabs = ["all", "pending", "active", "suspended"] as const;
type Tab = (typeof tabs)[number];

function statusVariant(status: string) {
  const map: Record<string, "success" | "pending" | "suspended" | "destructive" | "secondary"> = {
    active: "success",
    pending: "pending",
    suspended: "suspended",
    rejected: "destructive",
  };
  return map[status] || "secondary";
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

  return (
    <div>
      <PageHeader
        title="Organizations"
        description={`${mockOrganizations.length} total coaching centers`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or city..."
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-semibold capitalize transition-colors border-r border-slate-200 last:border-0 ${tab === t ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations found"
          description="Try adjusting your search or filter."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {[
                    "Organization",
                    "Location",
                    "Plan",
                    "Students",
                    "Batches",
                    "Joined",
                    "Status",
                    "",
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
                {filtered.map((org) => (
                  <tr
                    key={org.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{org.name}</p>
                      <p className="text-xs text-slate-400">{org.slug}.tutorlms.com</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{org.city}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="capitalize">
                        {org.plan}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{org.totalStudents}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{org.totalBatches}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDate(org.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(org.status)} className="capitalize">
                        {org.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/super-admin/organizations/${org.id}`}
                        className="text-xs font-medium text-indigo-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
