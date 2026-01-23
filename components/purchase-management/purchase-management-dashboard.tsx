"use client";
import { PurchaseFlowService } from "@/components/purchase-management/services/purchase-flow-service";
import useAuthStore from "@/context/AuthContext";

export function PurchaseManagementDashboard() {
  const { userData } = useAuthStore();

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
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                نظام إدارة المشتريات العقارية
              </h1>
              <p className="text-muted-foreground">
                نظام شامل لإدارة مراحل شراء العقارات من الحجز إلى استلام الوحدة
              </p>
            </div>

            <PurchaseFlowService />
          </div>
        </main>
      </div>
  );
}
