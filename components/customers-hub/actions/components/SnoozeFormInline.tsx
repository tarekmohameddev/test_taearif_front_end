"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SnoozeFormInlineProps {
  snoozeDate: string;
  snoozeTime: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled: boolean;
}

export function SnoozeFormInline({
  snoozeDate,
  snoozeTime,
  onDateChange,
  onTimeChange,
  onConfirm,
  onCancel,
  confirmDisabled,
}: SnoozeFormInlineProps) {
  return (
    <div
      className="mt-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3"
      onClick={(e) => e.stopPropagation()}
      data-interactive="true"
    >
      <Label className="text-sm font-medium">تأجيل حتى:</Label>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="date"
          value={snoozeDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="text-sm h-9"
        />
        <Input
          type="time"
          value={snoozeTime}
          onChange={(e) => onTimeChange(e.target.value)}
          className="text-sm h-9"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onConfirm} disabled={confirmDisabled} className="flex-1">
          تأكيد
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
