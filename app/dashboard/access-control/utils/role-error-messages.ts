/**
 * Maps API/validation error messages to Arabic for role operations.
 */

const MESSAGE_MAP: Record<string, string> = {
  "Validation failed": "فشل في التحقق من صحة البيانات",
  Unauthorized: "غير مصرح لك بالوصول",
  Forbidden: "ممنوع الوصول",
  "Not Found": "غير موجود",
  "Server Error": "خطأ في الخادم",
  "Role already exists": "اسم الدور موجود بالفعل",
  "Invalid permissions": "الصلاحيات المحددة غير صحيحة",
  "Permission denied": "ليس لديك صلاحية للقيام بهذا الإجراء",
  "Network error": "خطأ في الاتصال بالشبكة",
  Timeout: "انتهت مهلة الاتصال",
};

const VALIDATION_PHRASES: Record<string, string> = {
  required: "مطلوب",
  unique: "موجود بالفعل",
  min: "قصير جداً",
  max: "طويل جداً",
  invalid: "غير صحيح",
  email: "البريد الإلكتروني غير صحيح",
  password: "كلمة المرور غير صحيحة",
};

export function translateRoleCreateError(error: unknown): string {
  const fallback = "فشل في إنشاء الدور";
  const err = error as {
    response?: {
      data?: {
        message?: string;
        errors?: Record<string, string[]>;
      };
      status?: number;
    };
    code?: string;
  };

  const message = err?.response?.data?.message;
  if (message && MESSAGE_MAP[message]) {
    return MESSAGE_MAP[message];
  }
  if (message) {
    return message;
  }

  const errors = err?.response?.data?.errors;
  if (errors) {
    if (errors.name) {
      const nameError = errors.name[0] ?? "";
      for (const [phrase, ar] of Object.entries(VALIDATION_PHRASES)) {
        if (nameError.toLowerCase().includes(phrase)) {
          return phrase === "required" ? "اسم الدور مطلوب" : `اسم الدور: ${ar}`;
        }
      }
      return `اسم الدور: ${nameError}`;
    }
    if (errors.permissions) {
      const permError = errors.permissions[0] ?? "";
      if (permError.includes("required")) return "يجب تحديد صلاحية واحدة على الأقل";
      if (permError.includes("invalid")) return "الصلاحيات المحددة غير صحيحة";
      return `الصلاحيات: ${permError}`;
    }
    const allErrors = Object.values(errors).flat();
    const translated = allErrors.map((e) => {
      const s = String(e);
      for (const [phrase, ar] of Object.entries(VALIDATION_PHRASES)) {
        if (s.includes(phrase)) return ar;
      }
      return s;
    });
    return translated.join(", ");
  }

  const status = err?.response?.status;
  if (status === 422) return "البيانات المرسلة غير صحيحة";
  if (status === 409) return "اسم الدور موجود بالفعل";
  if (status === 403) return "ليس لديك صلاحية لإنشاء أدوار";
  if (status === 500) return "خطأ في الخادم، يرجى المحاولة لاحقاً";

  if (err?.code === "NETWORK_ERROR") return "خطأ في الاتصال بالخادم";
  if (err?.code === "ECONNABORTED") return "انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى";

  return fallback;
}
