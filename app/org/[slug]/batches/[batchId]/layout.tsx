"use client";

import { use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mockBatches } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Video,
  ClipboardList,
  CalendarCheck,
  Users,
} from "lucide-react";

export default function BatchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { slug, batchId } = use(params);
  const batch = mockBatches.find((b) => b.id === batchId) || mockBatches[0];
  const pathname = usePathname();

  const tabs = [
    {
      label: "Overview",
      href: `/org/${slug}/batches/${batchId}`,
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "Notes", href: `/org/${slug}/batches/${batchId}/notes`, icon: FileText, exact: false },
    { label: "Videos", href: `/org/${slug}/batches/${batchId}/videos`, icon: Video, exact: false },
    {
      label: "Tests",
      href: `/org/${slug}/batches/${batchId}/tests`,
      icon: ClipboardList,
      exact: false,
    },
    {
      label: "Attendance",
      href: `/org/${slug}/batches/${batchId}/attendance`,
      icon: CalendarCheck,
      exact: false,
    },
    {
      label: "Students",
      href: `/org/${slug}/batches/${batchId}/students`,
      icon: Users,
      exact: false,
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href={`/org/${slug}/batches`} className="hover:text-slate-800 transition-colors">
            Batches
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{batch.name}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">{batch.name}</h2>
        <p className="text-sm text-slate-500">
          {batch.subject} · {batch.studentCount} students
        </p>
      </div>

      {/* Mobile tab bar — hidden on lg+ (sidebar handles nav there) */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-none mb-5 pb-1">
        {tabs.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap shrink-0",
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
