import { useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { DEFAULT_PAGES } from "../constants/defaultPages";

/**
 * Hook لإضافة بيانات افتراضية للصفحات المحددة إذا لم تكن موجودة في WebsiteLayout
 * Adds default page data to WebsiteLayout if pages don't exist
 */
export function useDefaultPagesInitializer() {
  const { tenantData } = useTenantStore();

  useEffect(() => {
    if (!tenantData) return;

    const { addPageToWebsiteLayout } = useEditorStore.getState();

    // التحقق من كل صفحة بشكل منفصل
    const existingPages = tenantData.WebsiteLayout?.metaTags?.pages || [];
    const existingPaths = existingPages.map((page: any) => page.path);

    // إضافة الصفحات المفقودة
    const addedPages: string[] = [];
    DEFAULT_PAGES.forEach((defaultPage) => {
      if (!existingPaths.includes(defaultPage.path)) {
        addPageToWebsiteLayout(defaultPage);
        addedPages.push(defaultPage.path);
      }
    });
  }, [tenantData]);
}
