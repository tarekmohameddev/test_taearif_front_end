// ============================================================================
// Hook for detecting static pages
// ============================================================================

import { useMemo } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";

export function useStaticPageDetection(slug: string | undefined): boolean {
  const getStaticPageData = useEditorStore((s) => s.getStaticPageData);

  const isStaticPage = useMemo(() => {
    const currentSlug = slug || "";
    if (!currentSlug) return false;

    // الصفحات الثابتة المعرفة: "project" هي صفحة ثابتة دائماً
    const staticPageSlugs = ["project", "property"];
    if (staticPageSlugs.includes(currentSlug)) {
      return true;
    }

    // التحقق من staticPagesData
    const staticPageData = getStaticPageData(currentSlug);
    return !!staticPageData;
  }, [slug, getStaticPageData]);

  return isStaticPage;
}
