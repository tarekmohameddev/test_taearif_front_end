"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeft, UserPlus, CreditCard, Shield } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/context/AuthContext";

export function AffiliateRegistrationPage() {
  const {
    affiliateData: { data, loading },
    fetchAffiliateData,
  } = useStore();
  const router = useRouter();
  const { userData } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    bankName: "",
    accountNumber: "",
    iban: "",
    agreeToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      return;
    }
    fetchAffiliateData();
  }, [fetchAffiliateData, userData?.token]);

  useEffect(() => {
    if (data) {
      router.push("/dashboard/affiliate/dashboard");
    }
  }, [data, router]);

  useEffect(() => {
    if (data) {
      setIsFormDisabled(true);
    }
  }, [data]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "الاسم يجب أن يكون أكثر من حرفين";
    }

    // Bank details validation
    if (!formData.bankName.trim()) {
      newErrors.bankName = "اسم البنك مطلوب";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "رقم الحساب مطلوب";
    } else if (formData.accountNumber.length < 10) {
      newErrors.accountNumber = "رقم الحساب يجب أن يكون 10 أرقام على الأقل";
    }

    if (!formData.iban.trim()) {
      newErrors.iban = "رقم الآيبان مطلوب";
    } else if (!/^SA[0-9]{22}$/.test(formData.iban.replace(/\s/g, ""))) {
      newErrors.iban =
        "رقم الآيبان غير صحيح (يجب أن يبدأ بـ SA ويتكون من 24 رقم)";
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "يجب الموافقة على الشروط والأحكام";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      alert("Authentication required. Please login.");
      return;
    }

    if (!validateForm()) {
      toast.error("الرجاء تصحيح الأخطاء المذكورة أدناه");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullname: formData.fullName,
        bank_name: formData.bankName,
        bank_account_number: formData.accountNumber,
        iban: formData.iban,
      };
      const res = await axiosInstance.post("/affiliate/register", payload);
      if (res?.data?.status === "success") {
        toast.success("تم التسجيل بنجاح! سيتم تحويلك للصفحة الان.");
        setTimeout(() => {
          router.push("/dashboard/affiliate/dashboard");
        }, 2000);

        setIsFormDisabled(true);
      } else {
        toast.error(res?.data?.message || "حدث خطأ غير متوقع");
      }
    } catch (error) {
      toast.error("فشل في إرسال الطلب. الرجاء المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || data) {
    return (
      <div className="flex min-h-screen flex-col">
        <Toaster position="top-center" />
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab="affiliate" setActiveTab={() => {}} />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-8">
              {/* Header Skeleton */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
              {/* Stats Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              {/* Referral Code & Link Skeleton */}
              <Skeleton className="h-40 w-full" />
              {/* Referrals Table Skeleton */}
              <Skeleton className="h-16 w-1/2 mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-32 w-full" />
              {/* Payments Section Skeleton */}
              <Skeleton className="h-10 w-1/3 mb-2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-10 w-1/4 mb-2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col">
        <Toaster position="top-center" />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">
                  يرجى تسجيل الدخول لعرض المحتوى
                </p>
              </div>
            </div>
          </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="top-center" />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">انضم إلى برنامج الشراكة</h1>
                <p className="text-muted-foreground">
                  ابدأ في كسب العمولات من خلال الترويج لخدماتنا
                </p>
              </div>
            </div>

            {/* Benefits Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">عمولة مجزية</h3>
                  <p className="text-sm text-muted-foreground">
                    احصل على عمولة على كل عملية بيع
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">دفع آمن</h3>
                  <p className="text-sm text-muted-foreground">
                    دفعات شهرية منتظمة وآمنة مباشرة إلى حسابك
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">دعم مستمر</h3>
                  <p className="text-sm text-muted-foreground">
                    فريق دعم متخصص لمساعدتك في تحقيق أهدافك
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  نموذج التسجيل
                </CardTitle>
                <CardDescription>
                  املأ البيانات التالية للانضمام إلى برنامج الشراكة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      المعلومات الشخصية
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">الاسم الكامل *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="أدخل الاسم الكامل"
                        className={errors.fullName ? "border-destructive" : ""}
                        disabled={isFormDisabled}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bank Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      معلومات الحساب البنكي
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="bankName">اسم البنك *</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) =>
                          handleInputChange("bankName", e.target.value)
                        }
                        placeholder="مثال: البنك الأهلي السعودي"
                        className={errors.bankName ? "border-destructive" : ""}
                        disabled={isFormDisabled}
                      />
                      {errors.bankName && (
                        <p className="text-sm text-destructive">
                          {errors.bankName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">رقم الحساب *</Label>
                        <Input
                          id="accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) =>
                            handleInputChange("accountNumber", e.target.value)
                          }
                          placeholder="1234567890"
                          className={
                            errors.accountNumber ? "border-destructive" : ""
                          }
                          disabled={isFormDisabled}
                        />
                        {errors.accountNumber && (
                          <p className="text-sm text-destructive">
                            {errors.accountNumber}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="iban">رقم الآيبان (IBAN) *</Label>
                        <Input
                          id="iban"
                          value={formData.iban}
                          onChange={(e) =>
                            handleInputChange(
                              "iban",
                              e.target.value.toUpperCase(),
                            )
                          }
                          placeholder="SA0000000000000000000000"
                          className={errors.iban ? "border-destructive" : ""}
                          disabled={isFormDisabled}
                        />
                        {errors.iban && (
                          <p className="text-sm text-destructive">
                            {errors.iban}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeToTerms", checked)
                        }
                        className={
                          errors.agreeToTerms ? "border-destructive" : ""
                        }
                        disabled={isFormDisabled}
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor="terms"
                          className="text-sm leading-relaxed"
                        >
                          أوافق على{" "}
                          <Link
                            href="/terms"
                            className="text-primary hover:underline font-medium"
                          >
                            الشروط والأحكام
                          </Link>{" "}
                          و{" "}
                          <Link
                            href="/privacy"
                            className="text-primary hover:underline font-medium"
                          >
                            سياسة الخصوصية
                          </Link>{" "}
                          الخاصة ببرنامج الشراكة
                        </Label>
                        {errors.agreeToTerms && (
                          <p className="text-sm text-destructive">
                            {errors.agreeToTerms}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || isFormDisabled}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 ml-2" />
                        إرسال طلب الانضمام
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Help Text */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>ملاحظة:</strong> سيتم مراجعة طلبك من قبل فريقنا المختص
                  والرد عليك خلال 24-48 ساعة عبر البريد الإلكتروني المسجل. في
                  حالة الموافقة، ستحصل على رابط الشراكة الخاص بك ومعلومات
                  الحساب.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  );
}
