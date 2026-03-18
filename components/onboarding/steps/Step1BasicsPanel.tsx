"use client";

import React, { useMemo, useRef } from "react";

type Step1BasicsPanelProps = {
  siteName: string;
  setSiteName: React.Dispatch<React.SetStateAction<string>>;
  logoPreviewUrl: string | null;
  setLogoPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Step1BasicsPanel({
  siteName,
  setSiteName,
  logoPreviewUrl,
  setLogoPreviewUrl,
}: Step1BasicsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fileAccept = useMemo(
    () => "image/png,image/jpeg,image/jpg,image/webp,image/svg+xml",
    [],
  );

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const onLogoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setLogoPreviewUrl(url);
  };

  return (
    <div className="w-full md:w-1/2 md:flex-none">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[20px] font-bold">اسم الموقع</div>
          <div className="text-[16px] text-white/80">
            اكتب اسم مكتبك أو شركتك هنا — هذا ما يشوفه عملاؤك أول شيء
          </div>
          <input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="مثال: مكتب الرفاعي"
            className="mt-2 w-full rounded-lg bg-white/10 border border-white/30 px-4 py-3 text-[16px] text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/60"
          />
        </div>

        <div className="flex flex-row items-baseline gap-3">
          <div className="text-[20px] font-bold">شعار الموقع</div>
          <div className="text-[16px] text-white/70 font-normal">(اختياري)</div>
        </div>

        <div className="text-[16px] text-white/80">
          الشعار هو الصورة أو الرمز اللي يمثل موقعك — يمكنك تخطيه الآن
          وتضيفه لاحقاً
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openPicker();
          }}
          className="mt-1 cursor-pointer select-none bg-white rounded-lg p-5 text-gray-400"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={fileAccept}
            className="hidden"
            onChange={onLogoChange}
          />

          <div className="flex flex-col items-center gap-2 text-center">
            <div
              className="flex items-center justify-center rounded-full bg-white/10"
              aria-hidden="true"
            >
              <svg
                className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div className="text-[14px]">
              <div>انقر لرفع الشعار</div>
              <div>PNG، JPG (موصى به: 200×200 بكسل)</div>
            </div>
          </div>

          {logoPreviewUrl && (
            <div className="mt-4 flex items-center justify-center">
              <img
                src={logoPreviewUrl}
                alt="شعار الموقع"
                className="max-h-28 w-auto rounded-md object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

