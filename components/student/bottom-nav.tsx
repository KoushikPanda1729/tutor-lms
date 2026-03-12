"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  {
    label: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
    match: (p: string) => p.startsWith("/student/dashboard"),
  },
  {
    label: "Batches",
    href: "/student/batches",
    icon: BookOpen,
    match: (p: string) => p.startsWith("/student/batches"),
  },
  {
    label: "Profile",
    href: "/student/profile",
    icon: UserCircle,
    match: (p: string) => p.startsWith("/student/profile"),
  },
];

export function StudentBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-stretch safe-area-pb">
      {NAV.map(({ label, href, icon: Icon, match }) => {
        const isActive = match(pathname);
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
              isActive ? "text-indigo-600" : "text-slate-400"
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
