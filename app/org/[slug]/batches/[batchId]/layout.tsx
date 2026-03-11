"use client";

import { use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Video,
  ClipboardList,
  CalendarCheck,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockBatches } from "@/lib/mock-data";

const tabs = [
  { label: "Overview", href: "", icon: LayoutDashboard },
  { label: "Notes", href: "/notes", icon: FileText },
  { label: "Videos", href: "/videos", icon: Video },
  { label: "Tests", href: "/tests", icon: ClipboardList },
  { label: "Attendance", href: "/attendance", icon: CalendarCheck },
  { label: "Students", href: "/students", icon: Users },
];

export default function BatchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { slug, batchId } = use(params);
  const pathname = usePathname();
  const batch = mockBatches.find((b) => b.id === batchId) || mockBatches[0];
  const base = `/org/${slug}/batches/${batchId}`;

  return (
    <div>
      <div className="mb-6">
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

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const href = `${base}${tab.href}`;
          const isActive =
            tab.href === "" ? pathname === base : pathname.startsWith(`${base}${tab.href}`);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                isActive
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
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
