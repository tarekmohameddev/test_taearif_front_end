"use client";

import React, { useState, useCallback, useEffect } from "react";
import type { CustomerAction } from "@/types/unified-customer";
import type { Appointment } from "@/types/unified-customer";
import { APPOINTMENT_TYPES } from "../constants/incomingCardConstants";
import toast from "react-hot-toast";

function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

interface UseScheduleFormArgs {
  action: CustomerAction;
  addAppointment: (customerId: string, appointment: Appointment) => void;
  addAppointmentForRequest: (requestId: string, params: {
    type: Appointment["type"];
    datetime: string;
    duration: number;
    notes?: string;
    title?: string;
    priority: "medium";
  }) => Promise<void>;
  showScheduleForm: boolean;
  setShowScheduleForm: (v: boolean) => void;
}

export function useScheduleForm({
  action,
  addAppointment,
  addAppointmentForRequest,
  showScheduleForm,
  setShowScheduleForm,
}: UseScheduleFormArgs) {
  const [aptType, setAptType] = useState<Appointment["type"]>("office_meeting");
  const [aptDate, setAptDate] = useState("");
  const [aptTime, setAptTime] = useState("10:00");
  const [aptNotes, setAptNotes] = useState("");
  const [isSubmittingApt, setIsSubmittingApt] = useState(false);

  useEffect(() => {
    if (showScheduleForm && !aptDate) {
      setAptDate(getTomorrowDateString());
      setAptTime("10:00");
    }
  }, [showScheduleForm, aptDate]);

  const resetScheduleForm = useCallback(() => {
    setAptType("office_meeting");
    setAptDate(getTomorrowDateString());
    setAptTime("10:00");
    setAptNotes("");
  }, []);

  const handleScheduleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!aptDate || !aptTime) return;
      const datetime = new Date(`${aptDate}T${aptTime}`).toISOString();
      if (new Date(datetime) <= new Date()) {
        toast.error("التاريخ والوقت يجب أن يكون في المستقبل");
        return;
      }
      setIsSubmittingApt(true);
      try {
        if (
          (action.objectType === "property_request" || action.objectType === "inquiry") &&
          action.id
        ) {
          await addAppointmentForRequest(action.id, {
            type: aptType,
            datetime,
            duration: 30,
            notes: aptNotes.trim() || undefined,
            title: APPOINTMENT_TYPES.find((t) => t.value === aptType)?.label,
            priority: "medium",
          });
          toast.success("تم جدولة الموعد بنجاح");
        } else if (action.customerId) {
          const now = new Date().toISOString();
          const appointment: Appointment = {
            id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            title: APPOINTMENT_TYPES.find((t) => t.value === aptType)?.label ?? "موعد",
            type: aptType,
            date: datetime,
            time: aptTime,
            datetime,
            duration: 30,
            location: undefined,
            status: "scheduled",
            priority: "medium",
            notes: aptNotes.trim() || undefined,
            createdAt: now,
            updatedAt: now,
          };
          addAppointment(String(action.customerId), appointment);
          toast.success("تم جدولة الموعد بنجاح");
        } else {
          toast.error("لا يمكن جدولة الموعد: بيانات غير صحيحة");
        }
        setShowScheduleForm(false);
        resetScheduleForm();
      } catch (err: unknown) {
        console.error("Error scheduling appointment:", err);
        toast.error((err as { message?: string })?.message ?? "حدث خطأ أثناء جدولة الموعد");
      } finally {
        setIsSubmittingApt(false);
      }
    },
    [
      aptDate,
      aptTime,
      aptType,
      aptNotes,
      action,
      addAppointment,
      addAppointmentForRequest,
      setShowScheduleForm,
      resetScheduleForm,
    ]
  );

  return {
    aptType,
    setAptType,
    aptDate,
    setAptDate,
    aptTime,
    setAptTime,
    aptNotes,
    setAptNotes,
    isSubmittingApt,
    handleScheduleSubmit,
    resetScheduleForm,
  };
}
