"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultContactUsHomePageData } from "@/context/editorStoreFunctions/contactUsHomePageFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface ContactUsHomePageProps {
  visible?: boolean;
  ThemeTwo?: string;
  background?: {
    ThemeTwo?: string;
    image?: string;
    alt?: string;
    overlay?: {
      ThemeTwo?: string;
      enabled?: boolean;
      color?: string;
    };
  };
  header?: {
    ThemeTwo?: string;
    text?: string;
  };
  form?: {
    ThemeTwo?: string;
    submitButton?: {
      ThemeTwo?: string;
      text?: string;
      loadingText?: string;
      backgroundColor?: string;
      hoverColor?: string;
      textColor?: string;
    };
    fields?: {
      ThemeTwo?: string;
      fullName?: {
        ThemeTwo?: string;
        label?: string;
        placeholder?: string;
        required?: boolean;
        type?: string;
      };
      whatsappNumber?: {
        ThemeTwo?: string;
        label?: string;
        placeholder?: string;
        required?: boolean;
        type?: string;
      };
      email?: {
        ThemeTwo?: string;
        label?: string;
        placeholder?: string;
        required?: boolean;
        type?: string;
      };
      paymentMethod?: {
        ThemeTwo?: string;
        label?: string;
        placeholder?: string;
        required?: boolean;
        type?: string;
        options?: Array<{
          ThemeTwo?: string;
          value?: string;
          label?: string;
        }>;
      };
      city?: {
        ThemeTwo?: string;
        label?: string;
        placeholder?: string;
        required?: boolean;
        type?: string;
        options?: Array<{
          ThemeTwo?: string;
          value?: string;
          label?: string;
        }>;
      };
      unitType?: {
        ThemeTwo?: string;
        label?: string;
        placeholder?: string;
        required?: boolean;
        type?: string;
        options?: Array<{
          ThemeTwo?: string;
          value?: string;
          label?: string;
        }>;
      };
      budget?: {
        ThemeTwo?: string;
        label?: string;
        placeholder?: string;
        required?: boolean;
        type?: string;
      };
      message?: {
        ThemeTwo?: string;
        label?: string;
        placeholder?: string;
        required?: boolean;
        type?: string;
        rows?: number;
      };
    };
  };
  styling?: {
    ThemeTwo?: string;
    inputBackground?: string;
    inputBorder?: string;
    inputText?: string;
    inputPlaceholder?: string;
    inputFocus?: string;
    labelColor?: string;
    errorColor?: string;
  };
  layout?: {
    ThemeTwo?: string;
    maxWidth?: string;
    padding?: {
      ThemeTwo?: string;
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
    gap?: {
      ThemeTwo?: string;
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
  };

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// Form validation schema
const createContactFormSchema = (mergedData: any) =>
  z.object({
    fullName: z
      .string()
      .min(1, mergedData?.form?.fields?.fullName?.label + " مطلوب"),
    whatsappNumber: z
      .string()
      .min(1, mergedData?.form?.fields?.whatsappNumber?.label + " مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    paymentMethod: z
      .string()
      .min(1, mergedData?.form?.fields?.paymentMethod?.label + " مطلوبة"),
    city: z.string().min(1, mergedData?.form?.fields?.city?.label + " مطلوبة"),
    unitType: z
      .string()
      .min(1, mergedData?.form?.fields?.unitType?.label + " مطلوب"),
    budget: z
      .string()
      .min(1, mergedData?.form?.fields?.budget?.label + " مطلوبة"),
    message: z
      .string()
      .min(1, mergedData?.form?.fields?.message?.label + " مطلوبة"),
  });

type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>;

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function ContactUsHomePage1(props: ContactUsHomePageProps) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "contactUsHomePage1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const contactUsHomePageStates = useEditorStore(
    (s) => s.contactUsHomePageStates,
  );

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  // Extract component data from tenantData (BEFORE useEffect)
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "contactUsHomePage" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    // Check old structure (tenantData.componentSettings)
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
              (component as any).type === "contactUsHomePage" &&
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

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultContactUsHomePageData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultContactUsHomePageData(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("contactUsHomePage", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = contactUsHomePageStates[uniqueId];
  const currentStoreData = getComponentData("contactUsHomePage", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultContactUsHomePageData(), // 1. Defaults (lowest priority)
    ...storeData, // 2. Store state
    ...currentStoreData, // 3. Current store data
    ...props, // 4. Props (highest priority)
  };

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactFormSchema = createContactFormSchema(mergedData);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const paymentMethod = watch("paymentMethod");
  const city = watch("city");
  const unitType = watch("unitType");

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement form submission logic
      console.log("Form data:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("تم إرسال النموذج بنجاح!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ أثناء إرسال النموذج");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-[90%]  sm:w-[70%]  md:w-[70%]  lg:w-[70%] xl:w-[60%] 2xl:w-[50%] mx-auto flex items-center justify-center py-16 px-4 overflow-hidden ">
      {/* Form Container */}
      <div
        className="relative z-10 w-full"
        style={{ maxWidth: mergedData.layout?.maxWidth || "4xl" }}
      >
        <div className="relative rounded-lg p-8 md:p-12 shadow-2xl overflow-hidden">
          {/* Background Image for Card */}
          {mergedData.background?.image && (
            <div className="absolute inset-0 z-0">
              <Image
                src={mergedData.background.image}
                alt={mergedData.background.alt || "خلفية"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              {mergedData.background.overlay?.enabled && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor:
                      mergedData.background.overlay.color ||
                      "rgba(139, 95, 70, 0.8)",
                  }}
                ></div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="relative z-10">
            {/* Header Text */}
            {mergedData.header?.text && (
              <div className="text-center mb-8">
                <p
                  className="text-white text-lg md:text-xl leading-relaxed"
                  style={{ color: mergedData.styling?.labelColor || "#ffffff" }}
                >
                  {mergedData.header.text.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < mergedData.header.text.split("\n").length - 1 && (
                        <br />
                      )}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Right Column */}
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="font-medium text-base"
                      style={{
                        color: mergedData.styling?.labelColor || "#ffffff",
                      }}
                    >
                      {mergedData.form?.fields?.fullName?.label ||
                        "الاسم الكامل"}
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={
                        mergedData.form?.fields?.fullName?.placeholder ||
                        "الاسم الكامل"
                      }
                      className="h-12"
                      style={{
                        backgroundColor:
                          mergedData.styling?.inputBackground || "#f5f0e8",
                        borderColor:
                          mergedData.styling?.inputBorder || "#c4b5a0",
                        color: mergedData.styling?.inputText || "#ffffff",
                      }}
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p
                        className="text-sm"
                        style={{
                          color: mergedData.styling?.errorColor || "#ef4444",
                        }}
                      >
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="font-medium text-base"
                      style={{
                        color: mergedData.styling?.labelColor || "#ffffff",
                      }}
                    >
                      {mergedData.form?.fields?.email?.label ||
                        "البريد الالكتروني"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={
                        mergedData.form?.fields?.email?.placeholder ||
                        "البريد الالكتروني"
                      }
                      className="h-12"
                      style={{
                        backgroundColor:
                          mergedData.styling?.inputBackground || "#f5f0e8",
                        borderColor:
                          mergedData.styling?.inputBorder || "#c4b5a0",
                        color: mergedData.styling?.inputText || "#ffffff",
                      }}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p
                        className="text-sm"
                        style={{
                          color: mergedData.styling?.errorColor || "#ef4444",
                        }}
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="font-medium text-base"
                      style={{
                        color: mergedData.styling?.labelColor || "#ffffff",
                      }}
                    >
                      {mergedData.form?.fields?.city?.label || "المدينة"}
                    </Label>
                    <Select
                      value={city}
                      onValueChange={(value) => setValue("city", value)}
                    >
                      <SelectTrigger
                        dir="rtl"
                        id="city"
                        className="h-12 [&_span:empty]:text-[#8b5f46] [&_span:not(:has(*))]:text-[#8b5f46]"
                        style={{
                          backgroundColor:
                            mergedData.styling?.inputBackground || "#f5f0e8",
                          borderColor:
                            mergedData.styling?.inputBorder || "#c4b5a0",
                          color: mergedData.styling?.inputText || "#ffffff",
                        }}
                      >
                        <SelectValue
                          placeholder={
                            mergedData.form?.fields?.city?.placeholder ||
                            "اختر المدينة"
                          }
                          style={{ color: !city ? "#8b5f46" : undefined }}
                        />
                      </SelectTrigger>
                      <SelectContent align="end">
                        {mergedData.form?.fields?.city?.options?.map(
                          (option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value || ""}
                            >
                              {option.label || option.value}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p
                        className="text-sm"
                        style={{
                          color: mergedData.styling?.errorColor || "#ef4444",
                        }}
                      >
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="budget"
                      className="font-medium text-base"
                      style={{
                        color: mergedData.styling?.labelColor || "#ffffff",
                      }}
                    >
                      {mergedData.form?.fields?.budget?.label || "الميزانية"}
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder={
                        mergedData.form?.fields?.budget?.placeholder ||
                        "الميزانية"
                      }
                      className="h-12"
                      style={{
                        backgroundColor:
                          mergedData.styling?.inputBackground || "#f5f0e8",
                        borderColor:
                          mergedData.styling?.inputBorder || "#c4b5a0",
                        color: mergedData.styling?.inputText || "#ffffff",
                      }}
                      {...register("budget")}
                    />
                    {errors.budget && (
                      <p
                        className="text-sm"
                        style={{
                          color: mergedData.styling?.errorColor || "#ef4444",
                        }}
                      >
                        {errors.budget.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Left Column */}
                <div className="space-y-6">
                  {/* WhatsApp Number */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="whatsappNumber"
                      className="font-medium text-base"
                      style={{
                        color: mergedData.styling?.labelColor || "#ffffff",
                      }}
                    >
                      {mergedData.form?.fields?.whatsappNumber?.label ||
                        "رقم الواتساب"}
                    </Label>
                    <Input
                      id="whatsappNumber"
                      type="tel"
                      placeholder={
                        mergedData.form?.fields?.whatsappNumber?.placeholder ||
                        "رقم الواتساب"
                      }
                      className="h-12"
                      style={{
                        backgroundColor:
                          mergedData.styling?.inputBackground || "#f5f0e8",
                        borderColor:
                          mergedData.styling?.inputBorder || "#c4b5a0",
                        color: mergedData.styling?.inputText || "#ffffff",
                      }}
                      {...register("whatsappNumber")}
                    />
                    {errors.whatsappNumber && (
                      <p
                        className="text-sm"
                        style={{
                          color: mergedData.styling?.errorColor || "#ef4444",
                        }}
                      >
                        {errors.whatsappNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="paymentMethod"
                      className="font-medium text-base"
                      style={{
                        color: mergedData.styling?.labelColor || "#ffffff",
                      }}
                    >
                      {mergedData.form?.fields?.paymentMethod?.label ||
                        "طريقة الدفع"}
                    </Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value) =>
                        setValue("paymentMethod", value)
                      }
                    >
                      <SelectTrigger
                        dir="rtl"
                        id="paymentMethod"
                        className="h-12 [&_span:empty]:text-[#8b5f46] [&_span:not(:has(*))]:text-[#8b5f46]"
                        style={{
                          backgroundColor:
                            mergedData.styling?.inputBackground || "#f5f0e8",
                          borderColor:
                            mergedData.styling?.inputBorder || "#c4b5a0",
                          color: mergedData.styling?.inputText || "#ffffff",
                        }}
                      >
                        <SelectValue
                          placeholder={
                            mergedData.form?.fields?.paymentMethod
                              ?.placeholder || "اختر طريقة الدفع"
                          }
                          style={{
                            color: !paymentMethod ? "#8b5f46" : undefined,
                          }}
                        />
                      </SelectTrigger>
                      <SelectContent align="end">
                        {mergedData.form?.fields?.paymentMethod?.options?.map(
                          (option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value || ""}
                            >
                              {option.label || option.value}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    {errors.paymentMethod && (
                      <p
                        className="text-sm"
                        style={{
                          color: mergedData.styling?.errorColor || "#ef4444",
                        }}
                      >
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>

                  {/* Unit Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="unitType"
                      className="font-medium text-base"
                      style={{
                        color: mergedData.styling?.labelColor || "#ffffff",
                      }}
                    >
                      {mergedData.form?.fields?.unitType?.label || "نوع الوحدة"}
                    </Label>
                    <Select
                      value={unitType}
                      onValueChange={(value) => setValue("unitType", value)}
                    >
                      <SelectTrigger
                        id="unitType"
                        dir="rtl"
                        className="h-12 [&_span:empty]:text-[#8b5f46] [&_span:not(:has(*))]:text-[#8b5f46]"
                        style={{
                          backgroundColor:
                            mergedData.styling?.inputBackground || "#f5f0e8",
                          borderColor:
                            mergedData.styling?.inputBorder || "#c4b5a0",
                          color: mergedData.styling?.inputText || "#ffffff",
                        }}
                      >
                        <SelectValue
                          placeholder={
                            mergedData.form?.fields?.unitType?.placeholder ||
                            "اختر نوع الوحدة"
                          }
                          style={{ color: !unitType ? "#8b5f46" : undefined }}
                        />
                      </SelectTrigger>
                      <SelectContent align="end">
                        {mergedData.form?.fields?.unitType?.options?.map(
                          (option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value || ""}
                            >
                              {option.label || option.value}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    {errors.unitType && (
                      <p
                        className="text-sm"
                        style={{
                          color: mergedData.styling?.errorColor || "#ef4444",
                        }}
                      >
                        {errors.unitType.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Content - Full Width */}
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="font-medium text-base"
                  style={{ color: mergedData.styling?.labelColor || "#ffffff" }}
                >
                  {mergedData.form?.fields?.message?.label || "محتوى الرسالة"}
                </Label>
                <Textarea
                  id="message"
                  placeholder={
                    mergedData.form?.fields?.message?.placeholder ||
                    "محتوى الرسالة"
                  }
                  rows={mergedData.form?.fields?.message?.rows || 4}
                  className="resize-none"
                  style={{
                    backgroundColor:
                      mergedData.styling?.inputBackground || "#f5f0e8",
                    borderColor: mergedData.styling?.inputBorder || "#c4b5a0",
                    color: mergedData.styling?.inputText || "#ffffff",
                  }}
                  {...register("message")}
                />
                {errors.message && (
                  <p
                    className="text-sm"
                    style={{
                      color: mergedData.styling?.errorColor || "#ef4444",
                    }}
                  >
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-medium px-12 py-4 rounded-lg transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                  style={{
                    backgroundColor: isSubmitting
                      ? mergedData.form?.submitButton?.backgroundColor ||
                        "#c9a882"
                      : mergedData.form?.submitButton?.backgroundColor ||
                        "#c9a882",
                    color:
                      mergedData.form?.submitButton?.textColor || "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor =
                        mergedData.form?.submitButton?.hoverColor || "#b8966f";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor =
                        mergedData.form?.submitButton?.backgroundColor ||
                        "#c9a882";
                    }
                  }}
                >
                  {isSubmitting
                    ? mergedData.form?.submitButton?.loadingText ||
                      "جاري الإرسال..."
                    : mergedData.form?.submitButton?.text || "اشترك الآن"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
