import { useState } from "react";
import { createReservation } from "../services/property.api";

export const useReservation = (tenantId: string | null, propertySlug: string | undefined) => {
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [reservationForm, setReservationForm] = useState({
    customerName: "",
    customerPhone: "",
    desiredDate: "",
    message: "",
  });

  const handleCreateReservation = async () => {
    if (!tenantId) {
      setReservationError("لم يتم العثور على معرف المستأجر");
      return;
    }

    if (!propertySlug) {
      setReservationError("لم يتم العثور على معرف العقار");
      return;
    }

    if (!reservationForm.customerName.trim()) {
      setReservationError("يرجى إدخال اسمك");
      return;
    }

    if (!reservationForm.customerPhone.trim()) {
      setReservationError("يرجى إدخال رقم الهاتف");
      return;
    }

    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(reservationForm.customerPhone.replace(/\s/g, ""))) {
      setReservationError("يرجى إدخال رقم هاتف صحيح (مثال: +966501234567)");
      return;
    }

    if (reservationForm.desiredDate) {
      const selectedDate = new Date(reservationForm.desiredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDateError("التاريخ المفضل يجب أن يكون تاريخ اليوم أو بعده");
        setReservationError("التاريخ المفضل يجب أن يكون تاريخ اليوم أو بعده");
        return;
      }
    }

    if (dateError) {
      setReservationError(dateError);
      return;
    }

    setReservationLoading(true);
    setReservationError(null);
    setReservationSuccess(false);

    try {
      const result = await createReservation(tenantId, propertySlug, {
        customerName: reservationForm.customerName,
        customerPhone: reservationForm.customerPhone,
        desiredDate: reservationForm.desiredDate || undefined,
        message: reservationForm.message || undefined,
      });

      if (result.success) {
        setReservationSuccess(true);
        setReservationForm({
          customerName: "",
          customerPhone: "",
          desiredDate: "",
          message: "",
        });
        setDateError(null);
        setTimeout(() => {
          setShowReservationForm(false);
          setReservationSuccess(false);
        }, 2000);
      } else {
        setReservationError(result.error || "حدث خطأ أثناء إرسال طلب الحجز");
        if (result.error?.includes("التاريخ")) {
          setDateError(result.error);
        }
      }
    } catch (err) {
      console.error("Error creating reservation:", err);
      setReservationError("حدث خطأ أثناء إرسال طلب الحجز. يرجى المحاولة مرة أخرى");
    } finally {
      setReservationLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setReservationForm({
      ...reservationForm,
      desiredDate: date,
    });

    if (date) {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDateError("التاريخ المفضل يجب أن يكون تاريخ اليوم أو بعده");
      } else {
        setDateError(null);
        setReservationError(null);
      }
    } else {
      setDateError(null);
    }
  };

  return {
    showReservationForm,
    setShowReservationForm,
    reservationLoading,
    reservationError,
    reservationSuccess,
    dateError,
    reservationForm,
    setReservationForm,
    handleCreateReservation,
    handleDateChange,
  };
};
