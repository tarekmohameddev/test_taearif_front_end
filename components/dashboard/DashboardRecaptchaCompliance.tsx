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

/** Visible reCAPTCHA / Google disclosure (required when badge is hidden). */
export function DashboardRecaptchaCompliance() {
  return (
    <p
      className="mt-4 border-t border-gray-100 pt-3 text-center text-[11px] leading-relaxed text-gray-500"
      dir="rtl"
    >
      هذا الموقع محمي بواسطة reCAPTCHA، وتنطبق{" "}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 underline underline-offset-2 hover:text-gray-800"
      >
        سياسة خصوصية Google
      </a>{" "}
      و{" "}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 underline underline-offset-2 hover:text-gray-800"
      >
        شروط الخدمة
      </a>
      .
    </p>
  );
}
