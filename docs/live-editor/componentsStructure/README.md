# Component Structure

شروحات وتعريفات الـ **Component Structure** (ملفات مثل `header.ts`, `footer.ts`, `grid.ts` في `componentsStructure/`).

- منطق الحقول، الـ `condition`، الـ variants، والربط مع الـ Editor Sidebar.
- للشرح التفصيلي لـ `condition`: [./components-structure-condition.md](./components-structure-condition.md)

---

## Dimensions: padding, height, width, margin, maxWidth, maxHeight (إجباري)

- **قاعدة إجبارية:** أي حقل في الـ structure يمثل **padding** أو **height** أو **width** أو **margin** أو **maxWidth** أو **maxHeight** يجب أن يكون **`type: "number"`** مع إضافة **`unit`** (مثل `"px"`, `"vh"`, `"%"`)، و**ليس** `type: "text"`.
- في المكونات المستهلكة استخدم الدالة `toDimension(value, unit, fallback)` من `lib/utils.ts` عند تطبيق القيمة على `style`.
