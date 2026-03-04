"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Bell, Calendar, CheckCircle, ChevronDown, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { APPOINTMENT_TYPES } from "../constants";
import type { Appointment } from "@/types/unified-customer";

export interface RequestActionsCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onDismiss: () => void;
  onAssignClick: () => void;
  onSnoozeFormToggle: () => void;
  onScheduleFormToggle: () => void;
  /** Snooze form */
  showSnoozeForm: boolean;
  snoozeDate: string;
  snoozeTime: string;
  onSnoozeDateChange: (v: string) => void;
  onSnoozeTimeChange: (v: string) => void;
  onSnoozeSubmit: () => void;
  onSnoozeCancel: () => void;
  /** Schedule form */
  showScheduleForm: boolean;
  aptType: Appointment["type"];
  aptDate: string;
  aptTime: string;
  aptNotes: string;
  onAptTypeChange: (v: Appointment["type"]) => void;
  onAptDateChange: (v: string) => void;
  onAptTimeChange: (v: string) => void;
  onAptNotesChange: (v: string) => void;
  onScheduleSubmit: () => void;
  onScheduleCancel: () => void;
  /** Optional slot for dialog (e.g. Assign Employee Dialog) */
  children?: React.ReactNode;
}

export function RequestActionsCard({
  open,
  onOpenChange,
  onComplete,
  onDismiss,
  onAssignClick,
  onSnoozeFormToggle,
  onScheduleFormToggle,
  showSnoozeForm,
  snoozeDate,
  snoozeTime,
  onSnoozeDateChange,
  onSnoozeTimeChange,
  onSnoozeSubmit,
  onSnoozeCancel,
  showScheduleForm,
  aptType,
  aptDate,
  aptTime,
  aptNotes,
  onAptTypeChange,
  onAptDateChange,
  onAptTimeChange,
  onAptNotesChange,
  onScheduleSubmit,
  onScheduleCancel,
  children,
}: RequestActionsCardProps) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
            <CardTitle className="text-base">إجراءات</CardTitle>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-3">
            <Button
              className="w-full gap-2 bg-green-600 hover:bg-green-700"
              onClick={onComplete}
            >
              <CheckCircle className="h-4 w-4" />
              إتمام الطلب
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={onScheduleFormToggle}
            >
              <Calendar className="h-4 w-4" />
              جدولة إجراء
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={onSnoozeFormToggle}
            >
              <Bell className="h-4 w-4" />
              تأجيل
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={onAssignClick}
            >
              <UserPlus className="h-4 w-4" />
              تعيين موظف
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onDismiss}
            >
              <X className="h-4 w-4" />
              رفض الطلب
            </Button>

            {showSnoozeForm && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3 border">
                <Label className="text-sm font-medium">تأجيل حتى:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={snoozeDate}
                    onChange={(e) => onSnoozeDateChange(e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    type="time"
                    value={snoozeTime}
                    onChange={(e) => onSnoozeTimeChange(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={onSnoozeSubmit}
                    disabled={!snoozeDate}
                    className="flex-1"
                  >
                    تأكيد
                  </Button>
                  <Button size="sm" variant="ghost" onClick={onSnoozeCancel}>
                    إلغاء
                  </Button>
                </div>
              </div>
            )}

            {showScheduleForm && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3 border">
                <div className="space-y-2">
                  <Label className="text-sm">نوع الإجراء</Label>
                  <Select
                    value={aptType}
                    onValueChange={(v) => onAptTypeChange(v as Appointment["type"])}
                  >
                    <SelectTrigger className="h-9">
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
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-sm">التاريخ</Label>
                    <Input
                      type="date"
                      value={aptDate}
                      onChange={(e) => onAptDateChange(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">الوقت</Label>
                    <Input
                      type="time"
                      value={aptTime}
                      onChange={(e) => onAptTimeChange(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">ملاحظات</Label>
                  <Textarea
                    value={aptNotes}
                    onChange={(e) => onAptNotesChange(e.target.value)}
                    placeholder="ملاحظات اختيارية"
                    rows={2}
                    className="text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={onScheduleSubmit}
                    disabled={!aptDate || !aptTime}
                    className="flex-1"
                  >
                    جدولة
                  </Button>
                  <Button size="sm" variant="ghost" onClick={onScheduleCancel}>
                    إلغاء
                  </Button>
                </div>
              </div>
            )}

            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
