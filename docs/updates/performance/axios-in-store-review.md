# مراجعة استيراد axiosInstance في وحدات الـ store (مهمة 4.1)

## الوضع الحالي

- **axiosInstance** (من `@/lib/axiosInstance`) يُستورد في العديد من وحدات `context/store/` لأنه يُستخدم لاستدعاءات الـ API داخل الـ store.
- استيراد `axiosInstance` يسحب سلسلة Auth (إن وُجدت في axiosInstance) إلى كل وحدة store تُترجم مع الصفحة.

## وحدات store التي تستورد axiosInstance

- sidebar.js, contentManagement.js, projectsManagement.js, propertiesManagement.js
- incompletePropertiesManagement.js, blogManagement.js, affiliate.js
- rentalManagement.js, purchaseManagement.js, matchingPage.js, marketingDashboard.js
- rentalOwnerDashboardPage.js, crm.ts, contracts.js, dailyFollowup.js
- unified-customers.ts, roles&Permissions.js
- homepage: dashboardDevice, dashboardSummary, visitorData, setupProgress, trafficSources
- recentActivity.js

## التوصية

- **للمستقبل:** استخراج استدعاءات الـ API إلى ملفات خدمات (مثلاً `services/api/projects.ts`, `services/api/sidebar.ts`) تُستورد من الصفحات أو من وحدات store محددة فقط.
- الصفحة أو الـ store slice يستدعي الدالة من الخدمة (التي بداخلها تستخدم axiosInstance)، بحيث لا تُستورد axiosInstance في كل وحدة store.
- **الأولوية:** الوحدات التي تُحمّل مع كل صفحة داشبورد (مثل sidebar) تم تخفيفها باستخدام `useSidebarStore` المنفصل؛ باقي الوحدات تُحمّل مع الصفحات التي تستخدمها فقط.

## ملاحظة

- تنفيذ الاستخراج بالكامل يتطلب تغييراً في عدة ملفات؛ هذا المستند يوثق المراجعة والتوصية للعمل لاحقاً.
