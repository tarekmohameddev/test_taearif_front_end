# Fix Component Data Caching Issue - Prompt Guide

## 🔴 المشكلة

المكون يعرض **فقط البيانات الافتراضية (default data)** ولا يحمل البيانات من:

- ❌ الـ Store (editorStore)
- ❌ الـ Tenant Data (من الـ API/Backend)
- ❌ الـ Props

**الأعراض:**

- المكون يظهر دائماً بنفس البيانات الافتراضية
- التعديلات في الـ Live Editor لا تظهر
- البيانات المحفوظة في الـ Database لا تُحمّل
- المكون لا يتفاعل مع تغييرات الـ Store

---

## 🔍 التشخيص

### الخطوة 1: تحقق من الأعراض

```typescript
// ❌ المشكلة: المكون يعرض فقط default data
const Component1 = (props) => {
  const defaultData = getDefaultComponentData(); // ❌ يستخدم فقط default
  return <div>{defaultData.title}</div>; // ❌ لا يقرأ من store
};
```

### الخطوة 2: تحقق من المصادر التالية

1. **هل يستورد البيانات الافتراضية من functions file؟**

   ```typescript
   // ❌ خطأ: دالة محلية
   const getDefaultData = () => ({ ... });

   // ✅ صحيح: استيراد من functions file
   import { getDefaultComponentData } from "@/context-liveeditor/editorStoreFunctions/componentFunctions";
   ```

2. **هل يستخدم `ensureComponentVariant` بشكل صحيح؟**

   ```typescript
   // ❌ خطأ: يستخدم variantId بدلاً من uniqueId
   ensureComponentVariant("component", variantId, initialData);

   // ✅ صحيح: يستخدم uniqueId
   ensureComponentVariant("component", uniqueId, props);
   ```

3. **هل يقرأ البيانات من الـ Store؟**

   ```typescript
   // ❌ خطأ: لا يقرأ من store
   const data = defaultData;

   // ✅ صحيح: يقرأ من store
   const storeData = getComponentData("component", uniqueId);
   const currentStoreData = componentStates[uniqueId] || {};
   ```

4. **هل يدمج البيانات بالترتيب الصحيح؟**

   ```typescript
   // ❌ خطأ: ترتيب خاطئ أو لا يدمج
   const mergedData = { ...defaultData, ...props };

   // ✅ صحيح: ترتيب صحيح
   const mergedData = {
     ...defaultData, // Base (99%)
     ...props, // Props
     ...tenantComponentData, // Backend
     ...currentStoreData, // Store (highest priority)
   };
   ```

---

## ✅ الحل - خطوة بخطوة

### الخطوة 1: استيراد البيانات الافتراضية من Functions File

**قبل:**

```typescript
// ❌ دالة محلية في المكون
const getDefaultComponentData = () => ({
  visible: true,
  title: "Default Title",
  // ...
});
```

**بعد:**

```typescript
// ✅ استيراد من functions file
import { getDefaultComponentData } from "@/context-liveeditor/editorStoreFunctions/componentFunctions";
```

**ملاحظة:** تأكد من وجود الدالة في `context-liveeditor/editorStoreFunctions/{componentType}Functions.ts`

---

### الخطوة 2: تبسيط ensureComponentVariant

**قبل:**

```typescript
// ❌ معقد: يدمج البيانات قبل الاستدعاء
useEffect(() => {
  if (props.useStore) {
    const initialData = {
      ...getDefaultComponentData(),
      ...props,
    };
    ensureComponentVariant("component", uniqueId, initialData);
  }
}, [uniqueId, props.useStore, ensureComponentVariant]);
```

**بعد:**

```typescript
// ✅ بسيط: يمرر props مباشرة (مثل hero1.tsx)
useEffect(() => {
  if (useStore) {
    ensureComponentVariant("component", uniqueId, props);
  }
}, [uniqueId, useStore, ensureComponentVariant]);
```

**ملاحظات:**

- استخدم `uniqueId` (ليس `variantId`)
- استخدم `useStore` من props (ليس `props.useStore`)
- مرر `props` مباشرة (لا تدمج قبل الاستدعاء)

---

### الخطوة 3: قراءة البيانات من الـ Store

**قبل:**

```typescript
// ❌ لا يقرأ من store
const data = getDefaultComponentData();
```

**بعد:**

```typescript
// ✅ يقرأ من store (مثل hero1.tsx)
const storeData = useStore ? getComponentData("component", uniqueId) || {} : {};

// Subscribe to store updates
const componentStates = useEditorStore((s) => s.componentStates);
const currentStoreData = useStore ? componentStates[uniqueId] || {} : {};
```

**ملاحظات:**

- استخدم `getComponentData` للحصول على البيانات
- اشترك في `componentStates` للحصول على التحديثات
- استخدم `uniqueId` كـ key

---

### الخطوة 4: قراءة البيانات من الـ Tenant (Backend)

**قبل:**

```typescript
// ❌ لا يقرأ من tenant
const tenantData = {};
```

**بعد:**

```typescript
// ✅ يقرأ من tenant (مثل hero1.tsx)
const getTenantComponentData = () => {
  if (!tenantData?.componentSettings) {
    return {};
  }

  // Search through all pages
  for (const [pageSlug, pageComponents] of Object.entries(
    tenantData.componentSettings,
  )) {
    if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
      for (const [componentId, component] of Object.entries(
        pageComponents as any,
      )) {
        // Check by type, componentName, and id
        if (
          (component as any).type === "component" &&
          (component as any).componentName === variantId &&
          componentId === id // ✅ مهم: استخدام id من props
        ) {
          return (component as any).data;
        }
      }
    }
  }
  return {};
};

const tenantComponentData = getTenantComponentData();
```

**ملاحظات:**

- تأكد من استخدام `componentId === id` (ليس `componentId === variantId`)
- ابحث في جميع الصفحات (`componentSettings`)
- تحقق من `type` و `componentName` و `id`

---

### الخطوة 5: دمج البيانات بالترتيب الصحيح

**قبل:**

```typescript
// ❌ ترتيب خاطئ أو لا يدمج من store/tenant
const mergedData = {
  ...defaultData,
  ...props,
};
```

**بعد:**

```typescript
// ✅ ترتيب صحيح (مثل hero1.tsx)
const defaultData = getDefaultComponentData();

const mergedData = {
  ...defaultData, // 99% - Base data (lowest priority)
  ...props, // Props from parent
  ...tenantComponentData, // Backend data (tenant)
  ...currentStoreData, // Store data (highest priority)
};
```

**ترتيب الأولوية (من الأقل إلى الأعلى):**

1. `defaultData` - البيانات الافتراضية (99% من البيانات)
2. `props` - البيانات من الـ parent component
3. `tenantComponentData` - البيانات من الـ Backend/API
4. `currentStoreData` - البيانات من الـ Store (أعلى أولوية)

---

### الخطوة 6: إزالة منطق الاشتراك المعقد

**قبل:**

```typescript
// ❌ منطق معقد للاشتراك
const [forceUpdate, setForceUpdate] = useState(0);

useEffect(() => {
  if (props.useStore) {
    const unsubscribe = useEditorStore.subscribe((state) => {
      if (state.componentStates[uniqueId]) {
        setForceUpdate((prev) => prev + 1);
      }
    });
    return unsubscribe;
  }
}, [props.useStore, uniqueId]);
```

**بعد:**

```typescript
// ✅ بسيط: الاعتماد على Zustand reactivity
// لا حاجة لـ useState أو useEffect للاشتراك
// Zustand يتعامل مع التحديثات تلقائياً
const componentStates = useEditorStore((s) => s.componentStates);
const currentStoreData = useStore ? componentStates[uniqueId] || {} : {};
```

**ملاحظات:**

- Zustand يتعامل مع التحديثات تلقائياً
- لا حاجة لـ `useState` أو `forceUpdate`
- لا حاجة لـ `useEffect` للاشتراك اليدوي

---

### الخطوة 7: تحديث Functions File (إذا لزم الأمر)

**تحقق من `ensureVariant` في functions file:**

```typescript
// ❌ خطأ: لا يتحقق من البيانات الموجودة
ensureVariant: (state, variantId, initial?) => {
  if (!state.componentStates[variantId]) {
    state.componentStates[variantId] = initial || defaultData;
  }
  return { componentStates: { ...state.componentStates } };
};
```

**بعد (مثل heroFunctions.ts):**

```typescript
// ✅ صحيح: يتحقق من البيانات الموجودة
ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
  // إذا كانت البيانات موجودة، لا تغيرها
  if (
    state.componentStates?.[variantId] &&
    Object.keys(state.componentStates[variantId]).length > 0
  ) {
    return {} as any; // لا تغييرات
  }

  // استخدام initial إذا وُفر، وإلا default
  const defaultData = getDefaultComponentData();
  const data: ComponentData = initial || state.tempData || defaultData;

  return {
    componentStates: {
      ...(state.componentStates || {}),
      [variantId]: data,
    },
  } as any;
};
```

**تحقق من `getData` في functions file:**

```typescript
// ❌ خطأ: يرجع default data إذا لم يجد
getData: (state, variantId) => {
  const data = state.componentStates?.[variantId];
  if (!data || Object.keys(data).length === 0) {
    return getDefaultComponentData(); // ❌ خطأ
  }
  return data;
};
```

**بعد (مثل heroFunctions.ts):**

```typescript
// ✅ صحيح: يرجع كائن فارغ
getData: (state: any, variantId: string) => {
  return state.componentStates?.[variantId] || {};
};
```

---

## 📋 Checklist - التحقق من الإصلاح

### ✅ قبل الإصلاح

- [ ] المكون يعرض فقط default data
- [ ] التعديلات في Live Editor لا تظهر
- [ ] البيانات من Backend لا تُحمّل

### ✅ بعد الإصلاح - تحقق من:

1. **الاستيراد:**
   - [ ] يستورد `getDefaultComponentData` من functions file
   - [ ] لا يوجد دالة محلية `getDefaultComponentData`

2. **ensureComponentVariant:**
   - [ ] يستخدم `uniqueId` (ليس `variantId`)
   - [ ] يستخدم `useStore` من props
   - [ ] يمرر `props` مباشرة

3. **قراءة البيانات:**
   - [ ] يقرأ من `getComponentData("component", uniqueId)`
   - [ ] يشترك في `componentStates[uniqueId]`
   - [ ] يقرأ من `tenantData.componentSettings`

4. **دمج البيانات:**
   - [ ] الترتيب: default → props → tenant → store
   - [ ] يستخدم `mergedData` في الـ render

5. **إزالة التعقيد:**
   - [ ] لا يوجد `useState` للـ force update
   - [ ] لا يوجد `useEffect` للاشتراك اليدوي
   - [ ] يعتمد على Zustand reactivity

6. **Functions File:**
   - [ ] `ensureVariant` يتحقق من البيانات الموجودة
   - [ ] `getData` يرجع `{}` (ليس default data)

---

## 📝 مثال كامل - النمط الصحيح

```typescript
"use client";

import { useEffect } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { getDefaultComponentData } from "@/context-liveeditor/editorStoreFunctions/componentFunctions";

interface ComponentProps {
  useStore?: boolean;
  variant?: string;
  id?: string;
  [key: string]: any;
}

const Component1: React.FC<ComponentProps> = ({
  useStore = true,
  variant = "component1",
  id,
  ...props
}) => {
  // ✅ Step 1: Initialize IDs
  const variantId = variant || "component1";
  const uniqueId = id || variantId;

  // ✅ Step 2: Get store functions
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  // ✅ Step 3: Initialize component in store
  useEffect(() => {
    if (useStore) {
      ensureComponentVariant("component", uniqueId, props);
    }
  }, [uniqueId, useStore, ensureComponentVariant]);

  // ✅ Step 4: Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // ✅ Step 5: Read from store
  const storeData = useStore
    ? getComponentData("component", uniqueId) || {}
    : {};

  const componentStates = useEditorStore((s) => s.componentStates);
  const currentStoreData = useStore ? componentStates[uniqueId] || {} : {};

  // ✅ Step 6: Read from tenant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      return {};
    }
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          if (
            (component as any).type === "component" &&
            (component as any).componentName === variantId &&
            componentId === id
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // ✅ Step 7: Merge data (correct priority order)
  const defaultData = getDefaultComponentData();

  const mergedData = {
    ...defaultData,           // Base (99%)
    ...props,                 // Props
    ...tenantComponentData,   // Backend
    ...currentStoreData,      // Store (highest priority)
  };

  // ✅ Step 8: Render using mergedData
  if (!mergedData.visible) {
    return null;
  }

  return (
    <div>
      <h1>{mergedData.title}</h1>
      {/* Use mergedData, not defaultData or props directly */}
    </div>
  );
};

export default Component1;
```

---

## 🔗 مراجع

- **النمط الصحيح:** `components/tenant/hero/hero1.tsx`
- **مثال آخر:** `components/tenant/hero/hero2.tsx`
- **Functions Example:** `context-liveeditor/editorStoreFunctions/heroFunctions.ts`
- **Documentation:** `docs/important/liveEditor/COMPONENT_ARCHITECTURE.md`
- **Data Flow:** `docs/important/liveEditor/DATA_FLOW.md`

---

## 💡 نصائح إضافية

1. **استخدم `uniqueId` دائماً:** `const uniqueId = id || variantId;`
2. **لا تدمج قبل ensureComponentVariant:** مرر `props` مباشرة
3. **الترتيب مهم:** default → props → tenant → store
4. **استخدم `mergedData` في الـ render:** لا تستخدم `defaultData` أو `props` مباشرة
5. **Zustand يتعامل مع التحديثات:** لا حاجة لـ force update
6. **تحقق من functions file:** تأكد من أن `ensureVariant` و `getData` صحيحة

---

## 🎯 عند استخدام هذا الـ Prompt

1. افتح المكون الذي يعاني من المشكلة
2. استدعي هذا الملف: `@docs/important/components/FIX_COMPONENT_PROMPT_CACHING.md`
3. اتبع الخطوات بالترتيب
4. استخدم `hero1.tsx` كمرجع
5. تحقق من Checklist بعد الإصلاح

---

**آخر تحديث:** بعد إصلاح `contactCards1.tsx` - 2024
