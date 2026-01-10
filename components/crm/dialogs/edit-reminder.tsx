"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, AlertTriangle, Edit, Bell } from "lucide-react";
import useCrmStore from "@/context/store/crm";
import axiosInstance from "@/lib/axiosInstance";

interface EditReminderDialogProps {
  onReminderUpdated?: (reminder: any) => void;
}

export default function EditReminderDialog({
  onReminderUpdated,
}: EditReminderDialogProps) {
  const {
    showEditReminderDialog,
    selectedReminder,
    setShowEditReminderDialog,
    setSelectedReminder,
  } = useCrmStore();

  const [reminderData, setReminderData] = useState({
    title: "",
    priority: "2", // 1=low, 2=medium, 3=high
    date: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form when reminder is selected
  useEffect(() => {
    if (selectedReminder) {
      // Parse datetime if it exists
      let date = "";
      let time = "";
      if (selectedReminder.datetime) {
        const dateObj = new Date(selectedReminder.datetime);
        date = dateObj.toISOString().split("T")[0];
        time = dateObj.toTimeString().split(" ")[0].substring(0, 5);
      }

      setReminderData({
        title: selectedReminder.title || "",
        priority: selectedReminder.priority?.toString() || "2",
        date: date,
        time: time,
      });
    }
  }, [selectedReminder]);

  const handleClose = () => {
    setShowEditReminderDialog(false);
    setTimeout(() => setSelectedReminder(null), 150);
    setReminderData({
      title: "",
      priority: "2",
      date: "",
      time: "",
    });
    setError(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setReminderData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedReminder ||
      !reminderData.title.trim() ||
      !reminderData.date ||
      !reminderData.time
    ) {
      setError("جميع الحقول مطلوبة");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Combine date and time for API
      const datetime = `${reminderData.date} ${reminderData.time}:00`;

      // Map priority: 1=Low (0), 2=Medium (1), 3=High (2) to new system 0,1,2
      const priorityMap: { [key: string]: number } = {
        "1": 0, // Low
        "2": 1, // Medium
        "3": 2, // High
      };
      const mappedPriority = priorityMap[reminderData.priority] ?? 1;

      const response = await axiosInstance.put(
        `/crm/reminders/${selectedReminder.id}`,
        {
          title: reminderData.title.trim(),
          priority: mappedPriority,
          datetime: datetime,
        },
      );

      if (response.data.status === "success") {
        // Response includes full reminder with reminder_type and customer objects
        const reminderResponse = response.data.data;
        const updatedReminder = {
          ...selectedReminder,
          title: reminderResponse?.title || reminderData.title.trim(),
          priority: reminderResponse?.priority ?? mappedPriority,
          priority_label: reminderResponse?.priority_label || (mappedPriority === 2 ? "High" : mappedPriority === 1 ? "Medium" : "Low"),
          priority_label_ar: reminderResponse?.priority_label_ar || (mappedPriority === 2 ? "عالية" : mappedPriority === 1 ? "متوسطة" : "منخفضة"),
          datetime: reminderResponse?.datetime || datetime,
          status: reminderResponse?.status || selectedReminder.status || "pending",
          status_label: reminderResponse?.status_label,
          status_label_ar: reminderResponse?.status_label_ar,
          customer: reminderResponse?.customer || selectedReminder.customer,
          reminder_type: reminderResponse?.reminder_type,
        };

        // Update the reminders list in the parent component
        if (onReminderUpdated) {
          onReminderUpdated(updatedReminder);
        }

        handleClose();
      } else {
        setError(response.data.message_ar || "فشل في تحديث التذكير");
      }
    } catch (error: any) {
      console.error("خطأ في تحديث التذكير:", error);
      const errorMessage = error.response?.data?.message_ar || error.response?.data?.message || "حدث خطأ أثناء تحديث التذكير";
      setError(errorMessage);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          setError(firstError[0]);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedReminder) return null;

  return (
    <Dialog open={showEditReminderDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            تعديل التذكير
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">التذكير الحالي:</p>
          <p className="font-medium">{selectedReminder.title}</p>
          {selectedReminder.customer && (
            <p className="text-sm text-muted-foreground">
              العميل: {selectedReminder.customer.name}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-title">عنوان التذكير</Label>
            <Input
              id="reminder-title"
              placeholder="مثال: متابعة العميل"
              value={reminderData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-priority">الأولوية</Label>
            <Select
              value={reminderData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">منخفضة</SelectItem>
                <SelectItem value="2">متوسطة</SelectItem>
                <SelectItem value="3">عالية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="reminder-date"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                التاريخ
              </Label>
              <Input
                id="reminder-date"
                type="date"
                value={reminderData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="reminder-time"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                الوقت
              </Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !reminderData.title.trim() ||
                !reminderData.date ||
                !reminderData.time
              }
            >
              {isSubmitting ? "جاري التحديث..." : "تحديث التذكير"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
