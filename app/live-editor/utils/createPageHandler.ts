import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { PageFormData } from "../types/types";

/**
 * معالج إنشاء صفحة جديدة مع WebsiteLayout
 */
export async function createPageHandler(
  formData: PageFormData,
  onSuccess?: (slug: string) => void,
): Promise<void> {
  // استخدام createPage من editorStore
  // #region agent log
  const storeState = useEditorStore.getState();
  fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'createPageHandler.ts:13',message:'Store state keys',data:{keys:Object.keys(storeState),hasCreatePage:typeof storeState.createPage,createPageType:typeof storeState.createPage},timestamp:Date.now(),runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const { createPage } = storeState;
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'createPageHandler.ts:16',message:'createPage value check',data:{createPage:createPage,isFunction:typeof createPage === 'function',isUndefined:createPage === undefined},timestamp:Date.now(),runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'createPageHandler.ts:22',message:'Calling createPage',data:{slug:formData.slug,name:formData.slug},timestamp:Date.now(),runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  createPage({
    slug: formData.slug,
    name: formData.slug, // استخدام slug كاسم الصفحة
    metaTitle: formData.TitleAr, // للتوافق مع النظام القديم
    metaDescription: formData.DescriptionAr,
    metaKeywords: formData.KeywordsAr,
  });

  // تحديث tenantStore لإضافة الصفحة الجديدة إلى componentSettings
  const { tenantData } = useTenantStore.getState();
  const updatedTenantData = {
    ...tenantData,
    componentSettings: {
      ...tenantData?.componentSettings,
      [formData.slug]: {}, // إضافة الصفحة الجديدة مع object فارغ للمكونات
    },
    // إضافة WebsiteLayout
    WebsiteLayout: {
      ...tenantData?.WebsiteLayout,
      metaTags: {
        ...tenantData?.WebsiteLayout?.metaTags,
        pages: [
          ...(tenantData?.WebsiteLayout?.metaTags?.pages || []),
          {
            TitleAr: formData.TitleAr,
            TitleEn: formData.TitleEn,
            DescriptionAr: formData.DescriptionAr || formData.TitleAr,
            DescriptionEn: formData.DescriptionEn || formData.TitleEn,
            KeywordsAr: formData.KeywordsAr || formData.TitleAr,
            KeywordsEn: formData.KeywordsEn || formData.TitleEn,
            Author: formData.Author || formData.TitleAr,
            AuthorEn: formData.AuthorEn || formData.TitleEn,
            Robots: formData.Robots || "index, follow",
            RobotsEn: formData.RobotsEn || "index, follow",
            "og:title": formData["og:title"] || formData.TitleAr,
            "og:description":
              formData["og:description"] ||
              formData.DescriptionAr ||
              formData.TitleAr,
            "og:keywords":
              formData["og:keywords"] ||
              formData.KeywordsAr ||
              formData.TitleAr,
            "og:author":
              formData["og:author"] || formData.Author || formData.TitleAr,
            "og:robots":
              formData["og:robots"] || formData.Robots || "index, follow",
            "og:url": formData["og:url"] || `/${formData.slug}`,
            "og:image": formData["og:image"] || "",
            "og:type": formData["og:type"] || "website",
            "og:locale": formData["og:locale"] || "ar",
            "og:locale:alternate": formData["og:locale:alternate"] || "en",
            "og:site_name": formData["og:site_name"] || formData.TitleAr,
            "og:image:width": formData["og:image:width"] || "",
            "og:image:height": formData["og:image:height"] || "",
            "og:image:type": formData["og:image:type"] || "",
            "og:image:alt": formData["og:image:alt"] || formData.TitleAr,
            path: `/${formData.slug}`,
          },
        ],
      },
    },
  };

  // تحديث الـ store
  useTenantStore.setState({ tenantData: updatedTenantData });

  // تحديث editorStore مع WebsiteLayout
  const { addPageToWebsiteLayout } = useEditorStore.getState();
  addPageToWebsiteLayout({
    TitleAr: formData.TitleAr,
    TitleEn: formData.TitleEn,
    DescriptionAr: formData.DescriptionAr || formData.TitleAr,
    DescriptionEn: formData.DescriptionEn || formData.TitleEn,
    KeywordsAr: formData.KeywordsAr || formData.TitleAr,
    KeywordsEn: formData.KeywordsEn || formData.TitleEn,
    Author: formData.Author || formData.TitleAr,
    AuthorEn: formData.AuthorEn || formData.TitleEn,
    Robots: formData.Robots || "index, follow",
    RobotsEn: formData.RobotsEn || "index, follow",
    "og:title": formData["og:title"] || formData.TitleAr,
    "og:description":
      formData["og:description"] ||
      formData.DescriptionAr ||
      formData.TitleAr,
    "og:keywords":
      formData["og:keywords"] || formData.KeywordsAr || formData.TitleAr,
    "og:author":
      formData["og:author"] || formData.Author || formData.TitleAr,
    "og:robots":
      formData["og:robots"] || formData.Robots || "index, follow",
    "og:url": formData["og:url"] || `/${formData.slug}`,
    "og:image": formData["og:image"] || "",
    "og:type": formData["og:type"] || "website",
    "og:locale": formData["og:locale"] || "ar",
    "og:locale:alternate": formData["og:locale:alternate"] || "en",
    "og:site_name": formData["og:site_name"] || formData.TitleAr,
    "og:image:width": formData["og:image:width"] || "",
    "og:image:height": formData["og:image:height"] || "",
    "og:image:type": formData["og:image:type"] || "",
    "og:image:alt": formData["og:image:alt"] || formData.TitleAr,
    path: `/${formData.slug}`,
  });

  // استدعاء callback النجاح
  onSuccess?.(formData.slug);
}
