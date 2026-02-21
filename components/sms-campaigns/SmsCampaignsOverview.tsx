"use client";

import { FileText, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SMSCampaign, SMSTemplate } from "./types";
import { getStatusColor, getCategoryColor, STATUS_LABELS, CATEGORY_LABELS } from "./constants";

interface SmsCampaignsOverviewProps {
  campaigns: SMSCampaign[];
  templates: SMSTemplate[];
  campaignsLoading: boolean;
  templatesLoading: boolean;
  campaignsError: string | null;
  templatesError: string | null;
  onNewCampaign: () => void;
}

export function SmsCampaignsOverview({
  campaigns,
  templates,
  campaignsLoading,
  templatesLoading,
  campaignsError,
  templatesError,
  onNewCampaign,
}: SmsCampaignsOverviewProps) {
  const activeCampaigns = campaigns.filter((c) => c.status !== "draft").slice(0, 3);
  const activeTemplates = templates.filter((t) => t.isActive).slice(0, 4);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الحملات النشطة</CardTitle>
            <Button size="sm" onClick={onNewCampaign}>
              <Plus className="h-4 w-4 ml-2" />
              حملة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaignsError && (
              <Alert variant="destructive">
                <AlertDescription>{campaignsError}</AlertDescription>
              </Alert>
            )}
            {campaignsLoading && (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">جاري التحميل...</span>
              </div>
            )}
            {!campaignsLoading &&
              activeCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <Badge variant="outline" className={getStatusColor(campaign.status)}>
                        {STATUS_LABELS[campaign.status] ?? campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{campaign.recipientCount} مستلم</span>
                      {campaign.sentCount > 0 && (
                        <span>{campaign.deliveredCount} تم التوصيل</span>
                      )}
                    </div>
                    {campaign.status === "in-progress" && campaign.recipientCount > 0 && (
                      <Progress
                        value={(campaign.sentCount / campaign.recipientCount) * 100}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>القوالب الأكثر استخداماً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templatesError && (
              <Alert variant="destructive">
                <AlertDescription>{templatesError}</AlertDescription>
              </Alert>
            )}
            {templatesLoading && (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">جاري التحميل...</span>
              </div>
            )}
            {!templatesLoading &&
              activeTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">{template.name}</h4>
                    </div>
                    <Badge variant="outline" className={getCategoryColor(template.category)}>
                      {CATEGORY_LABELS[template.category] ?? template.category}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    استخدم
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
