import { Video, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { mockVideos } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default async function StudentVideosPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const videos = mockVideos.filter((v) => v.batchId === batchId);

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900 mb-4">Lecture Videos</h3>
      {videos.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No videos yet"
          description="Videos uploaded by your teacher will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden group cursor-pointer">
              <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play className="h-5 w-5 text-white fill-white" />
                </div>
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                )}
              </div>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-slate-900">{video.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uploaded {formatDate(video.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
