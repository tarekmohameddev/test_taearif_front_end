# تقسيم context/Store.js (مهمة 3.2)

## الوضع الحالي

- **Store.js** يجمع كل الوحدات في نقطة واحدة (`context/store/*.js`) ويُصدّر `useStore`.
- **استيراد منفرد:** عند حاجة مكوّن لوحدة واحدة فقط، يُفضّل استيراد store فرعي بدلاً من `useStore` لتقليل الـ compile.

## وحدات الـ store (context/store/)

- homepage (dashboardDevice, dashboardSummary, visitorData, setupProgress, trafficSources)
- contentManagement, recentActivity, projectsManagement, propertiesManagement
- incompletePropertiesManagement, blogManagement, affiliate, **sidebar**
- rentalManagement, purchaseManagement, matchingPage, marketingDashboard
- rentalOwnerDashboardPage, userAuth

## Stores فرعية مُتاحة

| Store | الاستيراد | الاستخدام |
|-------|-----------|-----------|
| Sidebar | `import useSidebarStore from "@/context/sidebarStore"` | `sidebarData`, `fetchSideMenus` (مثل DashboardHeader) |

## إضافة store فرعي جديد

1. إنشاء ملف مثل `context/sidebarStore.js`.
2. استيراد الوحدة المطلوبة فقط من `context/store/...`.
3. إنشاء store بـ `create` ودمج الوحدة: `const useXStore = create((set, get) => ({ ...slice(set, get) }));`
4. استبدال `useStore` في المكوّنات التي تحتاج هذه الوحدة فقط.

## الملاحظات

- الاحتفاظ بـ `useStore` للمكوّنات التي تحتاج أكثر من وحدة (توافق مع الكود الحالي).
- DashboardHeader يستخدم `useSidebarStore` فقط حتى لا يُترجم Store الكامل مع كل صفحة داشبورد.
