"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Inbox,
  CalendarClock,
  ListTodo,
  CheckCircle2,
  AlertTriangle,
  Timer,
} from "lucide-react";

export interface RequestsCenterStatsProps {
  stats: {
    inbox: number;
    followups: number;
    pending: number;
    overdue: number;
    today: number;
    completed: number;
  };
}

export function RequestsCenterStats({ stats }: RequestsCenterStatsProps) {
  // تم إخفاء كروت الإحصائيات من واجهة الطلبات حسب طلب العميل
  return null;
}
