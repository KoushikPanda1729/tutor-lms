"use client";

import Link from "next/link";
import { LayoutGrid, FileText, Video, ClipboardList, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  {
    key: "overview",
    icon: LayoutGrid,
    label: "Overview",
    href: (id: string) => `/student/batches/${id}`,
  },
  {
    key: "notes",
    icon: FileText,
    label: "Notes",
    href: (id: string) => `/student/batches/${id}/notes`,
  },
  {
    key: "videos",
    icon: Video,
    label: "Videos",
    href: (id: string) => `/student/batches/${id}/videos`,
  },
  {
    key: "tests",
    icon: ClipboardList,
    label: "Tests",
    href: (id: string) => `/student/batches/${id}/tests`,
  },
  {
    key: "attendance",
    icon: CalendarCheck,
    label: "Attendance",
    href: (id: string) => `/student/batches/${id}/attendance`,
  },
];

export function BatchTabBar({ batchId, active }: { batchId: string; active: string }) {
  return (
    <div className="lg:hidden flex items-center gap-2 overflow-x-auto scrollbar-none">
      {TABS.map(({ key, icon: Icon, label, href }) => (
        <Link
          key={key}
          href={href(batchId)}
          className={cn(
            "flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-all",
            active === key
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
          )}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" />
          {label}
        </Link>
      ))}
    </div>
  );
}
