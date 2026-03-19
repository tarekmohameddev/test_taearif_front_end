import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

/**
 * منع تكرار طلبات الـ GET لنفس المورد (مثل وضع React Strict Mode أو عدة مكوّنات تستدعي نفس الدالة).
 * يطابق منطق docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md:
 *
 * 1) حارس التحميل (CHECK 1): طلب جارٍ لنفس المورد → إرجاع نفس الـ Promise.
 * 2) حارس الكاش (CHECK 2): نجاح سابق في الجلسة → إرجاع البيانات المخزّنة دون طلب.
 * 3) عند الفشل: لا نُعلّم settled → يمكن إعادة المحاولة لاحقاً.
 *
 * الطلبات المغطاة هنا:
 * - GET /properties/categories   (أنواع الوحدات)
 * - GET /property/facades        (الواجهات)
 * - GET /user/projects           (مشاريع المستخدم)
 * - GET /buildings               (العمارات)
 */
function createPreventDuplicateGet<T>(loader: () => Promise<T>) {
  let settled = false;
  let cached: T | undefined;
  let inFlight: Promise<T> | null = null;

  return async (): Promise<T> => {
    // CHECK 1 — طلب لنفس المورد قيد التنفيذ (loading guard)
    if (inFlight) return inFlight;
    // CHECK 2 — بيانات جاهزة من طلب ناجح سابق (cache guard)
    if (settled) return cached as T;

    inFlight = loader()
      .then((result) => {
        settled = true;
        cached = result;
        return result;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  };
}

/** GET /properties/categories — أنواع الوحدات */
export const fetchCategories = createPreventDuplicateGet(async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/properties/categories");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error("حدث خطأ أثناء جلب أنواع الوحدات.");
    throw error;
  }
});

/** GET /property/facades — الواجهات */
export const fetchFacades = createPreventDuplicateGet(async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/property/facades");
    return response.data.data;
  } catch (error) {
    console.error("خطأ في جلب الواجهات:", error);
    throw error;
  }
});

/** GET /user/projects — مشاريع المستخدم */
export const fetchProjects = createPreventDuplicateGet(async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/user/projects");
    return response.data.data.user_projects;
  } catch (error) {
    toast.error("حدث خطأ أثناء جلب المشاريع.");
    throw error;
  }
});

/** GET /buildings — العمارات */
export const fetchBuildings = createPreventDuplicateGet(async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/buildings");
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching buildings:", error);
    toast.error("حدث خطأ أثناء جلب العمارات.");
    throw error;
  }
});

/**
 * GET /property-faqs — أسئلة مقترحة (نفس نمط منع التكرار؛ لا يُشترط في رسالتك لكنه يبقى متسقاً مع النموذج).
 */
export const fetchSuggestedFaqs = createPreventDuplicateGet(async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/property-faqs");
    return response.data.data.suggestedFaqs || [];
  } catch (error) {
    console.error("Error fetching suggested FAQs:", error);
    return [];
  }
});
