"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { EditorProvider } from "@/context/EditorProvider";
import { ReactNode, useEffect, useState } from "react";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import {
  useEditorT,
  useEditorLocale,
  useEditorI18nStore,
} from "@/context/editorI18nStore";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { AuthProvider } from "@/context/AuthContext";
import { useEditorStore } from "@/context/editorStore";
import { EditorNavBar } from "./components/EditorNavBar";

// تم نقل EditorNavBar إلى components/EditorNavBar/EditorNavBar.tsx

export default function LiveEditorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { setLocale } = useEditorLocale();
  const t = useEditorT();
  const pathname = usePathname();
  const loadTranslations = useEditorI18nStore((state) => state.loadTranslations);
  const locale = useEditorI18nStore((state) => state.locale);

  // State for arrow tooltip
  const [showArrowTooltip, setShowArrowTooltip] = useState(false);
  const [previousHasChangesMade, setPreviousHasChangesMade] = useState(false);
  const hasChangesMade = useEditorStore((s) => s.hasChangesMade);

  // Token validation
  const { tokenValidation } = useTokenValidation();

  // Load translations for the current locale on mount
  useEffect(() => {
    if (locale) {
      loadTranslations(locale);
    }
  }, [locale, loadTranslations]);

  // تحديث الـ store عند تحميل الصفحة
  useEffect(() => {
    if (pathname) {
      const currentLang = pathname.split("/")[1] || "en";
      setLocale(currentLang as any);
    }
  }, [pathname, setLocale]);

  // Detect when hasChangesMade changes from false to true
  useEffect(() => {
    if (hasChangesMade && !previousHasChangesMade) {
      setShowArrowTooltip(true);
      // Auto-hide after 7 seconds
      setTimeout(() => {
        setShowArrowTooltip(false);
      }, 15000);
    }
    setPreviousHasChangesMade(hasChangesMade);
  }, [hasChangesMade, previousHasChangesMade]);

  // Show loading while validating token
  if (tokenValidation.loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="ltr"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  return (
    // إضافة I18nProvider و EditorProvider و AuthProvider لتوفير السياق لكل الأبناء
    <I18nProvider>
      <AuthProvider>
        <EditorProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col" dir="ltr">
            {/* إضافة Toaster هنا ليعمل في كل مكان */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* Translation Test Component - Remove in production */}

            <EditorNavBar showArrowTooltip={showArrowTooltip} />

            <main className="flex-1" dir="ltr">
              {children}
            </main>
          </div>
        </EditorProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
