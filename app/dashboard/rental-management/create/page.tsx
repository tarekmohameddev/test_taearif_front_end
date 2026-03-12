"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import { UpdatedAddRentalForm } from "@/components/rental-management/services/updated-rental-form";

export default function CreateRentalPage() {
  const router = useRouter();
  const userData = useAuthStore(selectUserData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRental = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/v1/rms/rentals", formData);

      if (response.data.status) {
        // إعادة التوجيه إلى صفحة إدارة الإيجارات
        router.push("/dashboard/rental-management");
      } else {
        alert(
          "فشل في إضافة الإيجار: " + (response.data.message || "خطأ غير معروف"),
        );
      }
    } catch (err: any) {
      alert(
        "خطأ في إضافة الإيجار: " +
          (err.response?.data?.message || err.message || "خطأ غير معروف"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-gray-500">
            يرجى تسجيل الدخول لعرض المحتوى
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              إضافة عقد إيجار جديد
            </h1>
            <p className="text-gray-600 mt-2">أدخل تفاصيل طلب الإيجار الجديد</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/rental-management")}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للإيجارات
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <UpdatedAddRentalForm
          onSubmit={handleCreateRental}
          onCancel={() => router.push("/dashboard/rental-management")}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
