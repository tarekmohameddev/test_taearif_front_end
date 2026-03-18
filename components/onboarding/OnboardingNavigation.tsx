"use client";

import React from "react";

interface OnboardingNavigationProps {
  stepIndex: number;
  stepsLength: number;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  onSkip: () => void;
}

export function OnboardingNavigation({
  stepIndex,
  stepsLength,
  onBack,
  onNext,
  onFinish,
  onSkip,
}: OnboardingNavigationProps) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === stepsLength - 1;

  return (
    <footer className="mt-6 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirst}
        className={[
          "rounded-md border px-4 py-2 text-sm transition-colors",
          isFirst
            ? "cursor-not-allowed border-border/60 bg-transparent text-muted-foreground/70"
            : "border-border bg-transparent text-foreground hover:border-muted-foreground",
        ].join(" ")}
      >
        رجوع
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          تخطي الإعداد
        </button>

        <button
          type="button"
          onClick={isLast ? onFinish : onNext}
          className="rounded-md bg-foreground px-5 py-2 text-sm text-background transition-colors hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLast ? "ابدأ" : "التالي"}
        </button>
      </div>
    </footer>
  );
}

