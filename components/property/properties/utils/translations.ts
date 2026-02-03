// دالة لترجمة أسماء الحقول من رقم إلى اسم عربي
export const translateFieldName = (field: string | number): string => {
  const fieldMap: { [key: string]: string } = {
    "0": "عمر المبنى",
    "1": "العنوان",
    "2": "الوصف",
    "3": "السعر",
    "4": "المساحة",
    "5": "عدد الغرف",
    "6": "عدد الحمامات",
    "7": "الطابق",
    "8": "نوع المبنى",
    "9": "نوع الوحدة",
    "10": "المدينة",
    "11": "الحي",
    "12": "العنوان التفصيلي",
    "building_age": "عمر المبنى",
    "title": "العنوان",
    "description": "الوصف",
    "price": "السعر",
    "area": "المساحة",
    "bedrooms": "عدد الغرف",
    "bathrooms": "عدد الحمامات",
    "floor": "الطابق",
    "building_type": "نوع المبنى",
    "property_type": "نوع الوحدة",
    "city": "المدينة",
    "district": "الحي",
    "address": "العنوان التفصيلي",
  };

  const fieldStr = String(field);
  return fieldMap[fieldStr] || `الحقل ${fieldStr}`;
};

// دالة لترجمة رسائل الخطأ
export const translateErrorMessage = (error: string): string => {
  if (!error) return "";

  // تنظيف النص من المسافات الزائدة
  const cleanedError = error.trim();

  const errorTranslations: { [key: string]: string } = {
    "The building_age may not be greater than 200.":
      "عمر المبنى لا يمكن أن يكون أكبر من 200 سنة.",
    "The building_age field is required.": "حقل عمر المبنى مطلوب.",
    "The building_age must be a number.": "عمر المبنى يجب أن يكون رقماً.",
    "The building_age must be at least 0.": "عمر المبنى يجب أن يكون على الأقل 0.",
    "Valid value according to field requirements":
      "قيمة صحيحة وفقاً لمتطلبات الحقل",
    "Please check the 0 field and ensure it meets the requirements.":
      "يرجى التحقق من الحقل والتأكد من أنه يلبي المتطلبات.",
    "Please verify your file format and data, then try again. If the problem persists, contact support.":
      "يرجى التحقق من تنسيق الملف والبيانات، ثم المحاولة مرة أخرى. إذا استمرت المشكلة، يرجى الاتصال بالدعم.",
    "Please verify your file format and data, then try again. If the problem persists, contact support":
      "يرجى التحقق من تنسيق الملف والبيانات، ثم المحاولة مرة أخرى. إذا استمرت المشكلة، يرجى الاتصال بالدعم.",
    "A critical error occurred while processing the import. Please try again or contact support.":
      "حدث خطأ حرج أثناء معالجة الاستيراد. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.",
    "The selected status is invalid.":
      "الحالة المحددة غير صحيحة.",
    "The city_name must be a string.":
      "اسم المدينة يجب أن يكون نصاً.",
    "The district_name must be a string.":
      "اسم الحي يجب أن يكون نصاً.",
    "The gallery_images must be a string.":
      "صور المعرض يجب أن تكون نصاً.",
    "Please check that the 0 value is valid and exists in your system.":
      "يرجى التحقق من أن القيمة صحيحة وموجودة في النظام.",
  };

  // البحث عن ترجمة مباشرة
  if (errorTranslations[cleanedError]) {
    return errorTranslations[cleanedError];
  }

  // ترجمة رسائل عامة
  let translated = cleanedError;

  // ترجمة رسائل validation عامة - بناءً على أسماء الحقول
  const fieldNameMap: { [key: string]: string } = {
    building_age: "عمر المبنى",
    title: "العنوان",
    description: "الوصف",
    price: "السعر",
    area: "المساحة",
    bedrooms: "عدد الغرف",
    bathrooms: "عدد الحمامات",
    floor: "الطابق",
    building_type: "نوع المبنى",
    property_type: "نوع الوحدة",
    city: "المدينة",
    district: "الحي",
    address: "العنوان التفصيلي",
    city_name: "اسم المدينة",
    district_name: "اسم الحي",
    gallery_images: "صور المعرض",
    status: "الحالة",
  };

  // ترجمة رسائل validation عامة
  translated = translated.replace(
    /The (\w+) may not be greater than (\d+)\./g,
    (match, field, value) => {
      const fieldName = fieldNameMap[field] || field;
      return `حقل ${fieldName} لا يمكن أن يكون أكبر من ${value}.`;
    }
  );
  translated = translated.replace(
    /The (\w+) field is required\./g,
    (match, field) => {
      const fieldName = fieldNameMap[field] || field;
      return `حقل ${fieldName} مطلوب.`;
    }
  );
  translated = translated.replace(
    /The (\w+) must be a number\./g,
    (match, field) => {
      const fieldName = fieldNameMap[field] || field;
      return `حقل ${fieldName} يجب أن يكون رقماً.`;
    }
  );
  translated = translated.replace(
    /The (\w+) must be at least (\d+)\./g,
    (match, field, value) => {
      const fieldName = fieldNameMap[field] || field;
      return `حقل ${fieldName} يجب أن يكون على الأقل ${value}.`;
    }
  );
  // ترجمة رسائل "must be a string"
  translated = translated.replace(
    /The (\w+) must be a string\./g,
    (match, field) => {
      const fieldName = fieldNameMap[field] || field;
      return `حقل ${fieldName} يجب أن يكون نصاً.`;
    }
  );
  // ترجمة رسائل "selected ... is invalid"
  translated = translated.replace(
    /The selected (\w+) is invalid\./g,
    (match, field) => {
      const fieldName = fieldNameMap[field] || field;
      // استخدام ترجمة خاصة للحالة
      if (field === "status") {
        return `الحالة المحددة غير صحيحة.`;
      }
      return `الحقل ${fieldName} المحدد غير صحيح.`;
    }
  );
  // ترجمة رسائل الاقتراحات - للأرقام أولاً
  translated = translated.replace(
    /Please check the (\d+) field and ensure it meets the requirements\./g,
    (match, fieldNum) => {
      const fieldName = translateFieldName(fieldNum);
      return `يرجى التحقق من حقل ${fieldName} والتأكد من أنه يلبي المتطلبات.`;
    }
  );
  // ترجمة رسائل "Please check that the X value is valid and exists in your system."
  translated = translated.replace(
    /Please check that the (\d+) value is valid and exists in your system\./g,
    (match, value) => {
      const fieldName = translateFieldName(value);
      return `يرجى التحقق من أن قيمة ${fieldName} صحيحة وموجودة في النظام.`;
    }
  );
  // ترجمة رسائل الاقتراحات العامة (للحقول النصية) - فقط إذا لم تكن رقم
  translated = translated.replace(
    /Please check the ([a-zA-Z_]+) field and ensure it meets the requirements\./g,
    (match, field) => {
      const fieldName = fieldNameMap[field] || field;
      return `يرجى التحقق من حقل ${fieldName} والتأكد من أنه يلبي المتطلبات.`;
    }
  );

  // ترجمة رسائل الاقتراحات العامة - استخدام includes للتحقق من وجود النص
  if (translated.toLowerCase().includes("please verify your file format and data")) {
    translated = "يرجى التحقق من تنسيق الملف والبيانات، ثم المحاولة مرة أخرى. إذا استمرت المشكلة، يرجى الاتصال بالدعم.";
  } else {
    // ترجمة باستخدام regex
    translated = translated.replace(
      /Please verify your file format and data, then try again\. If the problem persists, contact support\.?/gi,
      "يرجى التحقق من تنسيق الملف والبيانات، ثم المحاولة مرة أخرى. إذا استمرت المشكلة، يرجى الاتصال بالدعم."
    );
  }

  return translated;
};

// دالة لترجمة رسائل الاستيراد
export const translateImportMessage = (message: string): string => {
  if (!message) return "";

  const messageTranslations: { [key: string]: string } = {
    "Import completed with 2 validation error(s).":
      "تم إكمال الاستيراد مع 2 خطأ في التحقق من الصحة.",
    "Import completed with 1 validation error(s).":
      "تم إكمال الاستيراد مع خطأ واحد في التحقق من الصحة.",
    "An error occurred during import processing":
      "حدث خطأ أثناء معالجة الاستيراد",
    "A critical error occurred while processing the import. Please try again or contact support.":
      "حدث خطأ حرج أثناء معالجة الاستيراد. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.",
  };

  // البحث عن ترجمة مباشرة
  if (messageTranslations[message]) {
    return messageTranslations[message];
  }

  // ترجمة رسائل عامة
  let translated = message;

  // ترجمة رسائل validation errors
  translated = translated.replace(
    /Import completed with (\d+) validation error\(s\)\./g,
    (match, count) => {
      const num = parseInt(count);
      if (num === 1) {
        return "تم إكمال الاستيراد مع خطأ واحد في التحقق من الصحة.";
      } else if (num === 2) {
        return "تم إكمال الاستيراد مع خطأين في التحقق من الصحة.";
      } else if (num > 2 && num < 11) {
        return `تم إكمال الاستيراد مع ${count} أخطاء في التحقق من الصحة.`;
      } else {
        return `تم إكمال الاستيراد مع ${count} خطأ في التحقق من الصحة.`;
      }
    }
  );

  // ترجمة رسائل الأخطاء العامة
  translated = translated.replace(
    /An error occurred during import processing/gi,
    "حدث خطأ أثناء معالجة الاستيراد"
  );
  translated = translated.replace(
    /A critical error occurred while processing the import\. Please try again or contact support\./gi,
    "حدث خطأ حرج أثناء معالجة الاستيراد. يرجى المحاولة مرة أخرى أو الاتصال بالدعم."
  );

  return translated;
};

// دالة لترجمة الأخطاء في المصفوفة
export const translateErrors = (errors: any[]): any[] => {
  if (!errors || !Array.isArray(errors)) {
    return [];
  }

  return errors.map((error) => ({
    ...error,
    field: translateFieldName(error.field),
    error: translateErrorMessage(error.error || ""),
    expected:
      error.expected === "Valid value according to field requirements"
        ? "قيمة صحيحة وفقاً لمتطلبات الحقل"
        : error.expected || "",
    suggestion: error.suggestion
      ? translateErrorMessage(error.suggestion)
      : error.suggestion || "",
  }));
};
