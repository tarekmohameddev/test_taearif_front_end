// components/google-register-page.tsx
"use client";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/context/AuthContext";
import { selectUserIsLogged } from "@/context/auth/selectors";
import Link from "next/link";
import { Eye, EyeOff, Check, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { trackSignup, trackError, trackFormSubmission } from "@/lib/gtm";
import {
  ensureRecaptchaReady,
  RECAPTCHA_LOAD_ERROR_MESSAGE,
  isRecaptchaError,
} from "@/lib/recaptcha";

// تعريف واجهة البيانات الخاصة بالنموذج
interface FormData {
  phone: string;
  subdomain: string;
  referral_code?: string;
}

// تعريف واجهة الأخطاء الخاصة بالنموذج
interface Errors {
  api: string;
  phone: string;
  subdomain: string;
  general: string;
  tempToken: string;
}

export function GoogleRegisterPage() {
  const UserIslogged = useAuthStore(selectUserIsLogged);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const searchParams = useSearchParams();

  // استخراج temp_token من URL
  const tempToken = searchParams.get("temp_token");

  const [referralCodeLocked, setReferralCodeLocked] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    phone: "",
    subdomain: "",
    referral_code: "",
  });

  // حالة الأخطاء
  const [errors, setErrors] = useState<Errors>({
    api: "",
    phone: "",
    subdomain: "",
    general: "",
    tempToken: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [subdomainFocused, setSubdomainFocused] = useState(false);
  const [subdomainSuggestions, setSubdomainSuggestions] = useState<string[]>(
    [],
  );

  // Validate phone
  const validatePhone = (phone: string) => {
    // Saudi phone validation (9 digits after the country code)
    const phoneRegex = /^(5\d{8})$/;
    if (!phone) return "رقم الهاتف مطلوب";
    if (!phoneRegex.test(phone))
      return "رقم الهاتف غير صالح (يجب أن يبدأ بـ 5 ويتكون من 9 أرقام)";
    return "";
  };

  // Validate subdomain
  const validateSubdomain = (subdomain: string) => {
    // Check for Arabic characters
    const arabicRegex = /[\u0600-\u06FF]/;
    // Check for valid domain format (letters, numbers, hyphens, no spaces)
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

    if (!subdomain) return "اسم موقعك الإلكتروني مطلوب";
    if (arabicRegex.test(subdomain))
      return "لا يمكن استخدام الأحرف العربية في اسم الموقع";
    if (!subdomainRegex.test(subdomain))
      return "اسم الموقع يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط";
    return "";
  };

  // التحقق من وجود temp_token
  useEffect(() => {
    if (!tempToken) {
      setErrors((prev) => ({
        ...prev,
        tempToken: "رمز التوثيق المؤقت مفقود. يرجى المحاولة مرة أخرى.",
      }));
    }
  }, [tempToken]);

  useEffect(() => {
    if (UserIslogged == true) {
      router.push("/");
    }
  }, [UserIslogged]);

  // Generate subdomain suggestions (يمكن تحسينها بناءً على معلومات Google المتاحة)
  useEffect(() => {
    // يمكن إضافة منطق لإنتاج اقتراحات بناءً على معلومات Google المستخدم إذا كانت متاحة
    const suggestions = ["my-website", "my-site", "portfolio"];
    setSubdomainSuggestions(suggestions);
  }, []);

  // التقاط referral_code من URL عند فتح الصفحة
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("referral_code");
      if (code) {
        setFormData((prev) => ({ ...prev, referral_code: code }));
        setReferralCodeLocked(true);
      }
    }
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // لا تسمح بتغيير referral_code إذا كان مقفولاً
    if (name === "referral_code" && referralCodeLocked) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Handle subdomain suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setFormData((prev) => ({
      ...prev,
      subdomain: suggestion,
    }));
    setErrors((prev) => ({
      ...prev,
      subdomain: "",
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    // التحقق من وجود temp_token
    if (!tempToken) {
      setErrors((prev) => ({
        ...prev,
        tempToken: "رمز التوثيق المؤقت مفقود. يرجى المحاولة مرة أخرى.",
      }));
      setIsSubmitting(false);
      return;
    }

    const newErrors: Errors = {
      phone: validatePhone(formData.phone),
      subdomain: validateSubdomain(formData.subdomain),
      general: "",
      api: "",
      tempToken: "",
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      try {
        // التحقق من توفر executeRecaptcha
        if (!executeRecaptcha) {
          setErrors((prev) => ({
            ...prev,
            general: "reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.",
          }));
          setIsSubmitting(false);
          return;
        }

        const recaptchaReady = await ensureRecaptchaReady();
        if (!recaptchaReady) {
          setErrors((prev) => ({
            ...prev,
            general: RECAPTCHA_LOAD_ERROR_MESSAGE,
          }));
          setIsSubmitting(false);
          return;
        }

        // الحصول على رمز reCAPTCHA
        const recaptchaToken = await executeRecaptcha("google_register");

        const link = `${process.env.NEXT_PUBLIC_Backend_URL}/register`; // أو أي endpoint مخصص للـ Google register
        const payload: any = {
          phone: formData.phone,
          username: formData.subdomain,
          temp_token: tempToken, // إضافة temp_token هنا
          recaptcha_token: recaptchaToken,
        };
        if (formData.referral_code) {
          payload.referral_code = formData.referral_code;
        }

        const response = await axios.post(link, payload, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.data.message || "فشل إكمال التسجيل");
        }

        const { user, token: UserToken } = response.data;

        // إرسال بيانات المستخدم والتوكن إلى /api/user/setAuth
        const setAuthResponse = await fetch("/api/user/setAuth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user, UserToken }),
        });

        if (!setAuthResponse.ok) {
          const errorData = await setAuthResponse.json().catch(() => ({}));
          const errorMsg = errorData.error || "فشل في تعيين التوكن";
          console.error("❌ Error setting auth:", errorMsg);
          setErrors((prevErrors) => ({
            ...prevErrors,
            api: errorMsg,
          }));
          return;
        }

        if (setAuthResponse.ok) {
          await useAuthStore.getState().fetchUserData();
          useAuthStore.setState({
            UserIslogged: true,
            userData: {
              email: user.email,
              token: UserToken,
              username: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
            },
          });
          setFormSubmitted(true);

          // Track successful signup
          trackSignup("google");
          trackFormSubmission("google_register", "signup");

          setTimeout(() => {
            router.push("/onboarding");
          }, 1500);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || error.message;
          console.error("❌ Axios error:", errorMessage);

          if (errorMessage.includes("The username has already")) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              api: "اسم موقعك مسجل بالفعل.",
            }));
          } else if (errorMessage.includes("temp_token")) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              api: "رمز التوثيق المؤقت غير صالح أو منتهي الصلاحية.",
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              api: `${errorMessage}`,
            }));
          }
        } else {
          console.error("❌ Unexpected error:", error);
          const rawMessage =
            error instanceof Error ? error.message : String(error);
          const errorMsg = isRecaptchaError(rawMessage)
            ? RECAPTCHA_LOAD_ERROR_MESSAGE
            : rawMessage || "حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.";
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: errorMsg,
          }));

          // Track error
          trackError(errorMsg, "google_register_error");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background p-4"
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
              className="h-[7rem] md:h-[7rem] w-auto object-contain dark:invert"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-foreground sm:mt-20">
          إكمال إنشاء الحساب
        </h1>
        <p className="text-sm text-center text-muted-foreground mb-6">
          يرجى إكمال المعلومات التالية لإنهاء إنشاء حسابك مع Google
        </p>

        {/* عرض خطأ temp_token إذا كان مفقوداً */}
        {errors.tempToken && (
          <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20 mb-6">
            <p className="text-destructive text-sm flex items-center">
              <AlertCircle className="h-3 w-3 ml-1" />
              {errors.tempToken}
            </p>
            <div className="mt-2">
              <Link
                href="/login"
                className="text-sm text-foreground hover:underline"
              >
                العودة إلى صفحة تسجيل الدخول
              </Link>
            </div>
          </div>
        )}

        {formSubmitted ? (
          <div className="text-center py-8 bg-muted/50 rounded-lg border border-border">
            <div className="mx-auto bg-green-100 dark:bg-green-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <Check className="h-10 w-10 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-green-700 dark:text-green-500 mb-2">
              تم إنشاء الحساب بنجاح!
            </h3>
            <p className="text-muted-foreground mb-4">
              سيتم تحويلك إلى لوحة التحكم خلال لحظات...
            </p>
            <div className="w-16 h-1 bg-muted rounded-full mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 h-full bg-green-500 animate-progress"></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Field */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                رقم الهاتف
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div className="flex items-center bg-muted p-1.5 rounded-md">
                    <Image
                      src="/SAUDI_FLAG.svg"
                      alt="Saudi Arabia"
                      width={24}
                      height={16}
                      className="rounded-sm ml-1"
                    />
                    <span className="text-sm font-medium text-foreground">
                      +966
                    </span>
                  </div>
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="5XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`pr-28 py-5 text-right ${errors.phone ? "border-destructive" : ""}`}
                />
              </div>
              {errors.phone && (
                <div className="space-y-1">
                  <p className="text-destructive text-sm flex items-center">
                    <AlertCircle className="h-3 w-3 ml-1" />
                    {errors.phone}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-start">
                    <Info className="h-3 w-3 ml-1 mt-0.5 flex-shrink-0" />
                    أدخل رقم هاتفك السعودي المكون من 9 أرقام ويبدأ بـ 5 (مثال:
                    5XXXXXXXX)
                  </p>
                </div>
              )}
            </div>

            {/* Subdomain Field */}
            <div className="space-y-2">
              <Label
                htmlFor="subdomain"
                className="text-sm font-medium text-foreground"
              >
                اسم موقعك الإلكتروني
              </Label>
              <div className="relative">
                <Input
                  id="subdomain"
                  name="subdomain"
                  type="text"
                  placeholder="your-website-name"
                  value={formData.subdomain}
                  onChange={handleChange}
                  onFocus={() => setSubdomainFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setSubdomainFocused(false), 200)
                  }
                  className={`pl-32 py-5 text-right ${errors.subdomain ? "border-destructive" : ""}`}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-sm font-medium text-muted-foreground">
                    .taearif.com
                  </span>
                </div>
              </div>

              {/* Subdomain Suggestions */}
              {subdomainFocused && subdomainSuggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2 text-foreground">
                    اقتراحات:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subdomainSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {errors.subdomain && (
                <div className="space-y-1">
                  <p className="text-destructive text-sm flex items-center">
                    <AlertCircle className="h-3 w-3 ml-1" />
                    {errors.subdomain}
                  </p>
                  <div className="bg-muted/50 p-3 rounded-lg border border-border mt-1">
                    <h4 className="text-sm font-medium mb-2 flex items-center text-foreground">
                      <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                      إرشادات اختيار اسم الموقع:
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1 mr-5 list-disc">
                      <li>استخدم الأحرف الإنجليزية الصغيرة فقط (a-z)</li>
                      <li>يمكنك استخدام الأرقام (0-9)</li>
                      <li>يمكنك استخدام الشرطات (-) للفصل بين الكلمات</li>
                      <li>
                        لا تستخدم المسافات أو الأحرف العربية أو الرموز الخاصة
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Referral Code Field */}
            <div className="space-y-2">
              <Label
                htmlFor="referral_code"
                className="text-sm font-medium text-foreground"
              >
                رمز الإحالة (اختياري)
              </Label>
              <Input
                id="referral_code"
                name="referral_code"
                type="text"
                placeholder="أدخل رمز الإحالة إذا كان لديك"
                value={formData.referral_code || ""}
                onChange={handleChange}
                className="py-5 text-right"
                disabled={referralCodeLocked}
              />
            </div>

            {/* API Error Display */}
            {errors.api && (
              <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                <p className="text-destructive text-sm flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.api}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-6 mt-4 bg-foreground hover:bg-foreground/90 text-background"
              disabled={isSubmitting || formSubmitted || !tempToken}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-background"
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
                  جاري إكمال التسجيل...
                </div>
              ) : formSubmitted ? (
                "تم التسجيل بنجاح ✓"
              ) : (
                "إكمال إنشاء الحساب"
              )}
            </Button>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="text-foreground font-semibold hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-8">
          بالاستمرار، فإنك توافق على{" "}
          <Link
            href="/terms"
            className="text-foreground underline hover:no-underline"
          >
            شروط الخدمة
          </Link>{" "}
          و{" "}
          <Link
            href="/privacy"
            className="text-foreground underline hover:no-underline"
          >
            سياسة الخصوصية
          </Link>
          .
        </p>
      </div>

      {/* Add custom animation for progress bar */}
      <style jsx global>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 2s linear forwards;
        }
      `}</style>
    </div>
  );
}
