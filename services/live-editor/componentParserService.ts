// خدمة تحليل أسماء المكونات

// دالة تحليل اسم المكون إلى الاسم الأساسي والرقم
export const parseComponentName = (
  componentName: string,
): { baseName: string; number: string } => {
  // تحويل المسافات إلى camelCase أولاً وتحويل PascalCase إلى camelCase
  const normalizedName = componentName
    ?.replace(/\s+/g, "")
    .replace(/^\w/, (c) => c.toLowerCase());

  const match = normalizedName?.match(/^(.*?)(\d+)$/);

  let finalBaseName = match ? match[1] : normalizedName;
  let finalNumber = match ? match[2] : "1";

  // تحويل blogPosts إلى grid ليعمل مع ملفات الـ grid الموجودة
  if (finalBaseName === "blogPosts") {
    finalBaseName = "grid";
  }

  return {
    baseName: finalBaseName,
    number: finalNumber,
  };
};

// دالة تطبيع اسم المكون
export const normalizeComponentName = (
  baseName: string,
  number: string,
): string => {
  // No special normalizations needed for the 5 allowed components

  return `${baseName}${number}`;
};

// دالة إنشاء اسم مكون جديد
export const createComponentName = (
  baseName: string,
  number: string = "1",
): string => {
  return normalizeComponentName(baseName, number);
};

// دالة استخراج النوع من اسم المكون
export const extractComponentType = (componentName: string): string => {
  const { baseName } = parseComponentName(componentName);
  return baseName;
};

// دالة التحقق من صحة اسم المكون
export const isValidComponentName = (componentName: string): boolean => {
  if (!componentName || typeof componentName !== "string") {
    return false;
  }

  // التحقق من أن الاسم يحتوي على أحرف صحيحة
  const validNamePattern = /^[a-zA-Z0-9-_]+$/;
  return validNamePattern.test(componentName);
};

// دالة تنظيف اسم المكون
export const sanitizeComponentName = (componentName: string): string => {
  if (!componentName) return "";

  // تحويل المسافات إلى camelCase أولاً وتحويل PascalCase إلى camelCase
  const camelCase = componentName
    .replace(/\s+/g, "")
    .replace(/^\w/, (c) => c.toLowerCase());

  // إزالة الأحرف غير المسموحة
  return camelCase.replace(/[^a-zA-Z0-9-_]/g, "");
};

// دالة إنشاء اسم مكون فريد
export const generateUniqueComponentName = (
  baseName: string,
  existingNames: string[],
): string => {
  let counter = 1;
  let newName = `${baseName}${counter}`;

  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName}${counter}`;
  }

  return newName;
};
