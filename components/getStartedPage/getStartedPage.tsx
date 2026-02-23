"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  ensureRecaptchaReady,
  RECAPTCHA_LOAD_ERROR_MESSAGE,
  isRecaptchaError,
} from "@/lib/recaptcha";

export default function GetStartedPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Monitor reCAPTCHA readiness with retry mechanism
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

    // Immediate check
    if (checkRecaptcha()) return;

    // Retry every 500ms up to 10 times (5 seconds total)
    const interval = setInterval(() => {
      retryCount++;

      if (checkRecaptcha()) {
        clearInterval(interval);
      } else if (retryCount >= maxRetries) {
        clearInterval(interval);
        console.warn("reCAPTCHA failed to load after multiple retries");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [executeRecaptcha]);

  const validatePhone = (phoneNumber: string) => {
    if (!phoneNumber.startsWith("05")) {
      return "رقم الهاتف يجب أن يبدأ بـ 05";
    }
    if (phoneNumber.length !== 10) {
      return "رقم الهاتف يجب أن يكون 10 أرقام";
    }
    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
    if (value) {
      setPhoneError(validatePhone(value));
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      setMessage("الرجاء تعبئة جميع الحقول");
      return;
    }

    const phoneValidationError = validatePhone(phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    // Check if reCAPTCHA is available
    if (!executeRecaptcha) {
      setMessage(
        "reCAPTCHA غير متاح بعد. يرجى الانتظار قليلاً والمحاولة مرة أخرى.",
      );
      return;
    }

    const recaptchaReady = await ensureRecaptchaReady();
    if (!recaptchaReady) {
      setMessage(RECAPTCHA_LOAD_ERROR_MESSAGE);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Execute reCAPTCHA and get token
      const recaptchaToken = await executeRecaptcha("get_started_registration");

      // Send request with reCAPTCHA token
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/isthara`,
        {
          name,
          phone,
          event: "معرض بروبتك للتقنيات العقارية",
          timestamp: new Date().toISOString(),
          recaptcha_token: recaptchaToken,
        },
      );

      // Check for success: either response.data.success or 2xx status code (200, 201, etc.)
      if (
        response.data.success ||
        (response.status >= 200 && response.status < 300)
      ) {
        setMessage("تم التسجيل بنجاح! شكراً لك");
        setName("");
        setPhone("");
        setPhoneError("");
      } else {
        setMessage(response.data.error || "حدث خطأ، الرجاء المحاولة مرة أخرى");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.response?.data?.error;

        // Handle specific reCAPTCHA errors
        if (errorMessage && /recaptcha/i.test(errorMessage)) {
          setMessage("فشل التحقق الأمني. يرجى إعادة المحاولة أو تحديث الصفحة.");
        } else {
          setMessage(errorMessage || "حدث خطأ، الرجاء المحاولة مرة أخرى");
        }
      } else {
        const rawMessage =
          error instanceof Error ? error.message : String(error);
        setMessage(
          isRecaptchaError(rawMessage)
            ? RECAPTCHA_LOAD_ERROR_MESSAGE
            : rawMessage || "حدث خطأ، الرجاء المحاولة مرة أخرى",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{ direction: "rtl" }}
      className="min-h-screen bg-[#d7f7ec] text-black relative overflow-hidden flex flex-col items-center justify-between py-4 sm:py-6 md:py-8 px-4 sm:px-6 force-rtl"
    >
      {/* Riyadh Skyline - Background */}
      <div className="absolute bottom-0 sm:right-0 w-[85%] md:w-[60%] lg:w-[50%] lg:w-[40%] h-[300px] pointer-events-none">
        <Image
          src="/images/Riyadh.png"
          alt="Riyadh Skyline"
          fill
          className="object-contain object-bottom opacity-20"
          priority
        />
      </div>

      {/* Top Section - Logos */}
      <div
        className="w-full max-w-6xl relative z-10 mb-4 sm:mb-6 md:mb-8"
        dir="rtl"
      >
        <div className="flex justify-start items-start" dir="rtl">
          {/* Right Logo - Taarif */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="relative w-[120px] h-[120px] sm:w-[144px] sm:h-[144px] md:w-[168px] md:h-[168px] cursor-pointer"
            >
              <Image
                src="/logo.svg"
                alt="Taarif Logo"
                width={168}
                height={168}
                className="object-contain"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="relative z-10 text-center max-w-4xl w-full px-4 sm:px-6"
        dir="rtl"
      >
        {/* Invitation Text */}
        <div
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed space-y-1 sm:space-y-2 font-['Cairo'] mb-8 sm:mb-10 md:mb-12"
          style={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}
        >
          <p>
            شكراً لزيارتك لنا في معرض{" "}
            <span className="text-orange-500 font-semibold">بروبتك</span>{" "}
            للتقنيات العقارية
          </p>
          <p>تفضل بتسجيل بياناتك</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto space-y-4 sm:space-y-6"
          dir="rtl"
        >
          {/* reCAPTCHA Loading Indicator */}
          {!recaptchaReady && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-blue-600"
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
              <span className="text-blue-700 text-sm">
                جاري تحميل التحقق الأمني...
              </span>
            </div>
          )}

          {/* Name Input */}
          <div className="w-full">
            <label
              htmlFor="name"
              className="block text-right text-base sm:text-lg font-semibold mb-2 text-gray-800"
            >
              الاسم <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              dir="rtl"
              className="w-full px-4 py-3 sm:py-4 text-right text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-white text-gray-800"
              aria-required="true"
              disabled={loading}
            />
          </div>

          {/* Phone Input */}
          <div className="w-full">
            <label
              htmlFor="phone"
              className="block text-right text-base sm:text-lg font-semibold mb-2 text-gray-800"
            >
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              required
              dir="rtl"
              placeholder="05xxxxxxxx"
              maxLength={10}
              className="w-full px-4 py-3 sm:py-4 text-right text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-white text-gray-800"
              aria-required="true"
              disabled={loading}
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-2 text-right">
                {phoneError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !recaptchaReady}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 px-6 rounded-lg text-base sm:text-lg transition-colors duration-200 shadow-lg"
          >
            {loading
              ? "جارٍ التسجيل..."
              : !recaptchaReady
                ? "جاري التحميل..."
                : "تسجيل"}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg text-center text-base sm:text-lg ${
                message.includes("بنجاح")
                  ? "bg-green-100 text-green-800 border-2 border-green-300"
                  : "bg-red-100 text-red-800 border-2 border-red-300"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Bottom Section - Event Details */}
      <div
        className="relative z-10 w-full max-w-4xl mt-6 sm:mt-8 md:mt-12 px-4 sm:px-6"
        dir="rtl"
      ></div>
    </div>
  );
}
