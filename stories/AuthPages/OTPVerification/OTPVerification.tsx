"use client";

import { useState, useEffect, useRef } from "react";
import { useClientT, useClientLocale } from "@/context/clientI18nStore";
import { getDirectionForLocale } from "@/lib/i18n/config";
import { OTP_KEYS, OTP_FALLBACKS_AR, OTP_ASSET_URLS } from "./data";
import { OTPInput, StepIndicator, ErrorBanner } from "../components";
import type { OTPVerificationProps } from "./OTPVerification.types";

export default function OTPVerification({
  phone,
  onVerify,
  onResend,
  onChangePhone,
  isLoading = false,
  error,
  resendCountdown = 0,
  testCode,
}: OTPVerificationProps) {
  const t = useClientT();
  const locale = useClientLocale().locale;
  const dir = getDirectionForLocale(locale);

  const [otp, setOtp] = useState("");
  const lastSubmittedRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;

  const title = t(OTP_KEYS.title);
  const subtitle = t(OTP_KEYS.subtitle);
  const resendAvailableIn = t(OTP_KEYS.resend_available_in);
  const resendNow = t(OTP_KEYS.resend_now);
  const changePhone = t(OTP_KEYS.change_phone);
  const testCodeLabel = t(OTP_KEYS.test_code_label);

  const resolvedTitle =
    title === OTP_KEYS.title ? OTP_FALLBACKS_AR.title : title;
  const resolvedSubtitle =
    subtitle === OTP_KEYS.subtitle ? OTP_FALLBACKS_AR.subtitle : subtitle;
  const resolvedResendAvailableIn =
    resendAvailableIn === OTP_KEYS.resend_available_in
      ? OTP_FALLBACKS_AR.resend_available_in
      : resendAvailableIn;
  const resolvedResendNow =
    resendNow === OTP_KEYS.resend_now ? OTP_FALLBACKS_AR.resend_now : resendNow;
  const resolvedChangePhone =
    changePhone === OTP_KEYS.change_phone
      ? OTP_FALLBACKS_AR.change_phone
      : changePhone;
  const resolvedTestCodeLabel =
    testCodeLabel === OTP_KEYS.test_code_label
      ? OTP_FALLBACKS_AR.test_code_label
      : testCodeLabel;

  useEffect(() => {
    if (otp.length === 5 && lastSubmittedRef.current !== otp) {
      lastSubmittedRef.current = otp;
      onVerifyRef.current?.(otp);
    }
  }, [otp]);

  useEffect(() => {
    if (error) {
      lastSubmittedRef.current = null;
    }
  }, [error]);

  const canResend = resendCountdown <= 0;

  return (
    <div
      dir={dir}
      className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
    >
      {/* Phone icon */}
      <div className="w-16 h-16 rounded-full bg-[#B5FCCF] flex items-center justify-center mb-6">
        <img
          src={OTP_ASSET_URLS.phoneIcon}
          alt=""
          className="w-8 h-8"
          aria-hidden
        />
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
        {resolvedTitle}
      </h2>

      <p className="text-sm text-center text-gray-500 mb-1">
        {resolvedSubtitle}
      </p>

      <p
        className="text-base font-semibold text-center text-gray-900 mb-6"
        dir="ltr"
      >
        {phone}
      </p>

      {error && <ErrorBanner message={error} showIcon={false} className="w-full mb-4" />}

      <OTPInput
        value={otp}
        onChange={setOtp}
        length={5}
        disabled={isLoading}
        className="mb-6"
      />

      {/* Resend section */}
      <div className="text-sm text-center text-gray-500 mb-4">
        {canResend ? (
          <button
            type="button"
            onClick={() => {
              setOtp("");
              lastSubmittedRef.current = null;
              onResend?.();
            }}
            disabled={isLoading}
            className="text-[#49A093] font-medium hover:underline disabled:opacity-60"
          >
            {resolvedResendNow}
          </button>
        ) : (
          <span>
            {resolvedResendAvailableIn.replace(
              "{{seconds}}",
              String(resendCountdown),
            )}
          </span>
        )}
      </div>

      {/* Change phone link */}
      <button
        type="button"
        onClick={onChangePhone}
        disabled={isLoading}
        className="text-sm text-[#49A093] font-medium hover:underline underline mb-4 disabled:opacity-60"
      >
        {resolvedChangePhone}
      </button>

      {/* Test code hint */}
      {testCode && (
        <p className="text-sm text-gray-400">
          {resolvedTestCodeLabel} <span className="font-mono">{testCode}</span>
        </p>
      )}

      <StepIndicator totalSteps={3} currentStep={2} className="mt-6" />
    </div>
  );
}
