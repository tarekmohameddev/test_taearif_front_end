"use client";

import React, { useState, useEffect } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
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
import { Bell, Calendar, Clock, AlertTriangle, Loader2 } from "lucide-react";
import useCrmStore from "@/context/store/crm";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

interface AddReminderDialogProps {
  onReminderAdded?: (reminder: any) => void;
}

interface ReminderType {
  id: number;
  name: string;
  name_ar?: string;
  color: string;
  icon: string;
}

export default function AddReminderDialog({
  onReminderAdded,
}: AddReminderDialogProps) {
  const {
    showAddReminderDialog,
    selectedCustomer,
    setShowAddReminderDialog,
    customers,
  } = useCrmStore();
  const { userData, IsLoading: authLoading } = useAuthStore();

  const [reminderData, setReminderData] = useState({
    customer_id: "",
    title: "",
    date: "",
    time: "",
  });
  const [reminderTypes, setReminderTypes] = useState<ReminderType[]>([]);
  const [selectedReminderTypeId, setSelectedReminderTypeId] = useState<string>("");
  const [loadingReminderTypes, setLoadingReminderTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reminder types from new API
  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    const fetchReminderTypes = async () => {
      try {
        setLoadingReminderTypes(true);
        const response = await axiosInstance.get(
          "/crm/reminder-types?per_page=100&is_active=true"
        );

        if (response.data.status === "success" && response.data.data?.reminder_types) {
          setReminderTypes(response.data.data.reminder_types);
        }
      } catch (err: any) {
        console.error("Error fetching reminder types:", err);
        setError(err.response?.data?.message_ar || "فشل في تحميل أنواع التذكيرات");
      } finally {
        setLoadingReminderTypes(false);
      }
    };

    if (showAddReminderDialog) {
      fetchReminderTypes();
    }
  }, [userData?.token, authLoading, showAddReminderDialog]);

  const handleClose = () => {
    setShowAddReminderDialog(false);
    setReminderData({
      customer_id: "",
      title: "",
      date: "",
      time: "",
    });
    setSelectedReminderTypeId("");
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

    // التحقق من وجود التوكن قبل إجراء الطلب
    if (authLoading || !userData?.token) {
      alert("Authentication required. Please login.");
      return;
    }

    // Validation
    const customerId = selectedCustomer
      ? selectedCustomer.customer_id
      : reminderData.customer_id;
    if (!customerId || !reminderData.date || !reminderData.time) {
      setError("جميع الحقول مطلوبة");
      return;
    }

    // Both title and reminder type are required
    if (!reminderData.title.trim()) {
      setError("يجب إدخال عنوان التذكير");
      return;
    }

    if (!selectedReminderTypeId) {
      setError("يجب اختيار نوع التذكير");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Combine date and time for API
      const datetime = `${reminderData.date} ${reminderData.time}:00`;

      // Build payload with new structure
      const payload = {
        customer_id: parseInt(customerId),
        reminder_type_id: parseInt(selectedReminderTypeId),
        title: reminderData.title.trim(),
        datetime: datetime,
        priority: 1, // Default to medium priority
      };

      const response = await axiosInstance.post("/crm/reminders", payload);

      if (response.data.status === "success") {
        // Response includes full reminder with reminder_type and customer objects
        const reminderResponse = response.data.data;
        const newReminder = {
          id: reminderResponse?.id || Date.now(),
          title: reminderResponse?.title || reminderData.title.trim(),
          priority: reminderResponse?.priority ?? 1,
          priority_label: reminderResponse?.priority_label || "Medium",
          priority_label_ar: reminderResponse?.priority_label_ar || "متوسطة",
          datetime: reminderResponse?.datetime || datetime,
          status: reminderResponse?.status || "pending",
          status_label: reminderResponse?.status_label || "Pending",
          status_label_ar: reminderResponse?.status_label_ar || "قيد الانتظار",
          customer: reminderResponse?.customer || (selectedCustomer
            ? {
                id: parseInt(String(selectedCustomer.customer_id || "")),
                name: selectedCustomer.name,
              }
            : (() => {
                const customerIdNum = parseInt(customerId);
                const foundCustomer = customers.find((c) => {
                  const cid = typeof c.customer_id === 'string' ? parseInt(c.customer_id) : c.customer_id;
                  return cid === customerIdNum;
                });
                return foundCustomer
                  ? {
                      id: customerIdNum,
                      name: foundCustomer.name,
                    }
                  : undefined;
              })()),
          reminder_type: reminderResponse?.reminder_type,
        };

        // Update the reminders list in the parent component
        if (onReminderAdded) {
          onReminderAdded(newReminder);
        }

        handleClose();
      } else {
        setError(response.data.message_ar || "فشل في إضافة التذكير");
      }
    } catch (error: any) {
      console.error("خطأ في إضافة التذكير:", error);
      const errorMessage = error.response?.data?.message_ar || error.response?.data?.message || "حدث خطأ أثناء إضافة التذكير";
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

  return (
    <CustomDialog
      open={showAddReminderDialog}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      maxWidth="max-w-md"
    >
      <CustomDialogContent className="p-3">
        <CustomDialogClose onClose={handleClose} />
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            إضافة تذكير جديد
          </CustomDialogTitle>
        </CustomDialogHeader>

        {selectedCustomer && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">العميل:</p>
            <p className="font-medium">{selectedCustomer.name}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!selectedCustomer && (
            <div className="space-y-2">
              <Label htmlFor="customer-select">العميل</Label>
              <Select
                value={reminderData.customer_id}
                onValueChange={(value) =>
                  handleInputChange("customer_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر العميل" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={String(customer.customer_id || "")}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
            <Label htmlFor="reminder-type">نوع التذكير</Label>
            {loadingReminderTypes ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="mr-2 text-sm text-muted-foreground">
                  جاري تحميل أنواع التذكيرات...
                </span>
              </div>
            ) : (
              <Select
                value={selectedReminderTypeId}
                onValueChange={(value) => {
                  setSelectedReminderTypeId(value);
                  setError(null);
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التذكير" />
                </SelectTrigger>
                <SelectContent>
                  {reminderTypes.length > 0 ? (
                    reminderTypes.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.name_ar || type.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      لا توجد أنواع متاحة
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
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
                !reminderData.date ||
                !reminderData.time ||
                !reminderData.title.trim() ||
                !selectedReminderTypeId
              }
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ التذكير"}
            </Button>
          </div>
        </form>
      </CustomDialogContent>
    </CustomDialog>
  );
}
