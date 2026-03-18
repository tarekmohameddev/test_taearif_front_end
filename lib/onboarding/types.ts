export type OnboardingStepId = "step-1" | "step-2" | "step-3" | "step-4";

export interface OnboardingStep {
  id: OnboardingStepId;
  title: string;
}

