"use client";

import React from "react";
import type { OnboardingStep } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

interface OnboardingStepsHeaderProps {
  steps: readonly OnboardingStep[];
  currentStepIndex: number;
}

export function OnboardingStepsHeader({
  steps,
  currentStepIndex,
}: OnboardingStepsHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        return (
          <div key={step.id} className="flex-1 text-center">
            <div
              className={cn(
                "mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-sm",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-transparent text-muted-foreground",
              )}
              aria-current={isActive ? "step" : undefined}
            >
              {index + 1}
            </div>
            <div className={cn("mt-2 text-xs", isActive ? "text-foreground" : "text-muted-foreground")}>
              {step.title}
            </div>
          </div>
        );
      })}
    </header>
  );
}

