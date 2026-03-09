/**
 * WhatsApp campaigns — pure helpers (testable)
 */

import type { WaCampaignStatus } from "./types";

/** Parse raw input (newlines/commas) into valid phone strings (digits only, 8–16 length). */
export function parseManualPhones(raw: string): string[] {
  return raw
    .split(/[\n,،]+/)
    .map((s) => s.replace(/\D/g, "").trim())
    .filter((s) => s.length >= 8 && s.length <= 16);
}

export function canSend(status: WaCampaignStatus): boolean {
  return status === "draft" || status === "scheduled";
}

export function canPause(status: WaCampaignStatus): boolean {
  return status === "in_progress" || status === "scheduled";
}

export function canResume(status: WaCampaignStatus): boolean {
  return status === "paused";
}

export function canEdit(status: WaCampaignStatus): boolean {
  return status === "draft" || status === "scheduled" || status === "paused";
}

export function canDelete(status: WaCampaignStatus): boolean {
  return status === "draft" || status === "scheduled";
}
