"use client";

import React, { useEffect, useRef, useState } from "react";
import { ImageIcon, Video } from "lucide-react";

export default function Step3MediaPanelCollapsibleCard() {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState<string[]>([]);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const floorPlansInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  const appendImagePreviews = (files: FileList | null, maxItems = 10) => {
    if (!files || files.length === 0) return [] as string[];
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    return imageFiles.slice(0, maxItems).map((file) => URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
      floorPlanPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [thumbnailPreview, galleryPreviews, floorPlanPreviews]);

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
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <div>
                <div className="text-[18px] font-bold text-black text-right">
                  صورة الوحدة الرئيسية <span className="text-red-500">*</span>
                </div>
                <div className="text-[12px] text-black/60 mt-1 text-right">
                  قم بتحميل صورة واحدة لعرض تفاصيل الوحدة
                </div>

                <div
                  className="mt-5 rounded-2xl border border-black/15 bg-transparent flex flex-col items-center justify-center px-4 py-3 cursor-pointer"
                  onClick={() => openFilePicker(thumbnailInputRef)}
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="معاينة صورة الوحدة الرئيسية"
                      className="w-full h-36 object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <div className="h-9 w-9 rounded-full bg-[#d8f1ea] flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-black" />
                      </div>

                      <div className="mt-2 text-[13px]  text-black/50">
                        رفع صورة
                      </div>

                      <div className="mt-2 text-[10px] text-black/40 text-right leading-relaxed">
                        يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم الملف هو
                        10 ميجابايتز.
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
                      setThumbnailPreview(URL.createObjectURL(file));
                    }
                    // Keep picker reusable even when selecting same file repeatedly.
                    e.currentTarget.value = "";
                  }}
                />
              </div>  

              {/* Card 2 */}
              <div>
                <div className="text-[18px] font-bold text-black text-right">
                  معرض صور الوحدة
                </div>
                <div className="text-[12px] text-black/60 mt-1 text-right">
                  قم بتحميل صور متعددة لعرض تفاصيل الوحدة
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {galleryPreviews.map((preview, index) => (
                    <div
                      key={`gallery-${index}`}
                      className="rounded-2xl border border-black/15 bg-transparent w-16 h-16 overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt={`معاينة معرض الصور ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {galleryPreviews.length < 10 && (
                    <div
                      className="rounded-2xl border border-black/15 bg-transparent flex flex-col items-center justify-center px-1 py-1 w-16 h-16 cursor-pointer"
                      onClick={() => openFilePicker(galleryInputRef)}
                    >
                      <div className="h-8 w-8 rounded-full bg-[#d8f1ea] flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-black" />
                      </div>
                      <div className="mt-1 text-[11px] text-black/50">إضافة</div>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[10px] text-black/40 text-right leading-relaxed">
                  يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم الملف هو 10
                  ميجابايتز.
                </div>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const newPreviews = appendImagePreviews(e.target.files, 10);
                    if (newPreviews.length > 0) {
                      setGalleryPreviews((prev) => [
                        ...prev,
                        ...newPreviews.slice(0, Math.max(0, 10 - prev.length)),
                      ]);
                    }
                    e.currentTarget.value = "";
                  }}
                />
              </div>

              {/* Card 3 (video) */}
              <div>
                <div className="text-[18px] font-bold text-black text-right">
                  فيديو الوحدة
                </div>
                <div className="text-[12px] text-black/60 mt-1 text-right">
                قم بتحميل فيديو واحد لعرض تفاصيل الوحدة
                </div>

                <div
                  className="mt-5 rounded-2xl border border-black/15 bg-transparent flex flex-col items-center justify-center px-4 py-3 cursor-pointer"
                  onClick={() => openFilePicker(videoInputRef)}
                >
                  <div className="h-11 w-11 rounded-full bg-[#d8f1ea] flex items-center justify-center">
                    <Video className="h-6 w-6 text-black" />
                  </div>

                  <div className="mt-3 text-[13px]  text-black/50">
                    رفع فيديو
                  </div>

                  <div className="mt-3 text-[10px] text-black/40 text-right leading-relaxed">
                    يمكنك رفع فيديو بصيغة MP4 أو MOV أو AVI. الحد الأقصى لحجم
                    الملف هو 50 ميجابايت والحد الأقصى للطول هو 5 دقائق.
                  </div>
                </div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    e.currentTarget.value = "";
                  }}
                />
              </div>

                            {/* Card 4 */}
              <div>
                <div className="text-[18px] font-bold text-black text-right">
                  مخططات الوحدة
                </div>
                <div className="text-[12px] text-black/60 mt-1 text-right">
                قم بتحميل مخططات الطوابق والتصاميم الهندسية للوحدة
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {floorPlanPreviews.map((preview, index) => (
                    <div
                      key={`floor-plan-${index}`}
                      className="rounded-2xl border border-black/15 bg-transparent w-16 h-16 overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt={`معاينة مخطط الوحدة ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {floorPlanPreviews.length < 10 && (
                    <div
                      className="rounded-2xl border border-black/15 bg-transparent flex flex-col items-center justify-center px-1 py-1 w-16 h-16 cursor-pointer"
                      onClick={() => openFilePicker(floorPlansInputRef)}
                    >
                      <div className="h-8 w-8 rounded-full bg-[#d8f1ea] flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-black" />
                      </div>
                      <div className="mt-1 text-[11px] text-black/50">إضافة</div>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[10px] text-black/40 text-right leading-relaxed">
                  يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم الملف هو 10
                  ميجابايتز.
                </div>
                <input
                  ref={floorPlansInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const newPreviews = appendImagePreviews(e.target.files, 10);
                    if (newPreviews.length > 0) {
                      setFloorPlanPreviews((prev) => [
                        ...prev,
                        ...newPreviews.slice(0, Math.max(0, 10 - prev.length)),
                      ]);
                    }
                    e.currentTarget.value = "";
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}