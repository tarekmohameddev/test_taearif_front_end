"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SignUp from "@/stories/AuthPages/Signup/SignUp";
import { useSendOtp, getErrorMessage } from "../hooks";
import { phoneSchema } from "../schemas/register-schemas";

interface PhoneStepProps {
  onSuccess: (phone: string) => void;
}

export default function PhoneStep({ onSuccess }: PhoneStepProps) {
  const router = useRouter();
  const sendOtpMutation = useSendOtp();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (phone: string) => {
    setValidationError(null);

    const result = phoneSchema.safeParse({ phone });
    if (!result.success) {
      const firstError = result.error.errors[0]?.message;
      setValidationError(firstError || "رقم الجوال غير صالح");
      return;
    }

    sendOtpMutation.mutate(
      { phone },
      {
        onSuccess: () => {
          onSuccess(phone);
        },
      }
    );
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const errorMessage =
    validationError ||
    (sendOtpMutation.error ? getErrorMessage(sendOtpMutation.error) : undefined);

  return (
    <SignUp
      onSubmit={handleSubmit}
      onLoginClick={handleLoginClick}
      error={errorMessage}
      isLoading={sendOtpMutation.isPending}
    />
  );
}
