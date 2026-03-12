"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, BadgeDollarSign, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    match: (p: string) => p === "/",
  },
  {
    label: "Features",
    href: "/#features",
    icon: Zap,
    match: (p: string) => false,
  },
  {
    label: "Pricing",
    href: "/#pricing",
    icon: BadgeDollarSign,
    match: (p: string) => false,
  },
  {
    label: "Sign In",
    href: "/login",
    icon: LogIn,
    match: (p: string) => p === "/login" || p === "/register",
  },
];

export function LandingBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-stretch"
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
