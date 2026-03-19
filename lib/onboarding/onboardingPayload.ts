export const ONBOARDING_CATEGORY_REALESTATE = "realestate" as const;

export type OnboardingPostColors = {
  primary: string;
  secondary: string;
  accent: string;
};

/** Body for POST /onboarding — required: title, category (always realestate), colors. */
export type OnboardingPostBody = {
  title: string;
  category: typeof ONBOARDING_CATEGORY_REALESTATE;
  colors: OnboardingPostColors;
  logo?: string;
  favicon?: string;
  address?: string;
  email?: string;
  /** رقم الجوال */
  phone?: string;
  workingHours?: string;
  valLicense?: string;
  allow_update?: boolean;
};

export function buildOnboardingPostBody(input: {
  title: string;
  colors: OnboardingPostColors;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  address?: string;
  email?: string;
  phone?: string;
  workingHours?: string;
  valLicense?: string;
  /** When true, includes `allow_update: true` in the payload. */
  allowUpdate?: boolean;
}): OnboardingPostBody {
  const body: OnboardingPostBody = {
    title: input.title.trim(),
    category: ONBOARDING_CATEGORY_REALESTATE,
    colors: input.colors,
  };
  if (input.logoUrl) body.logo = input.logoUrl;
  if (input.faviconUrl) body.favicon = input.faviconUrl;
  const addr = input.address?.trim();
  if (addr) body.address = addr;
  const em = input.email?.trim();
  if (em) body.email = em;
  const ph = input.phone?.trim();
  if (ph) body.phone = ph;
  const wh = input.workingHours?.trim();
  if (wh) body.workingHours = wh;
  const vl = input.valLicense?.trim();
  if (vl) body.valLicense = vl;
  if (input.allowUpdate === true) body.allow_update = true;
  return body;
}
