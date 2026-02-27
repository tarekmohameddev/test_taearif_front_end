"use client";

import { MessageSquare, Send, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import type { EmailStats } from "./types";

interface EmailCampaignsStatsProps {
  stats: EmailStats;
  loading: boolean;
}

export function EmailCampaignsStats({ stats, loading }: EmailCampaignsStatsProps) {
  const failRate =
    stats.totalSent > 0
      ? ((stats.totalFailed / stats.totalSent) * 100).toFixed(1)
      : "0";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الحملات</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">جميع الحملات</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المرسلة</CardTitle>
          <Send className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats.totalSent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.thisMonthSent.toLocaleString()} هذا الشهر
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">تم التوصيل</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats.totalDelivered.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.deliveryRate}% نسبة التوصيل
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">فشل</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats.totalFailed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {failRate}% معدل الفشل
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="text-2xl font-bold text-green-600">
                {stats.deliveryRate}%
              </div>
              <Progress value={stats.deliveryRate} className="mt-2" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
