"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { useEditorStore } from "@/context/editorStore";
import useAuthStore from "@/context/AuthContext";
import { useEditorLocale } from "@/context/editorI18nStore";
import { AddPageDialog } from "../AddPageDialog";
import { ThemeChangeDialog } from "@/components/tenant/live-editor/ThemeChangeDialog";
import {
  useEditorNavEffects,
  useAvailablePages,
  useComponentSettingsLoader,
  useDefaultPagesInitializer,
  useThemeHandlers,
} from "../../hooks";
import { DesktopNavBar } from "./DesktopNavBar";
import { MobileNavBar } from "./MobileNavBar";

interface EditorNavBarProps {
  showArrowTooltip: boolean;
}

export function EditorNavBar({ showArrowTooltip }: EditorNavBarProps) {
  const pathname = usePathname();
  const requestSave = useEditorStore((state) => state.requestSave);
  const { userData } = useAuthStore();
  const { locale } = useEditorLocale();
  const [recentlyAddedPages, setRecentlyAddedPages] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);

  const tenantId = userData?.username || "";
  const basePath = `/live-editor`;
  const currentPath = (pathname || "").replace(basePath, "") || "";

  // الحصول على WebsiteLayout من editorStore
  const editorStoreWebsiteLayout = useEditorStore(
    (state) => state.WebsiteLayout,
  );
  const editorWebsiteLayout = editorStoreWebsiteLayout?.metaTags?.pages || [];
  const currentTheme = useEditorStore(
    (state) => state.WebsiteLayout?.currentTheme,
  );

  // استخدام hooks للـ effects (tenant data is fetched once via useTenantDataEffect in LiveEditorEffects)
  useEditorNavEffects(
    tenantId,
    isDropdownOpen,
    isPagesDropdownOpen,
    setIsDropdownOpen,
    setIsPagesDropdownOpen,
  );

  // Theme change handlers
  const { handleThemeApply, handleThemeReset } = useThemeHandlers();

  // استخدام hook للحصول على الصفحات المتاحة
  const { availablePages } = useAvailablePages(
    recentlyAddedPages,
    editorWebsiteLayout,
  );

  // تحميل componentSettings
  useComponentSettingsLoader();

  // تهيئة الصفحات الافتراضية
  useDefaultPagesInitializer();

  // دالة لإضافة صفحة جديدة إلى القائمة المحلية
  const addPageToLocalList = (pageSlug: string) => {
    setRecentlyAddedPages((prev) => [...prev, pageSlug]);
  };

  return (
    <nav
      className="bg-white border-b-[1.5px] border-red-300 sticky top-0 z-[51]"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-full mx-auto px-4 sm:px-2 py-1">
        <DesktopNavBar
          showArrowTooltip={showArrowTooltip}
          tenantId={tenantId}
          basePath={basePath}
          currentPath={currentPath}
          availablePages={availablePages}
          requestSave={requestSave}
          onAddPage={() => setIsAddPageDialogOpen(true)}
          onThemeChange={() => setIsThemeDialogOpen(true)}
        />

        <MobileNavBar
          showArrowTooltip={showArrowTooltip}
          tenantId={tenantId}
          basePath={basePath}
          currentPath={currentPath}
          availablePages={availablePages}
          requestSave={requestSave}
          onAddPage={() => setIsAddPageDialogOpen(true)}
          onThemeChange={() => setIsThemeDialogOpen(true)}
        />
      </div>

      {/* Add Page Dialog */}
      <AddPageDialog
        open={isAddPageDialogOpen}
        onOpenChange={setIsAddPageDialogOpen}
        onPageCreated={(slug) => {
          addPageToLocalList(slug);
        }}
      />

      {/* Theme Change Dialog */}
      <ThemeChangeDialog
        isOpen={isThemeDialogOpen}
        onClose={() => setIsThemeDialogOpen(false)}
        onThemeApply={handleThemeApply}
        onThemeReset={handleThemeReset}
        currentTheme={currentTheme || null}
      />
    </nav>
  );
}
