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
import CitySelector from "@/components/CitySelector";
import DistrictSelector from "@/components/DistrictSelector";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useCustomersFiltersStore from "@/context/store/customersFilters";
import useAuthStore from "@/context/AuthContext";

interface Stage {
  id: number;
  stage_name: string;
  color: string | null;
  icon: string | null;
  description: string | null;
  order: number;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone_number: string;
  password?: string;
  city_id: number | null;
  district_id: number | null;
  note: string;
  type_id: number;
  priority_id: number;
  stage_id: number | null;
  procedure_id: number | null;
}

interface CustomerFormProps {
  formData: CustomerFormData;
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string | string[]>;
  isEditMode?: boolean;
}

// Translation functions
const translateType = (name: string): string => {
  const translations: { [key: string]: string } = {
    Rent: "إيجار",
    Sale: "بيع",
    Rented: "مؤجر",
    Sold: "مباع",
    Both: "كلاهما",
  };
  return translations[name] || name;
};

const translatePriority = (name: string): string => {
  const translations: { [key: string]: string } = {
    Low: "منخفضة",
    Medium: "متوسطة",
    High: "عالية",
  };
  return translations[name] || name;
};

const translateProcedure = (name: string): string => {
  const translations: { [key: string]: string } = {
    meeting: "اجتماع",
    visit: "زيارة",
  };
  return translations[name] || name;
};

export const CustomerForm = ({
  formData,
  onChange,
  errors = {},
  isEditMode = false,
}: CustomerFormProps) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [fetchingStages, setFetchingStages] = useState(false);
  const { filterData } = useCustomersFiltersStore();
  const { userData } = useAuthStore();

  // جلب المراحل من الAPI عند تحميل المكون
  useEffect(() => {
    if (!userData?.token) {
      return;
    }
    fetchStages();
  }, [userData?.token]);

  const fetchStages = async () => {
    if (!userData?.token) {
      return;
    }

    setFetchingStages(true);
    try {
      const response = await axiosInstance.get("/crm/stages");
      if (response.data.status === "success") {
        const sortedStages = response.data.data.sort(
          (a: Stage, b: Stage) => a.order - b.order,
        );
        setStages(sortedStages);
      }
    } catch (error) {
      console.error("Error fetching stages:", error);
    } finally {
      setFetchingStages(false);
    }
  };

  // Helper function to check if field has error
  const hasError = (fieldName: string): boolean => {
    return !!errors[fieldName];
  };

  // Helper function to get error message
  const getErrorMessage = (fieldName: string): string => {
    const error = errors[fieldName];
    if (Array.isArray(error)) {
      return error[0] || "";
    }
    return error || "";
  };

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(field, e.target.value);
    };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="name"
            className={hasError("name") ? "text-red-500" : ""}
          >
            الاسم بالعربية <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="أحمد محمد العلي"
            value={formData.name}
            onChange={handleInputChange("name")}
            className={
              hasError("name") ? "border-red-500 focus:border-red-500" : ""
            }
          />
          {hasError("name") && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage("name")}
            </p>
          )}
        </div>
        <div>
          <Label
            htmlFor="email"
            className={hasError("email") ? "text-red-500" : ""}
          >
            البريد الإلكتروني
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="ahmed@example.com"
            value={formData.email}
            onChange={handleInputChange("email")}
            className={
              hasError("email") ? "border-red-500 focus:border-red-500" : ""
            }
          />
          {hasError("email") && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage("email")}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="phone"
            className={hasError("phone_number") ? "text-red-500" : ""}
          >
            رقم الهاتف <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            placeholder="+966 50 123 4567"
            value={formData.phone_number}
            onChange={handleInputChange("phone_number")}
            className={
              hasError("phone_number")
                ? "border-red-500 focus:border-red-500"
                : ""
            }
          />
          {hasError("phone_number") && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage("phone_number")}
            </p>
          )}
        </div>
        <div>
          <Label
            htmlFor="type_id"
            className={hasError("type_id") ? "text-red-500" : ""}
          >
            نوع العميل <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => onChange("type_id", parseInt(value, 10))}
            value={String(formData.type_id || "")}
          >
            <SelectTrigger
              className={
                hasError("type_id") ? "border-red-500 focus:border-red-500" : ""
              }
            >
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              {filterData?.types
                ?.filter((type: any) => type.name !== "Both")
                .map((type: any) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {translateType(type.name)}
                  </SelectItem>
                )) || [
                <SelectItem key="1" value="1">
                  مشتري
                </SelectItem>,
                <SelectItem key="2" value="2">
                  مستثمر
                </SelectItem>,
                <SelectItem key="3" value="3">
                  مستأجر
                </SelectItem>,
                <SelectItem key="4" value="4">
                  مستأجر
                </SelectItem>,
                <SelectItem key="5" value="5">
                  بائع
                </SelectItem>,
              ]}
            </SelectContent>
          </Select>
          {hasError("type_id") && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage("type_id")}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* الأولوية - مخفية حالياً */}
        {/* <div>
          <Label
            className={hasError("priority_id") ? "text-red-500" : ""}
          >
            الأولوية <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value) =>
              onChange("priority_id", parseInt(value, 10))
            }
            value={String(formData.priority_id || "")}
          >
            <SelectTrigger
              className={
                hasError("priority_id")
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            >
              <SelectValue placeholder="اختر الأولوية" />
            </SelectTrigger>
            <SelectContent>
              {filterData?.priorities?.map((priority: any) => (
                <SelectItem
                  key={priority.id}
                  value={priority.id.toString()}
                >
                  {translatePriority(priority.name)}
                </SelectItem>
              )) || [
                <SelectItem key="1" value="1">
                  منخفضة
                </SelectItem>,
                <SelectItem key="2" value="2">
                  متوسطة
                </SelectItem>,
                <SelectItem key="3" value="3">
                  عالية
                </SelectItem>,
              ]}
            </SelectContent>
          </Select>
          {hasError("priority_id") && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage("priority_id")}
            </p>
          )}
        </div> */}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* نوع الإجراء - مخفي حالياً */}
        {/* <div>
          <Label
            className={hasError("procedure_id") ? "text-red-500" : ""}
          >
            نوع الإجراء
          </Label>
          <Select
            onValueChange={(value) =>
              onChange("procedure_id", value ? parseInt(value, 10) : null)
            }
            value={String(formData.procedure_id || "")}
          >
            <SelectTrigger
              className={
                hasError("procedure_id")
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            >
              <SelectValue placeholder="اختر نوع الإجراء" />
            </SelectTrigger>
            <SelectContent>
              {filterData?.procedures?.map((procedure: any) => (
                <SelectItem
                  key={procedure.id}
                  value={procedure.id.toString()}
                >
                  {translateProcedure(procedure.name)}
                </SelectItem>
              )) || [
                <SelectItem key="1" value="1">
                  لقاء
                </SelectItem>,
                <SelectItem key="2" value="2">
                  زيارة
                </SelectItem>,
              ]}
            </SelectContent>
          </Select>
          {hasError("procedure_id") && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage("procedure_id")}
            </p>
          )}
        </div> */}
        <div>
          <Label htmlFor="stage">المرحلة (اختياري)</Label>
          {fetchingStages ? (
            <div className="flex items-center justify-center py-2 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              <span className="text-sm text-muted-foreground">
                جاري التحميل...
              </span>
            </div>
          ) : (
            <Select
              onValueChange={(value) =>
                onChange(
                  "stage_id",
                  value === "none" ? null : parseInt(value, 10),
                )
              }
              value={formData.stage_id?.toString() || "none"}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المرحلة (اختياري)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون مرحلة</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id.toString()}>
                    <div className="flex items-center gap-2">
                      {stage.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                      )}
                      <span>{stage.stage_name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="city"
            className={hasError("city_id") ? "text-red-500" : ""}
          >
            المدينة
          </Label>
          <CitySelector
            selectedCityId={formData.city_id}
            onCitySelect={(cityId) => onChange("city_id", cityId)}
            className={hasError("city_id") ? "border-red-500" : ""}
          />
          {hasError("city_id") && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage("city_id")}
            </p>
          )}
        </div>
        <div>
          <Label
            htmlFor="district"
            className={hasError("district_id") ? "text-red-500" : ""}
          >
            الحي
          </Label>
          <DistrictSelector
            selectedCityId={formData.city_id}
            selectedDistrictId={formData.district_id}
            onDistrictSelect={(districtId) =>
              onChange("district_id", districtId)
            }
            className={hasError("district_id") ? "border-red-500" : ""}
          />
          {hasError("district_id") && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage("district_id")}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
          placeholder="أدخل أي ملاحظات مهمة عن العميل..."
          value={formData.note}
          onChange={handleInputChange("note")}
        />
      </div>
    </div>
  );
};
