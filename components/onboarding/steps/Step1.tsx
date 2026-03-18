"use client";

import React, { useState } from "react";
import Step1ColorsPanel from "./Step1ColorsPanel";
import Step1BasicsPanel from "./Step1BasicsPanel";

export default function OnboardingStep1() {
  const [siteName, setSiteName] = useState("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [manualColorsVisible, setManualColorsVisible] = useState(false);
  const [manualHexes, setManualHexes] = useState<string[]>([
    "#5BC4C0",
    "#4CAF82",
    "#1A3C34",
  ]);

  const normalizeHexForPreview = (hex: string, fallback: string) => {
    const raw = hex.trim().toUpperCase();
    const withHash = raw.startsWith("#") ? raw : `#${raw}`;
    return /^#[0-9A-F]{6}$/.test(withHash) ? withHash : fallback;
  };

  return (
    <div className="w-[90%] text-white mx-auto">
      <div className="flex flex-col md:flex-row  gap-8">
        {/* Right side (desktop): content */}
        <Step1BasicsPanel
          siteName={siteName}
          setSiteName={setSiteName}
          logoPreviewUrl={logoPreviewUrl}
          setLogoPreviewUrl={setLogoPreviewUrl}
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


