"use client";

import React from "react";

type Step1ColorsPanelProps = {
  manualColorsVisible: boolean;
  setManualColorsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  manualHexes: string[];
  setManualHexes: React.Dispatch<React.SetStateAction<string[]>>;
  normalizeHexForPreview: (hex: string, fallback: string) => string;
};

export default function Step1ColorsPanel({
  manualColorsVisible,
  setManualColorsVisible,
  manualHexes,
  setManualHexes,
  normalizeHexForPreview,
}: Step1ColorsPanelProps) {
  return (
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
        اختر مجموعة ألوان جاهزة من الخيارات أدناه — يمكنك تغييرها في أي
        وقت
      </div>

      {/* Palette cards row (matches the provided design) */}
      <div
        className="mt-5 grid grid-cols-3 items-stretch gap-3 min-[1300px]:grid-cols-5"
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
            className="w-full rounded-xl border border-white/60 bg-white/95 px-1 py-1"
          >
            <div className="flex items-center justify-center gap-[2px] dir-ltr">
              {card.colors.map((c, idx) => (
                <span
                  key={c}
                  className={`h-6 w-4 bg-opacity-100 ${idx === 1 && ""} ${idx === 0 && "rounded-r-[5px]"} ${idx === 2 && "rounded-l-[5px]"}`}
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
          <div className="text-[15px] font-bold text-[#0B5B3A]">اسم الموقع</div>
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
  );
}

