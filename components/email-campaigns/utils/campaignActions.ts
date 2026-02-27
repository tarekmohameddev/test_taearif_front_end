/**
 * Pure helpers for campaign actions. No API or side effects.
 */

import type { CampaignStatus } from "../types";

export function canPauseCampaign(status: CampaignStatus): boolean {
  return status === "in-progress" || status === "scheduled";
}

export function canEditCampaign(status: CampaignStatus): boolean {
  return status === "draft" || status === "scheduled" || status === "paused";
}

export function canResumeCampaign(status: CampaignStatus): boolean {
  return status === "paused";
}

export function canSendCampaign(status: CampaignStatus): boolean {
  return status === "draft" || status === "scheduled";
}
