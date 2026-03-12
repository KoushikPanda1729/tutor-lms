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
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
          <GraduationCap className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight truncate">{orgName}</p>
          <p className="text-[11px] text-slate-400">Student Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavItem
          href="/student/dashboard"
          label="My Dashboard"
          icon={LayoutDashboard}
          active={pathname.startsWith("/student/dashboard")}
        />

        {/* My Batches */}
        <div>
          <button
            onClick={() => {
              setBatchOpen((o) => !o);
              if (!isOnBatches) router.push("/student/batches");
            }}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              isOnBatches
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                isOnBatches ? "bg-indigo-600" : "bg-slate-100"
              )}
            >
              <BookOpen
                className={cn("h-3.5 w-3.5", isOnBatches ? "text-white" : "text-slate-500")}
              />
            </span>
            <span className="flex-1 text-left">My Batches</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                isOnBatches ? "text-indigo-400" : "text-slate-400",
                batchOpen ? "rotate-0" : "-rotate-90"
              )}
            />
          </button>

          {batchOpen && currentBatch && (
            <div className="mt-1 ml-3 pl-4 border-l-2 border-slate-100 space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pt-2 pb-1 truncate">
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

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          active ? "bg-indigo-600" : "bg-slate-100"
        )}
      >
        <Icon className={cn("h-3.5 w-3.5", active ? "text-white" : "text-slate-500")} />
      </span>
      {label}
    </Link>
  );
}
