"use client";

import React from "react";
import OnboardingStep1 from "./steps/Step1";
import OnboardingStep2 from "./steps/Step2";
import OnboardingStep3 from "./steps/Step3";
import OnboardingStep4 from "./steps/Step4";

interface OnboardingStepPanelProps {
  stepIndex: number;
}

export function OnboardingStepPanel({ stepIndex }: OnboardingStepPanelProps) {
  return (
    <>
      {stepIndex === 0 && <OnboardingStep1 />}
      {stepIndex === 1 && <OnboardingStep2 />}
      {stepIndex === 2 && <OnboardingStep3 />}
      {stepIndex === 3 && <OnboardingStep4 />}
    </>
  );
}

