import axios from "axios";
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  RegisterRequest,
  RegisterResponse,
  ApiError,
} from "../types/register-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_Backend_URL || "";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
  const phone = `966${data.phone}`;
  const response = await authApi.post<SendOtpResponse>("/auth/send-otp", {
    phone,
  });
  return response.data;
}

export async function verifyOtp(
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> {
  const phone = `966${data.phone}`;
  const response = await authApi.post<VerifyOtpResponse>("/auth/verify-otp", {
    phone,
    otp: data.otp,
  });
  return response.data;
}

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const response = await authApi.post<RegisterResponse>("/register", data);
  return response.data;
}

/** Known Laravel / backend validation strings → Arabic */
const VALIDATION_MESSAGE_AR: Record<string, string> = {
  "The email has already been taken.": "البريد الإلكتروني مستخدم بالفعل.",
  "The email has already been taken": "البريد الإلكتروني مستخدم بالفعل.",
  "The username has already been taken.": "اسم المستخدم مستخدم بالفعل.",
  "The username has already been taken": "اسم المستخدم مستخدم بالفعل.",
  "The phone has already been taken.": "رقم الجوال مسجل مسبقاً.",
  "The phone has already been taken": "رقم الجوال مسجل مسبقاً.",
  "The phone field is required.": "رقم الجوال مطلوب.",
  "The email field is required.": "البريد الإلكتروني مطلوب.",
  "The username field is required.": "اسم المستخدم مطلوب.",
  "The password field is required.": "كلمة المرور مطلوبة.",
  "The verified token field is required.": "رمز التحقق مطلوب.",
  "The verified token is invalid.": "رمز التحقق غير صالح أو منتهي الصلاحية.",
  "The password must be at least 8 characters.":
    "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل.",
  "The email must be a valid email address.":
    "البريد الإلكتروني غير صالح.",
};

const VALIDATION_FIELD_ORDER = [
  "email",
  "username",
  "password",
  "phone",
  "verified_token",
  "recaptcha_token",
] as const;

function mapValidationMessage(msg: string): string {
  const trimmed = msg?.trim();
  if (!trimmed) return "البيانات المدخلة غير صالحة.";
  return VALIDATION_MESSAGE_AR[trimmed] ?? trimmed;
}

function formatValidationErrors(
  errors: Record<string, string[] | undefined>
): string {
  const parts: string[] = [];
  const seen = new Set<string>();

  for (const field of VALIDATION_FIELD_ORDER) {
    const messages = errors[field];
    if (messages?.length) {
      const m = mapValidationMessage(messages[0]);
      if (!seen.has(m)) {
        seen.add(m);
        parts.push(m);
      }
    }
  }

  for (const [field, messages] of Object.entries(errors)) {
    if (VALIDATION_FIELD_ORDER.includes(field as (typeof VALIDATION_FIELD_ORDER)[number]))
      continue;
    if (messages?.length) {
      const m = mapValidationMessage(messages[0]);
      if (!seen.has(m)) {
        seen.add(m);
        parts.push(m);
      }
    }
  }

  return parts.length > 0 ? parts.join(" ") : "البيانات المدخلة غير صالحة.";
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;

    if (
      apiError?.errors &&
      typeof apiError.errors === "object" &&
      Object.keys(apiError.errors).length > 0
    ) {
      return formatValidationErrors(apiError.errors);
    }

    if (apiError?.message && apiError.message !== "Validation failed") {
      return mapValidationMessage(apiError.message);
    }

    if (apiError?.error) {
      switch (apiError.error) {
        case "rate_limit_exceeded":
          return "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً.";
        case "otp_invalid":
          return "رمز التحقق غير صحيح.";
        case "otp_expired":
          return "انتهت صلاحية رمز التحقق.";
        case "too_many_attempts":
          return "تم تجاوز عدد المحاولات المسموحة.";
        case "otp_not_found":
          return "لم يتم العثور على رمز التحقق.";
        case "invalid_or_expired_temp_token":
          return "انتهت صلاحية رمز التحقق. يرجى البدء من جديد.";
        case "already_registered":
          return "هذا الرقم مسجل مسبقاً.";
        default:
          return apiError.error;
      }
    }
    if (error.response?.status === 429) {
      return "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً.";
    }
    if (error.response?.status === 422) {
      return "البيانات المدخلة غير صالحة.";
    }
    if (error.response?.status && error.response.status >= 500) {
      return "حدث خطأ في الخادم. يرجى المحاولة لاحقاً.";
    }
  }
  return "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.";
}
