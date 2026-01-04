"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

interface PropertyRequestFormData {
  property_type: string;
  category: string;
  neighborhoods: string[];
  area_from: number | null;
  area_to: number | null;
  purchase_method: string;
  budget_from: number;
  budget_to: number;
  seriousness: string;
  purchase_goal: string;
  wants_similar_offers: boolean;
  full_name: string;
  phone: string;
  contact_on_whatsapp: boolean;
  notes: string;
}

interface FiltersData {
  cities: Array<{ id: number; name_ar: string; name_en: string }>;
  districts: Array<{
    id: number;
    city_id: number;
    name_ar: string;
    name_en: string;
  }>;
  categories: Array<{ id: number; name: string; slug: string; icon: string | null }>;
  property_types: string[];
  purchase_goals: string[];
  seriousness_options: string[];
}

interface PropertyRequestFormProps {
  formData: PropertyRequestFormData;
  onChange: (field: keyof PropertyRequestFormData, value: any) => void;
  errors?: Record<string, string | string[]>;
}

export const PropertyRequestForm = ({
  formData,
  onChange,
  errors = {},
}: PropertyRequestFormProps) => {
  const { userData } = useAuthStore();
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState<
    FiltersData["districts"]
  >([]);

  // Fetch filters data
  useEffect(() => {
    const fetchFilters = async () => {
      if (!userData?.token) {
        return;
      }

      setLoadingFilters(true);
      try {
        const response = await axiosInstance.get<{
          status: string;
          data: FiltersData;
        }>("/v1/property-requests/filters");
        setFiltersData(response.data.data);
      } catch (err) {
        console.error("Error fetching filters:", err);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, [userData?.token]);

  // Filter districts based on selected city (if we had city_id in formData)
  // For now, we'll just show all districts

  const getError = (field: string): string | undefined => {
    const error = errors[field];
    if (Array.isArray(error)) {
      return error[0];
    }
    return error;
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">معلومات الاتصال</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">
              الاسم الكامل <span className="text-red-500">*</span>
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => onChange("full_name", e.target.value)}
              className={getError("full_name") ? "border-red-500" : ""}
            />
            {getError("full_name") && (
              <p className="text-sm text-red-500">{getError("full_name")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              رقم الهاتف <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className={getError("phone") ? "border-red-500" : ""}
            />
            {getError("phone") && (
              <p className="text-sm text-red-500">{getError("phone")}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="contact_on_whatsapp"
              checked={formData.contact_on_whatsapp}
              onCheckedChange={(checked) =>
                onChange("contact_on_whatsapp", checked)
              }
            />
            <Label
              htmlFor="contact_on_whatsapp"
              className="text-sm font-normal cursor-pointer"
            >
              متاح للاتصال عبر واتساب
            </Label>
          </div>
        </div>
      </div>

      {/* Property Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">معلومات العقار</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtersData && (
            <>
              <div className="space-y-2">
                <Label htmlFor="property_type">
                  نوع العقار <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value) => onChange("property_type", value)}
                >
                  <SelectTrigger
                    className={getError("property_type") ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="اختر نوع العقار" />
                  </SelectTrigger>
                  <SelectContent>
                    {filtersData.property_types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getError("property_type") && (
                  <p className="text-sm text-red-500">
                    {getError("property_type")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase_method">
                  طريقة الشراء <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.purchase_method}
                  onValueChange={(value) => onChange("purchase_method", value)}
                >
                  <SelectTrigger
                    className={
                      getError("purchase_method") ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="اختر طريقة الشراء" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نقدي">نقدي</SelectItem>
                    <SelectItem value="تمويل">تمويل</SelectItem>
                    <SelectItem value="نقدي وتمويل">نقدي وتمويل</SelectItem>
                  </SelectContent>
                </Select>
                {getError("purchase_method") && (
                  <p className="text-sm text-red-500">
                    {getError("purchase_method")}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="budget_from">
              الميزانية من <span className="text-red-500">*</span>
            </Label>
            <Input
              id="budget_from"
              type="number"
              value={formData.budget_from || ""}
              onChange={(e) =>
                onChange("budget_from", parseFloat(e.target.value) || 0)
              }
              className={getError("budget_from") ? "border-red-500" : ""}
            />
            {getError("budget_from") && (
              <p className="text-sm text-red-500">{getError("budget_from")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget_to">
              الميزانية إلى <span className="text-red-500">*</span>
            </Label>
            <Input
              id="budget_to"
              type="number"
              value={formData.budget_to || ""}
              onChange={(e) =>
                onChange("budget_to", parseFloat(e.target.value) || 0)
              }
              className={getError("budget_to") ? "border-red-500" : ""}
            />
            {getError("budget_to") && (
              <p className="text-sm text-red-500">{getError("budget_to")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area_from">المساحة من (م²)</Label>
            <Input
              id="area_from"
              type="number"
              value={formData.area_from || ""}
              onChange={(e) =>
                onChange(
                  "area_from",
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area_to">المساحة إلى (م²)</Label>
            <Input
              id="area_to"
              type="number"
              value={formData.area_to || ""}
              onChange={(e) =>
                onChange(
                  "area_to",
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Additional Details */}
      {filtersData && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">تفاصيل إضافية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seriousness">الجدية</Label>
              <Select
                value={formData.seriousness}
                onValueChange={(value) => onChange("seriousness", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجدية" />
                </SelectTrigger>
                <SelectContent>
                  {filtersData.seriousness_options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase_goal">هدف الشراء</Label>
              <Select
                value={formData.purchase_goal}
                onValueChange={(value) => onChange("purchase_goal", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر هدف الشراء" />
                </SelectTrigger>
                <SelectContent>
                  {filtersData.purchase_goals.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="wants_similar_offers"
                checked={formData.wants_similar_offers}
                onCheckedChange={(checked) =>
                  onChange("wants_similar_offers", checked)
                }
              />
              <Label
                htmlFor="wants_similar_offers"
                className="text-sm font-normal cursor-pointer"
              >
                يريد عروض مشابهة
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">الملاحظات</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          rows={4}
          className={getError("notes") ? "border-red-500" : ""}
        />
        {getError("notes") && (
          <p className="text-sm text-red-500">{getError("notes")}</p>
        )}
      </div>
    </div>
  );
};

