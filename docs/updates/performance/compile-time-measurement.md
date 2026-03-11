# قياس وقت الـ compile وتحسينات الأداء

## كيفية القياس

- تشغيل السيرفر: `npm run dev` (يستخدم Turbopack).
- فتح المتصفح وطلب: `GET /ar/dashboard/buildings` (أو نفس المسار مع locale).
- وقت الـ compile يُلاحظ عند أول طلب للصفحة (وقت الاستجابة حتى اكتمال التحميل).
- يمكن استخدام أدوات المطور (Network) أو تسجيل الوقت في السيرفر إن وُجد.

## التحسينات المُطبَّقة (تقلل من تحميل الداشبورد والـ compile)

- تقسيم AuthContext وخدمة API منفصلة.
- تحميل structures بشكل كسول (whyChooseUs وغيره عبر `getComponentStructureAsync`).
- عدم تحميل COMPONENTS الكامل في editorStore (استخدام COMPONENT_IDS_BY_SECTION وـ structures: {}).
- تحميل GTMProvider وPermissionWrapper ديناميكياً في layout الداشبورد.
- تحميل صفحات CRM وتقارير وعقارات ديناميكياً مع skeleton.
- تحسين onDemandEntries وضبط تعليق Turbopack في next.config.mjs.

## التحقق من عدم كسر الوظائف

- بعد كل مجموعة تغييرات: اختبار يدوي لصفحات الداشبورد، Live Editor، وصفحات الـ tenant.
- التأكد من تسجيل الدخول، عرض المباني، والتحرير في المحرر المباشر.
