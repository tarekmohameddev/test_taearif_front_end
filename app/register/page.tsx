"use client";

import AuthLayout from "@/stories/AuthPages/AuthLayout/AuthLayout";
import {
  RegisterProvider,
  PhoneStep,
  OtpStep,
  ProfileStep,
} from "./components";
import { useRegisterFlow, useLocaleSync } from "./hooks";

function RegisterContent() {
  useLocaleSync();

  const {
    step,
    phone,
    verifiedToken,
    setPhone,
    setVerifiedToken,
    nextStep,
    goToStep,
  } = useRegisterFlow();

  const handlePhoneSuccess = (phoneNumber: string) => {
    setPhone(phoneNumber);
    nextStep();
  };

  const handleOtpSuccess = (token: string) => {
    setVerifiedToken(token);
    nextStep();
  };

  const handleChangePhone = () => {
    goToStep(1);
  };

  return (
    <AuthLayout>
      {step === 1 && <PhoneStep onSuccess={handlePhoneSuccess} />}
      {step === 2 && (
        <OtpStep
          phone={phone}
          onSuccess={handleOtpSuccess}
          onChangePhone={handleChangePhone}
        />
      )}
      {step === 3 && verifiedToken && (
        <ProfileStep phone={phone} verifiedToken={verifiedToken} />
      )}
    </AuthLayout>
  );
}

export default function Register() {
  return (
    <RegisterProvider>
      <RegisterContent />
    </RegisterProvider>
  );
}
