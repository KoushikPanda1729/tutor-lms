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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navSlugs = [
  { label: "Dashboard", slug: "dashboard", icon: LayoutDashboard },
  { label: "Batches", slug: "batches", icon: BookOpen },
  { label: "Students", slug: "students", icon: Users },
  { label: "Teachers", slug: "teachers", icon: UserCheck },
  { label: "Reports", slug: "reports", icon: BarChart3 },
  { label: "Settings", slug: "settings", icon: Settings },
];

interface OrgSidebarProps {
  orgName?: string;
  orgSlug?: string;
}

export function OrgSidebar({ orgName = "My Institute", orgSlug = "" }: OrgSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navSlugs.map((item) => {
          const Icon = item.icon;
          const href = `/org/${orgSlug}/${item.slug}`;
          // Match exact segment after /org/[slug]/ to avoid false positives
          // e.g. /org/allen/batches/batch-1/students should highlight "batches", not "students"
          const isActive = pathname.split("/")[3] === item.slug;
          return (
            <Link
              key={item.slug}
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
              {!collapsed && item.label}
            </Link>
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
