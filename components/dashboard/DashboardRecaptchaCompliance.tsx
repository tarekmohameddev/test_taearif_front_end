"use client";

import { useEffect } from "react";

const HTML_CLASS = "dashboard-hide-recaptcha-badge";

/**
 * When `hide` is true, hides the floating reCAPTCHA v3 badge (dashboard base domain + loading).
 * Set `hide` false on branches where `DashboardRecaptchaCompliance` is not shown (e.g. tenant domain)
 * so the default badge remains visible per Google policy.
 */
export function useDashboardHideRecaptchaBadge(hide: boolean) {
  useEffect(() => {
    if (!hide) {
      document.documentElement.classList.remove(HTML_CLASS);
      return;
    }
    document.documentElement.classList.add(HTML_CLASS);
    return () => {
      document.documentElement.classList.remove(HTML_CLASS);
    };
  }, [hide]);
}

/** Visible reCAPTCHA / Google disclosure (required when badge is hidden). Fixed to viewport so it does not sit after long scrollable content. */
export function DashboardRecaptchaCompliance() {
  return (
    <p
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 bg-background/95 px-3 pt-1.5 text-center text-[10px] leading-snug text-muted-foreground shadow-[0_-1px_0_rgba(0,0,0,0.04)] backdrop-blur-sm pb-[max(0.375rem,env(safe-area-inset-bottom,0px))]"
      dir="rtl"
      role="note"
    >
      <span className="pointer-events-auto">
        هذا الموقع محمي بواسطة reCAPTCHA، وتنطبق{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/70 underline underline-offset-2 hover:text-foreground"
        >
          سياسة خصوصية Google
        </a>{" "}
        و{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/70 underline underline-offset-2 hover:text-foreground"
        >
          شروط الخدمة
        </a>
        .
      </span>
    </p>
  );
}
