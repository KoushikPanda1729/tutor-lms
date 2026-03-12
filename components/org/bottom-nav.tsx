"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, UserCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

function useOrgSlug() {
  const pathname = usePathname();
  return pathname.split("/")[2] ?? "";
}

export function OrgBottomNav() {
  const pathname = usePathname();
  const slug = useOrgSlug();

  const NAV = [
    {
      label: "Dashboard",
      href: `/org/${slug}/dashboard`,
      icon: LayoutDashboard,
      match: (p: string) => p.startsWith(`/org/${slug}/dashboard`),
    },
    {
      label: "Batches",
      href: `/org/${slug}/batches`,
      icon: BookOpen,
      match: (p: string) => p.startsWith(`/org/${slug}/batches`),
    },
    {
      label: "Students",
      href: `/org/${slug}/students`,
      icon: Users,
      match: (p: string) => p.startsWith(`/org/${slug}/students`),
    },
    {
      label: "Teachers",
      href: `/org/${slug}/teachers`,
      icon: UserCheck,
      match: (p: string) => p.startsWith(`/org/${slug}/teachers`),
    },
    {
      label: "Settings",
      href: `/org/${slug}/settings`,
      icon: Settings,
      match: (p: string) =>
        p.startsWith(`/org/${slug}/settings`) || p.startsWith(`/org/${slug}/reports`),
    },
  ];

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
