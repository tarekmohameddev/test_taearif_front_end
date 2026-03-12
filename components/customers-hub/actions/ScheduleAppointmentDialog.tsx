"use client";

import React, { useState } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogFooter,
  CustomDialogDescription,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Appointment } from "@/types/unified-customer";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Calendar } from "lucide-react";

const APPOINTMENT_TYPES: { value: Appointment["type"]; label: string }[] = [
  { value: "site_visit", label: "معاينة عقار" },
  { value: "office_meeting", label: "اجتماع مكتب" },
  { value: "phone_call", label: "مكالمة هاتفية" },
  { value: "video_call", label: "مكالمة فيديو" },
  { value: "contract_signing", label: "توقيع عقد" },
  { value: "other", label: "أخرى" },
];

interface ScheduleAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  customerName: string;
  onScheduled?: (customerId: string) => void;
}

export function ScheduleAppointmentDialog({
  open,
  onOpenChange,
  customerId,
  customerName,
  onScheduled,
}: ScheduleAppointmentDialogProps) {
  const addAppointment = useUnifiedCustomersStore(
    (state) => state.addAppointment,
  );
  const [type, setType] = useState<Appointment["type"]>("office_meeting");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setType("office_meeting");
    setDate(tomorrow.toISOString().slice(0, 10));
    setTime("10:00");
    setNotes("");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    setIsSubmitting(true);
    const now = new Date().toISOString();
    const datetime = new Date(`${date}T${time}`).toISOString();
    const appointment: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      title: APPOINTMENT_TYPES.find((t) => t.value === type)?.label ?? "موعد",
      type,
      date: datetime,
      time,
      datetime,
      duration: 30,
      location: undefined,
      status: "scheduled",
      priority: "medium",
      notes: notes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    addAppointment(customerId, appointment);
    setIsSubmitting(false);
    handleOpenChange(false);
    onScheduled?.(customerId);
  };

  // Set default date/time when opening
  React.useEffect(() => {
    if (open && !date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().slice(0, 10));
      setTime("10:00");
    }
  }, [open, date]);

  return (
    <CustomDialog open={open} onOpenChange={handleOpenChange} maxWidth="max-w-md">
      <CustomDialogContent className="dir-rtl">
        <CustomDialogClose onClose={() => handleOpenChange(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            جدولة موعد — {customerName}
          </CustomDialogTitle>
          <CustomDialogDescription>
            حدد تفاصيل الموعد للعميل. يمكنك مراجعته لاحقاً من صفحة العميل.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apt-type">نوع الموعد</Label>
            <Select value={type} onValueChange={(v) => setType(v as Appointment["type"])}>
              <SelectTrigger id="apt-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPOINTMENT_TYPES.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apt-date">التاريخ</Label>
              <Input
                id="apt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-time">الوقت</Label>
              <Input
                id="apt-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apt-notes">ملاحظات (اختياري)</Label>
            <Textarea
              id="apt-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تفاصيل إضافية"
              rows={4}
              className="resize-none"
            />
          </div>
          <CustomDialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "جدولة الموعد"}
            </Button>
          </CustomDialogFooter>
        </form>
      </CustomDialogContent>
    </CustomDialog>
  );
}
