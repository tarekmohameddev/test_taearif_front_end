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
    <footer className="mt-auto flex w-full items-center justify-center gap-4">
      {!isFirst && (
        <button
          type="button"
          onClick={onBack}
          className={[
            "rounded-full border px-8 py-2 text-sm transition-colors",
            "border-border bg-transparent text-foreground hover:border-muted-foreground hover:bg-foreground/5",
          ].join(" ")}
        >
          رجوع
        </button>
      )}


      <button
        type="button"
        onClick={isLast ? onFinish : onNext}
        className="rounded-full bg-foreground px-8 py-2 text-sm text-background transition-colors hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLast ? "حفظ ومتابعة" : "حفظ ومتابعة"}
      </button>


      <button
        type="button"
        onClick={onSkip}
        className="rounded-full border border-border bg-transparent px-8 py-2 text-sm text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground hover:bg-foreground/5"
      >
        تخطي 
      </button>

    </footer>
  );
}

