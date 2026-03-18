"use client";

import React, { useState } from "react";

export default function Step2ColorsPanel() {
  const [commonTimesOpen, setCommonTimesOpen] = useState(false);

  return (
    <div className="w-full md:w-1/2">
      <div className="flex flex-col gap-1">
          <div className="text-[20px] font-bold">ساعات العمل</div> {/* i want to translate this to arabic */}
          <div className="text-[16px] text-white/80">
          متى تكون متاحاً للرد على عملاؤك؟
          </div>
          <input
            placeholder="مثال: السبت - الخميس: 9 صباحاً - 6 مساءً"
            className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-white placeholder:gray-500 outline-none focus:ring-2 focus:ring-white/60"
          />
        </div>

        <div
          role="button"
          tabIndex={0}
          className="mt-3 w-full cursor-pointer text-right text-[20px] font-semibold text-white decoration-white/80 underline-offset-4 hover:decoration-white/100"
          onClick={() => setCommonTimesOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setCommonTimesOpen((v) => !v);
            }
          }}
        >
          اختر من الأوقات الشائعة{" "}
          <span
            className="text-white/80 inline-flex items-center transition-transform duration-200"
            dir="ltr"
            style={{
              transform: commonTimesOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
            aria-hidden="true"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
    </div>
  );
}

