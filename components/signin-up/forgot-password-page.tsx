"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Shield,
  Lock,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import toast from "react-hot-toast";
import useStore from "@/context/Store";
import {
  ensureRecaptchaReady,
  RECAPTCHA_LOAD_ERROR_MESSAGE,
  isRecaptchaError,
} from "@/lib/recaptcha";
import { countries } from "./countries";

export function ForgotPasswordPage() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Zustand store
  const {
    userIdentifier,
    userMethod,
    resetCode,
    isCodeVerified,
    resetAttempts,
    isBlocked,
    setUserIdentifier,
    setUserMethod,
    setResetCode,
    setIsCodeVerified,
    setResetAttempts,
    setIsBlocked,
    resetUserAuth,
  } = useStore();

  // Local state
  const [identifier, setIdentifier] = useState("");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [validationMessage, setValidationMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "sa",
    dialCode: "+966",
    name: "Saudi Arabia",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // حساب قوة كلمة المرور
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength += 1;
    if (/[a-z]/.test(newPassword)) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;

    setPasswordStrength(strength);
  }, [newPassword]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // إغلاق الـ dropdown عند الضغط خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change for email only
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);

    // Simple validation for email only
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setValidationMessage("");
      setPhoneNumber("");
      setMethod("email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(trimmedValue)) {
      setMethod("email");
      setValidationMessage("✓ بريد إلكتروني صحيح");
      setPhoneNumber("");
      return;
    }

    // If not email, check if it's a phone number with country code
    const cleanPhone = trimmedValue.replace(/[\s-()]/g, "");
    const hasOnlyDigitsAndPlus = /^\+?[0-9]+$/.test(cleanPhone);
    const digitCount = cleanPhone.replace(/^\+/, "").length;
    const isValidLength = digitCount >= 7 && digitCount <= 15;
    const hasValidFormat =
      !cleanPhone.startsWith("+0") && !cleanPhone.startsWith("00");

    if (hasOnlyDigitsAndPlus && isValidLength && hasValidFormat) {
      // Check if phone number starts with country code
      const foundCountry = countries.find((country) =>
        cleanPhone.startsWith(country.dialCode),
      );

      if (foundCountry) {
        // Phone number contains country code - show error
        setValidationMessage(
          "❌ يرجى إزالة كود الدولة واختيارها من القائمة المنسدلة",
        );
        setMethod("phone");
        setPhoneNumber("");
        return;
      } else {
        // Phone number without country code - switch to phone mode
        setMethod("phone");
        setValidationMessage("✓ رقم هاتف صحيح");
        setPhoneNumber(cleanPhone);
        return;
      }
    }

    // Invalid input
    if (trimmedValue.includes("@")) {
      setValidationMessage("❌ البريد الإلكتروني غير صحيح");
    } else if (/[0-9]/.test(trimmedValue)) {
      if (digitCount < 7) {
        setValidationMessage(
          "❌ رقم الهاتف قصير جداً (يجب أن يكون 7 أرقام على الأقل)",
        );
      } else if (digitCount > 15) {
        setValidationMessage(
          "❌ رقم الهاتف طويل جداً (يجب أن يكون 15 رقم على الأكثر)",
        );
      } else if (cleanPhone.startsWith("+0") || cleanPhone.startsWith("00")) {
        setValidationMessage(
          "❌ رقم الهاتف غير صحيح (لا يمكن أن يبدأ بـ +0 أو 00)",
        );
      } else {
        setValidationMessage("❌ رقم الهاتف غير صحيح");
      }
    } else {
      setValidationMessage("❌ يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح");
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: typeof selectedCountry) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  // Get flag component
  const getFlagComponent = (countryCode: string) => (
    <span
      className="inline-block bg-cover bg-center"
      style={{
        backgroundImage: `url(https://flagcdn.com/24x18/${countryCode}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "inline-block",
        width: "20px",
        height: "15px",
      }}
    />
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني أو رقم الهاتف");
      return;
    }

    // Simple validation
    const trimmedValue = identifier.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidEmail = emailRegex.test(trimmedValue);
    const isValidPhone =
      method === "phone" && phoneNumber && phoneNumber.length >= 7;

    if (!isValidEmail && !isValidPhone) {
      toast.error("يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح");
      return;
    }

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.");
      return;
    }

    const recaptchaReady = await ensureRecaptchaReady();
    if (!recaptchaReady) {
      toast.error(RECAPTCHA_LOAD_ERROR_MESSAGE);
      return;
    }

    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("forgot_password");

      // Prepare request body based on method
      const requestBody =
        method === "phone"
          ? {
              identifier: phoneNumber,
              country_code: selectedCountry.dialCode,
              method: method,
              recaptcha_token: recaptchaToken,
            }
          : {
              identifier: identifier.trim(),
              method: method,
              recaptcha_token: recaptchaToken,
            };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "حدث خطأ أثناء إرسال رمز إعادة التعيين",
        );
      }

      // حفظ البيانات في Zustand store
      setUserIdentifier(identifier.trim());
      setUserMethod(method);
      setResetAttempts(data.attempts_remaining);
      setCountdown(60);
      setResendCountdown(60); // إضافة countdown لإعادة الإرسال

      if (data.attempts_remaining === 0) {
        setIsBlocked(true);
        toast.error(
          "تم تجاوز الحد الأقصى للمحاولات. يرجى التواصل مع فريق الدعم.",
        );
      } else {
        toast.success(
          `تم إرسال رمز إعادة التعيين بنجاح (المحاولة ${data.attempts_used}/3)`,
        );
        setShowCodeForm(true);

        // إنشاء رابط إعادة التعيين
        const resetUrl = `taearif.com/reset?code=${data.code_for_testing || data.code}`;
        setResetUrl(resetUrl);
      }
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(
        isRecaptchaError(rawMessage)
          ? RECAPTCHA_LOAD_ERROR_MESSAGE
          : rawMessage || "حدث خطأ أثناء الاتصال بالخادم",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetCode.trim()) {
      toast.error("يرجى إدخال رمز التحقق");
      return;
    }

    if (!newPassword.trim()) {
      toast.error("يرجى إدخال كلمة المرور الجديدة");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.");
      return;
    }

    const recaptchaReadyReset = await ensureRecaptchaReady();
    if (!recaptchaReadyReset) {
      toast.error(RECAPTCHA_LOAD_ERROR_MESSAGE);
      return;
    }

    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("reset_password");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/verify-reset-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: resetCode.trim(),
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
            recaptcha_token: recaptchaToken,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Invalid or expired code") {
          toast.error("الكود غير صحيح أو منتهي الصلاحية");
        } else {
          throw new Error(
            data.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور",
          );
        }
        return;
      }

      toast.success("تم تغيير كلمة المرور بنجاح");
      resetUserAuth(); // إعادة تعيين البيانات
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(
        isRecaptchaError(rawMessage)
          ? RECAPTCHA_LOAD_ERROR_MESSAGE
          : rawMessage || "حدث خطأ أثناء الاتصال بالخادم",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.");
      return;
    }

    const recaptchaReadyResend = await ensureRecaptchaReady();
    if (!recaptchaReadyResend) {
      toast.error(RECAPTCHA_LOAD_ERROR_MESSAGE);
      return;
    }

    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("forgot_password");

      // Prepare request body based on method
      const requestBody =
        userMethod === "phone"
          ? {
              identifier: phoneNumber,
              country_code: selectedCountry.dialCode,
              method: userMethod,
              recaptcha_token: recaptchaToken,
            }
          : {
              identifier: userIdentifier,
              method: userMethod,
              recaptcha_token: recaptchaToken,
            };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "حدث خطأ أثناء إرسال رمز إعادة التعيين",
        );
      }

      setResetAttempts(data.attempts_remaining);
      setResendCountdown(60);

      if (data.attempts_remaining === 0) {
        setIsBlocked(true);
        toast.error(
          "تم تجاوز الحد الأقصى للمحاولات. يرجى التواصل مع فريق الدعم.",
        );
      } else {
        toast.success(
          `تم إرسال رمز إعادة التعيين بنجاح (المحاولة ${data.attempts_used}/3)`,
        );
      }
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(
        isRecaptchaError(rawMessage)
          ? RECAPTCHA_LOAD_ERROR_MESSAGE
          : rawMessage || "حدث خطأ أثناء الاتصال بالخادم",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resetUrl);
      setCopied(true);
      toast.success("تم نسخ الرابط بنجاح");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("فشل في نسخ الرابط");
    }
  };

  const openResetLink = () => {
    window.open(`http://${resetUrl}`, "_blank");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // إذا كان المستخدم في مرحلة إدخال الكود وكلمة المرور
  if (showCodeForm) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-white p-4"
        dir="rtl"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="w-full flex justify-center md:justify-end mb-8 md:mb-6">
            <div className="md:absolute md:top-1 md:right-10">
              <Image
                src="/logo.png"
                alt="Website Builder Logo"
                width={200}
                height={142}
                className="h-[7rem] md:h-[7rem] w-auto object-contain invert"
              />
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white">
            <CardHeader className="text-center pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCodeForm(false);
                  resetUserAuth();
                }}
                className="absolute right-4 top-4 text-black hover:bg-gray-100"
              >
                <ArrowRight className="h-4 w-4 ml-1" />
                رجوع
              </Button>
              <CardTitle className="text-2xl font-bold text-black">
                إعادة تعيين كلمة المرور
              </CardTitle>
              <p className="text-sm text-gray-600">
                أدخل رمز التحقق وكلمة المرور الجديدة
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600">آمن ومشفر</span>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* Identifier Display */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-black">
                    {userMethod === "email"
                      ? "البريد الإلكتروني"
                      : "رقم الهاتف"}
                  </Label>
                  <Input
                    value={userIdentifier}
                    disabled
                    className="py-5 text-right bg-gray-100 text-gray-600"
                  />
                </div>

                {/* Verification Code */}
                <div className="space-y-2">
                  <Label
                    htmlFor="resetCode"
                    className="text-sm font-medium text-black"
                  >
                    رمز التحقق
                  </Label>
                  <div className="relative">
                    <Input
                      id="resetCode"
                      type="text"
                      placeholder="●●●●●●"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="py-5 text-right text-center text-2xl font-bold tracking-[0.5em] placeholder:tracking-[0.5em] placeholder:text-gray-400"
                      maxLength={6}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                    <Key className="absolute inset-y-0 left-0 flex items-center pl-3 h-5 w-5 text-gray-400" />
                  </div>

                  {/* Resend Code Button with Countdown */}
                  <div className="flex justify-center mt-4">
                    {resendCountdown > 0 ? (
                      <div className="relative">
                        <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-2xl shadow-lg">
                          {/* Animated Spinner */}
                          <div className="relative">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-gray-400 rounded-full animate-ping"></div>
                          </div>

                          {/* Text */}
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-black">
                              إعادة الإرسال متاحة خلال
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {/* Countdown Timer */}
                              <div className="relative">
                                <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl shadow-lg">
                                  <span className="text-xl font-bold">
                                    {resendCountdown}
                                  </span>
                                </div>
                                {/* Pulse Effect */}
                                <div className="absolute inset-0 w-12 h-12 bg-gray-400 rounded-xl animate-ping opacity-30"></div>
                              </div>
                              <span className="text-sm font-medium text-gray-600">
                                ثانية
                              </span>
                            </div>
                          </div>

                          {/* Progress Ring */}
                          <div className="relative w-8 h-8">
                            <svg
                              className="w-8 h-8 transform -rotate-90"
                              viewBox="0 0 36 36"
                            >
                              <path
                                className="text-gray-200"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-black"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray={`${(resendCountdown / 60) * 100}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className="group flex items-center gap-3 px-8 py-3 bg-white border border-gray-300 text-black hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg transition-all duration-300 rounded-2xl shadow-md hover:scale-105"
                      >
                        <div className="relative">
                          <svg
                            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          <div className="absolute inset-0 w-5 h-5 bg-gray-400 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <span className="font-medium">إعادة إرسال الكود</span>
                        <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                      </Button>
                    )}
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-black"
                  >
                    كلمة المرور الجديدة
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور الجديدة"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="py-5 text-right"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength
                                ? passwordStrength <= 2
                                  ? "bg-red-500"
                                  : passwordStrength <= 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        {passwordStrength <= 2 && "ضعيف"}
                        {passwordStrength === 3 && "متوسط"}
                        {passwordStrength >= 4 && "قوي"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-black"
                  >
                    تأكيد كلمة المرور
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="أعد إدخال كلمة المرور الجديدة"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="py-5 text-right"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 mt-2 bg-black hover:bg-gray-800 text-white"
                  disabled={
                    isLoading ||
                    !resetCode.trim() ||
                    !newPassword.trim() ||
                    !confirmPassword.trim()
                  }
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      جاري إعادة تعيين كلمة المرور...
                    </div>
                  ) : (
                    "إعادة تعيين كلمة المرور"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-white p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="w-full flex justify-center md:justify-end mb-8 md:mb-6">
          <div className="md:absolute md:top-1 md:right-10">
            <Image
              src="/logo.png"
              alt="Website Builder Logo"
              width={200}
              height={142}
              className="h-[7rem] md:h-[7rem] w-auto object-contain invert"
            />
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="text-center pb-4">
            <Link href="/login" className="absolute right-4 top-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-black hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 ml-1" />
                رجوع
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold text-black">
              نسيت كلمة المرور؟
            </CardTitle>
            <p className="text-sm text-gray-600">
              أدخل بريدك الإلكتروني أو رقم هاتفك لإرسال رمز إعادة التعيين
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500">آمن ومشفر</span>
            </div>
          </CardHeader>
          <CardContent>
            {isBlocked ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">تم تجاوز الحد الأقصى للمحاولات</p>
                  <p className="text-sm mt-1">
                    يرجى التواصل مع فريق الدعم للمساعدة
                  </p>
                </div>
                <Button
                  onClick={() =>
                    (window.location.href = "mailto:support@taearif.com")
                  }
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  التواصل مع الدعم
                </Button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5" dir="ltr">
                  {/* Smart Input Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="identifier"
                      className="text-sm font-medium text-black"
                    >
                      البريد الإلكتروني أو رقم الهاتف
                    </Label>

                    {method === "phone" ? (
                      // Phone input with country selector
                      <div className="flex relative" ref={dropdownRef}>
                        {/* Phone Input */}
                        <Input
                          id="identifier"
                          type="tel"
                          placeholder="123456789"
                          value={phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only digits
                            if (/^[\d]*$/.test(value)) {
                              setPhoneNumber(value);
                              setIdentifier(value);

                              // If phone number is empty, reset to email mode
                              if (value === "") {
                                setMethod("email");
                                setValidationMessage("");
                                return;
                              }

                              // Validate phone number
                              if (value.length >= 7 && value.length <= 15) {
                                setValidationMessage("✓ رقم هاتف صحيح");
                              } else if (value.length > 0) {
                                setValidationMessage(
                                  "❌ رقم الهاتف يجب أن يكون بين 7-15 رقم",
                                );
                              } else {
                                setValidationMessage("");
                              }
                            }
                          }}
                          className={`flex-1 py-5 text-left rounded-r-none border-r-0 focus:ring-0 focus:border-gray-300 focus:outline-none ${
                            validationMessage.includes("✓")
                              ? "border-green-500 bg-green-50"
                              : validationMessage.includes("❌")
                                ? "border-red-500 bg-red-50"
                                : ""
                          }`}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                        />

                        {/* Country Selector Button */}
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="flex items-center justify-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-gray-400 min-w-[80px]"
                        >
                          {getFlagComponent(selectedCountry.code)}
                          <span className="text-xs ml-1 text-gray-600">▼</span>
                        </button>

                        {/* Dropdown */}
                        {isDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                            {countries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => handleCountrySelect(country)}
                                className="w-full px-3 py-2 text-left flex items-center space-x-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                              >
                                {getFlagComponent(country.code)}
                                <span className="text-sm text-gray-600 min-w-[45px]">
                                  {country.dialCode}
                                </span>
                                <span className="text-sm flex-1">
                                  {country.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Email input
                      <div className="relative" dir="ltr">
                        <Input
                          id="identifier"
                          type="text"
                          placeholder="example@gmail.com"
                          value={identifier}
                          onChange={handleIdentifierChange}
                          className={`py-5 text-left focus:ring-0 focus:border-gray-300 focus:outline-none ${
                            validationMessage.includes("✓")
                              ? "border-green-500 bg-green-50"
                              : validationMessage.includes("❌")
                                ? "border-red-500 bg-red-50"
                                : ""
                          }`}
                          dir="ltr"
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                        />
                      </div>
                    )}

                    {/* Validation Message */}
                    {validationMessage && (
                      <div
                        className={`text-sm ${
                          validationMessage.includes("✓")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                        dir="ltr"
                      >
                        {validationMessage}
                      </div>
                    )}

                    {/* Phone Warning Message */}
                    {method === "phone" && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-yellow-600 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium">تنبيه مهم:</p>
                            <p>
                              يرجى كتابة رقم الهاتف فقط بدون كود الدولة (+966،
                              +971، إلخ)
                            </p>
                            <p className="text-xs mt-1 text-yellow-700">
                              سيتم إضافة كود الدولة تلقائياً من القائمة المنسدلة
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Input Type Indicator */}
                    {(identifier || phoneNumber) && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            method === "email" ? "bg-blue-500" : "bg-green-500"
                          }`}
                        ></div>
                        <span>
                          {method === "email"
                            ? "سيتم الإرسال عبر البريد الإلكتروني"
                            : `سيتم الإرسال عبر الرسائل النصية إلى ${selectedCountry.dialCode}${phoneNumber}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {resetAttempts < 3 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm">
                      <p>المحاولات المتبقية: {resetAttempts}</p>
                    </div>
                  )}

                  {countdown > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-sm text-center">
                      <p>يرجى الانتظار قبل إعادة المحاولة</p>
                      <p className="font-mono text-lg font-bold">
                        {formatTime(countdown)}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full py-6 mt-2 bg-black hover:bg-gray-800 text-white"
                    disabled={
                      isLoading ||
                      countdown > 0 ||
                      (!identifier.trim() && !phoneNumber) ||
                      !validationMessage.includes("✓")
                    }
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        جاري الإرسال...
                      </div>
                    ) : (
                      "إرسال رمز إعادة التعيين"
                    )}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    تذكر كلمة المرور؟{" "}
                    <Link
                      href="/login"
                      className="text-black font-semibold hover:underline"
                    >
                      تسجيل الدخول
                    </Link>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
