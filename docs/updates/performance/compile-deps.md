# سلسلة التبعيات للـ compile

## ملخص

هذا المستند يوضح أي ملفات تُترجم مع كل نوع مسار بعد تطبيق خطة تحسين الـ compile، وكيف تقلل التبعيات الثقيلة.

---

## 1. كل الطلبات (Root layout)

- **الملفات:** `app/layout.tsx` → `ClientLayout` → (حسب المسار إما `children` فقط أو `AuthGate`).
- **صفحات عامة** (مثل `/`, `/ar`, `/landing`, `/properties`): لا تُحمّل AuthContext ولا axiosInstance ولا ClientLayoutAuth؛ تُعرض `children` فقط.
- **صفحات تحتاج مصادقة** (`/dashboard`, `/login`, `/live-editor`, …): تُحمّل `AuthGate` ثم عند الحاجة `ClientLayoutAuth` (AuthContext, axiosInstance, planCookie).

**تقليل التبعيات:** عدم استيراد Auth و axios ثابتاً في ClientLayout؛ التحميل الديناميكي للمسارات المحمية فقط.

---

## 2. طلب موقع العميل (مثل /ar، tenant)

- **الملفات:** `app/[...slug]/page.tsx` → تحميل ديناميكي لـ `TenantPageWrapper` مع skeleton.
- **ما لا يُترجم مع مسارات أخرى:** `TenantPageWrapper`، slice عرض خفيف `tenantViewStore`، و`tenantStaticPagesStore` — لا تُستدعى عند طلب الداشبورد أو صفحات الشركة الرئيسية.
- **داخل TenantPageWrapper:** استخدام `tenantViewStore` (حالة التينانت + `fetchTenantData` فقط) بدلاً من `tenantStore` الكامل، استخدام `lib/componentPaths` (خفيف) بدلاً من ComponentsList، و`tenantStaticPagesStore` بدلاً من editorStore، وتحمليل skeletons عبر `TenantPageSkeleton` ديناميكياً.
- **داخل tenantStore:** استيراد وحدات debug الخاصة بالـ live-editor (eventTracker / eventFormatter / extractContext) يتم الآن عبر `import()` ديناميكي داخل `if (isDebugEnabled())` في `fetchFunctions.js`, `storeActions.js`, وملفات hero؛ بحيث لا تدخل شجرة الـ debug في bundle الأساسي لمسارات `/ar` إلا عند تفعيل الـ debug في بيئة التطوير، كما أن استيراد `editorStore` نفسه في `fetchTenantData` أصبح مقصورًا على مسارات live-editor فقط.

**تقليل التبعيات:** تحميل TenantPageWrapper ديناميكياً، إزالة استيراد ComponentsList، استخدام tenantStaticPagesStore وcomponentPaths.

---

## 3. طلب الداشبورد (/dashboard)

- **الملفات:** `app/dashboard/layout.tsx` → الـ Header يستورد `useSidebarStore` من `context/sidebarStore` فقط (وليس `context/Store.js`).
- **ما لا يُترجم مع الـ Header:** باقي وحدات Store (homepage, projects, properties, …) لا تُسحب مع الـ Header.
- **صفحات ثقيلة:** صفحات مثل المشاريع وإضافة مشروع تُحمّل مكوناتها عبر `next/dynamic` مع skeleton (نفس نمط buildings).

**تقليل التبعيات:** استخدام useSidebarStore في الـ Header، تحميل صفحات الداشبورد الثقيلة ديناميكياً.

---

## 4. مراجع إضافية

- **Store مقسّم:** `docs/updates/performance/store-split.md`
- **Tenant static pages:** `docs/updates/performance/tenant-static-pages-store.md`
- **قياس وقت الـ compile:** `docs/updates/performance/compile-time-measurement.md`
- **مراجعة axios في الـ store:** `docs/updates/performance/axios-in-store-review.md`
