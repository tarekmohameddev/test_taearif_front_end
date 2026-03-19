import type { OnboardingStep } from "./types";

export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  { id: "step-1", title: "هوية الموقع" },
  { id: "step-2", title: "بيانات التواصل" },
  { id: "step-3", title: "أول عقار" },
  { id: "step-4", title: "الرابط المتكامل" },
  { id: "step-5", title: "" },
] as const;

export const ONBOARDING_STEPS_COUNT = ONBOARDING_STEPS.length;

