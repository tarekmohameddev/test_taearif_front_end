import type { OnboardingStep } from "./types";

export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  { id: "step-1", title: "الخطوة 1" },
  { id: "step-2", title: "الخطوة 2" },
  { id: "step-3", title: "الخطوة 3" },
  { id: "step-4", title: "الخطوة 4" },
] as const;

export const ONBOARDING_STEPS_COUNT = ONBOARDING_STEPS.length;

