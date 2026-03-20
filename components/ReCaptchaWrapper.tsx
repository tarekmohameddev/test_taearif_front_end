"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode, useEffect } from "react";

export function ReCaptchaWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    // تنظيف ReCAPTCHA badge عند unmount إذا لزم الأمر
    return () => {
      // إزالة أي scripts قديمة من ReCAPTCHA عند unmount
      const recaptchaScripts = document.querySelectorAll(
        'script[src*="recaptcha"]',
      );
      const recaptchaBadges = document.querySelectorAll(".grecaptcha-badge");

      // لا نقوم بإزالة الـ scripts والـ badges هنا لأن ReCAPTCHA تحتاجها
      // فقط نترك التنظيف للمكتبة نفسها
    };
  }, []);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined,
      }}
      container={{
        parameters: {
          badge: "bottomleft",
          theme: "light",
        },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
