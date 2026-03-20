"use client";

import {
  DashboardRecaptchaCompliance,
  useDashboardHideRecaptchaBadge,
} from "@/components/dashboard/DashboardRecaptchaCompliance";
import { OnboardingFlow } from "./OnboardingFlow";

export function OnboardingMainWithRecaptcha({
  disableCompletionRedirect,
  hideSkipOnSecondStep,
}: {
  disableCompletionRedirect?: boolean;
  hideSkipOnSecondStep?: boolean;
}) {
  useDashboardHideRecaptchaBadge(true);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1">
        <OnboardingFlow
          disableCompletionRedirect={disableCompletionRedirect}
          hideSkipOnSecondStep={hideSkipOnSecondStep}
        />
      </div>
      <DashboardRecaptchaCompliance />
    </div>
  );
}
