import type { StepIndicatorProps } from "./StepIndicator.types";

export default function StepIndicator({
  totalSteps,
  currentStep,
  className = "",
}: StepIndicatorProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;

        return (
          <span
            key={step}
            className={`h-2.5 rounded-full bg-[#49A093] transition-all ${
              isActive ? "w-7" : "w-2.5"
            }`}
          />
        );
      })}
    </div>
  );
}
