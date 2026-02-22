"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>سجل الإرسال</CardTitle>
        <CardDescription>عرض تفصيلي لجميع الرسائل المرسلة</CardDescription>
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
        <div className="space-y-3">
          {!loading &&
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${
                      log.status === "delivered"
                        ? "bg-green-500"
                        : log.status === "sent"
                          ? "bg-blue-500"
                          : log.status === "failed"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{log.contactName}</p>
                      <Badge variant="outline" className={getStatusColor(log.status)}>
                        {LOG_STATUS_LABELS[log.status] ?? STATUS_LABELS[log.status] ?? log.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{log.phone}</p>
                    <div className="bg-muted p-2 rounded text-sm mb-2">{log.message}</div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
      </CardContent>
    </Card>
  );
}
