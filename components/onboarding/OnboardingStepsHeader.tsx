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
  const stepsToRender = steps.slice(0, -1);
  const displayStepIndex =
    stepsToRender.length > 0
      ? Math.min(currentStepIndex, stepsToRender.length - 1)
      : -1;

  const StepIcon = ({ id }: { id: OnboardingStep["id"] }) => {
    switch (id) {
      case "step-1":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block h-8 w-8" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10" />
          </svg>
        );
      case "step-2":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block h-8 w-8" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case "step-3":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block h-8 w-8" aria-hidden="true">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 10v11h14V10" />
          </svg>
        );
      case "step-4":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block h-8 w-8" aria-hidden="true">
            <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
            <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
          </svg>
        );
      case "step-5":
        return null;
      default:
        return null;
    }
  };

  return (
    <header className="flex items-start justify-between gap-0 text-white">
      {stepsToRender.map((step, index) => {
        const isActive = index === displayStepIndex;
        const isPassedOrCurrent = index <= displayStepIndex;
        const isLast = index === stepsToRender.length - 1;

        return (
          <React.Fragment key={step.id}>
            {/* ── Step ── */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Circle */}
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-transparent"
                aria-current={isActive ? "step" : undefined}
                style={{
                  backgroundImage: `url("${isPassedOrCurrent ? activeCircleBg : inactiveCircleBg}")`,
                  backgroundPosition: "0% 0%",
                  backgroundRepeat: "no-repeat",
                  backgroundClip: "padding-box",
                }}
              >
                <div
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center",
                    isPassedOrCurrent ? "text-[#4F9E8E]" : "text-white"
                  )}
                >
                  <div
                    className={cn(
                      "absolute rounded-full p-10",
                      isPassedOrCurrent
                        ? "bg-white"
                        : "border border-white bg-white/20"
                    )}
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <StepIcon id={step.id} />
                  </div>
                  
                </div>
              </div>

              {/* Title */}
              <div className="mt-5 text-center text-[22px] font-bold leading-tight text-white">
                {step.title}
              </div>
            </div>

            {/* ── Connector lines (between steps only) ── */}
            {/* {!isLast && (
              <div className="relative z-0 flex flex-1 flex-col items-center justify-start gap-1 pt-6 ">
                <div className="h-px w-full bg-white/80" />
              </div>
            )} */}
          </React.Fragment>
        );
      })}
    </header>
  );
}