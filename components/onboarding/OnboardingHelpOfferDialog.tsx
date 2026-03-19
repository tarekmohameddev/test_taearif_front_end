"use client";

import { useEffect, useRef } from "react";
import { Headphones } from "lucide-react";

type OnboardingHelpOfferDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactWhatsApp: () => void;
};

/**
 * لوحة مساعدة ملاصقة لزر الدائرة (على يمين الزر)، بدون overlay منبثق.
 */
export function OnboardingHelpOfferDialog({
  open,
  onOpenChange,
  onContactWhatsApp,
}: OnboardingHelpOfferDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-20 left-2 z-20"
      dir="ltr"
    >
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          className="cursor-pointer rounded-full border-0 bg-transparent p-0 shadow-none transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#4F9E8E]"
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="عرض عرض المساعدة من الفريق"
        >
          <img
            src="/onboarding-test-bottom-left-circle.svg"
            alt=""
            className="pointer-events-none h-[134px] w-[134px] object-contain"
            aria-hidden
          />
        </button>

        {open ? (
          <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="onboarding-help-offer-title"
            className="absolute bottom-0 left-full z-30 ms-3 w-[300px] rounded-[2rem] border border-black/5 bg-white p-6 text-center shadow-xl dir-rtl"
            dir="rtl"
          >

            <div className="flex flex-col items-center gap-4 pt-2">
              <div
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#9FFFCB]"
                aria-hidden
              >
                <Headphones
                  className="h-9 w-9 text-[#1a1a1a]"
                  strokeWidth={1.5}
                />
              </div>

              <h2
                id="onboarding-help-offer-title"
                className="text-lg font-bold leading-snug text-black"
              >
                تبي أحد يسويّه لك؟
              </h2>

              <p className="px-1 text-[14px] leading-relaxed text-[#6b7280]">
                فريقنا يقدر يساعدك وينهي كل الإعداد عنك
              </p>

              <div className="flex items-center justify-center gap-2 text-[26px] font-bold text-black">
                <span>50</span>
                <img
                  src="/Saudi_Riyal_Symbol.svg"
                  alt=""
                  className="h-7 w-7 object-contain"
                  aria-hidden
                />
                <span>فقط</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onContactWhatsApp();
                  onOpenChange(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4F9E8E] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#458f80] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <svg
                  className="h-5 w-5 shrink-0 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <span>تواصل معنا</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
