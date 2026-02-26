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
  return (
    <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <Inbox className="h-6 w-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.inbox}</div>
            <div className="text-xs text-white/80">طلبات واردة</div>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <CalendarClock className="h-6 w-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.followups}</div>
            <div className="text-xs text-white/80">متابعات</div>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <ListTodo className="h-6 w-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-xs text-white/80">إجمالي المعلق</div>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-red-200" />
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <div className="text-xs text-white/80">متأخر</div>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <Timer className="h-6 w-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.today}</div>
            <div className="text-xs text-white/80">اليوم</div>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <CheckCircle2 className="h-6 w-6 mx-auto mb-1" />
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-xs text-white/80">مكتمل</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
