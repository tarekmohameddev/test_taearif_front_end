"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Shield, RefreshCw } from "lucide-react";

interface PermissionWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionWrapper({
  children,
  fallback,
}: PermissionWrapperProps) {
  const { hasPermission, loading, error, userData } = usePermissions();
  const { refreshUserData } = useUserStore();

  // Show loading state
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="rtl"
      >
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              خطأ في النظام
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => refreshUserData()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              إعادة المحاولة
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show permission denied if user doesn't have access
  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
          <main className="flex-1 py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md mx-auto">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      ليس لديك صلاحية للوصول
                    </h2>
                    <p className="text-gray-600 mb-4">
                      عذراً، ليس لديك الصلاحية المطلوبة للوصول إلى هذه الصفحة.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => window.history.back()}
                        className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                      >
                        العودة للخلف
                      </button>
                      <button
                        onClick={() => (window.location.href = "/dashboard")}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        الذهاب للوحة التحكم
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
      </div>
    );
  }

  // User has permission, show only the content without sidebar and header
  return <>{children}</>;
}
