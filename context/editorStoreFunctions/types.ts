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

    // إذا كان المفتاح موجود ولكن بنوع خاطئ، أصلحه
    if (nextIsIndex && !Array.isArray(cursor[key])) {
      cursor[key] = [];
    } else if (!nextIsIndex && Array.isArray(cursor[key])) {
      cursor[key] = {};
    }

    cursor = cursor[key];
  }

  // تحديث القيمة النهائية
  const lastKey = cleanedSegments[cleanedSegments.length - 1]!;
  cursor[lastKey] = value;

  return newData;
};
