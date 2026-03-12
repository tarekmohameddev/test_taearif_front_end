# روابط اختبار التعديلات (Auth + Tenant + Store split)

استخدم هذا الملف للتحقق من أن كل التعديلات تعمل بعد تطبيق الـ diff (ClientLayout، AuthGate، TenantPageWrapper، تقسيم الـ Store، إلخ).

**افتراض:** التطبيق يعمل على `http://localhost:3000` (أو استبدل بالدومين الذي تستخدمه). مسارات التينانت قد تكون مع لاحقة لغة مثل `ar` → استخدم `/ar` أو `/en` حسب إعدادك.

---

## 1. صفحات عامة (بدون مصادقة)

يجب أن **لا** تُحمّل AuthContext ولا ClientLayoutAuth؛ تُعرض المحتوى مباشرة.

| الرابط | ماذا تختبر |
|--------|------------|
| `http://localhost:3000/` | الصفحة الرئيسية بدون Auth |
| `http://localhost:3000/ar` | صفحة التينانت الرئيسية (TenantPageWrapper + tenantViewStore) |
| `http://localhost:3000/ar/` | نفس الأعلى |
| `http://localhost:3000/landing` | لاندينج — بدون Auth |
| `http://localhost:3000/ar/for-rent` | صفحة للإيجار (skeleton ثم محتوى) |
| `http://localhost:3000/ar/for-sale` | صفحة للبيع |
| `http://localhost:3000/ar/about-us` | من نحن |
| `http://localhost:3000/ar/contact-us` | تواصل معنا |
| `http://localhost:3000/ar/property-requests/create` | إنشاء طلب عقاري |

**التحقق:** لا يحدث redirect لـ `/login`، والصفحة تُحمّل بدون سحب bundle المصادقة الكامل.

---

## 2. صفحات المصادقة (بدون جلسة مطلوبة)

تحمّل AuthGate ثم ClientLayoutAuth؛ يُسمح بالدخول بدون تسجيل دخول (عرض نموذج تسجيل/دخول).

| الرابط | ماذا تختبر |
|--------|------------|
| `http://localhost:3000/login` | صفحة تسجيل الدخول |
| `http://localhost:3000/ar/login` | نفس الصفحة مع locale |
| `http://localhost:3000/register` | التسجيل |
| `http://localhost:3000/forgot-password` | نسيت كلمة المرور |
| `http://localhost:3000/reset` | إعادة تعيين كلمة المرور |
| `http://localhost:3000/oauth` | OAuth (إن وُجد) |

**التحقق:** الصفحة تفتح وتعرض النموذج. إذا كانت هناك جلسة محفوظة (cookie/localStorage) يتم التوجيه إلى `/dashboard`.

---

## 3. صفحات محمية (تتطلب جلسة)

بدون جلسة → redirect إلى `/login`. مع جلسة → تحميل ClientLayoutAuth (AuthContext، onboarding، popup، إلخ).

| الرابط | ماذا تختبر |
|--------|------------|
| `http://localhost:3000/dashboard` | الداشبورد الرئيسي (useSidebarStore في الـ Header) |
| `http://localhost:3000/ar/dashboard` | نفس الأعلى مع locale |
| `http://localhost:3000/dashboard/projects` | إدارة المشاريع (تحميل ديناميكي + useProjectsStore) |
| `http://localhost:3000/dashboard/projects/add` | إضافة مشروع (تحميل ديناميكي) |
| `http://localhost:3000/live-editor` | المحرر المباشر (جلب بيانات /user + editorStore للـ live-editor فقط) |
| `http://localhost:3000/onboarding` | الـ onboarding (مع جلسة وغير مكتمل → يبقى هنا؛ مكتمل → redirect لـ dashboard) |

**التحقق:** بدون تسجيل دخول يتم التوجيه لـ `/login`. بعد تسجيل الدخول تفتح الصفحة، وعرض الـ popup يعمل في الصفحات المسموح بها.

---

## 4. صفحات داشبورد (مكونات مرتبطة بالـ Store الجديد)

تأكد أن كل صفحة تعمل بعد استبدال `useStore` بالـ stores الفرعية.

| الرابط | الـ Store المستخدم |
|--------|-------------------|
| `http://localhost:3000/dashboard` | useSidebarStore (الهيدر) |
| `http://localhost:3000/dashboard/projects` | useProjectsStore |
| `http://localhost:3000/dashboard/projects/add` | useProjectsStore |
| `http://localhost:3000/dashboard/properties` | usePropertiesStore |
| `http://localhost:3000/dashboard/properties/incomplete` | usePropertiesStore |
| `http://localhost:3000/dashboard/crm` | useMarketingStore (في بطاقة العميل وواتساب) |
| `http://localhost:3000/dashboard/customers` | useMarketingStore (CustomerTable، واتساب) |
| `http://localhost:3000/dashboard/marketing` | useMarketingStore (إدارة أرقام واتساب، إلخ) |
| `http://localhost:3000/dashboard/rental-management` | useMarketingStore (rental واتساب، طلبات الإيجار) |

**التحقق:** لا أخطاء في الكونسول، جلب البيانات وعرض القوائم/النماذج يعمل، وحوارات واتساب تفتح وتعمل.

---

## 5. صفحات التينانت (متعددة المستويات)

تعتمد على tenantViewStore و tenantStaticPagesStore و StaticHeader1Viewer / StaticFooter1Viewer.

| الرابط | ماذا تختبر |
|--------|------------|
| `http://localhost:3000/ar/project/اسم-المشروع` | صفحة مشروع (multi-level) |
| `http://localhost:3000/ar/property/اسم-العقار` | صفحة عقار |
| `http://localhost:3000/ar/blog/اسم-المدونة` | صفحة مدونة |

**التحقق:** الهيدر والفوتر يعرضان (StaticHeader1Viewer / StaticFooter1Viewer)، والمحتوى يُجلب من staticPagesData أو tenantData بدون استخدام editorStore في مسار الزائر.

---

## 6. تسجيل الدخول والجلسة

| الإجراء | الرابط / الخطوة | ماذا تختبر |
|---------|------------------|------------|
| دخول بدون جلسة إلى مسار محمي | `http://localhost:3000/dashboard` | redirect إلى `/login` |
| دخول بجلسة إلى `/login` | افتح `/login` وأنت مسجل دخول | redirect إلى `/dashboard` (باستخدام hasSessionSync) |
| دخول مع token في الرابط | `/login?token=xxx` | معالجة تسجيل الدخول عبر token دون redirect فوري للـ dashboard |

**التحقق:** سلوك AuthGate و ClientLayoutAuth و login-page متوافق مع hasSessionSync (cookie authToken أو localStorage user).

---

## 7. تتبع وتحليلات (اختياري)

- **GA4:** لا يعتمد على tenantStore في المسارات العامة (تمت إزالة استخدام username من الـ API للـ custom domain من GA4Provider).
- **GTM:** تسجيل الأحداث (نقرة، تمرير، إرسال نموذج) يعمل؛ الـ console.log للـ GTM يظهر فقط في development.
- **PixelScripts:** تحميل الـ pixels وتهيئة dataLayer يعمل؛ GTM الرئيسي يُحمّل من GTMProvider وليس من PixelScripts.

---

## ملخص سريع

1. **عامة:** `/`, `/ar`, `/ar/for-rent`, `/ar/contact-us` → بدون Auth.
2. **مصادقة:** `/login`, `/register`, `/forgot-password` → مع جلسة → redirect لـ dashboard.
3. **محمية:** `/dashboard`, `/dashboard/projects`, `/dashboard/projects/add`, `/live-editor`, `/onboarding`.
4. **داشبورد + Store:** المشاريع، العقارات، CRM، العملاء، التسويق، إدارة الإيجار.
5. **تينانت:** `/ar`, `/ar/for-sale`, `/ar/about-us`, `/ar/project/...`, `/ar/property/...`.

إذا كان التينانت يعمل على subdomain (مثل `tenant.localhost:3000`) استبدل `/ar` بذلك الـ host وضبط المسارات حسب الـ routing الفعلي.
