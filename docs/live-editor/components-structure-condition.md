# شرط `condition` في Component Structure

هذا الملف يشرح كيفية استخدام **`condition`** في تعريفات الحقول داخل ملفات الـ Component Structure (مثل `header.ts`, `footer.ts`, `grid.ts`, …). الشرط يتحكم في **متى يظهر حقل معيّن في الـ Editor Sidebar** حسب قيمة حقل آخر في البيانات.

---

## 1. الشكل في التعريف (Types)

في `componentsStructure/types.ts`، الحقل الاختياري `condition` معرّف كالتالي:

```ts
condition?: {
  field: string;  // مسار الحقل الذي يُفحص (مثل "type" أو "content.useCustomFooterLogo")
  value: any;     // القيمة المطلوبة لظهور الحقل (نص، boolean، أو مصفوفة قيم)
};
```

- **`field`**: مسار الحقل في بيانات المكوّن (نسبي أو مطلق، يدعم المسارات بنقطة مثل `content.companyInfo.useCustomFooterLogo`).
- **`value`**: القيمة التي يجب أن تكون عند `field` حتى **يُعرض** الحقل. يمكن أن تكون:
  - قيمة واحدة (نص، عدد، …)
  - **مصفوفة**: الحقل يظهر إذا كانت قيمة `field` **ضمن** المصفوفة
  - **boolean**: يُعادل مع true/false (مع تطبيع من "true"/1 إلى true)

---

## 2. أين يُطبَّق الشرط

التحقق من `condition` يتم في **DynamicFieldsRenderer** (الـ Live Editor): قبل عرض أي حقل، إذا وُجد `def.condition` يُحسب المسار الكامل لحقل الشرط، تُقرأ قيمته من البيانات، ثم تُقارن مع `condition.value`. إذا لم تتحقق المقارنة، الحقل **لا يُعرض** (`return null`).

---

## 3. طريقة تقييم الشرط

1. **حساب مسار حقل الشرط (`conditionPath`)**  
   - إذا كان `condition.field` يحتوي على نقطة (مثل `content.useCustomFooterLogo`) يُستخدم كما هو.  
   - إذا لم يكن فيه نقطة، يُربط بمسار الأب حسب سياق الحقل الحالي (`basePath` أو من `def.key`) حتى يُقرأ من نفس مستوى/أب البيانات الصحيح.

2. **قراءة القيمة الحالية**  
   `conditionFieldValue = getValueByPath(conditionPath)`

3. **المقارنة مع `condition.value`**  
   - إذا **`value` مصفوفة**: الحقل يظهر إذا `conditionFieldValue` **موجود ضمن** المصفوفة (`expected.includes(conditionFieldValue)`).  
   - إذا **`value` boolean**: تُطبَّق تطبيع (مثلاً `"true"` أو `1` → true) ثم مقارنة مع `expected`.  
   - غير ذلك: مقارنة مباشرة (`conditionFieldValue === expected`).

4. **النتيجة**  
   إذا لم تتحقق المقارنة → الحقل لا يُعرض.

---

## 4. أمثلة من `header.ts`

### مثال 1: ظهور حقل حسب `type` (قيمة واحدة من عدة)

```ts
{
  key: "linkGroup",
  label: "URL / Click Action",
  type: "text",
  displayAsGroup: true,
  condition: { field: "type", value: ["image", "image+text", "text"] },
  groupFields: [
    { key: "logo.url", label: "URL", type: "text" },
    {
      key: "logo.clickAction",
      label: "Click Action",
      type: "select",
      displayAsSwitch: true,
      options: [
        { label: "Navigate", value: "navigate" },
        { label: "None", value: "none" },
      ],
    },
  ],
},
```

- **المعنى:** مجموعة "URL / Click Action" (مع حقلي URL و Click Action) **تظهر فقط** عندما يكون حقل `type` في نفس المستوى يساوي أحد: `"image"` أو `"image+text"` أو `"text"`.

### مثال 2: حقول مختلفة لـ `type` مختلف

```ts
{
  key: "logo.image",
  label: "Logo Image",
  type: "image",
  condition: { field: "type", value: ["image", "image+text"] },
},
{
  key: "logo.text",
  label: "Logo Text",
  type: "text",
  condition: { field: "type", value: ["text", "image+text"] },
},
```

- حقل الصورة يظهر عندما `type` = `"image"` أو `"image+text"`.  
- حقل النص يظهر عندما `type` = `"text"` أو `"image+text"`.

### مثال 3: شرط على boolean (من ملفات أخرى مثل footer)

```ts
condition: { field: "useCustomFooterLogo", value: true }
```

- الحقل يظهر **فقط** عندما `useCustomFooterLogo === true` (مع تطبيع للـ boolean).

---

## 5. أمثلة من ملفات أخرى

| الملف | مثال استخدام |
|--------|-----------------|
| **footer.ts** | `condition: { field: "type", value: "..." }` و `condition: { field: "useCustomFooterLogo", value: true/false }` |
| **grid.ts** | `condition: { field: "theme", value: "..." }` و `condition: { field: "unifyColors", value: true/false }` |
| **propertyFilter.ts** | `condition: { field: "content.propertyTypesSource", value: "..." }` |
| **hero.ts** | `condition: { field: "barType", value: "..." }` أو `propertyFilterConfig.propertyTypesSource` |
| **imageText.ts** | `condition: { field: "background.type", value: "..." }` و `condition: { field: "type", value: "..." }` |

---

## 6. ملخص سريع

| العنصر | الوصف |
|--------|--------|
| **الغرض** | إظهار/إخفاء حقل (أو مجموعة حقول) في الـ Editor حسب قيمة حقل آخر |
| **المكان** | أي `FieldDefinition` داخل `componentsStructure/*.ts` |
| **الشكل** | `condition: { field: "path.to.field", value: valueOrArray }` |
| **مصفوفة `value`** | الحقل يظهر إذا كانت قيمة `field` **ضمن** المصفوفة |
| **boolean** | يُطبق تطبيع ثم مقارنة مع true/false |
| **تحديد المسار** | إذا `field` بدون نقطة يُربط بمسار الأب للحقل الحالي حتى يُقرأ من المكان الصحيح في البيانات |

---

**المرجع في الكود:**  
- التعريف: `componentsStructure/types.ts` (FieldDefinitionBase.condition)  
- التطبيق: `components/tenant/live-editor/EditorSidebar/components/DynamicFieldsRenderer.tsx` (قسم conditional rendering)
