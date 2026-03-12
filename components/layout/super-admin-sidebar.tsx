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

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">TutorLMS</p>
          <p className="text-xs text-slate-400">Super Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
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
                    if (!isOnSettings) window.location.href = item.href;
                  } else {
                    window.location.href = item.href;
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {isSettingsItem && (
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      isActive ? "text-white/70" : "text-slate-500",
                      settingsOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                )}
              </button>

              {/* Settings sub-nav */}
              {isSettingsItem && settingsOpen && (
                <div className="mt-0.5 mb-1 space-y-0.5 pl-3">
                  <p className="px-3 pt-1 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
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
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t border-slate-800">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
