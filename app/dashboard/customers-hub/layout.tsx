"use client";

import useAuthStore from "@/context/AuthContext";

export default function CustomersHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, IsLoading: authLoading } = useAuthStore();

  if (authLoading || !userData?.token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            جاري التحقق من تسجيل الدخول...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
