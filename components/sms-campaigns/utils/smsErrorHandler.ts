/**
 * Single place to derive user-facing error message from SMS API errors.
 */

import { getSmsApiErrorMessage } from "@/lib/services/sms-api";
import { getSmsErrorAr, SMS_ERROR_CODES_AR, SMS_ERROR_MESSAGES_AR } from "../constants";

/** Axios/API error shape for code extraction */
function getErrorCode(error: unknown): string | undefined {
  const err = error as { response?: { data?: { code?: string } } };
  return err?.response?.data?.code;
}

/**
 * Returns a user-facing Arabic message for SMS API errors.
 * Prefers specific message translation (e.g. "No recipients to restart..."), then code, then raw message.
 */
export function getSmsUserFacingMessage(error: unknown): string {
  const code = getErrorCode(error);
  const rawMessage = getSmsApiErrorMessage(error);
  const trimmed = rawMessage?.trim() ?? "";
  if (trimmed && SMS_ERROR_MESSAGES_AR[trimmed]) return SMS_ERROR_MESSAGES_AR[trimmed];
  if (code && SMS_ERROR_CODES_AR[code]) return SMS_ERROR_CODES_AR[code];
  return getSmsErrorAr(rawMessage);
}
