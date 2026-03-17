"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PropertyRequestForm,
  type PropertyModeType,
} from "@/components/property-requests/page-components/PropertyRequestForm";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

const initialFormData = {
  property_type: "",
  category: "",
  neighborhoods: [] as string[],
  area_from: null as number | null,
  area_to: null as number | null,
  purchase_method: "",
  budget_from: 0,
  budget_to: 0,
  seriousness: "",
  purchase_goal: "",
  wants_similar_offers: false,
  full_name: "",
  phone: "",
  contact_on_whatsapp: false,
  notes: "",
};

export default function AddPropertyRequestPage() {
  const router = useRouter();
  const userData = useAuthStore(selectUserData);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyMode, setPropertyMode] = useState<PropertyModeType | null>(null);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);

  const handleChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?.token) {
      toast.error("يرجى تسجيل الدخول");
      return;
    }

    const newErrors: Record<string, string> = {};
    if (!formData.full_name?.trim()) newErrors.full_name = "الاسم الكامل مطلوب";
    if (!formData.phone?.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("يرجى إكمال الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const requestData: Record<string, unknown> = {
        full_name: formData.full_name,
        phone: formData.phone,
        region: "",
        source: "employee_dashboard",
        property_type: formData.property_type,
        category_id: formData.category ? parseInt(formData.category, 10) : null,
        city_id: null,
        districts_id:
          formData.neighborhoods?.length > 0
            ? parseInt(formData.neighborhoods[0], 10)
            : null,
        area_from: formData.area_from,
        area_to: formData.area_to,
        purchase_method: formData.purchase_method,
        budget_from: formData.budget_from,
        budget_to: formData.budget_to,
        seriousness: formData.seriousness,
        purchase_goal: formData.purchase_goal,
        wants_similar_offers: formData.wants_similar_offers,
        contact_on_whatsapp: formData.contact_on_whatsapp,
        notes: formData.notes || null,
        is_read: false,
        is_active: true,
        status_id: 2,
      };

      if (propertyMode === "existing" && selectedPropertyIds.length > 0) {
        requestData.property_ids = selectedPropertyIds;
      } else {
        requestData.property_ids = [];
      }

      const response = await axiosInstance.post("/v1/property-requests", requestData);
      const newId = response.data?.data?.id;

      toast.success("تم إنشاء طلب العقار بنجاح");
      if (newId != null) {
        router.push(`/dashboard/customers-hub/requests/property_request_${newId}`);
      } else {
        router.push("/dashboard/customers-hub/requests");
      }
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const msg = axErr.response?.data?.message || "حدث خطأ أثناء إنشاء الطلب";
      const errFields = axErr.response?.data?.errors;
      if (errFields && typeof errFields === "object") {
        const fieldErrors: Record<string, string> = {};
        for (const [k, v] of Object.entries(errFields)) {
          fieldErrors[k] = Array.isArray(v) ? v[0] : String(v);
        }
        setErrors(fieldErrors);
      }
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="mx-auto max-w-[1000px] space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/customers-hub/requests">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">إنشاء طلب عقاري</h1>
            <p className="text-muted-foreground text-sm">
              إضافة طلب عقار جديد من مركز طلبات العملاء
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>بيانات الطلب</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <PropertyRequestForm
                formData={formData}
                onChange={handleChange}
                errors={errors}
                propertyMode={propertyMode}
                onPropertyModeChange={setPropertyMode}
                selectedPropertyIds={selectedPropertyIds}
                onSelectedPropertyIdsChange={setSelectedPropertyIds}
              />
              <div className="flex flex-wrap items-center gap-3 border-t pt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    "إنشاء الطلب"
                  )}
                </Button>
                <Link href="/dashboard/customers-hub/requests">
                  <Button type="button" variant="outline">
                    إلغاء
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
