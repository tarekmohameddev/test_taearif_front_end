"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Sparkles, Globe } from "lucide-react";
import SaveConfirmationDialog from "@/components/SaveConfirmationDialog";
import { useEditorT } from "@/context/editorI18nStore";

interface PageThemeOption {
  id: string;
  name: string;
  image: string;
  description: string;
  components: {
    header: string;
    hero: string;
    halfTextHalfImage: string;
    propertySlider: string;
    ctaValuation: string;
  };
}

interface PageThemeSelectorProps {
  onThemeChange: (themeId: string, components: Record<string, string>) => void;
  className?: string;
}

// بيانات الثيمات المتاحة للصفحة كاملة
const PAGE_THEME_OPTIONS: PageThemeOption[] = [
  {
    id: "theme1",
    name: "Modern Theme",
    image: "/api/placeholder/400/200?text=Modern+Theme",
    description: "Clean and contemporary design with modern aesthetics",
    components: {
      header: "header1",
      hero: "hero1",
      halfTextHalfImage: "halfTextHalfImage1",
      propertySlider: "propertySlider1",
      ctaValuation: "ctaValuation1",
    },
  },
  {
    id: "theme2",
    name: "Classic Theme",
    image: "/api/placeholder/400/200?text=Classic+Theme",
    description: "Traditional and elegant design with timeless appeal",
    components: {
      header: "header2",
      hero: "hero2",
      halfTextHalfImage: "halfTextHalfImage1",
      propertySlider: "propertySlider1",
      ctaValuation: "ctaValuation1",
    },
  },
  {
    id: "theme3",
    name: "Minimal Theme",
    image: "/api/placeholder/400/200?text=Minimal+Theme",
    description: "Simple and clean design focusing on content",
    components: {
      header: "header3",
      hero: "hero3",
      halfTextHalfImage: "halfTextHalfImage1",
      propertySlider: "propertySlider1",
      ctaValuation: "ctaValuation1",
    },
  },
  {
    id: "theme4",
    name: "Bold Theme",
    image: "/api/placeholder/400/200?text=Bold+Theme",
    description: "Strong and impactful design with bold colors",
    components: {
      header: "header1",
      hero: "hero2",
      halfTextHalfImage: "halfTextHalfImage1",
      propertySlider: "propertySlider1",
      ctaValuation: "ctaValuation1",
    },
  },
];

export function PageThemeSelector({
  onThemeChange,
  className = "",
}: PageThemeSelectorProps) {
  const t = useEditorT();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleConfirm = () => {
    if (selectedTheme) {
      setShowConfirmation(true);
    }
  };

  const handleCancel = () => {
    setSelectedTheme(null);
    setIsOpen(false);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const handleConfirmationConfirm = () => {
    if (selectedTheme) {
      const theme = PAGE_THEME_OPTIONS.find((t) => t.id === selectedTheme);
      if (theme) {
        onThemeChange(selectedTheme, theme.components);
        setShowConfirmation(false);
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-300 transition-all duration-200 ${className}`}
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span className="text-indigo-700 font-medium">
              {t("page_theme.page_theme")}
            </span>
            <Sparkles className="w-3 h-3 text-indigo-500" />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Globe className="w-5 h-5 text-indigo-600" />
              {t("page_theme.choose_page_theme")}
            </DialogTitle>
            <DialogDescription>
              {t("page_theme.page_theme_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Theme Grid */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">
                {t("page_theme.available_page_themes")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PAGE_THEME_OPTIONS.map((theme) => (
                  <div
                    key={theme.id}
                    className={`relative group cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                      selectedTheme === theme.id
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 hover:border-indigo-300 bg-white"
                    }`}
                    onClick={() => handleThemeSelect(theme.id)}
                  >
                    {/* Theme Image */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={theme.image}
                        alt={theme.name}
                        className="w-full h-40 object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>

                    {/* Theme Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {theme.name}
                        </h4>
                        {selectedTheme === theme.id && (
                          <Badge className="bg-indigo-600 text-white text-xs">
                            {t("theme_selector.selected")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {theme.description}
                      </p>

                      {/* Components Preview */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                          {t("page_theme.components")}:
                        </h5>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {Object.entries(theme.components).map(
                            ([type, component]) => (
                              <div
                                key={type}
                                className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded"
                              >
                                <span className="text-gray-600 capitalize">
                                  {type}:
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-blue-100 text-blue-700"
                                >
                                  {component}
                                </Badge>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedTheme === theme.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            {selectedTheme && (
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <h3 className="font-medium text-indigo-900 mb-3">
                  {t("page_theme.theme_preview")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(
                    PAGE_THEME_OPTIONS.find((t) => t.id === selectedTheme)
                      ?.components || {},
                  ).map(([type, component]) => (
                    <div
                      key={type}
                      className="bg-white p-3 rounded border border-indigo-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-indigo-900 capitalize">
                          {type}
                        </span>
                        <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                          {component}
                        </Badge>
                      </div>
                      <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-400 rounded-full"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel}>
                {t("theme_selector.cancel")}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedTheme}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {t("page_theme.apply_page_theme")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SaveConfirmationDialog
        isThemeConfirmation={true}
        open={showConfirmation}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmationConfirm}
      />
    </>
  );
}
