"use client";

import React from "react";
import Step1ColorsPanel from "./Step1ColorsPanel";
import Step1BasicsPanel from "./Step1BasicsPanel";

type OnboardingStep1Props = {
  siteName: string;
  setSiteName: React.Dispatch<React.SetStateAction<string>>;
  logoPreviewUrl: string | null;
  setLogoPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setLogoFile: React.Dispatch<React.SetStateAction<File | null>>;
  manualColorsVisible: boolean;
  setManualColorsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  manualHexes: string[];
  setManualHexes: React.Dispatch<React.SetStateAction<string[]>>;
  normalizeHexForPreview: (hex: string, fallback: string) => string;
};

export default function OnboardingStep1({
  siteName,
  setSiteName,
  logoPreviewUrl,
  setLogoPreviewUrl,
  setLogoFile,
  manualColorsVisible,
  setManualColorsVisible,
  manualHexes,
  setManualHexes,
  normalizeHexForPreview,
}: OnboardingStep1Props) {
  return (
    <div className="w-[90%] text-white mx-auto">
      <div className="flex flex-col md:flex-row  gap-8">
        {/* Right side (desktop): content */}
        <Step1BasicsPanel
          siteName={siteName}
          setSiteName={setSiteName}
          logoPreviewUrl={logoPreviewUrl}
          setLogoPreviewUrl={setLogoPreviewUrl}
          setLogoFile={setLogoFile}
        />

        <div className="hidden md:block  min-h-[50%] max-h-[50%] w-[1px] bg-white/50 shrink-0 px-[0.6px]" />

        {/* Left side (desktop): title only */}
        <Step1ColorsPanel
          manualColorsVisible={manualColorsVisible}
          setManualColorsVisible={setManualColorsVisible}
          manualHexes={manualHexes}
          setManualHexes={setManualHexes}
          normalizeHexForPreview={normalizeHexForPreview}
        />
      </div>
    </div>
  );
}


