import { ComponentData } from "@/lib/types";

// أنواع مشتركة لجميع component functions
export type ComponentState = Record<string, ComponentData>;

export interface ComponentFunctions {
  ensureVariant: (variantId: string, initial?: ComponentData) => any;
  getData: (variantId: string) => ComponentData;
  setData: (variantId: string, data: ComponentData) => any;
  updateByPath: (variantId: string, path: string, value: any) => any;
}

// دالة مساعدة لإنشاء بيانات افتراضية
export const createDefaultData = (type: string): ComponentData => {
  // بيانات افتراضية بسيطة للمكونات
  return {
    visible: true,
    texts: {
      title: `${type} Title`,
      subtitle: "This is a sample subtitle for the section.",
    },
    colors: {
      background: "#FFFFFF",
      textColor: "#1F2937",
    },
    settings: {
      enabled: true,
      layout: "default",
    },
  };
};

// دالة مساعدة لتحديث البيانات عبر مسار
export const updateDataByPath = (
  source: any,
  path: string,
  value: any,
): any => {
  // إصلاح المسارات المكررة (مثل spacing.padding.padding.top.top)
  const segments = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  // إزالة المفاتيح المكررة المتتالية
  const cleanedSegments = segments.reduce(
    (acc: string[], segment: string, index: number) => {
      if (index === 0 || segment !== acc[acc.length - 1]) {
        acc.push(segment);
      }
      return acc;
    },
    [],
  );

  // إنشاء نسخة عميقة من البيانات
  const newData = JSON.parse(JSON.stringify(source));
  let cursor: any = newData;

  // التنقل إلى الموقع الصحيح باستخدام المسار المنظف
  for (let i = 0; i < cleanedSegments.length - 1; i++) {
    const key = cleanedSegments[i]!;
    const nextIsIndex = !Number.isNaN(Number(cleanedSegments[i + 1]));

    // إذا لم يكن المفتاح موجود، أنشئه
    if (cursor[key] == null) {
      cursor[key] = nextIsIndex ? [] : {};
    }

    // إذا كان المفتاح موجود ولكن بنوع خاطئ (primitive type)، أصلحه
    // هذا يحدث عندما نحاول الوصول إلى خاصية على string/number/boolean
    if (
      typeof cursor[key] !== "object" ||
      cursor[key] === null ||
      Array.isArray(cursor[key]) !== nextIsIndex
    ) {
      // إذا كان primitive type (string, number, boolean) ونريد الوصول إلى خاصية،
      // نحتاج إلى تحويله إلى object
      if (nextIsIndex) {
        cursor[key] = [];
      } else {
        // إذا كانت القيمة الحالية string/number/boolean، نحفظها في خاصية value
        const currentValue = cursor[key];
        cursor[key] = {};
        // إذا كانت القيمة string وتبدأ بـ # (لون)، نحفظها في value
        if (
          typeof currentValue === "string" &&
          currentValue.trim() !== "" &&
          currentValue.startsWith("#")
        ) {
          cursor[key].value = currentValue;
        }
      }
    }

    // إذا كان المفتاح موجود ولكن بنوع خاطئ (array vs object)
    if (nextIsIndex && !Array.isArray(cursor[key])) {
      cursor[key] = [];
    } else if (!nextIsIndex && Array.isArray(cursor[key])) {
      cursor[key] = {};
    }

    cursor = cursor[key];
  }

  // تحديث القيمة النهائية
  const lastKey = cleanedSegments[cleanedSegments.length - 1]!;
  
  // إذا كان cursor[lastKey] هو primitive type (string/number/boolean) ونريد تحديث خاصية،
  // نحتاج إلى تحويله إلى object أولاً
  if (
    cursor[lastKey] != null &&
    (typeof cursor[lastKey] === "string" ||
      typeof cursor[lastKey] === "number" ||
      typeof cursor[lastKey] === "boolean")
  ) {
    // حفظ القيمة الحالية في خاصية value
    const currentValue = cursor[lastKey];
    cursor[lastKey] = {};
    // إذا كانت القيمة string وتبدأ بـ # (لون)، نحفظها في value
    if (
      typeof currentValue === "string" &&
      currentValue.trim() !== "" &&
      currentValue.startsWith("#")
    ) {
      cursor[lastKey].value = currentValue;
    }
  }
  
  cursor[lastKey] = value;

  return newData;
};
