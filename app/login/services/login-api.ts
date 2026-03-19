import axios from "axios";
import type {
  LoginRequest,
  LoginResponse,
  LoginApiError,
} from "../types/login-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_Backend_URL || "";

const loginApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const payload = {
    ...data,
    recaptcha_token: "",
  };
  const response = await loginApi.post<LoginResponse>("/login", payload);
  return response.data;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as LoginApiError | undefined;
    if (apiError?.message) {
      switch (apiError.message) {
        case "Invalid credentials":
          return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        case "Account inactive or banned":
          return "الحساب غير نشط أو محظور";
        case "Tenant is inactive; employee login disabled":
          return "حساب المالك غير نشط، تم تعطيل تسجيل دخول الموظفين";
        default:
          return apiError.message;
      }
    }
    if (error.response?.status === 401) {
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
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
