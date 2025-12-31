"use client";

import { useEffect, useMemo } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultVideoData } from "@/context-liveeditor/editorStoreFunctions/videoFunctions";

// ═══════════════════════════════════════════════════════════
// VIDEO SOURCE DETECTION UTILITIES
// ═══════════════════════════════════════════════════════════

type VideoSource = "youtube" | "vimeo" | "direct";

interface VideoInfo {
  source: VideoSource;
  videoId?: string;
  embedUrl?: string;
}

/**
 * Detect video source and extract video ID from URL
 */
const detectVideoSource = (url: string): VideoInfo => {
  if (!url || typeof url !== "string") {
    return { source: "direct" };
  }

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return {
        source: "youtube",
        videoId: match[1],
        embedUrl: `https://www.youtube.com/embed/${match[1]}`,
      };
    }
  }

  // Vimeo patterns
  const vimeoPatterns = [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/video\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];

  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return {
        source: "vimeo",
        videoId: match[1],
        embedUrl: `https://player.vimeo.com/video/${match[1]}`,
      };
    }
  }

  // Direct video URL (MP4, WebM, etc.)
  return { source: "direct" };
};

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface VideoProps {
  visible?: boolean;
  video?: {
    src?: string;
    poster?: string;
    title?: string;
    description?: string;
    type?: string;
  };
  playback?: {
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    playsInline?: boolean;
  };
  layout?: {
    aspectRatio?: string;
  };
  styling?: {
    borderRadius?: string;
    shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
    backgroundColor?: string;
    overlay?: {
      enabled?: boolean;
      color?: string;
    };
  };

  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function Video1(props: VideoProps = {}) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "video1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const videoStates = useEditorStore((s) => s.videoStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  const getTenantComponentData = () => {
    if (!tenantData) return {};

    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "video" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    if (tenantData?.componentSettings) {
      for (const [, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [, component] of Object.entries(pageComponents as any)) {
            if (
              (component as any).type === "video" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (props.useStore) {
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? { ...getDefaultVideoData(), ...tenantComponentData, ...props }
          : { ...getDefaultVideoData(), ...props };

      ensureComponentVariant("video", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = videoStates[uniqueId];
  const currentStoreData = getComponentData("video", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultVideoData(),
    ...storeData,
    ...currentStoreData,
    ...props,
  };

  const aspectRatioValue = mergedData.layout?.aspectRatio || "16:9";
  const aspectRatioCss = aspectRatioValue.includes(":")
    ? aspectRatioValue.replace(":", " / ")
    : aspectRatioValue;

  // ─────────────────────────────────────────────────────────
  // 6. DETECT VIDEO SOURCE
  // ─────────────────────────────────────────────────────────
  const videoInfo = useMemo(() => {
    const videoUrl = mergedData.video?.src || "";
    return detectVideoSource(videoUrl);
  }, [mergedData.video?.src]);

  // ─────────────────────────────────────────────────────────
  // 7. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 8. RENDER
  // ─────────────────────────────────────────────────────────
  const shadowClasses: Record<string, string> = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  };

  // Build iframe parameters for YouTube
  const getYouTubeParams = () => {
    const params = new URLSearchParams();
    if (mergedData.playback?.autoplay) params.append("autoplay", "1");
    if (mergedData.playback?.muted) params.append("mute", "1");
    if (mergedData.playback?.loop) {
      params.append("loop", "1");
      params.append("playlist", videoInfo.videoId || "");
    }
    if (!mergedData.playback?.controls) params.append("controls", "0");
    params.append(
      "playsinline",
      mergedData.playback?.playsInline !== false ? "1" : "0",
    );
    return params.toString();
  };

  // Build iframe parameters for Vimeo
  const getVimeoParams = () => {
    const params = new URLSearchParams();
    if (mergedData.playback?.autoplay) params.append("autoplay", "1");
    if (mergedData.playback?.muted) params.append("muted", "1");
    if (mergedData.playback?.loop) params.append("loop", "1");
    if (!mergedData.playback?.controls) params.append("controls", "0");
    return params.toString();
  };

  return (
    <section className="video-section" style={{ width: "100%" }}>
      <div
        className={`relative w-full overflow-hidden mx-auto ${shadowClasses[mergedData.styling?.shadow || "lg"]}`}
        style={{
          width: "100%",
          maxWidth: "60%", // Mobile: full width
          backgroundColor: mergedData.styling?.backgroundColor || "#000000",
          borderRadius: mergedData.styling?.borderRadius || "12px",
          aspectRatio: aspectRatioCss,
        }}
      >
        <style jsx>{`
          .video-section > div {
            width: 100%;
            max-width: 100%;
          }

          /* Tablet: 768px and up */
          @media (min-width: 768px) {
            .video-section > div {
              max-width: 90%;
            }
          }

          /* Desktop: 1024px and up */
          @media (min-width: 1024px) {
            .video-section > div {
              max-width: 85%;
            }
          }

          /* Large Desktop: 1280px and up */
          @media (min-width: 1280px) {
            .video-section > div {
              max-width: 80%;
            }
          }

          /* Extra Large Desktop: 1536px and up */
          @media (min-width: 1536px) {
            .video-section > div {
              max-width: 75%;
            }
          }
        `}</style>
        {mergedData.styling?.overlay?.enabled && (
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                mergedData.styling.overlay.color || "rgba(0,0,0,0.35)",
              borderRadius: mergedData.styling.borderRadius || "12px",
            }}
          />
        )}

        {/* YouTube Embed */}
        {videoInfo.source === "youtube" && videoInfo.embedUrl && (
          <iframe
            src={`${videoInfo.embedUrl}?${getYouTubeParams()}`}
            className="absolute inset-0 w-full h-full"
            style={{
              border: "none",
              borderRadius: mergedData.styling?.borderRadius || "12px",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={mergedData.video?.title || "Video"}
          />
        )}

        {/* Vimeo Embed */}
        {videoInfo.source === "vimeo" && videoInfo.embedUrl && (
          <iframe
            src={`${videoInfo.embedUrl}?${getVimeoParams()}`}
            className="absolute inset-0 w-full h-full"
            style={{
              border: "none",
              borderRadius: mergedData.styling?.borderRadius || "12px",
            }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={mergedData.video?.title || "Video"}
          />
        )}

        {/* Direct Video (MP4, WebM, etc.) */}
        {videoInfo.source === "direct" && mergedData.video?.src && (
          <video
            className="w-full h-full object-cover"
            style={{
              display: "block",
              borderRadius: mergedData.styling?.borderRadius || "12px",
              maxWidth: "100%", // Ensure width is constrained and not editable
            }}
            autoPlay={mergedData.playback?.autoplay || false}
            loop={mergedData.playback?.loop || false}
            muted={mergedData.playback?.muted || false}
            controls={mergedData.playback?.controls !== false}
            playsInline={mergedData.playback?.playsInline !== false}
            poster={mergedData.video?.poster || undefined}
          >
            <source src={mergedData.video.src} />
            Your browser does not support the video tag.
          </video>
        )}

        {/* No video source message */}
        {!mergedData.video?.src && (
          <div
            className="absolute inset-0 flex items-center justify-center text-gray-400"
            style={{
              backgroundColor: mergedData.styling?.backgroundColor || "#000000",
              borderRadius: mergedData.styling?.borderRadius || "12px",
            }}
          >
            <p>يرجى إضافة رابط فيديو من YouTube أو Vimeo</p>
          </div>
        )}

        {/* Title and Description Overlay */}
        {(mergedData.video?.title || mergedData.video?.description) && (
          <div className="absolute inset-x-0 bottom-0 z-20 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
            {mergedData.video?.title && (
              <h3 className="text-lg font-semibold">
                {mergedData.video.title}
              </h3>
            )}
            {mergedData.video?.description && (
              <p className="text-sm opacity-90 mt-1">
                {mergedData.video.description}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
