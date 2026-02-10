"use client";

import { useEffect, useState, Fragment } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { PixelData, fetchTenantPixels } from "@/lib/pixel-service";
import { initializeDataLayer, setTenantInfo } from "@/lib/gtm-utils";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface PixelScriptsProps {
  tenantId: string | null;
  pageType?: string; // ⭐ من Gemini: لمعرفة نوع الصفحة (home, project, etc.)
}

// ⭐ Component to load GTM script directly in <head> (100% correct installation)
interface GTMScriptLoaderProps {
  gtmId: string;
  scriptId: string;
  tenantId: string | null;
}

function GTMScriptLoader({ gtmId, scriptId, tenantId }: GTMScriptLoaderProps) {
  useEffect(() => {
    // Check if script already exists to prevent duplicates
    if (typeof document !== "undefined") {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        console.log("⚠️ GTM script already exists:", scriptId);
        return;
      }

      // Initialize dataLayer before GTM script (as per Google's official code)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
        tenant_id: tenantId,
      });

      // Create inline script with GTM initialization code (exactly as Google recommends)
      const inlineScript = document.createElement('script');
      inlineScript.id = `${scriptId}-inline`;
      inlineScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js','tenant_id':'${tenantId}'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;

      // Create and inject GTM script directly into <head> as early as possible
      const head = document.head || document.getElementsByTagName('head')[0];
      const firstScript = head.getElementsByTagName('script')[0];
      
      // Insert inline script first (initializes dataLayer), then the async script
      if (firstScript) {
        head.insertBefore(inlineScript, firstScript);
      } else {
        head.appendChild(inlineScript);
      }

      inlineScript.onload = () => {
        console.log("✅ GTM Script loaded successfully in <head>:", gtmId);
        if (typeof window !== "undefined") {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "gtm_loaded",
            gtmId: gtmId,
            tenantId: tenantId,
          });
        }
      };

      inlineScript.onerror = () => {
        console.error("❌ GTM Script failed to load:", gtmId);
      };

      // Cleanup function
      return () => {
        const scriptToRemove = document.getElementById(`${scriptId}-inline`);
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [gtmId, scriptId, tenantId]);

  // Return noscript fallback for body
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

export default function PixelScripts({ tenantId, pageType }: PixelScriptsProps) {
  const [pixels, setPixels] = useState<PixelData[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function loadPixels() {
      if (!tenantId) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchTenantPixels(tenantId);
        setPixels(data);
        
        // ⭐ من Claude: Initialize dataLayer for GTM
        initializeDataLayer();
        
        // ⭐ من Claude: Set tenant info in dataLayer
        setTenantInfo(tenantId, {
          tenantType: "real_estate",
          loadedPixels: data.map(p => p.provider),
        });
        
        console.log("🎯 Pixels loaded for tenant:", tenantId, data);
      } catch (error) {
        console.error("Failed to fetch pixels:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPixels();
  }, [tenantId]);

  // ⭐ من Gemini: تتبع عميق لتغييرات المسار (Deep Tracking)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      
      const fullPath = pathname + (searchParams?.toString() ? "?" + searchParams.toString() : "");
      
      // ⭐ من Gemini: دفع حدث مخصص لـ GTM لضمان التقاط الصفحات في الـ SPA (Next.js)
      window.dataLayer.push({
        event: "virtual_pageview", // ⭐ من Gemini
        page_path: fullPath,
        page_title: document.title,
        tenant_id: tenantId,
        page_type: pageType || "dynamic", // ⭐ من Gemini
      });
    }
  }, [pathname, searchParams, tenantId, pageType]);

  if (loading || pixels.length === 0) return null;

  return (
    <>
      {pixels.map((pixel) => {
        switch (pixel.provider) {
          case "tiktok":
            return (
              <Script
                key={pixel._id || `${pixel.provider}-${pixel.externalId}`}
                id={`tiktok-pixel-${pixel._id || pixel.externalId}`}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    !function (w, d, t) {
                      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e[0]]=function(){t.push([e[0]].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                    
                      ttq.load('${pixel.externalId}');
                      ttq.push(['page']);
                    }(window, document, 'ttq');
                  `,
                }}
              />
            );
          case "meta":
            const metaKey = pixel._id || `${pixel.provider}-${pixel.externalId}`;
            return (
              <Fragment key={metaKey}>
                <Script
                  id={`meta-pixel-${metaKey}`}
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${pixel.externalId}');
                    fbq('track', 'PageView');
                  `,
                  }}
                />
                <noscript>
                  <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src={`https://www.facebook.com/tr?id=${pixel.externalId}&ev=PageView&noscript=1`}
                    alt=""
                  />
                </noscript>
              </Fragment>
            );
          case "snapchat":
            return (
              <Script
                key={pixel._id || `${pixel.provider}-${pixel.externalId}`}
                id={`snapchat-pixel-${pixel._id || pixel.externalId}`}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
                    {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
                    a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
                    r.src=n;var u=t.getElementsByTagName(s)[0];
                    u.parentNode.insertBefore(r,u);})(window,document,
                    'https://sc-static.net/scevent.min.js');
                
                    snaptr('init', '${pixel.externalId}');
                    snaptr('track', 'PAGE_VIEW');
                  `,
                }}
              />
            );
          case "gtm":
            // ⭐ CRITICAL FIX: GTM needs full ID with GTM- prefix
            // ⭐ من Gemini + Claude: التأكد القاطع من وجود بادئة GTM-
            let gtmId = pixel.externalId.trim();
            
            // Check if already has GTM- prefix (case-insensitive)
            if (!gtmId.toUpperCase().startsWith("GTM-")) {
              // Remove any existing gtm- prefix first (case-insensitive)
              gtmId = gtmId.replace(/^gtm-/i, "");
              // Add GTM- prefix in uppercase
              gtmId = `GTM-${gtmId}`;
            } else {
              // Normalize to uppercase GTM-
              gtmId = gtmId.replace(/^gtm-/i, "GTM-");
            }
            
            // ⭐ FIX: استخدام gtmId بعد إزالة البادئة لتجنب التكرار في id
            const idWithoutPrefix = gtmId.replace(/^GTM-/i, "");
            const gtmScriptId = `gtm-${idWithoutPrefix.toLowerCase()}`;
            const gtmKey = pixel._id || gtmScriptId;
            
            // Debug log to verify GTM loading
            console.log("🔵 GTM Pixel Loading:", {
              originalExternalId: pixel.externalId,
              normalizedGtmId: gtmId,
              scriptId: gtmScriptId,
              provider: pixel.provider,
              settings: pixel.settings,
            });
            
            return (
              <GTMScriptLoader
                key={gtmKey}
                gtmId={gtmId}
                scriptId={gtmScriptId}
                tenantId={tenantId}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
