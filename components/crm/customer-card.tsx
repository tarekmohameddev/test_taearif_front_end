"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  StickyNote,
  Bell,
  Activity,
  Phone,
  MessageSquare,
  GripVertical,
  MapPin,
  User,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Customer, PipelineStage, Reminder } from "@/types/crm";
import useStore from "@/context/Store";
import useCrmStore from "@/context/store/crm";
import { WhatsAppSendDialog } from "@/components/marketing/whatsapp-send-dialog";

interface CustomerCardProps {
  customer: Customer;
  stage: PipelineStage;
  isDragging?: boolean;
  isFocused?: boolean;
  onDragStart: (e: any, customer: Customer) => void;
  onDragEnd: (e: any) => void;
  onKeyDown: (e: any, customer: Customer, stageId: string) => void;
  onViewDetails: (customer: Customer) => void;
  onAddNote: (customer: Customer) => void;
  onAddReminder: (customer: Customer) => void;
  onAddInteraction: (customer: Customer) => void;
  viewType: "mobile" | "tablet" | "desktop";
}

export default function CustomerCard({
  customer,
  stage,
  isDragging = false,
  isFocused = false,
  onDragStart,
  onDragEnd,
  onKeyDown,
  onViewDetails,
  onAddNote,
  onAddReminder,
  onAddInteraction,
  viewType,
}: CustomerCardProps) {
  const router = useRouter();
  const [hasDragged, setHasDragged] = useState(false);
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tabletMenuOpen, setTabletMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const { marketingChannels, fetchMarketingChannels } = useStore();
  const { reminders } = useCrmStore();

  // جلب قنوات التسويق عند تحميل المكون
  useEffect(() => {
    fetchMarketingChannels();
  }, [fetchMarketingChannels]);

  // التحقق من وجود قناة واتساب صالحة للـ CRM
  const hasValidCRMWhatsAppChannel = () => {
    return marketingChannels.channels.some(
      (channel: any) =>
        channel.is_verified === true &&
        channel.is_connected === true &&
        channel.crm_integration_enabled === true,
    );
  };

  const handleClick = (e: React.MouseEvent) => {
    // إذا لم يتم السحب، افتح صفحة تفاصيل الصفقة
    if (!hasDragged) {
      router.push(`/dashboard/crm/${customer.id}`);
    }
  };

  const handleCloseWhatsAppDialog = useCallback(() => {
    setShowWhatsAppDialog(false);
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    setHasDragged(true);
    onDragStart(e, customer);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd(e);
    // إعادة تعيين الحالة بعد انتهاء السحب
    setTimeout(() => {
      setHasDragged(false);
    }, 100);
  };
  const getPropertyTypeColor = (propertyType: string | null | undefined) => {
    if (!propertyType) {
      return "border-gray-500 text-gray-700 bg-gray-50";
    }
    const type = propertyType.toLowerCase();
    if (type.includes("شقة") || type.includes("apartment")) {
      return "border-blue-500 text-blue-700 bg-blue-50";
    }
    if (type.includes("فيلا") || type.includes("villa")) {
      return "border-purple-500 text-purple-700 bg-purple-50";
    }
    if (type.includes("أرض") || type.includes("land")) {
      return "border-green-500 text-green-700 bg-green-50";
    }
    if (
      type.includes("محل") ||
      type.includes("shop") ||
      type.includes("store")
    ) {
      return "border-orange-500 text-orange-700 bg-orange-50";
    }
    if (type.includes("مكتب") || type.includes("office")) {
      return "border-indigo-500 text-indigo-700 bg-indigo-50";
    }
    return "border-gray-500 text-gray-700 bg-gray-50";
  };

  const getPropertyTypeLabel = (customer: Customer): string => {
    // Try property_basic.type first
    if (customer.property_basic?.type) {
      return customer.property_basic.type;
    }
    // Try property_specifications.basic_information.property_type
    if (customer.property_specifications?.basic_information?.property_type) {
      return customer.property_specifications.basic_information.property_type;
    }
    // Return default if no property type found
    return "غير محدد";
  };

  // Get reminders for this customer
  const getCustomerReminders = (customerId: number): Reminder[] => {
    if (!reminders || reminders.length === 0) return [];
    return reminders.filter((reminder) => {
      // Check customer_id directly first (from API), then fallback to customer.id
      const reminderCustomerId = reminder.customer_id || reminder.customer?.id;
      
      if (reminderCustomerId !== undefined && reminderCustomerId !== null) {
        // Compare as numbers to handle type mismatches (string vs number)
        return Number(reminderCustomerId) === Number(customerId);
      }
      return false;
    });
  };

  // Get active reminders count (pending or overdue)
  const getActiveRemindersCount = (customerId: number): number => {
    const customerReminders = getCustomerReminders(customerId);
    return customerReminders.filter(
      (reminder) =>
        reminder.status === "pending" || reminder.status === "overdue",
    ).length;
  };

  const renderMobileView = () => (
    <Card
      className={`p-4 cursor-move hover:shadow-md transition-all duration-300 border-l-4 ${
        isFocused ? "ring-2 ring-blue-500 bg-blue-50" : ""
      } ${isDragging ? "opacity-50 scale-95 rotate-1" : "hover:scale-[1.02]"}`}
      style={{ borderLeftColor: stage.color?.replace("bg-", "#") }}
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      tabIndex={0}
      role="button"
      aria-label={`العميل ${customer.name} في مرحلة ${stage.name}. اضغط Enter للتحديد أو اسحب لنقل العميل`}
      onKeyDown={(e) => onKeyDown(e, customer, stage.id)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate">
                {customer.name}
              </div>
              {customer.customer_type &&
                customer.customer_type !== "غير محدد" && (
                  <div className="text-xs text-muted-foreground">
                    {customer.customer_type}
                  </div>
                )}
            </div>
          </div>
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-5 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/crm/${customer.id}`);
                }}
                onSelect={() => {}}
              >
                <Eye className="ml-2 h-4 w-4" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAddNote(customer);
                }}
                onSelect={() => {}}
              >
                <StickyNote className="ml-2 h-4 w-4" />
                إضافة ملاحظة
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAddReminder(customer);
                }}
                onSelect={() => {}}
              >
                <Bell className="ml-2 h-4 w-4" />
                إضافة تذكير
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAddInteraction(customer);
                }}
                onSelect={() => {}}
              >
                <Activity className="ml-2 h-4 w-4" />
                تسجيل تفاعل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  const url = `/dashboard/activity-logs/customer/${customer.id}`;
                  window.open(url, "_blank");
                }}
              >
                <Activity className="mr-2 h-4 w-4" />
                سجل النشاطات
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Phone className="ml-2 h-4 w-4" />
                اتصال
              </DropdownMenuItem>
              {hasValidCRMWhatsAppChannel() && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMobileMenuOpen(false);
                    setTimeout(() => setShowWhatsAppDialog(true), 50);
                  }}
                >
                  <MessageSquare className="ml-2 h-4 w-4" />
                  واتساب
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            {customer.phone_number && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{customer.phone_number}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            {customer.email && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
            )}
          </div>
        </div>

        {customer.responsible_employee && (
          <div className="space-y-1 text-xs border-t pt-2">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 flex-shrink-0 text-blue-600" />
              <span className="font-medium truncate">
                {customer.responsible_employee.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {customer.responsible_employee.whatsapp_number}
              </span>
            </div>
          </div>
        )}

        {/* Reminders Section */}
        {(() => {
          const customerId = (customer as any).customer_id || customer.id;
          const customerReminders = getCustomerReminders(Number(customerId));
          const activeReminders = customerReminders.filter(
            (r) => r.status === "pending" || r.status === "overdue"
          );

          if (activeReminders.length > 0) {
            return (
              <div className="space-y-2 text-xs border-t pt-2">
                <div className="flex items-center gap-1 font-semibold text-muted-foreground">
                  <Bell className="h-3 w-3 flex-shrink-0" />
                  <span>التذكيرات ({activeReminders.length})</span>
                </div>
                <div className="space-y-0">
                  {activeReminders.map((reminder, index) => (
                    <div key={reminder.id}>
                      <div className="p-1.5 rounded bg-white">
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-medium truncate">
                              {reminder.title}
                            </span>
                            {reminder.reminder_type && (
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                                {reminder.reminder_type.name_ar || reminder.reminder_type.name}
                              </span>
                            )}
                          </div>
                          {reminder.datetime && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                              <Clock className="h-2.5 w-2.5 flex-shrink-0" />
                              <span>
                                {new Date(reminder.datetime).toLocaleDateString(
                                  "ar-SA",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                        {reminder.status === "overdue" && (
                          <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      </div>
                      {index < activeReminders.length - 1 && (
                        <div className="flex justify-center">
                          <div className="w-1/2 border-b border-gray-200"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}

        <div className="flex items-center justify-between flex-wrap gap-2">
          {getPropertyTypeLabel(customer) !== "غير محدد" && (
            <Badge
              variant="outline"
              className={`text-xs ${getPropertyTypeColor(getPropertyTypeLabel(customer))}`}
            >
              {getPropertyTypeLabel(customer)}
            </Badge>
          )}
          <div className="text-xs text-muted-foreground truncate flex-1 text-left">
            {customer.note && customer.note.length > 0
              ? "لديه ملاحظات"
              : "لا توجد ملاحظات"}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderTabletView = () => (
    <Card
      className={`p-3 cursor-move hover:shadow-md transition-all duration-300 border-l-4 ${
        isFocused ? "ring-2 ring-blue-500 bg-blue-50" : ""
      } ${isDragging ? "opacity-50 scale-95 rotate-1" : "hover:scale-[1.02]"}`}
      style={{ borderLeftColor: stage.color?.replace("bg-", "#") }}
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      tabIndex={0}
      role="button"
      aria-label={`العميل ${customer.name} في مرحلة ${stage.name}. اضغط Enter للتحديد أو اسحب لنقل العميل`}
      onKeyDown={(e) => onKeyDown(e, customer, stage.id)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate">
                {customer.name}
              </div>
              {customer.customer_type &&
                customer.customer_type !== "غير محدد" && (
                  <div className="text-xs text-muted-foreground">
                    {customer.customer_type}
                  </div>
                )}
            </div>
          </div>
          <DropdownMenu open={tabletMenuOpen} onOpenChange={setTabletMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/crm/${customer.id}`);
                }}
                onSelect={() => {}}
              >
                <Eye className="ml-2 h-4 w-4" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAddNote(customer);
                }}
                onSelect={() => {}}
              >
                <StickyNote className="ml-2 h-4 w-4" />
                إضافة ملاحظة
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAddReminder(customer);
                }}
                onSelect={() => {}}
              >
                <Bell className="ml-2 h-4 w-4" />
                إضافة تذكير
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAddInteraction(customer);
                }}
                onSelect={() => {}}
              >
                <Activity className="ml-2 h-4 w-4" />
                تسجيل تفاعل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  const url = `/dashboard/activity-logs/customer/${customer.id}`;
                  window.open(url, "_blank");
                }}
              >
                <Activity className="mr-2 h-4 w-4" />
                سجل النشاطات
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Phone className="ml-2 h-4 w-4" />
                اتصال
              </DropdownMenuItem>
              {hasValidCRMWhatsAppChannel() && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTabletMenuOpen(false);
                    setTimeout(() => setShowWhatsAppDialog(true), 50);
                  }}
                >
                  <MessageSquare className="ml-2 h-4 w-4" />
                  واتساب
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          {customer.phone_number && (
            <div className="flex items-center gap-1 text-xs">
              <Phone className="h-3 w-3" />
              <span className="truncate">{customer.phone_number}</span>
            </div>
          )}
        </div>

        {customer.email && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{customer.email}</span>
            </div>
          </div>
        )}

        {customer.responsible_employee && (
          <div className="space-y-1 text-xs border-t pt-2">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 flex-shrink-0 text-blue-600" />
              <span className="font-medium truncate">
                {customer.responsible_employee.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {customer.responsible_employee.whatsapp_number}
              </span>
            </div>
          </div>
        )}

        {/* Reminders Section */}
        {(() => {
          const customerId = (customer as any).customer_id || customer.id;
          const customerReminders = getCustomerReminders(Number(customerId));
          const activeReminders = customerReminders.filter(
            (r) => r.status === "pending" || r.status === "overdue"
          );

          if (activeReminders.length > 0) {
            return (
              <div className="space-y-1.5 text-xs border-t pt-2">
                <div className="flex items-center gap-1 font-semibold text-muted-foreground">
                  <Bell className="h-3 w-3 flex-shrink-0" />
                  <span>التذكيرات ({activeReminders.length})</span>
                </div>
                <div className="space-y-0">
                  {activeReminders.map((reminder, index) => (
                    <div key={reminder.id}>
                      <div className="p-1 rounded bg-white">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-medium truncate">
                            {reminder.title}
                          </span>
                          {reminder.reminder_type && (
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                              {reminder.reminder_type.name_ar || reminder.reminder_type.name}
                            </span>
                          )}
                        </div>
                        {reminder.datetime && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                            <Clock className="h-2.5 w-2.5 flex-shrink-0" />
                            <span>
                              {new Date(reminder.datetime).toLocaleDateString(
                                "ar-SA",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                      {index < activeReminders.length - 1 && (
                        <div className="flex justify-center">
                          <div className="w-1/2 border-b border-gray-200"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}

        <div className="flex items-center justify-between">
          {getPropertyTypeLabel(customer) !== "غير محدد" && (
            <Badge
              variant="outline"
              className={`text-xs ${getPropertyTypeColor(getPropertyTypeLabel(customer))}`}
            >
              {getPropertyTypeLabel(customer)}
            </Badge>
          )}
          <div className="text-xs text-muted-foreground truncate max-w-[100px]">
            {customer.note ? "لديه ملاحظات" : "لا توجد ملاحظات"}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderDesktopView = () => (
    <Card
      className={`p-3 cursor-move hover:shadow-md transition-all duration-300 border-l-4 ${
        isFocused ? "ring-2 ring-blue-500 bg-blue-50" : ""
      } ${isDragging ? "opacity-50 scale-95 rotate-2" : "hover:scale-102"}`}
      style={{ borderLeftColor: stage.color?.replace("bg-", "#") }}
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      tabIndex={0}
      role="button"
      aria-label={`العميل ${customer.name} في مرحلة ${stage.name}. اضغط Enter للتحديد أو اسحب لنقل العميل`}
      onKeyDown={(e) => onKeyDown(e, customer, stage.id)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
              <div className="font-medium text-sm">{customer.name}</div>
              <div className="text-xs text-muted-foreground">
                {customer.customer_type || "غير محدد"}
              </div>
            </div>
          </div>
          <DropdownMenu
            open={desktopMenuOpen}
            onOpenChange={setDesktopMenuOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/crm/${customer.id}`);
                }}
                onSelect={() => {}}
              >
                <Eye className="ml-2 h-4 w-4" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAddNote(customer);
                }}
                onSelect={() => {}}
              >
                <StickyNote className="ml-2 h-4 w-4" />
                إضافة ملاحظة
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAddReminder(customer);
                }}
                onSelect={() => {}}
              >
                <Bell className="ml-2 h-4 w-4" />
                إضافة تذكير
              </DropdownMenuItem>
              {hasValidCRMWhatsAppChannel() && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDesktopMenuOpen(false);
                    setTimeout(() => setShowWhatsAppDialog(true), 50);
                  }}
                >
                  <Activity className="ml-2 h-4 w-4" />
                  إرسال رسالة واتساب
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onAddInteraction(customer);
                }}
                onSelect={() => {}}
              >
                <Activity className="ml-2 h-4 w-4" />
                تسجيل تفاعل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  const url = `/dashboard/activity-logs/customer/${customer.id}`;
                  window.open(url, "_blank");
                }}
              >
                <Activity className="mr-2 h-4 w-4" />
                سجل النشاطات
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Phone className="ml-2 h-4 w-4" />
                اتصال
              </DropdownMenuItem>
              {hasValidCRMWhatsAppChannel() && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDesktopMenuOpen(false);
                    setTimeout(() => setShowWhatsAppDialog(true), 50);
                  }}
                >
                  <MessageSquare className="ml-2 h-4 w-4" />
                  واتساب
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          {customer.phone_number && (
            <div className="flex items-center gap-1 text-xs">
              <Phone className="h-3 w-3" />
              <span>{customer.phone_number}</span>
            </div>
          )}
        </div>

        {customer.email && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{customer.email}</span>
            </div>
          </div>
        )}

        {customer.responsible_employee && (
          <div className="space-y-1 text-xs border-t pt-2">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 flex-shrink-0 text-blue-600" />
              <span className="font-medium">
                {customer.responsible_employee.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span>{customer.responsible_employee.whatsapp_number}</span>
            </div>
          </div>
        )}

        {/* Reminders Section */}
        {(() => {
          const customerId = (customer as any).customer_id || customer.id;
          const customerReminders = getCustomerReminders(Number(customerId));
          const activeReminders = customerReminders.filter(
            (r) => r.status === "pending" || r.status === "overdue"
          );

          if (activeReminders.length > 0) {
            return (
              <div className="space-y-1.5 text-xs border-t pt-2">
                <div className="flex items-center gap-1 font-semibold text-muted-foreground">
                  <Bell className="h-3 w-3 flex-shrink-0" />
                  <span>التذكيرات ({activeReminders.length})</span>
                </div>
                <div className="space-y-0">
                  {activeReminders.map((reminder, index) => (
                    <div key={reminder.id}>
                      <div className="p-1 rounded bg-white">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-medium truncate">
                            {reminder.title}
                          </span>
                          {reminder.reminder_type && (
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                              {reminder.reminder_type.name_ar || reminder.reminder_type.name}
                            </span>
                          )}
                        </div>
                        {reminder.datetime && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                            <Clock className="h-2.5 w-2.5 flex-shrink-0" />
                            <span>
                              {new Date(reminder.datetime).toLocaleDateString(
                                "ar-SA",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                      {index < activeReminders.length - 1 && (
                        <div className="flex justify-center">
                          <div className="w-1/2 border-b border-gray-200 my-1"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}

        <div className="flex items-center justify-between">
          {getPropertyTypeLabel(customer) !== "غير محدد" && (
            <Badge
              variant="outline"
              className={getPropertyTypeColor(getPropertyTypeLabel(customer))}
            >
              {getPropertyTypeLabel(customer)}
            </Badge>
          )}
          <div className="text-xs text-muted-foreground">
            {customer.note ? "لديه ملاحظات" : "لا توجد ملاحظات"}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      {(() => {
        switch (viewType) {
          case "mobile":
            return renderMobileView();
          case "tablet":
            return renderTabletView();
          case "desktop":
            return renderDesktopView();
          default:
            return renderDesktopView();
        }
      })()}

      {/* WhatsApp Send Dialog */}
      <WhatsAppSendDialog
        isOpen={showWhatsAppDialog}
        onClose={handleCloseWhatsAppDialog}
        customerPhone={customer.phone_number}
        customerName={customer.name}
        customerId={customer.id}
      />
    </>
  );
}
