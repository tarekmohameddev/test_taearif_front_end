# قياس وقت الـ compile وتحسينات الأداء

## كيفية القياس

- تشغيل السيرفر: `npm run dev` (يستخدم Turbopack).
- فتح المتصفح وطلب أحد المسارات أدناه (أول طلب للصفحة ي trigger الـ compile).
- وقت الـ compile يُلاحظ من وقت الاستجابة حتى اكتمال التحميل (أدوات المطور → Network، أو تسجيل في السيرفر إن وُجد).

### مسارات يُنصح بقياسها قبل وبعد كل مجموعة تغييرات

| المسار | الغرض |
|--------|--------|
| `/ar` | صفحة tenant عامة — لا يجب أن تسحب Auth ولا TenantPageWrapper ثقيل في الـ bundle الأولي. |
| `/ar/dashboard/buildings` | صفحة داشبورد ثقيلة — تحميل ديناميكي للمكون. |
| `/ar/dashboard/projects` | صفحة داشبورد ثقيلة — نفس النمط. |

**الإجراء:** تسجيل زمن الطلب الأول لكل مسار قبل التعديلات، ثم بعد تنفيذ مجموعة ClientLayout (1.x)، ثم بعد TenantPageWrapper (2.x)، ثم بعد الداشبورد (3.x)، والتحقق من عدم كسر الوظائف.

## التحسينات المُطبَّقة (تقلل من تحميل الداشبورد والـ compile)

- **ClientLayout (1.x):** تأجيل تحميل Auth للصفحات العامة؛ AuthGate خفيف ثم ClientLayoutAuth ديناميكي؛ planCookie فقط داخل المسارات المحمية.
- **Tenant (2.x):** تحميل TenantPageWrapper ديناميكياً في صفحة slug مع skeleton؛ إزالة استيراد ComponentsList (استخدام lib/componentPaths)؛ tenantStaticPagesStore بدلاً من editorStore؛ تحميل skeletons عبر TenantPageSkeleton ديناميكياً.
- **Dashboard (3.x):** DashboardHeader يستخدم useSidebarStore فقط (بدون Store الكامل)؛ تقسيم Store إلى وحدات قابلة للاستيراد منفرداً؛ تحميل صفحات المشاريع وإضافة مشروع ديناميكياً مع skeleton.
- تحميل structures بشكل كسول (whyChooseUs وغيره عبر `getComponentStructureAsync`).
- تحميل GTMProvider وPermissionWrapper ديناميكياً في layout الداشبورد.
- تحميل صفحات CRM وتقارير وعقارات ديناميكياً مع skeleton.
- تحسين onDemandEntries وضبط تعليق Turbopack في next.config.mjs.

## التحقق من عدم كسر الوظائف

- بعد كل مجموعة تغييرات: اختبار يدوي لصفحات الداشبورد، Live Editor، وصفحات الـ tenant.
- التأكد من تسجيل الدخول، عرض المباني، المشاريع، والتحرير في المحرر المباشر.
- التأكد من أن الصفحات العامة (/ar، /landing) تعمل بدون تسجيل دخول وأن المحمية تعيد التوجيه أو تعرض المحتوى حسب الجلسة.
