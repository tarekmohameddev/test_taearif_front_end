"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, LayoutGrid, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SMSLog } from "./types";
import { getStatusColor, STATUS_LABELS } from "./constants";

const LOG_STATUS_LABELS: Record<string, string> = {
  delivered: "تم التوصيل",
  sent: "مرسلة",
  failed: "فشل",
  pending: "قيد الإرسال",
};

interface SmsLogsListProps {
  logs: SMSLog[];
  loading: boolean;
  error: string | null;
}

export function SmsLogsList({ logs, loading, error }: SmsLogsListProps) {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const statusLabel = (status: string) =>
    LOG_STATUS_LABELS[status] ?? STATUS_LABELS[status] ?? status;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>سجل الإرسال</CardTitle>
            <CardDescription>عرض تفصيلي لجميع الرسائل المرسلة</CardDescription>
          </div>
          <div className="flex items-center rounded-md bg-muted/60 p-1 mt-2 sm:mt-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 w-10 p-0 hover:bg-background [&_svg]:!h-5 [&_svg]:!w-5",
                viewMode === "cards" && "bg-background"
              )}
              onClick={() => setViewMode("cards")}
              title="عرض البطاقات"
            >
              <LayoutGrid />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 w-10 p-0 hover:bg-background [&_svg]:!h-5 [&_svg]:!w-5",
                viewMode === "table" && "bg-background"
              )}
              onClick={() => setViewMode("table")}
              title="عرض الجدول"
            >
              <Table2 />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading && (
          <div className="flex items-center gap-2 py-8">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-muted-foreground">جاري تحميل السجل...</span>
          </div>
        )}

        {!loading && viewMode === "cards" && (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                      log.status === "delivered"
                        ? "bg-green-500"
                        : log.status === "sent"
                          ? "bg-blue-500"
                          : log.status === "failed"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium">{log.contactName}</p>
                      <Badge variant="outline" className={getStatusColor(log.status)}>
                        {statusLabel(log.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{log.phone}</p>
                    <div className="bg-muted p-2 rounded text-sm mb-2">{log.message}</div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>الحملة: {log.campaignName || (log.campaignId ? `#${log.campaignId}` : "—")}</span>
                      <span>
                        أرسلت:{" "}
                        {log.sentAt
                          ? new Date(log.sentAt).toLocaleString("ar-SA")
                          : "لم ترسل بعد"}
                      </span>
                      {log.deliveredAt && (
                        <span>
                          وصلت: {new Date(log.deliveredAt).toLocaleString("ar-SA")}
                        </span>
                      )}
                    </div>
                    {log.errorMessage && (
                      <p className="text-xs text-red-600 mt-1">خطأ: {log.errorMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && viewMode === "table" && (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">الرسالة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الحملة</TableHead>
                  <TableHead className="text-right">أرسلت</TableHead>
                  <TableHead className="text-right">وصلت</TableHead>
                  <TableHead className="text-right">خطأ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium text-right">{log.contactName || "—"}</TableCell>
                    <TableCell className="text-right dir-ltr">{log.phone}</TableCell>
                    <TableCell className="text-right max-w-[200px] truncate" title={log.message}>
                      {log.message}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={getStatusColor(log.status)}>
                        {statusLabel(log.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {log.campaignName || (log.campaignId ? `#${log.campaignId}` : "—")}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {log.sentAt
                        ? new Date(log.sentAt).toLocaleString("ar-SA")
                        : "لم ترسل بعد"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {log.deliveredAt
                        ? new Date(log.deliveredAt).toLocaleString("ar-SA")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm text-red-600 max-w-[150px] truncate" title={log.errorMessage ?? ""}>
                      {log.errorMessage || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
