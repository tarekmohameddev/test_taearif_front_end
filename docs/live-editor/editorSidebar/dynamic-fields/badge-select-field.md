# Badge-select field

حقل ديناميكي من نوع **`badge-select`** يعرض الخيارات كأزرار على شكل badges (دائرية `rounded-full`) بدلاً من قائمة منسدلة. القيمة المخزنة مثل الـ dropdown: **string واحدة** في الوضع single، أو **قيم متعددة مفصولة بفاصلة** في الوضع multi.

## التعريف في componentsStructure

يُستخدم نفس **`options`** المستخدمة في حقل `select` (مصفوفة `{ label, value }`). الـ `label` يكون مفتاح ترجمة يُمرَّر إلى `t()` في الـ Live Editor.

مثال تعريف (توثيقي، غير مستخدم حالياً في أي structure):

```ts
{
  key: "header.linkMode",
  label: "Link mode",
  type: "badge-select",
  options: [
    { label: "common.navigate", value: "navigate" },
    { label: "common.external", value: "external" },
    { label: "common.none", value: "none" },
  ],
  badgeConfig: {
    mode: "single",
    requiredAtLeastOne: false,
    allowUnset: true,
    requiredValues: [], // قيم إجبارية إن لزم
    styles: undefined, // اختياري: تخصيص ألوان الخلفية/الحدود/النص
  },
}
```

## badgeConfig

| الخاصية | النوع | الوصف |
|--------|--------|--------|
| `mode` | `"single"` \| `"multi"` | **single**: قيمة واحدة (string). **multi**: عدة قيم مخزنة كـ string مفصولة بفاصلة. |
| `requiredAtLeastOne` | `boolean` | إذا `true` يجب اختيار badge واحدة على الأقل؛ يظهر خطأ تحقق في الواجهة. |
| `requiredValues` | `string[]` | قائمة قيم (`value`) يجب أن تكون كلها ضمن المختار قبل أن يكون الحقل صالحاً. |
| `allowUnset` | `boolean` | إن كان `true` (والحقل غير مطلوب)، يمكن إلغاء الاختيار بالكامل. الافتراضي: `true` عندما لا يكون `requiredAtLeastOne`. |
| `styles` | `object` | تخصيص مظهر الـ badges. إن وُجد يُطبَّق كـ inline styles؛ وإلا تُستخدم كلاسات Tailwind الافتراضية (شفاف + حد رمادي للمُلغى، أسود + أبيض للمختار). |

### styles (اختياري)

```ts
badgeConfig: {
  styles: {
    unselected?: { bg?: string; border?: string; text?: string };
    selected?:   { bg?: string; text?: string };
  },
}
```

- **unselected**: خلفية، حد، ولون النص للزر غير المختار.
- **selected**: خلفية ولون النص للزر المختار.

## التحقق (Validation)

- يتم التحقق داخل الـ renderer:
  - `requiredAtLeastOne`: يظهر خطأ إذا لم يُختر أي badge.
  - `requiredValues`: يظهر خطأ إذا لم تُختر كل القيم المطلوبة.
- رسالة الخطأ تظهر أسفل مجموعة الـ badges بنفس أسلوب حقل الـ select.
- تدفق الحفظ الحالي لا يتغير؛ التحقق للعرض فقط ولا يمنع التحديث في الـ store.

## الاستخدام المستقبلي

الحقل جاهز لاستخدامه في:
- الـ header (أنواع الروابط، الأوضاع).
- الفلاتر أو المودز في الصفحات المختلفة.

لا يُربط حالياً بأي Component Structure فعلي؛ التعريف أعلاه لأغراض التوثيق والاستخدام لاحقاً.
