import { NextRequest, NextResponse } from "next/server";

const locales = ["ar", "en"];
const defaultLocale = "en";

// Default locale for live-editor pages
const liveEditorDefaultLocale = "ar";

// Cache environment variables to avoid repeated access
const PRODUCTION_DOMAIN =
  process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
const LOCAL_DOMAIN = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

// Cache regex patterns
const CUSTOM_DOMAIN_REGEX = /\.([a-z]{2,})$/i;

function getLocale(pathname: string) {
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (locales.includes(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

function removeLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (locales.includes(firstSegment)) {
    return "/" + segments.slice(2).join("/");
  }

  return pathname;
}

// Optimized: Extract both locale and pathname without locale in one pass
function extractLocaleAndPathname(pathname: string): {
  locale: string;
  pathnameWithoutLocale: string;
} {
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (locales.includes(firstSegment)) {
    return {
      locale: firstSegment,
      pathnameWithoutLocale: "/" + segments.slice(2).join("/"),
    };
  }

  return {
    locale: defaultLocale,
    pathnameWithoutLocale: pathname,
  };
}

// دالة للتحقق من Custom Domain (بدون API call للسرعة)
function getTenantIdFromCustomDomain(host: string): string | null {
  // Remove port from host (e.g., "example.com:3000" -> "example.com")
  const hostWithoutPort = host.split(":")[0];
  
  // التحقق من أن المستخدم على الدومين الأساسي
  const isOnBaseDomain = IS_DEVELOPMENT
    ? hostWithoutPort === LOCAL_DOMAIN || host === `${LOCAL_DOMAIN}:3000`
    : hostWithoutPort === PRODUCTION_DOMAIN || hostWithoutPort === `www.${PRODUCTION_DOMAIN}`;

  // إذا كان الدومين الأساسي، لا نعتبره custom domain
  if (isOnBaseDomain) {
    return null;
  }

  // التحقق من أن الـ host ليس subdomain من localhost أو production domain
  // إذا كان subdomain، يجب أن يتم التعامل معه في getTenantIdFromHost
  if (IS_DEVELOPMENT && hostWithoutPort.includes(LOCAL_DOMAIN)) {
    // هذا subdomain من localhost، يجب أن يتم التعامل معه في getTenantIdFromHost
    return null;
  }
  
  if (!IS_DEVELOPMENT && hostWithoutPort.includes(PRODUCTION_DOMAIN)) {
    // هذا subdomain من production domain، يجب أن يتم التعامل معه في getTenantIdFromHost
    return null;
  }

  // التحقق من أن الـ host هو custom domain (يحتوي على TLD مثل .com, .sa, .ae, .eg, إلخ)
  const isCustomDomain = CUSTOM_DOMAIN_REGEX.test(hostWithoutPort);

  if (!isCustomDomain) {
    return null;
  }

  // إرجاع الـ host نفسه كـ tenantId للـ Custom Domain (بدون API call)
  return hostWithoutPort;
}

// Cache reserved words as Set for O(1) lookup instead of O(n) array.includes()
const RESERVED_WORDS = new Set([
  "www",
  "api",
  "admin",
  "app",
  "mail",
  "ftp",
  "blog",
  "shop",
  "store",
  "dashboard",
  "live-editor",
  "auth",
  "login",
  "register",
]);

function getTenantIdFromHost(host: string): string | null {
  // Remove port from host (e.g., "kkkkk.localhost:3000" -> "kkkkk.localhost")
  const hostWithoutPort = host.split(":")[0];
  
  // For localhost development: tenant1.localhost:3000 -> tenant1
  if (IS_DEVELOPMENT && hostWithoutPort.includes(LOCAL_DOMAIN)) {
    const parts = hostWithoutPort.split(".");
    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 getTenantIdFromHost - DEBUG:", {
        host,
        hostWithoutPort,
        parts,
        partsLength: parts.length,
        firstPart: parts[0],
        localDomain: LOCAL_DOMAIN,
        isFirstPartNotLocalDomain: parts[0] !== LOCAL_DOMAIN,
      });
    }
    
    if (parts.length > 1 && parts[0] !== LOCAL_DOMAIN) {
      const potentialTenantId = parts[0].toLowerCase();

      // تحقق من أن الـ tenantId ليس من الكلمات المحجوزة (Set lookup is O(1))
      if (!RESERVED_WORDS.has(potentialTenantId)) {
        if (process.env.NODE_ENV === "development") {
          console.log("✅ getTenantIdFromHost - Found tenantId:", parts[0]);
        }
        return parts[0]; // Return original case
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("❌ getTenantIdFromHost - Reserved word:", potentialTenantId);
        }
      }
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("❌ getTenantIdFromHost - Invalid subdomain structure:", {
          partsLength: parts.length,
          firstPart: parts[0],
          localDomain: LOCAL_DOMAIN,
        });
      }
    }
  }

  // For production: tenant1.taearif.com -> tenant1
  // التحقق من أن الـ subdomain صحيح (يجب أن يكون لـ productionDomain فقط)
  if (!IS_DEVELOPMENT && hostWithoutPort.includes(PRODUCTION_DOMAIN)) {
    const parts = hostWithoutPort.split(".");
    if (parts.length > 2) {
      const potentialTenantId = parts[0].toLowerCase();
      const domainPart = parts.slice(1).join(".");

      // التحقق من أن الـ domain هو productionDomain بالضبط
      if (domainPart === PRODUCTION_DOMAIN) {
        // تحقق من أن الـ tenantId ليس من الكلمات المحجوزة (Set lookup is O(1))
        if (!RESERVED_WORDS.has(potentialTenantId)) {
          return parts[0]; // Return original case
        }
      }
    }
  }

  return null;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get("host") || "";

  // Skip proxy early for API routes, static files, and Next.js internals
  // This check should be first to avoid unnecessary processing
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/")
  ) {
    return NextResponse.next();
  }

  // Remove port from host for processing (e.g., "kkkkk.localhost:3000" -> "kkkkk.localhost")
  const hostWithoutPort = host.split(":")[0];
  
  // التحقق من أن الصفحة على الدومين الأساسي
  const isOnBaseDomain = IS_DEVELOPMENT
    ? hostWithoutPort === LOCAL_DOMAIN || host === `${LOCAL_DOMAIN}:3000`
    : hostWithoutPort === PRODUCTION_DOMAIN || hostWithoutPort === `www.${PRODUCTION_DOMAIN}`;

  // التحقق من أن الـ host هو custom domain (يحتوي على TLD مثل .com, .sa, .ae, .eg, إلخ)
  // لكن ليس الدومين الأساسي
  const hasCustomDomainExtension = CUSTOM_DOMAIN_REGEX.test(hostWithoutPort);
  const isCustomDomain = hasCustomDomainExtension && !isOnBaseDomain;

  // Extract tenantId from subdomain or custom domain
  let tenantId = getTenantIdFromHost(host);
  let domainType: "subdomain" | "custom" | null = tenantId ? "subdomain" : null;

  // إذا لم يتم العثور على tenantId من subdomain، تحقق من Custom Domain
  if (!tenantId) {
    tenantId = getTenantIdFromCustomDomain(host);
    if (tenantId) {
      domainType = "custom";
    }
  }
  
  // Debug logging
  console.log("🔍 proxy.ts - Tenant detection:", {
    host,
    hostWithoutPort,
    tenantId,
    domainType,
    isOnBaseDomain,
    hasCustomDomainExtension,
    isCustomDomain,
    pathname,
  });

  /*
   * ========================================
   * AUTO-REDIRECT TO ARABIC LOCALE (EXCEPT LIVE-EDITOR) - DISABLED
   * ========================================
   *
   * This section has been disabled to allow English pages to be accessible.
   * Previously, it handled automatic redirection of all pages to Arabic locale,
   * except for the live-editor page.
   *
   * PURPOSE (PREVIOUSLY):
   * - Force all pages to use Arabic locale (ar) regardless of the original URL
   * - Ensures consistent RTL experience across all sections
   * - Prevents users from accessing pages in English locale
   * - Excludes live-editor page from this redirection
   *
   * HOW IT WORKED (PREVIOUSLY):
   * 1. Detects if the current path is an English page (starts with /en)
   * 2. Checks if the page is NOT live-editor
   * 3. If both conditions are true, redirects to the same path with Arabic locale
   *
   * AFFECTED PAGES (PREVIOUSLY):
   * - /en/* -> /ar/* (except /en/live-editor)
   * - All pages except live-editor
   *
   * CURRENT BEHAVIOR:
   * - English pages are now accessible without redirection
   * - Users can access both Arabic and English versions
   * - Live-editor continues to work in both languages
   *
   * MODIFICATION NOTES:
   * - This feature has been disabled by commenting out the redirect logic
   * - To re-enable: Uncomment the redirect section below
   * - To change target locale: Replace "ar" with desired locale code
   * - To modify live-editor default: Change liveEditorDefaultLocale variable
   *
   * EXAMPLE (CURRENT):
   * User visits: /en/dashboard/analytics -> stays: /en/dashboard/analytics
   * User visits: /en/live-editor -> stays: /en/live-editor
   * User visits: /live-editor -> redirects to: /ar/live-editor
   */

  // DISABLED: Auto-redirect from English to Arabic
  // Check if this is an English page and NOT live-editor
  // const isEnglishPage = pathname.startsWith("/en/");
  // const isLiveEditor = pathname.startsWith("/en/live-editor");

  // if (isEnglishPage && !isLiveEditor) {
  //   // Extract the path without locale
  //   const pathWithoutLocale = pathname.replace("/en", "");
  //
  //   // Redirect to Arabic version of the page
  //   const newUrl = new URL(`/ar${pathWithoutLocale}`, request.url);
  //   return NextResponse.redirect(newUrl);
  // }

  // No special handling needed for /en/live-editor - let it stay in English

  // Check if pathname starts with a locale (optimized check)
  const firstPathSegment = pathname.split("/")[1];
  const pathnameHasLocale = locales.includes(firstPathSegment);

  // If no locale in pathname, redirect to appropriate default locale
  if (!pathnameHasLocale) {
    // Use Arabic as default for all pages
    const locale = "ar";

    // Preserve query parameters during locale redirect
    const searchParams = request.nextUrl.search;
    const newUrl = new URL(
      `/${locale}${pathname}${searchParams}`,
      request.url,
    );
    return NextResponse.redirect(newUrl);
  }

  // Extract locale and remove it from pathname for routing (optimized single pass)
  const { locale, pathnameWithoutLocale } =
    extractLocaleAndPathname(pathname);

  // Special case: if pathname is just /locale (e.g., /en), rewrite to homepage
  if (pathname === `/${locale}`) {
    const url = request.nextUrl.clone();
    url.pathname = "/";

    const response = NextResponse.rewrite(url);
    response.headers.set("x-locale", locale);
    response.headers.set("x-html-lang", locale);
    response.headers.set("x-pathname", "/");

    if (tenantId) {
      response.headers.set("x-tenant-id", tenantId);
    }

    return response;
  }

  // Check for owner authentication on owner pages
  if (
    pathnameWithoutLocale.startsWith("/owner/") &&
    !pathnameWithoutLocale.startsWith("/owner/login") &&
    !pathnameWithoutLocale.startsWith("/owner/register")
  ) {
    const ownerToken = request.cookies.get("owner_token")?.value;

    if (!ownerToken) {
      const loginUrl = new URL(`/${locale}/owner/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Create response with rewrite (only create once)
  const url = request.nextUrl.clone();
  url.pathname = pathnameWithoutLocale;

  const response = NextResponse.rewrite(url);

  // Set locale headers
  response.headers.set("x-locale", locale);
  response.headers.set("x-html-lang", locale);
  response.headers.set("x-pathname", pathnameWithoutLocale);

  // Set tenantId header if found
  if (tenantId) {
    console.log("✅ proxy.ts - Setting headers:", {
      tenantId,
      domainType,
      pathname: pathnameWithoutLocale,
      locale,
    });
    response.headers.set("x-tenant-id", tenantId);

    // تحديد نوع الـ domain (استخدام domainType المحسوب مسبقاً)
    if (domainType) {
      response.headers.set("x-domain-type", domainType);
    }
  } else {
    console.log("❌ proxy.ts - No tenantId found, headers not set");
  }

  // إضافة cache headers للمكونات الثابتة (عندما لا يوجد tenantId)
  if (
    !tenantId &&
    (pathnameWithoutLocale === "/" ||
      pathnameWithoutLocale === "/solutions" ||
      pathnameWithoutLocale === "/updates" ||
      pathnameWithoutLocale === "/landing" ||
      pathnameWithoutLocale === "/about-us")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
    response.headers.set("X-Component-Type", "taearif-static");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
