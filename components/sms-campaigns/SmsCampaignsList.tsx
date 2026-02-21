"use client";

import { Send, Clock, Coins, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SMSCampaign } from "./types";
import { getStatusColor, STATUS_LABELS } from "./constants";
import { CREDITS_PER_SMS } from "./SMSCreditBalance";

interface SmsCampaignsListProps {
  campaigns: SMSCampaign[];
  loading: boolean;
  error: string | null;
  availableCredits: number;
  onNewCampaign: () => void;
  onSendCampaign: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
}

export function SmsCampaignsList({
  campaigns,
  loading,
  error,
  availableCredits,
  onNewCampaign,
  onSendCampaign,
  onDeleteCampaign,
}: SmsCampaignsListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>جميع الحملات</CardTitle>
            <CardDescription>إدارة وعرض جميع حملات الرسائل النصية</CardDescription>
          </div>
          <Button onClick={onNewCampaign}>
            <Plus className="h-4 w-4 ml-2" />
            إنشاء حملة جديدة
          </Button>
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
            <span className="text-muted-foreground">جاري تحميل الحملات...</span>
          </div>
        )}
        <div className="space-y-4">
          {!loading &&
            campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <Badge variant="outline" className={getStatusColor(campaign.status)}>
                          {STATUS_LABELS[campaign.status] ?? campaign.status}
                        </Badge>
                      </div>
                      {campaign.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {campaign.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        تعديل
                      </Button>
                      {(campaign.status === "draft" || campaign.status === "scheduled") && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onSendCampaign(campaign.id)}
                        >
                          إرسال
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteCampaign(campaign.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <p className="text-sm">{campaign.message}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي المستلمين</p>
                      <p className="text-2xl font-bold">{campaign.recipientCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تم الإرسال</p>
                      <p className="text-2xl font-bold">{campaign.sentCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تم التوصيل</p>
                      <p className="text-2xl font-bold text-green-600">
                        {campaign.deliveredCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">فشل</p>
                      <p className="text-2xl font-bold text-red-600">{campaign.failedCount}</p>
                    </div>
                  </div>
                  {campaign.recipientCount > 0 && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                      <Coins className="h-4 w-4" />
                      <span>
                        تكلفة الإرسال: {campaign.recipientCount * CREDITS_PER_SMS} كريديت
                        {availableCredits < campaign.recipientCount * CREDITS_PER_SMS &&
                          (campaign.status === "draft" || campaign.status === "scheduled") && (
                            <Badge variant="destructive" className="mr-2">
                              رصيد غير كافٍ
                            </Badge>
                          )}
                      </span>
                    </div>
                  )}

                  {campaign.status === "in-progress" && campaign.recipientCount > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">التقدم</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((campaign.sentCount / campaign.recipientCount) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(campaign.sentCount / campaign.recipientCount) * 100}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {campaign.scheduledAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            مجدولة:{" "}
                            {new Date(campaign.scheduledAt).toLocaleString("ar-SA")}
                          </span>
                        </div>
                      )}
                      {campaign.sentAt && (
                        <div className="flex items-center gap-1">
                          <Send className="h-4 w-4" />
                          <span>
                            أرسلت: {new Date(campaign.sentAt).toLocaleString("ar-SA")}
                          </span>
                        </div>
                      )}
                      <span>بواسطة: {campaign.createdBy}</span>
                    </div>
                    {campaign.tags && campaign.tags.length > 0 && (
                      <div className="flex gap-1">
                        {campaign.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
