"use client";

import { useState } from "react";
import CompleteProfile from "@/stories/AuthPages/CompleteProfile/CompleteProfile";
import useAuthStore from "@/context/AuthContext";
import { useRegister, getErrorMessage } from "../hooks";
import { profileSchema } from "../schemas/register-schemas";

interface ProfileStepProps {
  phone: string;
  verifiedToken: string;
}

export default function ProfileStep({
  phone,
  verifiedToken,
}: ProfileStepProps) {
  const registerMutation = useRegister();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    setValidationError(null);

    const result = profileSchema.safeParse(data);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message;
      setValidationError(firstError || "البيانات المدخلة غير صالحة");
      return;
    }

    registerMutation.mutate(
      {
        account_type: "tenant",
        email: data.email,
        username: data.username,
        password: data.password,
        phone: `966${phone}`,
        verified_token: verifiedToken,
      },
      {
        onSuccess: async (response) => {
          if (response.user && response.token) {
            try {
              const setAuthResponse = await fetch("/api/user/setAuth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user: response.user,
                  UserToken: response.token,
                }),
              });

              if (setAuthResponse.ok) {
                await useAuthStore.getState().fetchUserData();
                useAuthStore.setState({ UserIslogged: true });
                window.location.assign("/onboarding");
              } else {
                window.location.assign("/onboarding");
              }
            } catch {
              window.location.assign("/onboarding");
            }
          } else {
            window.location.assign("/onboarding");
          }
        },
      },
    );
  };

  const errorMessage =
    validationError ||
    (registerMutation.error
      ? getErrorMessage(registerMutation.error)
      : undefined);

  return (
    <CompleteProfile
      onSubmit={handleSubmit}
      isLoading={registerMutation.isPending}
      error={errorMessage}
    />
  );
}
