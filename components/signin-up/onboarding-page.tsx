// لا تستخدم هذا الملف لانه الصفحة القديمة , الجديد هو OnboardingFlow.tsx
"use client";
import useAuthStore from "@/context/AuthContext";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadSingleFile } from "@/utils/uploadSingle";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, FileImage, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import ColorPicker from "../color-picker";
import { trackPageView, trackFormSubmission, trackEvent } from "@/lib/gtm";

const WEBSITE_CATEGORIES = [
  {
    id: "lawyer",
    title: "خدمات قانونية",
    description: "للمكاتب القانونية والمحامين",
    disabled: true,
  },
  {
    id: "realestate",
    title: "عقارات",
    description: "لقوائم العقارات وملفات الوكلاء",
    disabled: false,
  },
  {
    id: "personal",
    title: "موقع شخصي",
    description: "لعرض أعمالك، مدونتك، أو أعمالك الشخصية",
    disabled: true,
  },
];

const COLOR_PALETTES = [
  { primary: "#1e40af", secondary: "#3b82f6", accent: "#93c5fd" },
  { primary: "#047857", secondary: "#10b981", accent: "#6ee7b7" },
  { primary: "#7c2d12", secondary: "#ea580c", accent: "#fdba74" },
  { primary: "#4c1d95", secondary: "#8b5cf6", accent: "#c4b5fd" },
  { primary: "#0f172a", secondary: "#334155", accent: "#94a3b8" },
];

interface FormErrors {
  title?: string;
  valLicense?: string;
  workingHours?: string;
  address?: string;
  [key: string]: string | undefined;
}

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadError, setUploadError] = useState<string>("");
  const [whereErrors, setWhereError] = useState<string>("");
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  const titleRef = useRef<HTMLInputElement>(null);
  const valLicenseRef = useRef<HTMLInputElement>(null);
  const workingHoursRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const [websiteData, setWebsiteData] = useState({
    title: "",
    logo: null as string | null,
    favicon: null as string | null,
    logoFile: null as File | null,
    faviconFile: null as File | null,
    category: "realestate",
    colors: { ...COLOR_PALETTES[0] },
    valLicense: "",
    workingHours: "",
    address: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // الحصول على قيمة onboarding_completed من Zustand
  const onboarding_completed = useAuthStore(
    (state) => state.onboarding_completed,
  );

  // إذا كانت onboarding مفعلة (أي اكتملت)، يتم نقلك إلى الصفحة الرئيسية
  useEffect(() => {
    if (onboarding_completed) {
      router.push("/dashboard");
    }
  }, [onboarding_completed, router]);

  // Track page view
  useEffect(() => {
    trackPageView("/onboarding", "Onboarding Page");
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhereError("");
    setUploadError("");
    setIsLoading(false);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setWebsiteData({
            ...websiteData,
            logo: event.target.result as string,
            logoFile: file,
          });
          toast.success("تم رفع الشعار بنجاح");
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhereError("");
    setIsLoading(false);
    setUploadError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setWebsiteData({
            ...websiteData,
            favicon: event.target.result as string,
            faviconFile: file,
          });
          toast.success("تم رفع أيقونة الموقع بنجاح");
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const useLogoAsFavicon = () => {
    setWhereError("");
    setIsLoading(false);
    setUploadError("");
    if (websiteData.logo && websiteData.logoFile) {
      setWebsiteData({
        ...websiteData,
        favicon: websiteData.logo,
        faviconFile: websiteData.logoFile,
      });
      toast.success("تم استخدام الشعار كأيقونة للموقع");
    } else {
      toast.error("لم يتم رفع شعار بعد");
    }
  };

  const selectColorPalette = (palette: (typeof COLOR_PALETTES)[0]) => {
    setWebsiteData({
      ...websiteData,
      colors: { ...palette },
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = WEBSITE_CATEGORIES.find((c) => c.id === categoryId);
    if (category && !category.disabled) {
      setWebsiteData({
        ...websiteData,
        category: categoryId,
      });
    }
  };

  const SkipSetup = async () => {
    await setOnboardingCompleted(true);
    router.push("/dashboard");
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let firstErrorField: React.RefObject<HTMLInputElement> | null = null;

    if (!websiteData.title.trim()) {
      newErrors.title = "يرجى إدخال عنوان الموقع";
      if (!firstErrorField) firstErrorField = titleRef;
    }

    // التحقق من رقم الرخصة (اختياري، ولكن إذا تم إدخاله يجب أن يكون 10 أرقام)
    if (websiteData.valLicense && websiteData.valLicense.length !== 10) {
      newErrors.valLicense = "رقم الرخصة يجب أن يكون 10 أرقام";
      if (!firstErrorField) firstErrorField = valLicenseRef;
    }

    setErrors(newErrors);

    // Scroll to the first error field
    if (firstErrorField && firstErrorField.current) {
      firstErrorField.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      firstErrorField.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const completeOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!websiteData.category) {
      toast.error("يرجى اختيار نوع الموقع");
      return;
    }

    setIsLoading(true);

    try {
      let logoUrl = null;
      if (websiteData.logoFile) {
        try {
          const logoResponse = await uploadSingleFile(
            websiteData.logoFile,
            "logo",
          );
          logoUrl = logoResponse.url;
        } catch (error: any) {
          setUploadError(error.response?.data?.message || "خطأ في رفع الشعار");
          setWhereError("Logo");
          setIsLoading(false);
          return;
        }
      }

      let faviconUrl = null;
      if (websiteData.faviconFile) {
        try {
          const faviconResponse = await uploadSingleFile(
            websiteData.faviconFile,
            "logo",
          );
          faviconUrl = faviconResponse.url;
        } catch (error: any) {
          setWhereError("favicon");
          setUploadError(
            error.response?.data?.message || "خطأ في رفع الأيقونة",
          );
          setIsLoading(false);
          return;
        }
      }

      const onboardingData = {
        title: websiteData.title,
        category: websiteData.category,
        colors: websiteData.colors,
        logo: logoUrl,
        favicon: faviconUrl,
        valLicense: websiteData.valLicense || null,
        workingHours: websiteData.workingHours || null,
        address: websiteData.address || null,
      };

      const response = await axiosInstance.post("/onboarding", onboardingData);
      toast.success("تم إكمال إعداد موقعك بنجاح!");

      setOnboardingCompleted(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء إكمال الإعداد",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      {/* Simple Menu */}
      <div className="w-full relative flex justify-center md:justify-start mb-8 md:mb-6">
        <div className="absolute top-0 right-5">
          <Image
            src="/logo.png"
            alt="Website Builder Logo"
            width={200}
            height={142}
            className="h-[7rem] md:h-[7rem] w-auto object-contain dark:invert"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              إعداد موقعك الجديد
            </h1>
            <p className="text-muted-foreground">
              أكمل المعلومات أدناه لبدء إنشاء موقعك
            </p>
          </div>

          <form onSubmit={completeOnboarding} className="space-y-8">
            {/* Website Title */}
            <div className="space-y-2">
              <Label htmlFor="website-title" className="text-foreground">
                اسم الموقع *
              </Label>
              <Input
                ref={titleRef} // إضافة ref
                id="website-title"
                placeholder="مثال: شركة الأفق للعقارات"
                value={websiteData.title}
                onChange={(e) => {
                  setWebsiteData({ ...websiteData, title: e.target.value });
                  if (errors.title) {
                    setErrors({ ...errors, title: "" });
                  }
                }}
                className={`h-12 ${errors.title ? "border-red-500" : ""}`}
                required
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* VAL License Number */}

            {/* VAL License Number */}
            <div className="space-y-2">
              <Label htmlFor="val-license">رقم رخصة فال</Label>
              <Input
                ref={valLicenseRef} // إضافة ref
                id="val-license"
                placeholder="مثال: 1234567890"
                value={websiteData.valLicense}
                onChange={(e) => {
                  // Allow only numbers
                  const value = e.target.value.replace(/\D/g, "");
                  setWebsiteData({ ...websiteData, valLicense: value });
                  if (errors.valLicense) {
                    setErrors({ ...errors, valLicense: "" });
                  }
                }}
                maxLength={10}
                className={`h-12 ${errors.valLicense ? "border-red-500" : ""}`}
              />
              {errors.valLicense && (
                <p className="text-sm text-red-500">{errors.valLicense}</p>
              )}
              {!errors.valLicense && (
                <p className="text-xs text-gray-500">
                  رقم رخصة فال يتكون من 10 أرقام (اختياري)
                </p>
              )}
            </div>

            {/* Working Hours */}
            <div className="space-y-2">
              <Label htmlFor="working-hours">ساعات العمل</Label>
              <Input
                ref={workingHoursRef} // إضافة ref
                id="working-hours"
                placeholder="مثال: السبت - الخميس: 9:00 صباحاً - 6:00 مساءً"
                value={websiteData.workingHours}
                onChange={(e) => {
                  setWebsiteData({
                    ...websiteData,
                    workingHours: e.target.value,
                  });
                  if (errors.workingHours) {
                    setErrors({ ...errors, workingHours: "" });
                  }
                }}
                className={`h-12 ${errors.workingHours ? "border-red-500" : ""}`}
              />
              {errors.workingHours && (
                <p className="text-sm text-red-500">{errors.workingHours}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input
                ref={addressRef} // إضافة ref
                id="address"
                placeholder="مثال: شارع الملك فهد، حي العليا، الرياض"
                value={websiteData.address}
                onChange={(e) => {
                  setWebsiteData({ ...websiteData, address: e.target.value });
                  if (errors.address) {
                    setErrors({ ...errors, address: "" });
                  }
                }}
                className={`h-12 ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Logo and Favicon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-foreground">شعار الموقع (اختياري)</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />

                {!websiteData.logo ? (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      انقر لرفع شعار
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative w-32 h-32 mx-auto border border-border rounded-lg overflow-hidden">
                      <Image
                        src={websiteData.logo || "/placeholder.svg"}
                        alt="شعار الموقع"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        تغيير
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setWebsiteData({
                            ...websiteData,
                            logo: null,
                            logoFile: null,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Favicon Upload */}
              <div className="space-y-2">
                <Label className="text-foreground">
                  أيقونة الموقع (اختياري)
                </Label>
                <input
                  type="file"
                  ref={faviconInputRef}
                  onChange={handleFaviconUpload}
                  accept="image/*"
                  className="hidden"
                />

                {!websiteData.favicon ? (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground transition-colors"
                    onClick={() => faviconInputRef.current?.click()}
                  >
                    <FileImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      انقر لرفع أيقونة
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative w-16 h-16 mx-auto border border-border rounded-lg overflow-hidden bg-muted p-2">
                      <Image
                        src={websiteData.favicon || "/placeholder.svg"}
                        alt="أيقونة الموقع"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => faviconInputRef.current?.click()}
                      >
                        تغيير
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setWebsiteData({
                            ...websiteData,
                            favicon: null,
                            faviconFile: null,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {websiteData.logo && !websiteData.favicon && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={useLogoAsFavicon}
                    className="w-full mt-2"
                  >
                    استخدام الشعار كأيقونة
                  </Button>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {/* لا اريد ازالته ابدا ولكن هو مخفي بشكل مؤقت */}
            {/* <div className="space-y-4">
              <Label className="text-foreground">ألوان الموقع</Label>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {COLOR_PALETTES.map((palette, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      websiteData.colors.primary === palette.primary
                        ? "border-foreground ring-2 ring-foreground/20"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    onClick={() => selectColorPalette(palette)}
                  >
                    <div className="flex gap-1 justify-center">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: palette.primary }}
                      ></div>
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: palette.secondary }}
                      ></div>
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: palette.accent }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-3">
                  أو اختر ألوانك المخصصة:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ColorPicker
                    color={websiteData.colors.primary}
                    onChange={(color) =>
                      setWebsiteData({
                        ...websiteData,
                        colors: { ...websiteData.colors, primary: color },
                      })
                    }
                    label="اللون الرئيسي"
                  />
                  <ColorPicker
                    color={websiteData.colors.secondary}
                    onChange={(color) =>
                      setWebsiteData({
                        ...websiteData,
                        colors: { ...websiteData.colors, secondary: color },
                      })
                    }
                    label="اللون الثانوي"
                  />
                  <ColorPicker
                    color={websiteData.colors.accent}
                    onChange={(color) =>
                      setWebsiteData({
                        ...websiteData,
                        colors: { ...websiteData.colors, accent: color },
                      })
                    }
                    label="لون التأكيد"
                  />
                </div>
              </div>
            </div> */}

            {/* Error Messages */}
            {uploadError && (
              <div className="text-center text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                {whereErrors === "Logo" || whereErrors === "favicon" ? (
                  <>
                    في ال {whereErrors} نوع الملف{" "}
                    {uploadError.replace("Invalid file type: ", "")} غير مدعوم،
                    يرجى استخدام JPG أو PNG.
                  </>
                ) : (
                  uploadError
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإعداد...
                  </>
                ) : (
                  "إكمال الإعداد"
                )}
              </Button>
            </div>

            {/* Skip Setup */}
            <div className="text-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="link"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={SkipSetup}
                    >
                      تخطي الإعداد
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>يمكنك إكمال الإعداد لاحقاً من صفحة الإعدادات</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
