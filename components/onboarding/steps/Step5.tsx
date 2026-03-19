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
        <h2 className="text-[48px] font-bold leading-tight">أحسنت! موقعك جاهز</h2>
        <p className="mt-2 text-[22px] text-white/90">
          لقد أكملت إعداد موقعك، يمكنك الآن البدء في استقبال العملاء ونشر العقارات.
        </p>
      </div>

      <div className="w-full max-w-[860px] grid grid-cols-1 md:grid-cols-2 gap-10 items-start" >
        
        <div className="flex flex-col items-start gap-4">
          <div className="text-[22px] font-semibold">
            الخطوات المكتملة ({completedCount} من {steps.length})
          </div>
          <ul className="space-y-4 text-[24px]">
            {steps.map((s) => (
              <li key={s.title} className="flex items-center gap-3 justify-start">
                <span className="h-2 w-2 rounded-full bg-white/80" aria-hidden="true" />
                <span>{s.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-end gap-4 mt-[50px]">
          {steps.map((s) => (
            <div key={s.title} className="text-[24px] leading-tight">
              تم
            </div>
          ))}
        </div>
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

