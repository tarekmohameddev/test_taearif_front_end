"use client";

import { useState, useMemo } from "react";
import { useClientT, useClientLocale } from "@/context/clientI18nStore";
import { getDirectionForLocale } from "@/lib/i18n/config";
import {
  FORGOT_PASSWORD_KEYS,
  FORGOT_PASSWORD_FALLBACKS_AR,
  FORGOT_PASSWORD_FALLBACKS_EN,
} from "./data";
import { AuthButton, AuthInput, ErrorBanner } from "../components";
import type { ForgotPasswordProps, ForgotPasswordCopyField } from "./ForgotPassword.types";

export default function ForgotPassword({
  onSubmit,
  onLoginClick,
  error,
  isLoading = false,
}: ForgotPasswordProps) {
  const t = useClientT();
  const locale = useClientLocale().locale;
  const dir = getDirectionForLocale(locale);
  const isArabic = locale === "ar";

  const [identifier, setIdentifier] = useState("");

  const fallbacks = isArabic ? FORGOT_PASSWORD_FALLBACKS_AR : FORGOT_PASSWORD_FALLBACKS_EN;

  const resolveText = useMemo(() => {
    return (key: string, field: ForgotPasswordCopyField): string => {
      const translated = t(key);
      return translated === key ? fallbacks[field] : translated;
    };
  }, [t, fallbacks]);

  const resolvedTitle = resolveText(FORGOT_PASSWORD_KEYS.title, "title");
  const resolvedIdentifierPlaceholder = resolveText(
    FORGOT_PASSWORD_KEYS.identifier_placeholder,
    "identifier_placeholder"
  );
  const resolvedSubmitButton = resolveText(
    FORGOT_PASSWORD_KEYS.submit_button,
    "submit_button"
  );
  const resolvedRememberPassword = resolveText(
    FORGOT_PASSWORD_KEYS.remember_password,
    "remember_password"
  );
  const resolvedLoginLink = resolveText(
    FORGOT_PASSWORD_KEYS.login_link,
    "login_link"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(identifier);
  };

  return (
    <div
      dir={dir}
      className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        {resolvedTitle}
      </h2>

      {error && <ErrorBanner message={error} showIcon={false} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="text"
          value={identifier}
          onChange={setIdentifier}
          placeholder={resolvedIdentifierPlaceholder}
          disabled={isLoading}
        />

        <div className="flex justify-center pt-2">
          <AuthButton type="submit" isLoading={isLoading}>
            {resolvedSubmitButton}
          </AuthButton>
        </div>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        {resolvedRememberPassword}{" "}
        <button
          type="button"
          onClick={onLoginClick}
          className="text-[#49A093] font-medium hover:underline"
        >
          {resolvedLoginLink}
        </button>
      </p>
    </div>
  );
}
