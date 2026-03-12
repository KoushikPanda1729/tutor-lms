"use client";

import { useState, use } from "react";
import { Plus, FileText, Download, Trash2, Upload, Eye, X, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { mockNotes } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { Note } from "@/types";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function NotePreviewPanel({ note, onClose }: { note: Note; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm leading-tight">{note.title}</h3>
              <p className="text-xs text-slate-500">{note.fileSize} · PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PDF Preview Area */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <div className="space-y-4 max-w-sm mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 min-h-80">
              <div className="border-b-2 border-slate-200 pb-3 mb-4">
                <h2 className="text-base font-bold text-slate-900">{note.title}</h2>
                {note.description && (
                  <p className="text-xs text-slate-500 mt-1">{note.description}</p>
                )}
              </div>
              <div className="space-y-3">
                {[1, 0.83, 1, 0.8, 1, 0.9, 1, 0.75, 1, 0.85, 1, 0.67].map((w, i) => (
                  <div
                    key={i}
                    className={`h-2.5 bg-slate-100 rounded ${i === 5 ? "mt-4 mb-4 h-8 bg-slate-50 border border-slate-100" : ""}`}
                    style={{ width: `${w * 100}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
              <div className="space-y-3">
                {[1, 0.8, 1, 0.7, 1, 0.6].map((w, i) => (
                  <div
                    key={i}
                    className="h-2.5 bg-slate-100 rounded"
                    style={{ width: `${w * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-200 bg-white shrink-0 flex items-center justify-between">
          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" /> {note.uploadedBy}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> {formatDate(note.createdAt)}
            </div>
          </div>
          <Button size="sm" onClick={() => toast.success("Downloading...")}>
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </div>
      </div>
    </>
  );
}

export default function NotesPage({
  params,
}: {
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { batchId } = use(params);
  const [open, setOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const notes = mockNotes.filter((n) => n.batchId === batchId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Note uploaded successfully!");
    reset();
    setOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">{notes.length} notes uploaded</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> Upload Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Note</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  {...register("title")}
                  placeholder="Chapter 1 — Laws of Motion"
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description (optional)
                </label>
                <textarea
                  {...register("description")}
                  rows={2}
                  className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 resize-none"
                />
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                  Drop PDF here or <span className="text-indigo-600 cursor-pointer">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Max 50 MB</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Upload your first note for this batch."
        />
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-slate-300 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{note.title}</p>
                {note.description && (
                  <p className="text-xs text-slate-500 truncate">{note.description}</p>
                )}
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {note.uploadedBy} · {note.fileSize} · {formatDate(note.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setPreviewNote(note)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Preview</span>
                </button>
                <button
                  onClick={() => toast.success("Downloading...")}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />{" "}
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewNote && <NotePreviewPanel note={previewNote} onClose={() => setPreviewNote(null)} />}
    </div>
  );
}
