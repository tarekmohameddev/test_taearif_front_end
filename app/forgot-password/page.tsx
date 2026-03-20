"use client";

import AuthLayout from "@/stories/AuthPages/AuthLayout/AuthLayout";
import {
  ForgotPasswordProvider,
  IdentifierStep,
  ResetStep,
} from "./components";
import { useForgotPasswordFlow, useLocaleSync } from "./hooks";

function ForgotPasswordContent() {
  useLocaleSync();

  const { step, identifier, method, setIdentifier, setMethod, nextStep, goToStep } =
    useForgotPasswordFlow();

  const handleIdentifierSuccess = (
    identifierValue: string,
    methodValue: "email" | "phone"
  ) => {
    setIdentifier(identifierValue);
    setMethod(methodValue);
    nextStep();
  };

  const handleBackClick = () => {
    goToStep(1);
  };

  return (
    <AuthLayout>
      {step === 1 && <IdentifierStep onSuccess={handleIdentifierSuccess} />}
      {step === 2 && (
        <ResetStep
          identifier={identifier}
          method={method}
          onBackClick={handleBackClick}
        />
      )}
    </AuthLayout>
  );
}

export default function ForgotPasswordPage() {
  return (
    <ForgotPasswordProvider>
      <ForgotPasswordContent />
    </ForgotPasswordProvider>
  );
}
