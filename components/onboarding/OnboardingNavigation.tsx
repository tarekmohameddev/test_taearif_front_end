"use client";

import React from "react";

interface OnboardingNavigationProps {
  stepIndex: number;
  stepsLength: number;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  onSkip: () => void;
  nextDisabled?: boolean;
  nextLoading?: boolean;
}

export function OnboardingNavigation({
  stepIndex,
  stepsLength,
  onBack,
  onNext,
  onFinish,
  onSkip,
  nextDisabled = false,
  nextLoading = false,
}: OnboardingNavigationProps) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === stepsLength - 1;

  return (
    <footer className="mt-auto flex w-full items-center justify-center gap-4">
      {!isFirst && (
        <button
          type="button"
          onClick={onBack}
          className={[
            "rounded-full border border-white bg-white px-8 py-2 text-sm transition-colors",
            "text-[#4F9E8E] hover:border-white hover:bg-white/90",
          ].join(" ")}
        >
          رجوع
        </button>
      )}


      <button
        type="button"
        onClick={isLast ? onFinish : onNext}
        disabled={nextDisabled || nextLoading}
        className="rounded-full bg-foreground px-20 py-2 text-sm text-background transition-colors hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {nextLoading ? "جاري الحفظ..." : "حفظ ومتابعة"}
      </button>


      <button
        type="button"
        onClick={onSkip}
        className="rounded-full border border-white bg-white px-8 py-2 text-sm text-[#4F9E8E] transition-colors hover:border-white hover:bg-white/90"
      >
        تخطي 
      </button>

    </footer>
  );
}

