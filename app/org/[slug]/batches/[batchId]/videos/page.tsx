"use client";

import { useState, use } from "react";
import {
  Plus,
  Video,
  Play,
  Trash2,
  GripVertical,
  Clock,
  Youtube,
  Eye,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { mockVideos } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Video as VideoType } from "@/types";

function VideoPreviewPanel({ video, onClose }: { video: VideoType; onClose: () => void }) {
  // Extract YouTube video ID
  const ytMatch = video.url?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const ytId = ytMatch?.[1];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{video.title}</h3>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-slate-500">{video.uploadedBy}</span>
              {video.duration && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" /> {video.duration}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Video player area */}
          <div className="bg-slate-900 aspect-video w-full flex items-center justify-center relative">
            {ytId ? (
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/60">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
                <p className="text-sm">Video preview not available</p>
              </div>
            )}
          </div>

          {/* Video details */}
          <div className="p-5 space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">{video.title}</h4>
              {video.description && <p className="text-sm text-slate-500">{video.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Uploaded by</p>
                <p className="font-medium text-slate-800">{video.uploadedBy}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Duration</p>
                <p className="font-medium text-slate-800">{video.duration || "—"}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Type</p>
                <p className="font-medium text-slate-800 capitalize">{video.type}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Added on</p>
                <p className="font-medium text-slate-800">{video.createdAt}</p>
              </div>
            </div>
            {video.url && (
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
              >
                <ExternalLink className="h-4 w-4" /> Open original link
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SortableVideoRow({
  video,
  index,
  onDelete,
  onPreview,
}: {
  video: VideoType;
  index: number;
  onDelete: (id: string) => void;
  onPreview: (video: VideoType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: video.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition-shadow ${
        isDragging
          ? "shadow-lg border-indigo-300 ring-1 ring-indigo-200"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Drag handle — hidden on mobile */}
      <button
        {...attributes}
        {...listeners}
        className="hidden sm:flex cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 rounded transition-colors shrink-0 touch-none"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Index */}
      <span className="hidden sm:flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
        {index + 1}
      </span>

      {/* Thumbnail placeholder */}
      <div className="flex h-10 w-10 sm:w-16 shrink-0 items-center justify-center rounded-lg bg-slate-900">
        <Play className="h-4 w-4 text-white fill-white" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{video.title}</p>
        <div className="hidden sm:flex items-center gap-3 mt-0.5">
          <span className="text-xs text-slate-400">{video.uploadedBy}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-400">{formatDate(video.createdAt)}</span>
          {video.type === "youtube" && (
            <>
              <span className="text-xs text-slate-300">·</span>
              <span className="flex items-center gap-1 text-xs text-red-500">
                <Youtube className="h-3 w-3" /> YouTube
              </span>
            </>
          )}
        </div>
        <div className="flex sm:hidden items-center gap-2 mt-0.5">
          {video.duration && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" /> {video.duration}
            </span>
          )}
          {video.type === "youtube" && (
            <span className="flex items-center gap-1 text-xs text-red-500">
              <Youtube className="h-3 w-3" /> YouTube
            </span>
          )}
        </div>
      </div>

      {/* Duration — hidden on mobile */}
      {video.duration && (
        <div className="hidden sm:flex items-center gap-1 shrink-0 text-xs text-slate-400">
          <Clock className="h-3 w-3" />
          {video.duration}
        </div>
      )}

      {/* Preview */}
      <button
        onClick={() => onPreview(video)}
        className="shrink-0 flex items-center gap-1 rounded-lg border border-slate-200 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
      >
        <Eye className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Preview</span>
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(video.id)}
        className="shrink-0 rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function VideosPage({
  params,
}: {
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { batchId } = use(params);
  const initial = mockVideos.filter((v) => v.batchId === batchId);
  const [videos, setVideos] = useState<VideoType[]>(initial);
  const [open, setOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoType | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setVideos((prev) => {
        const oldIndex = prev.findIndex((v) => v.id === active.id);
        const newIndex = prev.findIndex((v) => v.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        toast.success("Order updated");
        return reordered;
      });
    }
  };

  const handleDelete = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    toast.success("Video removed");
  };

  const handleAdd = async () => {
    if (!title.trim()) return;
    await new Promise((r) => setTimeout(r, 400));
    const newVideo: VideoType = {
      id: `vid-${Date.now()}`,
      batchId,
      title,
      url,
      type: url.includes("youtube") ? "youtube" : "upload",
      uploadedBy: "Rajesh Kumar",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setVideos((prev) => [...prev, newVideo]);
    toast.success("Video added!");
    setOpen(false);
    setTitle("");
    setUrl("");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-slate-500">
            {videos.length} video{videos.length !== 1 ? "s" : ""}
          </p>
          {videos.length > 1 && (
            <p className="text-xs text-slate-400 mt-0.5">Drag rows to reorder</p>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> Add Video
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Newton's Laws — Lecture 1"
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  YouTube / Video URL
                </label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAdd} disabled={!title.trim()}>
                  Add Video
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      {videos.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No videos yet"
          description="Add your first video for this batch."
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={videos.map((v) => v.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {videos.map((video, index) => (
                <SortableVideoRow
                  key={video.id}
                  video={video}
                  index={index}
                  onDelete={handleDelete}
                  onPreview={setPreviewVideo}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {previewVideo && (
        <VideoPreviewPanel video={previewVideo} onClose={() => setPreviewVideo(null)} />
      )}
    </div>
  );
}
