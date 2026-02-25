/**
 * Pure helpers for campaign actions. No API or side effects.
 * Single source for "when to show which action".
 */

import type { CampaignStatus } from "../types";

/** Pause is allowed only for in-progress or scheduled. */
export function canPauseCampaign(status: CampaignStatus): boolean {
  return status === "in-progress" || status === "scheduled";
}

/** Edit is allowed for draft, scheduled, or paused. */
export function canEditCampaign(status: CampaignStatus): boolean {
  return status === "draft" || status === "scheduled" || status === "paused";
}

/** Resume (continue or restart) is allowed only when paused. */
export function canResumeCampaign(status: CampaignStatus): boolean {
  return status === "paused";
}

/** Send is allowed only for draft or scheduled. */
export function canSendCampaign(status: CampaignStatus): boolean {
  return status === "draft" || status === "scheduled";
}
