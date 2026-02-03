import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";
import { ClientReCaptchaLoader } from "./ClientReCaptchaLoader";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const pathname = headersList.get("x-pathname") || "";
  const locale = headersList.get("x-locale") || "";

  // تحديد الصفحات التي تحتاج dir ديناميكي
  const landingPages = [
    "/", // الصفحة الرئيسية
    "/solutions",
    "/updates",
    "/support-center",
    "/landing",
    "/about-us",
  ];

  const isLandingPage = landingPages.includes(pathname);

  // تحديد dir بناءً على اللغة للصفحات المحددة فقط
  const dir = isLandingPage ? (locale === "ar" ? "rtl" : "ltr") : "rtl";

  // إعادة التوجيه من الإنجليزية إلى العربية (استثناء live-editor وصفحات landing)
  const isLiveEditorPage =
    pathname === "/live-editor" || pathname.startsWith("/live-editor/");

  if (locale === "en" && !isLiveEditorPage && !isLandingPage) {
    const redirectUrl = `/ar${pathname}`;
    redirect(redirectUrl);
  }

  // تحديد الصفحات المسموح بها لـ GTM و Clarity
  const allowedPages = [
    "/dashboard",
    "/live-editor",
    "/login",
    "/register",
    "/", // الصفحة الرئيسية للشركة
    "/about-us",
    "/solutions",
    "/updates",
    "/support-center",
    "/landing",
  ];

  // التحقق من أن الصفحة مسموح بها وليس هناك subdomain
  const shouldLoadAnalytics =
    !tenantId &&
    allowedPages.some(
      (page) => pathname === page || pathname.startsWith(page + "/"),
    );

  return (
    <html lang="ar" dir={dir} className="light" suppressHydrationWarning>
      <head>
        {/* Font preloading for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          as="style"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          />
        </noscript>
        {/* Google Tag Manager - فقط للصفحات المسموح بها وبدون subdomain */}
        {shouldLoadAnalytics && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KBL37C9T');`,
            }}
          />
        )}
        {/* End Google Tag Manager */}

        {/* Microsoft Clarity - فقط للصفحات المسموح بها وبدون subdomain */}
        {shouldLoadAnalytics && (
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "ppln6ugd3t");
              `,
            }}
          />
        )}
      </head>
      <body>
        {/* Google Tag Manager (noscript) - فقط للصفحات المسموح بها وبدون subdomain */}
        {shouldLoadAnalytics && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-KBL37C9T"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Toaster />
          <ClientReCaptchaLoader>
            <ClientLayout>{children}</ClientLayout>
          </ClientReCaptchaLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
