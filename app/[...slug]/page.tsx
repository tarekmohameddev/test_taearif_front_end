import { headers } from "next/headers";
import { getMetaForSlugServer } from "@/lib/metaTags";
import { getDefaultSeoData } from "@/lib/defaultSeo";
import TenantPageWrapper from "../TenantPageWrapper";
import { isMultiLevelPage } from "@/lib-liveeditor/multiLevelPages";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const locale = headersList.get("x-locale") || "ar";
  const { slug: slugArray } = await params;

  // Join slug array to create path (e.g., ["project", "samy"] -> "/project/samy")
  const slugPath = `/${slugArray?.join("/") || ""}`;

  if (!tenantId) return {} as any;

  let meta = await getMetaForSlugServer(slugPath, tenantId);
  if (!meta || (!meta.titleAr && !meta.titleEn)) {
    const def = getDefaultSeoData(slugPath);
    meta = {
      titleAr: def.TitleAr,
      titleEn: def.TitleEn,
      descriptionAr: def.DescriptionAr,
      descriptionEn: def.DescriptionEn,
      keywordsAr: def.KeywordsAr,
      keywordsEn: def.KeywordsEn,
      authorAr: def.Author,
      authorEn: def.AuthorEn,
      robotsAr: def.Robots,
      robotsEn: def.RobotsEn,
      og: {
        title: def["og:title"],
        description: def["og:description"],
        keywords: def["og:keywords"],
        author: def["og:author"],
        robots: def["og:robots"],
        url: def["og:url"],
        image: def["og:image"],
        type: def["og:type"],
        locale: def["og:locale"],
        localeAlternate: def["og:locale:alternate"],
        siteName: def["og:site_name"],
        imageWidth: def["og:image:width"],
        imageHeight: def["og:image:height"],
        imageType: def["og:image:type"],
        imageAlt: def["og:image:alt"],
      },
    };
  }

  const title =
    locale === "ar"
      ? meta.titleAr || meta.titleEn || undefined
      : meta.titleEn || meta.titleAr || undefined;
  const description =
    locale === "ar"
      ? meta.descriptionAr || meta.descriptionEn || undefined
      : meta.descriptionEn || meta.descriptionAr || undefined;

  return {
    title,
    description,
    openGraph: {
      title: meta.og.title || title,
      description: meta.og.description || description,
      url: meta.og.url || undefined,
      images: meta.og.image
        ? [
            {
              url: String(meta.og.image),
              alt: meta.og.imageAlt || undefined,
              width:
                meta.og.imageWidth != null
                  ? Number(meta.og.imageWidth)
                  : undefined,
              height:
                meta.og.imageHeight != null
                  ? Number(meta.og.imageHeight)
                  : undefined,
              type: meta.og.imageType || undefined,
            },
          ]
        : undefined,
      type: meta.og.type || undefined,
      siteName: meta.og.siteName || undefined,
      locale: locale || meta.og.locale || undefined,
      alternateLocale: meta.og.localeAlternate || undefined,
    },
  } as any;
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const domainType = headersList.get("x-domain-type") as
    | "subdomain"
    | "custom"
    | null;
  const { slug: slugArray } = await params;

  // 🔍 Debug logging for route matching
  console.log("🔍 [...slug]/page.tsx - Route Match:", {
    slugArray,
    slugArrayLength: slugArray?.length,
    tenantId,
    domainType,
  });

  // Handle complex paths: ["property-requests", "create"] -> slug: "property-requests/create"
  // Or single slug: ["about"] -> slug: "about"
  // Or multi-level: ["project", "samy"] -> slug: "project", dynamicSlug: "samy"
  const firstSegment = slugArray?.[0] || "";
  const isMultiLevel = isMultiLevelPage(firstSegment);
  
  // For multi-level pages, keep the original behavior
  // For other paths, join all segments to support complex paths like "property-requests/create"
  const slug = isMultiLevel
    ? firstSegment
    : slugArray?.join("/") || "";
  const dynamicSlug =
    isMultiLevel && slugArray?.length > 1 ? slugArray[1] : undefined;

  console.log("🔍 [...slug]/page.tsx - Processed:", {
    slug,
    isMultiLevel,
    dynamicSlug,
    tenantId,
    domainType,
  });

  if (!tenantId) {
    console.log("❌ [...slug]/page.tsx - No tenantId found!");
  }

  return (
    <TenantPageWrapper
      tenantId={tenantId}
      slug={slug}
      dynamicSlug={dynamicSlug}
      domainType={domainType || undefined}
    />
  );
}
