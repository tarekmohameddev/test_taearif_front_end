"use client";

import React, { useState } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Calendar,
  User,
  Building2,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Eye,
  UserPlus,
  Sparkles,
  FileText,
  Bell,
  X,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SourceBadge } from "../actions/SourceBadge";
import type { CustomerAction, UnifiedCustomer, Appointment, PropertyInterest } from "@/types/unified-customer";
import { getStageNameAr, getStageColor } from "@/types/unified-customer";

interface RequestDetailPageProps {
  requestId: string;
}

const priorityConfig = {
  urgent: { label: "عاجل", color: "bg-red-500 text-white", borderColor: "border-red-500" },
  high: { label: "مهم", color: "bg-orange-500 text-white", borderColor: "border-orange-500" },
  medium: { label: "متوسط", color: "bg-yellow-500 text-white", borderColor: "border-yellow-500" },
  low: { label: "منخفض", color: "bg-green-500 text-white", borderColor: "border-green-500" },
};

const statusConfig = {
  pending: { label: "معلق", color: "bg-gray-500 text-white" },
  in_progress: { label: "جاري العمل", color: "bg-blue-500 text-white" },
  completed: { label: "مكتمل", color: "bg-green-500 text-white" },
  dismissed: { label: "تم الرفض", color: "bg-gray-400 text-white" },
  snoozed: { label: "مؤجل", color: "bg-purple-500 text-white" },
};

const actionTypeLabels: Record<string, string> = {
  new_inquiry: "استفسار جديد",
  callback_request: "طلب اتصال",
  property_match: "مطابقة عقار",
  follow_up: "متابعة",
  document_required: "مستندات مطلوبة",
  payment_due: "دفع مستحق",
  site_visit: "معاينة عقار",
  whatsapp_incoming: "رسالة واتساب",
  ai_recommended: "موصى به بالذكاء الاصطناعي",
};

const APPOINTMENT_TYPES: { value: Appointment["type"]; label: string }[] = [
  { value: "site_visit", label: "معاينة عقار" },
  { value: "office_meeting", label: "اجتماع مكتب" },
  { value: "phone_call", label: "مكالمة هاتفية" },
  { value: "video_call", label: "مكالمة فيديو" },
  { value: "contract_signing", label: "توقيع عقد" },
  { value: "other", label: "أخرى" },
];

export function RequestDetailPage({ requestId }: RequestDetailPageProps) {
  const router = useRouter();
  const {
    actions,
    getCustomerById,
    completeAction,
    dismissAction,
    snoozeAction,
    addActionNote,
    addAppointment,
  } = useUnifiedCustomersStore();

  const action = actions.find((a) => a.id === requestId);
  const customer = action ? getCustomerById(action.customerId) : undefined;

  const [showSnoozeForm, setShowSnoozeForm] = useState(false);
  const [snoozeDate, setSnoozeDate] = useState("");
  const [snoozeTime, setSnoozeTime] = useState("10:00");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [aptType, setAptType] = useState<Appointment["type"]>("office_meeting");
  const [aptDate, setAptDate] = useState("");
  const [aptTime, setAptTime] = useState("10:00");
  const [aptNotes, setAptNotes] = useState("");

  if (!action) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4" dir="rtl">
        <div className="text-2xl font-bold text-gray-400">الطلب غير موجود</div>
        <Link href="/ar/dashboard/customers-hub/requests">
          <Button>
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة للطلبات
          </Button>
        </Link>
      </div>
    );
  }

  const isOverdue = action.dueDate && new Date(action.dueDate) < new Date();

  const handleComplete = () => {
    completeAction(action.id);
  };

  const handleDismiss = () => {
    dismissAction(action.id);
  };

  const handleSnooze = () => {
    if (!snoozeDate) return;
    const datetime = new Date(`${snoozeDate}T${snoozeTime}`).toISOString();
    snoozeAction(action.id, datetime);
    setShowSnoozeForm(false);
    setSnoozeDate("");
    setSnoozeTime("10:00");
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addActionNote(action.id, newNote.trim());
    setNewNote("");
    setShowNoteForm(false);
  };

  const handleScheduleAppointment = () => {
    if (!aptDate || !aptTime || !customer) return;
    const now = new Date().toISOString();
    const datetime = new Date(`${aptDate}T${aptTime}`).toISOString();
    const appointment: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      title: APPOINTMENT_TYPES.find((t) => t.value === aptType)?.label ?? "موعد",
      type: aptType,
      date: datetime,
      time: aptTime,
      datetime,
      duration: 30,
      status: "scheduled",
      priority: "medium",
      notes: aptNotes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    addAppointment(customer.id, appointment);
    setShowScheduleForm(false);
    setAptType("office_meeting");
    setAptDate("");
    setAptTime("10:00");
    setAptNotes("");
  };

  // Get property info from metadata or customer preferences
  const propertyInfo = action.metadata?.propertyTitle || action.metadata?.property_title
    ? {
        title: action.metadata.propertyTitle || action.metadata.property_title,
        type: action.metadata.propertyType || action.metadata.property_type,
        price: action.metadata.propertyPrice || action.metadata.property_price,
        location: action.metadata.propertyLocation || action.metadata.property_location,
      }
    : null;

  const customerPreferences = customer?.preferences
    ? {
        type: customer.preferences.propertyType?.join("، "),
        budget:
          customer.preferences.budgetMin && customer.preferences.budgetMax
            ? `${(customer.preferences.budgetMin / 1000).toFixed(0)}k - ${(customer.preferences.budgetMax / 1000).toFixed(0)}k ريال`
            : customer.preferences.budgetMax
            ? `حتى ${(customer.preferences.budgetMax / 1000).toFixed(0)}k ريال`
            : undefined,
        location: customer.preferences.preferredAreas?.slice(0, 3).join("، "),
        bedrooms: customer.preferences.bedrooms,
      }
    : null;

  const aiMatching = customer
    ? {
        canMatch:
          (customer.preferences?.propertyType?.length ?? 0) > 0 &&
          ((customer.preferences?.budgetMin ?? 0) > 0 ||
            (customer.preferences?.preferredAreas?.length ?? 0) > 0),
        matchCount: customer.aiInsights?.propertyMatches?.length ?? 0,
      }
    : { canMatch: false, matchCount: 0 };

  // Resolve AI-matched properties (full details from customer.properties)
  const matchedProperties: PropertyInterest[] = customer?.properties?.filter((p) =>
    customer.aiInsights?.propertyMatches?.includes(p.propertyId)
  ) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900" dir="rtl">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ar/dashboard/customers-hub/requests">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                العودة للطلبات
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تفاصيل الطلب</h1>
              <p className="text-gray-500 text-sm mt-1">
                {actionTypeLabels[action.type] || action.type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusConfig[action.status].color}>
              {statusConfig[action.status].label}
            </Badge>
            <Badge className={priorityConfig[action.priority].color}>
              {priorityConfig[action.priority].label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Info Card */}
            <Card className={cn("border-r-4", priorityConfig[action.priority].borderColor)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  معلومات الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  {action.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {action.description}
                    </p>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">نوع الطلب</div>
                      <div className="font-medium">{actionTypeLabels[action.type]}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                      <SourceBadge source={action.source} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">المصدر</div>
                      <div className="font-medium">
                        <SourceBadge source={action.source} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">تاريخ الإنشاء</div>
                      <div className="font-medium">
                        {new Date(action.createdAt).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {action.dueDate && (
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          isOverdue
                            ? "bg-red-50 dark:bg-red-950/30"
                            : "bg-orange-50 dark:bg-orange-950/30"
                        )}
                      >
                        <Clock
                          className={cn(
                            "h-4 w-4",
                            isOverdue ? "text-red-600" : "text-orange-600"
                          )}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">الموعد المستهدف</div>
                        <div className={cn("font-medium", isOverdue && "text-red-600")}>
                          {new Date(action.dueDate).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          {new Date(action.dueDate).toLocaleTimeString("ar-SA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {isOverdue && (
                            <Badge variant="destructive" className="mr-2 text-xs">
                              متأخر
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {action.assignedToName && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                        <UserPlus className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">معين إلى</div>
                        <div className="font-medium">{action.assignedToName}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property/Preferences Info */}
            {(propertyInfo || customerPreferences) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {propertyInfo ? "معلومات العقار" : "تفضيلات العميل"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {propertyInfo ? (
                      <>
                        {propertyInfo.title && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{propertyInfo.title}</span>
                          </div>
                        )}
                        {propertyInfo.type && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span>{propertyInfo.type}</span>
                          </div>
                        )}
                        {propertyInfo.price && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span>{propertyInfo.price.toLocaleString("ar-SA")} ر.س</span>
                          </div>
                        )}
                        {propertyInfo.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{propertyInfo.location}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      customerPreferences && (
                        <>
                          {customerPreferences.type && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="text-xs text-gray-500">نوع العقار</div>
                                <div className="font-medium">{customerPreferences.type}</div>
                              </div>
                            </div>
                          )}
                          {customerPreferences.budget && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="text-xs text-gray-500">الميزانية</div>
                                <div className="font-medium">{customerPreferences.budget}</div>
                              </div>
                            </div>
                          )}
                          {customerPreferences.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="text-xs text-gray-500">المناطق المفضلة</div>
                                <div className="font-medium">{customerPreferences.location}</div>
                              </div>
                            </div>
                          )}
                          {customerPreferences.bedrooms && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="text-xs text-gray-500">غرف النوم</div>
                                <div className="font-medium">{customerPreferences.bedrooms}+</div>
                              </div>
                            </div>
                          )}
                        </>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* مطابقة الذكاء الاصطناعي - Separate section with full matched property details */}
            {customer && (
              <Card className="border-violet-200 dark:border-violet-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-500" />
                    مطابقة الذكاء الاصطناعي
                    {aiMatching.matchCount > 0 && (
                      <Badge variant="secondary" className="text-violet-600 dark:text-violet-400">
                        {aiMatching.matchCount} عقار
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aiMatching.canMatch ? (
                    matchedProperties.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          عقارات مطابقة لتفضيلات العميل حسب الذكاء الاصطناعي:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {matchedProperties.map((property) => (
                            <Card
                              key={property.id}
                              className="overflow-hidden hover:shadow-md transition-shadow border-violet-100 dark:border-violet-900/30"
                            >
                              {property.propertyImage && (
                                <div
                                  className="h-36 bg-cover bg-center"
                                  style={{
                                    backgroundImage: `url(${property.propertyImage})`,
                                  }}
                                />
                              )}
                              <CardContent className="p-4 space-y-3">
                                <div>
                                  <h4 className="font-semibold text-base">{property.propertyTitle}</h4>
                                  {property.propertyLocation && (
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                                      {property.propertyLocation}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {property.propertyType && (
                                    <Badge variant="outline" className="text-xs">
                                      {property.propertyType}
                                    </Badge>
                                  )}
                                  {property.status && (
                                    <Badge
                                      variant={
                                        property.status === "viewing_scheduled" || property.status === "liked"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {property.status === "interested"
                                        ? "مهتم"
                                        : property.status === "viewing_scheduled"
                                          ? "معاينة مجدولة"
                                          : property.status === "viewed"
                                            ? "تمت المعاينة"
                                            : property.status === "liked"
                                              ? "معجب"
                                              : property.status === "rejected"
                                                ? "مرفوض"
                                                : property.status === "offer_made"
                                                  ? "عرض مقدم"
                                                  : property.status}
                                    </Badge>
                                  )}
                                </div>
                                {property.propertyPrice != null && (
                                  <div className="flex items-center gap-1.5 text-base font-bold text-green-600 dark:text-green-400">
                                    <DollarSign className="h-4 w-4" />
                                    {(property.propertyPrice / 1000).toFixed(0)}k ر.س
                                  </div>
                                )}
                                {property.addedAt && (
                                  <p className="text-xs text-gray-500">
                                    أضيف:{" "}
                                    {new Date(property.addedAt).toLocaleDateString("ar-SA", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                )}
                                <Button variant="outline" size="sm" className="w-full gap-1.5">
                                  <Eye className="h-3.5 w-3.5" />
                                  عرض التفاصيل
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 py-2">
                        <Sparkles className="h-4 w-4" />
                        <span>
                          {aiMatching.matchCount} عقار مطابق — أضف العقارات للعميل لعرض التفاصيل هنا
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 py-2">
                      <Sparkles className="h-4 w-4 opacity-70" />
                      <span>أكمِل تفضيلات العميل لتفعيل المطابقة بالذكاء الاصطناعي</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    ملاحظات
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNoteForm(!showNoteForm)}
                  >
                    {showNoteForm ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <>
                        <FileText className="h-4 w-4 ml-2" />
                        إضافة ملاحظة
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {showNoteForm && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
                    <Textarea
                      placeholder="أضف ملاحظة جديدة..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                        <Check className="h-4 w-4 ml-2" />
                        حفظ
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowNoteForm(false);
                          setNewNote("");
                        }}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                )}

                {action.metadata?.notes ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {action.metadata.notes}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(action.createdAt).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  !showNoteForm && (
                    <p className="text-sm text-gray-500 text-center py-4">لا توجد ملاحظات</p>
                  )
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Summary Card */}
            {customer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    معلومات العميل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg hover:from-primary/10 hover:to-primary/20 transition-all border border-primary/20 cursor-pointer"
                    onClick={() => router.push(`/ar/dashboard/customers-hub/${customer.id}`)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{customer.name}</h3>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: getStageColor(customer.stage),
                            color: getStageColor(customer.stage),
                          }}
                        >
                          {getStageNameAr(customer.stage)}
                        </Badge>
                      </div>
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="space-y-2">
                      <a
                        href={`tel:${customer.phone}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="h-4 w-4" />
                        <span dir="ltr">{customer.phone}</span>
                      </a>
                      {customer.whatsapp && (
                        <a
                          href={`https://wa.me/${customer.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>واتساب</span>
                        </a>
                      )}
                      {customer.email && (
                        <a
                          href={`mailto:${customer.email}`}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{customer.email}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-[8rem]">
                    <div className="text-xl font-bold">{customer.totalInteractions || 0}</div>
                    <div className="text-xs text-gray-500">تفاعلات</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {action.status !== "completed" && action.status !== "dismissed" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">إجراءات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                    onClick={handleComplete}
                  >
                    <CheckCircle className="h-4 w-4" />
                    إتمام الطلب
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setShowScheduleForm(!showScheduleForm)}
                  >
                    <Calendar className="h-4 w-4" />
                    جدولة موعد
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setShowSnoozeForm(!showSnoozeForm)}
                  >
                    <Bell className="h-4 w-4" />
                    تأجيل
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleDismiss}
                  >
                    <X className="h-4 w-4" />
                    رفض الطلب
                  </Button>

                  {/* Snooze Form */}
                  {showSnoozeForm && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3 border">
                      <Label className="text-sm font-medium">تأجيل حتى:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={snoozeDate}
                          onChange={(e) => setSnoozeDate(e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="time"
                          value={snoozeTime}
                          onChange={(e) => setSnoozeTime(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSnooze}
                          disabled={!snoozeDate}
                          className="flex-1"
                        >
                          تأكيد
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setShowSnoozeForm(false);
                            setSnoozeDate("");
                            setSnoozeTime("10:00");
                          }}
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Schedule Appointment Form */}
                  {showScheduleForm && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3 border">
                      <div className="space-y-2">
                        <Label className="text-sm">نوع الموعد</Label>
                        <Select
                          value={aptType}
                          onValueChange={(v) => setAptType(v as Appointment["type"])}
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
                            onChange={(e) => setAptDate(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">الوقت</Label>
                          <Input
                            type="time"
                            value={aptTime}
                            onChange={(e) => setAptTime(e.target.value)}
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">ملاحظات</Label>
                        <Textarea
                          value={aptNotes}
                          onChange={(e) => setAptNotes(e.target.value)}
                          placeholder="ملاحظات اختيارية"
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleScheduleAppointment}
                          disabled={!aptDate || !aptTime}
                          className="flex-1"
                        >
                          جدولة
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setShowScheduleForm(false);
                            setAptType("office_meeting");
                            setAptDate("");
                            setAptTime("10:00");
                            setAptNotes("");
                          }}
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Completed/Dismissed Message */}
            {(action.status === "completed" || action.status === "dismissed") && (
              <Card className="border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      {action.status === "completed" ? "تم إتمام الطلب" : "تم رفض الطلب"}
                    </span>
                  </div>
                  {action.completedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(action.completedAt).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
