"use client";

import { useState } from "react";
import { useClientT, useClientLocale } from "@/context/clientI18nStore";
import { getDirectionForLocale } from "@/lib/i18n/config";
import { SIGNUP_KEYS, SIGNUP_FALLBACKS_AR, SIGNUP_ASSET_URLS } from "./data";
import { AuthButton, StepIndicator, ErrorBanner } from "../components";
import type { SignUpProps } from "./SignUp.types";

export default function SignUp({
  onSubmit,
  onLoginClick,
  error,
  isLoading = false,
}: SignUpProps) {
  const t = useClientT();
  const locale = useClientLocale().locale;
  const dir = getDirectionForLocale(locale);

  const [phone, setPhone] = useState("");

  const title = t(SIGNUP_KEYS.title);
  const subtitle = t(SIGNUP_KEYS.subtitle);
  const phonePlaceholder = t(SIGNUP_KEYS.phone_placeholder);
  const submitButton = t(SIGNUP_KEYS.submit_button);
  const hasAccount = t(SIGNUP_KEYS.has_account);
  const loginLink = t(SIGNUP_KEYS.login_link);

  const resolvedTitle =
    title === SIGNUP_KEYS.title ? SIGNUP_FALLBACKS_AR.title : title;
  const resolvedSubtitle =
    subtitle === SIGNUP_KEYS.subtitle ? SIGNUP_FALLBACKS_AR.subtitle : subtitle;
  const resolvedPlaceholder =
    phonePlaceholder === SIGNUP_KEYS.phone_placeholder
      ? SIGNUP_FALLBACKS_AR.phone_placeholder
      : phonePlaceholder;
  const resolvedSubmitButton =
    submitButton === SIGNUP_KEYS.submit_button
      ? SIGNUP_FALLBACKS_AR.submit_button
      : submitButton;
  const resolvedHasAccount =
    hasAccount === SIGNUP_KEYS.has_account
      ? SIGNUP_FALLBACKS_AR.has_account
      : hasAccount;
  const resolvedLoginLink =
    loginLink === SIGNUP_KEYS.login_link
      ? SIGNUP_FALLBACKS_AR.login_link
      : loginLink;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(phone);
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

      {error && <ErrorBanner message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex h-11 items-center border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-[#49A093] focus-within:border-transparent">
          <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 border-e border-gray-300">
            <img
              src={SIGNUP_ASSET_URLS.saudiFlag}
              alt="Saudi Arabia"
              className="w-6 h-4 object-cover rounded-sm"
            />
            <span className="text-sm text-gray-600 font-medium">+966</span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={resolvedPlaceholder}
            className="flex-1 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none"
            dir="rtl"
          />
        </div>

        <div className="flex justify-center">
          <AuthButton type="submit" isLoading={isLoading}>
            {resolvedSubmitButton}
          </AuthButton>
        </div>
      </form>

      <p className="text-sm text-center text-gray-500 mt-6">
        {resolvedHasAccount}{" "}
        <button
          type="button"
          onClick={onLoginClick}
          className="text-[#49A093] font-medium hover:underline"
        >
          {resolvedLoginLink}
        </button>
      </p>

      <StepIndicator totalSteps={3} currentStep={1} className="mt-6" />
    </div>
  );
}
