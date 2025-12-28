"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { Check, AlertCircle } from "lucide-react";
import Image from "next/image";
import { trackLogin, trackError } from "@/lib/gtm";

export default function OAuthSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          setStatus("error");
          setErrorMessage("لم يتم العثور على رمز المصادقة");
          return;
        }

        // تحديث الـ token في AuthStore مؤقتاً
        useAuthStore.setState({
          userData: {
            ...useAuthStore.getState().userData,
            token: token,
          },
        });

        // جلب بيانات المستخدم من الخادم باستخدام التوكن
        const response = await axiosInstance.get("/user");

        if (!response.data || !response.data.data) {
          throw new Error("لم يتم العثور على بيانات المستخدم");
        }

        const userData = response.data.data;

        // تحضير بيانات المستخدم للحفظ محلياً
        const user = {
          email: userData.email,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          onboarding_completed: userData.onboarding_completed || false,
        };

        // حفظ بيانات المستخدم والتوكن محلياً
        const setAuthResponse = await fetch("/api/user/setAuth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user,
            UserToken: token,
          }),
        });

        if (!setAuthResponse.ok) {
          const errorData = await setAuthResponse.json().catch(() => ({}));
          throw new Error(errorData.error || "فشل في حفظ بيانات المصادقة");
        }

        // تحديث الـ AuthStore بالبيانات الكاملة
        useAuthStore.setState({
          UserIslogged: true,
          userData: {
            email: user.email,
            token: token,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            onboarding_completed: user.onboarding_completed,
            // إضافة بيانات العضوية إذا كانت موجودة
            domain: userData.domain || null,
            is_free_plan: userData.membership?.is_free_plan || null,
            is_expired: userData.membership?.is_expired || false,
            days_remaining: userData.membership?.days_remaining || null,
            package_title: userData.membership?.package?.title || null,
            package_features: userData.membership?.package?.features || [],
            project_limit_number:
              userData.membership?.package?.project_limit_number || null,
            real_estate_limit_number:
              userData.membership?.package?.real_estate_limit_number || null,
          },
        });

        await useAuthStore.getState().fetchUserData();

        setStatus("success");

        // Track successful login
        trackLogin("oauth");

        // التحقق من الصفحة المرجعية لتحديد وجهة التوجيه
        const returnPage = localStorage.getItem("oauth_return_page");
        localStorage.removeItem("oauth_return_page");

        // التوجيه حسب نوع العملية
        setTimeout(() => {
          if (returnPage === "register" || !user.onboarding_completed) {
            router.push("/");
          } else {
            router.push("/");
          }
        }, 2000);
      } catch (error) {
        console.error("OAuth success handling error:", error);
        setStatus("error");
        const errorMsg =
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء معالجة تسجيل الدخول";
        setErrorMessage(errorMsg);

        // Track error
        trackError(errorMsg, "oauth_error");
      }
    };

    // تشغيل المعالج
    handleOAuthSuccess();
  }, [searchParams, router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="w-full flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Website Builder Logo"
            width={200}
            height={142}
            className="h-[7rem] w-auto object-contain dark:invert"
          />
        </div>

        <div className="text-center py-8 bg-muted/50 rounded-lg border border-border">
          {status === "loading" && (
            <>
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <svg
                  className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-500"
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
              </div>
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-500 mb-2">
                جاري تسجيل الدخول...
              </h3>
              <p className="text-muted-foreground">
                يرجى الانتظار بينما نقوم بمعالجة بيانات تسجيل الدخول
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto bg-green-100 dark:bg-green-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <Check className="h-10 w-10 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-700 dark:text-green-500 mb-2">
                تم تسجيل الدخول بنجاح!
              </h3>
              <p className="text-muted-foreground mb-4">
                سيتم تحويلك إلى لوحة التحكم خلال لحظات...
              </p>
              <div className="w-16 h-1 bg-muted rounded-full mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 h-full bg-green-500 animate-progress"></div>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto bg-red-100 dark:bg-red-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-700 dark:text-red-500 mb-2">
                فشل في تسجيل الدخول
              </h3>
              <p className="text-muted-foreground mb-4">{errorMessage}</p>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full bg-foreground text-background px-6 py-2 rounded-md hover:bg-foreground/90 transition-colors"
                >
                  العودة لتسجيل الدخول
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-muted text-foreground px-6 py-2 rounded-md hover:bg-muted/80 transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CSS Animation */}
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
