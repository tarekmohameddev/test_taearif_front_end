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
    <>
      <div className="pb-11">
        <OnboardingFlow
          disableCompletionRedirect={disableCompletionRedirect}
          hideSkipOnSecondStep={hideSkipOnSecondStep}
        />
      </div>
      <DashboardRecaptchaCompliance />
    </>
  );
}
