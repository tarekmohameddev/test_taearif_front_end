"use client";

import AuthLayout from "@/stories/AuthPages/AuthLayout/AuthLayout";
import { LoginProvider, LoginForm } from "./components";
import { useLocaleSync } from "./hooks";

export default function Login() {
  useLocaleSync();

  return (
    <LoginProvider>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </LoginProvider>
  );
}
