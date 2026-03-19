import axios from "axios";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ForgotPasswordApiError,
} from "../types/forgot-password-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_Backend_URL || "";

const forgotPasswordApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function sendResetCode(
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  const payload = {
    ...data,
    recaptcha_token: "static_token_for_testing",
  };
  const response = await forgotPasswordApi.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    payload
  );
  return response.data;
}

export async function resetPassword(
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  const payload = {
    ...data,
    recaptcha_token: "static_token_for_testing",
  };
  const response = await forgotPasswordApi.post<ResetPasswordResponse>(
    "/auth/verify-reset-code",
    payload
  );
  return response.data;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ForgotPasswordApiError | undefined;
    if (apiError?.message) {
      switch (apiError.message) {
        case "User not found":
          return "لم يتم العثور على المستخدم";
        case "Too many attempts. Try again later":
          return "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً.";
        case "You have reached the maximum 3 attempts":
          return "لقد وصلت إلى الحد الأقصى من المحاولات (3 محاولات)";
        case "Invalid or expired code":
          return "رمز التحقق غير صحيح أو منتهي الصلاحية";
        default:
          return apiError.message;
      }
    }
    if (error.response?.status === 404) {
      return "لم يتم العثور على المستخدم";
    }
    if (error.response?.status === 429) {
      return "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً.";
    }
    if (error.response?.status && error.response.status >= 500) {
      return "حدث خطأ في الخادم. يرجى المحاولة لاحقاً.";
    }
  }
  return "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.";
}
