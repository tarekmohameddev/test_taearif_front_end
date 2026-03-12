"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UnifiedCustomer, Reminder } from "@/types/unified-customer";
import { 
  Bell, Plus, CheckCircle, Clock, AlertCircle, 
  XCircle, Edit, Trash2, Calendar, Phone,
  Building, MapPin, Users, MessageSquare,
  Target, FileText, Home
} from "lucide-react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RemindersTabProps {
  customer: UnifiedCustomer;
}

interface ReminderType {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  icon: any;
}

const reminderTypes: ReminderType[] = [
  { id: "follow_up", name: "Follow Up", nameAr: "متابعة", color: "#3b82f6", icon: Phone },
  { id: "document", name: "Document", nameAr: "مستند", color: "#8b5cf6", icon: FileText },
  { id: "payment", name: "Payment", nameAr: "دفعة", color: "#10b981", icon: Target },
  { id: "viewing", name: "Viewing", nameAr: "معاينة", color: "#f59e0b", icon: Home },
  { id: "general", name: "General", nameAr: "عام", color: "#6b7280", icon: Bell },
];

export function RemindersTab({ customer }: RemindersTabProps) {
  const updateReminder = useUnifiedCustomersStore(
    (state) => state.updateReminder,
  );
  const removeReminder = useUnifiedCustomersStore(
    (state) => state.removeReminder,
  );
  const [filter, setFilter] = useState<"all" | "pending" | "overdue" | "completed">("all");

  const getReminderType = (type: string): ReminderType => {
    return reminderTypes.find(t => t.id === type) || reminderTypes[4];
  };

  const getStatusBadge = (reminder: Reminder) => {
    // Check if overdue
    const isOverdue = reminder.isOverdue || (
      reminder.status === "pending" && 
      new Date(reminder.datetime) < new Date()
    );

    if (isOverdue) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          متأخر
        </Badge>
      );
    }

    const config = {
      pending: { variant: "secondary" as any, label: "قيد الانتظار", icon: Clock, color: "text-yellow-600" },
      completed: { variant: "default" as any, label: "مكتمل", icon: CheckCircle, color: "text-green-600" },
      overdue: { variant: "destructive" as any, label: "متأخر", icon: AlertCircle, color: "text-red-600" },
      cancelled: { variant: "outline" as any, label: "ملغي", icon: XCircle, color: "text-gray-600" },
    };

    const { variant, label, icon: Icon, color } = config[reminder.status];
    return (
      <Badge variant={variant} className={`gap-1 ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      urgent: { variant: "destructive" as any, label: "عاجل 🚨", color: "border-red-500 text-red-700" },
      high: { variant: "default" as any, label: "عالي 🔥", color: "border-orange-500 text-orange-700" },
      medium: { variant: "secondary" as any, label: "متوسط ⭐", color: "border-yellow-500 text-yellow-700" },
      low: { variant: "outline" as any, label: "منخفض", color: "border-green-500 text-green-700" },
    };
    const { variant, label, color } = config[priority as keyof typeof config] || config.medium;
    return <Badge variant={variant} className={color}>{label}</Badge>;
  };

  const formatSaudiDateTime = (datetime: string) => {
    try {
      const date = new Date(datetime);
      const formattedDate = date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
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
      const parts = datetime.split("T");
      const datePart = parts[0] || "";
      const timePart = parts[1]?.split(".")[0] || "";
      return {
        formattedDate: datePart.split("-").reverse().join("/"),
        formattedTime: timePart,
      };
    }
  };

  const getDaysUntilDue = (datetime: string): { days: number; label: string } => {
    const now = new Date();
    const dueDate = new Date(datetime);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { days: Math.abs(diffDays), label: `متأخر ${Math.abs(diffDays)} يوم` };
    } else if (diffDays === 0) {
      return { days: 0, label: "اليوم" };
    } else if (diffDays === 1) {
      return { days: 1, label: "غداً" };
    } else {
      return { days: diffDays, label: `بعد ${diffDays} يوم` };
    }
  };

  const handleCompleteReminder = (reminder: Reminder) => {
    updateReminder(customer.id, reminder.id, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });
  };

  const handleCancelReminder = (reminder: Reminder) => {
    updateReminder(customer.id, reminder.id, {
      status: "cancelled",
    });
  };

  // Filter reminders
  const filteredReminders = customer.reminders.filter(reminder => {
    if (filter === "all") return true;
    if (filter === "overdue") {
      return reminder.isOverdue || (
        reminder.status === "pending" && 
        new Date(reminder.datetime) < new Date()
      );
    }
    return reminder.status === filter;
  });

  // Sort by date (upcoming first)
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });

  const overdueCount = customer.reminders.filter(r => 
    r.isOverdue || (r.status === "pending" && new Date(r.datetime) < new Date())
  ).length;
  const pendingCount = customer.reminders.filter(r => r.status === "pending").length;
  const completedCount = customer.reminders.filter(r => r.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">التذكيرات</h3>
          <p className="text-sm text-gray-500">
            {customer.reminders.length} تذكير إجمالاً
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          تذكير جديد
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={filter === "all" ? "border-2 border-blue-500" : ""}>
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full h-auto p-0 hover:bg-transparent"
              onClick={() => setFilter("all")}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">الكل</span>
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">{customer.reminders.length}</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        <Card className={filter === "overdue" ? "border-2 border-red-500" : ""}>
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full h-auto p-0 hover:bg-transparent"
              onClick={() => setFilter("overdue")}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">متأخر</span>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        <Card className={filter === "pending" ? "border-2 border-yellow-500" : ""}>
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full h-auto p-0 hover:bg-transparent"
              onClick={() => setFilter("pending")}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">قيد الانتظار</span>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        <Card className={filter === "completed" ? "border-2 border-green-500" : ""}>
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full h-auto p-0 hover:bg-transparent"
              onClick={() => setFilter("completed")}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">مكتمل</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {sortedReminders.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              لا توجد تذكيرات
            </h3>
            <p className="text-gray-500 mb-4">
              {filter !== "all" 
                ? `لا توجد تذكيرات ${filter === "overdue" ? "متأخرة" : filter === "pending" ? "قيد الانتظار" : "مكتملة"}`
                : "ابدأ بإضافة تذكير لهذا العميل"}
            </p>
            {filter !== "all" && (
              <Button variant="outline" onClick={() => setFilter("all")}>
                عرض جميع التذكيرات
              </Button>
            )}
          </Card>
        ) : (
          sortedReminders.map((reminder) => {
            const reminderType = getReminderType(reminder.type);
            const { formattedDate, formattedTime } = formatSaudiDateTime(reminder.datetime);
            const { days, label: daysLabel } = getDaysUntilDue(reminder.datetime);
            const TypeIcon = reminderType.icon;
            const isOverdue = reminder.isOverdue || (
              reminder.status === "pending" && 
              new Date(reminder.datetime) < new Date()
            );

            return (
              <Card 
                key={reminder.id}
                className={`hover:shadow-md transition-shadow ${
                  isOverdue ? "border-l-4 border-l-red-500" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div 
                        className={`w-1 h-20 rounded-full`}
                        style={{ backgroundColor: isOverdue ? "#ef4444" : reminderType.color }}
                      />
                      
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback style={{ backgroundColor: reminderType.color + "20" }}>
                            <TypeIcon className="h-5 w-5" style={{ color: reminderType.color }} />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h4 className="font-semibold">{reminder.title}</h4>
                          {reminder.titleEn && (
                            <p className="text-sm text-gray-500">{reminder.titleEn}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1.5 px-2.5 py-1 border-2"
                              style={{ 
                                borderColor: reminderType.color,
                                backgroundColor: `${reminderType.color}15`,
                                color: reminderType.color 
                              }}
                            >
                              <TypeIcon className="h-3.5 w-3.5" />
                              <span className="font-medium">{reminderType.nameAr}</span>
                            </Badge>

                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formattedDate}
                            </span>

                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formattedTime}
                            </span>

                            {isOverdue ? (
                              <span className="flex items-center gap-1 text-red-600 font-semibold">
                                <AlertCircle className="h-3 w-3" />
                                {daysLabel}
                              </span>
                            ) : reminder.status === "pending" && (
                              <span className={`flex items-center gap-1 ${
                                days === 0 ? "text-red-600 font-bold" :
                                days === 1 ? "text-orange-600 font-semibold" :
                                days <= 3 ? "text-yellow-600" : "text-gray-600"
                              }`}>
                                <Clock className="h-3 w-3" />
                                {daysLabel}
                              </span>
                            )}
                          </div>

                          {reminder.description && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              {reminder.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getPriorityBadge(reminder.priority)}
                      {getStatusBadge(reminder)}
                    </div>
                  </div>

                  {/* Actions */}
                  {reminder.status === "pending" && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleCompleteReminder(reminder)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-3 w-3 ml-1" />
                        إكمال
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 ml-1" />
                        تعديل
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleCancelReminder(reminder)}
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {reminder.status === "completed" && reminder.completedAt && (
                    <div className="text-xs text-green-600 mt-2 pt-2 border-t">
                      ✓ تم الإكمال في {formatSaudiDateTime(reminder.completedAt).formattedDate}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Add Reminder Types */}
      <Card className="bg-blue-50 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="text-base">إضافة تذكير سريع</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {reminderTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                variant="outline"
                className="flex-col h-auto py-3"
                style={{ borderColor: type.color + "40" }}
              >
                <Icon className="h-5 w-5 mb-1" style={{ color: type.color }} />
                <span className="text-xs">{type.nameAr}</span>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
