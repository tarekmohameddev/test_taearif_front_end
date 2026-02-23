"use client";

import { ReactNode } from "react";

/**
 * Pass-through wrapper for the login page.
 * reCAPTCHA is provided by the layout via ClientReCaptchaLoader -> DynamicReCaptcha -> ReCaptchaClientWrapper.
 * No second provider is mounted here to avoid duplicate script load and race conditions.
 */
export function LoginPageWithReCaptcha({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
