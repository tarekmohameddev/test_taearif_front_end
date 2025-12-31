import { NextRequest, NextResponse } from "next/server";

const locales = ["ar", "en"];
const defaultLocale = "en";

// Default locale for live-editor pages
const liveEditorDefaultLocale = "ar";

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

// دالة للتحقق من Custom Domain (بدون API call للسرعة)
function getTenantIdFromCustomDomain(host: string): string | null {
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
  const isDevelopment = process.env.NODE_ENV === "development";

  // التحقق من أن المستخدم على الدومين الأساسي
  const isOnBaseDomain = isDevelopment
    ? host === localDomain || host === `${localDomain}:3000`
    : host === productionDomain || host === `www.${productionDomain}`;

  // إذا كان الدومين الأساسي، لا نعتبره custom domain
  if (isOnBaseDomain) {
    console.log("🔍 Proxy: Host is base domain, not custom domain:", host);
    return null;
  }

  // التحقق من أن الـ host هو custom domain (يحتوي على TLD مثل .com, .sa, .ae, .eg, إلخ)
  const isCustomDomain = /\.([a-z]{2,})$/i.test(host);

  if (!isCustomDomain) {
    console.log("🔍 Proxy: Host is not a custom domain:", host);
    return null;
  }

  // إرجاع الـ host نفسه كـ tenantId للـ Custom Domain (بدون API call)
  console.log("✅ Proxy: Custom domain detected:", host);
  return host;
}

function getTenantIdFromHost(host: string): string | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
  const isDevelopment = process.env.NODE_ENV === "development";

  // Extract domain from API URL for local development
  const apiHostname = new URL(apiUrl).hostname;

  // قائمة بالكلمات المحجوزة التي لا يجب أن تكون tenantId
  const reservedWords = [
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
  ];

  console.log("🔍 Proxy: Checking host:", host);
  console.log("🔍 Proxy: Local domain:", localDomain);
  console.log("🔍 Proxy: Production domain:", productionDomain);
  console.log("🔍 Proxy: Is development:", isDevelopment);
  console.log("🔍 Proxy: NODE_ENV:", process.env.NODE_ENV);

  // For localhost development: tenant1.localhost:3000 -> tenant1
  if (isDevelopment && host.includes(localDomain)) {
    const parts = host.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const potentialTenantId = parts[0];
      console.log("🔍 Proxy: Potential tenant ID (local):", potentialTenantId);

      // تحقق من أن الـ tenantId ليس من الكلمات المحجوزة
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        console.log("✅ Proxy: Valid tenant ID (local):", potentialTenantId);
        return potentialTenantId;
      } else {
        console.log("❌ Proxy: Reserved word (local):", potentialTenantId);
      }
    }
  }

  // For production: tenant1.taearif.com -> tenant1
  // التحقق من أن الـ subdomain صحيح (يجب أن يكون لـ productionDomain فقط)
  if (!isDevelopment && host.includes(productionDomain)) {
    const parts = host.split(".");
    if (parts.length > 2) {
      const potentialTenantId = parts[0];
      const domainPart = parts.slice(1).join(".");

      // التحقق من أن الـ domain هو productionDomain بالضبط
      if (domainPart === productionDomain) {
        console.log(
          "🔍 Proxy: Potential tenant ID (production):",
          potentialTenantId,
        );

        // تحقق من أن الـ tenantId ليس من الكلمات المحجوزة
        if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
          console.log(
            "✅ Proxy: Valid tenant ID (production):",
            potentialTenantId,
          );
          return potentialTenantId;
        } else {
          console.log(
            "❌ Proxy: Reserved word (production):",
            potentialTenantId,
          );
        }
      } else {
        console.log(
          "❌ Proxy: Invalid subdomain - not for production domain:",
          domainPart,
        );
      }
    }
  }

  console.log("❌ Proxy: No valid tenant ID found");
  return null;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get("host") || "";

  // DEBUG: Log all requests
  console.log("🔍 Proxy Debug - Request:", {
    pathname,
    host,
    url: request.url,
  });

  // قائمة الصفحات التي يجب أن تكون على الدومين الأساسي فقط
  const systemPages = [
    "/dashboard",
    "/live-editor",
    "/login",
    "/oauth",
    "/onboarding",
    "/register",
    "/updates",
    "/solutions",
    "/landing",
    "/about-us",
  ];

  // التحقق من أن الصفحات النظامية على الدومين الأساسي
  const isSystemPage = systemPages.some((page) => pathname.startsWith(page));
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
  const isDevelopment = process.env.NODE_ENV === "development";

  // التحقق من أن الصفحة على الدومين الأساسي
  const isOnBaseDomain = isDevelopment
    ? host === localDomain || host === `${localDomain}:3000`
    : host === productionDomain || host === `www.${productionDomain}`;

  // التحقق من أن الـ host هو custom domain (يحتوي على TLD مثل .com, .sa, .ae, .eg, إلخ)
  // لكن ليس الدومين الأساسي
  const hasCustomDomainExtension = /\.([a-z]{2,})$/i.test(host);
  const isCustomDomain = hasCustomDomainExtension && !isOnBaseDomain;

  // إذا كان custom domain، اعتبر جميع الصفحات (بما في ذلك النظامية) كصفحات tenant
  if (isCustomDomain) {
    console.log(
      "🔍 Proxy: Custom domain detected, treating all pages (including system pages) as tenant-specific:",
      host,
    );
    // لا نحتاج لإعادة توجيه، فقط نمرر للخطوة التالية
  }

  // Extract tenantId from subdomain or custom domain
  let tenantId = getTenantIdFromHost(host);

  // إذا لم يتم العثور على tenantId من subdomain، تحقق من Custom Domain
  if (!tenantId) {
    tenantId = getTenantIdFromCustomDomain(host);
  }

  // Skip proxy for API routes, static files, and Next.js internals
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

  // تحسين الأداء للمكونات الثابتة - إضافة cache headers
  let response = NextResponse.next();

  // إضافة cache headers للمكونات الثابتة (عندما لا يوجد tenantId)
  if (
    !tenantId &&
    (pathname === "/" ||
      pathname === "/solutions" ||
      pathname === "/updates" ||
      pathname === "/landing" ||
      pathname === "/about-us")
  ) {
    // تحسين cache للمكونات Taearif
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
    response.headers.set("X-Component-Type", "taearif-static");
  }

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

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  console.log("🔍 Proxy Debug - Locale Check:", {
    pathname,
    pathnameHasLocale,
    tenantId,
    host,
  });

  // If no locale in pathname, redirect to appropriate default locale
  if (!pathnameHasLocale) {
    // Use Arabic as default for all pages
    const locale = "ar";

    // Redirect for all pages that don't have locale (including homepage, solutions, etc.)
    const shouldRedirect = true;

    console.log("🔍 Proxy Debug - Redirect Decision:", {
      pathname,
      locale,
      tenantId,
      shouldRedirect,
      reason: "All pages without locale should redirect to add locale",
    });

    if (shouldRedirect) {
      // Preserve query parameters during locale redirect
      const searchParams = request.nextUrl.search; // Get ?key=value
      const newUrl = new URL(
        `/${locale}${pathname}${searchParams}`,
        request.url,
      );
      console.log("🔄 Proxy Debug - Redirecting:", {
        from: request.url,
        to: newUrl.toString(),
        preservedParams: searchParams,
      });
      return NextResponse.redirect(newUrl);
    }
  }

  // Extract locale and remove it from pathname for routing
  const locale = getLocale(pathname);
  const pathnameWithoutLocale = removeLocaleFromPathname(pathname);

  // 🔍 Debug logging for rewrite process
  console.log("🔍 Proxy - Rewrite Debug:", {
    originalPathname: pathname,
    locale,
    pathnameWithoutLocale,
    tenantId,
    host,
  });

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
      console.log("🔒 Proxy: No owner token found, redirecting to login");
      const loginUrl = new URL(`/${locale}/owner/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Rewrite the URL to remove the locale prefix
  const url = request.nextUrl.clone();
  url.pathname = pathnameWithoutLocale;

  console.log("🔍 Proxy - Before Rewrite:", {
    originalUrl: request.url,
    rewriteUrl: url.toString(),
    pathnameWithoutLocale,
  });

  response = NextResponse.rewrite(url);

  console.log("🔍 Proxy - After Rewrite:", {
    responseUrl: response.url,
    headers: {
      "x-locale": response.headers.get("x-locale"),
      "x-pathname": response.headers.get("x-pathname"),
      "x-tenant-id": response.headers.get("x-tenant-id"),
    },
  });

  // Set locale headers
  response.headers.set("x-locale", locale);
  response.headers.set("x-html-lang", locale);
  response.headers.set("x-pathname", pathnameWithoutLocale);

  // Set tenantId header if found
  if (tenantId) {
    console.log("✅ Proxy: Setting tenant ID header:", tenantId);
    response.headers.set("x-tenant-id", tenantId);

    // تحديد نوع الـ domain
    const domainType = isCustomDomain ? "custom" : "subdomain";
    response.headers.set("x-domain-type", domainType);

    console.log("✅ Proxy: Domain type:", domainType);
  } else {
    console.log("❌ Proxy: No tenant ID found for host:", host);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
