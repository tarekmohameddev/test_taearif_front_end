import { useMemo } from "react";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { useEditorLocale } from "@/context/editorI18nStore";
import { Page } from "../types/types";
import { getDefaultSeoData } from "../utils/pageHelpers";

export function useAvailablePages(
  recentlyAddedPages: string[],
  editorWebsiteLayout: any[],
) {
  const { tenantData } = useTenantStore();
  const { locale } = useEditorLocale();

  const availablePages = useMemo(() => {
    const pages: Page[] = [];

    // تحويل componentSettings إلى object عادي إذا كان Map
    const componentSettings =
      tenantData?.componentSettings instanceof Map
        ? Object.fromEntries(tenantData.componentSettings)
        : tenantData?.componentSettings;

    // تحويل WebsiteLayout إلى object عادي إذا كان Map
    const websiteLayout =
      tenantData?.WebsiteLayout instanceof Map
        ? Object.fromEntries(tenantData.WebsiteLayout)
        : tenantData?.WebsiteLayout;

    // إضافة الصفحات من componentSettings مع دمج WebsiteLayout
    if (componentSettings && typeof componentSettings === "object") {
      const componentSettingsKeys = Object.keys(componentSettings);

      componentSettingsKeys.forEach((pageSlug) => {
        if (pageSlug !== "homepage") {
          const pageName = pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);

          // البحث عن بيانات SEO للصفحة في WebsiteLayout
          let seoData = null;
          if (websiteLayout?.metaTags?.pages) {
            seoData = websiteLayout.metaTags.pages.find(
              (page: any) =>
                page.path === `/${pageSlug}` || page.path === pageSlug,
            );
          }

          // التحقق من وجود بيانات SEO
          const hasSeoData =
            seoData &&
            (seoData.TitleAr ||
              seoData.TitleEn ||
              seoData.DescriptionAr ||
              seoData.DescriptionEn);

          // إنشاء كائن الصفحة مع دمج البيانات
          const pageData: Page = {
            slug: pageSlug,
            name: pageName,
            path: `/${pageSlug}`,
            seo: hasSeoData
              ? {
                  TitleAr: seoData.TitleAr,
                  TitleEn: seoData.TitleEn,
                  DescriptionAr: seoData.DescriptionAr,
                  DescriptionEn: seoData.DescriptionEn,
                  KeywordsAr: seoData.KeywordsAr,
                  KeywordsEn: seoData.KeywordsEn,
                  Author: seoData.Author,
                  AuthorEn: seoData.AuthorEn,
                  Robots: seoData.Robots,
                  RobotsEn: seoData.RobotsEn,
                  "og:title": seoData["og:title"],
                  "og:description": seoData["og:description"],
                  "og:keywords": seoData["og:keywords"],
                  "og:author": seoData["og:author"],
                  "og:robots": seoData["og:robots"],
                  "og:url": seoData["og:url"],
                  "og:image": seoData["og:image"],
                  "og:type": seoData["og:type"],
                  "og:locale": seoData["og:locale"],
                  "og:locale:alternate": seoData["og:locale:alternate"],
                  "og:site_name": seoData["og:site_name"],
                  "og:image:width": seoData["og:image:width"],
                  "og:image:height": seoData["og:image:height"],
                  "og:image:type": seoData["og:image:type"],
                  "og:image:alt": seoData["og:image:alt"],
                }
              : getDefaultSeoData(pageSlug),
          };

          pages.push(pageData);
        }
      });
    }

    // إضافة الصفحات المضافة حديثاً
    recentlyAddedPages.forEach((pageSlug) => {
      const exists = pages.some((page) => page.slug === pageSlug);
      if (!exists) {
        const pageName = pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);
        pages.push({
          slug: pageSlug,
          name: pageName,
          path: `/${pageSlug}`,
        });
      }
    });

    // إضافة الصفحة الرئيسية في النهاية مع البيانات الافتراضية
    const homepageExists = pages.some(
      (page) => page.slug === "" || page.path === "",
    );
    if (!homepageExists) {
      pages.unshift({
        slug: "",
        name: "Homepage",
        path: "",
        seo: getDefaultSeoData(""),
      });
    }

    // إضافة الصفحات الثابتة الإجبارية
    const staticPages = [
      { slug: "project", name: locale === "ar" ? "صفحة المشروع" : "Project Page" },
      { slug: "property", name: locale === "ar" ? "صفحة العقار" : "Property Page" },
      { slug: "create-request", name: locale === "ar" ? "إنشاء طلب" : "Create Request" },
      { slug: "blog", name: locale === "ar" ? "صفحة المنشور" : "Blog Post Page" },
      { slug: "real-estate", name: locale === "ar" ? "العقارات والمشاريع" : "Real Estate & Projects" },
    ];

    staticPages.forEach(({ slug, name }) => {
      const pageExists = pages.some(
        (page) => page.slug === slug || page.path === `/${slug}`,
      );
      if (!pageExists) {
        let seoData = null;
        if (websiteLayout?.metaTags?.pages) {
          seoData = websiteLayout.metaTags.pages.find(
            (page: any) => page.path === `/${slug}` || page.path === slug,
          );
        }

        const hasSeoData =
          seoData &&
          (seoData.TitleAr ||
            seoData.TitleEn ||
            seoData.DescriptionAr ||
            seoData.DescriptionEn);

        pages.push({
          slug,
          name,
          path: `/${slug}`,
          isStatic: true,
          seo: hasSeoData
            ? {
                TitleAr: seoData.TitleAr,
                TitleEn: seoData.TitleEn,
                DescriptionAr: seoData.DescriptionAr,
                DescriptionEn: seoData.DescriptionEn,
                KeywordsAr: seoData.KeywordsAr,
                KeywordsEn: seoData.KeywordsEn,
                Author: seoData.Author,
                AuthorEn: seoData.AuthorEn,
                Robots: seoData.Robots,
                RobotsEn: seoData.RobotsEn,
                "og:title": seoData["og:title"],
                "og:description": seoData["og:description"],
                "og:keywords": seoData["og:keywords"],
                "og:author": seoData["og:author"],
                "og:robots": seoData["og:robots"],
                "og:url": seoData["og:url"],
                "og:image": seoData["og:image"],
                "og:type": seoData["og:type"],
                "og:locale": seoData["og:locale"],
                "og:locale:alternate": seoData["og:locale:alternate"],
                "og:site_name": seoData["og:site_name"],
                "og:image:width": seoData["og:image:width"],
                "og:image:height": seoData["og:image:height"],
                "og:image:type": seoData["og:image:type"],
                "og:image:alt": seoData["og:image:alt"],
              }
            : getDefaultSeoData(slug),
        });
      }
    });

    return pages;
  }, [tenantData, recentlyAddedPages, editorWebsiteLayout, locale]);

  return { availablePages };
}
