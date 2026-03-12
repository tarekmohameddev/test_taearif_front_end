import axios from "axios";
import https from "https";
import { getToken } from "@/lib/axiosTokenRegistry";

// متغير لتتبع حالة القفل
let axiosLocked = false;

// إنشاء httpsAgent لتجاوز التحقق من الشهادة في بيئة التطوير
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
});

// إنشاء instance مع تعيين عنوان القاعدة (baseURL) وإعدادات HTTPS
const baseURL = process.env.NEXT_PUBLIC_Backend_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  httpsAgent: httpsAgent,
});

// استخدام interceptor لإضافة Authorization header قبل كل طلب
axiosInstance.interceptors.request.use(
  (config) => {
    // إذا كان axios مقفل، نرفض الطلب مباشرة
    if (axiosLocked) {
      return Promise.reject(
        new Error("Authentication required. Please login again."),
      );
    }

    // إزالة "/api" من بداية الـ URL إذا كان موجوداً
    // هذا يمنع تكرار "/api" في الـ URL النهائي لأن baseURL يحتوي بالفعل على "/api"
    // مثال: إذا كان baseURL = "https://example.com/api" والـ url = "/api/users"
    // فسيصبح الناتج "https://example.com/api/api/users" (خطأ)
    // بعد هذا التعديل سيصبح "https://example.com/api/users" (صحيح)
    if (config.url && config.url.startsWith("/api")) {
      config.url = config.url.replace(/^\/api/, "");
    }

    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Log warning if token is missing (only in development)
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ Axios Request: No token available in token registry", {
          url: config.url,
          method: config.method,
        });
      }
      // الطلب يُرسل بدون Authorization header في هذه الحالة
      // يمكن إضافة قائمة بالـ endpoints العامة التي لا تحتاج token إذا لزم الأمر
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// معالج الاستجابة
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // معالجة أخطاء مختلفة
    if (error.response) {
      const { status, data } = error.response;

      // معالجة أخطاء المصادقة
      if (status === 401 || (data && data.message === "Too Many Attempts.")) {
        // لا نقفل axios تلقائياً - نسمح بإعادة المحاولة
        // axiosLocked = true; // تم تعطيل القفل التلقائي
      }

      // معالجة أخطاء الخادم (500)
      else if (status >= 500) {
        // إضافة معلومات إضافية للخطأ
        error.serverError = {
          status,
          message: data?.message || "خطأ في الخادم",
          timestamp: new Date().toISOString(),
          url: error.config?.url,
        };
      }

      // معالجة أخطاء العميل (400-499)
      else if (status >= 400 && status < 500) {
        error.clientError = {
          status,
          message: data?.message || "خطأ في الطلب",
          timestamp: new Date().toISOString(),
        };
      }
    }

    // معالجة أخطاء الشبكة
    else if (error.request) {
      error.networkError = {
        message: "خطأ في الاتصال بالخادم. تحقق من اتصال الإنترنت",
        timestamp: new Date().toISOString(),
      };
    }

    // معالجة أخطاء أخرى
    else {
      error.unknownError = {
        message: error.message || "حدث خطأ غير متوقع",
        timestamp: new Date().toISOString(),
      };
    }

    return Promise.reject(error);
  },
);

// دالة لإعادة تفعيل axios بعد تسجيل الدخول
export const unlockAxios = () => {
  axiosLocked = false;
};

// دالة للتحقق من حالة القفل
export const isAxiosLocked = () => axiosLocked;

// دالة لقفل axios يدوياً
export const lockAxios = () => {
  axiosLocked = true;
};

export default axiosInstance;
