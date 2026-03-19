"use client";

import React from "react";
import Step2BasicsPanel, { type Step2BasicsPanelProps } from "./Step2BasicsPanel";
import Step2ColorsPanel from "./Step2ColorsPanel";

export type OnboardingStep2Props = Step2BasicsPanelProps & {
  workingHours: string;
  setWorkingHours: React.Dispatch<React.SetStateAction<string>>;
};

export default function OnboardingStep2({
  workingHours,
  setWorkingHours,
  ...basicsProps
}: OnboardingStep2Props) {
  return (
    <div className="w-[90%] text-white mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <Step2BasicsPanel {...basicsProps} />

        <div className="hidden md:block self-stretch min-h-[240px] w-[1px] bg-white/50 shrink-0" />

        <Step2ColorsPanel workingHours={workingHours} setWorkingHours={setWorkingHours} />
      </div>
    </div>
  );
}
