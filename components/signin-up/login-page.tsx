// components/login-page.tsx
"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useAuthStore from "@/context/AuthContext";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { signIn, getSession } from "next-auth/react";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import { LoginPageWithReCaptcha } from "./LoginPageWithReCaptcha";

function LoginPageContent() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const router = useRouter();

  // Token validation
  const { tokenValidation: tokenValidationHook } = useTokenValidation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const { UserIslogged, userData } = useAuthStore();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [recaptchaLoadFailed, setRecaptchaLoadFailed] = useState(false);
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [googleToken, setGoogleToken] = useState<string>("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { googleUrlFetched, setGoogleUrlFetched, fetchGoogleAuthUrl } =
    useAuthStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [pendingToken, setPendingToken] = useState<string>("");
  const [tokenValidation, setTokenValidation] = useState<{
    isValid: boolean | null;
    message: string;
    loading: boolean;
  }>({
    isValid: null,
    message: "",
    loading: false,
  });
  const [newUserData, setNewUserData] = useState<any>(null);
  const [isSameAccount, setIsSameAccount] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };
  // مراقبة جاهزية ReCAPTCHA مع إعادة المحاولة
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;

    const checkRecaptcha = () => {
      if (executeRecaptcha) {
        setRecaptchaReady(true);
        return true;
      }
      return false;
    };

    // محاولة فورية
    if (checkRecaptcha()) return;

    // إعادة المحاولة كل 500ms
    const interval = setInterval(() => {
      retryCount++;

      if (checkRecaptcha()) {
        clearInterval(interval);
      } else if (retryCount >= maxRetries) {
        clearInterval(interval);
        setRecaptchaLoadFailed(true);
        console.warn("ReCAPTCHA failed to load after multiple retries");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [executeRecaptcha]);

  useEffect(() => {
    const loadGoogleAuthUrl = async () => {
      const url = await fetchGoogleAuthUrl();
      if (url) {
        setGoogleAuthUrl(url);
      }
    };
    loadGoogleAuthUrl();
  }, [fetchGoogleAuthUrl]);

  useEffect(() => {
    // التحقق من وجود token في الـ URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasToken = urlParams.get("token");

    // التحقق من وجود بيانات في localStorage أيضاً
    let hasLocalStorageData = false;
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.email) {
            hasLocalStorageData = true;
          }
        }
      } catch (error) {
        // تجاهل الأخطاء في قراءة localStorage
      }
    }

    // التحقق من وجود cookie authToken
    let hasAuthCookie = false;
    if (typeof window !== "undefined") {
      try {
        const cookies = document.cookie.split(";");
        hasAuthCookie = cookies.some((cookie) =>
          cookie.trim().startsWith("authToken=")
        );
      } catch (error) {
        // تجاهل الأخطاء في قراءة cookies
      }
    }

    // إعادة التوجيه فقط إذا كانت هناك بيانات فعلية من store أو localStorage أو cookie
    // وإذا لم يكن هناك token في URL (لأن token في URL يعني تسجيل دخول جديد)
    // وإذا لم يكن هناك dialog مفتوح
    if (
      !hasToken &&
      !showLogoutDialog &&
      (userData?.email || hasLocalStorageData || hasAuthCookie)
    ) {
      // إضافة تأخير بسيط للتأكد من اكتمال أي عمليات جلب بيانات
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 100);

      return () => clearTimeout(redirectTimer);
    }
  }, [userData, router, showLogoutDialog]);

  useEffect(() => {
    if (googleToken) {
      handleGoogleToken(googleToken);
    }
  }, [googleToken]);

  // استخراج التوكن من URL في حالة الـ redirect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token && window.location.pathname.includes("/oauth/token/success")) {
        setGoogleToken(token);
        window.history.replaceState({}, document.title, "/register");
      }
    }
  }, []);

  useEffect(() => {
    const checkTokenAndUser = async () => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        if (token) {
          // تنظيف التوكن من Bearer إذا كان موجود
          let cleanToken = token;
          if (cleanToken.startsWith("Bearer ")) {
            cleanToken = cleanToken.replace("Bearer ", "");
          }

          // التحقق من وجود مستخدم مسجل دخول بالفعل
          try {
            const userInfoResponse = await fetch("/api/user/getUserInfo");
            if (userInfoResponse.ok) {
              const currentUserData = await userInfoResponse.json();
              if (currentUserData && currentUserData.email) {
                // عرض dialog للتحقق من تسجيل الخروج
                setPendingToken(cleanToken);
                setShowLogoutDialog(true);
                // التحقق من صحة الـ token
                validateToken(cleanToken);
                return;
              }
            }
          } catch (error) {
            console.log("No existing user session");
          }

          // عرض dialog للتحقق من الـ token إذا لم يكن هناك مستخدم مسجل دخول
          setPendingToken(cleanToken);
          setShowLoginDialog(true);
          // التحقق من صحة الـ token
          validateToken(cleanToken);
        }
      }
    };

    checkTokenAndUser();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  // دالة التحقق من صحة الـ token
  const validateToken = async (token: string) => {
    setTokenValidation({ isValid: null, message: "", loading: true });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const userData = await response.json();
        const newUser = userData.data || userData;
        setNewUserData(newUser);

        // التحقق من تطابق الحساب
        const currentUser = useAuthStore.getState().userData;
        const isSame = currentUser && currentUser.email === newUser.email;
        setIsSameAccount(isSame);

        if (isSame) {
          setTokenValidation({
            isValid: true,
            message: "نفس الحساب المسجل دخول بالفعل",
            loading: false,
          });
        } else {
          setTokenValidation({
            isValid: true,
            message: "الـ token صالح - يمكن تسجيل الدخول",
            loading: false,
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "الـ token غير صالح";

        if (response.status === 401) {
          errorMessage = "الـ token منتهي الصلاحية أو غير صحيح";
        } else if (response.status === 500) {
          errorMessage = "خطأ في الخادم";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        setTokenValidation({
          isValid: false,
          message: errorMessage,
          loading: false,
        });
      }
    } catch (error) {
      setTokenValidation({
        isValid: false,
        message: "خطأ في الاتصال بالخادم",
        loading: false,
      });
    }
  };

  // دالة تسجيل الدخول بالـ token
  const handleTokenLogin = async (token: string) => {
    setIsLoading(true);
    setErrors({ email: "", password: "", general: "" });

    // تنظيف الكوكيز
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie =
          name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    }

    const { loginWithToken } = useAuthStore.getState();
    const result = await loginWithToken(token);
    setIsLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setErrors((prev) => ({
        ...prev,
        general: result.error || "فشل تسجيل الدخول بالرمز",
      }));
    }
  };

  // دالة تسجيل الخروج وتسجيل الدخول بالـ token الجديد
  const handleLogoutAndLogin = async () => {
    setShowLogoutDialog(false);
    setIsLoading(true);

    try {
      // 1. تنظيف جميع الكوكيز
      if (typeof window !== "undefined") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          // حذف الكوكي من جميع المسارات والنطاقات
          document.cookie =
            name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
          document.cookie =
            name.trim() +
            "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" +
            window.location.hostname;
          document.cookie =
            name.trim() +
            "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." +
            window.location.hostname;
        }
      }

      // 2. تنظيف الـ localStorage والـ sessionStorage
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        // استخدام تسجيل الخروج الصامت بدون إعادة توجيه
        await useAuthStore.getState().logout({ redirect: false });
      }

      // 3. إعادة تعيين الـ AuthStore إلى الحالة الافتراضية

      useAuthStore.setState({
        UserIslogged: false,
        IsLoading: false,
        IsDone: false,
        authenticated: false,
        error: null,
        errorLogin: null,
        errorLoginATserver: null,
        onboarding_completed: false,
        clickedOnSubButton: "domains",
        userData: {
          email: null,
          token: null,
          username: null,
          domain: null,
          first_name: null,
          last_name: null,
          is_free_plan: null,
          days_remaining: null,
          package_title: null,
          package_features: [],
          project_limit_number: null,
          real_estate_limit_number: null,
          message: null,
          company_name: null,
        },
        googleUrlFetched: false,
        googleAuthUrl: null,
      });

      // 4. إزالة الـ token من الـ URL
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, "/login");
      }

      // 5. انتظار قليل للتأكد من اكتمال التنظيف
      setTimeout(() => {
        handleTokenLogin(pendingToken);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setErrors((prev) => ({
        ...prev,
        general: "فشل في تسجيل الخروج",
      }));
    }
  };

  // دالة إلغاء العملية
  const handleCancelLogin = () => {
    setShowLogoutDialog(false);
    setPendingToken("");
    // إزالة الـ token من الـ URL
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, "/login");
    }
  };

  // دالة تأكيد تسجيل الدخول بالـ token
  const handleConfirmTokenLogin = async () => {
    setShowLoginDialog(false);
    await handleTokenLogin(pendingToken);
  };

  // دالة إلغاء تسجيل الدخول بالـ token
  const handleCancelTokenLogin = () => {
    setShowLoginDialog(false);
    setPendingToken("");
    setNewUserData(null);
    setTokenValidation({ isValid: null, message: "", loading: false });
    // إزالة الـ token من الـ URL
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, "/login");
    }
  };

  // دالة الذهاب إلى الصفحة الرئيسية
  const handleGoToHome = () => {
    setShowLogoutDialog(false);
    setPendingToken("");
    setNewUserData(null);
    setTokenValidation({ isValid: null, message: "", loading: false });
    setIsSameAccount(false);
    // إزالة الـ token من الـ URL
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, "/login");
    }
    router.push("/dashboard");
  };

  // تسجيل الدخول بالطريقة التقليدية
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      email: !formData.email ? "البريد الإلكتروني مطلوب" : "",
      password: !formData.password ? "كلمة المرور مطلوبة" : "",
      general: "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== "")) return;

    // Check if reCAPTCHA is available from context
    if (!executeRecaptcha) {
      setErrors((prev) => ({
        ...prev,
        general:
          "reCAPTCHA غير متاح بعد. يرجى الانتظار قليلاً والمحاولة مرة أخرى.",
      }));
      return;
    }

    // Ensure Google reCAPTCHA script is ready before calling executeRecaptcha (avoids window[pf][Kc()] errors)
    if (typeof window !== "undefined") {
      const g = (window as any).grecaptcha;
      if (!g) {
        setErrors((prev) => ({
          ...prev,
          general:
            "التحقق الأمني غير جاهز بعد. حدّث الصفحة أو تأكد من عدم حظر السكربت (مثل حظر الإعلانات).",
        }));
        return;
      }
      if (typeof g.ready === "function") {
        try {
          await g.ready();
        } catch {
          setErrors((prev) => ({
            ...prev,
            general:
              "فشل تحميل التحقق الأمني. حدّث الصفحة أو جرّب تعطيل حظر الإعلانات لهذا الموقع.",
          }));
          return;
        }
      }
    }

    setIsLoading(true);
    try {
      const token = await executeRecaptcha("login");

      // استخدام AuthStore للتسجيل (الطريقة الأصلية)
      const { login } = useAuthStore.getState();
      const result = await login(formData.email, formData.password, token);

      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          general: result.error || "فشل تسجيل الدخول",
        }));
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : String(error);
      const isRecaptchaError =
        /recaptcha|grecaptcha|undefined is not an object/i.test(rawMessage);
      const errorMessage = isRecaptchaError
        ? "فشل التحقق الأمني. جرّب تحديث الصفحة أو تعطيل حظر الإعلانات لهذا الموقع."
        : rawMessage || "حدث خطأ أثناء الاتصال بالخادم";
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الدخول بـ Google
  const handleGoogleLogin = async () => {
    if (!googleAuthUrl) {
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = googleAuthUrl;
    }
  };

  const handleGoogleToken = async (token: string) => {
    try {
      setIsGoogleLoading(true);

      // إرسال التوكن إلى الخادم للتحقق منه والتسجيل
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/google/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            action: "register", // لتمييز عملية التسجيل عن تسجيل الدخول
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "فشل في التحقق من التوكن");
      }

      const data = await response.json();
      const { user, token: UserToken } = data;

      // التحقق من وجود البيانات قبل الاستخدام
      if (!user || !UserToken) {
        throw new Error("بيانات المستخدم غير مكتملة");
      }

      // حفظ بيانات المستخدم باستخدام AuthStore
      const setAuthResponse = await fetch("/api/user/setAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          UserToken: UserToken,
        }),
      });

      if (!setAuthResponse.ok) {
        throw new Error("فشل في حفظ بيانات المصادقة");
      }

      // تحديث الـ AuthStore
      useAuthStore.setState({
        UserIslogged: true,
        userData: {
          email: user.email || "",
          token: UserToken,
          username: user.username || "",
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          onboarding_completed: user.onboarding_completed || false,
        },
      });

      // تشغيل fetchUserData للحصول على البيانات الكاملة
      await useAuthStore.getState().fetchUserData();

      setFormSubmitted(true);
      setTimeout(() => {
        router.push("/onboarding");
      }, 1500);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general:
          error instanceof Error ? error.message : "فشل في التسجيل بـ Google",
      }));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Show loading while validating token
  if (tokenValidationHook.loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من صحة الجلسة...</p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          تسجيل الدخول
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {recaptchaLoadFailed && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-sm">
              لم يتم تحميل التحقق الأمني. تأكد من عدم حظر السكربت أو حدّث الصفحة.
            </div>
          )}
          {!recaptchaReady && !recaptchaLoadFailed && (
            <div className="p-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-md flex items-center text-xs">
              <svg
                className="animate-spin h-3 w-3 ml-2"
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
              جاري تحميل التحقق الأمني...
            </div>
          )}
          {errors.general && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 ml-2" />
              {errors.general}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className={`py-5 text-right ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-destructive text-sm flex items-center">
                <AlertCircle className="h-3 w-3 ml-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Link
                href="/forgot-password"
                className="text-sm text-foreground hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                كلمة المرور
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                className={`py-5 text-right ${errors.password ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm flex items-center">
                <AlertCircle className="h-3 w-3 ml-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={handleCheckboxChange}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-medium cursor-pointer text-foreground"
            >
              تذكرني
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full py-6 mt-2 bg-foreground hover:bg-foreground/90 text-background"
            disabled={isLoading || !recaptchaReady}
          >
            {isLoading ? (
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
                جاري تسجيل الدخول...
              </div>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="text-foreground font-semibold hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              أو الدخول باستخدام
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full py-5 flex items-center justify-center"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <svg
              className="animate-spin h-4 w-4 ml-2"
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
          ) : (
            <>
              <svg className="ml-2 h-4 w-4" viewBox="0 0 488 512">
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Google
            </>
          )}
        </Button>

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

      {/* Dialog للتحقق من تسجيل الخروج */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              تحذير: حساب مسجل دخول بالفعل
            </DialogTitle>
            <DialogDescription className="text-right text-base">
              أنت مسجل دخول بالفعل على الحساب التالي:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* الحساب الحالي المسجل دخول */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h4 className="text-sm font-semibold mb-3 text-foreground">
                الحساب الحالي المسجل دخول:
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    البريد الإلكتروني:
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {userData?.email}
                  </span>
                </div>
                {userData?.first_name && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">الاسم:</span>
                    <span className="text-sm text-muted-foreground">
                      {userData?.first_name} {userData?.last_name}
                    </span>
                  </div>
                )}
                {userData?.username && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">اسم المستخدم:</span>
                    <span className="text-sm text-muted-foreground">
                      {userData?.username}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* حالة التحقق من الـ token */}
            <div className="mt-4 p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">
                  حالة الـ Token الجديد:
                </span>
                {tokenValidation.loading && (
                  <svg
                    className="animate-spin h-4 w-4"
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
                )}
              </div>

              {tokenValidation.loading ? (
                <p className="text-sm text-muted-foreground">
                  جاري التحقق من صحة الـ token...
                </p>
              ) : tokenValidation.isValid === true ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {tokenValidation.message}
                  </p>
                </div>
              ) : tokenValidation.isValid === false ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {tokenValidation.message}
                  </p>
                </div>
              ) : null}
            </div>

            {/* بيانات الحساب الجديد */}
            {tokenValidation.isValid === true && newUserData && (
              <div
                className={`mt-4 p-4 rounded-lg border ${
                  isSameAccount
                    ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                    : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                }`}
              >
                <h4
                  className={`text-sm font-semibold mb-3 ${
                    isSameAccount
                      ? "text-yellow-800 dark:text-yellow-200"
                      : "text-green-800 dark:text-green-200"
                  }`}
                >
                  {isSameAccount
                    ? "نفس الحساب المسجل دخول بالفعل:"
                    : "الحساب الجديد (من الـ Token):"}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      البريد الإلكتروني:
                    </span>
                    <span
                      className={`text-sm ${
                        isSameAccount
                          ? "text-yellow-700 dark:text-yellow-300"
                          : "text-green-700 dark:text-green-300"
                      }`}
                    >
                      {newUserData.email}
                    </span>
                  </div>
                  {newUserData.first_name && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">الاسم:</span>
                      <span
                        className={`text-sm ${
                          isSameAccount
                            ? "text-yellow-700 dark:text-yellow-300"
                            : "text-green-700 dark:text-green-300"
                        }`}
                      >
                        {newUserData.first_name} {newUserData.last_name}
                      </span>
                    </div>
                  )}
                  {newUserData.username && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">اسم المستخدم:</span>
                      <span
                        className={`text-sm ${
                          isSameAccount
                            ? "text-yellow-700 dark:text-yellow-300"
                            : "text-green-700 dark:text-green-300"
                        }`}
                      >
                        {newUserData.username}
                      </span>
                    </div>
                  )}
                  {newUserData.company_name && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">اسم الشركة:</span>
                      <span
                        className={`text-sm ${
                          isSameAccount
                            ? "text-yellow-700 dark:text-yellow-300"
                            : "text-green-700 dark:text-green-300"
                        }`}
                      >
                        {newUserData.company_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                هل تريد تسجيل الخروج من هذا الحساب وتسجيل الدخول على الحساب
                الجديد؟
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelLogin}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              إلغاء
            </Button>

            {isSameAccount ? (
              <Button
                type="button"
                onClick={handleGoToHome}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                الذهاب إلى الصفحة الرئيسية
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleLogoutAndLogin}
                className="flex items-center gap-2 bg-destructive hover:bg-destructive/90"
                disabled={
                  isLoading ||
                  tokenValidation.isValid === false ||
                  tokenValidation.loading
                }
              >
                <LogOut className="h-4 w-4" />
                {isLoading ? "جاري المعالجة..." : "تسجيل الخروج والدخول"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog لتسجيل الدخول بالـ token (عند عدم وجود حساب مسجل دخول) */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              تسجيل الدخول بالـ Token
            </DialogTitle>
            <DialogDescription className="text-right text-base">
              تم العثور على token في الرابط. هل تريد تسجيل الدخول بهذا الحساب؟
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* حالة التحقق من الـ token */}
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">حالة الـ Token:</span>
                {tokenValidation.loading && (
                  <svg
                    className="animate-spin h-4 w-4"
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
                )}
              </div>

              {tokenValidation.loading ? (
                <p className="text-sm text-muted-foreground">
                  جاري التحقق من صحة الـ token...
                </p>
              ) : tokenValidation.isValid === true ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {tokenValidation.message}
                  </p>
                </div>
              ) : tokenValidation.isValid === false ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {tokenValidation.message}
                  </p>
                </div>
              ) : null}
            </div>

            {/* بيانات الحساب من الـ token */}
            {tokenValidation.isValid === true && newUserData && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold mb-3 text-blue-800 dark:text-blue-200">
                  بيانات الحساب:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      البريد الإلكتروني:
                    </span>
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {newUserData.email}
                    </span>
                  </div>
                  {newUserData.first_name && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">الاسم:</span>
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        {newUserData.first_name} {newUserData.last_name}
                      </span>
                    </div>
                  )}
                  {newUserData.username && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">اسم المستخدم:</span>
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        {newUserData.username}
                      </span>
                    </div>
                  )}
                  {newUserData.company_name && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">اسم الشركة:</span>
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        {newUserData.company_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                هل تريد تسجيل الدخول بهذا الحساب؟
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelTokenLogin}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleConfirmTokenLogin}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              disabled={
                isLoading ||
                tokenValidation.isValid === false ||
                tokenValidation.loading
              }
            >
              <LogOut className="h-4 w-4" />
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component الرئيسي مع ReCAPTCHA Wrapper المحلي
export function LoginPage() {
  return (
    <LoginPageWithReCaptcha>
      <LoginPageContent />
    </LoginPageWithReCaptcha>
  );
}
