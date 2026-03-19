"use client";

import React from "react";
import Step2BasicsPanel from "./Step2BasicsPanel";
import Step2ColorsPanel from "./Step2ColorsPanel";

export default function OnboardingStep2() {
  return (
    <div className="w-[90%] text-white mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Right side (desktop): content */}
        <Step2BasicsPanel />

        <div className="hidden md:block self-stretch min-h-[240px] w-[1px] bg-white/50 shrink-0" />

        {/* Left side (desktop): title only */}
        <Step2ColorsPanel />
      </div>
    </div>
  );
}

