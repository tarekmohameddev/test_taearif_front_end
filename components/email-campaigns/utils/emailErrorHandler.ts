/**
 * Single place to derive user-facing error message from Email API errors.
 */

import { getEmailApiErrorMessage } from "@/lib/services/email-api";
import { getEmailErrorAr, EMAIL_ERROR_CODES_AR, EMAIL_ERROR_MESSAGES_AR } from "../constants";

function getErrorCode(error: unknown): string | undefined {
  const err = error as { response?: { data?: { code?: string } } };
  return err?.response?.data?.code;
}

export function getEmailUserFacingMessage(error: unknown): string {
  const code = getErrorCode(error);
  const rawMessage = getEmailApiErrorMessage(error);
  const trimmed = rawMessage?.trim() ?? "";
  if (trimmed && EMAIL_ERROR_MESSAGES_AR[trimmed]) return EMAIL_ERROR_MESSAGES_AR[trimmed];
  if (code && EMAIL_ERROR_CODES_AR[code]) return EMAIL_ERROR_CODES_AR[code];
  return getEmailErrorAr(rawMessage);
}
