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
  const activeCircleBg = "/img/Group%20409.png";
  const inactiveCircleBg = "/img/Group%20420.png";

  return (
    <header className="flex items-start justify-between gap-3 text-white">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isPassedOrCurrent = index <= currentStepIndex;
        return (
          <div key={step.id} className="flex-1 text-center">
            <div
              className={cn(
                "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm",
                // Keep text readable over the background images.
                isPassedOrCurrent ? "bg-transparent text-white" : "bg-transparent text-white",
              )}
              aria-current={isActive ? "step" : undefined}
              style={{
                backgroundColor: "transparent",
                backgroundImage: `url("${isPassedOrCurrent ? activeCircleBg : inactiveCircleBg}")`,
                backgroundPosition: "0% 0%",
                backgroundRepeat: "no-repeat",
                // Match the CSS shorthand "padding-box" behavior.
                backgroundClip: "padding-box",
                opacity: 1,
              }}
            >
              {index + 1}
            </div>
            <div className={cn("mt-2 text-xs", isActive ? "text-white" : "text-white")}>
              {step.title}
            </div>
          </div>
        );
      })}
    </header>
  );
}

