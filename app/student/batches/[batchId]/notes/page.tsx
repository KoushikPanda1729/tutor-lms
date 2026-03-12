"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Download,
  Eye,
  GripVertical,
  X,
  Calendar,
  HardDrive,
  User,
  ExternalLink,
} from "lucide-react";
import { mockNotes } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { use } from "react";
import { BatchTabBar } from "@/components/student/batch-tab-bar";

type Note = (typeof mockNotes)[number];

const FILE_COLORS = [
  { bg: "bg-rose-50", icon: "text-rose-500", border: "border-rose-100" },
  { bg: "bg-violet-50", icon: "text-violet-500", border: "border-violet-100" },
  { bg: "bg-amber-50", icon: "text-amber-500", border: "border-amber-100" },
  { bg: "bg-sky-50", icon: "text-sky-500", border: "border-sky-100" },
  { bg: "bg-emerald-50", icon: "text-emerald-500", border: "border-emerald-100" },
];

export default function StudentNotesPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = use(params);
  const raw = mockNotes.filter((n) => n.batchId === batchId);
  const [notes, setNotes] = useState(raw);
  const [selected, setSelected] = useState<Note | null>(null);
  const [selectedColor, setSelectedColor] = useState(FILE_COLORS[0]);

  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  function onDragStart(i: number) {
    dragIndex.current = i;
  }
  function onDragEnter(i: number) {
    dragOverIndex.current = i;
  }
  function onDragEnd() {
    const from = dragIndex.current;
    const to = dragOverIndex.current;
    if (from === null || to === null || from === to) return;
    const updated = [...notes];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setNotes(updated);
    dragIndex.current = null;
    dragOverIndex.current = null;
  }

  function openNote(note: Note, color: (typeof FILE_COLORS)[number]) {
    setSelected(note);
    setSelectedColor(color);
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <FileText className="h-7 w-7 text-rose-400" />
        </div>
        <p className="text-sm font-semibold text-slate-700">No notes yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Notes uploaded by your teacher will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <BatchTabBar batchId={batchId} active="notes" />
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Study Notes</h3>
            <p className="text-xs text-slate-400 mt-0.5">{notes.length} files · drag to reorder</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-lg">
            <GripVertical className="h-3 w-3" /> Drag to reorder
          </div>
        </div>

        {/* Notes list */}
        <div className="space-y-2.5">
          {notes.map((note, i) => {
            const c = FILE_COLORS[i % FILE_COLORS.length];
            return (
              <div
                key={note.id}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragEnter={() => onDragEnter(i)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                  "group bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm",
                  "hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing active:opacity-60 active:scale-[0.99]"
                )}
              >
                {/* Top row: drag + icon + title/meta + action buttons */}
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-400 shrink-0 transition-colors" />

                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border",
                      c.bg,
                      c.border
                    )}
                  >
                    <FileText className={cn("h-4 w-4", c.icon)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {note.title}
                    </p>
                    {note.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{note.description}</p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {note.fileSize && <span className="font-medium">{note.fileSize}</span>}
                      {note.fileSize && " · "}
                      {formatDate(note.createdAt)}
                    </p>
                  </div>

                  {/* Icon-only buttons on mobile, text on sm+ */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openNote(note, c)}
                      className="h-8 w-8 sm:w-auto sm:px-3 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 shrink-0" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <a
                      href={note.fileUrl}
                      download
                      className="h-8 w-8 sm:w-auto sm:px-3 flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5 shrink-0" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Slide-over panel ─────────────────────────────────────────── */}
      {selected && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[520px] bg-slate-100 shadow-2xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                    selectedColor.bg
                  )}
                >
                  <FileText className={cn("h-4.5 w-4.5 h-[18px] w-[18px]", selectedColor.icon)} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{selected.title}</p>
                  <p className="text-[11px] text-slate-400">
                    {selected.fileSize && `${selected.fileSize} · `}PDF
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 ml-3"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {/* Panel body — document preview */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {/* White document card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                {/* Doc title */}
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selected.title}</h2>
                  {selected.description && (
                    <p className="text-sm text-slate-500 mt-1">{selected.description}</p>
                  )}
                </div>

                {/* Skeleton text lines */}
                <div className="space-y-2 pt-1">
                  <div className="h-2.5 bg-slate-100 rounded-full w-full" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[88%]" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[94%]" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[76%]" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[82%]" />
                </div>

                {/* Skeleton image/diagram block */}
                <div className="h-16 bg-slate-100 rounded-xl w-full" />

                {/* More skeleton lines */}
                <div className="space-y-2">
                  <div className="h-2.5 bg-slate-100 rounded-full w-full" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[90%]" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[70%]" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[85%]" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-[60%]" />
                </div>
              </div>

              {/* More skeleton lines outside card */}
              <div className="space-y-2.5 mt-5 px-1">
                <div className="h-2.5 bg-slate-200/70 rounded-full w-[80%]" />
                <div className="h-2.5 bg-slate-200/70 rounded-full w-[65%]" />
                <div className="h-2.5 bg-slate-200/70 rounded-full w-[75%]" />
                <div className="h-2.5 bg-slate-200/70 rounded-full w-[55%]" />
              </div>
            </div>

            {/* Panel footer */}
            <div className="px-5 py-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs text-slate-500 min-w-0">
                {selected.uploadedBy && (
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{selected.uploadedBy}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(selected.createdAt)}
                </div>
              </div>
              <a
                href={selected.fileUrl}
                download
                className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-700 transition-colors shrink-0"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
