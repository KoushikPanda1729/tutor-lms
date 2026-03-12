"use client";

import { Suspense, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Menu,
  Bell,
  X,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Info,
  GraduationCap,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ShellClientProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  orgName?: string;
  desktopSidebarWidth?: "w-72" | "w-16";
  mobileBottomNav?: React.ReactNode;
}

const NOTIFICATIONS = [
  {
    id: 1,
    icon: ClipboardList,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "New test available",
    body: "Unit Test 1 - Mechanics is now open for attempt.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: BookOpen,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    title: "Notes uploaded",
    body: "Dr. Rajesh Verma uploaded Waves & Oscillations notes.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: 3,
    icon: CalendarCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Attendance marked",
    body: "Your attendance for today's Physics class has been recorded.",
    time: "3 hr ago",
    unread: false,
  },
  {
    id: 4,
    icon: Info,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    title: "Batch schedule updated",
    body: "JEE Advanced 2026 - Batch A schedule has been updated.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 5,
    icon: ClipboardList,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    title: "Test result published",
    body: "Your Mid-Term Chemistry test result is now available.",
    time: "2 days ago",
    unread: false,
  },
];

function getPageTitle(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  // /org/[slug]/... or /student/...
  const isOrg = parts[0] === "org";
  const isStudent = parts[0] === "student";

  if (isOrg) {
    const section = parts[2];
    const sub = parts[4];
    if (section === "dashboard") return "Dashboard";
    if (section === "students") return "Students";
    if (section === "teachers") return "Teachers";
    if (section === "reports") return "Reports";
    if (section === "settings") return "Settings";
    if (section === "batches") {
      if (!parts[3]) return "Batches";
      if (parts[3] === "new") return "New Batch";
      if (sub === "notes") return "Notes";
      if (sub === "videos") return "Videos";
      if (sub === "tests") return "Tests";
      if (sub === "attendance") return "Attendance";
      if (sub === "students") return "Batch Students";
      return "Batch Overview";
    }
  }
  if (isStudent) {
    const section = parts[1];
    if (section === "dashboard") return "My Dashboard";
    if (section === "batches") {
      const sub = parts[3];
      if (!parts[2]) return "My Batches";
      if (sub === "notes") return "Notes";
      if (sub === "videos") return "Videos";
      if (sub === "tests") return "Tests";
      if (sub === "attendance") return "Attendance";
      return "Batch Overview";
    }
  }
  return "Dashboard";
}

function ShellInner({
  sidebar,
  children,
  userName = "User",
  userEmail = "",
  orgName,
  desktopSidebarWidth = "w-72",
  mobileBottomNav,
}: ShellClientProps) {
  const pathname = usePathname();
  useSearchParams();

  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Notification backdrop — only covers main content, not sidebar */}
      {notifOpen && (
        <div
          className="fixed inset-0 lg:left-72 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setNotifOpen(false)}
        />
      )}

      {/* Notification panel */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50 w-full max-w-[360px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
          notifOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-900">Notifications</p>
            {unreadCount > 0 && (
              <p className="text-xs text-slate-400 mt-0.5">{unreadCount} unread</p>
            )}
          </div>
          <button
            onClick={() => setNotifOpen(false)}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {NOTIFICATIONS.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer",
                  n.unread && "bg-indigo-50/40"
                )}
              >
                <div
                  className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                    n.iconBg
                  )}
                >
                  <Icon className={cn("h-4 w-4", n.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm leading-tight",
                        n.unread ? "font-bold text-slate-900" : "font-semibold text-slate-700"
                      )}
                    >
                      {n.title}
                    </p>
                    {n.unread && (
                      <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100">
          <button className="w-full text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors py-1">
            Mark all as read
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-72 z-50 lg:z-10 transition-transform duration-300 ease-in-out",
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
          desktopSidebarWidth === "w-16" ? "lg:ml-16" : "lg:ml-72"
        )}
      >
        {/* Top bar */}
        <header className="flex h-14 lg:h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 lg:px-6 shrink-0">
          {/* Hamburger — only when no bottom nav */}
          {!mobileBottomNav && (
            <button
              onClick={() => setOpen(true)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Logo (mobile bottom nav) or page title (hamburger nav) */}
          {mobileBottomNav && orgName ? (
            <div className="flex items-center gap-2 flex-1">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                <GraduationCap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900 truncate">{orgName}</span>
            </div>
          ) : (
            <p className="lg:hidden flex-1 text-sm font-bold text-slate-900 truncate">
              {getPageTitle(pathname)}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotifOpen(true)}
              className="relative h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
              )}
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

        <main
          className={cn("flex-1 overflow-y-auto p-4 lg:p-6", mobileBottomNav && "pb-20 lg:pb-6")}
        >
          {children}
        </main>
      </div>

      {mobileBottomNav}
    </div>
  );
}

export function ShellClient(props: ShellClientProps) {
  return (
    <Suspense fallback={null}>
      <ShellInner {...props} />
    </Suspense>
  );
}
