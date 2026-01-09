"use client";
import { useEffect } from "react";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function SetupProgressCard() {
  const {
    homepage: {
      setupProgressData,
      isSetupProgressDataUpdated,
      fetchSetupProgressData,
    },
    loading,
  } = useStore();
  const { userData, IsLoading: authLoading } = useAuthStore();

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    if (!isSetupProgressDataUpdated) {
      fetchSetupProgressData();
    }
  }, [userData?.token, authLoading, isSetupProgressDataUpdated, fetchSetupProgressData]);

  // إذا لم يكن هناك token أو كان التحميل جارياً، لا نعرض المحتوى
  if (authLoading || !userData?.token) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>تقدم الإعداد</CardTitle>
          <CardDescription>
            أكمل إعداد موقعك للحصول على أفضل النتائج
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            يرجى تسجيل الدخول لعرض البيانات
          </div>
        </CardContent>
      </Card>
    );
  }

  // عرض Skeleton أثناء التحميل
  if (!isSetupProgressDataUpdated) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  // 1) نحسب النسبة المئوية (لو كانت الـ API تُرجع 0–1)
  //    أو نستخدمها مباشرةً إذا كانت 0–100
  const progressPercent =
    setupProgressData.progress <= 1
      ? Math.round(setupProgressData.progress * 100)
      : setupProgressData.progress;

  // 2) نحول الـ steps من object إلى array مع استخدام الهيكل الجديد
  const completedSteps = Object.entries(setupProgressData.steps).map(
    ([id, stepData]) => ({
      id,
      name: id
        .split("_")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
      completed: stepData.status,
      text: stepData.text,
    }),
  );

  const stepTranslations = {
    Banner: "البانر",
    Footer: "التذييل",
    About: "من نحن",
    Menu: "القائمة",
    Projects: "المشاريع",
    Properties: "العقارات",
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>تقدم الإعداد</CardTitle>
        <CardDescription>
          أكمل إعداد موقعك للحصول على أفضل النتائج
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">اكتمال الإعداد</span>
            <span className="text-sm font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} />
        </div>

        {/* مسافة فارغة فوق وتحت قائمة الخطوات */}
        <div className="py-4">
          <div className="space-y-2">
            {completedSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center ${
                    step.completed
                      ? "rounded-full bg-primary/10 text-primary "
                      : "rounded-full bg-orange-50 text-orange-500  border-dashed"
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-md ">?</span>
                  )}
                </div>
                <span className="text-sm">
                  {stepTranslations[step.name] || step.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* عرض الزر فقط إذا كان هناك رابط صحيح */}
        {setupProgressData.continue_path && (
          <Button size="sm" className="w-full gap-1 " asChild>
            <Link href={`/dashboard${setupProgressData.continue_path}`}>
              <span>اضغط هنا لإكمال بياناتك</span>
              <ArrowRight className="h-3.5 w-3.5 mr-0 ml-1" />
            </Link>
          </Button>
        )}

        {/* رسالة عندما يكون الإعداد مكتملاً */}
        {/* {!setupProgressData.continue_path && progressPercent === 100 && (
          <div className="text-center p-3 bg-white rounded-lg">
            <p className="text-sm font-medium" style={{ color: '#05543e' }}>
              تم إكمال إعداد موقعك بنجاح!
            </p>
          </div>
        )} */}

        {/* رسالة عندما لا يوجد رابط ولكن الإعداد غير مكتمل */}
        {!setupProgressData.continue_path && progressPercent < 100 && (
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              لا توجد خطوات إضافية متاحة حالياً
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SetupProgressCard;
