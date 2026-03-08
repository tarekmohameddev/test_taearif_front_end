"use client";

import { useState, useRef, useEffect } from "react";
import {
  submitPropertyInterest,
  getPropertyInterestErrorMessage,
  SubmitPropertyInterestPayload,
} from "@/lib/api/propertyRequests";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

type PropertyInterestCollapsibleProps = {
  propertyId: number;
  tenantUsername: string;
  primaryColor?: string;
  submitButtonText?: string;
};

const PHONE_PATTERN = /^[0-9]{10,15}$/;

export function PropertyInterestCollapsible({
  propertyId,
  tenantUsername,
  primaryColor = "#8b5f46",
  submitButtonText = "إرسال الطلب",
}: PropertyInterestCollapsibleProps) {
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) {
      setError(null);
      setSuccess(false);
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [expanded]);

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
      setSuccess(true);
      setForm({ full_name: "", phone: "", notes: "" });
      // Collapse after short delay so user sees success message
      setTimeout(() => setExpanded(false), 2000);
    } catch (err: any) {
      setError(getPropertyInterestErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setExpanded((prev) => !prev);
    if (!expanded) setError(null);
  };

  return (
    <section
      className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm"
      data-purpose="property-interest-collapsible"
      dir="rtl"
    >
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-3 font-bold py-3 px-6 text-lg text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: primaryColor }}
        aria-expanded={expanded}
      >
        <span>أنا مهتم بهذا العقار</span>
        {expanded ? (
          <ChevronUpIcon className="w-5 h-5 flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="p-4 md:p-6 border-t border-gray-200">
          {success ? (
            <p className="text-center py-4 text-green-700 font-medium">
              تم إرسال طلبك بنجاح. سيتم التواصل معك قريباً.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="property-interest-collapse-full_name"
                  className="block text-sm font-medium mb-1 text-right"
                >
                  الاسم الكامل *
                </label>
                <input
                  ref={firstInputRef}
                  id="property-interest-collapse-full_name"
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
                  htmlFor="property-interest-collapse-phone"
                  className="block text-sm font-medium mb-1 text-right"
                >
                  رقم الجوال *
                </label>
                <input
                  id="property-interest-collapse-phone"
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
                  htmlFor="property-interest-collapse-notes"
                  className="block text-sm font-medium mb-1 text-right"
                >
                  ملاحظات (اختياري)
                </label>
                <textarea
                  id="property-interest-collapse-notes"
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
                  type="button"
                  onClick={() => setExpanded(false)}
                  disabled={loading}
                  className="px-4 py-2 rounded-md border border-input hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
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
          )}
        </div>
      )}
    </section>
  );
}
