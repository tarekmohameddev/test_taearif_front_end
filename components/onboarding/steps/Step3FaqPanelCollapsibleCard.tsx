"use client";

import React, { useState } from "react";

export default function Step3FaqPanelCollapsibleCard() {
  const [faqOpen, setFaqOpen] = useState(false);

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
          "bg-white/95 border border-white/60 py-1 mt-4",
          faqOpen ? "rounded-3xl" : "rounded-full",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setFaqOpen((v) => !v)}
          aria-expanded={faqOpen}
          className="w-full rounded-full px-5 text-right transition-colors"
        >
          <div className="flex flex-col items-start py-2">
            <span className="text-[14px] text-black text-right">الأسئلة الشائعة الخاصة بالوحدة</span>
        {faqOpen && (
            <span className="text-[12px] text-black/60 text-right">
              أضف أسئلة وأجوبة شائعة حول هذه الوحدة لمساعدة المشترين المحتملين
            </span>
        )}
        </div>
        </button>

        {faqOpen && (
          <div className="mt-3 p-5 space-y-5 max-h-[30vh] overflow-y-auto step3-scroll-thin">
            
            <div className="min-h-[20px]" aria-hidden="true" />
          </div>
        )}
      </div>
    </>
  );
}

