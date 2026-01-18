"use client";

import React, { useState, useEffect } from "react";
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
import { Palette, Sparkles, Lock } from "lucide-react";
import { COMPONENTS } from "@/lib/ComponentsList";
import { useEditorT } from "@/context/editorI18nStore";
import { useThemes } from "@/hooks/useThemes";
import { findThemeForComponent } from "@/lib/themes/themeComponentLookup";
import { PremiumDialog } from "./PremiumDialog";
import type { Theme } from "@/components/settings/themes/types";

interface ThemeOption {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
}

interface ThemeSelectorProps {
  componentType: string;
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  className?: string;
}

export function ThemeSelector({
  componentType,
  currentTheme,
  onThemeChange,
  className = "",
}: ThemeSelectorProps) {
  const t = useEditorT();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  // Premium Dialog State
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [selectedPremiumTheme, setSelectedPremiumTheme] = useState<{
    themeName: string;
    themePrice: string;
    currency: string;
    themeId: string;
  } | null>(null);

  // Fetch themes data
  const { themes, loading: themesLoading } = useThemes();

  // Update selectedTheme when currentTheme changes
  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  const [themeOptions, setThemeOptions] = useState<
    Record<string, ThemeOption[]>
  >({});

  useEffect(() => {
    const newThemeOptions: Record<string, ThemeOption[]> = {};
    for (const componentType in COMPONENTS) {
      const component = COMPONENTS[componentType];
      if (component && component.variants) {
        newThemeOptions[componentType] = component.variants.map(
          (variant: any) => ({
            id: variant.id || variant,
            name:
              variant.name ||
              `${component.displayName} ${(variant.id || variant).replace(componentType, "")}`,
            image: "/placeholder.svg",
            description: `${component.description} - ${variant.id || variant} variant`,
            category: componentType,
          }),
        );
      }
    }
    setThemeOptions(newThemeOptions);
  }, []);

  const currentThemes = themeOptions[componentType] || [];
  const currentThemeData = currentThemes.find((t) => t.id === currentTheme);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleConfirm = () => {
    // التحقق من الثيم قبل التطبيق
    const themeId = findThemeForComponent(selectedTheme);
    if (themeId && themes.length > 0) {
      const theme = themes.find((t: Theme) => t.id === themeId);
      if (theme && !theme.has_access && process.env.NODE_ENV !== "development") {
        // إغلاق ThemeSelector dialog أولاً
        setIsOpen(false);
        // منع التطبيق وإظهار PremiumDialog
        setSelectedPremiumTheme({
          themeName: theme.name,
          themePrice: String(theme.price || "0"),
          currency: theme.currency || "SAR",
          themeId: theme.id,
        });
        setPremiumDialogOpen(true);
        return; // منع تطبيق الثيم
      }
    }

    // المتابعة مع التطبيق العادي
    onThemeChange(selectedTheme);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedTheme(currentTheme);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          // Reset to current theme when dialog closes without applying
          setSelectedTheme(currentTheme);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 hover:border-purple-300 transition-all duration-200 ${className}`}
        >
          <Palette className="w-4 h-4 text-purple-600" />
          <span className="text-purple-700 font-medium">
            {t("theme_selector.change_theme")}
          </span>
          <Sparkles className="w-3 h-3 text-purple-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette className="w-5 h-5 text-purple-600" />
            {t("theme_selector.choose_theme")}
          </DialogTitle>
          <DialogDescription>
            {t("theme_selector.theme_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Theme Display */}
          {currentThemeData && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">
                {t("theme_selector.current_theme")}
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={currentThemeData.image}
                    alt={currentThemeData.name}
                    className="w-16 h-10 object-cover rounded border-2 border-blue-300"
                  />
                  <Badge className="absolute -top-1 -right-1 bg-blue-600 text-xs">
                    {t("theme_selector.active")}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    {currentThemeData.name}
                  </p>
                  <p className="text-sm text-blue-700">
                    {currentThemeData.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Theme Grid */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">
              {t("theme_selector.available_themes")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentThemes.map((theme) => {
                const themeId = findThemeForComponent(theme.id);
                const themeData = themeId ? themes.find((t: Theme) => t.id === themeId) : null;
                const isLocked = themeData && !themeData.has_access;

                return (
                  <div
                    key={theme.id}
                    className={`relative group cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                      selectedTheme === theme.id
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    } ${isLocked ? "opacity-60" : ""}`}
                    onClick={() => handleThemeSelect(theme.id)}
                  >
                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 rounded-lg">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                  )}

                  {/* Theme Image */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={theme.image}
                      alt={theme.name}
                      className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
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
                        <Badge className="bg-purple-600 text-white text-xs">
                          {t("theme_selector.selected")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {theme.description}
                    </p>

                    {/* Preview Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      {t("theme_selector.preview_theme")}
                    </Button>
                  </div>

                  {/* Selection Indicator */}
                  {selectedTheme === theme.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
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
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              {t("theme_selector.cancel")}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedTheme === currentTheme}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {t("theme_selector.apply_theme")}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Premium Dialog */}
      {selectedPremiumTheme && (
        <PremiumDialog
          open={premiumDialogOpen}
          onClose={() => {
            setPremiumDialogOpen(false);
            setSelectedPremiumTheme(null);
          }}
          themeName={selectedPremiumTheme.themeName}
          themePrice={selectedPremiumTheme.themePrice}
          currency={selectedPremiumTheme.currency}
          themeId={selectedPremiumTheme.themeId}
        />
      )}
    </Dialog>
  );
}
