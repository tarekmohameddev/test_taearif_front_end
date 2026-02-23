/**
 * Ensures the Google reCAPTCHA script is ready before calling executeRecaptcha.
 * Reduces intermittent "window[pf][Kc()] undefined" errors by waiting for grecaptcha.ready().
 * Use in client components only (uses window).
 */
export async function ensureRecaptchaReady(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const g = (window as any).grecaptcha;
  if (!g) return false;
  if (typeof g.ready === "function") {
    try {
      await g.ready();
    } catch {
      return false;
    }
  }
  return true;
}

/** User-facing message when reCAPTCHA fails to load or is blocked (e.g. ad blocker). */
export const RECAPTCHA_LOAD_ERROR_MESSAGE =
  "فشل التحقق الأمني. جرّب تحديث الصفحة أو تعطيل حظر الإعلانات لهذا الموقع.";

/** Check if an error is likely from reCAPTCHA (script not ready, blocked, etc.). */
export function isRecaptchaError(message: string): boolean {
  return /recaptcha|grecaptcha|undefined is not an object/i.test(message);
}
