"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  TrendingUp,
  Gift,
  ArrowRight,
  CheckCircle,
  Star,
  Target,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import useStore from "@/context/Store";
import { toast, Toaster } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/context/AuthContext";

export function AffiliateOverviewPage() {
  const {
    affiliateData: { data, loading },
    fetchAffiliateData,
  } = useStore();
  const router = useRouter();
  const isAffiliate = !!data;
  const { userData } = useAuthStore();

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      return;
    }
    fetchAffiliateData();
  }, [fetchAffiliateData, userData?.token]);

  useEffect(() => {
    if (data) {
      router.push("/affiliate/dashboard");
    }
  }, [data, router]);

  const benefits = [
    {
      icon: DollarSign,
      title: "عمولات مجزية",
      description: "احصل على عمولة تصل إلى 30% من كل عملية بيع",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      title: "نمو مستمر",
      description: "زيادة العمولة مع زيادة المبيعات والأداء",
      color: "text-blue-600",
    },
    {
      icon: Target,
      title: "استهداف دقيق",
      description: "أدوات تسويق متقدمة لاستهداف العملاء المناسبين",
      color: "text-purple-600",
    },
    {
      icon: Zap,
      title: "دفع سريع",
      description: "استلم أرباحك شهرياً بدون تأخير",
      color: "text-orange-600",
    },
    {
      icon: Shield,
      title: "دعم مستمر",
      description: "فريق دعم متخصص لمساعدتك في النجاح",
      color: "text-indigo-600",
    },
    {
      icon: Gift,
      title: "مكافآت إضافية",
      description: "مكافآت خاصة للشركاء المتميزين",
      color: "text-pink-600",
    },
  ];

  const commissionTiers = [
    {
      tier: "البرونزي",
      sales: "0 - 10",
      commission: "15%",
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      tier: "الفضي",
      sales: "11 - 25",
      commission: "20%",
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
    {
      tier: "الذهبي",
      sales: "26 - 50",
      commission: "25%",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      tier: "البلاتيني",
      sales: "50+",
      commission: "30%",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
  ];

  const features = [
    "روابط تتبع فريدة لكل شريك",
    "لوحة تحكم شاملة لمتابعة الأداء",
    "تقارير مفصلة عن النقرات والتحويلات",
    "مواد تسويقية جاهزة للاستخدام",
    "دعم فني متخصص على مدار الساعة",
    "دفعات شهرية منتظمة",
  ];
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Toaster position="top-center" />
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
    );
  }
  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col">
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
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                برنامج الشراكة والعمولة
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                انضم إلى برنامج الشراكة واربح عمولات مجزية من خلال الترويج لمنصة
                إنشاء المواقع الرائدة
              </p>
              {!isAffiliate ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button size="lg" asChild>
                    <Link href="/affiliate/register">
                      <Users className="h-5 w-5 ml-2" />
                      انضم كشريك الآن
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    تعرف على المزيد
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <Button size="lg" asChild>
                    <Link href="/affiliate/dashboard">
                      <TrendingUp className="h-5 w-5 ml-2" />
                      لوحة التحكم
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/affiliate/links">
                      <ArrowRight className="h-5 w-5 ml-2" />
                      إدارة الروابط
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div
                      className={`mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center ${benefit.color}`}
                    >
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Commission Structure */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">هيكل العمولات</CardTitle>
                <CardDescription>
                  كلما زادت مبيعاتك، زادت نسبة العمولة التي تحصل عليها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {commissionTiers.map((tier, index) => (
                    <div
                      key={index}
                      className="text-center p-6 border rounded-lg"
                    >
                      <Badge variant="outline" className={`mb-3 ${tier.color}`}>
                        {tier.tier}
                      </Badge>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {tier.sales} مبيعة شهرياً
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {tier.commission}
                        </p>
                        <p className="text-sm">عمولة</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">ما ستحصل عليه كشريك</CardTitle>
                <CardDescription>
                  جميع الأدوات والموارد التي تحتاجها للنجاح في برنامج الشراكة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Success Stories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">قصص نجاح الشركاء</CardTitle>
                <CardDescription>
                  تعرف على تجارب الشركاء الناجحين في برنامجنا
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "أحمد محمد",
                      earnings: "15,000 ريال",
                      period: "الشهر الماضي",
                      testimonial:
                        "برنامج رائع ساعدني على تحقيق دخل إضافي ممتاز",
                    },
                    {
                      name: "فاطمة علي",
                      earnings: "22,500 ريال",
                      period: "الشهر الماضي",
                      testimonial: "الدعم ممتاز والعمولات تصل في الوقت المحدد",
                    },
                    {
                      name: "خالد السعد",
                      earnings: "31,200 ريال",
                      period: "الشهر الماضي",
                      testimonial: "أفضل برنامج شراكة تعاملت معه على الإطلاق",
                    },
                  ].map((story, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{story.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {story.period}
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        {story.earnings}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        "{story.testimonial}"
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            {!isAffiliate && (
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="text-center p-8">
                  <h2 className="text-2xl font-bold mb-4">
                    ابدأ رحلتك كشريك اليوم
                  </h2>
                  <p className="text-lg mb-6 opacity-90">
                    انضم إلى آلاف الشركاء الذين يحققون أرباحاً ممتازة معنا
                  </p>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/affiliate/register">
                      <Users className="h-5 w-5 ml-2" />
                      سجل الآن مجاناً
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
    </div>
  );
}
