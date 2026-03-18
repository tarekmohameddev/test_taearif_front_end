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

  const StepIcon = ({ id }: { id: OnboardingStep["id"] }) => {
    switch (id) {
      case "step-1":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block h-8 w-8"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10" />
          </svg>
        );
      case "step-2":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block h-8 w-8"
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case "step-3":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block h-8 w-8"
            aria-hidden="true"
          >
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 10v11h14V10" />
          </svg>
        );
      case "step-4":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block h-8 w-8"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
            <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <header className="flex items-start justify-between gap-3 text-white">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isPassedOrCurrent = index <= currentStepIndex;
        return (
          <div key={step.id} className="flex-1 text-center">
            <div
              className={cn(
                "mx-auto flex h-12 w-12 items-center justify-center rounded-full",
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
              <div
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center",
                  isPassedOrCurrent ? "text-[#4F9E8E]" : "text-white",
                )}
              >
                <div
                  className={cn(
                    "absolute rounded-full p-10",
                    isPassedOrCurrent ? "bg-white" : "border border-white bg-white/20",
                  )}
                  aria-hidden="true"
                />
                <div className="relative">
                  <StepIcon id={step.id} />
                </div>
              </div>
            </div>
            <div
              className={cn(
                "mt-5 text-[22px] font-bold leading-tight",
                isActive ? "text-white" : "text-white",
              )}
            >
              {step.title}
            </div>
          </div>
        );
      })}
    </header>
  );
}

