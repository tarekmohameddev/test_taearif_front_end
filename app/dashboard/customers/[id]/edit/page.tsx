"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Save, X } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { CustomerForm } from "@/components/customers/page-components/CustomerForm";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params?.id as string;
  const { userData } = useAuthStore();

  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone_number: string;
    note: string;
    type_id: number;
    priority_id: number;
    city_id: number | null;
    district_id: number | null;
    stage_id: number | null;
    procedure_id: number | null;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // دالة لجلب تفاصيل العميل
  const fetchCustomerDetails = async (customerId: string) => {
    if (!userData?.token) {
      setError("يجب تسجيل الدخول أولاً");
      return;
    }

    setLoadingDetails(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/customers/${customerId}`);
      if (response.data.status === "success" || response.data.data) {
        const customer = response.data.data || response.data;
        setCustomerDetails(customer);
        setFormData({
          name: customer.name || "",
          email: customer.email || "",
          phone_number: customer.phone_number || "",
          note: customer.note || "",
          type_id: customer.type?.id || customer.type_id || 1,
          priority_id: customer.priority?.id || customer.priority_id || 1,
          city_id: customer.city_id || customer.district?.city_id || null,
          district_id: customer.district?.id || customer.district_id || null,
          stage_id: customer.stage?.id || customer.stage_id || null,
          procedure_id: customer.procedure?.id || customer.procedure_id || null,
        });
      } else {
        setError("فشل تحميل بيانات العميل");
      }
    } catch (error: any) {
      console.error("Error fetching customer details:", error);
      setError(
        error.response?.data?.message || "حدث خطأ أثناء تحميل بيانات العميل",
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails(customerId);
    }
  }, [customerId, userData?.token]);

  // دالة معالجة التغييرات في النموذج
  const handleChange = (field: string) => (value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
    // إزالة الأخطاء عند التعديل
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (clientErrors[field]) {
      setClientErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // دالة حفظ التعديلات
  const handleUpdateCustomer = async () => {
    if (!formData || !userData?.token) {
      toast.error("يجب تسجيل الدخول أولاً", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    // التحقق من الحقول المطلوبة
    const errors: Record<string, string> = {};
    if (!formData.name || formData.name.trim() === "") {
      errors.name = "الاسم مطلوب";
    }
    if (!formData.phone_number || formData.phone_number.trim() === "") {
      errors.phone_number = "رقم الهاتف مطلوب";
    }
    if (!formData.type_id) {
      errors.type_id = "نوع العميل مطلوب";
    }
    // الأولوية مخفية حالياً - لا حاجة للتحقق منها
    // if (!formData.priority_id) {
    //   errors.priority_id = "الأولوية مطلوبة";
    // }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      toast.error("يرجى إكمال جميع الحقول المطلوبة", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setSaving(true);
    setValidationErrors({});
    setClientErrors({});

    try {
      await axiosInstance.put(`/customers/${customerId}`, formData);

      toast.success("تم تحديث بيانات العميل بنجاح!", {
        duration: 4000,
        position: "top-center",
      });

      // الانتقال إلى صفحة تفاصيل العميل أو قائمة العملاء
      router.push(`/dashboard/customers/${customerId}`);
    } catch (error: any) {
      console.error("Error updating customer:", error);

      // معالجة أخطاء التحقق من الخادم
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      }

      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تحديث بيانات العميل",
        {
          duration: 4000,
          position: "top-center",
        },
      );
    } finally {
      setSaving(false);
    }
  };

  // التحقق من وجود التوكن
  if (!userData?.token) {
    return (
      <div className="flex h-screen overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-6 max-w-6xl" dir="rtl">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-500">
                      يرجى تسجيل الدخول لعرض المحتوى
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6 max-w-4xl" dir="rtl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="h-10 w-10"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  تعديل بيانات العميل
                </h1>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/customers")}
              >
                <X className="ml-2 h-4 w-4" />
                إلغاء
              </Button>
            </div>

            {/* Content */}
            {loadingDetails ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary ml-2" />
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      جاري تحميل بيانات العميل...
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <p className="text-red-500 dark:text-red-400 mb-4">
                      {error}
                    </p>
                    <Button onClick={() => fetchCustomerDetails(customerId)}>
                      إعادة المحاولة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : formData ? (
              <Card>
                <CardHeader>
                  <CardTitle>معلومات العميل</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <CustomerForm
                      formData={formData}
                      onChange={(field, value) => {
                        handleChange(field)(value);
                      }}
                      errors={{
                        ...validationErrors,
                        ...clientErrors,
                      }}
                      isEditMode={true}
                    />
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={saving}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleUpdateCustomer}
                        disabled={saving}
                        className="min-w-[120px]"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Save className="ml-2 h-4 w-4" />
                            حفظ التعديلات
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      لا توجد بيانات متاحة
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
    </div>
  );
}
