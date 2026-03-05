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
        "mt-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 max-w-[250px]",
        className
      )}
    >
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="text-muted-foreground border-b border-gray-200 dark:border-gray-700">
            <th className="text-right py-1 px-1.5 font-medium">النوع</th>
            <th className="text-right py-1 px-1.5 font-medium">التاريخ والوقت</th>
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
