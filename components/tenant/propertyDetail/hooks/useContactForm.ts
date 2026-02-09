import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import type { Property } from "../types/types";

export const useContactForm = (
  tenantId: string | null,
  property: Property | null,
) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      if (!tenantId) {
        setFormError("لم يتم العثور على معرف المستأجر");
        return;
      }

      if (!property?.slug) {
        setFormError("لم يتم العثور على معرف العقار");
        return;
      }

      // Validation
      if (!formData.name.trim()) {
        setFormError("يرجى إدخال اسمك");
        return;
      }

      if (!formData.phone.trim()) {
        setFormError("يرجى إدخال رقم الهاتف");
        return;
      }

      // Validate phone format
      const phoneRegex = /^\+?\d{7,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        setFormError("يرجى إدخال رقم هاتف صحيح (مثال: +966501234567)");
        return;
      }

      const payload: any = {
        propertySlug: property.slug,
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
      };

      if (formData.email.trim()) {
        payload.customerEmail = formData.email.trim();
      }
      if (formData.message.trim()) {
        payload.message = formData.message.trim();
      }

      const response = await axiosInstance.post(
        `/api/v1/tenant-website/${tenantId}/reservations`,
        payload,
      );

      if (response.data.success) {
        setFormSuccess(true);
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
        });
        // Hide success message after 3 seconds
        setTimeout(() => {
          setFormSuccess(false);
        }, 3000);
      }
    } catch (err: any) {
      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessage =
          errors.customerName?.[0] ||
          errors.customerPhone?.[0] ||
          errors.message?.[0] ||
          err.response?.data?.message ||
          "حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى";
        setFormError(errorMessage);
      } else {
        setFormError(
          err.response?.data?.message ||
            "حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى",
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  return {
    formData,
    formLoading,
    formError,
    formSuccess,
    handleChange,
    handleSubmit,
  };
};
