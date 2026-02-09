import type { Project } from "../types";

interface VideoSectionProps {
  project: Project | null;
  showVideoUrl?: boolean;
}

export const VideoSection = ({
  project,
  showVideoUrl = false,
}: VideoSectionProps) => {
  if (
    !showVideoUrl ||
    !project?.videoUrl ||
    project.videoUrl.trim() === ""
  ) {
    return null;
  }

  return (
    <section
      className="rounded-lg overflow-hidden shadow-md bg-black relative h-64"
      data-purpose="video-section"
    >
      <div className="w-full h-full rounded-lg overflow-hidden">
        <video
          controls
          className="w-full h-full object-cover"
          poster={project.image || undefined}
        >
          <source src={project.videoUrl} type="video/mp4" />
          متصفحك لا يدعم عرض الفيديو.
        </video>
      </div>
    </section>
  );
};
