"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  GraduationCap,
  ChevronDown,
  FileText,
  Video,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { mockBatches } from "@/lib/mock-data";

const STUDENT_BATCH_IDS = ["batch-1", "batch-3"];
const myBatches = mockBatches.filter((b) => STUDENT_BATCH_IDS.includes(b.id));

const batchTabs = [
  { label: "Notes", href: "/notes", icon: FileText },
  { label: "Videos", href: "/videos", icon: Video },
  { label: "Tests", href: "/tests", icon: ClipboardList },
  { label: "Attendance", href: "/attendance", icon: CalendarCheck },
];

interface StudentSidebarProps {
  orgName?: string;
}

export function StudentSidebar({ orgName = "My Institute" }: StudentSidebarProps) {
  const pathname = usePathname();

  const isOnBatches = pathname.startsWith("/student/batches");
  const currentBatchId = pathname.split("/")[3] ?? null;
  const currentBatch = currentBatchId ? myBatches.find((b) => b.id === currentBatchId) : null;

  const [batchOpen, setBatchOpen] = useState(isOnBatches);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white truncate">{orgName}</p>
          <p className="text-xs text-slate-400">Student Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {/* Dashboard */}
        <Link
          href="/student/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname.startsWith("/student/dashboard")
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          <span className="flex-1">My Dashboard</span>
        </Link>

        {/* My Batches — expandable */}
        <div>
          <button
            onClick={() => {
              setBatchOpen((o) => !o);
              if (!isOnBatches) window.location.href = "/student/batches";
            }}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isOnBatches
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">My Batches</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                isOnBatches ? "text-white/70" : "text-slate-500",
                batchOpen ? "rotate-0" : "-rotate-90"
              )}
            />
          </button>

          {/* Sub-nav */}
          {batchOpen && currentBatch && (
            <div className="mt-0.5 mb-1 space-y-0.5 pl-3">
              <p className="px-3 pt-1 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest truncate">
                {currentBatch.name}
              </p>
              {batchTabs.map((tab) => {
                const TabIcon = tab.icon;
                const tabHref = `/student/batches/${currentBatchId}${tab.href}`;
                const isTabActive = pathname.startsWith(tabHref);
                return (
                  <Link
                    key={tab.label}
                    href={tabHref}
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
