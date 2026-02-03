"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UnifiedCustomer, Appointment } from "@/types/unified-customer";
import { 
  Calendar, Clock, MapPin, User, Phone, CheckCircle, 
  XCircle, AlertCircle, Plus, Edit, Trash2, Video,
  Building
} from "lucide-react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";

interface AppointmentsTabProps {
  customer: UnifiedCustomer;
}

export function AppointmentsTab({ customer }: AppointmentsTabProps) {
  const { updateAppointment, removeAppointment } = useUnifiedCustomersStore();
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const getStatusBadge = (status: Appointment["status"]) => {
    const config = {
      scheduled: { variant: "secondary" as any, label: "مجدولة", icon: Clock },
      confirmed: { variant: "default" as any, label: "مؤكدة", icon: CheckCircle },
      completed: { variant: "default" as any, label: "مكتملة", icon: CheckCircle },
      cancelled: { variant: "destructive" as any, label: "ملغاة", icon: XCircle },
      no_show: { variant: "destructive" as any, label: "لم يحضر", icon: AlertCircle },
    };
    const { variant, label, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "urgent") return <Badge variant="destructive">عاجل 🚨</Badge>;
    if (priority === "high") return <Badge variant="default">عالي 🔥</Badge>;
    if (priority === "medium") return <Badge variant="secondary">متوسط ⭐</Badge>;
    return <Badge variant="outline">منخفض</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      site_visit: <Building className="h-4 w-4 text-blue-600" />,
      office_meeting: <User className="h-4 w-4 text-purple-600" />,
      phone_call: <Phone className="h-4 w-4 text-green-600" />,
      video_call: <Video className="h-4 w-4 text-indigo-600" />,
      contract_signing: <CheckCircle className="h-4 w-4 text-emerald-600" />,
      other: <Calendar className="h-4 w-4 text-gray-600" />,
    };
    return icons[type as keyof typeof icons] || icons.other;
  };

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      site_visit: "معاينة عقار",
      office_meeting: "اجتماع مكتب",
      phone_call: "مكالمة هاتفية",
      video_call: "مكالمة فيديو",
      contract_signing: "توقيع عقد",
      other: "أخرى",
    };
    return names[type] || type;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  const handleStatusChange = (appointmentId: string, newStatus: Appointment["status"]) => {
    updateAppointment(customer.id, appointmentId, { 
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const upcomingAppointments = customer.appointments
    .filter((apt) => isUpcoming(apt.date) && apt.status !== "cancelled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = customer.appointments
    .filter((apt) => !isUpcoming(apt.date) || apt.status === "cancelled")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">المواعيد</h3>
          <p className="text-sm text-gray-500">
            {upcomingAppointments.length} موعد قادم • {pastAppointments.length} موعد سابق
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          موعد جديد
        </Button>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            المواعيد القادمة
          </h4>
          {upcomingAppointments.map((appointment) => (
            <Card 
              key={appointment.id}
              className={`border-l-4 hover:shadow-md transition-shadow ${
                appointment.priority === "urgent" ? "border-l-red-500" :
                appointment.priority === "high" ? "border-l-orange-500" :
                "border-l-blue-500"
              }`}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getTypeIcon(appointment.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{appointment.title}</h4>
                          {getPriorityBadge(appointment.priority)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {getTypeName(appointment.type)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time} ({appointment.duration} دقيقة)</span>
                    </div>
                  </div>

                  {/* Location */}
                  {appointment.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.location}</span>
                    </div>
                  )}

                  {/* Property */}
                  {appointment.propertyTitle && (
                    <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-950 p-2 rounded">
                      <Building className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-300">
                        {appointment.propertyTitle}
                      </span>
                    </div>
                  )}

                  {/* Agent */}
                  {appointment.agentName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>المسؤول: {appointment.agentName}</span>
                    </div>
                  )}

                  {/* Notes */}
                  {appointment.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {appointment.notes}
                    </div>
                  )}

                  {/* Actions */}
                  {appointment.status === "scheduled" && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleStatusChange(appointment.id, "confirmed")}
                      >
                        <CheckCircle className="h-3 w-3 ml-1" />
                        تأكيد
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedAppointment(appointment.id)}
                      >
                        <Edit className="h-3 w-3 ml-1" />
                        تعديل
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleStatusChange(appointment.id, "cancelled")}
                      >
                        <XCircle className="h-3 w-3 ml-1" />
                        إلغاء
                      </Button>
                    </div>
                  )}

                  {appointment.status === "confirmed" && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleStatusChange(appointment.id, "completed")}
                      >
                        <CheckCircle className="h-3 w-3 ml-1" />
                        تم الإنجاز
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(appointment.id, "no_show")}
                      >
                        <AlertCircle className="h-3 w-3 ml-1" />
                        لم يحضر
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            المواعيد السابقة
          </h4>
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id} className="opacity-75">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      {getTypeIcon(appointment.type)}
                      <div>
                        <h4 className="font-semibold text-sm">{appointment.title}</h4>
                        <p className="text-xs text-gray-600">{getTypeName(appointment.type)}</p>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    {formatDate(appointment.date)} • {appointment.time}
                  </div>

                  {appointment.outcome && (
                    <div className="text-sm bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 p-2 rounded">
                      <strong>النتيجة:</strong> {appointment.outcome}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {customer.appointments.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            لا توجد مواعيد
          </h3>
          <p className="text-gray-500 mb-4">
            ابدأ بجدولة موعد مع هذا العميل
          </p>
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            إضافة موعد
          </Button>
        </Card>
      )}
    </div>
  );
}
