"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  {
    label: "Dashboard",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
    match: (p: string) => p.startsWith("/super-admin/dashboard"),
  },
  {
    label: "Orgs",
    href: "/super-admin/organizations",
    icon: Building2,
    match: (p: string) => p.startsWith("/super-admin/organizations"),
  },
  {
    label: "Analytics",
    href: "/super-admin/analytics",
    icon: BarChart3,
    match: (p: string) => p.startsWith("/super-admin/analytics"),
  },
  {
    label: "Settings",
    href: "/super-admin/settings",
    icon: Settings,
    match: (p: string) => p.startsWith("/super-admin/settings"),
  },
];

export function SuperAdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-stretch"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {NAV.map(({ label, href, icon: Icon, match }) => {
        const isActive = match(pathname);
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
              isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                isActive ? "bg-indigo-50" : ""
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-slate-400")} />
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
