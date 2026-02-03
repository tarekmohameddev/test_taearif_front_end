"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomersHubMainPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to requests page as the new entry point
    router.replace('/ar/dashboard/customers-hub/requests');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
      </div>
    </div>
  );
}
