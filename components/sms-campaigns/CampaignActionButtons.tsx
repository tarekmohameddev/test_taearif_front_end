"use client";

import { Button } from "@/components/ui/button";
import {
  canEditCampaign,
  canPauseCampaign,
  canResumeCampaign,
  canSendCampaign,
} from "./utils";
import type { SMSCampaign } from "./types";
import type { ResumeCampaignBody } from "@/lib/services/sms-api";

export interface CampaignActionButtonsProps {
  campaign: SMSCampaign;
  onPause: (id: string) => void;
  onResume: (id: string, params: ResumeCampaignBody) => void;
  onEdit: (campaign: SMSCampaign) => void;
  onSend: (id: string, name: string) => void;
  onDelete: (id: string, name: string) => void;
  /** Optional: when restart with new list is in progress (disable other resume actions) */
  resumeLoading?: boolean;
  /** Optional: when pause is in progress */
  pauseLoading?: boolean;
  variant?: "default" | "compact";
}

export function CampaignActionButtons({
  campaign,
  onPause,
  onResume,
  onEdit,
  onSend,
  onDelete,
  resumeLoading = false,
  pauseLoading = false,
  variant = "default",
}: CampaignActionButtonsProps) {
  const showPause = canPauseCampaign(campaign.status);
  const showResume = canResumeCampaign(campaign.status);
  const showEdit = canEditCampaign(campaign.status);
  const showSend = canSendCampaign(campaign.status);
  const size = variant === "compact" ? "sm" : "sm";

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {showEdit && (
        <Button variant="outline" size={size} onClick={() => onEdit(campaign)}>
          تعديل
        </Button>
      )}
      {showSend && (
        <Button
          variant="default"
          size={size}
          onClick={() => onSend(campaign.id, campaign.name)}
        >
          إرسال
        </Button>
      )}
      {showPause && (
        <Button
          variant="outline"
          size={size}
          onClick={() => onPause(campaign.id)}
          disabled={pauseLoading}
        >
          {pauseLoading ? "جاري الإيقاف..." : "إيقاف مؤقت"}
        </Button>
      )}
      {showResume && (
        <>
          <Button
            variant="outline"
            size={size}
            onClick={() => onResume(campaign.id, { mode: "continue" })}
            disabled={resumeLoading}
          >
            متابعة
          </Button>
          <Button
            variant="outline"
            size={size}
            onClick={() => onResume(campaign.id, { mode: "restart" })}
            disabled={resumeLoading}
          >
            إعادة من البداية
          </Button>
        </>
      )}
      <Button
        variant="outline"
        size={size}
        onClick={() => onDelete(campaign.id, campaign.name)}
      >
        حذف
      </Button>
    </div>
  );
}
