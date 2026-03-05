"use client";

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
import { APPOINTMENT_TYPES } from "../constants/incomingCardConstants";
import type { Appointment } from "@/types/unified-customer";

interface ScheduleAppointmentFormProps {
  aptType: Appointment["type"];
  aptDate: string;
  aptTime: string;
  aptNotes: string;
  onAptTypeChange: (v: Appointment["type"]) => void;
  onAptDateChange: (v: string) => void;
  onAptTimeChange: (v: string) => void;
  onAptNotesChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  /** When true, use smaller labels/inputs (e.g. in dialog) */
  compact?: boolean;
}

export function ScheduleAppointmentForm({
  aptType,
  aptDate,
  aptTime,
  aptNotes,
  onAptTypeChange,
  onAptDateChange,
  onAptTimeChange,
  onAptNotesChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = "جدولة الموعد",
  compact = false,
}: ScheduleAppointmentFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "space-y-4 pt-2" : "space-y-3"}
    >
      <div className="space-y-2">
        <Label htmlFor="apt-type" className="text-sm">
          نوع الموعد
        </Label>
        <Select value={aptType} onValueChange={(v) => onAptTypeChange(v as Appointment["type"])}>
          <SelectTrigger id="apt-type" className="h-9">
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
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="apt-date" className="text-sm">
            التاريخ
          </Label>
          <Input
            id="apt-date"
            type="date"
            value={aptDate}
            onChange={(e) => onAptDateChange(e.target.value)}
            required={!compact}
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apt-time" className="text-sm">
            الوقت
          </Label>
          <Input
            id="apt-time"
            type="time"
            value={aptTime}
            onChange={(e) => onAptTimeChange(e.target.value)}
            required={!compact}
            className="h-9"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="apt-notes" className="text-sm">
          ملاحظات (اختياري)
        </Label>
        <Textarea
          id="apt-notes"
          value={aptNotes}
          onChange={(e) => onAptNotesChange(e.target.value)}
          placeholder="تفاصيل إضافية"
          rows={compact ? 2 : 3}
          className="resize-none text-sm"
        />
      </div>
      <div className={compact ? "flex justify-end gap-2 pt-2 border-t" : "flex items-center gap-2"}>
        <Button type="button" variant="outline" size={compact ? "default" : "sm"} className={compact ? "" : "h-8"} onClick={onCancel}>
          إلغاء
        </Button>
        <Button
          type="submit"
          size={compact ? "default" : "sm"}
          className={compact ? "" : "h-8"}
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الحفظ..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
