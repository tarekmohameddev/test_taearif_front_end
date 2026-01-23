"use client";

import { useRouter } from "next/navigation";
import { ContractsService } from "@/components/rental-management/services/contracts-service";
import { ContractsStats } from "@/components/rental-management/contracts-stats";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import useContractsStore from "@/context/store/contracts";

export function ContractsPage() {
  const { userData } = useAuthStore();
  const router = useRouter();
  const { resetFilters } = useContractsStore();

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
                  إدارة العقود
                </h1>
                <p className="text-muted-foreground">
                  إدارة جميع عقود الإيجار والمستأجرين في النظام
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

            {/* إحصائيات العقود */}
            <div className="space-y-6">
              <ContractsStats />
            </div>

            {/* خدمة العقود */}
            <div className="space-y-6">
              <ContractsService />
            </div>
          </div>
        </main>
    </div>
  );
}
