"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  Palette,
  AlertTriangle,
  Loader2,
  RotateCcw,
  Lock,
  ShoppingCart,
} from "lucide-react";
import { ThemeNumber } from "@/services/live-editor/themeChangeService";
import { useThemes } from "@/hooks/useThemes";
import { setActiveTheme } from "@/services/theme/themeService";
import type { Theme } from "@/components/settings/themes/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ThemeChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeApply: (themeNumber: ThemeNumber) => Promise<void>;
  onThemeReset: (themeNumber: ThemeNumber) => Promise<void>;
  currentTheme: number | null;
}

export function ThemeChangeDialog({
  isOpen,
  onClose,
  onThemeReset,
  currentTheme,
}: ThemeChangeDialogProps) {
  const t = useEditorT();
  const { locale } = useEditorLocale();
  const router = useRouter();
  const { themes, activeThemeId, loading, error } = useThemes();
  
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);

  const isRTL = locale === "ar";

  // Reset selected theme when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTheme(null);
      setShowWarning(false);
    }
  }, [isOpen]);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setShowWarning(true);
  };

  const canUseTheme = (theme: Theme): boolean => {
    // الاعتماد على بيانات الباك إند فقط
    return theme.is_free || theme.has_access;
  };

  const handleApply = async () => {
    if (!selectedTheme) return;

    setIsApplying(true);
    try {
      // استخدام API مباشرة للتفعيل
      await setActiveTheme(selectedTheme.id);
      setSelectedTheme(null);
      setShowWarning(false);
      // إعادة تحميل الصفحة لتطبيق التغييرات
      window.location.reload();
    } catch (error) {
      console.error("Error applying theme:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handlePurchase = () => {
    if (!selectedTheme) return;
    
    // الانتقال إلى settings page مع themeId
    router.push(`/dashboard/settings?tab=themes&themeId=${selectedTheme.id}`);
    onClose();
  };

  const handleReset = async () => {
    if (!currentTheme) return;

    setIsResetting(true);
    try {
      await onThemeReset(currentTheme);
      setShowResetWarning(false);
      onClose();
    } catch (error) {
      console.error("Error resetting theme:", error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleClose = () => {
    if (!isApplying && !isResetting) {
      setSelectedTheme(null);
      setShowWarning(false);
      setShowResetWarning(false);
      onClose();
    }
  };

  const selectedThemeCanUse = selectedTheme ? canUseTheme(selectedTheme) : false;

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
          {/* Reset Button - Only show if currentTheme exists */}
          {currentTheme !== null && (
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setShowResetWarning(true)}
                disabled={isApplying || isResetting}
                className="w-full gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
              >
                <RotateCcw className="w-4 h-4" />
                {isRTL ? "إعادة تعيين للافتراضي" : "Reset to Default"}
              </Button>

              {/* Reset Warning Message */}
              {showResetWarning && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      {isRTL ? "⚠️ تحذير: إعادة التعيين" : "⚠️ Warning: Reset"}
                    </p>
                    <p className="text-sm text-red-800 mt-1">
                      {isRTL
                        ? "سيتم استبدال جميع الكومبوننتات في جميع الصفحات بالبيانات الافتراضية للثيم الحالي. سيتم حفظ الثيم الحالي كنسخة احتياطية قبل إعادة التعيين."
                        : "All components on all pages will be replaced with the default data of the current theme. The current theme will be saved as a backup before reset."}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleReset}
                        disabled={isResetting}
                        className="gap-2"
                      >
                        {isResetting ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {isRTL ? "جاري إعادة التعيين..." : "Resetting..."}
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3 h-3" />
                            {isRTL ? "تأكيد إعادة التعيين" : "Confirm Reset"}
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowResetWarning(false)}
                        disabled={isResetting}
                      >
                        {isRTL ? "إلغاء" : "Cancel"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Warning Message - Only show for themes that can be used */}
          {showWarning && selectedTheme && selectedThemeCanUse && (
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

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="aspect-video w-full rounded" />
                  <Skeleton className="h-6 w-3/4 mt-4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Theme Grid */}
          {!loading && !error && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">
                {isRTL ? "الثيمات المتاحة" : "Available Themes"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme) => {
                  const isSelected = selectedTheme?.id === theme.id;
                  const isCurrent = activeThemeId === theme.id;
                  const canUse = canUseTheme(theme);

                  return (
                    <div
                      key={theme.id}
                      className={`relative group cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 shadow-md"
                          : "border-gray-200 hover:border-indigo-300 bg-white"
                      } ${!canUse ? "opacity-75" : ""}`}
                      onClick={() => handleThemeSelect(theme)}
                    >
                      {/* Current Theme Badge */}
                      {isCurrent && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            {isRTL ? "مطبق حالياً" : "Current"}
                          </span>
                        </div>
                      )}

                      {/* Lock Overlay */}
                      {!canUse && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10 rounded-lg">
                          <Lock className="h-12 w-12 text-white" />
                        </div>
                      )}

                      {/* Theme Image */}
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={theme.thumbnail || "/placeholder.svg"}
                          alt={theme.name}
                          className="w-full h-fit object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>

                      {/* Theme Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {theme.name}
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
                        {theme.description && (
                          <p className="text-sm text-gray-600">
                            {theme.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          {theme.is_free ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {isRTL ? "مجاني" : "Free"}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-600">
                              {theme.price} {theme.currency || "SAR"}
                            </span>
                          )}
                          {theme.has_access && !theme.is_free && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {isRTL ? "مملوك" : "Owned"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isApplying || isResetting}
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          {selectedTheme && (
            <Button
              onClick={selectedThemeCanUse ? handleApply : handlePurchase}
              disabled={isApplying || isResetting}
              className={`gap-2 ${
                selectedThemeCanUse
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isRTL ? "جاري التطبيق..." : "Applying..."}
                </>
              ) : selectedThemeCanUse ? (
                <>
                  <Palette className="w-4 h-4" />
                  {isRTL ? "تطبيق الثيم" : "Apply Theme"}
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  {isRTL ? "شراء الثيم" : "Purchase Theme"}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
