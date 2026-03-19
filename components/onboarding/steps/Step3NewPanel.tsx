"use client";

import Step3PropertyEditorPanel from "./Step3PropertyEditorPanel";
import Step3NewPanelCollapsibleCard from "./Step3NewPanelCollapsibleCard";
import Step3MediaPanelCollapsibleCard from "./Step3MediaPanelCollapsibleCard";
import Step3FaqPanelCollapsibleCard from "./Step3FaqPanelCollapsibleCard";

export default function Step3NewPanel() {
  return (
    <div className="w-[90%] text-white mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Right side (desktop): content */}
        <div className="w-full">
          <Step3NewPanelCollapsibleCard />

          <Step3PropertyEditorPanel />
        </div>

        {/* Left side (desktop): title only */}
        <div className="hidden md:block self-stretch min-h-[240px] w-[1px] bg-white/50 shrink-0" />
        <div className="w-full ">
        <Step3MediaPanelCollapsibleCard />
          <Step3FaqPanelCollapsibleCard /> 
        </div>
      </div>
    </div>
  );
}
