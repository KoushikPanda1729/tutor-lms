"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  ChevronDown,
  FileText,
  Video,
  ClipboardList,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { mockBatches } from "@/lib/mock-data";

const navSlugs = [
  { label: "Dashboard", slug: "dashboard", icon: LayoutDashboard },
  { label: "Batches", slug: "batches", icon: BookOpen },
  { label: "Students", slug: "students", icon: Users },
  { label: "Teachers", slug: "teachers", icon: UserCheck },
  { label: "Reports", slug: "reports", icon: BarChart3 },
  { label: "Settings", slug: "settings", icon: Settings },
];

const batchTabs = [
  { label: "Overview", href: "", icon: LayoutDashboard },
  { label: "Notes", href: "/notes", icon: FileText },
  { label: "Videos", href: "/videos", icon: Video },
  { label: "Tests", href: "/tests", icon: ClipboardList },
  { label: "Attendance", href: "/attendance", icon: CalendarCheck },
  { label: "Students", href: "/students", icon: Users },
];

interface OrgSidebarProps {
  orgName?: string;
  orgSlug?: string;
}

export function OrgSidebar({ orgName = "My Institute", orgSlug = "" }: OrgSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Detect if we're inside a batch detail page
  const pathParts = pathname.split("/");
  // /org/[slug]/batches/[batchId]/...
  const isInsideBatch = pathParts[3] === "batches" && pathParts[4] && pathParts[4] !== "new";
  const currentBatchId = isInsideBatch ? pathParts[4] : null;
  const batch = currentBatchId ? mockBatches.find((b) => b.id === currentBatchId) : null;
  const batchBase = currentBatchId ? `/org/${orgSlug}/batches/${currentBatchId}` : null;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-slate-900 flex flex-col z-30 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-800">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{orgName}</p>
            <p className="text-xs text-slate-400">{orgSlug}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navSlugs.map((item) => {
          const Icon = item.icon;
          const href = `/org/${orgSlug}/${item.slug}`;
          const isActive = pathParts[3] === item.slug;
          const isBatchesItem = item.slug === "batches";

          return (
            <div key={item.slug}>
              <Link
                href={href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && isBatchesItem && isInsideBatch && (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                )}
              </Link>

              {/* Batch sub-nav */}
              {isBatchesItem && isInsideBatch && batchBase && !collapsed && (
                <div className="mt-0.5 mb-1">
                  {/* Batch name label */}
                  {batch && (
                    <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest truncate">
                      {batch.name}
                    </p>
                  )}
                  <div className="space-y-0.5 pl-3">
                    {batchTabs.map((tab) => {
                      const tabHref = `${batchBase}${tab.href}`;
                      const TabIcon = tab.icon;
                      const isTabActive =
                        tab.href === ""
                          ? pathname === batchBase
                          : pathname.startsWith(`${batchBase}${tab.href}`);
                      return (
                        <Link
                          key={tab.label}
                          href={tabHref}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                            isTabActive
                              ? "bg-indigo-500/20 text-indigo-300"
                              : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                          )}
                        >
                          <TabIcon className="h-3.5 w-3.5 shrink-0" />
                          {tab.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", collapsed ? "-rotate-90" : "rotate-90")}
          />
        </button>
      </div>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-slate-800">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}
