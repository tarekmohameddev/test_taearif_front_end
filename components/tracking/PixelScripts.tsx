"use client";

import { useEffect, useState, Fragment } from "react";
import Script from "next/script";
import { PixelData, fetchTenantPixels } from "@/lib/pixel-service";

interface PixelScriptsProps {
  tenantId: string | null;
}

export default function PixelScripts({ tenantId }: PixelScriptsProps) {
  const [pixels, setPixels] = useState<PixelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPixels() {
      if (!tenantId) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchTenantPixels(tenantId);
        setPixels(data);
      } catch (error) {
        console.error("Failed to fetch pixels:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPixels();
  }, [tenantId]);

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
            const gtmId = pixel.externalId.replace(/^GTM-/, ""); // Remove GTM- prefix if present
            const gtmKey = pixel._id || `${pixel.provider}-${pixel.externalId}`;
            return (
              <Fragment key={gtmKey}>
                <Script
                  id={`gtm-${gtmKey}`}
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                      })(window,document,'script','dataLayer','${gtmId}');
                    `,
                  }}
                />
                <noscript>
                  <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                  />
                </noscript>
              </Fragment>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
