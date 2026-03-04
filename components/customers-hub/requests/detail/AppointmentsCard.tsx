import React from "react";
import type { Appointment } from "@/types/unified-customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Building2, User, Phone, Video, CheckCircle } from "lucide-react";

interface AppointmentsCardProps {
  appointments: Appointment[];
}

export function AppointmentsCard({ appointments }: AppointmentsCardProps) {
  if (!appointments || appointments.length === 0) {
    return null;
  }

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.datetime || a.date).getTime() - new Date(b.datetime || b.date).getTime()
  );

  const getTypeIcon = (type: Appointment["type"]) => {
    const icons: Record<Appointment["type"] | "other", JSX.Element> = {
      site_visit: <Building2 className="h-4 w-4 text-blue-600" />,
      office_meeting: <User className="h-4 w-4 text-purple-600" />,
      phone_call: <Phone className="h-4 w-4 text-green-600" />,
      video_call: <Video className="h-4 w-4 text-indigo-600" />,
      contract_signing: <CheckCircle className="h-4 w-4 text-emerald-600" />,
      other: <Calendar className="h-4 w-4 text-gray-600" />,
    };

    return icons[type] || icons.other;
  };

  const getTypeName = (type: Appointment["type"]) => {
    const names: Record<Appointment["type"] | "other", string> = {
      site_visit: "معاينة عقار",
      office_meeting: "اجتماع مكتب",
      phone_call: "مكالمة هاتفية",
      video_call: "مكالمة فيديو",
      contract_signing: "توقيع عقد",
      other: "أخرى",
    };

    return names[type] || type;
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    const config: Record<
      NonNullable<Appointment["status"]>,
      { variant: "secondary" | "default" | "destructive"; label: string }
    > = {
      scheduled: { variant: "secondary", label: "مجدول" },
      confirmed: { variant: "default", label: "مؤكدة" },
      completed: { variant: "default", label: "مكتملة" },
      cancelled: { variant: "destructive", label: "ملغاة" },
      no_show: { variant: "destructive", label: "لم يحضر" },
    };

    const fallback = config.scheduled;
    const current = status ? config[status] ?? fallback : fallback;

    return <Badge variant={current.variant}>{current.label}</Badge>;
  };

  const getPriorityBadge = (priority: Appointment["priority"]) => {
    if (priority === "urgent") {
      return (
        <Badge variant="destructive" className="text-xs">
          عاجل
        </Badge>
      );
    }
    if (priority === "high") {
      return (
        <Badge variant="default" className="text-xs">
          عالي
        </Badge>
      );
    }
    if (priority === "medium") {
      return (
        <Badge variant="secondary" className="text-xs">
          متوسط
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs">
        منخفض
      </Badge>
    );
  };

  return (
    <Card className="border-blue-200 dark:border-blue-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          الإجراءات
          <Badge variant="secondary" className="text-blue-600 dark:text-blue-400">
            {appointments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedAppointments.map((appointment) => {
            const appointmentDate = appointment.datetime
              ? new Date(appointment.datetime)
              : new Date(appointment.date);

            return (
              <Card
                key={appointment.id}
                className={`border-l-4 hover:shadow-md transition-shadow ${
                  appointment.priority === "urgent"
                    ? "border-l-red-500"
                    : appointment.priority === "high"
                    ? "border-l-orange-500"
                    : "border-l-blue-500"
                }`}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getTypeIcon(appointment.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{appointment.title}</h4>
                            {getPriorityBadge(appointment.priority)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {getTypeName(appointment.type)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status ?? "scheduled")}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {appointmentDate.toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>
                          {appointmentDate.toLocaleTimeString("ar-SA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {appointment.duration && ` (${appointment.duration} دقيقة)`}
                        </span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

