"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultJobFormData } from "@/context/editorStoreFunctions/jobFormFunctions";
import { useTenantId } from "@/hooks/useTenantId";

interface JobFormProps {
  id?: string;
  variant?: string;
  useStore?: boolean;
  [key: string]: any;
}

export default function JobForm1(props: JobFormProps = {}) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "jobForm1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const jobFormStates = useEditorStore((s) => s.jobFormStates);

  const tenantData = useTenantStore((s: any) => s.tenantData);
  const fetchTenantData = useTenantStore((s: any) => s.fetchTenantData);
  const tenantIdFromStore = useTenantStore((s: any) => s.tenantId);
  const { tenantId: tenantIdFromHook } = useTenantId();

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantIdFromStore || tenantIdFromHook) {
      fetchTenantData(tenantIdFromStore || tenantIdFromHook);
    }
  }, [tenantIdFromStore, tenantIdFromHook, fetchTenantData]);

  // Extract component data from tenantData
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "jobForm" &&
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
              (component as any).type === "jobForm" &&
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
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultJobFormData(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultJobFormData(),
              ...props,
            };

      ensureComponentVariant("jobForm", uniqueId, initialData);
    }
  }, [
    uniqueId,
    props.useStore,
    ensureComponentVariant,
    tenantComponentData,
  ]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = props.useStore
    ? getComponentData("jobForm", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? jobFormStates[uniqueId] || {}
    : {};

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const defaultData = getDefaultJobFormData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    header: {
      ...defaultData.header,
      ...(props.header || {}),
      ...(tenantComponentData.header || {}),
      ...(storeData.header || {}),
      ...(currentStoreData.header || {}),
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
    },
    styling: {
      ...defaultData.styling,
      ...(props.styling || {}),
      ...(tenantComponentData.styling || {}),
      ...(storeData.styling || {}),
      ...(currentStoreData.styling || {}),
    },
    api: {
      ...defaultData.api,
      ...(props.api || {}),
      ...(tenantComponentData.api || {}),
      ...(storeData.api || {}),
      ...(currentStoreData.api || {}),
    },
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    pdfFile: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get tenantId for API
  const finalTenantId =
    mergedData.api?.tenantId ||
    (mergedData.api?.useTenantStore
      ? tenantIdFromStore || tenantIdFromHook
      : null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const fields = mergedData.form?.fields || {};

    if (fields.name?.required && !formData.name.trim()) {
      newErrors.name = `${fields.name.label || "الاسم"} مطلوب`;
    }

    if (fields.email?.required && !formData.email.trim()) {
      newErrors.email = `${fields.email.label || "البريد الإلكتروني"} مطلوب`;
    } else if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (fields.phone?.required && !formData.phone.trim()) {
      newErrors.phone = `${fields.phone.label || "رقم الهاتف"} مطلوب`;
    }

    if (
      fields.description?.required &&
      !formData.description.trim()
    ) {
      newErrors.description = `${fields.description.label || "الوصف"} مطلوب`;
    }

    if (fields.pdf?.required && !formData.pdfFile) {
      newErrors.pdf = `${fields.pdf.label || "السيرة الذاتية"} مطلوبة`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fields = mergedData.form?.fields || {};
    const pdfField = fields.pdf || {};

    // Check file type (PDF only according to API)
    if (file.type !== "application/pdf") {
      toast.error("يرجى رفع ملف PDF فقط");
      e.target.value = "";
      return;
    }

    // Check file size
    const maxSize = pdfField.maxSize || 5 * 1024 * 1024; // 5MB default
    if (file.size > maxSize) {
      toast.error(
        `حجم الملف يجب أن يكون أقل من ${Math.round(maxSize / 1024 / 1024)} ميجابايت`,
      );
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, pdfFile: file }));
    setUploadedFileName(file.name);

    if (errors.pdf) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.pdf;
        return newErrors;
      });
    }

    toast.success(`تم حفظ الملف: ${file.name}`);
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, pdfFile: null }));
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة بشكل صحيح");
      return;
    }

    if (!finalTenantId) {
      toast.error("لم يتم العثور على معرف المستأجر");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("phone", formData.phone.trim());
      formDataToSend.append("email", formData.email.trim());
      if (formData.description.trim()) {
        formDataToSend.append("description", formData.description.trim());
      }
      if (formData.pdfFile) {
        formDataToSend.append("pdf", formData.pdfFile);
      }

      // Build API URL - Fixed endpoint (non-modifiable)
      const backendUrl = process.env.NEXT_PUBLIC_Backend_URL || "";
      const apiUrl = `${backendUrl}/v1/tenant-website/${encodeURIComponent(finalTenantId)}/job-applications`;

      toast.loading("جاري إرسال الطلب...", { id: "submitting" });

      // Send request without auth headers
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formDataToSend,
      });

      const json = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          // Validation errors
          const validationErrors = json.errors || {};
          const errorMessages = Object.values(validationErrors).flat() as string[];
          toast.error(errorMessages[0] || json.message || "حدث خطأ في التحقق من البيانات", {
            id: "submitting",
          });
        } else if (response.status === 404) {
          toast.error("لم يتم العثور على المستأجر", { id: "submitting" });
        } else {
          toast.error(json.message || "حدث خطأ أثناء إرسال الطلب", {
            id: "submitting",
          });
        }
        return;
      }

      if (json.success) {
        toast.success("تم تقديم طلب الوظيفة بنجاح", { id: "submitting" });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          description: "",
          pdfFile: null,
        });
        setUploadedFileName(null);
        setErrors({});
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(json.message || "حدث خطأ أثناء الإرسال");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "حدث خطأ أثناء إرسال الطلب", {
        id: "submitting",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = mergedData.form?.fields || {};
  const submitButton = mergedData.form?.submitButton || {};
  const header = mergedData.header || {};
  const styling = mergedData.styling || {};

  return (
    <div
      className="w-full mx-auto"
      dir={mergedData.layout?.direction || "rtl"}
      style={{
        maxWidth: mergedData.layout?.maxWidth || "800px",
        paddingTop: mergedData.layout?.padding?.top || "4rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "4rem",
        backgroundColor: styling.backgroundColor || "#ffffff",
      }}
    >
      {/* Header Section */}
      {header.title && (
        <div
          className={`${header.textAlign || "text-center"} mb-8`}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mb-4 shadow-lg">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent pb-5">
            {header.title}
          </h1>
          {header.description && (
            <p className="text-lg" style={{ color: styling.textColor || "#6b7280" }}>
              {header.description}
            </p>
          )}
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          {fields.name && (
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: styling.focusColor || "#3b82f6" }} />
                  <span>{fields.name.label}</span>
                  {fields.name.required && (
                    <span style={{ color: styling.errorColor || "#ef4444" }}>*</span>
                  )}
                </div>
              </label>
              <input
                id="name"
                type={fields.name.type || "text"}
                placeholder={fields.name.placeholder}
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.name;
                      return newErrors;
                    });
                  }
                }}
                className={`${fields.name.className || ""} ${
                  errors.name
                    ? `border-red-300 bg-red-50`
                    : `border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white`
                }`}
                style={{
                  borderColor: errors.name
                    ? styling.errorColor || "#ef4444"
                    : styling.borderColor || "#e5e7eb",
                }}
              />
              {errors.name && (
                <p
                  className="text-sm pr-2 flex items-center gap-1"
                  style={{ color: styling.errorColor || "#ef4444" }}
                >
                  <span>•</span>
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          {fields.email && (
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: styling.focusColor || "#3b82f6" }} />
                  <span>{fields.email.label}</span>
                  {fields.email.required && (
                    <span style={{ color: styling.errorColor || "#ef4444" }}>*</span>
                  )}
                </div>
              </label>
              <input
                id="email"
                type={fields.email.type || "email"}
                placeholder={fields.email.placeholder}
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.email;
                      return newErrors;
                    });
                  }
                }}
                className={`${fields.email.className || ""} ${
                  errors.email
                    ? `border-red-300 bg-red-50`
                    : `border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white`
                }`}
                style={{
                  borderColor: errors.email
                    ? styling.errorColor || "#ef4444"
                    : styling.borderColor || "#e5e7eb",
                }}
              />
              {errors.email && (
                <p
                  className="text-sm pr-2 flex items-center gap-1"
                  style={{ color: styling.errorColor || "#ef4444" }}
                >
                  <span>•</span>
                  {errors.email}
                </p>
              )}
            </div>
          )}

          {/* Phone Field */}
          {fields.phone && (
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: styling.focusColor || "#3b82f6" }} />
                  <span>{fields.phone.label}</span>
                  {fields.phone.required && (
                    <span style={{ color: styling.errorColor || "#ef4444" }}>*</span>
                  )}
                </div>
              </label>
              <input
                id="phone"
                type={fields.phone.type || "tel"}
                placeholder={fields.phone.placeholder}
                value={formData.phone}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, phone: e.target.value }));
                  if (errors.phone) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.phone;
                      return newErrors;
                    });
                  }
                }}
                className={`${fields.phone.className || ""} ${
                  errors.phone
                    ? `border-red-300 bg-red-50`
                    : `border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white`
                }`}
                style={{
                  borderColor: errors.phone
                    ? styling.errorColor || "#ef4444"
                    : styling.borderColor || "#e5e7eb",
                }}
              />
              {errors.phone && (
                <p
                  className="text-sm pr-2 flex items-center gap-1"
                  style={{ color: styling.errorColor || "#ef4444" }}
                >
                  <span>•</span>
                  {errors.phone}
                </p>
              )}
            </div>
          )}

          {/* Description Field */}
          {fields.description && (
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" style={{ color: styling.focusColor || "#3b82f6" }} />
                  <span>{fields.description.label}</span>
                  {fields.description.required && (
                    <span style={{ color: styling.errorColor || "#ef4444" }}>*</span>
                  )}
                </div>
              </label>
              <textarea
                id="description"
                placeholder={fields.description.placeholder}
                value={formData.description}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                  if (errors.description) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.description;
                      return newErrors;
                    });
                  }
                }}
                rows={fields.description.rows || 6}
                className={`${fields.description.className || ""} ${
                  errors.description
                    ? `border-red-300 bg-red-50`
                    : `border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white`
                }`}
                style={{
                  borderColor: errors.description
                    ? styling.errorColor || "#ef4444"
                    : styling.borderColor || "#e5e7eb",
                }}
              />
              {errors.description && (
                <p
                  className="text-sm pr-2 flex items-center gap-1"
                  style={{ color: styling.errorColor || "#ef4444" }}
                >
                  <span>•</span>
                  {errors.description}
                </p>
              )}
            </div>
          )}

          {/* PDF Upload Field */}
          {fields.pdf && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: styling.focusColor || "#3b82f6" }} />
                  <span>{fields.pdf.label}</span>
                  {fields.pdf.required && (
                    <span style={{ color: styling.errorColor || "#ef4444" }}>*</span>
                  )}
                </div>
              </label>
              <div className="space-y-3">
                {!uploadedFileName ? (
                  <div
                    onClick={() =>
                      !isSubmitting && fileInputRef.current?.click()
                    }
                    className={`border-2 border-dashed rounded-3xl p-8 transition-all duration-200 ${
                      errors.pdf
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400 hover:from-blue-50 hover:to-blue-100"
                    } ${!isSubmitting ? "cursor-pointer" : "cursor-not-allowed"}`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={fields.pdf.accept || ".pdf,application/pdf"}
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-base font-semibold text-gray-800 mb-1">
                        اضغط لرفع ملف السيرة الذاتية
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        PDF فقط (حد أقصى{" "}
                        {Math.round((fields.pdf.maxSize || 5242880) / 1024 / 1024)}{" "}
                        ميجابايت)
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-3xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        اختر ملف
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 rounded-3xl p-5 transition-all duration-200 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {uploadedFileName}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="flex items-center gap-2 text-blue-600 font-medium">
                              <FileText className="h-3 w-3" />
                              جاهز للإرسال
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        disabled={isSubmitting}
                        className="w-10 h-10 bg-white rounded-3xl flex items-center justify-center hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {errors.pdf && (
                <p
                  className="text-sm pr-2 flex items-center gap-1"
                  style={{ color: styling.errorColor || "#ef4444" }}
                >
                  <span>•</span>
                  {errors.pdf}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={submitButton.className || ""}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Briefcase className="h-5 w-5" />
                  <span>{submitButton.text || "إرسال الطلب"}</span>
                </>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
