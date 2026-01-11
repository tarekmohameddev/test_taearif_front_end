# Live Editor Logging System - دليل استخدام نظام الـ Logging

## نظرة عامة

تم إضافة نظام logging متقدم في Live Editor يقوم بتسجيل جميع العمليات في ملفات بدلاً من console.log. هذا النظام يساعد في:

- 🔍 تتبع flow البيانات بالكامل
- 🐛 اكتشاف مشاكل الكاشينج
- 📊 مراقبة عمليات إضافة المكونات
- 📝 تسجيل قبل وبعد كل تعديل

---

## الملفات المهمة

### 1. `lib/fileLogger.ts`
نظام logging الرئيسي الذي يكتب في ملفات.

### 2. `components/tenant/live-editor/LiveEditorUI/hooks/useComponentHandlers.ts`
تم إضافة logging شامل في `handleAddComponent` لإضافة المكونات.

### 3. `context/editorStore.ts`
تم إضافة logging في:
- `ensureComponentVariant` - تهيئة المكونات في الـ store
- `forceUpdatePageComponents` - تحديث pageComponentsByPage

### 4. `components/tenant/live-editor/LiveEditorUI/components/LiveEditorIframeContent.tsx`
تم إضافة logging عند render المكونات في iframe.

---

## استخدام النظام

### تلقائي (Automatic)

النظام يعمل تلقائياً! لا حاجة لأي إعدادات. يتم تسجيل:

- ✅ جميع عمليات إضافة المكونات (قبل وبعد)
- ✅ جميع عمليات تحديث الـ store (قبل وبعد)
- ✅ جميع عمليات render المكونات
- ✅ جميع أخطاء النظام

### تحميل الـ Logs

#### الطريقة 1: تحميل يدوي

```typescript
import { downloadLogs } from "@/lib/fileLogger";

// في console المتصفح
downloadLogs();
```

#### الطريقة 2: من localStorage

الـ logs تُحفظ تلقائياً في localStorage كل 5 ثواني. يمكن الوصول إليها:

```javascript
// في console المتصفح
const keys = Object.keys(localStorage).filter(k => k.startsWith("live-editor-logs-"));
keys.forEach(key => {
  console.log(key, localStorage.getItem(key));
});
```

---

## أنواع الـ Logs

### 1. Log قبل العملية (BEFORE)
```typescript
logBefore(
  "COMPONENT_ADD",
  "ADD_COMPONENT_START",
  { /* data */ },
  { componentId, componentName, componentType }
);
```

**مثال:**
```
[2025-01-15 10:30:15.234] [INFO] [COMPONENT_ADD] [ADD_COMPONENT_START] [BEFORE]
Component ID: uuid-1234
Component Name: hero1
Component Type: hero
Data:
{
  "componentData": {...},
  "currentPageComponentsCount": 5
}
```

### 2. Log أثناء العملية (DURING)
```typescript
logDuring(
  "COMPONENT_ADD",
  "CREATING_COMPONENT",
  { /* data */ },
  { componentId, componentName, componentType }
);
```

### 3. Log بعد العملية (AFTER)
```typescript
logAfter(
  "COMPONENT_ADD",
  "ADD_COMPONENT_COMPLETE",
  { /* data */ },
  { componentId, componentName, componentType }
);
```

### 4. Log قبل/بعد المقارنة (BEFORE/AFTER)
```typescript
logBeforeAfter(
  "ADD_COMPONENT",
  beforeData,
  afterData,
  { componentId, componentName, componentType }
);
```

**مثال:**
```
[2025-01-15 10:30:20.456] [BEFORE_AFTER] [ADD_COMPONENT]
Component ID: uuid-1234
Component Name: hero1
Component Type: hero

--- BEFORE ---
{
  "pageComponentsBefore": [...]
}

--- AFTER ---
{
  "pageComponentsAfter": [...]
}
```

### 5. Log الأخطاء (ERROR)
```typescript
logError(
  "COMPONENT_ADD",
  "STORE_INITIALIZATION_FAILED",
  error,
  { componentId, componentName, componentType }
);
```

---

## تتبع Flow المكونات الجديدة

عند إضافة مكون جديد، يتم تسجيل:

### 1. قبل الإضافة
- `COMPONENT_ADD` → `ADD_COMPONENT_START` (BEFORE)
- حالة `pageComponents` قبل الإضافة
- حالة `pageComponentsByPage` قبل الإضافة

### 2. أثناء الإضافة
- `COMPONENT_ADD` → `CREATING_COMPONENT` (DURING)
- `COMPONENT_ADD` → `INITIALIZING_IN_STORE` (DURING)
- `COMPONENT_ADD` → `UPDATING_LOCAL_STATE` (DURING)

### 3. في الـ Store
- `EDITOR_STORE` → `ENSURE_COMPONENT_VARIANT` (BEFORE)
- `EDITOR_STORE` → `CHECKING_EXISTING_DATA` (DURING)
- `EDITOR_STORE` → `UPDATING_STORE` (BEFORE)
- `EDITOR_STORE` → `ENSURE_COMPONENT_VARIANT_COMPLETE` (AFTER)

### 4. تحديث pageComponentsByPage
- `EDITOR_STORE` → `FORCE_UPDATE_PAGE_COMPONENTS` (BEFORE)
- `EDITOR_STORE` → `FORCE_UPDATE_PAGE_COMPONENTS_COMPLETE` (AFTER)

### 5. بعد الإضافة
- `COMPONENT_ADD` → `ADD_COMPONENT_COMPLETE` (AFTER)
- `COMPONENT_ADD` → `ADD_COMPONENT` (BEFORE/AFTER comparison)

### 6. Render في iframe
- `IFRAME_CONTENT` → `RENDER_COMPONENTS` (BEFORE)
- `IFRAME_CONTENT` → `RENDERING_COMPONENT` (DURING) لكل مكون

---

## التحقق من المشاكل

### مشكلة: المكون لا يظهر في iframe

**تحقق من:**
1. هل تم استدعاء `ensureComponentVariant`؟
   - ابحث عن: `EDITOR_STORE` → `ENSURE_COMPONENT_VARIANT`

2. هل تم تحديث `pageComponentsByPage`؟
   - ابحث عن: `EDITOR_STORE` → `FORCE_UPDATE_PAGE_COMPONENTS_COMPLETE`

3. هل تم render المكون في iframe؟
   - ابحث عن: `IFRAME_CONTENT` → `RENDERING_COMPONENT`

**مثال Log:**
```
[INFO] [COMPONENT_ADD] [ADD_COMPONENT_START] [BEFORE]
[INFO] [COMPONENT_ADD] [INITIALIZING_IN_STORE] [DURING]
[INFO] [EDITOR_STORE] [ENSURE_COMPONENT_VARIANT] [BEFORE]
[INFO] [EDITOR_STORE] [ENSURE_COMPONENT_VARIANT_COMPLETE] [AFTER]
[INFO] [EDITOR_STORE] [FORCE_UPDATE_PAGE_COMPONENTS] [BEFORE]
[INFO] [EDITOR_STORE] [FORCE_UPDATE_PAGE_COMPONENTS_COMPLETE] [AFTER]
[INFO] [IFRAME_CONTENT] [RENDERING_COMPONENT] [DURING]
```

### مشكلة: المكون لا يُحفظ في الكاشينج

**تحقق من:**
1. هل تم استدعاء `ensureComponentVariant` بالمعلومات الصحيحة؟
   - ابحث عن: `componentType`, `variantId` (يجب أن يكون `component.id`)

2. هل تم التحقق من البيانات الموجودة؟
   - ابحث عن: `SKIPPING_UPDATE_*` - إذا ظهرت، قد يكون هناك مشكلة

**مثال Log للمشكلة:**
```
[INFO] [EDITOR_STORE] [ENSURE_COMPONENT_VARIANT] [BEFORE]
[DURING] [EDITOR_STORE] [SKIPPING_UPDATE_NO_INITIAL] [DURING]
// ❌ المكون موجود لكن لا توجد initial data - يجب إصلاح handleAddComponent
```

---

## أمثلة عمليات

### إضافة مكون جديد

```typescript
// المستخدم يسحب مكون من sidebar
handleAddComponent({
  type: "hero",
  zone: "main",
  index: 2,
})

// ✅ يتم تسجيل:
// 1. COMPONENT_ADD → ADD_COMPONENT_START (BEFORE)
// 2. COMPONENT_ADD → CREATING_COMPONENT (DURING)
// 3. COMPONENT_ADD → INITIALIZING_IN_STORE (DURING)
// 4. EDITOR_STORE → ENSURE_COMPONENT_VARIANT (BEFORE)
// 5. EDITOR_STORE → ENSURE_COMPONENT_VARIANT_COMPLETE (AFTER)
// 6. EDITOR_STORE → FORCE_UPDATE_PAGE_COMPONENTS (BEFORE)
// 7. EDITOR_STORE → FORCE_UPDATE_PAGE_COMPONENTS_COMPLETE (AFTER)
// 8. COMPONENT_ADD → ADD_COMPONENT_COMPLETE (AFTER)
// 9. IFRAME_CONTENT → RENDERING_COMPONENT (DURING)
```

### تحديث المكون

```typescript
// تحديث بيانات المكون في الـ store
store.setComponentData("hero", "uuid-1234", newData);

// ✅ يتم تسجيل:
// 1. EDITOR_STORE → SET_COMPONENT_DATA (BEFORE)
// 2. EDITOR_STORE → SET_COMPONENT_DATA_COMPLETE (AFTER)
```

---

## إزالة/تعطيل Logging

### تعطيل Logging

```typescript
// في lib/fileLogger.ts
constructor() {
  this.isEnabled = false; // تعطيل logging
}
```

### تنظيف الـ Logs

```typescript
import { clearLogs } from "@/lib/fileLogger";

// في console المتصفح
clearLogs();
```

---

## ملاحظات مهمة

1. **الأداء**: الـ logs تُحفظ في الذاكرة أولاً ثم تُكتب في ملف عند الحاجة
2. **الحجم**: أقصى 5000 log في الذاكرة (يتجاوزها يتم حذف القديم)
3. **التخزين**: الـ logs تُحفظ في localStorage (آخر 5 ملفات)
4. **التوقيت**: الـ logs تُكتب تلقائياً كل 5 ثواني

---

## الاستخدام أثناء التطوير

### 1. فتح Console
افتح Developer Tools → Console

### 2. إضافة مكون جديد
اسحب مكون من sidebar إلى الصفحة

### 3. مراقبة الـ Logs
سترى logs مباشرة في console مع أيقونات:
- 🔵 BEFORE
- 🟡 DURING
- 🟢 AFTER

### 4. تحميل الـ Logs
```javascript
// في console
downloadLogs()
```

ستحصل على ملف: `live-editor-logs-2025-01-15-session-xxx.txt`

---

## إصلاح المشاكل الشائعة

### المشكلة: المكون لا يظهر في iframe

**الحل:**
1. تحميل الـ logs
2. البحث عن `ENSURE_COMPONENT_VARIANT`
3. التحقق من أن `variantId` = `component.id`
4. التحقق من أن `ensureComponentVariant` تم استدعاؤه
5. التحقق من أن `forceUpdatePageComponents` تم استدعاؤه

### المشكلة: البيانات لا تُحفظ في الكاشينج

**الحل:**
1. تحميل الـ logs
2. البحث عن `SKIPPING_UPDATE_*`
3. التحقق من سبب التخطي (no initial, props-like, same data)
4. إصلاح المشكلة في `handleAddComponent`

---

## خلاصة

هذا النظام يوفر:
- ✅ تتبع كامل لـ flow البيانات
- ✅ تسجيل قبل وبعد كل تعديل
- ✅ اكتشاف سريع للمشاكل
- ✅ ملفات logs قابلة للتحميل
- ✅ تلقائي بدون إعدادات

**استخدمه عند:**
- 🐛 اكتشاف bugs في الكاشينج
- 🔍 تتبع flow البيانات
- 📊 مراقبة عمليات الإضافة
- 📝 توثيق التغييرات
