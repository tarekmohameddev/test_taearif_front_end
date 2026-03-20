"use client";

import { useState, useEffect, useRef } from "react";
import OTPVerification from "@/stories/AuthPages/OTPVerification/OTPVerification";
import { useVerifyOtp, useSendOtp, getErrorMessage } from "../hooks";

interface OtpStepProps {
  phone: string;
  onSuccess: (verifiedToken: string) => void;
  onChangePhone: () => void;
}

const RESEND_COUNTDOWN_SECONDS = 60;

export default function OtpStep({
  phone,
  onSuccess,
  onChangePhone,
}: OtpStepProps) {
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN_SECONDS);
  const [localError, setLocalError] = useState<string | null>(null);
  const lastSubmittedOtpRef = useRef<string | null>(null);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useSendOtp();

  const maskedPhone = `+966 ${phone.slice(0, 3)}***${phone.slice(-2)}`;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = (otp: string) => {
    if (otp.length !== 5) return;
    if (lastSubmittedOtpRef.current === otp) return;
    if (verifyOtpMutation.isPending) return;

    setLocalError(null);
    lastSubmittedOtpRef.current = otp;

    verifyOtpMutation.mutate(
      { phone, otp },
      {
        onSuccess: (data) => {
          if (data.verified_token) {
            onSuccess(data.verified_token);
          } else {
            console.error("verify-otp response missing verified_token:", data);
            setLocalError("خطأ في التحقق. يرجى المحاولة مرة أخرى.");
            lastSubmittedOtpRef.current = null;
          }
        },
        onError: () => {
          lastSubmittedOtpRef.current = null;
        },
      }
    );
  };

  const handleResend = () => {
    resendOtpMutation.mutate(
      { phone },
      {
        onSuccess: () => {
          setCountdown(RESEND_COUNTDOWN_SECONDS);
          lastSubmittedOtpRef.current = null;
          verifyOtpMutation.reset();
        },
      }
    );
  };

  const isLoading = verifyOtpMutation.isPending || resendOtpMutation.isPending;

  const errorMessage =
    localError ||
    (verifyOtpMutation.error
      ? getErrorMessage(verifyOtpMutation.error)
      : resendOtpMutation.error
        ? getErrorMessage(resendOtpMutation.error)
        : undefined);

  return (
    <OTPVerification
      phone={maskedPhone}
      onVerify={handleVerify}
      onResend={handleResend}
      onChangePhone={onChangePhone}
      isLoading={isLoading}
      error={errorMessage}
      resendCountdown={countdown}
      testCode={process.env.NODE_ENV === "development" ? "12345" : undefined}
    />
  );
}
