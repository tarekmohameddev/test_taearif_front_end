"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  initializeDataLayer,
  trackPageView,
  trackVirtualPageView,
} from "@/lib/gtm-utils";

interface GTMProviderProps {
  children: React.ReactNode;
}

// ⭐ GTM Container ID للمشروع بالكامل (عام لجميع التجار)
const GTM_ID = "GTM-KS62NNTG";

export default function GTMProvider({ children }: GTMProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize dataLayer on mount
  useEffect(() => {
    initializeDataLayer();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");

      // Track virtual page view for SPA navigation
      trackVirtualPageView(url, document.title);

      if (process.env.NODE_ENV === "development") {
        console.log("📍 GTM Page View Tracked:", {
          url,
          pathname,
          search: searchParams?.toString(),
        });
      }
    }
  }, [pathname, searchParams]);

  // Track initial page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      trackPageView(window.location.href, document.title);
    }
  }, []);

  // Add automatic click tracking for all buttons and links
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === "BUTTON" || target.closest("button")) {
        const button = target.tagName === "BUTTON" ? target : target.closest("button");
        const buttonText = button?.textContent?.trim() || "Unknown Button";
        const buttonId = button?.id || "";
        const buttonClass = button?.className || "";
        
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "button_click",
            buttonText,
            buttonId,
            buttonClass,
            buttonLocation: window.location.pathname,
            timestamp: new Date().toISOString(),
          });
          if (process.env.NODE_ENV === "development") {
            console.log("🔘 Button Click Tracked:", buttonText);
          }
        }
      }
      
      // Track link clicks
      if (target.tagName === "A" || target.closest("a")) {
        const link = target.tagName === "A" ? target : target.closest("a");
        const linkHref = link?.getAttribute("href") || "";
        const linkText = link?.textContent?.trim() || "Unknown Link";
        const isExternal = linkHref.startsWith("http") && !linkHref.includes(window.location.hostname);
        
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "link_click",
            linkUrl: linkHref,
            linkText,
            linkType: isExternal ? "external" : "internal",
            linkLocation: window.location.pathname,
            timestamp: new Date().toISOString(),
          });
          if (process.env.NODE_ENV === "development") {
            console.log("🔗 Link Click Tracked:", linkText, linkHref);
          }
        }
      }

      // Track phone number clicks
      if (target.tagName === "A" || target.closest("a")) {
        const link = target.tagName === "A" ? target : target.closest("a");
        const href = link?.getAttribute("href") || "";
        
        if (href.startsWith("tel:")) {
          const phoneNumber = href.replace("tel:", "");
          if (window.dataLayer) {
            window.dataLayer.push({
              event: "phone_click",
              phoneNumber,
              location: window.location.pathname,
              timestamp: new Date().toISOString(),
            });
            if (process.env.NODE_ENV === "development") {
              console.log("📞 Phone Click Tracked:", phoneNumber);
            }
          }
        }
        
        // Track email clicks
        if (href.startsWith("mailto:")) {
          const email = href.replace("mailto:", "");
          if (window.dataLayer) {
            window.dataLayer.push({
              event: "email_click",
              email,
              location: window.location.pathname,
              timestamp: new Date().toISOString(),
            });
            if (process.env.NODE_ENV === "development") {
              console.log("📧 Email Click Tracked:", email);
            }
          }
        }
        
        // Track WhatsApp clicks
        if (href.includes("wa.me") || href.includes("whatsapp")) {
          if (window.dataLayer) {
            window.dataLayer.push({
              event: "whatsapp_click",
              url: href,
              location: window.location.pathname,
              timestamp: new Date().toISOString(),
            });
            if (process.env.NODE_ENV === "development") {
              console.log("💬 WhatsApp Click Tracked");
            }
          }
        }
      }
    };

    // Add click listener
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  // Add scroll depth tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    let maxScrollDepth = 0;
    const scrollDepthMarks = [25, 50, 75, 100];
    const trackedDepths = new Set<number>();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollPercent = Math.round((scrolled / scrollHeight) * 100);

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;

        // Track milestone depths
        scrollDepthMarks.forEach((mark) => {
          if (scrollPercent >= mark && !trackedDepths.has(mark)) {
            trackedDepths.add(mark);
            if (window.dataLayer) {
              window.dataLayer.push({
                event: "scroll_depth",
                scrollDepth: mark,
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
              });
              if (process.env.NODE_ENV === "development") {
                console.log("📜 Scroll Depth Tracked:", mark + "%");
              }
            }
          }
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Add form tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFormSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      const formName = form.name || form.id || "Unknown Form";
      const formId = form.id || "";

      if (window.dataLayer) {
        window.dataLayer.push({
          event: "form_submit",
          formName,
          formId,
          formLocation: window.location.pathname,
          timestamp: new Date().toISOString(),
        });
        if (process.env.NODE_ENV === "development") {
          console.log("📋 Form Submit Tracked:", formName);
        }
      }
    };

    const handleFormFocus = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const form = input.closest("form");
      
      if (form) {
        const formName = form.name || form.id || "Unknown Form";
        const formId = form.id || "";

        // Track form start only once per form
        if (!form.hasAttribute("data-gtm-started")) {
          form.setAttribute("data-gtm-started", "true");
          
          if (window.dataLayer) {
            window.dataLayer.push({
              event: "form_start",
              formName,
              formId,
              formLocation: window.location.pathname,
              timestamp: new Date().toISOString(),
            });
            if (process.env.NODE_ENV === "development") {
              console.log("📝 Form Start Tracked:", formName);
            }
          }
        }
      }
    };

    // Add form listeners
    document.addEventListener("submit", handleFormSubmit, true);
    document.addEventListener("focus", handleFormFocus, true);

    return () => {
      document.removeEventListener("submit", handleFormSubmit, true);
      document.removeEventListener("focus", handleFormFocus, true);
    };
  }, []);

  return (
    <>
      {/* GTM Script - Global Container (loads in <head> as early as possible) */}
      <Script
        id="gtm-script"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("✅ GTM Global Container Loaded:", GTM_ID);
        }}
        dangerouslySetInnerHTML={{
          __html: `
                   (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                   new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                   j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                   'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                   })(window,document,'script','dataLayer','${GTM_ID}');
                 `,
        }}
      />

      {/* GTM noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      {children}
    </>
  );
}
