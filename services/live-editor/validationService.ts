// خدمة التحقق من صحة البيانات

// أنواع الأخطاء
export type ValidationErrorType =
  | "required"
  | "invalid-format"
  | "invalid-length"
  | "invalid-value"
  | "duplicate"
  | "not-found"
  | "permission-denied";

// واجهة خطأ التحقق
export interface ValidationError {
  type: ValidationErrorType;
  field: string;
  message: string;
  value?: any;
}

// واجهة نتيجة التحقق
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// قواعد التحقق الأساسية
export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

// دالة التحقق من صحة المكون
export const validateComponent = (component: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // التحقق من الحقول المطلوبة
  if (!component.id) {
    errors.push({
      type: "required",
      field: "id",
      message: "Component ID is required",
    });
  }

  if (!component.type) {
    errors.push({
      type: "required",
      field: "type",
      message: "Component type is required",
    });
  }

  if (!component.componentName) {
    errors.push({
      type: "required",
      field: "componentName",
      message: "Component name is required",
    });
  }

  // التحقق من صحة النوع
  if (component.type && !isValidComponentType(component.type)) {
    errors.push({
      type: "invalid-value",
      field: "type",
      message: `Invalid component type: ${component.type}`,
      value: component.type,
    });
  }

  // التحقق من صحة اسم المكون
  if (
    component.componentName &&
    !isValidComponentName(component.componentName)
  ) {
    errors.push({
      type: "invalid-format",
      field: "componentName",
      message: `Invalid component name format: ${component.componentName}`,
      value: component.componentName,
    });
  }

  // التحقق من التخطيط
  if (component.layout) {
    const layoutErrors = validateLayout(component.layout);
    errors.push(
      ...layoutErrors.map((error) => ({
        ...error,
        field: `layout.${error.field}`,
      })),
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// دالة التحقق من صحة التخطيط
export const validateLayout = (layout: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (typeof layout.row !== "number" || layout.row < 0) {
    errors.push({
      type: "invalid-value",
      field: "row",
      message: "Row must be a non-negative number",
      value: layout.row,
    });
  }

  if (typeof layout.col !== "number" || layout.col < 0) {
    errors.push({
      type: "invalid-value",
      field: "col",
      message: "Column must be a non-negative number",
      value: layout.col,
    });
  }

  if (typeof layout.span !== "number" || layout.span < 1 || layout.span > 2) {
    errors.push({
      type: "invalid-value",
      field: "span",
      message: "Span must be 1 or 2",
      value: layout.span,
    });
  }

  return errors;
};

// دالة التحقق من صحة نوع المكون
export const isValidComponentType = (type: string): boolean => {
  // استخدام القائمة المركزية للمكونات
  const {
    isValidComponentType: isValidFromComponentsList,
  } = require("@/lib/ComponentsList");
  return isValidFromComponentsList(type);
};

// دالة التحقق من صحة اسم المكون
export const isValidComponentName = (name: string): boolean => {
  if (!name || typeof name !== "string") {
    return false;
  }

  // التحقق من أن الاسم يحتوي على أحرف صحيحة
  const validNamePattern = /^[a-zA-Z0-9-_]+$/;
  return validNamePattern.test(name);
};

// دالة التحقق من صحة اسم الصفحة
export const isValidPageSlug = (slug: string): boolean => {
  if (!slug || typeof slug !== "string") {
    return false;
  }

  // التحقق من أن الاسم يحتوي على أحرف صحيحة
  const validSlugPattern = /^[a-z0-9-]+$/;
  return validSlugPattern.test(slug) && slug.length <= 50;
};

// دالة التحقق من صحة البيانات
export const validateComponentData = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== "object") {
    errors.push({
      type: "required",
      field: "data",
      message: "Component data is required and must be an object",
    });
    return { isValid: false, errors };
  }

  // التحقق من النصوص
  if (data.texts) {
    if (data.texts.title && typeof data.texts.title !== "string") {
      errors.push({
        type: "invalid-format",
        field: "texts.title",
        message: "Title must be a string",
        value: data.texts.title,
      });
    }

    if (data.texts.subtitle && typeof data.texts.subtitle !== "string") {
      errors.push({
        type: "invalid-format",
        field: "texts.subtitle",
        message: "Subtitle must be a string",
        value: data.texts.subtitle,
      });
    }
  }

  // التحقق من الألوان
  if (data.colors) {
    if (data.colors.background && !isValidColor(data.colors.background)) {
      errors.push({
        type: "invalid-format",
        field: "colors.background",
        message: "Background color must be a valid color",
        value: data.colors.background,
      });
    }

    if (data.colors.textColor && !isValidColor(data.colors.textColor)) {
      errors.push({
        type: "invalid-format",
        field: "colors.textColor",
        message: "Text color must be a valid color",
        value: data.colors.textColor,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// دالة التحقق من صحة اللون
export const isValidColor = (color: string): boolean => {
  if (!color || typeof color !== "string") {
    return false;
  }

  // التحقق من صيغ الألوان المدعومة
  const colorPatterns = [
    /^#[0-9A-Fa-f]{6}$/, // Hex color
    /^#[0-9A-Fa-f]{3}$/, // Short hex color
    /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, // RGB
    /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-9.]+\s*\)$/, // RGBA
    /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/, // HSL
    /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[0-9.]+\s*\)$/, // HSLA
  ];

  return colorPatterns.some((pattern) => pattern.test(color));
};

// دالة التحقق من صحة المستخدم
export const validateUser = (user: any): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!user) {
    errors.push({
      type: "required",
      field: "user",
      message: "User is required",
    });
    return { isValid: false, errors };
  }

  if (!user.id) {
    errors.push({
      type: "required",
      field: "user.id",
      message: "User ID is required",
    });
  }

  if (!user.email) {
    errors.push({
      type: "required",
      field: "user.email",
      message: "User email is required",
    });
  } else if (!isValidEmail(user.email)) {
    errors.push({
      type: "invalid-format",
      field: "user.email",
      message: "Invalid email format",
      value: user.email,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// دالة التحقق من صحة البريد الإلكتروني
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// دالة التحقق من صحة مجموعة من القواعد
export const validateWithRules = (
  data: any,
  rules: ValidationRule[],
): ValidationResult => {
  const errors: ValidationError[] = [];

  rules.forEach((rule) => {
    const value = data[rule.field];

    // التحقق من الحقول المطلوبة
    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push({
        type: "required",
        field: rule.field,
        message: rule.message || `${rule.field} is required`,
        value,
      });
      return;
    }

    // تخطي التحقق إذا كانت القيمة فارغة وغير مطلوبة
    if (value === undefined || value === null || value === "") {
      return;
    }

    // التحقق من الطول
    if (typeof value === "string") {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push({
          type: "invalid-length",
          field: rule.field,
          message:
            rule.message ||
            `${rule.field} must be at least ${rule.minLength} characters`,
          value,
        });
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push({
          type: "invalid-length",
          field: rule.field,
          message:
            rule.message ||
            `${rule.field} must be at most ${rule.maxLength} characters`,
          value,
        });
      }

      // التحقق من النمط
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push({
          type: "invalid-format",
          field: rule.field,
          message: rule.message || `${rule.field} format is invalid`,
          value,
        });
      }
    }

    // التحقق المخصص
    if (rule.custom && !rule.custom(value)) {
      errors.push({
        type: "invalid-value",
        field: rule.field,
        message: rule.message || `${rule.field} has an invalid value`,
        value,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// دالة دمج نتائج التحقق
export const mergeValidationResults = (
  ...results: ValidationResult[]
): ValidationResult => {
  const allErrors = results.flatMap((result) => result.errors);
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};
