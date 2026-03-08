# Component Structure

شروحات وتعريفات الـ **Component Structure** (ملفات مثل `header.ts`, `footer.ts`, `grid.ts` في `componentsStructure/`).

- منطق الحقول، الـ `condition`، الـ variants، والربط مع الـ Editor Sidebar.
- للشرح التفصيلي لـ `condition`: [./components-structure-condition.md](./components-structure-condition.md)

---

## Dimensions: padding, height, width, margin, maxWidth, maxHeight (إجباري)

- **قاعدة إجبارية:** أي حقل في الـ structure يمثل **padding** أو **height** أو **width** أو **margin** أو **maxWidth** أو **maxHeight** يجب أن يكون **`type: "number"`** مع إضافة **`unit`** (مثل `"px"`, `"vh"`, `"%"`)، و**ليس** `type: "text"`.
- في المكونات المستهلكة استخدم الدالة `toDimension(value, unit, fallback)` من `lib/utils.ts` عند تطبيق القيمة على `style`.

---

## Badge-select (حقل اختيار على شكل badges)

- نوع حقل **`type: "badge-select"`** يعرض الخيارات كأزرار badges (`rounded-full`) بدلاً من قائمة منسدلة، مع نفس شكل الداتا (قيمة نصية واحدة أو قيم متعددة مفصولة بفاصلة).
- يُعرّف عبر **`options`** (نفس شكل الـ select: `{ label, value }`) مع **`badgeConfig`** اختياري للتحكم في الوضع والتحقق والأنماط.
- للتفاصيل والأمثلة: [./badge-select-field.md](./badge-select-field.md). الحقل جاهز للاستخدام المستقبلي (مثل الـ header أو الفلاتر) ولا يُستخدم حالياً في أي component structure.
