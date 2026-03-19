"use client";

import React, { useState } from "react";
import { usePropertyFormState } from "@/components/property/property-form/hooks/usePropertyFormState";
import { useFileUpload } from "@/components/property/property-form/hooks/useFileUpload";
import { ThumbnailCard, GalleryCard, VideoCard, FloorPlansCard } from "@/components/property/property-form/components";

export default function Step3MediaPanelCollapsibleCard() {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [thumbnailOpen, setThumbnailOpen] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const [floorPlansOpen, setFloorPlansOpen] = useState(false);

  const {
    images,
    setImages,
    previews,
    setPreviews,
    video,
    setVideo,
    videoPreview,
    setVideoPreview,
    errors,
    setErrors,
    thumbnailInputRef,
    galleryInputRef,
    videoInputRef,
    floorPlansInputRef,
    uploading,
  } = usePropertyFormState("add");

  const { handleFileChange, removeImage, removeVideo } = useFileUpload(
    images as any,
    setImages as any,
    previews as any,
    setPreviews as any,
    setVideo as any,
    setVideoPreview as any,
    errors as any,
    setErrors as any,
  );

  return (
    <>
      <style jsx global>{`
        .step3-scroll-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(79, 158, 142, 0.7) transparent;
        }
        .step3-scroll-thin::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }
        .step3-scroll-thin::-webkit-scrollbar-thumb {
          background-color: rgba(79, 158, 142, 0.75);
          border-radius: 9999px;
        }
        .step3-scroll-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .step3-scroll-thin::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      <div
        className={[
          "bg-white/95 border border-white/60 py-1",
          mediaOpen ? "rounded-3xl" : "rounded-full",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setMediaOpen((v) => !v)}
          aria-expanded={mediaOpen}
          className="w-full rounded-full px-5 text-right text-[14px] text-black transition-colors"
        >
          صور وفيديو الوحدة
        </button>

        {mediaOpen && (
          <div className="mt-3 p-5 space-y-5 max-h-[30vh] overflow-y-auto step3-scroll-thin">
            <ThumbnailCard
              previews={{ thumbnail: previews.thumbnail }}
              images={{ thumbnail: images.thumbnail }}
              errors={errors}
              isDraft={false}
              missingFields={[]}
              uploading={uploading}
              isOpen={thumbnailOpen}
              setIsOpen={setThumbnailOpen}
              thumbnailInputRef={thumbnailInputRef}
              onFileChange={handleFileChange as any}
              onRemoveImage={removeImage as any}
              cardHasMissingFields={() => false}
            />

            <GalleryCard
              previews={{ gallery: previews.gallery || [] }}
              images={{ gallery: images.gallery || [] }}
              errors={errors}
              uploading={uploading}
              isOpen={galleryOpen}
              setIsOpen={setGalleryOpen}
              galleryInputRef={galleryInputRef}
              onFileChange={handleFileChange as any}
              onRemoveImage={removeImage as any}
            />

            <VideoCard
              video={video}
              videoPreview={videoPreview}
              errors={errors}
              uploading={uploading}
              isOpen={videoOpen}
              setIsOpen={setVideoOpen}
              videoInputRef={videoInputRef}
              onFileChange={handleFileChange as any}
              onRemoveVideo={removeVideo}
            />

            <FloorPlansCard
              previews={{ floorPlans: previews.floorPlans || [] }}
              images={{ floorPlans: images.floorPlans || [] }}
              uploading={uploading}
              isOpen={floorPlansOpen}
              setIsOpen={setFloorPlansOpen}
              floorPlansInputRef={floorPlansInputRef}
              onFileChange={handleFileChange as any}
              onRemoveImage={removeImage as any}
            />
          </div>
        )}
      </div>
    </>
  );
}
