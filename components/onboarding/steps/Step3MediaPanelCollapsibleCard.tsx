"use client";

import React, { useState } from "react";
import { ImageIcon, Video } from "lucide-react";

export default function Step3MediaPanelCollapsibleCard() {
  const [mediaOpen, setMediaOpen] = useState(false);

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
                <div className="text-[14px] text-black/70 mt-2 text-right">
                  قم بتحميل صورة واحدة لعرض تفاصيل الوحدة
                </div>

                <div className="mt-5 rounded-2xl border border-black/15 bg-transparent flex flex-col items-center justify-center px-4 py-3">
                  <div className="h-9 w-9 rounded-full bg-[#d8f1ea] flex items-center justify-center">
                    <ImageIcon  className="h-5 w-5 text-black" />
                  </div>

                  <div className="mt-2 text-[13px]  text-black/50">
                    رفع صورة
                  </div>

                  <div className="mt-2 text-[10px] text-black/50 text-right leading-relaxed">
                  يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى لحجم الملف هو 10 ميجابايتز.
                  </div>
                </div>
              </div>

              {/* Card 2 (placeholder) */}
              <div className="rounded-2xl border border-black/15 bg-white/95 p-6 opacity-60">
                <div className="text-[18px] font-bold text-black text-right">
                  صور الوحدة
                </div>
                <div className="text-[14px] text-black/70 mt-2 text-right">
                  (سيتم إضافة واجهة رفع الصور هنا)
                </div>
              </div>




              {/* Card 3 (video) */}
              <div>
                <div className="text-[18px] font-bold text-black text-right">
                  فيديو الوحدة
                </div>
                <div className="text-[14px] text-black/70 mt-2 text-right">
                  قم بتحميل فيديو واحد لعرض تفاصيل الوحدة
                </div>

                <div className="mt-5 rounded-2xl border border-black/15 bg-transparent flex flex-col items-center justify-center px-4 py-3">
                  <div className="h-11 w-11 rounded-full bg-[#d8f1ea] flex items-center justify-center">
                    <Video className="h-6 w-6 text-black" />
                  </div>

                  <div className="mt-3 text-[13px]  text-black/50">
                    رفع فيديو
                  </div>

                  <div className="mt-3 text-[10px] text-black/50 text-right leading-relaxed">
                    يمكنك رفع فيديو بصيغة MP4 أو MOV أو AVI. الحد الأقصى لحجم
                    الملف هو 50 ميجابايت والحد الأقصى للطول هو 5 دقائق.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

