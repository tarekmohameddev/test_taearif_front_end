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
const SkeletonLoader = () => {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse flex items-center gap-4 rounded-lg border p-3"
        >
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </>
  );
};

// دالة لتحويل اسم الممثل إلى نص مناسب
const formatActorName = (actorName) => {
  if (!actorName) return "";
  
  // إذا كان "User" نعرض "صاحب المشروع"
  if (actorName.toLowerCase() === "user") {
    return "صاحب المشروع";
  }
  
  // إذا كان "Admin" نعرض "المدير"
  if (actorName.toLowerCase() === "admin") {
    return "المدير";
  }
  
  // إذا كان "Employee" نعرض "موظف"
  if (actorName.toLowerCase() === "employee") {
    return "موظف";
  }
  
  // في حالة أخرى نعيد الاسم كما هو
  return actorName;
};

// دالة لتحويل الوقت النسبي إلى عربي
const formatTimeAgo = (timeString) => {
  if (!timeString) return "";

  // إذا كان التاريخ بصيغة ISO، نحوله إلى عربي
  if (timeString.includes("T") || timeString.match(/^\d{4}-\d{2}-\d{2}/)) {
    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) {
        return "الآن";
      }

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? "منذ دقيقة" : `منذ ${diffInMinutes} دقيقة`;
      }

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return diffInHours === 1 ? "منذ ساعة" : `منذ ${diffInHours} ساعة`;
      }

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return diffInDays === 1 ? "منذ يوم" : `منذ ${diffInDays} يوم`;
      }

      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks < 4) {
        return diffInWeeks === 1 ? "منذ أسبوع" : `منذ ${diffInWeeks} أسبوع`;
      }

      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) {
        return diffInMonths === 1 ? "منذ شهر" : `منذ ${diffInMonths} شهر`;
      }

      const diffInYears = Math.floor(diffInDays / 365);
      return diffInYears === 1 ? "منذ سنة" : `منذ ${diffInYears} سنة`;
    } catch {
      return timeString;
    }
  }

  // تحويل النص الإنجليزي إلى عربي
  const timeLower = timeString.toLowerCase().trim();

  // الآن / منذ لحظة
  if (timeLower.includes("just now") || timeLower.includes("a moment ago")) {
    return "الآن";
  }

  // أيام
  const daysMatch = timeLower.match(/(\d+)\s*days?\s*ago/);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);
    if (days === 1) return "منذ يوم";
    if (days === 2) return "منذ يومين";
    return `منذ ${days} أيام`;
  }

  // ساعات
  const hoursMatch = timeLower.match(/(\d+)\s*hours?\s*ago/);
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1]);
    if (hours === 1) return "منذ ساعة";
    return `منذ ${hours} ساعة`;
  }

  // دقائق
  const minutesMatch = timeLower.match(/(\d+)\s*minutes?\s*ago/);
  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[1]);
    if (minutes === 1) return "منذ دقيقة";
    return `منذ ${minutes} دقيقة`;
  }

  // أسابيع
  const weeksMatch = timeLower.match(/(\d+)\s*weeks?\s*ago/);
  if (weeksMatch) {
    const weeks = parseInt(weeksMatch[1]);
    if (weeks === 1) return "منذ أسبوع";
    return `منذ ${weeks} أسبوع`;
  }

  // أشهر
  const monthsMatch = timeLower.match(/(\d+)\s*months?\s*ago/);
  if (monthsMatch) {
    const months = parseInt(monthsMatch[1]);
    if (months === 1) return "منذ شهر";
    return `منذ ${months} شهر`;
  }

  // سنوات
  const yearsMatch = timeLower.match(/(\d+)\s*years?\s*ago/);
  if (yearsMatch) {
    const years = parseInt(yearsMatch[1]);
    if (years === 1) return "منذ سنة";
    return `منذ ${years} سنة`;
  }

  // إذا لم يتطابق مع أي نمط، نعيد النص الأصلي
  return timeString;
};

export function RecentActivity() {
  const {
    recentActivityData,
    isRecentActivityUpdated,
    fetchRecentActivityData,
    loading,
  } = useStore();
  const { userData, IsLoading: authLoading } = useAuthStore();

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    if (!isRecentActivityUpdated) {
      fetchRecentActivityData();
    }
  }, [userData?.token, authLoading, isRecentActivityUpdated, fetchRecentActivityData]);

  // إذا لم يكن هناك token أو كان التحميل جارياً، لا نعرض المحتوى
  if (authLoading || !userData?.token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
          <CardDescription>آخر الإجراءات التي تمت على موقعك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            يرجى تسجيل الدخول لعرض البيانات
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>النشاط الأخير</CardTitle>
        <CardDescription>آخر الإجراءات التي تمت على موقعك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <SkeletonLoader />
        ) : (
          recentActivityData.activities?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg border p-3"
            >
              <div className="rounded-full bg-primary/10 p-2">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.action_labelAR || item.actionAR || item.action}</p>
                <p className="text-sm text-muted-foreground">
                  {item.sectionAR || item.section} • {formatTimeAgo(item.time)}
                  {item.actor_name && (
                    <span className="mr-2"> • {formatActorName(item.actor_name)}</span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
