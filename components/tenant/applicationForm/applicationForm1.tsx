"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultApplicationFormData } from "@/context/editorStoreFunctions/applicationFormFunctions";

interface ApplicationFormProps {
  id?: string;
  variant?: string;
  useStore?: boolean;
  [key: string]: any;
}

export default function ApplicationFormSection(
  props: ApplicationFormProps = {},
) {
  // تحديد معرف المكون
  const variantId = props.variant || "applicationForm1";
  const uniqueId = props.id || variantId;

  // الاشتراك في editor store
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const applicationFormStates = useEditorStore((s) => s.applicationFormStates);

  // الاشتراك في tenant store
  const tenantData = useTenantStore((s: any) => s.tenantData);
  const fetchTenantData = useTenantStore((s: any) => s.fetchTenantData);
  const tenantId = useTenantStore((s: any) => s.tenantId);

  // تهيئة المكون في الـ store
  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultApplicationFormData(),
        ...props,
      };
      ensureComponentVariant("applicationForm", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

  // جلب بيانات المستأجر
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // دالة لجلب بيانات المكون من tenant data
  const getTenantComponentData = () => {
    if (!tenantData) {
      return {};
    }

    // البحث في البيانات الجديدة (components array)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "applicationForm" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    // البحث في البيانات القديمة (componentSettings)
    if (tenantData?.componentSettings) {
      for (const [pageSlug, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [componentId, component] of Object.entries(
            pageComponents as any,
          )) {
            if (
              (component as any).type === "applicationForm" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // دمج البيانات مع الأولوية: currentStoreData > storeData > tenantComponentData > props > default
  const storeData = props.useStore
    ? getComponentData("applicationForm", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? applicationFormStates[uniqueId] || {}
    : {};

  const defaultData = getDefaultApplicationFormData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    // دمج الكائنات المتداخلة
    header: {
      ...defaultData.header,
      ...(props.header || {}),
      ...(tenantComponentData.header || {}),
      ...(storeData.header || {}),
      ...(currentStoreData.header || {}),
      typography: {
        ...defaultData.header?.typography,
        ...(props.header?.typography || {}),
        ...(tenantComponentData.header?.typography || {}),
        ...(storeData.header?.typography || {}),
        ...(currentStoreData.header?.typography || {}),
      },
    },
    form: {
      ...defaultData.form,
      ...(props.form || {}),
      ...(tenantComponentData.form || {}),
      ...(storeData.form || {}),
      ...(currentStoreData.form || {}),
      fields: {
        ...defaultData.form?.fields,
        ...(props.form?.fields || {}),
        ...(tenantComponentData.form?.fields || {}),
        ...(storeData.form?.fields || {}),
        ...(currentStoreData.form?.fields || {}),
      },
      submitButton: {
        ...defaultData.form?.submitButton,
        ...(props.form?.submitButton || {}),
        ...(tenantComponentData.form?.submitButton || {}),
        ...(storeData.form?.submitButton || {}),
        ...(currentStoreData.form?.submitButton || {}),
      },
      imageUpload: {
        ...defaultData.form?.imageUpload,
        ...(props.form?.imageUpload || {}),
        ...(tenantComponentData.form?.imageUpload || {}),
        ...(storeData.form?.imageUpload || {}),
        ...(currentStoreData.form?.imageUpload || {}),
      },
    },
    styling: {
      ...defaultData.styling,
      ...(props.styling || {}),
      ...(tenantComponentData.styling || {}),
      ...(storeData.styling || {}),
      ...(currentStoreData.styling || {}),
    },
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    requester_type: "",
    date: "",
    time: "",
    offer_type: "",
    description: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isTimeEnabled, setIsTimeEnabled] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData((prev) => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
      setIsTimeEnabled(true);
    } else {
      setFormData((prev) => ({ ...prev, date: "" }));
      setIsTimeEnabled(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Handle form submission
  };

  // التحقق من إظهار المكون
  if (!mergedData.visible) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <div dir={mergedData.layout?.direction || "rtl"}>
        {/* محتوى الصفحة */}
        <section
          className="w-full bg-background"
          style={{
            backgroundColor: mergedData.styling?.bgColor || "#ffffff",
            paddingTop: mergedData.layout?.padding?.y || "py-8",
            paddingBottom: mergedData.layout?.padding?.smY || "sm:py-12",
          }}
        >
          <div
            className="flex flex-col mx-auto mt-10"
            style={{
              maxWidth: mergedData.layout?.maxWidth || "800px",
              width: "91%",
            }}
          >
            {/* العنوان والوصف */}
            <div
              className={`flex flex-col gap-y-4 ${mergedData.header?.textAlign || "text-center"} ${mergedData.header?.marginBottom || "mb-8"}`}
            >
              <h1
                className={
                  mergedData.header?.typography?.title?.className ||
                  "font-bold text-[20px] text-emerald-600 md:text-[32px] leading-[22.32px] md:leading-[35.71px] text-center"
                }
                style={{
                  color:
                    mergedData.styling?.textColor ||
                    mergedData.styling?.focusColor ||
                    "#059669",
                }}
              >
                {mergedData.header?.title || "نموذج طلب معاينة"}
              </h1>
              <p
                className={
                  mergedData.header?.typography?.description?.className ||
                  "font-normal text-[16px] leading-[17.86px] text-gray-600 md:text-[20px] md:leading-[22.32px] text-center"
                }
              >
                {mergedData.header?.description ||
                  "املأ البيانات المطلوبة لتقديم طلب المعاينة. سيتم التواصل معك قريبًا لترتيب موعد لزيارة العقار ومعاينته بشكل دقيق."}
              </p>
            </div>

            {/* النموذج */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-y-4 md:gap-y-8 mt-10 md:mt-8 flex-wrap"
            >
              {/* الصف الأول - المعلومات الشخصية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-y-4 w-full">
                  <label
                    className="text-emerald-600 text-[16px] font-semibold"
                    style={{
                      color: mergedData.styling?.focusColor || "#059669",
                    }}
                  >
                    {mergedData.form?.fields?.name?.label || "الاسم"}
                  </label>
                  <input
                    placeholder={
                      mergedData.form?.fields?.name?.placeholder || "ادخل الاسم"
                    }
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={
                      mergedData.form?.fields?.name?.className ||
                      "text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600"
                    }
                    type={mergedData.form?.fields?.name?.type || "text"}
                    name="name"
                    required={mergedData.form?.fields?.name?.required || true}
                    style={
                      {
                        borderColor:
                          mergedData.styling?.borderColor || "#d1d5db",
                        "--focus-color":
                          mergedData.styling?.focusColor || "#059669",
                      } as React.CSSProperties
                    }
                  />
                </div>

                <div className="flex flex-col gap-y-4 w-full">
                  <label
                    className="text-emerald-600 text-[16px] font-semibold"
                    style={{
                      color: mergedData.styling?.focusColor || "#059669",
                    }}
                  >
                    {mergedData.form?.fields?.phone?.label || "رقم الهاتف"}
                  </label>
                  <input
                    placeholder={
                      mergedData.form?.fields?.phone?.placeholder ||
                      "ادخل رقم الهاتف"
                    }
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={
                      mergedData.form?.fields?.phone?.className ||
                      "text-[16px] placeholder:text-end font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600"
                    }
                    type={mergedData.form?.fields?.phone?.type || "tel"}
                    name="phone"
                    required={mergedData.form?.fields?.phone?.required || true}
                    style={
                      {
                        borderColor:
                          mergedData.styling?.borderColor || "#d1d5db",
                        "--focus-color":
                          mergedData.styling?.focusColor || "#059669",
                      } as React.CSSProperties
                    }
                  />
                </div>

                <div className="flex flex-col gap-y-4 w-full">
                  <label className="text-emerald-600 text-[16px] font-semibold">
                    العنوان
                  </label>
                  <input
                    placeholder="ادخل العنوان"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600"
                    type="text"
                    name="address"
                    required
                  />
                </div>

                <div className="flex flex-col gap-y-4 w-full">
                  <label className="text-emerald-600 text-[16px] font-semibold">
                    الملكية
                  </label>
                  <input
                    placeholder="ادخل الملكية"
                    value={formData.requester_type}
                    onChange={(e) =>
                      handleInputChange("requester_type", e.target.value)
                    }
                    className="text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600"
                    type="text"
                    name="requester_type"
                    required
                  />
                </div>
              </div>

              {/* الصف الثاني - التاريخ والوقت */}
              <div className="flex flex-col lg:flex-row gap-y-4 gap-x-4 w-full">
                <div className="flex-1 flex flex-col gap-y-4 relative">
                  <label className="text-emerald-600 text-[16px] font-semibold">
                    التاريخ
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-right font-normal cursor-pointer text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: ar })
                        ) : (
                          <span className="text-gray-500">
                            من فضلك اختر التاريخ اولا لاظهار الوقت
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                        locale={ar}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex-1 flex flex-col gap-y-4">
                  <label
                    htmlFor="time"
                    className="text-emerald-600 text-[16px] font-semibold"
                  >
                    الوقت
                  </label>
                  <div className="w-full relative">
                    <input
                      id="time"
                      required
                      className="order-1 w-full font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none pr-10 focus:border-emerald-600"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        handleInputChange("time", e.target.value)
                      }
                      disabled={!isTimeEnabled}
                    />
                    <div className="absolute pointer-events-none top-0 bottom-0 right-3 flex items-center order-2">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1ZM11 6a1 1 0 1 1 2 0v5.586l2.707 2.707a1 1 0 1 1-1.414 1.414l-3-3A1 1 0 0 1 11 12V6Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {!isTimeEnabled && (
                      <div className="absolute top-0 left-0 w-full h-full bg-white/70 z-10 cursor-not-allowed rounded-md" />
                    )}
                  </div>
                </div>
              </div>

              {/* نوع العرض */}
              <div className="flex flex-col gap-y-4 w-full">
                <label className="text-emerald-600 text-[16px] font-semibold">
                  نوع العرض
                </label>
                <div className="flex flex-row items-center justify-start gap-x-5">
                  <label className="flex items-center gap-x-4">
                    <input
                      className="appearance-none border-2 border-emerald-600 rounded-full w-4 h-4 checked:bg-emerald-600 checked:border-emerald-600 focus:outline-none"
                      type="radio"
                      value="sale"
                      name="offer_type"
                      checked={formData.offer_type === "sale"}
                      onChange={(e) =>
                        handleInputChange("offer_type", e.target.value)
                      }
                      required
                    />
                    <span className="text-gray-600 text-[16px] font-bold">
                      للبيع
                    </span>
                  </label>
                  <label className="flex items-center gap-x-4">
                    <input
                      className="appearance-none border-2 border-emerald-600 rounded-full w-4 h-4 checked:bg-emerald-600 checked:border-emerald-600 focus:outline-none"
                      type="radio"
                      value="rent"
                      name="offer_type"
                      checked={formData.offer_type === "rent"}
                      onChange={(e) =>
                        handleInputChange("offer_type", e.target.value)
                      }
                      required
                    />
                    <span className="text-gray-600 text-[16px] font-bold">
                      للإيجار
                    </span>
                  </label>
                </div>
              </div>

              {/* الوصف */}
              <div className="flex flex-col gap-y-4 w-full">
                <label className="text-emerald-600 text-[16px] font-semibold">
                  الوصف
                </label>
                <textarea
                  name="description"
                  placeholder="يرجى تقديم وصف دقيق للعقار يشمل نوعه (شقة، فيلا، مكتب)، المساحة، الحالة (جديد/مستعمل)، وأي مميزات إضافية (مثل وجود حديقة، مسبح، أو قربه من الخدمات)"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="h-48 resize-none text-[16px] font-medium text-gray-600 rounded-md border border-gray-300 p-2 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              {/* تحميل الصور */}
              <div className="flex flex-col gap-y-4 w-full">
                <label className="text-emerald-600 text-[16px] font-semibold">
                  تحميل صور العقار
                </label>
                <p className="text-gray-600">
                  يرجى تحميل 3 صور واضحة للعقار، بما في ذلك واجهته الداخلية
                  والخارجية. يُفضل أن تكون الصور بأعلى جودة لتسهيل عملية
                  المعاينة
                </p>
              </div>

              {/* مناطق تحميل الصور */}
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="relative bg-gray-100 w-[300px] h-64 flex flex-col items-center justify-center rounded-md mx-auto"
                >
                  <input
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log(`Image ${index} uploaded:`, file.name);
                      }
                    }}
                  />
                  <p className="text-gray-600">تحميل صورة {index}</p>
                </div>
              ))}

              {/* زر الإرسال */}
              <button
                type="submit"
                className={
                  mergedData.form?.submitButton?.className ||
                  "rounded-md bg-emerald-600 text-white font-semibold text-[16px] py-2 w-full md:w-[400px] mx-auto mb-10 hover:bg-emerald-700 transition-colors"
                }
                style={{
                  backgroundColor: mergedData.styling?.focusColor || "#059669",
                }}
              >
                {mergedData.form?.submitButton?.text || "رفع المعاينة"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
