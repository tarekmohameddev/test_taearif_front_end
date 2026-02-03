import axios from "axios";
import https from "https";

// إنشاء httpsAgent لتجاوز التحقق من الشهادة في بيئة التطوير
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
});

// إنشاء instance مع تعيين عنوان القاعدة (baseURL) وإعدادات HTTPS
// هذا الـ instance مخصص للـ Public APIs التي لا تحتاج authentication
const baseURL = process.env.NEXT_PUBLIC_Backend_URL;

const publicApiInstance = axios.create({
  baseURL: baseURL,
  httpsAgent: httpsAgent,
});

// معالج الطلب - إزالة "/api" من بداية الـ URL إذا كان موجوداً
// هذا يمنع تكرار "/api" في الـ URL النهائي لأن baseURL يحتوي بالفعل على "/api"
publicApiInstance.interceptors.request.use(
  (config) => {
    // إزالة "/api" من بداية الـ URL إذا كان موجوداً
    if (config.url && config.url.startsWith("/api")) {
      config.url = config.url.replace(/^\/api/, "");
    }

    // لا نضيف Authorization header لأن هذه Public APIs
    return config;
  },
  (error) => Promise.reject(error),
);

// معالج الاستجابة
publicApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // معالجة أخطاء مختلفة
    if (error.response) {
      const { status, data } = error.response;

      // معالجة أخطاء الخادم (500)
      if (status >= 500) {
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

export default publicApiInstance;
