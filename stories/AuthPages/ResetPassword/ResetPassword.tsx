"use client";

import { useState, useMemo } from "react";
import { useClientT, useClientLocale } from "@/context/clientI18nStore";
import { getDirectionForLocale } from "@/lib/i18n/config";
import {
  RESET_PASSWORD_KEYS,
  RESET_PASSWORD_FALLBACKS_AR,
  RESET_PASSWORD_FALLBACKS_EN,
} from "./data";
import { AuthButton, AuthInput, OTPInput, ErrorBanner } from "../components";
import type { ResetPasswordProps, ResetPasswordCopyField } from "./ResetPassword.types";

export default function ResetPassword({
  onSubmit,
  onResendCode,
  onBackClick,
  error,
  isLoading = false,
  isResending = false,
  resendCountdown = 0,
}: ResetPasswordProps) {
  const t = useClientT();
  const locale = useClientLocale().locale;
  const dir = getDirectionForLocale(locale);
  const isArabic = locale === "ar";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fallbacks = isArabic ? RESET_PASSWORD_FALLBACKS_AR : RESET_PASSWORD_FALLBACKS_EN;

  const resolveText = useMemo(() => {
    return (key: string, field: ResetPasswordCopyField): string => {
      const translated = t(key);
      return translated === key ? fallbacks[field] : translated;
    };
  }, [t, fallbacks]);

  const resolvedTitle = resolveText(RESET_PASSWORD_KEYS.title, "title");
  const resolvedSubtitle = resolveText(RESET_PASSWORD_KEYS.subtitle, "subtitle");
  const resolvedNewPasswordPlaceholder = resolveText(
    RESET_PASSWORD_KEYS.new_password_placeholder,
    "new_password_placeholder"
  );
  const resolvedConfirmPasswordPlaceholder = resolveText(
    RESET_PASSWORD_KEYS.confirm_password_placeholder,
    "confirm_password_placeholder"
  );
  const resolvedSubmitButton = resolveText(
    RESET_PASSWORD_KEYS.submit_button,
    "submit_button"
  );
  const resolvedResendCode = resolveText(
    RESET_PASSWORD_KEYS.resend_code,
    "resend_code"
  );
  const resolvedResendAvailableIn = resolveText(
    RESET_PASSWORD_KEYS.resend_available_in,
    "resend_available_in"
  ).replace("{{seconds}}", String(resendCountdown));
  const resolvedBackLink = resolveText(RESET_PASSWORD_KEYS.back_link, "back_link");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ code, newPassword, confirmPassword });
  };

  const canResend = resendCountdown === 0 && !isResending;

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
        <OTPInput
          value={code}
          onChange={setCode}
          length={5}
          disabled={isLoading}
        />

        <AuthInput
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder={resolvedNewPasswordPlaceholder}
          showPasswordToggle
          disabled={isLoading}
        />

        <AuthInput
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder={resolvedConfirmPasswordPlaceholder}
          showPasswordToggle
          disabled={isLoading}
        />

        <div className="flex justify-center pt-2">
          <AuthButton type="submit" isLoading={isLoading}>
            {resolvedSubmitButton}
          </AuthButton>
        </div>
      </form>

      <div className="flex flex-col items-center gap-2 mt-6">
        {canResend ? (
          <button
            type="button"
            onClick={onResendCode}
            disabled={isResending}
            className="text-sm text-[#49A093] font-medium hover:underline disabled:opacity-50"
          >
            {resolvedResendCode}
          </button>
        ) : (
          <p className="text-sm text-gray-500">{resolvedResendAvailableIn}</p>
        )}

        <button
          type="button"
          onClick={onBackClick}
          className="text-sm text-gray-500 hover:underline"
        >
          {resolvedBackLink}
        </button>
      </div>
    </div>
  );
}
