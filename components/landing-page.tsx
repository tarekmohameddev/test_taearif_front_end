"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Users,
  Building,
  Clock,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Phone,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";
import { trackFormSubmission, trackButtonClick, trackEvent } from "@/lib/gtm";
import {
  ensureRecaptchaReady,
  RECAPTCHA_LOAD_ERROR_MESSAGE,
  isRecaptchaError,
} from "@/lib/recaptcha";

// Zod schema for form validation
const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون على الأقل حرفين"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(
      /^(5\d{8})$/,
      "رقم الهاتف غير صالح (يجب أن يبدأ بـ 5 ويتكون من 9 أرقام)",
    ),
  company: z.string().min(2, "اسم المكتب العقاري مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف"),
});

type FormData = z.infer<typeof registerSchema>;

interface FormErrors {
  name: string;
  email: string;
  phone: string;
  company: string;
  password: string;
  general: string;
}

// Function to translate API error messages to Arabic
const translateErrorMessage = (message: string): string => {
  const errorTranslations: { [key: string]: string } = {
    "Phone number is used, choose different.":
      "رقم الهاتف مستخدم بالفعل، اختر رقماً آخر.",
    "Email is already registered.": "البريد الإلكتروني مسجل بالفعل.",
    "Username is already taken.": "اسم المستخدم مستخدم بالفعل.",
    "Invalid email format.": "تنسيق البريد الإلكتروني غير صالح.",
    "Password is too weak.": "كلمة المرور ضعيفة جداً.",
    "Phone number is invalid.": "رقم الهاتف غير صالح.",
    "Username is required.": "اسم المستخدم مطلوب.",
    "Email is required.": "البريد الإلكتروني مطلوب.",
    "Phone is required.": "رقم الهاتف مطلوب.",
    "Password is required.": "كلمة المرور مطلوبة.",
    "Invalid credentials.": "بيانات الدخول غير صحيحة.",
    "Account not found.": "الحساب غير موجود.",
    "Account is disabled.": "الحساب معطل.",
    "Too many attempts.": "محاولات كثيرة جداً، حاول لاحقاً.",
    "Server error.": "خطأ في الخادم.",
    "Network error.": "خطأ في الشبكة.",
    "Request timeout.": "انتهت مهلة الطلب.",
    "Invalid token.": "الرمز غير صالح.",
    "Token expired.": "انتهت صلاحية الرمز.",
    "Access denied.": "تم رفض الوصول.",
    "Resource not found.": "المورد غير موجود.",
    "Validation failed.": "فشل في التحقق من صحة البيانات.",
    "Database error.": "خطأ في قاعدة البيانات.",
    "Service unavailable.": "الخدمة غير متاحة.",
    "Maintenance mode.": "الموقع في وضع الصيانة.",
    "User already exists.": "المستخدم موجود بالفعل.",
    "Invalid phone number.": "رقم الهاتف غير صالح.",
    "Phone number already exists.": "رقم الهاتف موجود بالفعل.",
    "Email already exists.": "البريد الإلكتروني موجود بالفعل.",
    "Username already exists.": "اسم المستخدم موجود بالفعل.",
    "Registration failed.": "فشل في التسجيل.",
    "Account creation failed.": "فشل في إنشاء الحساب.",
    "Invalid input data.": "بيانات الإدخال غير صحيحة.",
    "Missing required fields.": "حقول مطلوبة مفقودة.",
    "Duplicate entry.": "إدخال مكرر.",
    "Constraint violation.": "انتهاك القيود.",
    "Internal server error.": "خطأ داخلي في الخادم.",
    "Bad request.": "طلب غير صالح.",
    "Unauthorized.": "غير مصرح.",
    "Forbidden.": "ممنوع.",
    "Not found.": "غير موجود.",
    "Method not allowed.": "الطريقة غير مسموحة.",
    "Conflict.": "تعارض.",
    "Unprocessable entity.": "كيان غير قابل للمعالجة.",
    "Too many requests.": "طلبات كثيرة جداً.",
    "Service temporarily unavailable.": "الخدمة غير متاحة مؤقتاً.",
  };

  // Check for exact match first
  if (errorTranslations[message]) {
    return errorTranslations[message];
  }

  // Check for partial matches
  for (const [english, arabic] of Object.entries(errorTranslations)) {
    if (message.toLowerCase().includes(english.toLowerCase())) {
      return arabic;
    }
  }

  // If no translation found, return the original message
  return message;
};

export function LandingPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    general: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const screenHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768; // md breakpoint

      if (isMobile) {
        // On mobile, show header after scrolling past the form section
        const formSection = document.getElementById("form-section");
        if (formSection) {
          const formSectionBottom =
            formSection.offsetTop + formSection.offsetHeight;
          setIsScrolled(scrollPosition > formSectionBottom);
        }
      } else {
        // On desktop, use the original logic
        setIsScrolled(scrollPosition > screenHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // Handle screen size changes
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Validate form data using Zod
      const validatedData = registerSchema.parse(formData);

      // Clear previous errors
      setErrors({
        name: "",
        email: "",
        phone: "",
        company: "",
        password: "",
        general: "",
      });

      // Check if reCAPTCHA is available
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

      // Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha("register");

      // Prepare payload for API
      const payload = {
        email: validatedData.email,
        password: validatedData.password,
        phone: validatedData.phone,
        username: validatedData.company.toLowerCase().replace(/\s+/g, "-"), // Convert company name to subdomain
        recaptcha_token: recaptchaToken,
      };

      // Call register API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/register`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.data.message || "فشل في التسجيل");
      }

      const { user, token: UserToken } = response.data;

      // Set auth data
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
        setErrors((prev) => ({
          ...prev,
          general: errorMsg,
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

        toast.success("تم إنشاء حسابك بنجاح! سيتم تحويلك الآن.");

        // Track successful registration
        trackFormSubmission("landing_page_register", "signup");
        trackEvent("signup_completed", {
          method: "landing_page",
          user_email: user.email,
        });

        setTimeout(() => {
          router.push("/onboarding");
        }, 1500);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const newErrors: FormErrors = {
          name: "",
          email: "",
          phone: "",
          company: "",
          password: "",
          general: "",
        };

        error.errors.forEach((err) => {
          if (err.path[0] in newErrors) {
            newErrors[err.path[0] as keyof FormErrors] = err.message;
          }
        });

        setErrors(newErrors);
      } else if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        const translatedMessage = translateErrorMessage(errorMessage);
        setErrors((prev) => ({
          ...prev,
          general: translatedMessage,
        }));
      } else {
        const rawMessage =
          error instanceof Error ? error.message : String(error);
        const errorMsg = isRecaptchaError(rawMessage)
          ? RECAPTCHA_LOAD_ERROR_MESSAGE
          : rawMessage || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
        setErrors((prev) => ({
          ...prev,
          general: errorMsg,
        }));

        // Track error
        trackEvent("registration_error", {
          error_type: "unexpected_error",
          error_message: errorMsg,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      <Head>
        {/* Snap Pixel Code */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
              {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
              a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
              r.src=n;var u=t.getElementsByTagName(s)[0];
              u.parentNode.insertBefore(r,u);})(window,document,
              'https://sc-static.net/scevent.min.js');

              snaptr('init', '12aec193-f115-47a4-a37d-deb2f0947c08', {});

              snaptr('track', 'PAGE_VIEW');
            `,
          }}
        />
        {/* End Snap Pixel Code */}
      </Head>
      <div className="min-h-screen" dir="rtl">
        <Link
          href="/"
          className={`fixed top-0 w-screen z-50 flex justify-center md:justify-start  backdrop-blur-md h-fit ${isScrolled ? "bg-white/40" : ""}`}
        >
          <div className="mx-4 sm:mx-20">
            <Image
              src="/logo.png"
              alt="Logo"
              width={141}
              height={50}
              className={`transition-all duration-500 ${isScrolled ? "" : "brightness-0 invert"}`}
              //
            />
          </div>
        </Link>

        <section
          id="form-section"
          className="h-fit sm:h-screen py-[9rem] px-4 gradient-mesh text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/modern-buildings-skyline.jpg')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-center lg:text-right fade-in-up">
                <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm text-lg px-4 py-2">
                  <Sparkles className="w-4 h-4 ml-2" />
                  أكثر من 2000 مكتب عقاري
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-black mb-8 text-balance leading-tight">
                  أنشئ موقعك العقاري
                  <span className="block text-transparent bg-gradient-to-l from-white to-gray-300 bg-clip-text">
                    في 3 دقائق
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-200 mb-10 text-pretty leading-relaxed">
                  من رسائل عشوائية على الواتساب… إلى موقع عقاري مرتب واحترافي
                  يجمع كل عروضك في مكان واحد.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="text-lg px-10 py-4 bg-white text-black hover:bg-gray-100 font-semibold"
                  >
                    <Zap className="ml-2 h-5 w-5" />
                    أنشئ موقعك مجاناً
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-10 py-4 border-white text-white hover:bg-white hover:text-black font-semibold bg-transparent"
                    asChild
                  >
                    <a
                      href="https://taearif.taearif.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      شاهد نموذج للموقع
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>بدون بطاقة دفع</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>جاهز في دقائق</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>آمن ومحمي</span>
                  </div>
                </div>
              </div>

              <div className="relative w-full max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent rounded-3xl blur-3xl"></div>
                <Card className="w-full glass-effect border-white/20 shadow-2xl floating-animation">
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-3xl font-bold text-black">
                      ابدأ مجاناً الآن
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      أنشئ موقعك العقاري في دقائق
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-semibold text-gray-700"
                        >
                          الاسم الكامل
                        </Label>
                        <Input
                          id="name"
                          placeholder="أدخل اسمك الكامل"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={`h-12 text-lg border-gray-200 focus:border-black ${errors.name ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold text-gray-700"
                        >
                          البريد الإلكتروني
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`h-12 text-lg border-gray-200 focus:border-black ${errors.email ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-semibold text-gray-700"
                        >
                          رقم الجوال
                        </Label>
                        <Input
                          id="phone"
                          placeholder="05xxxxxxxx"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className={`h-12 text-lg border-gray-200 focus:border-black ${errors.phone ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm">{errors.phone}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="company"
                          className="text-sm font-semibold text-gray-700"
                        >
                          اسم المكتب العقاري
                        </Label>
                        <Input
                          id="company"
                          placeholder="اسم مكتبك العقاري"
                          value={formData.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                          className={`h-12 text-lg border-gray-200 focus:border-black ${errors.company ? "border-red-500" : ""}`}
                        />
                        {errors.company && (
                          <p className="text-red-500 text-sm">
                            {errors.company}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-semibold text-gray-700"
                        >
                          كلمة المرور
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="أدخل كلمة المرور"
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            className={`h-12 text-lg border-gray-200 focus:border-black pr-12 ${errors.password ? "border-red-500" : ""}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm">
                            {errors.password}
                          </p>
                        )}
                      </div>
                      {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-600 text-sm">
                            {errors.general}
                          </p>
                        </div>
                      )}
                      <Button
                        type="submit"
                        className="w-full h-14 text-lg font-semibold bg-black hover:bg-gray-800"
                        disabled={isSubmitting}
                      >
                        <Sparkles className="ml-2 h-5 w-5" />
                        {isSubmitting ? "جاري الإنشاء..." : "أنشئ موقعي مجاناً"}
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        لا نحتاج بطاقة دفع • إلغاء في أي وقت
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-4 bg-gray-50 relative">
          <div className="absolute inset-0 bg-[url('/luxury-villa-exterior.jpg')] bg-cover bg-center opacity-5"></div>
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-black">
                ليش تحتاج موقع عقاري؟
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                موقعك العقاري هو واجهتك الرقمية التي تجذب العملاء وتزيد مبيعاتك
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm group hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className="bg-black text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-black">
                    زيادة المبيعات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-lg">
                    عملاء أكثر يشوفون عقاراتك = مبيعات أكثر
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm group hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className="bg-black text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-black">
                    ثقة العملاء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-lg">
                    موقع احترافي يخلي العملاء يثقون فيك أكثر
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm group hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className="bg-black text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Clock className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-black">
                    توفير الوقت
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-lg">
                    العملاء يشوفون العقارات بدون ما تتعب
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-3xl p-12 shadow-xl">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 text-black">
                  مع تعاريف تحصل على:
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg text-black mb-2">
                        موقع عقاري احترافي
                      </h4>
                      <p className="text-gray-600">
                        قوالب جاهزة ومتوافقة مع الجوال
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg text-black mb-2">
                        عرض العقارات بالصور
                      </h4>
                      <p className="text-gray-600">معرض صور احترافي لكل عقار</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg text-black mb-2">
                        نماذج تواصل
                      </h4>
                      <p className="text-gray-600">
                        العملاء يتواصلون معك مباشرة
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg text-black mb-2">
                        مساعد واتساب ذكي
                      </h4>
                      <p className="text-gray-600">
                        يرد على العملاء 24/7 ويحفظ بياناتهم
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg text-black mb-2">
                        إدارة العملاء
                      </h4>
                      <p className="text-gray-600">
                        نظام CRM لتتبع العملاء والصفقات
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg text-black mb-2">
                        دعم فني مجاني
                      </h4>
                      <p className="text-gray-600">
                        فريق سعودي يساعدك في كل شيء
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-white relative">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-black">
                كيف تنشئ موقعك؟
              </h2>
              <p className="text-xl text-gray-600">3 خطوات بسيطة وموقعك جاهز</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>

              <div className="text-center relative">
                <div className="bg-black text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">
                  سجّل حسابك
                </h3>
                <p className="text-gray-600 text-lg">مجاني بدون بطاقة دفع</p>
              </div>

              <div className="text-center relative">
                <div className="bg-black text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">
                  أضف عقاراتك
                </h3>
                <p className="text-gray-600 text-lg">ارفع الصور والتفاصيل</p>
              </div>

              <div className="text-center relative">
                <div className="bg-black text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">
                  موقعك جاهز!
                </h3>
                <p className="text-gray-600 text-lg">ابدأ استقبال العملاء</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-gray-50 relative">
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-black">
                شوف شكل موقعك
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                موقع عقاري احترافي متوافق مع جميع الأجهزة - جرب النموذج التفاعلي
              </p>
            </div>

            <div className="relative max-w-6xl mx-auto">
              {/* Desktop View */}
              <div className="hidden md:block">
                <a
                  href="https://taearif.taearif.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white p-4 group-hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1 bg-gray-100 rounded-full h-8 flex items-center px-4 mr-4">
                        <span className="text-sm text-gray-500">
                          taearif.taearif.com
                        </span>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src="/Desktop_show_case.jpg"
                        alt="عرض الموقع على سطح المكتب"
                        className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-4">
                          <ArrowRight className="h-8 w-8 text-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <div className="text-center mt-8">
                  <Badge className="bg-black text-white px-6 py-2 text-lg">
                    اضغط لتجربة النموذج التفاعلي
                  </Badge>
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden">
                <a
                  href="https://taearif.taearif.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group cursor-pointer"
                >
                  <div className="relative max-w-sm mx-auto">
                    <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-2">
                      <div className="bg-white rounded-[2rem] overflow-hidden">
                        <div className="relative">
                          <img
                            src="/mobile_show_case.jpg"
                            alt="عرض الموقع على الجوال"
                            className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3">
                              <ArrowRight className="h-6 w-6 text-black" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <div className="text-center mt-8">
                  <Badge className="bg-black text-white px-6 py-2 text-lg">
                    اضغط لتجربة النموذج التفاعلي
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <p className="text-lg text-gray-600 mb-8">
                موقعك سيكون بنفس هذا التصميم الاحترافي
              </p>
              <Button
                size="lg"
                className="text-lg px-10 py-4 bg-black hover:bg-gray-800 font-semibold"
              >
                <Sparkles className="ml-2 h-5 w-5" />
                أريد موقع مثل هذا
              </Button>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 gradient-mesh text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/modern-buildings-skyline.jpg')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-balance">
              لا تخلي منافسيك يسبقونك
              <span className="block text-gray-300">أنشئ موقعك اليوم</span>
            </h2>
            <p className="text-xl lg:text-2xl mb-12 opacity-90 max-w-2xl mx-auto">
              أكثر من 2000 مكتب عقاري اختاروا تعاريف لزيادة مبيعاتهم
            </p>
            <Button
              size="lg"
              className="text-xl px-12 py-6 bg-white text-black hover:bg-gray-100 font-bold"
            >
              <Zap className="ml-2 h-6 w-6" />
              أنشئ موقعي مجاناً الآن
              <ArrowRight className="mr-2 h-6 w-6" />
            </Button>
            <p className="text-sm mt-6 opacity-75">
              بدون بطاقة دفع • جاهز في 5 دقائق
            </p>
          </div>
        </section>

        <footer className="bg-black text-white py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white text-black p-2 rounded-xl">
                    <Building className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-bold">تعاريف</span>
                </div>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  الحل الأول لإنشاء المواقع العقارية في المملكة العربية السعودية
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-lg">تواصل معنا</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">info@taearif.com</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">+966592960339</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
              <p className="text-gray-400">
                © 2025 تعاريف. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
