"use client";

import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ShellClientProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  /** Pass the collapsed sidebar width so main content shifts correctly on desktop */
  desktopSidebarWidth?: "w-64" | "w-16";
}

export function ShellClient({
  sidebar,
  children,
  userName = "User",
  userEmail = "",
  desktopSidebarWidth = "w-64",
}: ShellClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — fixed, slides in/out on mobile */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-64 z-50 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
      </div>

      {/* Main column */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300",
          desktopSidebarWidth === "w-16" ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        {/* Top bar */}
        <header className="flex h-14 lg:h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 lg:px-6 shrink-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(true)}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="relative h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-2.5 pl-1">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px] font-bold bg-indigo-100 text-indigo-700">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{userName}</p>
                <p className="text-[11px] text-slate-400">{userEmail}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
