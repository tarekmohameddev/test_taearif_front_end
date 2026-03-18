"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/context/AuthContext";
import { ONBOARDING_STEPS, ONBOARDING_STEPS_COUNT } from "@/lib/onboarding/steps";
import { clampStepIndex } from "@/utils/onboarding/stepNavigation";
import { OnboardingNavigation } from "./OnboardingNavigation";
import { OnboardingStepPanel } from "./OnboardingStepPanel";
import { OnboardingStepsHeader } from "./OnboardingStepsHeader";

export function OnboardingFlow() {
  const router = useRouter();
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  const onboardingCompleted = useAuthStore((s) => s.onboarding_completed);

  const [stepIndex, setStepIndex] = useState(0);
  const currentStepIndex = clampStepIndex(stepIndex, ONBOARDING_STEPS_COUNT);

  useEffect(() => {
    if (onboardingCompleted) {
      router.push("/dashboard");
    }
  }, [onboardingCompleted, router]);

  const finishOnboarding = () => {
    setOnboardingCompleted(true);
    router.push("/dashboard");
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  const handleBack = () => {
    setStepIndex((prev) => clampStepIndex(prev - 1, ONBOARDING_STEPS_COUNT));
  };

  const handleNext = () => {
    setStepIndex((prev) => clampStepIndex(prev + 1, ONBOARDING_STEPS_COUNT));
  };

  return (
    <main className="min-h-screen flex flex-1 items-center justify-center p-4 bg-[#4F9E8E]">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">
          موقعك الاحترافي جاهز خلال دقائق
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
          سنوجّهك لإعداد موقعك خطوة بخطوة بطريقة سهلة وسريعة
          </p>
        </div>

        <OnboardingStepsHeader
          steps={ONBOARDING_STEPS}
          currentStepIndex={currentStepIndex}
        />

        <section className="mt-5 rounded-lg border border-border bg-card p-6">
          <OnboardingStepPanel stepIndex={currentStepIndex} />
        </section>

        <OnboardingNavigation
          stepIndex={currentStepIndex}
          stepsLength={ONBOARDING_STEPS_COUNT}
          onBack={handleBack}
          onNext={handleNext}
          onFinish={finishOnboarding}
          onSkip={handleSkip}
        />
      </div>
    </main>
  );
}

