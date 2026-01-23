"use client";

import { useRouter } from "next/navigation";
import { DailyFollowupService } from "@/components/rental-management/services/daily-followup-service";
import { DailyFollowupStats } from "@/components/rental-management/daily-followup-stats";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import useDailyFollowupStore from "@/context/store/dailyFollowup";

export function DailyFollowupPage() {
  const { userData } = useAuthStore();
  const router = useRouter();
  const { resetFilters } = useDailyFollowupStore();

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
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
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  متابعة المستحقات اليومية
                </h1>
                <p className="text-muted-foreground">
                  متابعة المستحقات المالية والمدفوعات المتأخرة في نظام إدارة
                  الإيجارات
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/rental-management")}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                العودة
              </Button>
            </div>

            {/* إحصائيات المتابعة اليومية */}
            <div className="space-y-6">
              <DailyFollowupStats />
            </div>

            {/* خدمة المتابعة اليومية */}
            <div className="space-y-6">
              <DailyFollowupService />
            </div>
          </div>
        </main>
      </div>
  );
}
