import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Timer,
  CalendarDays,
  Inbox,
  Target,
} from "lucide-react";

interface ActionsStatsProps {
  stats: {
    completionRate: number;
    completed: number;
    pending: number;
    urgentCount: number;
    overdueCount: number;
    todayCount: number;
  };
  incomingActionsCount: number;
}

export function ActionsStats({ stats, incomingActionsCount }: ActionsStatsProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5" />
              <span className="font-medium">تقدم اليوم</span>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-4xl font-bold">{stats.completionRate}%</span>
              <span className="text-white/70 mb-1">من الإجراءات مكتملة</span>
            </div>
            <Progress value={stats.completionRate} className="h-2 bg-white/20" />
            <div className="flex items-center justify-between mt-2 text-sm text-white/70">
              <span>{stats.completed} مكتمل</span>
              <span>{stats.pending} متبقي</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-red-300" />
              <div className="text-2xl font-bold">{stats.urgentCount}</div>
              <div className="text-xs text-white/70">عاجل</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <Timer className="h-6 w-6 mx-auto mb-1 text-orange-300" />
              <div className="text-2xl font-bold">{stats.overdueCount}</div>
              <div className="text-xs text-white/70">متأخر</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <CalendarDays className="h-6 w-6 mx-auto mb-1 text-blue-300" />
              <div className="text-2xl font-bold">{stats.todayCount}</div>
              <div className="text-xs text-white/70">اليوم</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <Inbox className="h-6 w-6 mx-auto mb-1 text-green-300" />
              <div className="text-2xl font-bold">{incomingActionsCount}</div>
              <div className="text-xs text-white/70">وارد</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
