"use client";

import { Clock, CheckCircle, Users, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AIStats } from "../types";

interface AIResponderStatsCardsProps {
  stats: AIStats;
}

export function AIResponderStatsCards({ stats }: AIResponderStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ردود اليوم</p>
              <p className="text-2xl font-bold">{stats.totalResponses24h}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">وقت الرد</p>
              <p className="text-2xl font-bold">{stats.avgResponseTime}ث</p>
            </div>
            <Clock className="h-8 w-8 text-green-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">رضا العملاء</p>
              <p className="text-2xl font-bold">{stats.satisfactionRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">تحويل لموظف</p>
              <p className="text-2xl font-bold">{stats.handoffRate}%</p>
            </div>
            <Users className="h-8 w-8 text-orange-600 opacity-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
