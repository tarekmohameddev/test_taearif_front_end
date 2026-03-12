"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomDropdown, DropdownItem } from "@/components/customComponents/customDropdown";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axiosInstance";
import useCustomersFiltersStore from "@/context/store/customersFilters";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface Stage {
  id: number;
  stage_name: string;
  color: string | null;
  icon: string | null;
  description: string | null;
  order: number;
}

interface City {
  id: number;
  name_ar: string;
}

interface District {
  id: number;
  name_ar: string;
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
  const [fetchingFilters, setFetchingFilters] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const { filterData, setFilterData } = useCustomersFiltersStore();
  const userData = useAuthStore(selectUserData);

  // دالة جلب بيانات الفلاتر من الAPI
  const fetchFilters = useCallback(async () => {
    if (!userData?.token) {
      return;
    }

    setFetchingFilters(true);
    try {
      const response = await axiosInstance.get("/customers/filters");
      if (response.data.status === "success") {
        setFilterData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setFetchingFilters(false);
    }
  }, [userData?.token, setFilterData]);

  // جلب بيانات الفلاتر من الAPI إذا لم تكن موجودة
  useEffect(() => {
    if (!userData?.token) {
      return;
    }
    
    // التحقق من وجود بيانات أنواع العملاء
    if (!filterData?.types || filterData.types.length === 0) {
      fetchFilters();
    }
  }, [userData?.token, filterData?.types, fetchFilters]);

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

  const fetchCities = useCallback(async () => {
    setLoadingCities(true);
    try {
      const response = await axiosInstance.get("/cities?country_id=1");
      if (response.data?.data) {
        setCities(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const fetchDistricts = useCallback(async (cityId: number) => {
    setLoadingDistricts(true);
    try {
      const response = await axiosInstance.get(`/districts?city_id=${cityId}`);
      if (response.data?.data) {
        setDistricts(response.data.data);
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    if (formData.city_id) {
      fetchDistricts(formData.city_id);
    } else {
      setDistricts([]);
    }
  }, [formData.city_id, fetchDistricts]);

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
          {fetchingFilters ? (
            <div className="flex items-center justify-center py-2 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              <span className="text-sm text-muted-foreground">
                جاري التحميل...
              </span>
            </div>
          ) : (
            <CustomDropdown
              fullWidth
              trigger={
                <span>
                  {filterData?.types?.find((t: any) => t.id === formData.type_id)
                    ? translateType(
                        filterData.types.find((t: any) => t.id === formData.type_id)?.name || "",
                      )
                    : "اختر النوع"}
                </span>
              }
              triggerClassName={cn(
                hasError("type_id") ? "border-red-500 focus:border-red-500" : "",
              )}
              dropdownWidth="w-56"
              contentZIndex={10003}
            >
              {(filterData?.types?.filter((type: any) => type.name !== "Both") || [
                { id: 1, name: "Rent" },
                { id: 2, name: "Sale" },
                { id: 3, name: "Rented" },
                { id: 4, name: "Sold" },
                { id: 5, name: "Both" },
              ].filter((t: any) => t.name !== "Both")).map((type: any) => (
                <DropdownItem
                  key={type.id}
                  onClick={() => onChange("type_id", type.id)}
                >
                  {translateType(type.name)}
                </DropdownItem>
              ))}
            </CustomDropdown>
          )}
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
            <CustomDropdown
              fullWidth
              trigger={
                <span className="flex items-center gap-2">
                  {formData.stage_id != null
                    ? (() => {
                        const stage = stages.find((s) => s.id === formData.stage_id);
                        return stage ? (
                          <>
                            {stage.color && (
                              <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: stage.color }}
                              />
                            )}
                            {stage.stage_name}
                          </>
                        ) : (
                          "اختر المرحلة (اختياري)"
                        );
                      })()
                    : "اختر المرحلة (اختياري)"}
                </span>
              }
              triggerClassName=""
              dropdownWidth="w-56"
              contentZIndex={10003}
            >
              <DropdownItem onClick={() => onChange("stage_id", null)}>
                بدون مرحلة
              </DropdownItem>
              {stages.map((stage) => (
                <DropdownItem
                  key={stage.id}
                  onClick={() => onChange("stage_id", stage.id)}
                >
                  <div className="flex items-center gap-2">
                    {stage.color && (
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                      />
                    )}
                    <span>{stage.stage_name}</span>
                  </div>
                </DropdownItem>
              ))}
            </CustomDropdown>
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
          {loadingCities ? (
            <div className="flex items-center justify-center py-2 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              <span className="text-sm text-muted-foreground">
                جاري التحميل...
              </span>
            </div>
          ) : (
            <CustomDropdown
              fullWidth
              trigger={
                <span>
                  {formData.city_id != null
                    ? cities.find((c) => c.id === formData.city_id)?.name_ar ||
                      "اختر مدينة"
                    : "اختر مدينة"}
                </span>
              }
              triggerClassName={cn(
                hasError("city_id") ? "border-red-500 focus:border-red-500" : "",
              )}
              dropdownWidth="w-56"
              maxHeight="200px"
              contentZIndex={10003}
            >
              {cities.map((city) => (
                <DropdownItem
                  key={city.id}
                  onClick={() => {
                    onChange("city_id", city.id);
                    onChange("district_id", null);
                  }}
                >
                  {city.name_ar}
                </DropdownItem>
              ))}
            </CustomDropdown>
          )}
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
          {loadingDistricts && formData.city_id ? (
            <div className="flex items-center justify-center py-2 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              <span className="text-sm text-muted-foreground">
                جاري التحميل...
              </span>
            </div>
          ) : (
            <CustomDropdown
              fullWidth
              trigger={
                <span className={!formData.city_id ? "text-gray-400" : ""}>
                  {formData.district_id != null
                    ? districts.find(
                        (d) => d.id === formData.district_id || d.id === Number(formData.district_id),
                      )?.name_ar || "اختر المنطقة"
                    : "اختر المنطقة"}
                </span>
              }
              triggerClassName={cn(
                hasError("district_id") ? "border-red-500 focus:border-red-500" : "",
                !formData.city_id && "opacity-70",
              )}
              dropdownWidth="w-56"
              maxHeight="200px"
              contentZIndex={10003}
            >
              {!formData.city_id ? (
                <DropdownItem onClick={() => {}} className="text-gray-400 cursor-not-allowed">
                  اختر المدينة أولاً
                </DropdownItem>
              ) : (
                districts.map((district) => (
                  <DropdownItem
                    key={district.id}
                    onClick={() => onChange("district_id", district.id)}
                  >
                    {district.name_ar}
                  </DropdownItem>
                ))
              )}
            </CustomDropdown>
          )}
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
