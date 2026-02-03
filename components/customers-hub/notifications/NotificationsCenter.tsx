"use client";

import React, { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  CheckCircle,
  Calendar,
  AlertTriangle,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Clock,
  X,
} from "lucide-react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Notification {
  id: string;
  type: "reminder" | "appointment" | "payment" | "stage_change" | "message" | "alert";
  title: string;
  message: string;
  customerId?: string;
  customerName?: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
}

export function NotificationsCenter() {
  const { customers } = useUnifiedCustomersStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  // Generate notifications from customer data
  const generatedNotifications = useMemo(() => {
    const notifs: Notification[] = [];

    customers.forEach((customer) => {
      // Overdue reminders
      customer.reminders
        .filter((r) => r.status === "overdue")
        .forEach((reminder) => {
          notifs.push({
            id: `reminder_${reminder.id}`,
            type: "reminder",
            title: "تذكير متأخر",
            message: `${customer.name} - ${reminder.title}`,
            customerId: customer.id,
            customerName: customer.name,
            timestamp: reminder.datetime,
            read: false,
            priority: reminder.priority,
            actionUrl: `/ar/dashboard/customers-hub/${customer.id}?tab=reminders`,
          });
        });

      // Upcoming appointments (within 24 hours)
      customer.appointments
        .filter((a) => {
          if (a.status !== "scheduled" && a.status !== "confirmed") return false;
          const appointmentTime = new Date(a.datetime || a.date);
          const now = new Date();
          const diff = appointmentTime.getTime() - now.getTime();
          return diff > 0 && diff < 24 * 60 * 60 * 1000; // Within 24 hours
        })
        .forEach((appointment) => {
          notifs.push({
            id: `appointment_${appointment.id}`,
            type: "appointment",
            title: "موعد قادم",
            message: `${customer.name} - ${appointment.title} في ${new Date(
              appointment.datetime || appointment.date
            ).toLocaleString("ar-SA")}`,
            customerId: customer.id,
            customerName: customer.name,
            timestamp: appointment.datetime || appointment.date,
            read: false,
            priority: appointment.priority,
            actionUrl: `/ar/dashboard/customers-hub/${customer.id}?tab=appointments`,
          });
        });

      // Overdue payments
      if (customer.ksaCompliance?.paymentSchedule) {
        customer.ksaCompliance.paymentSchedule
          .filter((p) => p.status === "overdue")
          .forEach((payment) => {
            notifs.push({
              id: `payment_${payment.id}`,
              type: "payment",
              title: "دفعة متأخرة",
              message: `${customer.name} - ${payment.description} (${payment.amount.toLocaleString()} ريال)`,
              customerId: customer.id,
              customerName: customer.name,
              timestamp: payment.dueDate,
              read: false,
              priority: "high",
              actionUrl: `/ar/dashboard/customers-hub/${customer.id}?tab=financial`,
            });
          });
      }

      // High churn risk
      if (customer.aiInsights.churnRisk === "high") {
        notifs.push({
          id: `churn_${customer.id}`,
          type: "alert",
          title: "تحذير: خطر فقدان عميل",
          message: `${customer.name} - خطر فقدان عالي، يحتاج متابعة فورية`,
          customerId: customer.id,
          customerName: customer.name,
          timestamp: new Date().toISOString(),
          read: false,
          priority: "urgent",
          actionUrl: `/ar/dashboard/customers-hub/${customer.id}`,
        });
      }

      // Follow-up needed (no contact in 7 days for active customers)
      if (
        customer.lastContactAt &&
        customer.stage !== "closing" &&
        customer.stage !== "post_sale"
      ) {
        const daysSinceContact =
          (Date.now() - new Date(customer.lastContactAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceContact > 7) {
          notifs.push({
            id: `followup_${customer.id}`,
            type: "message",
            title: "يحتاج متابعة",
            message: `${customer.name} - لم يتم التواصل منذ ${Math.floor(daysSinceContact)} يوم`,
            customerId: customer.id,
            customerName: customer.name,
            timestamp: customer.lastContactAt,
            read: false,
            priority: customer.priority,
            actionUrl: `/ar/dashboard/customers-hub/${customer.id}?tab=communication`,
          });
        }
      }

    });

    // Sort by priority and timestamp
    return notifs.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [customers]);

  const unreadCount = generatedNotifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "reminder":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "appointment":
        return <Calendar className="h-5 w-5 text-green-600" />;
      case "payment":
        return <DollarSign className="h-5 w-5 text-yellow-600" />;
      case "stage_change":
        return <TrendingUp className="h-5 w-5 text-purple-600" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-cyan-600" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800";
      case "high":
        return "bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800";
      case "medium":
        return "bg-yellow-100 border-yellow-300 dark:bg-yellow-950 dark:border-yellow-800";
      case "low":
        return "bg-blue-100 border-blue-300 dark:bg-blue-950 dark:border-blue-800";
      default:
        return "bg-gray-100 border-gray-300 dark:bg-gray-950 dark:border-gray-800";
    }
  };

  const filterByType = (notifications: Notification[], type?: string) => {
    if (!type || type === "all") return notifications;
    return notifications.filter((n) => n.type === type);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[400px] sm:w-[540px]" dir="rtl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            الإشعارات
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} جديد</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            تنبيهات ومتابعات العملاء
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle className="h-4 w-4 ml-2" />
              تعليم الكل كمقروء
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="text-xs">
                الكل
                <Badge variant="secondary" className="mr-1 text-xs">
                  {generatedNotifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="reminder" className="text-xs">
                تذكير
              </TabsTrigger>
              <TabsTrigger value="appointment" className="text-xs">
                مواعيد
              </TabsTrigger>
              <TabsTrigger value="alert" className="text-xs">
                تنبيهات
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-250px)] mt-4">
              <TabsContent value="all" className="space-y-3 mt-0">
                {generatedNotifications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد إشعارات</p>
                  </div>
                ) : (
                  generatedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        !notification.read ? getPriorityColor(notification.priority) : "bg-white dark:bg-gray-900"
                      } ${!notification.read ? "shadow-sm" : "opacity-60"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-sm">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.timestamp), {
                                addSuffix: true,
                                locale: ar,
                              })}
                            </span>
                            {notification.actionUrl && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs"
                                onClick={() => {
                                  window.location.href = notification.actionUrl!;
                                  setOpen(false);
                                }}
                              >
                                عرض التفاصيل ←
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="reminder" className="space-y-3 mt-0">
                {filterByType(generatedNotifications, "reminder").map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      !notification.read ? getPriorityColor(notification.priority) : "bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.timestamp), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </span>
                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => {
                                window.location.href = notification.actionUrl!;
                                setOpen(false);
                              }}
                            >
                              عرض التفاصيل ←
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="appointment" className="space-y-3 mt-0">
                {filterByType(generatedNotifications, "appointment").map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      !notification.read ? getPriorityColor(notification.priority) : "bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.timestamp), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </span>
                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => {
                                window.location.href = notification.actionUrl!;
                                setOpen(false);
                              }}
                            >
                              عرض التفاصيل ←
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="alert" className="space-y-3 mt-0">
                {filterByType(generatedNotifications, "alert").map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      !notification.read ? getPriorityColor(notification.priority) : "bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.timestamp), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </span>
                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => {
                                window.location.href = notification.actionUrl!;
                                setOpen(false);
                              }}
                            >
                              عرض التفاصيل ←
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
