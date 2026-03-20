"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPassword from "@/stories/AuthPages/ForgotPassword/ForgotPassword";
import { useForgotPassword, getErrorMessage } from "../hooks";
import { identifierSchema } from "../schemas/forgot-password-schemas";

interface IdentifierStepProps {
  onSuccess: (identifier: string, method: "email" | "phone") => void;
}

export default function IdentifierStep({ onSuccess }: IdentifierStepProps) {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (identifier: string) => {
    setValidationError(null);

    const result = identifierSchema.safeParse({ identifier });
    if (!result.success) {
      const firstError = result.error.errors[0]?.message;
      setValidationError(firstError || "البيانات المدخلة غير صالحة");
      return;
    }

    const isEmail = identifier.includes("@");
    const method = isEmail ? "email" : "phone";

    forgotPasswordMutation.mutate(
      {
        method,
        identifier: isEmail ? identifier : identifier,
        country_code: isEmail ? undefined : "+966",
      },
      {
        onSuccess: () => {
          onSuccess(identifier, method);
        },
      }
    );
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const errorMessage =
    validationError ||
    (forgotPasswordMutation.error
      ? getErrorMessage(forgotPasswordMutation.error)
      : undefined);

  return (
    <ForgotPassword
      onSubmit={handleSubmit}
      onLoginClick={handleLoginClick}
      error={errorMessage}
      isLoading={forgotPasswordMutation.isPending}
    />
  );
}
