"use client";

import React from "react";
import Step3NewPanel from "./Step3NewPanel";
import Step3SitesPanel from "./Step3SitesPanel";

export default function OnboardingStep3({
  activeTab,
}: {
  activeTab: "sites" | "new";
}) {

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Step content container (placeholder) */}
        {activeTab === "sites" ? <Step3SitesPanel /> : <Step3NewPanel />}
    </div>
  );
}

