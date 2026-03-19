"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SignIn from "@/stories/AuthPages/Signin/SignIn";
import useAuthStore from "@/context/AuthContext";
import { loginSchema } from "../schemas/login-schemas";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { identifier: string; password: string }) => {
    setError(null);

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message;
      setError(firstError || "البيانات المدخلة غير صالحة");
      return;
    }

    setIsLoading(true);

    try {
      const { login } = useAuthStore.getState();
      const loginResult = await login(
        data.identifier,
        data.password,
        "static_token_for_testing"
      );

      if (!loginResult.success) {
        setError(loginResult.error || "فشل تسجيل الدخول");
        setIsLoading(false);
        return;
      }

      window.location.assign("/dashboard");
    } catch (err) {
      setError("حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <SignIn
      onSubmit={handleSubmit}
      onForgotPassword={handleForgotPassword}
      onRegisterClick={handleRegisterClick}
      error={error || undefined}
      isLoading={isLoading}
    />
  );
}
