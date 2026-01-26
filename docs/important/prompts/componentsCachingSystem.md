# نظام الـ Caching الخاص بالمكونات - شرح مفصل ومبالغ فيه

## نظرة عامة على البنية المعمارية

نظام الـ caching في هذا المشروع هو نظام معقد ومتعدد الطبقات يربط بين المكونات (Components) والـ stores والـ default data بطريقة ذكية وفعالة. هذا النظام يضمن أن البيانات تتدفق بسلاسة من المصادر المختلفة إلى المكونات النهائية.

## المكونات المستهدفة في هذا الشرح

1. **`components/tenant/whyChooseUs/whyChooseUs1.tsx`** - مكون "لماذا تختارنا"
2. **`components/tenant/testimonials/testimonials1.tsx`** - مكون الشهادات
3. **`context-liveeditor/editorStoreFunctions/halfTextHalfImageFunctions.ts`** - دوال إدارة مكون النص والصورة

## العناصر الأساسية في النظام

### 1. Default Data Functions

**الموقع:** `context-liveeditor/editorStoreFunctions/`

هذه الدوال تحتوي على البيانات الافتراضية لكل مكون:

```typescript
// في whyChooseUsFunctions.ts
export const getDefaultWhyChooseUsData = (): any => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    padding: {
      y: "py-14",
      smY: "sm:py-16",
    },
  },
  header: {
    title: "لماذا تختارنا؟",
    description:
      "مكتبنا يجمع بين الخبرة والالتزام لتقديم خدمات مميزة في مجال العقارات",
    // ... المزيد من البيانات الافتراضية
  },
  // ... باقي البيانات
});
```

### 2. Component Structures

**الموقع:** `componentsStructure/`

هذه الملفات تحدد هيكل البيانات لكل مكون:

```typescript
// في whyChooseUs.ts
export const whyChooseUsStructure: ComponentStructure = {
  componentType: "whyChooseUs",
  variants: [
    {
      id: "whyChooseUs1",
      name: "Why Choose Us 1 - Features Grid",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "direction",
              label: "Direction",
              type: "select",
              options: [
                { value: "rtl", label: "Right to Left" },
                { value: "ltr", label: "Left to Right" },
              ],
            },
            // ... المزيد من الحقول
          ],
        },
        // ... باقي الحقول
      ],
    },
  ],
};
```

### 3. Editor Store

**الموقع:** `context-liveeditor/editorStore.ts`

هذا هو الـ store الرئيسي الذي يدير جميع المكونات:

```typescript
export const useEditorStore = create<EditorStore>((set, get) => ({
  // Dynamic component states - يتم إنشاؤها تلقائياً من ComponentsList
  componentStates: Record<string, Record<string, ComponentData>>,

  // Generic functions for all components
  ensureComponentVariant: (
    componentType: string,
    variantId: string,
    initial?: ComponentData,
  ) => void,
  getComponentData: (componentType: string, variantId: string) => ComponentData,
  setComponentData: (
    componentType: string,
    variantId: string,
    data: ComponentData,
  ) => void,
  updateComponentByPath: (
    componentType: string,
    variantId: string,
    path: string,
    value: any,
  ) => void,

  // Specific component states
  whyChooseUsStates: Record<string, ComponentData>,
  testimonialsStates: Record<string, ComponentData>,
  // ... باقي المكونات
}));
```

### 4. Tenant Store

**الموقع:** `context-liveeditor/tenantStore.jsx`

هذا الـ store يدير بيانات المستأجر (Tenant):

```javascript
const useTenantStore = create((set) => ({
  tenantData: null,
  loadingTenantData: false,
  error: null,
  tenant: null,
  tenantId: null,
  lastFetchedWebsite: null,

  fetchTenantData: async (websiteName) => {
    // منطق جلب بيانات المستأجر من API
  },

  // دوال حفظ التغييرات
  saveHeaderChanges: async (tenantId, headerData, variant) => {
    // منطق حفظ تغييرات الهيدر
  },
  // ... باقي دوال الحفظ
}));
```

## تدفق البيانات المفصل - من البداية للنهاية

### المرحلة الأولى: تهيئة المكون

عندما يتم تحميل مكون `whyChooseUs1.tsx`، يحدث التالي:

```typescript
export default function WhyChooseUsSection(props: WhyChooseUsProps = {}) {
  // 1. تحديد معرف المكون
  const variantId = props.variant || "whyChooseUs1";
  const uniqueId = props.id || variantId;

  // 2. الاشتراك في editor store
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const whyChooseUsStates = useEditorStore((s) => s.whyChooseUsStates);
```

### المرحلة الثانية: تهيئة البيانات في الـ Store

```typescript
useEffect(() => {
  if (props.useStore) {
    const initialData = {
      ...getDefaultWhyChooseUsData(), // البيانات الافتراضية
      ...props, // البيانات المرسلة كـ props
    };
    ensureComponentVariant("whyChooseUs", uniqueId, initialData);
  }
}, [uniqueId, props.useStore, ensureComponentVariant]);
```

**شرح مفصل لما يحدث هنا:**

1. **`getDefaultWhyChooseUsData()`** - يتم استدعاء هذه الدالة من `whyChooseUsFunctions.ts` للحصول على البيانات الافتراضية
2. **`...props`** - يتم دمج البيانات المرسلة كـ props مع البيانات الافتراضية
3. **`ensureComponentVariant()`** - يتم استدعاء هذه الدالة من الـ editor store لضمان وجود المكون في الـ store

### المرحلة الثالثة: منطق `ensureComponentVariant`

```typescript
// في editorStore.ts
ensureComponentVariant: (componentType, variantId, initial) =>
  set((state) => {
    switch (componentType) {
      case "whyChooseUs":
        return whyChooseUsFunctions.ensureVariant(state, variantId, initial);
      // ... باقي المكونات
    }
  }),
```

**شرح مفصل:**

1. يتم التحقق من نوع المكون (`whyChooseUs`)
2. يتم استدعاء `whyChooseUsFunctions.ensureVariant()` من `whyChooseUsFunctions.ts`
3. هذه الدالة تتحقق من وجود المكون في الـ store، وإذا لم يكن موجوداً، تضيفه

### المرحلة الرابعة: منطق `ensureVariant` في whyChooseUsFunctions

```typescript
// في whyChooseUsFunctions.ts
export const whyChooseUsFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: any) => {
    if (state.whyChooseUsStates[variantId]) {
      return state; // المكون موجود بالفعل
    }

    const defaultData = getDefaultWhyChooseUsData();
    const data: any = initial || state.tempData || defaultData;

    return {
      ...state,
      whyChooseUsStates: {
        ...state.whyChooseUsStates,
        [variantId]: data
      },
    };
  },
```

**شرح مفصل:**

1. **التحقق من الوجود:** يتم التحقق من وجود المكون في `state.whyChooseUsStates[variantId]`
2. **البيانات الافتراضية:** إذا لم يكن موجوداً، يتم استدعاء `getDefaultWhyChooseUsData()`
3. **أولوية البيانات:** `initial` (البيانات المرسلة) > `state.tempData` (البيانات المؤقتة) > `defaultData` (البيانات الافتراضية)
4. **إضافة المكون:** يتم إضافة المكون إلى `whyChooseUsStates` في الـ store

### المرحلة الخامسة: جلب بيانات المستأجر

```typescript
// في whyChooseUs1.tsx
const tenantData = useTenantStore((s) => s.tenantData);
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
const tenantId = useTenantStore((s) => s.tenantId);

useEffect(() => {
  if (tenantId) {
    fetchTenantData(tenantId);
  }
}, [tenantId, fetchTenantData]);
```

**شرح مفصل:**

1. **جلب بيانات المستأجر:** يتم جلب `tenantData` من الـ tenant store
2. **دالة الجلب:** `fetchTenantData` تقوم بجلب البيانات من API
3. **التحقق من المعرف:** يتم التحقق من وجود `tenantId` قبل جلب البيانات

### المرحلة السادسة: منطق `fetchTenantData`

```javascript
// في tenantStore.jsx
fetchTenantData: async (websiteName) => {
  const state = useTenantStore.getState();

  // منع الطلبات المكررة
  if (
    state.loadingTenantData ||
    (state.tenantData && state.tenantData.username === websiteName)
  ) {
    return;
  }

  set({ loadingTenantData: true, error: null });

  try {
    const response = await axiosInstance.post(
      "/v1/tenant-website/getTenant",
      { websiteName },
    );

    const data = response.data || {};

    // تحميل البيانات في editor store
    const { useEditorStore } = await import("./editorStore");
    const editorStore = useEditorStore.getState();

    if (data.globalComponentsData) {
      editorStore.setGlobalComponentsData(data.globalComponentsData);
    }

    set({
      tenantData: data,
      loadingTenantData: false,
      lastFetchedWebsite: websiteName,
    });
  } catch (error) {
    console.error("[tenantStore] Error fetching tenant data:", error);
    set({ error: error.message, loadingTenantData: false });
  }
},
```

**شرح مفصل:**

1. **منع التكرار:** يتم التحقق من عدم وجود طلب جاري أو بيانات موجودة لنفس الموقع
2. **إرسال الطلب:** يتم إرسال طلب POST إلى `/v1/tenant-website/getTenant`
3. **تحميل البيانات:** يتم تحميل البيانات في الـ editor store
4. **تحديث الحالة:** يتم تحديث حالة الـ loading والـ error

### المرحلة السابعة: دمج البيانات في المكون

```typescript
// في whyChooseUs1.tsx
const getTenantComponentData = () => {
  if (!tenantData) {
    return {};
  }

  // البحث في البيانات الجديدة (components array)
  if (tenantData.components && Array.isArray(tenantData.components)) {
    for (const component of tenantData.components) {
      if (
        component.type === "whyChooseUs" &&
        component.componentName === variantId
      ) {
        const componentData = component.data;
        return {
          visible: componentData.visible,
          header: {
            title: componentData.texts?.title || componentData.header?.title,
            description:
              componentData.texts?.subtitle ||
              componentData.header?.description,
            // ... باقي البيانات
          },
          // ... باقي البيانات
        };
      }
    }
  }

  // البحث في البيانات القديمة (componentSettings)
  if (tenantData?.componentSettings) {
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          if (
            (component as any).type === "whyChooseUs" &&
            (component as any).componentName === variantId
          ) {
            return (component as any).data;
          }
        }
      }
    }
  }

  return {};
};

const tenantComponentData = getTenantComponentData();
```

**شرح مفصل:**

1. **التحقق من وجود البيانات:** يتم التحقق من وجود `tenantData`
2. **البحث في البيانات الجديدة:** يتم البحث في `tenantData.components` (هيكل جديد)
3. **البحث في البيانات القديمة:** يتم البحث في `tenantData.componentSettings` (هيكل قديم)
4. **تحويل البيانات:** يتم تحويل البيانات من هيكل API إلى هيكل المكون

### المرحلة الثامنة: دمج البيانات النهائي

```typescript
// في whyChooseUs1.tsx
const storeData = props.useStore
  ? getComponentData("whyChooseUs", uniqueId) || {}
  : {};
const currentStoreData = props.useStore
  ? whyChooseUsStates[uniqueId] || {}
  : {};

// دمج البيانات مع الأولوية: currentStoreData > storeData > tenantComponentData > props > default
const defaultData = getDefaultWhyChooseUsData();
const mergedData = {
  ...defaultData,
  ...props,
  ...tenantComponentData,
  ...storeData,
  ...currentStoreData,
  // دمج الكائنات المتداخلة
  header: {
    ...defaultData.header,
    ...(props.header || {}),
    ...(tenantComponentData.header || {}),
    ...(storeData.header || {}),
    ...(currentStoreData.header || {}),
    typography: {
      ...defaultData.header?.typography,
      ...(props.header?.typography || {}),
      ...(tenantComponentData.header?.typography || {}),
      ...(storeData.header?.typography || {}),
      ...(currentStoreData.header?.typography || {}),
    },
  },
  features: {
    ...defaultData.features,
    ...(props.features || {}),
    ...(tenantComponentData.features || {}),
    ...(storeData.features || {}),
    ...(currentStoreData.features || {}),
    // ... باقي الكائنات المتداخلة
  },
  // ... باقي البيانات
};
```

**شرح مفصل لأولوية البيانات:**

1. **`defaultData`** - البيانات الافتراضية (الأولوية الأقل)
2. **`props`** - البيانات المرسلة كـ props
3. **`tenantComponentData`** - البيانات من قاعدة البيانات
4. **`storeData`** - البيانات المحفوظة في الـ store
5. **`currentStoreData`** - البيانات الحالية في الـ store (الأولوية الأعلى)

### المرحلة التاسعة: تطبيق البيانات في الـ JSX

```typescript
// في whyChooseUs1.tsx
return (
  <section
    className="w-full bg-background"
    style={{
      backgroundColor:
        mergedData.background?.color ||
        mergedData.styling?.bgColor ||
        mergedData.colors?.background ||
        "#ffffff",
      paddingTop: mergedData.layout?.padding?.y || "py-14",
      paddingBottom: mergedData.layout?.padding?.smY || "sm:py-16",
    }}
  >
    <div
      className="mx-auto"
      style={{ maxWidth: mergedData.layout?.maxWidth || "1600px" }}
      dir={mergedData.layout?.direction || "rtl"}
    >
      <header
        className={`${mergedData.header?.marginBottom || "mb-10"} ${mergedData.header?.textAlign || "text-right"} ${mergedData.header?.paddingX || "px-5"}`}
      >
        <h2
          className={
            mergedData.header?.typography?.title?.className ||
            "section-title text-right"
          }
          style={{
            color:
              mergedData.styling?.textColor ||
              mergedData.colors?.textColor ||
              undefined,
          }}
        >
          {mergedData.header?.title || "لماذا تختارنا؟"}
        </h2>
        {/* ... باقي المحتوى */}
      </header>
      {/* ... باقي المكون */}
    </div>
  </section>
);
```

## مثال مفصل: مكون Testimonials

### تهيئة المكون

```typescript
// في testimonials1.tsx
export default function TestimonialsSection(props: TestimonialsProps = {}) {
  const variantId = props.variant || "testimonials1";

  // الاشتراك في editor store
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
```

### منطق دمج البيانات

```typescript
// في testimonials1.tsx
const getTenantComponentData = () => {
  if (!tenantData?.componentSettings) return {};

  // البحث في جميع الصفحات
  for (const [pageSlug, pageComponents] of Object.entries(
    tenantData.componentSettings,
  )) {
    if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
      for (const [componentId, component] of Object.entries(
        pageComponents as any,
      )) {
        if (
          (component as any).type === "testimonials" &&
          (component as any).componentName === variantId &&
          componentId === props.id
        ) {
          return (component as any).data;
        }
      }
    }
  }
  return {};
};

const tenantComponentData = getTenantComponentData();

// دمج البيانات مع الأولوية: storeData > tenantComponentData > props > default
const mergedData = {
  ...getDefaultTestimonialsData(),
  ...props,
  ...tenantComponentData,
  ...storeData,
};
```

## آلية الـ Caching المتقدمة

### 1. Cache Invalidation

```typescript
// في editorStore.ts
updateComponentByPath: (componentType, variantId, path, value) =>
  set((state) => {
    // استخدام دوال المكونات المحددة
    let newState: any = {};

    switch (componentType) {
      case "whyChooseUs":
        newState = whyChooseUsFunctions.updateByPath(state, variantId, path, value);
        break;
      case "testimonials":
        newState = testimonialsFunctions.updateByPath(state, variantId, path, value);
        break;
      // ... باقي المكونات
    }

    // تحديث pageComponents
    const updatedState = { ...state, ...newState };
    const updatedPageComponents = updatedState.pageComponentsByPage[updatedState.currentPage] || [];

    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === componentType && comp.id === variantId) {
        const updatedData = updatedState[`${componentType}States`]?.[variantId] || comp.data;
        return {
          ...comp,
          data: updatedData,
        };
      }
      return comp;
    });

    return {
      ...newState,
      pageComponentsByPage: {
        ...updatedState.pageComponentsByPage,
        [updatedState.currentPage]: updatedComponents,
      },
    };
  }),
```

### 2. Deep Merge Algorithm

```typescript
// في editorStore.ts
const deepMerge = (target: any, source: any): any => {
  if (!source || typeof source !== "object") return target || source;
  if (!target || typeof target !== "object") return source;

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
};
```

### 3. Path-based Updates

```typescript
// في editorStoreFunctions/types.ts
export const updateDataByPath = (data: any, path: string, value: any): any => {
  const segments = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  const newData = { ...data };
  let cursor: any = newData;

  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i]!;
    const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
    const existing = cursor[key];

    if (
      existing == null ||
      typeof existing === "string" ||
      typeof existing === "number" ||
      typeof existing === "boolean"
    ) {
      cursor[key] = nextIsIndex ? [] : {};
    } else if (Array.isArray(existing) && !nextIsIndex) {
      cursor[key] = {};
    } else if (
      typeof existing === "object" &&
      !Array.isArray(existing) &&
      nextIsIndex
    ) {
      cursor[key] = [];
    }
    cursor = cursor[key];
  }

  const lastKey = segments[segments.length - 1]!;
  cursor[lastKey] = value;

  return newData;
};
```

## استدعاءات الكود المفصلة

### 1. استدعاء `useEditorStore`

```typescript
// في whyChooseUs1.tsx
const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
```

**ما يحدث هنا:**

1. يتم استدعاء `useEditorStore` من Zustand
2. يتم استخراج `ensureComponentVariant` من الـ store
3. هذه الدالة مسؤولة عن ضمان وجود المكون في الـ store

### 2. استدعاء `useTenantStore`

```typescript
// في whyChooseUs1.tsx
const tenantData = useTenantStore((s) => s.tenantData);
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
const tenantId = useTenantStore((s) => s.tenantId);
```

**ما يحدث هنا:**

1. يتم استخراج `tenantData` من الـ tenant store
2. يتم استخراج `fetchTenantData` للجلب من API
3. يتم استخراج `tenantId` للتحقق من وجود المستأجر

### 3. استدعاء `getDefaultWhyChooseUsData`

```typescript
// في whyChooseUs1.tsx
const defaultData = getDefaultWhyChooseUsData();
```

**ما يحدث هنا:**

1. يتم استدعاء الدالة من `whyChooseUsFunctions.ts`
2. يتم إرجاع البيانات الافتراضية للمكون
3. هذه البيانات تستخدم كـ fallback عند عدم وجود بيانات أخرى

### 4. استدعاء `getComponentData`

```typescript
// في whyChooseUs1.tsx
const storeData = props.useStore
  ? getComponentData("whyChooseUs", uniqueId) || {}
  : {};
```

**ما يحدث هنا:**

1. يتم التحقق من `props.useStore` لمعرفة إذا كان المكون يستخدم الـ store
2. إذا كان يستخدم، يتم استدعاء `getComponentData` من الـ editor store
3. يتم البحث عن البيانات باستخدام `componentType` و `variantId`

### 5. استدعاء `getTenantComponentData`

```typescript
// في whyChooseUs1.tsx
const tenantComponentData = getTenantComponentData();
```

**ما يحدث هنا:**

1. يتم البحث في `tenantData.components` (الهيكل الجديد)
2. يتم البحث في `tenantData.componentSettings` (الهيكل القديم)
3. يتم إرجاع البيانات المطابقة للمكون المطلوب

## مثال عملي: تدفق البيانات الكامل

### السيناريو: تحميل مكون WhyChooseUs1

1. **البداية:** المستخدم يفتح الصفحة
2. **تحميل المكون:** يتم تحميل `WhyChooseUsSection` مع `props.useStore = true`
3. **تهيئة الـ Store:** يتم استدعاء `ensureComponentVariant("whyChooseUs", "whyChooseUs1", initialData)`
4. **البيانات الافتراضية:** يتم استدعاء `getDefaultWhyChooseUsData()` للحصول على البيانات الافتراضية
5. **جلب بيانات المستأجر:** يتم استدعاء `fetchTenantData(tenantId)` لجلب البيانات من API
6. **دمج البيانات:** يتم دمج البيانات من جميع المصادر مع الأولوية المحددة
7. **عرض المكون:** يتم عرض المكون بالبيانات المدمجة

### السيناريو: تحديث مكون Testimonials

1. **التحديث:** المستخدم يغير عنوان الشهادات
2. **استدعاء التحديث:** يتم استدعاء `updateComponentByPath("testimonials", "testimonials1", "title", "عنوان جديد")`
3. **تحديث الـ Store:** يتم تحديث `testimonialsStates["testimonials1"]` في الـ editor store
4. **تحديث الصفحة:** يتم تحديث `pageComponentsByPage` للصفحة الحالية
5. **إعادة العرض:** يتم إعادة عرض المكون بالبيانات الجديدة

## الخلاصة

نظام الـ caching في هذا المشروع هو نظام معقد ومتطور يتضمن:

1. **طبقات متعددة:** Default Data → Store → Component
2. **دمج ذكي:** دمج البيانات من مصادر متعددة مع الأولوية
3. **تحديث فوري:** تحديث فوري للواجهة عند تغيير البيانات
4. **إدارة الحالة:** إدارة شاملة لحالة المكونات والبيانات
5. **تحسين الأداء:** تجنب الطلبات المكررة والتحميل غير الضروري

هذا النظام يضمن أن المكونات تعمل بكفاءة عالية مع إمكانية التخصيص الكامل للبيانات والعرض.

# WebsiteLayout و Meta Tags (تحديث جديد)

## نظرة عامة

تمت إضافة كيان عام على مستوى الموقع يسمى `WebsiteLayout` لإدارة بيانات الـ Meta Tags لكل صفحة. يتم جلب هذا الكيان من الـ backend ضمن استجابة `getTenant` ويُخزّن داخل `editorStore` ليصبح متاحاً أثناء التحرير والبناء.

- مكان التخزين في الـ editor store: `WebsiteLayout.metaTags.pages`
- كل عنصر داخل `pages` يمثل صفحة بمسار `path` وحقول SEO وOpen Graph مرافقة.

## شكل البيانات القادم من الـ backend

يصل الحقل ضمن `getTenant` بالشكل التالي (مثال يعكس البنية):

```json
{
  "WebsiteLayout": {
    "metaTags": {
      "pages": [
        {
          "path": "/",
          "TitleAr": "الصفحة الرئيسية",
          "TitleEn": "Homepage",
          "DescriptionAr": "مرحباً بكم في موقعنا - الصفحة الرئيسية",
          "DescriptionEn": "Welcome to our website - Homepage",
          "KeywordsAr": "الرئيسية, الموقع, الصفحة الرئيسية",
          "KeywordsEn": "homepage, main, website",
          "Author": "الموقع",
          "AuthorEn": "Website",
          "Robots": "index, follow",
          "RobotsEn": "index, follow",
          "og:title": "الصفحة الرئيسية",
          "og:description": "مرحباً بكم في موقعنا",
          "og:keywords": "الرئيسية, الموقع",
          "og:author": "الموقع",
          "og:robots": "index, follow",
          "og:url": null,
          "og:image": null,
          "og:type": "website",
          "og:locale": "ar",
          "og:locale:alternate": "en",
          "og:site_name": "الموقع",
          "og:image:width": null,
          "og:image:height": null,
          "og:image:type": null,
          "og:image:alt": "الصفحة الرئيسية"
        }
      ]
    }
  }
}
```

ملاحظات:

- الحقول مثل `og:image:width/height/type` قد تكون `null` وتُعامل كاختيارية.
- الحقل `path` هو المعرّف المنطقي للصفحة لربط الميتا بالمسار.

## كيف تُحمّل داخل الـ Editor Store

يتم تعيين `WebsiteLayout` بعد الجلب مباشرة داخل `tenantStore`:

```356:361:context-liveeditor/tenantStore.jsx
      if (
        data.WebsiteLayout &&
        data.WebsiteLayout.metaTags &&
        data.WebsiteLayout.metaTags.pages
      ) {
        editorStore.setWebsiteLayout(data.WebsiteLayout);
      }
```

ويُعرّف الـ `editorStore` البنية ودوال الإدارة:

```133:168:context-liveeditor/editorStore.ts
  // WebsiteLayout - Meta tags and SEO data
  WebsiteLayout: {
    metaTags: {
      pages: Array<{
        TitleAr: string;
        TitleEn: string;
        DescriptionAr: string;
        DescriptionEn: string;
        KeywordsAr: string;
        KeywordsEn: string;
        Author: string;
        AuthorEn: string;
        Robots: string;
        RobotsEn: string;
        "og:title": string;
        "og:description": string;
        "og:keywords": string;
        "og:author": string;
        "og:robots": string;
        "og:url": string;
        "og:image": string;
        "og:type": string;
        "og:locale": string;
        "og:locale:alternate": string;
        "og:site_name": string;
        "og:image:width": string;
        "og:image:height": string;
        "og:image:type": string;
        "og:image:alt": string;
        path: string;
      }>;
    };
  };
```

ودوال التعديل:

```2080:2095:context-liveeditor/editorStore.ts
  // WebsiteLayout functions
  setWebsiteLayout: (data) =>
    set((state) => ({
      WebsiteLayout: data,
    })),

  addPageToWebsiteLayout: (pageData) =>
    set((state) => ({
      WebsiteLayout: {
        ...state.WebsiteLayout,
        metaTags: {
          ...state.WebsiteLayout.metaTags,
          pages: [...state.WebsiteLayout.metaTags.pages, pageData],
        },
      },
    })),
```

## التكامل مع الكاشينج

- `WebsiteLayout` كيان عالمي مستقل عن حالات المكونات (لا يدخل ضمن `componentStates`).
- يجري تحديثه فورياً داخل المحرر مثل بقية الحالات، مع بقاء أولوية دمج بيانات المكوّنات كما هي.
- يُستخدم عند توليد الصفحات لضبط العناوين، الأوصاف، الكلمات المفتاحية وحقول Open Graph.

---

# Advanced Component Functions: halfTextHalfImageFunctions.ts

## Overview

The `halfTextHalfImageFunctions.ts` file is a comprehensive example of how to implement component-specific store management functions in the caching system. This file demonstrates advanced patterns including multiple variants, complex data structures, and sophisticated state management.

## File Structure Analysis

### 1. Multiple Default Data Functions

The file contains **three different default data functions** for different variants of the same component type:

```typescript
// Basic variant - Simple text and image layout
export const getDefaultHalfTextHalfImageData = (): ComponentData => ({
  visible: true,
  layout: {
    direction: "rtl",
    textWidth: 52.8,
    imageWidth: 47.2,
    gap: "16",
    minHeight: "369px",
  },
  // ... complex nested structure
});

// Advanced variant - With statistics and enhanced features
export const getDefaultHalfTextHalfImage2Data = (): ComponentData => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    gridCols: "md:grid-cols-10",
    // ... more complex layout options
  },
  content: {
    // ... content with stats
    stats: {
      stat1: { value: "+100", label: "عميل سعيد" },
      stat2: { value: "+50", label: "عقار تم بيعه" },
      // ... more statistics
    },
  },
  // ... enhanced features
});

// Legacy variant - Backward compatibility
export const getDefaultHalfTextHalfImage3Data = (): ComponentData => ({
  visible: true,
  // Legacy props for backward compatibility
  title: "رسالتنا",
  description: "نحن في مكتب دليل الجواء العقاري...",
  imageSrc: "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
  // New structure for editor compatibility - MUST match the legacy props
  content: {
    title: "رسالتنا",
    description: "نحن في مكتب دليل الجواء العقاري...",
    imagePosition: "left",
  },
  // ... rest of structure
});
```

**Key Insights:**

- **Variant-specific defaults**: Each function provides different default data based on the component variant
- **Backward compatibility**: Legacy props are maintained alongside new structure
- **Complex nested objects**: Deep object structures with multiple levels of configuration
- **Responsive design**: Mobile, tablet, and desktop configurations
- **Animation support**: Built-in animation configurations

### 2. Advanced State Management Functions

The `halfTextHalfImageFunctions` object contains sophisticated state management:

```typescript
export const halfTextHalfImageFunctions = {
  // Ensure variant exists with intelligent data selection
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Comprehensive logging for debugging
    logEditorStore("ENSURE_VARIANT_CALLED", variantId, "unknown", {
      variantId,
      hasInitial: !!(initial && Object.keys(initial).length > 0),
      initialKeys: initial ? Object.keys(initial) : [],
      existingData: state.halfTextHalfImageStates[variantId]
        ? Object.keys(state.halfTextHalfImageStates[variantId])
        : [],
      allVariants: Object.keys(state.halfTextHalfImageStates),
    });

    // Priority 1: Always use new initial data if provided
    if (initial && Object.keys(initial).length > 0) {
      logEditorStore("OVERRIDE_EXISTING_DATA", variantId, "unknown", {
        oldData: state.halfTextHalfImageStates[variantId],
        newData: initial,
        reason: "Initial data provided",
      });

      return {
        halfTextHalfImageStates: {
          ...state.halfTextHalfImageStates,
          [variantId]: initial,
        },
      };
    }

    // Priority 2: Check if variant already exists
    if (
      state.halfTextHalfImageStates[variantId] &&
      Object.keys(state.halfTextHalfImageStates[variantId]).length > 0
    ) {
      logEditorStore("VARIANT_ALREADY_EXISTS", variantId, "unknown", {
        existingData: state.halfTextHalfImageStates[variantId],
        reason: "Variant already exists with data",
      });
      return {}; // No changes needed
    }

    // Priority 3: Select appropriate default data based on variant
    let defaultData;
    if (variantId === "halfTextHalfImage2") {
      defaultData = getDefaultHalfTextHalfImage2Data();
    } else if (variantId === "halfTextHalfImage3") {
      defaultData = getDefaultHalfTextHalfImage3Data();
    } else {
      defaultData = getDefaultHalfTextHalfImageData(); // Fallback
    }

    // Priority 4: Use initial data, temp data, or default data
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      halfTextHalfImageStates: {
        ...state.halfTextHalfImageStates,
        [variantId]: data,
      },
    };
  },

  // Simple data retrieval
  getData: (state: any, variantId: string) =>
    state.halfTextHalfImageStates[variantId] || {},

  // Advanced data setting with page component synchronization
  setData: (state: any, variantId: string, data: ComponentData) => {
    const currentPage = state.currentPage;
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];

    // Update page components to keep them in sync
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "halfTextHalfImage" && comp.id === variantId) {
        return { ...comp, data: data };
      }
      return comp;
    });

    return {
      halfTextHalfImageStates: {
        ...state.halfTextHalfImageStates,
        [variantId]: data,
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    };
  },

  // Path-based updates with page component synchronization
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.halfTextHalfImageStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    const currentPage = state.currentPage;
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];

    // Update page components to keep them in sync
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "halfTextHalfImage" && comp.id === variantId) {
        return { ...comp, data: newData };
      }
      return comp;
    });

    return {
      halfTextHalfImageStates: {
        ...state.halfTextHalfImageStates,
        [variantId]: newData,
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    };
  },
};
```

## Advanced Patterns Demonstrated

### 1. **Intelligent Data Selection**

The `ensureVariant` function demonstrates sophisticated data selection logic:

```typescript
// Priority system for data selection:
// 1. New initial data (always overrides)
// 2. Existing variant data (preserves current state)
// 3. Variant-specific default data (smart defaults)
// 4. Fallback default data (safety net)
```

### 2. **Comprehensive Logging System**

Every operation is logged for debugging and monitoring:

```typescript
logEditorStore("ENSURE_VARIANT_CALLED", variantId, "unknown", {
  variantId,
  hasInitial: !!(initial && Object.keys(initial).length > 0),
  initialKeys: initial ? Object.keys(initial) : [],
  existingData: state.halfTextHalfImageStates[variantId]
    ? Object.keys(state.halfTextHalfImageStates[variantId])
    : [],
  allVariants: Object.keys(state.halfTextHalfImageStates),
});
```

### 3. **Page Component Synchronization**

All state changes are synchronized with page components:

```typescript
// Update both component state and page components
const updatedComponents = updatedPageComponents.map((comp: any) => {
  if (comp.type === "halfTextHalfImage" && comp.id === variantId) {
    return { ...comp, data: newData };
  }
  return comp;
});
```

### 4. **Complex Data Structures**

The default data includes sophisticated configurations:

```typescript
// Responsive design configuration
responsive: {
  mobile: {
    textOrder: 2,
    imageOrder: 1,
    textWidth: "w-full",
    imageWidth: "w-full",
    marginBottom: "mb-10",
  },
  tablet: {
    textOrder: 2,
    imageOrder: 1,
    textWidth: "w-full",
    imageWidth: "w-full",
    marginBottom: "mb-10",
  },
  desktop: {
    textOrder: 1,
    imageOrder: 2,
    textWidth: "md:w-[52.8%]",
    imageWidth: "md:w-[47.2%]",
    marginBottom: "md:mb-0",
  },
},

// Animation configuration
animations: {
  text: {
    enabled: true,
    type: "fade-up",
    duration: 600,
    delay: 200,
  },
  image: {
    enabled: true,
    type: "fade-up",
    duration: 600,
    delay: 400,
  },
},
```

## Implementation Guide for New Components

When creating a new component following this pattern:

### 1. **Create Default Data Functions**

```typescript
export const getDefaultYourComponentData = (): ComponentData => ({
  visible: true,
  layout: {
    // Your layout configuration
  },
  content: {
    // Your content structure
  },
  // ... other sections
});
```

### 2. **Implement Component Functions**

```typescript
export const yourComponentFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Log the operation
    logEditorStore("ENSURE_VARIANT_CALLED", variantId, "yourComponent", {
      // Logging data
    });

    // Priority 1: Use initial data if provided
    if (initial && Object.keys(initial).length > 0) {
      return {
        yourComponentStates: {
          ...state.yourComponentStates,
          [variantId]: initial,
        },
      };
    }

    // Priority 2: Check if variant exists
    if (
      state.yourComponentStates[variantId] &&
      Object.keys(state.yourComponentStates[variantId]).length > 0
    ) {
      return {}; // No changes needed
    }

    // Priority 3: Use default data
    const defaultData = getDefaultYourComponentData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      yourComponentStates: {
        ...state.yourComponentStates,
        [variantId]: data,
      },
    };
  },

  getData: (state: any, variantId: string) =>
    state.yourComponentStates[variantId] || {},

  setData: (state: any, variantId: string, data: ComponentData) => {
    // Update page components for synchronization
    const currentPage = state.currentPage;
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "yourComponent" && comp.id === variantId) {
        return { ...comp, data: data };
      }
      return comp;
    });

    return {
      yourComponentStates: {
        ...state.yourComponentStates,
        [variantId]: data,
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    };
  },

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.yourComponentStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    // Update page components for synchronization
    const currentPage = state.currentPage;
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "yourComponent" && comp.id === variantId) {
        return { ...comp, data: newData };
      }
      return comp;
    });

    return {
      yourComponentStates: {
        ...state.yourComponentStates,
        [variantId]: newData,
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    };
  },
};
```

### 3. **Update Editor Store**

Add your component to the editor store interface and implementation:

```typescript
// In editorStore.ts interface
yourComponentStates: Record<string, ComponentData>;
ensureYourComponentVariant: (variantId: string, initial?: ComponentData) => void;
getYourComponentData: (variantId: string) => ComponentData;
setYourComponentData: (variantId: string, data: ComponentData) => void;
updateYourComponentByPath: (variantId: string, path: string, value: any) => void;

// In editorStore.ts implementation
yourComponentStates: {},

// Add to ensureComponentVariant switch
case "yourComponent":
  return yourComponentFunctions.ensureVariant(state, variantId, initial);

// Add to getComponentData switch
case "yourComponent":
  return yourComponentFunctions.getData(state, variantId);

// Add to setComponentData switch
case "yourComponent":
  newState = yourComponentFunctions.setData(state, variantId, data);
  break;

// Add to updateComponentByPath switch
case "yourComponent":
  newState = yourComponentFunctions.updateByPath(state, variantId, path, value);
  break;
```

## Key Benefits of This Pattern

1. **Type Safety**: Full TypeScript support with proper interfaces
2. **Debugging**: Comprehensive logging for troubleshooting
3. **Performance**: Efficient state management with minimal re-renders
4. **Flexibility**: Support for multiple variants and complex data structures
5. **Synchronization**: Automatic page component updates
6. **Maintainability**: Clear separation of concerns and modular design
7. **Scalability**: Easy to extend with new features and variants

This pattern ensures that your components integrate seamlessly with the caching system while maintaining high performance and developer experience.
