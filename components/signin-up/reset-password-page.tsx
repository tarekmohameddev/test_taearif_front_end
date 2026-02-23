"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import toast from "react-hot-toast";
import useStore from "@/context/Store";
import {
  ensureRecaptchaReady,
  RECAPTCHA_LOAD_ERROR_MESSAGE,
  isRecaptchaError,
} from "@/lib/recaptcha";

export function ResetPasswordPage() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Zustand store
  const { userIdentifier, userMethod, resetCode, setResetCode, resetUserAuth } =
    useStore();

  // Local state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [codeError, setCodeError] = useState("");

  // استخراج الكود من URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        setResetCode(code);
      } else {
        // إذا لم يكن الكود موجود، توجيه إلى صفحة نسيان كلمة المرور
        setTimeout(() => {
          router.push("/forgot-password");
        }, 1000);
      }
    }
  }, [router, setResetCode]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // إعادة تعيين رسالة الخطأ
    setCodeError("");

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

    const recaptchaReady = await ensureRecaptchaReady();
    if (!recaptchaReady) {
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
            code: resetCode,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
            recaptcha_token: recaptchaToken,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Invalid or expired code") {
          setCodeError("الكود غير صالح أو منتهي الصلاحية");
          toast.error("الكود غير صالح أو منتهي الصلاحية");
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

  // إذا لم يتم تحميل الكود بعد، عرض loading
  if (!resetCode) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-white p-4"
        dir="rtl"
      >
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">
            جاري تحميل صفحة إعادة تعيين كلمة المرور...
          </p>
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
            <Link href="/forgot-password" className="absolute right-4 top-4">
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
              إعادة تعيين كلمة المرور
            </CardTitle>
            <p className="text-sm text-gray-600">أدخل كلمة المرور الجديدة</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600">آمن ومشفر</span>
            </div>
          </CardHeader>
          <CardContent>
            {/* Code Error Message */}
            {codeError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">{codeError}</span>
                </div>
                <p className="text-sm mt-1">
                  يرجى طلب كود جديد من صفحة نسيان كلمة المرور
                </p>
                <Link
                  href="/forgot-password"
                  className="inline-block mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  طلب كود جديد
                </Link>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  !newPassword.trim() ||
                  !confirmPassword.trim() ||
                  !!codeError
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
