"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useEditorT,
  useEditorLocale,
} from "@/context/editorI18nStore";
import { Palette, AlertTriangle, Loader2 } from "lucide-react";
import { ThemeNumber } from "@/services/live-editor/themeChangeService";

interface ThemeOption {
  id: ThemeNumber;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  image: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 1,
    name: "Theme 1",
    nameAr: "الثيم الأول",
    description: "Modern and clean design with contemporary aesthetics",
    descriptionAr: "تصميم عصري ونظيف مع جماليات معاصرة",
    image: "/images/placeholders/themes/theme1.jpeg",
  },
  {
    id: 2,
    name: "Theme 2",
    nameAr: "الثيم الثاني",
    description: "Classic and elegant design with timeless appeal",
    descriptionAr: "تصميم كلاسيكي وأنيق مع جاذبية خالدة",
    image: "/images/placeholders/themes/theme2.jpeg",
  },
];

interface ThemeChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeApply: (themeNumber: ThemeNumber) => Promise<void>;
  currentTheme: number | null;
}

export function ThemeChangeDialog({
  isOpen,
  onClose,
  onThemeApply,
  currentTheme,
}: ThemeChangeDialogProps) {
  const t = useEditorT();
  const { locale } = useEditorLocale();
  const [selectedTheme, setSelectedTheme] = useState<ThemeNumber | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const isRTL = locale === "ar";

  const handleThemeSelect = (themeId: ThemeNumber) => {
    setSelectedTheme(themeId);
    setShowWarning(true);
  };

  const handleApply = async () => {
    if (!selectedTheme) return;

    setIsApplying(true);
    try {
      await onThemeApply(selectedTheme);
      setSelectedTheme(null);
      setShowWarning(false);
      onClose();
    } catch (error) {
      console.error("Error applying theme:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleClose = () => {
    if (!isApplying) {
      setSelectedTheme(null);
      setShowWarning(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette className="w-5 h-5 text-indigo-600" />
            {isRTL ? "تغيير ثيم الموقع بالكامل" : "Change Site Theme"}
          </DialogTitle>
          <DialogDescription className="text-right">
            {isRTL
              ? "اختر ثيم جديد لتطبيقه على جميع الصفحات والكومبوننتات"
              : "Select a new theme to apply to all pages and components"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning Message */}
          {showWarning && selectedTheme && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">
                  {isRTL ? "⚠️ تحذير" : "⚠️ Warning"}
                </p>
                <p className="text-sm text-amber-800 mt-1">
                  {isRTL
                    ? "سيتم استبدال جميع الكومبوننتات في جميع الصفحات بالبيانات الافتراضية للثيم الجديد. سيتم حفظ الثيم الحالي كنسخة احتياطية."
                    : "All components on all pages will be replaced with the default data of the new theme. The current theme will be saved as a backup."}
                </p>
              </div>
            </div>
          )}

          {/* Theme Grid */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">
              {isRTL ? "الثيمات المتاحة" : "Available Themes"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                const isCurrent = currentTheme === theme.id;

                return (
                  <div
                    key={theme.id}
                    className={`relative group cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 hover:border-indigo-300 bg-white"
                    }`}
                    onClick={() => handleThemeSelect(theme.id)}
                  >
                    {/* Current Theme Badge */}
                    {isCurrent && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          {isRTL ? "مطبق حالياً" : "Current"}
                        </span>
                      </div>
                    )}

                    {/* Theme Image */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={theme.image}
                        alt={theme.name}
                        className="w-full h-fit object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>

                    {/* Theme Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {isRTL ? theme.nameAr : theme.name}
                        </h4>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {isRTL ? theme.descriptionAr : theme.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isApplying}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            onClick={handleApply}
            disabled={!selectedTheme || isApplying}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            {isApplying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isRTL ? "جاري التطبيق..." : "Applying..."}
              </>
            ) : (
              <>
                <Palette className="w-4 h-4" />
                {isRTL ? "تطبيق الثيم" : "Apply Theme"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
