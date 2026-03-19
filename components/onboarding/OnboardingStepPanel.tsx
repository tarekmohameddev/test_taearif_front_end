"use client";

import React, { type ReactNode } from "react";
import OnboardingStep1 from "./steps/Step1";
import OnboardingStep2, { type OnboardingStep2Props } from "./steps/Step2";
import OnboardingStep3 from "./steps/Step3";
import OnboardingStep4 from "./steps/Step4";

interface OnboardingStepPanelProps {
  stepIndex: number;
  children?: ReactNode;
  step3ActiveTab?: "sites" | "new";
  step1Props: React.ComponentProps<typeof OnboardingStep1>;
  step2Props: OnboardingStep2Props;
}

export function OnboardingStepPanel({
  stepIndex,
  children,
  step3ActiveTab = "sites",
  step1Props,
  step2Props,
}: OnboardingStepPanelProps) {
  return (
    <div className="flex flex-col flex-1 gap-10 ">
      <div className="flex-1">
        {stepIndex === 0 && <OnboardingStep1 {...step1Props} />}
        {stepIndex === 1 && <OnboardingStep2 {...step2Props} />}
        {stepIndex === 2 && <OnboardingStep3 activeTab={step3ActiveTab} />}
        {stepIndex === 3 && <OnboardingStep4 />}
      </div>
      {children}
    </div>
  );
}

