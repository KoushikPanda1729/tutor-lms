"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  Building2,
  CreditCard,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

const settingsTabs = [
  { label: "General", tab: "general", icon: Building2 },
  { label: "Billing", tab: "billing", icon: CreditCard },
  { label: "Danger Zone", tab: "danger", icon: AlertTriangle },
];

interface OrgSidebarProps {
  orgName?: string;
  orgSlug?: string;
}

export function OrgSidebar({ orgName = "My Institute", orgSlug = "" }: OrgSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);

  const pathParts = pathname.split("/");
  const isOnBatches = pathParts[3] === "batches";
  const isInsideBatch = isOnBatches && pathParts[4] && pathParts[4] !== "new";
  const currentBatchId = isInsideBatch ? pathParts[4] : null;
  const currentBatch = currentBatchId ? mockBatches.find((b) => b.id === currentBatchId) : null;
  const batchBase = currentBatchId ? `/org/${orgSlug}/batches/${currentBatchId}` : null;
  const isOnSettings = pathParts[3] === "settings";
  const activeSettingsTab = searchParams.get("tab") ?? "general";

  const [batchOpen, setBatchOpen] = useState(isOnBatches);
  const [settingsOpen, setSettingsOpen] = useState(isOnSettings);
  const router = useRouter();

  return (
    <aside
      className={cn(
        "h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-slate-100",
          collapsed ? "justify-center px-0" : "gap-3 px-5"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 leading-tight truncate">{orgName}</p>
            <p className="text-[11px] text-slate-400">{orgSlug}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 py-4 space-y-1 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        {navSlugs.map((item) => {
          const Icon = item.icon;
          const href = `/org/${orgSlug}/${item.slug}`;
          const isActive = pathParts[3] === item.slug;
          const isBatchesItem = item.slug === "batches";
          const isSettingsItem = item.slug === "settings";
          const hasSubNav = isBatchesItem || isSettingsItem;
          const isExpanded = isBatchesItem ? batchOpen : isSettingsItem ? settingsOpen : false;

          return (
            <div key={item.slug}>
              <button
                title={collapsed ? item.label : undefined}
                onClick={() => {
                  if (isBatchesItem) {
                    setBatchOpen((o) => !o);
                    if (!isOnBatches) router.push(href);
                  } else if (isSettingsItem) {
                    setSettingsOpen((o) => !o);
                    if (!isOnSettings) router.push(href);
                  } else {
                    router.push(href);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    isActive ? "bg-indigo-600" : "bg-slate-100"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", isActive ? "text-white" : "text-slate-500")} />
                </span>
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                {!collapsed && hasSubNav && (
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      isActive ? "text-indigo-400" : "text-slate-400",
                      isExpanded ? "rotate-0" : "-rotate-90"
                    )}
                  />
                )}
              </button>

              {/* Batches sub-nav */}
              {isBatchesItem && batchOpen && !collapsed && (
                <div className="mt-1 ml-3 pl-4 border-l-2 border-slate-100 space-y-0.5">
                  {isInsideBatch && currentBatch && batchBase ? (
                    <>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pt-2 pb-1 truncate">
                        {currentBatch.name}
                      </p>
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
                              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all",
                              isTabActive
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            )}
                          >
                            <TabIcon
                              className={cn(
                                "h-3.5 w-3.5",
                                isTabActive ? "text-indigo-500" : "text-slate-400"
                              )}
                            />
                            {tab.label}
                          </Link>
                        );
                      })}
                    </>
                  ) : (
                    <p className="px-2 py-2 text-[11px] text-slate-400">
                      Open a batch to see its tabs
                    </p>
                  )}
                </div>
              )}

              {/* Settings sub-nav */}
              {isSettingsItem && settingsOpen && !collapsed && (
                <div className="mt-1 ml-3 pl-4 border-l-2 border-slate-100 space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pt-2 pb-1">
                    Preferences
                  </p>
                  {settingsTabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const isTabActive = activeSettingsTab === tab.tab;
                    return (
                      <Link
                        key={tab.tab}
                        href={`/org/${orgSlug}/settings?tab=${tab.tab}`}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all",
                          isTabActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        )}
                      >
                        <TabIcon
                          className={cn(
                            "h-3.5 w-3.5",
                            isTabActive ? "text-indigo-500" : "text-slate-400"
                          )}
                        />
                        {tab.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="flex justify-end px-4 pb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-6 w-6 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
        >
          <ChevronLeft
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              collapsed ? "rotate-180" : ""
            )}
          />
        </button>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-100">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all",
            collapsed && "justify-center px-0"
          )}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
            <LogOut className="h-3.5 w-3.5 text-slate-400" />
          </span>
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}
