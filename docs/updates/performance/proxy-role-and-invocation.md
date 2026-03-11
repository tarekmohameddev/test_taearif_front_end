# proxy.ts – الدور واستدعاؤه

## الدور

ملف `proxy.ts` في جذر المشروع يصدّر **دالة middleware** لـ Next.js تقوم بـ:

1. **تخطي الطلبات غير المهمة:** مسارات `/api/`, `/_next/`, الملفات الثابتة، وأيقونة المفضلة تُعاد فوراً بـ `NextResponse.next()` دون معالجة إضافية.
2. **تحديد الدومين:** التحقق من أن الطلب على الدومين الأساسي (taearif.com، mandhoor.com، localhost) أو على subdomain (مثل tenant1.taearif.com) أو custom domain.
3. **استخراج tenantId:** من الـ subdomain أو من الـ custom domain (بدون استدعاء API).
4. **معالجة اللغة (locale):** استخراج الـ locale من المسار، وإعادة التوجيه إلى الـ locale الافتراضي (مثلاً `/ar`) إذا لم يكن المسار يبدأ بـ locale.
5. **إعادة الكتابة (rewrite):** تحويل المسار إلى pathname بدون locale وضبط الهيدرات (`x-locale`, `x-tenant-id`, `x-domain-type`, إلخ).
6. **تحقق مالك النظام (owner):** على مسارات `/owner/` (ما عدا login/register) والتحقق من وجود `owner_token` في الـ cookies.

## كيفية الاستدعاء

- الدالة المُصدَّرة اسمها `proxy` والـ config يحتوي على `matcher` بنمط middleware في Next.js.
- في المشروع الحالي **لا يوجد استيراد لـ `proxy`** من أي ملف آخر؛ أي أن الملف جاهز لاستخدامه كـ middleware لكنه غير مُربوط بملف `middleware.ts` في الجذر.
- لتفعيله كـ middleware فعلي:
  - إنشاء أو تعديل `middleware.ts` (أو `middleware.js`) في جذر المشروع.
  - استيراد واستدعاء `proxy` كـ handler الـ default، مثلاً:
    ```ts
    import { proxy } from "./proxy";
    export { config } from "./proxy";
    export default proxy;
    ```
- الـ **matcher** الحالي: `["/((?!api|_next/static|_next/image|favicon.ico).*)"]` — أي يشمل كل المسارات ما عدا api والثوابت والصور وأيقونة المفضلة.

## المسار الساخن (الأكثر تكلفة)

- **قراءة الـ host والـ pathname:** `request.nextUrl.pathname` و `request.headers.get("host")`.
- **تقسيم المسار واستخراج الـ locale:** استدعاء `pathname.split("/")` و `extractLocaleAndPathname(pathname)`.
- **استخراج الـ tenant:** `getTenantIdFromHost(host)` ثم عند الحاجة `getTenantIdFromCustomDomain(host)` — كلاهما يعتمدان على سلاسل ومجموعات ثابتة (مثل `RESERVED_WORDS` كـ Set) وبدون استدعاءات شبكية.
- **إنشاء الاستجابة:** `request.nextUrl.clone()`، `NextResponse.rewrite(url)`، وضبط عدة هيدرات.

لا يوجد في الكود الحالي استدعاءات API أو I/O ثقيل داخل المسار الساخن؛ التكلفة الأساسية من تحليل السلاسل والشرطيات.

## تحسينات مُطبَّقة

- تخزين قيم البيئة في ثوابت عند التحميل (مثل `PRODUCTION_DOMAIN`, `BASE_DOMAINS`).
- استخدام `Set` للكلمات المحجوزة للبحث O(1).
- دالة واحدة لاستخراج الـ locale والـ pathname بدون locale (`extractLocaleAndPathname`) لتقليل التكرار.
- خروج مبكر لمسارات الـ API والثوابت قبل أي معالجة أخرى.
