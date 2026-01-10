"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Eye,
  Edit,
  Phone,
  MessageSquare,
  Bell,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface ApiReminder {
  id: number;
  title: string;
  priority: number; // 0, 1, or 2
  priority_label: string; // "Low", "Medium", "High"
  priority_label_ar: string; // "منخفضة", "متوسطة", "عالية"
  datetime: string;
  status: "pending" | "completed" | "overdue" | "cancelled";
  status_label: string;
  status_label_ar: string;
  reminder_type?: {
    id: number;
    name: string;
    name_ar?: string;
    color: string;
    icon: string;
  };
  customer: {
    id: number;
    name: string;
  };
  is_overdue?: boolean;
  days_until_due?: number;
}

interface RemindersListProps {
  remindersData: ApiReminder[];
  searchTerm: string;
  filterStage: string;
  filterUrgency: string;
  onViewReminder: (reminder: ApiReminder) => void;
  onEditReminder: (reminder: ApiReminder) => void;
  onAddReminder: () => void;
  onCompleteReminder: (reminder: ApiReminder) => void;
}

export default function RemindersList({
  remindersData,
  searchTerm,
  filterStage,
  filterUrgency,
  onViewReminder,
  onEditReminder,
  onAddReminder,
  onCompleteReminder,
}: RemindersListProps) {
  const getStatusColor = (reminder: ApiReminder) => {
    // Check if overdue based on calculated field first
    if (reminder.is_overdue) {
      return "bg-red-500";
    }
    const status: "pending" | "completed" | "overdue" | "cancelled" = reminder.status || "pending";
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "overdue":
        return "bg-red-500";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getStatusIcon = (reminder: ApiReminder) => {
    // Check if overdue based on calculated field first
    if (reminder.is_overdue) {
      return <XCircle className="h-4 w-4" />;
    }
    const status: "pending" | "completed" | "overdue" | "cancelled" = reminder.status || "pending";
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "overdue":
        return <XCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priorityLabel: string) => {
    switch (priorityLabel) {
      case "High":
        return "border-red-500 text-red-700";
      case "Medium":
        return "border-yellow-500 text-yellow-700";
      case "Low":
        return "border-green-500 text-green-700";
      default:
        return "border-gray-500 text-gray-700";
    }
  };

  const getStatusLabel = (reminder: ApiReminder) => {
    // Use Arabic label from API if available
    if (reminder.status_label_ar) {
      return reminder.status_label_ar;
    }
    const status = reminder.status || "pending";
    switch (status) {
      case "pending":
        return "في الانتظار";
      case "completed":
        return "مكتمل";
      case "overdue":
        return "متأخر";
      case "cancelled":
        return "ملغي";
      default:
        return "في الانتظار";
    }
  };

  const getPriorityLabel = (reminder: ApiReminder) => {
    // Use Arabic label from API if available
    if (reminder.priority_label_ar) {
      return reminder.priority_label_ar;
    }
    // Fallback to hardcoded translations
    switch (reminder.priority_label) {
      case "High":
        return "عالية";
      case "Medium":
        return "متوسطة";
      case "Low":
        return "منخفضة";
      default:
        return "عادية";
    }
  };

  // Filter reminders based on search and filters
  const filteredReminders = remindersData.filter((reminder) => {
    const matchesSearch =
      searchTerm === "" ||
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());

    // For reminders, we can't filter by stage since they don't have stage info
    // But we can filter by priority
    const matchesUrgency =
      filterUrgency === "all" ||
      getPriorityLabel(reminder) === filterUrgency;

    return matchesSearch && matchesUrgency;
  });

  // Format datetime for Saudi Arabia
  const formatSaudiDateTime = (datetime: string) => {
    try {
      const date = new Date(datetime);

      const formattedDate = date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Riyadh",
      });

      const formattedTime = date.toLocaleTimeString("ar-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Riyadh",
      });

      return { formattedDate, formattedTime };
    } catch (error) {
      // Fallback parsing
      const parts = datetime.split("T");
      const datePart = parts[0] || "";
      const timePart = parts[1]?.split(".")[0] || "";
      return {
        formattedDate: datePart.split("-").reverse().join("/"),
        formattedTime: timePart,
      };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">إدارة التذكيرات</h3>
          <p className="text-sm text-muted-foreground">
            عرض وإدارة جميع تذكيرات العملاء
          </p>
        </div>
        <Button onClick={onAddReminder}>
          <Plus className="ml-2 h-4 w-4" />
          تذكير جديد
        </Button>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              لا توجد تذكيرات تطابق معايير البحث
            </p>
          </div>
        ) : (
          filteredReminders.map((reminder) => {
            const { formattedDate, formattedTime } = formatSaudiDateTime(
              reminder.datetime,
            );

            return (
              <Card
                key={reminder.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-1 h-16 rounded-full ${getStatusColor(reminder)}`}
                      />
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {reminder.customer?.name
                              ?.split(" ")
                              ?.slice(0, 2)
                              ?.map((n) => n[0])
                              ?.join("") || "عميل"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{reminder.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {reminder.reminder_type && (
                              <span 
                                className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                                style={{ 
                                  backgroundColor: `${reminder.reminder_type.color}20`,
                                  color: reminder.reminder_type.color 
                                }}
                              >
                                <Bell className="h-3 w-3" />
                                {reminder.reminder_type.name_ar || reminder.reminder_type.name}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {reminder.customer?.name || "عميل غير محدد"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formattedDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formattedTime}
                            </span>
                            {reminder.is_overdue && (
                              <span className="flex items-center gap-1 text-red-600 font-semibold">
                                <AlertCircle className="h-3 w-3" />
                                متأخر
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getPriorityColor(reminder.priority_label)}
                      >
                        {getPriorityLabel(reminder)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(reminder)}
                        {getStatusLabel(reminder)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewReminder(reminder)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditReminder(reminder)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onCompleteReminder(reminder)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}

        {remindersData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">لا توجد تذكيرات</h3>
            <p className="text-sm">لم يتم العثور على أي تذكيرات حالياً</p>
            <Button onClick={onAddReminder} className="mt-4">
              <Plus className="ml-2 h-4 w-4" />
              إضافة تذكير جديد
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
