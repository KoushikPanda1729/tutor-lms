"use client";

import { useState, use } from "react";
import { Video, Play, Clock, Youtube, Eye, X, ExternalLink, GripVertical } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { mockVideos } from "@/lib/mock-data";
import { BatchTabBar } from "@/components/student/batch-tab-bar";
import { formatDate } from "@/lib/utils";
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
  const ytMatch = video.url?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const ytId = ytMatch?.[1];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{video.title}</h3>
            <div className="flex items-center gap-3 mt-0.5">
              {video.uploadedBy && (
                <span className="text-xs text-slate-500">{video.uploadedBy}</span>
              )}
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
          {/* Video player */}
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

          {/* Details */}
          <div className="p-5 space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">{video.title}</h4>
              {video.description && <p className="text-sm text-slate-500">{video.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {video.uploadedBy && (
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Uploaded by</p>
                  <p className="font-semibold text-slate-800">{video.uploadedBy}</p>
                </div>
              )}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Duration</p>
                <p className="font-semibold text-slate-800">{video.duration || "—"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Type</p>
                <p className="font-semibold text-slate-800 capitalize">{video.type}</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Added on</p>
                <p className="font-semibold text-slate-800">{formatDate(video.createdAt)}</p>
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
  onPreview,
}: {
  video: VideoType;
  index: number;
  onPreview: (v: VideoType) => void;
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
      className={`flex items-center gap-2.5 rounded-2xl border bg-white px-3 py-3 shadow-sm transition-all ${
        isDragging
          ? "shadow-lg border-indigo-300 ring-1 ring-indigo-200"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 rounded transition-colors shrink-0 touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Index */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
        {index + 1}
      </span>

      {/* Thumbnail */}
      <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-900">
        <Play className="h-4 w-4 text-white fill-white" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900 truncate">{video.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {video.duration && (
            <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
              <Clock className="h-3 w-3 shrink-0" />
              {video.duration}
            </span>
          )}
          {video.type === "youtube" && (
            <span className="flex items-center gap-0.5 text-[11px] text-red-500">
              <Youtube className="h-3 w-3 shrink-0" />
              YT
            </span>
          )}
        </div>
      </div>

      {/* Watch button */}
      <button
        onClick={() => onPreview(video)}
        className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
      >
        <Eye className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function StudentVideosPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = use(params);
  const initial = mockVideos.filter((v) => v.batchId === batchId);
  const [videos, setVideos] = useState<VideoType[]>(initial);
  const [previewVideo, setPreviewVideo] = useState<VideoType | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setVideos((prev) => {
        const oldIndex = prev.findIndex((v) => v.id === active.id);
        const newIndex = prev.findIndex((v) => v.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-4">
      <BatchTabBar batchId={batchId} active="videos" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Lecture Videos</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {videos.length} video{videos.length !== 1 ? "s" : ""} · drag to reorder
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-lg">
          <GripVertical className="h-3 w-3" /> Drag to reorder
        </div>
      </div>

      {videos.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No videos yet"
          description="Videos uploaded by your teacher will appear here."
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={videos.map((v) => v.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5">
              {videos.map((video, index) => (
                <SortableVideoRow
                  key={video.id}
                  video={video}
                  index={index}
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
