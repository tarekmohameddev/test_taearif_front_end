"use client";

import { useState } from "react";
import {
  submitPropertyInterest,
  getPropertyInterestErrorMessage,
  getPropertyInterestFieldErrors,
  SubmitPropertyInterestPayload,
} from "@/lib/api/propertyRequests";

const PHONE_PATTERN = /^[0-9]{10,15}$/;

export type FieldErrors = Record<string, string>;

export type PropertyInterestFormProps = {
  propertyId: number;
  tenantUsername: string;
  primaryColor?: string;
  submitButtonText?: string;
  onSuccess?: () => void;
};

const inputBaseClass =
  "w-full rounded-md border bg-background px-4 py-3 text-right focus:ring-2 focus:ring-offset-0 focus:outline-none";
const inputErrorClass = "border-red-500 focus:ring-red-500";
const inputOkClass = "border-input";

export function PropertyInterestForm({
  propertyId,
  tenantUsername,
  primaryColor = "#8b5f46",
  submitButtonText = "إرسال الطلب",
  onSuccess,
}: PropertyInterestFormProps) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const nextValue =
      name === "phone" ? value.replace(/\D/g, "") : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
    if (generalError) setGeneralError(null);
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const runClientValidation = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedName = form.full_name.trim();
    const trimmedPhone = form.phone.replace(/\s/g, "");

    if (!trimmedName) {
      errors.full_name = "الاسم الكامل مطلوب";
    }
    if (!trimmedPhone) {
      errors.phone = "رقم الجوال مطلوب";
    } else if (!PHONE_PATTERN.test(trimmedPhone)) {
      errors.phone = "رقم الجوال غير صحيح (أرقام فقط، 10–15 رقم)";
    }

    setFieldErrors(errors);
    setGeneralError(null);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    if (!runClientValidation()) return;

    const trimmedName = form.full_name.trim();
    const trimmedPhone = form.phone.replace(/\s/g, "");

    setLoading(true);
    try {
      const payload: SubmitPropertyInterestPayload = {
        tenant_username: tenantUsername,
        property_id: propertyId,
        full_name: trimmedName,
        phone: trimmedPhone,
        notes: form.notes.trim() || undefined,
      };

      const res = await submitPropertyInterest(payload);
      const successMessage =
        res.message ||
        res.message_en ||
        "تم إرسال طلبك بنجاح. سيتم التواصل معك قريباً.";
      if (typeof window !== "undefined" && window.alert) {
        window.alert(successMessage);
      }
      setForm({ full_name: "", phone: "", notes: "" });
      setFieldErrors({});
      onSuccess?.();
    } catch (err: any) {
      const apiFieldErrors = getPropertyInterestFieldErrors(err);
      if (Object.keys(apiFieldErrors).length > 0) {
        setFieldErrors(apiFieldErrors);
        setGeneralError(null);
      } else {
        setGeneralError(getPropertyInterestErrorMessage(err));
        setFieldErrors({});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4" dir="rtl" noValidate>
      <div>
        <label
          htmlFor="property-interest-inline-full_name"
          className="block text-sm font-medium mb-1 text-right"
        >
          الاسم الكامل *
        </label>
        <input
          id="property-interest-inline-full_name"
          name="full_name"
          type="text"
          value={form.full_name}
          onChange={handleChange}
          required
          placeholder="أدخل اسمك الكامل"
          className={`${inputBaseClass} ${fieldErrors.full_name ? inputErrorClass : inputOkClass}`}
          maxLength={255}
          aria-invalid={!!fieldErrors.full_name}
          aria-describedby={fieldErrors.full_name ? "err-full_name" : undefined}
        />
        {fieldErrors.full_name && (
          <p
            id="err-full_name"
            className="mt-1 text-sm text-red-600 text-right"
            role="alert"
          >
            {fieldErrors.full_name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="property-interest-inline-phone"
          className="block text-sm font-medium mb-1 text-right"
        >
          رقم الجوال *
        </label>
        <input
          id="property-interest-inline-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="05xxxxxxxx"
          className={`${inputBaseClass} ${fieldErrors.phone ? inputErrorClass : inputOkClass}`}
          maxLength={20}
          inputMode="numeric"
          pattern="[0-9]{10,15}"
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
        />
        {fieldErrors.phone && (
          <p
            id="err-phone"
            className="mt-1 text-sm text-red-600 text-right"
            role="alert"
          >
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="property-interest-inline-notes"
          className="block text-sm font-medium mb-1 text-right"
        >
          ملاحظات (اختياري)
        </label>
        <textarea
          id="property-interest-inline-notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="أي تفاصيل إضافية..."
          className={`${inputBaseClass} ${fieldErrors.notes ? inputErrorClass : inputOkClass}`}
          maxLength={1000}
          aria-invalid={!!fieldErrors.notes}
          aria-describedby={fieldErrors.notes ? "err-notes" : undefined}
        />
        {fieldErrors.notes && (
          <p
            id="err-notes"
            className="mt-1 text-sm text-red-600 text-right"
            role="alert"
          >
            {fieldErrors.notes}
          </p>
        )}
      </div>

      {generalError && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-right text-sm"
          role="alert"
        >
          {generalError}
        </div>
      )}

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: primaryColor }}
        >
          {loading ? "جاري الإرسال..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}
