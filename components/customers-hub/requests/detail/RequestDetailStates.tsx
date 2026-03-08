"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerClassName =
  "flex flex-col items-center justify-center h-[60vh] gap-4";

export function RequestDetailLoading() {
  return (
    <div className={containerClassName} dir="rtl">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      <p className="text-gray-600 dark:text-gray-400">جاري تحميل تفاصيل الطلب...</p>
    </div>
  );
}

interface RequestDetailErrorProps {
  error: string;
  onRetry?: () => void;
}

export function RequestDetailError({ error, onRetry }: RequestDetailErrorProps) {
  return (
    <div className={containerClassName} dir="rtl">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <div className="text-2xl font-bold text-gray-400">حدث خطأ</div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
      <div className="flex gap-2">
        {onRetry && (
          <Button onClick={onRetry}>إعادة المحاولة</Button>
        )}
        <Link href="/ar/dashboard/customers-hub/requests">
          <Button variant="outline">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة للطلبات
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function RequestDetailNotFound() {
  return (
    <div className={containerClassName} dir="rtl">
      <div className="text-2xl font-bold text-gray-400">الطلب غير موجود</div>
      <Link href="/ar/dashboard/customers-hub/requests">
        <Button>
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للطلبات
        </Button>
      </Link>
    </div>
  );
}
