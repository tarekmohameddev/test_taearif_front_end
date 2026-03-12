# توحيد استدعاء GET /user (استدعاء واحد + كاش)

## الملخص

تم توحيد جلب بيانات المستخدم بحيث يتم تنفيذ **طلب واحد** لـ GET /user في كل رحلة تحميل (داشبورد أو بعد تسجيل الدخول)، مع مزامنة النتيجة إلى AuthStore و userStore.

## التغييرات

- **نقطة الدخول الموحدة:** [`lib/auth/fetchUserOnceAndSync.ts`](../../../lib/auth/fetchUserOnceAndSync.ts) — إلغاء تكرار الطلبات المتزامنة (in-flight deduplication).
- **AuthStore (authActions):** `fetchUserFromAPI` يستدعي `fetchUserOnceAndSync()` ثم يحدّث AuthStore و userStore من نفس الاستجابة. `fetchUserData` يكتفي بجلب التوكن (getUserInfo) ثم يستدعي `fetchUserFromAPI`.
- **useTokenValidation:** يستدعي `fetchUserFromAPI()` بعد تعيين التوكن في الـ store (بدلاً من الطلب المباشر لـ /user أو تخطيه بخطة الكوكي).
- **Dashboard layout:** إزالة الـ useEffect الذي كان يستدعي `fetchUserFromAPI()` بعد التحقق من التوكن؛ الاعتماد على البيانات التي يملأها useTokenValidation.
- **userStore.fetchUserData:** عند انتهاء صلاحية الكاش يستدعي `fetchUserFromAPI()` عبر استيراد ديناميكي لـ AuthContext (لتجنب تبعية دائرية)، فلا يُنفَّذ طلب /user إضافي.
- **OAuthSuccessPageContent:** إزالة الطلب المباشر لـ GET /user والتعيين اليدوي لـ AuthStore؛ الاعتماد على `fetchUserFromAPI()` ثم استدعاء setAuth ببيانات المستخدم من الـ store.

## Bootstrap الداشبورد والـ Sidebar الموازي

- **Bootstrap الداشبورد:** التحقق من التوكن يملأ AuthStore و userStore مرة واحدة (عبر useTokenValidation → fetchUserFromAPI → fetchUserOnceAndSync + setUserData على كلا الـ store).
- **جلب القوائم الجانبية بالتوازي:** الـ Layout يستدعي `fetchSideMenus()` فور تحقق التوكن (`tokenValidation.isValid === true && !tokenValidation.loading`) بحيث يبدأ طلب `/settings/side-menus` بالتوازي مع عرض PermissionWrapper، ولا ينتظر mount الـ Header. الـ sidebar store يمنع الطلبات المكررة عبر `isSidebarFetched`.
- **إنهاء حالة تحميل الصلاحيات:** useTokenValidation يستدعي `setIsLoading(false)` بعد نجاح التحقق حتى ينتقل usePermissions من حالة التحميل ولا تبقى شاشة «جاري التحقق من الصلاحيات» معلقة.

## المراجع

- الخطة: توحيد استدعاء /user (استدعاء واحد + كاش).
- [`docs/important/dashboard/AUTHENTICATION.md`](../../important/dashboard/AUTHENTICATION.md) — طبقات الحماية والتحقق من الجلسة.
