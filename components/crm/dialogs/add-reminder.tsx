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

// دالة ترجمة أنواع التذكيرات من الإنجليزية إلى العربية
const translateReminderType = (type: string): string => {
  const translations: { [key: string]: string } = {
    "Send Final Proposal": "إرسال العرض النهائي",
    "Follow up call": "مكالمة متابعة",
    "Meeting with Client": "اجتماع مع العميل",
    "Review contract": "مراجعة العقد",
    "Send proposal": "إرسال عرض",
  };

  return translations[type] || type;
};

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
    date: "",
    time: "",
  });
  const [reminderTypes, setReminderTypes] = useState<string[]>([]);
  const [selectedReminderType, setSelectedReminderType] = useState<string>("");
  const [loadingReminderTypes, setLoadingReminderTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reminder types from filter-options API
  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    const fetchReminderTypes = async () => {
      try {
        setLoadingReminderTypes(true);
        const response = await axiosInstance.get(
          "/crm/customer-reminders/filter-options"
        );

        if (response.data.status === "success" && response.data.data?.titles) {
          setReminderTypes(response.data.data.titles);
        }
      } catch (err: any) {
        console.error("Error fetching reminder types:", err);
        // Don't show error to user, just log it
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
      date: "",
      time: "",
    });
    setSelectedReminderType("");
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
    if (!customerId || !reminderData.date || !reminderData.time || !selectedReminderType) {
      setError("جميع الحقول مطلوبة");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Combine date and time for API
      const datetime = `${reminderData.date} ${reminderData.time}:00`;

      // Build payload with selected reminder type
      const payload: any = {
        customer_id: parseInt(customerId),
        datetime: datetime,
        title: selectedReminderType || "",
      };

      const response = await axiosInstance.post("/crm/customer-reminders", payload);

      if (response.data.status === "success") {
        // Add the new reminder to the store
        const newReminder = {
          id: response.data.data?.id || Date.now(),
          title: response.data.data?.title || selectedReminderType || "",
          priority: response.data.data?.priority || null,
          priority_label: response.data.data?.priority_label || "Not Set",
          datetime: datetime,
          customer: selectedCustomer
            ? {
                id: parseInt(String(selectedCustomer.customer_id || "")),
                name: selectedCustomer.name,
              }
            : customers.find((c) => c.customer_id === reminderData.customer_id)
              ? {
                  id: parseInt(reminderData.customer_id),
                  name: customers.find(
                    (c) => c.customer_id === reminderData.customer_id,
                  )!.name,
                }
              : undefined,
        };

        // Update the reminders list in the parent component
        if (onReminderAdded) {
          onReminderAdded(newReminder);
        }

        handleClose();
      } else {
        setError("فشل في إضافة التذكير");
      }
    } catch (error: any) {
      console.error("خطأ في إضافة التذكير:", error);
      setError(error.response?.data?.message || "حدث خطأ أثناء إضافة التذكير");
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
                value={selectedReminderType}
                onValueChange={(value) => {
                  setSelectedReminderType(value);
                  setError(null);
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التذكير" />
                </SelectTrigger>
                <SelectContent>
                  {reminderTypes.length > 0 ? (
                    reminderTypes.map((type, index) => (
                      <SelectItem key={index} value={type}>
                        {translateReminderType(type)}
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
                !selectedReminderType
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
