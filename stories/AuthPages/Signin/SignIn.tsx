"use client";

import { useState, useMemo } from "react";
import { useClientT, useClientLocale } from "@/context/clientI18nStore";
import { getDirectionForLocale } from "@/lib/i18n/config";
import { SIGNIN_KEYS, SIGNIN_FALLBACKS_AR, SIGNIN_FALLBACKS_EN } from "./data";
import { AuthButton, AuthInput, ErrorBanner } from "../components";
import type { SignInProps, SignInCopyField } from "./SignIn.types";

export default function SignIn({
  onSubmit,
  onForgotPassword,
  onRegisterClick,
  error,
  isLoading = false,
}: SignInProps) {
  const t = useClientT();
  const locale = useClientLocale().locale;
  const dir = getDirectionForLocale(locale);
  const isArabic = locale === "ar";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const fallbacks = isArabic ? SIGNIN_FALLBACKS_AR : SIGNIN_FALLBACKS_EN;

  const resolveText = useMemo(() => {
    return (key: string, field: SignInCopyField): string => {
      const translated = t(key);
      return translated === key ? fallbacks[field] : translated;
    };
  }, [t, fallbacks]);

  const resolvedTitle = resolveText(SIGNIN_KEYS.title, "title");
  const resolvedSubtitle = resolveText(SIGNIN_KEYS.subtitle, "subtitle");
  const resolvedIdentifierPlaceholder = resolveText(
    SIGNIN_KEYS.identifier_placeholder,
    "identifier_placeholder"
  );
  const resolvedPasswordPlaceholder = resolveText(
    SIGNIN_KEYS.password_placeholder,
    "password_placeholder"
  );
  const resolvedForgotPassword = resolveText(
    SIGNIN_KEYS.forgot_password,
    "forgot_password"
  );
  const resolvedSubmitButton = resolveText(
    SIGNIN_KEYS.submit_button,
    "submit_button"
  );
  const resolvedNoAccount = resolveText(SIGNIN_KEYS.no_account, "no_account");
  const resolvedRegisterLink = resolveText(
    SIGNIN_KEYS.register_link,
    "register_link"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ identifier, password });
  };

  return (
    <div
      dir={dir}
      className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
        {resolvedTitle}
      </h2>

      <p className="text-sm text-center text-gray-500 mb-6">
        {resolvedSubtitle}
      </p>

      {error && <ErrorBanner message={error} showIcon={false} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="text"
          value={identifier}
          onChange={setIdentifier}
          placeholder={resolvedIdentifierPlaceholder}
          disabled={isLoading}
        />

        <div className="space-y-2">
          <AuthInput
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={resolvedPasswordPlaceholder}
            showPasswordToggle
            disabled={isLoading}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[#49A093] font-medium hover:underline"
            >
              {resolvedForgotPassword}
            </button>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <AuthButton type="submit" isLoading={isLoading}>
            {resolvedSubmitButton}
          </AuthButton>
        </div>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        {resolvedNoAccount}{" "}
        <button
          type="button"
          onClick={onRegisterClick}
          className="text-[#49A093] font-medium hover:underline"
        >
          {resolvedRegisterLink}
        </button>
      </p>
    </div>
  );
}
