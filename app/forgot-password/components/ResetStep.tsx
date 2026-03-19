"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ResetPassword from "@/stories/AuthPages/ResetPassword/ResetPassword";
import {
  useResetPassword,
  useForgotPassword,
  getErrorMessage,
} from "../hooks";
import { resetPasswordSchema } from "../schemas/forgot-password-schemas";

interface ResetStepProps {
  identifier: string;
  method: "email" | "phone";
  onBackClick: () => void;
}

const RESEND_COOLDOWN = 60;

export default function ResetStep({
  identifier,
  method,
  onBackClick,
}: ResetStepProps) {
  const router = useRouter();
  const resetPasswordMutation = useResetPassword();
  const resendMutation = useForgotPassword();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (resendCountdown > 0) {
      timerRef.current = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resendCountdown]);

  const handleSubmit = useCallback(
    (data: { code: string; newPassword: string; confirmPassword: string }) => {
      setValidationError(null);

      const result = resetPasswordSchema.safeParse(data);
      if (!result.success) {
        const firstError = result.error.errors[0]?.message;
        setValidationError(firstError || "البيانات المدخلة غير صالحة");
        return;
      }

      resetPasswordMutation.mutate(
        {
          code: data.code,
          new_password: data.newPassword,
          new_password_confirmation: data.confirmPassword,
        },
        {
          onSuccess: () => {
            router.push("/login");
          },
        }
      );
    },
    [resetPasswordMutation, router]
  );

  const handleResendCode = useCallback(() => {
    resendMutation.mutate(
      {
        method,
        identifier,
        country_code: method === "phone" ? "+966" : undefined,
      },
      {
        onSuccess: () => {
          setResendCountdown(RESEND_COOLDOWN);
        },
      }
    );
  }, [resendMutation, method, identifier]);

  const errorMessage =
    validationError ||
    (resetPasswordMutation.error
      ? getErrorMessage(resetPasswordMutation.error)
      : undefined) ||
    (resendMutation.error ? getErrorMessage(resendMutation.error) : undefined);

  return (
    <ResetPassword
      onSubmit={handleSubmit}
      onResendCode={handleResendCode}
      onBackClick={onBackClick}
      error={errorMessage}
      isLoading={resetPasswordMutation.isPending}
      isResending={resendMutation.isPending}
      resendCountdown={resendCountdown}
    />
  );
}
