"use client";

import React, { type ReactNode } from "react";
import OnboardingStep1 from "./steps/Step1";
import OnboardingStep2 from "./steps/Step2";
import OnboardingStep3 from "./steps/Step3";
import OnboardingStep4 from "./steps/Step4";

interface OnboardingStepPanelProps {
  stepIndex: number;
  children?: ReactNode;
  step3ActiveTab?: "sites" | "new";
  step1Props: React.ComponentProps<typeof OnboardingStep1>;
}

export function OnboardingStepPanel({
  stepIndex,
  children,
  step3ActiveTab = "sites",
  step1Props,
}: OnboardingStepPanelProps) {
  return (
    <div className="flex flex-col flex-1 gap-10 ">
      <div className="flex-1">
        {stepIndex === 0 && <OnboardingStep1 {...step1Props} />}
        {stepIndex === 1 && <OnboardingStep2 />}
        {stepIndex === 2 && <OnboardingStep3 activeTab={step3ActiveTab} />}
        {stepIndex === 3 && <OnboardingStep4 />}
      </div>
      {children}
    </div>
  );
}

