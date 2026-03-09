"use client";

import { Zap, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AutomationStats } from "./types";

interface AutomationStatsCardsProps {
  stats: AutomationStats | null;
}

export function AutomationStatsCards({ stats }: AutomationStatsCardsProps) {
  const totalRules = stats?.totalRules ?? 0;
  const activeRules = stats?.activeRules ?? 0;
  const messagesSent24h = stats?.messagesSent24h ?? 0;
  const successRate = stats?.successRate ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي القواعد</p>
              <p className="text-2xl font-bold">{totalRules}</p>
            </div>
            <Zap className="h-8 w-8 text-blue-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">القواعد النشطة</p>
              <p className="text-2xl font-bold text-green-600">{activeRules}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">رسائل اليوم</p>
              <p className="text-2xl font-bold">{messagesSent24h}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">معدل النجاح</p>
              <p className="text-2xl font-bold">{successRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-600 opacity-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
