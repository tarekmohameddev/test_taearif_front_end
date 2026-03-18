"use client";

import React, { useMemo, useRef, useState } from "react";

export default function OnboardingStep1() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [siteName, setSiteName] = useState("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [manualColorsVisible, setManualColorsVisible] = useState(false);
  const [manualHexes, setManualHexes] = useState<string[]>([
    "#5BC4C0",
    "#4CAF82",
    "#1A3C34",
  ]);

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

  const normalizeHexForPreview = (hex: string, fallback: string) => {
    const raw = hex.trim().toUpperCase();
    const withHash = raw.startsWith("#") ? raw : `#${raw}`;
    return /^#[0-9A-F]{6}$/.test(withHash) ? withHash : fallback;
  };

  return (
    <div className="w-[70%] text-white mx-auto">
      <div className="flex flex-col md:flex-row items-stretch gap-8">
        {/* Right side (desktop): content */}
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
              <div className="text-[16px] text-white/70 font-normal">
                (اختياري)
              </div>
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

        {/* Divider (desktop only) */}
        <div className="hidden md:block w-px bg-white/100" aria-hidden="true" />

        {/* Left side (desktop): title only */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[20px] font-bold">ألوان الموقع</div>

            <button
              type="button"
              onClick={() => setManualColorsVisible((v) => !v)}
              className="flex w-[142px] items-center justify-center rounded-full font-bold bg-[#9FFFCB] px-0 py-2 text-sm  text-black transition-colors hover:bg-[#8CFDB4]"
            >
              {manualColorsVisible ? "إخفاء" : "تخصيص يدوي"}
            </button>
          </div>

          <div className="mt-3 text-[16px] text-white/80">
            اختر مجموعة ألوان جاهزة من الخيارات أدناه — يمكنك تغييرها في أي وقت
          </div>

          {/* Palette cards row (matches the provided design) */}
          <div
            className="mt-5 flex flex-nowrap items-stretch gap-3 overflow-x-auto"
            dir="rtl"
          >
            {[
              {
                colors: ["#C9C9CC", "#6D7482", "#0B2230"],
                label: "ملائم أنيق",
              },
              {
                colors: ["#F4A5A4", "#C8732F", "#6B2B1F"],
                label: "روقان خاص",
              },
              {
                colors: ["#B8A5FF", "#6B2BCF", "#2B2B7A"],
                label: "بسيط ملكي",
              },
              {
                colors: ["#7CC9EE", "#4C7C8C", "#1D3E66"],
                label: "أرتق الطبيعة",
              },
              {
                colors: ["#6FE1C5", "#46B56F", "#1B4A35"],
                label: "قصور البادية",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="w-fit rounded-xl border border-white/60 bg-white/95 px-1 py-1"
              >
                <div className="flex items-center justify-center gap-1 dir-ltr">
                  {card.colors.map((c) => (
                    <span
                      key={c}
                      className="h-6 w-4 rounded-[5px] bg-opacity-100"
                      style={{ backgroundColor: c }}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <div
                  className="mt-1 text-center text-[11px] font-normal text-[#0B5B3A]/80 whitespace-nowrap"
                  dir="rtl"
                >
                  {card.label}
                </div>
              </div>
            ))}
          </div>



          <div className="mt-5 h-px w-full bg-white" />  
          {/* التخصيص اليدوي */}
          {manualColorsVisible && (
            <>
              <div className="mt-5 dir-ltr flex items-center gap-1">
                {manualHexes.map((hex, idx) => {
                  const fallback =
                    ["#5BC4C0", "#4CAF82", "#1A3C34"][idx] ?? "#000000";
                  const previewColor = normalizeHexForPreview(hex, fallback);

                  return (
                    <div
                      // Key must be stable so React doesn't remount the input while typing.
                      key={idx}
                      className="flex h-[38px] w-[150px] flex-row-reverse items-center justify-center gap-4"
                    >
                    
                      {/* Hex input on the left */}
                      <input
                        type="text"
                        value={hex}
                        onChange={(e) => {
                          const next = e.target.value;
                          setManualHexes((prev) =>
                            prev.map((v, i) => (i === idx ? next : v)),
                          );
                        }}
                        dir="ltr"
                        inputMode="text"
                        placeholder={fallback}
                        className="w-[70px] rounded-full border border-white bg-white  py-2 text-center text-[11px] font-semibold text-[#0B5B3A] outline-none placeholder:text-[#0B5B3A]/50"

                      />
                      {/* Color square on the right */}
                      <span
                        className="inline-block h-8 w-8 flex-shrink-0 rounded-lg"
                        style={{ backgroundColor: previewColor }}
                        aria-hidden="true"
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}







          {/* معاينة الالوان */}
          <div
            className="mt-5 w-full dir-ltr flex items-center justify-between gap-4 rounded-[20px] border border-white/70 bg-white/90 px-8 py-5"
            dir="ltr"
          >
            {/* Small palette dots (left side) */}
            <div className="flex items-center gap-1">
              <span
                className="h-6 w-6 rounded-full bg-[#72D0C0]"
                aria-hidden="true"
              />
              <span
                className="h-6 w-6 rounded-full bg-[#55C78A]"
                aria-hidden="true"
              />
              <span
                className="h-6 w-6 rounded-full bg-[#1E4F3F]"
                aria-hidden="true"
              />
            </div>

            {/* Text (center/right side, keep Arabic RTL) */}
            <div className="flex-1" dir="rtl">
              <div className="text-[15px] font-bold text-[#0B5B3A]">
                اسم الموقع
              </div>
              <div className="text-[14px] font-normal text-[#0B5B3A]/70">
                معالجة الألوان
              </div>
            </div>

            {/* Big dot (right side) */}
            <div
              className="h-12 w-12 rounded-full bg-[#1E4F3F]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
