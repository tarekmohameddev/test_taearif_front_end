// Meta Tags utilities (server-safe, no "use client")

export type WebsiteLayoutMetaPage = {
  TitleAr?: string;
  TitleEn?: string;
  DescriptionAr?: string;
  DescriptionEn?: string;
  KeywordsAr?: string;
  KeywordsEn?: string;
  Author?: string;
  AuthorEn?: string;
  Robots?: string;
  RobotsEn?: string;
  "og:title"?: string | null;
  "og:description"?: string | null;
  "og:keywords"?: string | null;
  "og:author"?: string | null;
  "og:robots"?: string | null;
  "og:url"?: string | null;
  "og:image"?: string | null;
  "og:type"?: string | null;
  "og:locale"?: string | null;
  "og:locale:alternate"?: string | null;
  "og:site_name"?: string | null;
  "og:image:width"?: string | number | null;
  "og:image:height"?: string | number | null;
  "og:image:type"?: string | null;
  "og:image:alt"?: string | null;
  path: string;
};

export type WebsiteLayout = {
  metaTags?: {
    pages?: WebsiteLayoutMetaPage[];
  };
};

export type NormalizedMeta = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  keywordsAr: string;
  keywordsEn: string;
  authorAr: string;
  authorEn: string;
  robotsAr: string;
  robotsEn: string;
  og: {
    title: string;
    description: string;
    keywords: string;
    author: string;
    robots: string;
    url: string | null;
    image: string | null;
    type: string | null;
    locale: string | null;
    localeAlternate: string | null;
    siteName: string | null;
    imageWidth: string | number | null;
    imageHeight: string | number | null;
    imageType: string | null;
    imageAlt: string | null;
  };
};

const ensureLeadingSlash = (pathLike: string): string => {
  if (!pathLike) return "/";
  return pathLike.startsWith("/") ? pathLike : `/${pathLike}`;
};

// Valid OpenGraph types according to the specification
const VALID_OPENGRAPH_TYPES = [
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
];

const validateOpenGraphType = (type: string | null | undefined): string => {
  if (!type || typeof type !== "string") return "website";

  // Check if it's a valid OpenGraph type
  if (VALID_OPENGRAPH_TYPES.includes(type)) {
    return type;
  }

  // If it's not valid, return default
  return "website";
};

const normalizeSlugToPath = (slug: string): string => {
  if (!slug || slug === "homepage" || slug === "home") return "/";
  return ensureLeadingSlash(slug);
};

const defaultNormalizedMeta: NormalizedMeta = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  keywordsAr: "",
  keywordsEn: "",
  authorAr: "",
  authorEn: "",
  robotsAr: "index, follow",
  robotsEn: "index, follow",
  og: {
    title: "",
    description: "",
    keywords: "",
    author: "",
    robots: "index, follow",
    url: null,
    image: null,
    type: "website",
    locale: "ar",
    localeAlternate: "en",
    siteName: "",
    imageWidth: null,
    imageHeight: null,
    imageType: null,
    imageAlt: null,
  },
};

/**
 * Extract meta for a given slug/path from WebsiteLayout
 */
export function getMetaForSlug(
  websiteLayout: WebsiteLayout | null | undefined,
  slug: string,
): NormalizedMeta {
  const path = normalizeSlugToPath(slug);
  const pages = websiteLayout?.metaTags?.pages || [];
  // Prefer exact path match only; if not found, do NOT fallback to '/'
  // This allows route-specific defaults (e.g., /property/{id}) to take effect
  const match = pages.find((p) => ensureLeadingSlash(p.path) === path);

  if (!match) return { ...defaultNormalizedMeta };

  return {
    titleAr: match.TitleAr || "",
    titleEn: match.TitleEn || "",
    descriptionAr: match.DescriptionAr || "",
    descriptionEn: match.DescriptionEn || "",
    keywordsAr: match.KeywordsAr || "",
    keywordsEn: match.KeywordsEn || "",
    authorAr: match.Author || "",
    authorEn: match.AuthorEn || "",
    robotsAr: match.Robots || "index, follow",
    robotsEn: match.RobotsEn || "index, follow",
    og: {
      title:
        (match["og:title"] as string) || match.TitleAr || match.TitleEn || "",
      description:
        (match["og:description"] as string) ||
        match.DescriptionAr ||
        match.DescriptionEn ||
        "",
      keywords:
        (match["og:keywords"] as string) ||
        match.KeywordsAr ||
        match.KeywordsEn ||
        "",
      author:
        (match["og:author"] as string) || match.Author || match.AuthorEn || "",
      robots:
        (match["og:robots"] as string) ||
        match.Robots ||
        match.RobotsEn ||
        "index, follow",
      url: (match["og:url"] as string | null) ?? null,
      image: (match["og:image"] as string | null) ?? null,
      type: validateOpenGraphType(match["og:type"]),
      locale: (match["og:locale"] as string | null) ?? "ar",
      localeAlternate: (match["og:locale:alternate"] as string | null) ?? "en",
      siteName: (match["og:site_name"] as string | null) ?? "",
      imageWidth: (match["og:image:width"] as string | number | null) ?? null,
      imageHeight: (match["og:image:height"] as string | number | null) ?? null,
      imageType: (match["og:image:type"] as string | null) ?? null,
      imageAlt: (match["og:image:alt"] as string | null) ?? null,
    },
  };
}

/**
 * Load WebsiteLayout directly from tenantStore (client Zustand store) using dynamic import.
 * Safe to call in environments where the store is available (client/runtime).
 */
export async function getWebsiteLayoutFromTenantStore(): Promise<WebsiteLayout | null> {
  // Server-safe guard: only access Zustand store on the client
  if (typeof window === "undefined") return null;
  try {
    // Dynamic import to avoid marking this file as client-only
    const mod: any = await import("@/context/tenantStore.jsx");
    const useTenantStore = mod.default;
    if (!useTenantStore || typeof useTenantStore.getState !== "function") {
      return null;
    }
    const state = useTenantStore.getState();
    const tenantData = state?.tenantData || null;
    const websiteLayout: WebsiteLayout | null =
      tenantData?.WebsiteLayout || null;
    return websiteLayout;
  } catch (_err) {
    return null;
  }
}

/**
 * Convenience helper: get meta for a slug by reading WebsiteLayout from tenantStore.
 */
export async function getMetaForSlugFromStore(
  slug: string,
): Promise<NormalizedMeta> {
  const websiteLayout = await getWebsiteLayoutFromTenantStore();
  console.log("websiteLayout", websiteLayout);
  return getMetaForSlug(websiteLayout, slug);
}

/**
 * Server-side: fetch WebsiteLayout from backend using tenant identifier (websiteName).
 * This avoids relying on client stores during SSR/metadata generation.
 */
export async function getWebsiteLayoutFromBackend(
  tenantIdOrWebsiteName: string,
): Promise<WebsiteLayout | null> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_Backend_URL;
    if (!backendUrl) return null;

    const res = await fetch(`${backendUrl}/v1/tenant-website/getTenant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteName: tenantIdOrWebsiteName }),
      // cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.WebsiteLayout as WebsiteLayout) || null;
  } catch {
    return null;
  }
}

/**
 * Convenience helper for server: get meta for a slug by fetching WebsiteLayout from backend.
 */
export async function getMetaForSlugServer(
  slug: string,
  tenantIdOrWebsiteName: string,
): Promise<NormalizedMeta> {
  const websiteLayout = await getWebsiteLayoutFromBackend(
    tenantIdOrWebsiteName,
  );
  return getMetaForSlug(websiteLayout, slug);
}

/**
 * Create a flat list of meta tag descriptors suitable for rendering in a <head> manager
 * (Client code can map these to <meta>, <link> tags, etc.)
 */
export function toHeadDescriptors(
  meta: NormalizedMeta,
  locale: "ar" | "en" = "ar",
) {
  const title = locale === "ar" ? meta.titleAr : meta.titleEn;
  const description = locale === "ar" ? meta.descriptionAr : meta.descriptionEn;
  const keywords = locale === "ar" ? meta.keywordsAr : meta.keywordsEn;
  const robots = locale === "ar" ? meta.robotsAr : meta.robotsEn;

  const tags: Array<{ name?: string; property?: string; content: string }> = [];

  if (title) tags.push({ name: "title", content: title });
  if (description) tags.push({ name: "description", content: description });
  if (keywords) tags.push({ name: "keywords", content: keywords });
  if (robots) tags.push({ name: "robots", content: robots });

  if (meta.og.title)
    tags.push({ property: "og:title", content: meta.og.title });
  if (meta.og.description)
    tags.push({ property: "og:description", content: meta.og.description });
  if (meta.og.keywords)
    tags.push({ property: "og:keywords", content: meta.og.keywords });
  if (meta.og.author)
    tags.push({ property: "og:author", content: meta.og.author });
  if (meta.og.robots)
    tags.push({ property: "og:robots", content: meta.og.robots });
  if (meta.og.url)
    tags.push({ property: "og:url", content: String(meta.og.url) });
  if (meta.og.image)
    tags.push({ property: "og:image", content: String(meta.og.image) });
  if (meta.og.type)
    tags.push({ property: "og:type", content: String(meta.og.type) });
  if (meta.og.locale)
    tags.push({ property: "og:locale", content: String(meta.og.locale) });
  if (meta.og.localeAlternate)
    tags.push({
      property: "og:locale:alternate",
      content: String(meta.og.localeAlternate),
    });
  if (meta.og.siteName)
    tags.push({ property: "og:site_name", content: String(meta.og.siteName) });
  if (meta.og.imageWidth != null)
    tags.push({
      property: "og:image:width",
      content: String(meta.og.imageWidth),
    });
  if (meta.og.imageHeight != null)
    tags.push({
      property: "og:image:height",
      content: String(meta.og.imageHeight),
    });
  if (meta.og.imageType)
    tags.push({
      property: "og:image:type",
      content: String(meta.og.imageType),
    });
  if (meta.og.imageAlt)
    tags.push({ property: "og:image:alt", content: String(meta.og.imageAlt) });

  return tags;
}
