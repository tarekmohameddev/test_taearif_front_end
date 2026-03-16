"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import type { CustomerAction, UnifiedCustomer, Appointment } from "@/types/unified-customer";
import type { CreateAppointmentParams } from "@/lib/services/customers-hub-requests-api";
import { APPOINTMENT_TYPES } from "../constants";
import { DEFAULT_TIME } from "../constants";

export type ScheduleFormCustomer = UnifiedCustomer | (Partial<UnifiedCustomer> & { id?: string | number | null }) | null | undefined;

export interface UseScheduleFormParams {
  action: CustomerAction | null | undefined;
  customer: ScheduleFormCustomer;
  addAppointmentForRequest: (requestId: string, params: CreateAppointmentParams) => Promise<void>;
  addAppointment: (customerId: string, appointment: Appointment) => void;
  onRefetch?: () => Promise<void>;
}

const defaultAppointmentType: Appointment["type"] = "office_meeting";

export function useScheduleForm({
  action,
  customer,
  addAppointmentForRequest: addAppointmentForRequestFn,
  addAppointment,
  onRefetch,
}: UseScheduleFormParams) {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [aptType, setAptType] = useState<Appointment["type"]>(defaultAppointmentType);
  const [aptDate, setAptDate] = useState("");
  const [aptTime, setAptTime] = useState(DEFAULT_TIME);
  const [aptNotes, setAptNotes] = useState("");

  const resetSchedule = useCallback(() => {
    setShowScheduleForm(false);
    setAptType(defaultAppointmentType);
    setAptDate("");
    setAptTime(DEFAULT_TIME);
    setAptNotes("");
  }, []);

  const handleScheduleAppointment = useCallback(async () => {
    // إذا لم يتم إدخال أي تاريخ أو وقت، نطلب من المستخدم إدخال واحد منهما على الأقل
    if (!aptDate && !aptTime) {
      toast.error("الرجاء اختيار التاريخ أو الوقت (أو كلاهما)");
      return;
    }

    // إذا كان أحدهما فارغًا نجعل له قيمة افتراضية (التاريخ المحلي اليوم، وليس UTC)
    const now = new Date();
    const todayLocal =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const effectiveDate = aptDate || todayLocal;
    const effectiveTime = aptTime || DEFAULT_TIME;

    // بناء التاريخ المحلي بشكل صريح لتجنب التفسير الخاطئ حسب التوقيت
    const [y, m, d] = effectiveDate.split("-").map(Number);
    const [hh, mm] = effectiveTime.split(":").map(Number);
    const chosenLocal = new Date(y, m - 1, d, hh ?? 0, mm ?? 0, 0, 0);
    const datetime = chosenLocal.toISOString();

    if (chosenLocal.getTime() <= now.getTime()) {
      toast.error("التاريخ والوقت يجب أن يكون في المستقبل");
      return;
    }

    const toastId = toast.loading("جاري جدولة الإجراء...");
    try {
      const isRequest = action?.objectType === "property_request" || action?.objectType === "inquiry";
      if (isRequest && action?.id) {
        await addAppointmentForRequestFn(action.id, {
          type: aptType,
          datetime,
          duration: 30,
          notes: aptNotes.trim() || undefined,
          title: APPOINTMENT_TYPES.find((t) => t.value === aptType)?.label,
          priority: "medium" as const,
        });
        toast.success("تم جدولة الإجراء بنجاح", { id: toastId });
      } else if (customer) {
        const nowIso = new Date().toISOString();
        const appointment: Appointment = {
          id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          title: APPOINTMENT_TYPES.find((t) => t.value === aptType)?.label ?? "إجراء",
          type: aptType,
          date: datetime,
          time: aptTime,
          datetime,
          duration: 30,
          status: "scheduled",
          priority: "medium",
          notes: aptNotes.trim() || undefined,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        addAppointment(String(customer.id ?? ""), appointment);
        toast.success("تم جدولة الإجراء بنجاح", { id: toastId });
      } else {
        toast.error("لا يمكن جدولة الإجراء: بيانات غير صحيحة", { id: toastId });
        return;
      }
      if (onRefetch) await onRefetch();
      resetSchedule();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && (err.response as { data?: { message?: string } }).data?.message
          ? (err.response as { data: { message: string } }).data.message
          : err instanceof Error
            ? err.message
            : "حدث خطأ أثناء جدولة الإجراء";
      console.error("Error scheduling appointment:", err);
      toast.error(message, { id: toastId });
    }
  }, [action, customer, aptType, aptDate, aptTime, aptNotes, addAppointmentForRequestFn, addAppointment, onRefetch, resetSchedule]);

  return {
    showScheduleForm,
    setShowScheduleForm,
    aptType,
    setAptType,
    aptDate,
    setAptDate,
    aptTime,
    setAptTime,
    aptNotes,
    setAptNotes,
    handleScheduleAppointment,
    resetSchedule,
  };
}
