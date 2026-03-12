# منع الطلبات المكررة — Rental Management

## الملخص

تم تطبيق نمط **PREVENT_DUPLICATE_API_PROMPT** على استدعاءات الـ API المستخدمة في `/dashboard/rental-management` والمكونات المرتبطة (عقود، متابعة يومية، ملاك، نوافذ التحصيل وتفاصيل الإيجار).

## المرجع

- `docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md`
- `docs/important/liveEditor/TENANT_STORE_AND_API.md`

## التغييرات

### 1. مخازن (Stores)

| Store | الدالة | الحراس المطبقة |
|-------|--------|-----------------|
| `context/store/rentalDashboard.js` | جلب لوحة الإيجارات (عبر `useDashboardData`) | `loading`، `lastFetchedDashboardKey` (مفتاح من فلاتر الفترة) |
| `context/store/contracts.js` | `fetchContractsData` | `loading`، `lastFetchedContractsKey` (مفتاح من معاملات الطلب) |
| `context/store/dailyFollowup.js` | `fetchDailyFollowupData` | `loading`، `lastFetchedDailyFollowupKey` |
| `context/store/rentalManagement.js` (rentalApplications) | جلب الطلبات (عبر `useRentalApplications`) | `loading`، `lastFetchedRentalsKey` (صفحة + فلاتر) |
| `context/store/rentalOwnerDashboardPage.js` | `fetchOwnerRentals` | `loading`، `lastFetchedOwnerRentalsKey` |
| نفس المخزن | `fetchOwnerDetails` | `loadingOwnerDetails`، `lastFetchedOwnerDetailsId` |
| نفس المخزن | `fetchAvailableProperties` | `loadingProperties`، `lastFetchedProperties` |
| نفس المخزن | `fetchAssignedProperties` | `loadingAssignedProperties`، `lastFetchedAssignedKey` (مالك + صفحة) |

### 2. مكونات مع fetch محلي

| المكون | الدالة | الحراس |
|--------|--------|--------|
| `components/rental-management/dashboard-stats/hooks/useDashboardData.ts` | `fetchDashboardData` | استخدام حالة الـ store: `loading`، `lastFetchedDashboardKey` |
| `components/rental-management/services/rental-applications-service/hooks/useRentalApplications.ts` | `fetchRentals` | `rentalApplications.loading`، `lastFetchedRentalsKey` |
| `components/rental-management/payment-collection-dialog.tsx` | `fetchPaymentCollectionData` | `loading`، `data && lastFetchedPaymentRentalId === selectedPaymentRentalId`؛ إعادة تعيين المفتاح عند إغلاق النافذة |
| `components/rental-management/rental-details-dialog.tsx` | `fetchRentalDetails` | `loading`، `details && lastFetchedRentalId === selectedRentalId`؛ إعادة تعيين المفتاح عند إغلاق النافذة |
| نفس الملف | `fetchExpensesData`، `fetchActualExpensesData` | حارس `loading` فقط لتفادي طلبين متزامنين |

### 3. نمط التطبيق

- **قبل أي fetch:** التحقق من وجود طلب قيد التنفيذ (`loading` / `loadingX`) ثم من تطابق مفتاح آخر جلب (`lastFetchedX === key`)؛ في حال التطابق يتم الإرجاع دون إرسال طلب جديد.
- **عند بدء الطلب:** تعيين `loading: true` ومسح `error`.
- **عند النجاح:** حفظ النتيجة وتحديث المفتاح (`lastFetchedX = key`) وتعيين `loading: false`.
- **عند الخطأ:** تعيين `loading: false` وحفظ الرسالة.

## الفوائد

- تجنب إرسال نفس الطلب مرتين (concurrent أو نقرات سريعة).
- تقليل الحمل على الخادم وتحسين الاستجابة.
- تقليل تعارض البيانات عند التحديث المتزامن.
