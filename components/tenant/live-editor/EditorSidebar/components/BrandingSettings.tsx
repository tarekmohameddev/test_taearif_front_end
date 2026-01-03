"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useEditorStore } from "@/context/editorStore";
import { useEditorT } from "@/context/editorI18nStore";
import { ModernColorPicker } from "./ModernColorPicker";

export function BrandingSettings() {
  const t = useEditorT();
  const {
    WebsiteLayout,
    setWebsiteLayout,
    tempData,
    setTempData,
    updateByPath,
  } = useEditorStore();

  // Initialize branding data
  const [brandingData, setBrandingData] = useState({
    colors: {
      primary: "",
      secondary: "",
      accent: "",
    },
    mainBgColor: "",
  });

  const isInitializing = useRef(true);

  // Load branding data from WebsiteLayout
  useEffect(() => {
    isInitializing.current = true;
    if (WebsiteLayout?.branding) {
      const newBrandingData = {
        colors: {
          primary: WebsiteLayout.branding.colors?.primary || "",
          secondary: WebsiteLayout.branding.colors?.secondary || "",
          accent: WebsiteLayout.branding.colors?.accent || "",
        },
        mainBgColor: WebsiteLayout.branding.mainBgColor || "",
      };
      console.log(
        "📥 Loading branding data from WebsiteLayout:",
        newBrandingData,
      );
      setBrandingData(newBrandingData);
      // Update tempData immediately and also after a delay to ensure it's set
      setTempData(newBrandingData);
      setTimeout(() => {
        setTempData(newBrandingData);
        console.log("✅ tempData updated after delay:", newBrandingData);
      }, 100);
    } else {
      // Initialize empty branding
      const emptyBranding = {
        colors: {
          primary: "",
          secondary: "",
          accent: "",
        },
        mainBgColor: "",
      };
      console.log("📥 Initializing empty branding data");
      setBrandingData(emptyBranding);
      // Update tempData immediately and also after a delay to ensure it's set
      setTempData(emptyBranding);
      setTimeout(() => {
        setTempData(emptyBranding);
        console.log("✅ tempData updated after delay (empty):", emptyBranding);
      }, 100);
    }
    // Mark initialization as complete after a short delay to allow state updates
    setTimeout(() => {
      isInitializing.current = false;
      console.log("✅ Initialization complete");
    }, 150);
  }, [WebsiteLayout, setTempData]);

  // Update tempData when brandingData changes (but not during initialization)
  useEffect(() => {
    if (!isInitializing.current) {
      console.log("🔄 Updating tempData with brandingData:", brandingData);
      setTempData(brandingData);
    }
  }, [brandingData, setTempData]);

  const handleColorChange = useCallback(
    (colorType: "primary" | "secondary" | "accent", value: string) => {
      console.log(`🎨 Color changed: ${colorType} = ${value}`);
      setBrandingData((prev) => {
        const newData = {
          ...prev,
          colors: {
            ...prev.colors,
            [colorType]: value,
          },
        };
        console.log("📝 New brandingData:", newData);
        return newData;
      });
    },
    [],
  );

  const handleMainBgColorChange = useCallback((value: string) => {
    console.log(`🎨 MainBgColor changed: ${value}`);
    setBrandingData((prev) => {
      const newData = {
        ...prev,
        mainBgColor: value,
      };
      console.log("📝 New brandingData:", newData);
      return newData;
    });
  }, []);

  const handleSave = () => {
    const updatedWebsiteLayout = {
      ...WebsiteLayout,
      branding: brandingData,
    };
    setWebsiteLayout(updatedWebsiteLayout);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          {t("editor_sidebar.branding_settings")}
        </h3>
      </div>

      {/* Colors Section */}
      <div className="space-y-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200/50 shadow-lg">
          <h4 className="text-base font-semibold text-slate-800 mb-4">
            {t("editor_sidebar.brand_colors")}
          </h4>

          <div className="space-y-6">
            {/* Primary Color */}
            <ModernColorPicker
              label={t("editor_sidebar.primary_color")}
              value={brandingData.colors.primary}
              onChange={(color) => handleColorChange("primary", color)}
            />

            {/* Secondary Color */}
            <ModernColorPicker
              label={t("editor_sidebar.secondary_color")}
              value={brandingData.colors.secondary}
              onChange={(color) => handleColorChange("secondary", color)}
            />

            {/* Accent Color */}
            <ModernColorPicker
              label={t("editor_sidebar.accent_color")}
              value={brandingData.colors.accent}
              onChange={(color) => handleColorChange("accent", color)}
            />
          </div>
        </div>

        {/* Main Background Color */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-slate-200/50 shadow-lg">
          <h4 className="text-base font-semibold text-slate-800 mb-4">
            {t("editor_sidebar.main_background_color")}
          </h4>

          <ModernColorPicker
            label={t("editor_sidebar.background_color")}
            value={brandingData.mainBgColor}
            onChange={handleMainBgColorChange}
          />
        </div>
      </div>
    </div>
  );
}
