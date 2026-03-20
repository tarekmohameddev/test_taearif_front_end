"use client";

import React from "react";

export default function OnboardingStep5({
  onExploreDashboard,
  steps,
}: {
  onExploreDashboard: () => void;
  steps: { title: string }[];
}) {
  const completedCount = steps.length;

  return (
    <div className="w-full text-white mx-auto flex flex-col items-center justify-center gap-8 py-6">
      <div className="h-16 w-16 rounded-full bg-white/80 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0B5B3A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <div className="text-center">
        <h2 className="md:text-[48px] text-[30px] font-bold leading-tight">أحسنت! موقعك جاهز</h2>
        <p className="mt-2 md:text-[22px] text-[15px] text-white/90 px-4">
          لقد أكملت إعداد موقعك، يمكنك الآن البدء في استقبال العملاء ونشر العقارات.
        </p>
      </div>

      <div className="w-full max-w-[860px] flex flex-col gap-4">
        <div className="md:text-[22px] text-[18px] font-semibold sm:mt-0 mt-5 px-5">
          الخطوات المكتملة ({completedCount} من {steps.length})
        </div>
        <ul className="w-full space-y-4 text-[18px] md:text-[24px] sm:px-0 px-8" dir="rtl">
          {steps.map((s) => (
            <li
              key={s.title}
              className="flex w-full items-center justify-between gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-white/80"
                  aria-hidden="true"
                />
                <span>{s.title}</span>
              </div>
              <span className="shrink-0 leading-tight">تم</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onExploreDashboard}
        className="mt-2 rounded-full bg-foreground px-20 py-3 text-[16px] font-semibold text-background transition-colors hover:bg-foreground/90"
      >
        استكشف لوحة التحكم
      </button>
    </div>
  );
}

