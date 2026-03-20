"use client";

import { useState } from "react";
import { useClientT, useClientLocale } from "@/context/clientI18nStore";
import { getDirectionForLocale } from "@/lib/i18n/config";
import { COMPLETE_PROFILE_KEYS, COMPLETE_PROFILE_FALLBACKS_AR } from "./data";
import { AuthButton, AuthInput, StepIndicator, ErrorBanner } from "../components";
import type { CompleteProfileProps } from "./CompleteProfile.types";

export default function CompleteProfile({
  onSubmit,
  isLoading = false,
  error,
}: CompleteProfileProps) {
  const t = useClientT();
  const locale = useClientLocale().locale;
  const dir = getDirectionForLocale(locale);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const title = t(COMPLETE_PROFILE_KEYS.title);
  const subtitle = t(COMPLETE_PROFILE_KEYS.subtitle);
  const usernamePlaceholder = t(COMPLETE_PROFILE_KEYS.username_placeholder);
  const emailPlaceholder = t(COMPLETE_PROFILE_KEYS.email_placeholder);
  const passwordPlaceholder = t(COMPLETE_PROFILE_KEYS.password_placeholder);
  const submitButton = t(COMPLETE_PROFILE_KEYS.submit_button);

  const resolvedTitle =
    title === COMPLETE_PROFILE_KEYS.title
      ? COMPLETE_PROFILE_FALLBACKS_AR.title
      : title;
  const resolvedSubtitle =
    subtitle === COMPLETE_PROFILE_KEYS.subtitle
      ? COMPLETE_PROFILE_FALLBACKS_AR.subtitle
      : subtitle;
  const resolvedUsernamePlaceholder =
    usernamePlaceholder === COMPLETE_PROFILE_KEYS.username_placeholder
      ? COMPLETE_PROFILE_FALLBACKS_AR.username_placeholder
      : usernamePlaceholder;
  const resolvedEmailPlaceholder =
    emailPlaceholder === COMPLETE_PROFILE_KEYS.email_placeholder
      ? COMPLETE_PROFILE_FALLBACKS_AR.email_placeholder
      : emailPlaceholder;
  const resolvedPasswordPlaceholder =
    passwordPlaceholder === COMPLETE_PROFILE_KEYS.password_placeholder
      ? COMPLETE_PROFILE_FALLBACKS_AR.password_placeholder
      : passwordPlaceholder;
  const resolvedSubmitButton =
    submitButton === COMPLETE_PROFILE_KEYS.submit_button
      ? COMPLETE_PROFILE_FALLBACKS_AR.submit_button
      : submitButton;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ username, email, password });
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
          value={username}
          onChange={setUsername}
          placeholder={resolvedUsernamePlaceholder}
          disabled={isLoading}
        />

        <AuthInput
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={resolvedEmailPlaceholder}
          disabled={isLoading}
        />

        <AuthInput
          type="password"
          value={password}
          onChange={setPassword}
          placeholder={resolvedPasswordPlaceholder}
          showPasswordToggle
          disabled={isLoading}
        />

        <div className="flex justify-center pt-2">
          <AuthButton type="submit" isLoading={isLoading}>
            {resolvedSubmitButton}
          </AuthButton>
        </div>
      </form>

      <StepIndicator totalSteps={3} currentStep={3} className="mt-6" />
    </div>
  );
}
