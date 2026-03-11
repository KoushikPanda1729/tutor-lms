import Link from "next/link";
import { FileText, Video, ClipboardList, CalendarCheck } from "lucide-react";

import { mockBatches, mockNotes, mockVideos, mockTests } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const sections = [
  {
    label: "Notes",
    href: "notes",
    icon: FileText,
    color: "text-red-500",
    bg: "bg-red-50",
    desc: "Download study materials",
  },
  {
    label: "Videos",
    href: "videos",
    icon: Video,
    color: "text-purple-500",
    bg: "bg-purple-50",
    desc: "Watch lecture videos",
  },
  {
    label: "Tests",
    href: "tests",
    icon: ClipboardList,
    color: "text-amber-500",
    bg: "bg-amber-50",
    desc: "Attempt available tests",
  },
  {
    label: "Attendance",
    href: "attendance",
    icon: CalendarCheck,
    color: "text-green-500",
    bg: "bg-green-50",
    desc: "View your attendance record",
  },
];

export default async function StudentBatchPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const batch = mockBatches.find((b) => b.id === batchId) || mockBatches[0];
  const notes = mockNotes.filter((n) => n.batchId === batchId);
  const videos = mockVideos.filter((v) => v.batchId === batchId);
  const tests = mockTests.filter((t) => t.batchId === batchId);
  const counts: Record<string, number> = {
    notes: notes.length,
    videos: videos.length,
    tests: tests.length,
    attendance: 0,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">{batch.name}</h2>
        <p className="text-sm text-slate-500">{batch.subject}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((s) => (
          <Link
            key={s.label}
            href={`/student/batches/${batchId}/${s.href}`}
            className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center mb-3", s.bg)}>
              <s.icon className={cn("h-5 w-5", s.color)} />
            </div>
            <p className="font-semibold text-slate-900 mb-0.5 group-hover:text-indigo-600 transition-colors">
              {s.label}
            </p>
            <p className="text-xs text-slate-400 mb-2">{s.desc}</p>
            {counts[s.href] > 0 && (
              <p className="text-xs font-medium text-slate-600">{counts[s.href]} available</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
