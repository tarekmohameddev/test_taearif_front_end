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
import { Palette, Sparkles } from "lucide-react";
import { useEditorT } from "@/context/editorI18nStore";

interface CardThemeOption {
  id: string;
  name: string;
  image: string;
  description: string;
  preview: {
    backgroundColor: string;
    borderRadius: string;
    shadow: string;
    textColor: string;
  };
}

interface CardThemeSelectorProps {
  currentTheme?: string;
  onThemeChange: (themeId: string) => void;
  className?: string;
}

// ثيمات الكارد المتاحة
const CARD_THEME_OPTIONS: CardThemeOption[] = [
  {
    id: "card-default",
    name: "Default Card",
    image: "/api/placeholder/300/200?text=Default+Card",
    description: "Clean white card with subtle shadow",
    preview: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      shadow: "0 1px 3px rgba(0,0,0,0.1)",
      textColor: "#374151",
    },
  },
  {
    id: "card-modern",
    name: "Modern Card",
    image: "/api/placeholder/300/200?text=Modern+Card",
    description: "Sleek card with smooth rounded corners",
    preview: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      shadow: "0 4px 6px rgba(0,0,0,0.07)",
      textColor: "#1f2937",
    },
  },
  {
    id: "card-elegant",
    name: "Elegant Card",
    image: "/api/placeholder/300/200?text=Elegant+Card",
    description: "Sophisticated card with subtle border",
    preview: {
      backgroundColor: "#fafafa",
      borderRadius: "12px",
      shadow: "0 2px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
      textColor: "#111827",
    },
  },
  {
    id: "card-minimal",
    name: "Minimal Card",
    image: "/api/placeholder/300/200?text=Minimal+Card",
    description: "Ultra-clean minimal design",
    preview: {
      backgroundColor: "#ffffff",
      borderRadius: "4px",
      shadow: "0 1px 2px rgba(0,0,0,0.05)",
      textColor: "#374151",
    },
  },
  {
    id: "card-bold",
    name: "Bold Card",
    image: "/api/placeholder/300/200?text=Bold+Card",
    description: "Strong card with prominent shadow",
    preview: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      shadow: "0 8px 25px rgba(0,0,0,0.15)",
      textColor: "#1f2937",
    },
  },
  {
    id: "card-glass",
    name: "Glass Card",
    image: "/api/placeholder/300/200?text=Glass+Card",
    description: "Modern glassmorphism effect",
    preview: {
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: "16px",
      shadow: "0 8px 32px rgba(0,0,0,0.1)",
      textColor: "#1f2937",
    },
  },
];

export function CardThemeSelector({
  currentTheme = "card-default",
  onThemeChange,
  className = "",
}: CardThemeSelectorProps) {
  const t = useEditorT();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const currentThemeData = CARD_THEME_OPTIONS.find(
    (t) => t.id === currentTheme,
  );

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleConfirm = () => {
    onThemeChange(selectedTheme);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedTheme(currentTheme);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`w-full inline-flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 hover:from-pink-100 hover:to-purple-100 hover:border-pink-300 transition-all duration-200 ${className}`}
        >
          <Palette className="w-4 h-4 text-pink-600" />
          <span className="text-pink-700 font-medium">
            {t("card_theme.card_theme")}
          </span>
          <Sparkles className="w-3 h-3 text-pink-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Palette className="w-5 h-5 text-pink-600" />
            {t("card_theme.choose_card_theme")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {t("card_theme.card_theme_description")}{" "}
            {t("card_theme.current_theme")}:{" "}
            {currentThemeData?.name || "Default"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {CARD_THEME_OPTIONS.map((theme) => (
            <div
              key={theme.id}
              className={`relative cursor-pointer group transition-all duration-300 ${
                selectedTheme === theme.id
                  ? "ring-2 ring-pink-500 ring-offset-2"
                  : "hover:ring-2 hover:ring-pink-300 hover:ring-offset-2"
              }`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
                {/* معاينة الكارد */}
                <div className="p-6 bg-gray-50">
                  <div
                    className="relative w-full h-40 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: theme.preview.backgroundColor,
                      borderRadius: theme.preview.borderRadius,
                      boxShadow: theme.preview.shadow,
                      color: theme.preview.textColor,
                    }}
                  >
                    <div className="p-4 h-full flex flex-col">
                      {/* صورة وهمية */}
                      <div className="w-full h-20 bg-gray-200 rounded mb-2"></div>
                      {/* عنوان المنتج */}
                      <div className="flex-1">
                        <div className="h-3 bg-gray-300 rounded mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      {/* السعر */}
                      <div className="mt-2">
                        <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* معلومات الثيم */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {theme.name}
                    </h3>
                    {selectedTheme === theme.id && (
                      <Badge
                        variant="default"
                        className="bg-pink-500 text-white"
                      >
                        {t("theme_selector.selected")}
                      </Badge>
                    )}
                    {currentTheme === theme.id &&
                      selectedTheme !== theme.id && (
                        <Badge
                          variant="outline"
                          className="border-pink-300 text-pink-600"
                        >
                          {t("theme_selector.active")}
                        </Badge>
                      )}
                  </div>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            {t("theme_selector.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-pink-600 hover:bg-pink-700 text-white"
            disabled={selectedTheme === currentTheme}
          >
            {t("card_theme.apply_theme")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
