"use client";

import { useState } from "react";
import {
  submitPropertyInterest,
  getPropertyInterestErrorMessage,
  SubmitPropertyInterestPayload,
} from "@/lib/api/propertyRequests";

const PHONE_PATTERN = /^[0-9]{10,15}$/;

export type PropertyInterestFormProps = {
  propertyId: number;
  tenantUsername: string;
  primaryColor?: string;
  submitButtonText?: string;
  onSuccess?: () => void;
};

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
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = form.full_name.trim();
    const trimmedPhone = form.phone.replace(/\s/g, "");
    if (!trimmedName) {
      setError("الاسم الكامل مطلوب");
      return;
    }
    if (!PHONE_PATTERN.test(trimmedPhone)) {
      setError("رقم الجوال غير صحيح (أرقام فقط، 10–15 رقم)");
      return;
    }

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
      onSuccess?.();
    } catch (err: any) {
      setError(getPropertyInterestErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4" dir="rtl">
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
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-right focus:ring-2 focus:ring-offset-0 focus:outline-none"
          maxLength={255}
        />
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
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-right focus:ring-2 focus:ring-offset-0"
          maxLength={20}
          inputMode="numeric"
          pattern="[0-9]{10,15}"
        />
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
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-right resize-none focus:ring-2 focus:ring-offset-0"
          maxLength={1000}
        />
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-right text-sm"
          role="alert"
        >
          {error}
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
