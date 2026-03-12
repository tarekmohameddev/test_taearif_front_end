# منع الطلبات المكررة لـ Access Control

## الملخص

تم تطبيق نمط **PREVENT_DUPLICATE_API_PROMPT** على استدعاءات الـ API المستخدمة في `/dashboard/access-control` (وصفحات الأدوار، إنشاء/تعديل/عرض الموظف، ونشاط الموظف).

## المرجع

- `docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md`
- `docs/important/liveEditor/TENANT_STORE_AND_API.md`

## الحراس المطبقة

1. **Loading guard:** إذا كان طلب لنفس المورد قيد التنفيذ (مثلاً عبر `useRef` أو حالة `loading`) → عدم بدء طلب جديد.
2. **Cache / identity guard:** إذا وُجدت بيانات لنفس المفتاح (نفس الـ id أو نفس المورد) → استخدامها وعدم إعادة الجلب.
3. **Last-fetched guard (اختياري):** في بعض الحالات تم استخدام `lastFetchedX` أو ref لمنع الطلبات المتتالية السريعة لنفس المفتاح.

عند بدء الطلب: تعيين `loading = true` ومسح الخطأ. عند النجاح: حفظ النتيجة وتحديث حالة التحميل و(حيث ينطبق) مفتاح آخر جلب. عند الفشل: تعيين `loading = false` وحفظ الخطأ.

## الملفات المُحدَّثة

### Hooks (`app/dashboard/access-control/hooks/`)

- **useAccessControlEmployees.ts** — `fetchEmployees`: حارس طلب قيد التنفيذ عبر `fetchEmployeesInFlightRef`؛ منع الطلب المزدوج عند تشغيل الـ effect مرتين (مثلاً Strict Mode).
- **useAvailablePermissions.ts** — `fetch`: حارس تحميل + حارس كاش (`availablePermissions.length > 0`).
- **useAccessControlPermissionsForRole.ts** — `fetch`: حارس طلب قيد التنفيذ (`fetchInFlightRef`) + حارس كاش (`data`).
- **useRoleDetailsDialog.ts** — `fetchDetails(roleId)`: حارس تحميل + كاش/هوية لنفس الـ roleId + last-fetched؛ مسح `lastFetchedRoleIdRef` عند إغلاق الحوار.

### الصفحات

- **roles/page.tsx** — `fetchRolesForTab`: حارس طلب قيد التنفيذ (ref)؛ `fetchRoleDetails(roleId)`: حارس طلب قيد التنفيذ (ref) + كاش (`roleDetails?.id === roleId`)؛ `fetchAvailablePermissionsForRole`: حارس طلب قيد التنفيذ (ref) + كاش (`availablePermissionsForRole`).
- **create-employee/page.tsx** — جلب الصلاحيات: حارس طلب قيد التنفيذ (`fetchPermissionsInFlightRef`) + كاش (`permissions !== null`).
- **edit-employee/[id]/page.tsx** — جلب الموظف: حارس طلب قيد التنفيذ (`fetchEmployeeInFlightRef`)؛ جلب الصلاحيات: حارس تحميل + كاش.
- **view-employee/[id]/page.tsx** — جلب تفاصيل الموظف: حارس طلب قيد التنفيذ (`fetchDetailsInFlightRef`).

### المكونات

- **EmployeeActivityPage.tsx** — `fetchEmployeeInfo`: حارس طلب قيد التنفيذ + كاش (`employeeInfo?.id === employeeId`)؛ `fetchEmployeeLogs`: حارس طلب قيد التنفيذ فقط (لأن مفتاح الطلب يتغير مع الصفحة والفلاتر).

## الفوائد

- تجنب إرسال نفس الطلب مرتين (متزامن أو متتالي سريع).
- تقليل الحمل على الخادم وتحسين الاستجابة.
- تقليل تعارض البيانات عند التحديث المتزامن.
