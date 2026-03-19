export const ONBOARDING_STEP1_SESSION_KEY = "taearif:onboarding:step1:v1";

export type OnboardingStep1SessionPayload = {
  siteName: string;
  colors: { primary: string; secondary: string; accent: string };
  logoDataUrl: string | null;
  manualHexes: string[];
  selectedPaletteName: string;
  manualColorsVisible: boolean;
};

export function readOnboardingStep1Cache(): OnboardingStep1SessionPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ONBOARDING_STEP1_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingStep1SessionPayload;
    if (!parsed || typeof parsed.siteName !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeOnboardingStep1Cache(payload: OnboardingStep1SessionPayload): boolean {
  if (typeof window === "undefined") return false;
  try {
    sessionStorage.setItem(ONBOARDING_STEP1_SESSION_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearOnboardingStep1Cache() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ONBOARDING_STEP1_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("readFileAsDataUrl: unexpected result"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("readFileAsDataUrl failed"));
    reader.readAsDataURL(file);
  });
}

export async function dataUrlToFile(dataUrl: string, baseName = "logo"): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const sub = blob.type.split("/")[1]?.replace(/\+.*/, "") || "png";
  return new File([blob], `${baseName}.${sub}`, { type: blob.type || "image/png" });
}
