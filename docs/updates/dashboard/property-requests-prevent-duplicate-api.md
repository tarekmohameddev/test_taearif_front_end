# منع الطلبات المكررة لـ Property Requests Dashboard

## الملخص

تم تطبيق نمط **PREVENT_DUPLICATE_API_PROMPT** على جميع استدعاءات الـ API المستخدمة في `/dashboard/property-requests` (وصفحات التفاصيل والتعديل والمكونات المرتبطة).

## المرجع

- `docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md`
- `docs/important/liveEditor/TENANT_STORE_AND_API.md`

## التغييرات

### 1. طبقة API موحدة مع منع التكرار

- **ملف جديد:** `lib/api/property-requests-dashboard-api.ts`
  - حراس قبل الطلب: طلب قيد التنفيذ لنفس المفتاح → إرجاع نفس الـ Promise؛ وجود بيانات في الكاش لنفس المفتاح → إرجاعها.
  - دوال مغلفة: `withDedup` (للـ GET مع كاش) و`withMutationDedup` (للمتغيرات مع منع تنفيذ مكرر).
  - إبطال كاش بعد create/update/delete عبر `invalidatePropertyRequestsCache()`.

### 2. Endpoints المشمولة

| Method | Endpoint | الدالة في الخدمة |
|--------|----------|------------------|
| GET | `/v1/property-requests/filters` | `getPropertyRequestsFilters()` |
| GET | `/v1/property-requests?params` | `getPropertyRequestsList(params)` |
| GET | `/v1/property-requests/{id}` | `getPropertyRequestById(id)` |
| POST | `/v1/property-requests` | `createPropertyRequest(data)` |
| PUT | `/v1/property-requests/{id}` | `updatePropertyRequest(id, data)` |
| PUT | `/v1/property-requests/{id}/status` | `updatePropertyRequestStatus(id, body)` |
| PUT | `/v1/property-requests/customer/{id}/employee` | `assignPropertyRequestEmployee(customerId, body)` |
| DELETE | `/v1/property-requests/{id}` | `deletePropertyRequest(id)` |
| GET | `/v1/employees` | `getEmployees()` |
| GET | `/customers` | `getCustomers()` |
| GET | `/v1/crm/requests?customer_id=` | `getCrmRequestsByCustomer(customerId)` |
| GET | `/crm/stages` | `getCrmStages()` |
| PUT | `/customers/{id}` | `updateCustomerStage(customerId, body)` |

### 3. الملفات التي تم تحديثها لاستخدام الخدمة

- `components/property-requests/property-requests-page.tsx` — القائمة، الفلاتر، إنشاء، تحديث، حذف
- `app/dashboard/property-requests/[id]/page.tsx` — جلب التفاصيل
- `app/dashboard/property-requests/[id]/edit/page.tsx` — جلب التفاصيل، تحديث الطلب (استدعاء `/properties` بقي عبر `axiosInstance`)
- `components/property-requests/page-components/PropertyRequestForm.tsx` — الفلاتر
- `components/property-requests/page-components/PropertyRequestStatusChangeDialog.tsx` — الفلاتر، تحديث الحالة
- `components/property-requests/page-components/PropertyRequestEmployeeAssignmentDialog.tsx` — الموظفون، تعيين الموظف
- `components/property-requests/page-components/PropertyRequestsTable.tsx` — العملاء، طلبات الـ CRM
- `components/property-requests/page-components/PropertyRequestStageAssignmentDialog.tsx` — مراحل الـ CRM، تحديث مرحلة العميل

## الفوائد

- تجنب إرسال نفس الطلب مرتين (concurrent أو متتالي سريع).
- تقليل الحمل على الخادم وتحسين الاستجابة.
- تقليل تعارض البيانات عند التحديث المتزامن.
