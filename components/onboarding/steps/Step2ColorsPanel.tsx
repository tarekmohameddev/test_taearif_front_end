"use client";

import React, { useMemo, useRef, useState } from "react";

export type Step2ColorsPanelProps = {
  workingHours: string;
  setWorkingHours: React.Dispatch<React.SetStateAction<string>>;
  valLicense: string;
  setValLicense: React.Dispatch<React.SetStateAction<string>>;
  faviconPreviewUrl: string | null;
  setFaviconPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setFaviconFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function Step2ColorsPanel({
  workingHours,
  setWorkingHours,
  valLicense,
  setValLicense,
  faviconPreviewUrl,
  setFaviconPreviewUrl,
  setFaviconFile,
}: Step2ColorsPanelProps) {
  const [commonTimesOpen, setCommonTimesOpen] = useState(false);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const fileAccept = useMemo(
    () => "image/png,image/jpeg,image/jpg,image/webp,image/x-icon,image/vnd.microsoft.icon,.ico",
    [],
  );

  const openFaviconPicker = () => faviconInputRef.current?.click();

  const onFaviconChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconFile(file);
    setFaviconPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    e.target.value = "";
  };

  const commonTimeBadges = [
    "السبت - الخميس: 9 ص - 6 م",
    "السبت - الجمعة: 8 ص - 10 م",
    "يومياً: 9 ص - 9 م",
    "الأحد - الخميس: 8 ص - 5 م",
  ];

  return (
    <div className="w-full md:w-1/2">
      <div className="flex flex-col gap-1">
        <div className="text-[20px] font-bold">ساعات العمل</div>
        <div className="text-[16px] text-white/80">متى تكون متاحاً للرد على عملاؤك؟</div>
        <input
          value={workingHours}
          onChange={(e) => setWorkingHours(e.target.value)}
          placeholder="مثال: السبت - الخميس: 9 صباحاً - 6 مساءً"
          className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-black placeholder:gray-500 outline-none focus:ring-2 focus:ring-white/60"
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

      {commonTimesOpen && (
        <div className="mt-4 grid grid-cols-2 gap-3" dir="rtl">
          {commonTimeBadges.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setWorkingHours(t);
                setCommonTimesOpen(false);
              }}
              className="rounded-full border border-white/60 bg-white/95 px-3 py-2 text-[13px] text-black hover:bg-white/100 hover:border-white/80 transition-colors text-right whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1 mt-6">
        <div className="text-[20px] font-bold">رقم رخصة فال</div>
        <div className="text-[16px] text-white/80">اختياري — إن وُجد</div>
        <input
          value={valLicense}
          onChange={(e) => setValLicense(e.target.value)}
          placeholder="مثال: 1234567890"
          className="mt-2 w-full rounded-full bg-white border border-white/30 px-4 py-3 text-[16px] text-black placeholder:black outline-none focus:ring-2 focus:ring-white/60"
        />
      </div>

      <div className="flex flex-col gap-1 mt-6">
        <div className="flex flex-row items-baseline gap-3">
          <div className="text-[20px] font-bold">أيقونة الموقع (favicon)</div>
          <div className="text-[16px] text-white/70 font-normal">(اختياري)</div>
        </div>
        <div className="text-[16px] text-white/80">صورة صغيرة تظهر في تبويب المتصفح</div>

        <div
          role="button"
          tabIndex={0}
          onClick={openFaviconPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openFaviconPicker();
          }}
          className="mt-1 cursor-pointer select-none bg-white rounded-2xl p-4 text-gray-500 max-w-sm"
        >
          <input
            ref={faviconInputRef}
            type="file"
            accept={fileAccept}
            className="hidden"
            onChange={onFaviconChange}
          />
          {!faviconPreviewUrl && (
            <div className="text-center text-[14px]">انقر لرفع الأيقونة (PNG أو ICO)</div>
          )}
          {faviconPreviewUrl && (
            <div className="flex items-center justify-center">
              <img
                src={faviconPreviewUrl}
                alt="أيقونة الموقع"
                className="max-h-12 w-auto rounded object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
