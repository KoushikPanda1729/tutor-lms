import { FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { mockNotes } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function StudentNotesPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const notes = mockNotes.filter((n) => n.batchId === batchId);

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900 mb-4">Study Notes</h3>
      {notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Notes uploaded by your teacher will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                  {note.description && (
                    <p className="text-xs text-slate-500 truncate">{note.description}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">
                    {note.fileSize} · Uploaded {formatDate(note.createdAt)}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
