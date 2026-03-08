"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  submitPropertyInterest,
  getPropertyInterestErrorMessage,
  SubmitPropertyInterestPayload,
} from "@/lib/api/propertyRequests";

type PropertyInterestModalProps = {
  open: boolean;
  onClose: () => void;
  propertyId: number;
  tenantUsername: string;
  primaryColor?: string;
  submitButtonText?: string;
};

const PHONE_PATTERN = /^[0-9]{10,15}$/;

export function PropertyInterestModal({
  open,
  onClose,
  propertyId,
  tenantUsername,
  primaryColor = "#8b5f46",
  submitButtonText = "إرسال الطلب",
}: PropertyInterestModalProps) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setForm({ full_name: "", phone: "", notes: "" });
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open]);

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
      const successMessage = res.message || res.message_en || "تم إرسال طلبك بنجاح. سيتم التواصل معك قريباً.";
      // Show success (could use toast; for now closing is enough; parent can show toast if needed)
      if (typeof window !== "undefined" && window.alert) {
        window.alert(successMessage);
      }
      onClose();
    } catch (err: any) {
      setError(getPropertyInterestErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="max-w-md sm:max-w-lg"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold">
            أنا مهتم بهذا العقار
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="property-interest-full_name"
              className="block text-sm font-medium mb-1 text-right"
            >
              الاسم الكامل *
            </label>
            <input
              ref={firstInputRef}
              id="property-interest-full_name"
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
              htmlFor="property-interest-phone"
              className="block text-sm font-medium mb-1 text-right"
            >
              رقم الجوال *
            </label>
            <input
              id="property-interest-phone"
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
              htmlFor="property-interest-notes"
              className="block text-sm font-medium mb-1 text-right"
            >
              ملاحظات (اختياري)
            </label>
            <textarea
              id="property-interest-notes"
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
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md border border-input hover:bg-muted transition-colors disabled:opacity-50"
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
      </DialogContent>
    </Dialog>
  );
}
