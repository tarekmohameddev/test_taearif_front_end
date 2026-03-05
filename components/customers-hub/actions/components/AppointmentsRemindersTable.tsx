"use client";

import { cn } from "@/lib/utils";
import { formatAppointmentDatetime } from "../utils/dateTimeUtils";

export interface AppointmentRow {
  id?: number | string;
  title?: string;
  type?: string;
  datetime?: string;
  status?: string;
  notes?: string;
}

export interface ReminderRow {
  id?: number | string;
  title?: string;
  description?: string;
  datetime?: string;
  status?: string;
  priority?: string;
}

interface AppointmentsRemindersTableProps {
  appointments?: AppointmentRow[];
  reminders?: ReminderRow[];
  className?: string;
}

export function AppointmentsRemindersTable({
  appointments = [],
  reminders = [],
  className = "",
}: AppointmentsRemindersTableProps) {
  const hasAppointments = Array.isArray(appointments) && appointments.length > 0;
  const hasReminders = Array.isArray(reminders) && reminders.length > 0;
  if (!hasAppointments && !hasReminders) return null;

  return (
    <div
      className={cn(
        "mt-3 p-2.5 rounded-xl w-[350px] max-w-[450px]",
        "bg-white/85 dark:bg-gray-800/90 border border-gray-200/90 dark:border-gray-600/90",
        "border-r-2 border-r-slate-300/80 dark:border-r-slate-600/80",
        "shadow-sm",
        className
      )}
    >
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 pb-1 border-b border-gray-200 dark:border-gray-600">
        الاجراءات
      </p>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
            <th className="text-right py-1.5 px-1.5 font-semibold">العنوان</th>
            <th className="text-right py-1.5 px-1.5 font-semibold">التاريخ والوقت</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {hasAppointments &&
            appointments.map((apt, i) => (
              <tr
                key={apt.id ?? `apt-${i}`}
                className="border-b border-gray-100 dark:border-gray-700/50"
              >
                <td className="py-1 px-1.5">{apt.title ?? "—"}</td>
                <td className="py-1 px-1.5 dir-ltr">
                  {formatAppointmentDatetime(apt.datetime)}
                </td>
              </tr>
            ))}
          {hasReminders &&
            reminders.map((rem, i) => (
              <tr
                key={rem.id ?? `rem-${i}`}
                className="border-b border-gray-100 dark:border-gray-700/50"
              >
                <td className="py-1 px-1.5">{rem.title ?? rem.description ?? "—"}</td>
                <td className="py-1 px-1.5 dir-ltr">
                  {formatAppointmentDatetime(rem.datetime)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
