"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Settings,
  LogOut,
  GraduationCap,
  BarChart3,
  ChevronDown,
  Globe,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
  { label: "Organizations", href: "/super-admin/organizations", icon: Building2 },
  { label: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/super-admin/settings", icon: Settings },
];

const settingsTabs = [
  { label: "General", tab: "general", icon: Globe },
  { label: "Registration", tab: "registration", icon: ClipboardList },
  { label: "Billing", tab: "billing", icon: CreditCard },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOnSettings = pathname.startsWith("/super-admin/settings");
  const activeTab = searchParams.get("tab") ?? "general";
  const [settingsOpen, setSettingsOpen] = useState(isOnSettings);
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">TutorLMS</p>
          <p className="text-[11px] text-slate-400">Super Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          const isSettingsItem = item.href.includes("settings");

          return (
            <div key={item.href}>
              <button
                onClick={() => {
                  if (isSettingsItem) {
                    setSettingsOpen((o) => !o);
                    if (!isOnSettings) router.push(item.href);
                  } else {
                    router.push(item.href);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
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
                <span className="flex-1 text-left">{item.label}</span>
                {isSettingsItem && (
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      isActive ? "text-indigo-400" : "text-slate-400",
                      settingsOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                )}
              </button>

              {isSettingsItem && settingsOpen && (
                <div className="mt-1 ml-3 pl-4 border-l-2 border-slate-100 space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pt-2 pb-1">
                    Preferences
                  </p>
                  {settingsTabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const isTabActive = activeTab === tab.tab;
                    return (
                      <Link
                        key={tab.tab}
                        href={`/super-admin/settings?tab=${tab.tab}`}
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

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
            <LogOut className="h-3.5 w-3.5 text-slate-400" />
          </span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
