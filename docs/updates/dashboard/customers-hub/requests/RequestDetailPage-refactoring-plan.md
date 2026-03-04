# خطة Refactoring لـ RequestDetailPage.tsx وفق Clean Code

**الملف:** `components/customers-hub/requests/RequestDetailPage.tsx`  
**الحجم الحالي:** ~2025 سطر  
**التاريخ:** 2026-03-04

---

## 1. تحليل الوضع الحالي مقابل Clean Code

### 1.1 انتهاكات مبادئ Clean Code

| المبدأ | الوضع الحالي | المشكلة |
|--------|-------------|---------|
| **Single Responsibility (SRP)** | المكون يقوم بكل شيء: جلب بيانات، حالة، منطق أعمال، واجهة، نماذج، حوارات | صعوبة الصيانة والاختبار |
| **حجم الملف/الدالة** | ملف ~2025 سطر، دالة واحدة ضخمة للـ return | تجاوز التوصيات (ملف 200–400 سطر، دوال قصيرة) |
| **عدد المتغيرات/الحالة** | أكثر من 25 `useState` في مكون واحد | صعوبة تتبع التدفق وزيادة التعقيد |
| **تكرار (DRY)** | منطق اسم الموظف مكرر، تنسيق تاريخ/وقت مكرر، config للأنواع مكرر | ثغرات وتعارض عند التعديل |
| **تسمية ومعنى** | `(action as any).property_request_id`، `stats?: any` | استخدام `any` يضعف TypeScript |
| **تعقيد الشرطيات** | JSX عميق مع شروط متداخلة وكود مخفي بـ `false &&` | صعوبة القراءة والمراجعة |
| **قابلية الاختبار** | لا توجد دوال نقية أو مكونات فرعية معزولة | صعوبة كتابة unit tests |

### 1.2 نقاط إيجابية يمكن البناء عليها

- وجود `constants.ts` في نفس المجلد (يمكن توحيد الثوابت فيه).
- واجهة `RequestDetailPageProps` محددة (تحتاج فقط إزالة `any` من `stats`).
- استخدام خدمات API منفصلة (`customers-hub-requests-api`, `customers-hub-assignment-api`).

---

## 2. أهداف الـ Refactoring

1. **تقسيم المسؤوليات:** مكون رئيسي خفيف + مكونات فرعية + hooks + ثوابت/أنواع.
2. **تقليل حجم الملف:** أن لا يتجاوز الملف الرئيسي ~300–400 سطر.
3. **إزالة التكرار:** ثوابت موحدة، دوال مساعدة، مكونات قابلة لإعادة الاستخدام.
4. **تحسين الأنواع:** استبدال `any` بأنواع واضحة وواجهات محددة.
5. **تسهيل الاختبار:** دوال نقية ووحدات صغيرة قابلة للاختبار.
6. **معالجة الكود الميت:** إما إزالة الأقسام المخفية بـ `false &&` أو وضعها خلف feature flag واضح.

---

## 3. خطة التنفيذ على مراحل

### المرحلة 0: تحضير (بدون تغيير سلوك)

- **0.1** توثيق السلوك الحالي: قائمة مختصرة بالـ flows (تحميل، إتمام، تأجيل، جدولة، تعيين، تغيير حالة).
- **0.2** إضافة أو التأكد من وجود أنواع في `types/unified-customer.ts` أو ملف أنواع الطلبات: `CustomerAction`، `Note`، `Appointment`، وخصائص إضافية مثل `property_request_id` بدون `as any`.
- **0.3** مراجعة `docs/updates/` ذات الصلة (مثل `RequestDetailPage.txt`) لعدم كسر أي سلوك موثق.

---

### المرحلة 1: ثوابت وأنواع ودوال مساعدة

**الهدف:** نقل كل ما يمكن إلى ملفات خارج المكون دون تغيير الـ UI.

| المهمة | الوصف | الملف (مقترح) |
|--------|--------|----------------|
| 1.1 | توحيد الثوابت: دمج `priorityConfig`, `statusConfig`, `actionTypeLabels`, `APPOINTMENT_TYPES` مع `components/customers-hub/requests/constants.ts` (أو إنشاء `request-detail-constants.ts` إن لزم). إزالة التعريفات المكررة من RequestDetailPage. | `constants.ts` أو `request-detail-constants.ts` |
| 1.2 | تعريف أنواع واضحة: واجهة لـ `Stats` بدل `stats?: any`، وواجهة/نوع لخصائص طلب العقار (مثل `property_request_id`) لتجنب `(action as any)`. | `types.ts` أو `request-detail-types.ts` |
| 1.3 | دوال تنسيق: إنشاء دوال مثل `formatDateAr(date)`, `formatTimeAr(date)`, `formatDateTimeAr(date)` واستخدامها في كل مكان بدل تكرار `toLocaleDateString` / `toLocaleTimeString`. | `lib/format-date.ts` أو داخل `requests/utils.ts` |
| 1.4 | دوال اشتقاق بيانات: نقل حساب `propertyInfo`, `customerPreferences`, `aiMatching`, `matchedProperties` إلى دوال نقية (أو selectors) في ملف منفصل. | مثلاً `requests/request-detail-data.ts` |

**النتيجة:** نفس السلوك، مع تقليل التعقيد داخل المكون وإمكانية اختبار الدوال والثوابت بسهولة.

---

### المرحلة 2: Custom Hooks (تجميع الحالة والمنطق)

**الهدف:** تقليل عدد `useState` و`useEffect` داخل المكون وتجميع المنطق في hooks قابلة للاختبار.

| المهمة | الوصف | الملف (مقترح) |
|--------|--------|----------------|
| 2.1 | **useRequestDetailActions:** تجميع معالجات الإجراءات (إتمام، رفض، تأجيل، إضافة ملاحظة، جدولة موعد، إضافة تذكير، تعيين موظف) مع الحالة المرتبطة بها إن وجدت. يمكن أن يستقبل `action`, `onRefetch`, دوال الـ store والـ API ويعيد الـ handlers فقط. | `requests/hooks/useRequestDetailActions.ts` |
| 2.2 | **useSnoozeForm:** حالة وشكل التأجيل (showSnoozeForm, snoozeDate, snoozeTime) + `handleSnooze` وreset. | `requests/hooks/useSnoozeForm.ts` |
| 2.3 | **useNoteForm:** showNoteForm, newNote + handleAddNote وreset. | `requests/hooks/useNoteForm.ts` |
| 2.4 | **useScheduleForm:** حالة نموذج الموعد (aptType, aptDate, aptTime, aptNotes) + التحقق + handleScheduleAppointment وreset. | `requests/hooks/useScheduleForm.ts` |
| 2.5 | **useReminderForm:** كل حالة نموذج التذكير + التحقق + handleAddReminder وreset (يمكن الاحتفاظ به مخفياً حتى إعادة تفعيل الميزة). | `requests/hooks/useReminderForm.ts` |
| 2.6 | **useAssignEmployeeDialog:** (showAssignEmployeeDialog, employees, selectedEmployeeId, loadingEmployees, savingEmployee) + fetch employees عند الفتح + handleAssignEmployee. | `requests/hooks/useAssignEmployeeDialog.ts` |
| 2.7 | **useStatusDialog:** (showStatusDialog, statusOptions, selectedStatusId, loadingStatuses, savingStatus) + جلب الحالات عند الفتح + حفظ الحالة. | `requests/hooks/useStatusDialog.ts` |

**النتيجة:** المكون الرئيسي يقرأ الحالة والـ handlers من الـ hooks بدل عشرات الـ useState و useEffects، مع إمكانية اختبار كل hook على حدة.

---

### المرحلة 3: استخراج المكونات الفرعية (UI)

**الهدف:** تقسيم الـ JSX إلى مكونات ذات مسؤولية واحدة وتحسين القراءة.

| المهمة | الوصف | الملف (مقترح) |
|--------|--------|----------------|
| 3.1 | **RequestDetailLoading / RequestDetailError / RequestDetailNotFound** | مكونات للتحميل والخطأ و"الطلب غير موجود" بدل الـ return المبكرة الحالية. | `requests/detail/RequestDetailStates.tsx` |
| 3.2 | **RequestDetailHeader** | الهيدر: زر العودة، العنوان، الشارات (حالة، أولوية، تاريخ، due date، مصدر). | `requests/detail/RequestDetailHeader.tsx` |
| 3.3 | **RequestInfoCard** | كارد "معلومات الطلب": العنوان، الوصف، نوع الطلب، معين إلى. | `requests/detail/RequestInfoCard.tsx` |
| 3.4 | **PropertyOrPreferencesCard** | كارد "معلومات العقار" أو "تفضيلات العميل" (حسب وجود propertyInfo أو customerPreferences). | `requests/detail/PropertyOrPreferencesCard.tsx` |
| 3.5 | **AIMatchingCard** | قسم "مطابقة الذكاء الاصطناعي" وقائمة العقارات المطابقة. | `requests/detail/AIMatchingCard.tsx` |
| 3.6 | **AppointmentsCard** | قائمة الإجراءات/المواعيد مع عنصر واحد لموعد (AppointmentItem) واستخراج دوال الأيقونة/الشارة إلى دوال أو مكونات صغيرة. | `requests/detail/AppointmentsCard.tsx` |
| 3.7 | **RemindersCard** (اختياري) | قائمة التذكيرات — يمكن استعادتها لاحقاً عند إزالة `false &&`. | `requests/detail/RemindersCard.tsx` |
| 3.8 | **NotesCard** (اختياري) | كارد الملاحظات ونموذج الإضافة — نفس الملاحظة. | `requests/detail/NotesCard.tsx` |
| 3.9 | **CustomerSummaryCard** | كارد "معلومات العميل" في الشريط الجانبي مع الرابط لصفحة العميل. | `requests/detail/CustomerSummaryCard.tsx` |
| 3.10 | **RequestActionsCard** | كارد "إجراءات" القابل للطي + أزرار الإجراءات + نماذج التأجيل والجدولة (أو تمرير النماذج كـ children). | `requests/detail/RequestActionsCard.tsx` |
| 3.11 | **AssignEmployeeDialog** | حوار تعيين الموظف بالكامل (قائمة الموظفين، اختيار، حفظ). | `requests/detail/AssignEmployeeDialog.tsx` |
| 3.12 | **PropertyRequestStatusDialog** | حوار تغيير حالة طلب العقار. | `requests/detail/PropertyRequestStatusDialog.tsx` |
| 3.13 | **CompletedDismissedMessage** | رسالة "تم إتمام الطلب" / "تم رفض الطلب" مع التاريخ. | `requests/detail/CompletedDismissedMessage.tsx` |

**النتيجة:** المكون الرئيسي يصبح تجميعاً قصيراً لـ layout ومكونات فرعية، مع إمكانية اختبار كل كارد أو حوار بشكل منفصل.

---

### المرحلة 4: تنظيم المكون الرئيسي والكود الميت

| المهمة | الوصف |
|--------|--------|
| 4.1 | إعادة كتابة `RequestDetailPage` ليكون: (1) استدعاء الـ hooks، (2) استدعاء دوال الاشتقاق (أو استخدام النتائج من hooks)، (3) عرض RequestDetailStates عند التحميل/الخطأ/عدم الوجود، (4) عرض الهيدر ثم grid بالمكونات الفرعية. |
| 4.2 | إزالة أو توحيد الكود المخفي: إما إزالة أقسام التذكيرات والملاحظات المغلقة بـ `false &&`، أو نقلها خلف متغير/ثابت feature flag (مثلاً `SHOW_REMINDERS = false`) وتوثيق ذلك في التعليقات أو في `docs/updates`. |
| 4.3 | استبدال أي منطق معقد داخل JSX (مثل IIFE لاسم الموظف) بدالة مساعدة named (مثلاً `getEmployeeDisplayLabel(employee)`) في نفس الملف أو في utils. |

---

### المرحلة 5: تحسينات نهائية (اختيارية)

| المهمة | الوصف |
|--------|--------|
| 5.1 | استخدام `useMemo` للقيم المشتقة الثقيلة (إن ظهرت ضرورة أداء) بعد أن تصبح دوال اشتقاق واضحة. |
| 5.2 | تقسيم ملفات المكونات الكبيرة (مثل AppointmentsCard إذا زاد حجمها) إلى مكونات أصغر (مثلاً AppointmentItem). |
| 5.3 | إضافة unit tests للدوال النقية ولـ hooks المعزولة. |
| 5.4 | مراجعة الـ a11y (الوصولية) وتهيئة الـ ARIA إن لزم في الحوارات والقوائم. |

---

## 4. هيكل الملفات المقترح بعد الـ Refactoring

```
components/customers-hub/requests/
├── RequestDetailPage.tsx          # المكون الرئيسي (~250–400 سطر)
├── constants.ts                   # ثوابت موحدة (موجود + إضافات)
├── request-detail-types.ts       # أنواع خاصة بصفحة التفاصيل (اختياري)
├── request-detail-data.ts        # دوال اشتقاق propertyInfo, preferences, aiMatching, matched
├── utils.ts                      # formatDateAr, getEmployeeDisplayLabel, إلخ (أو تحت lib/)
├── hooks/
│   ├── useRequestDetailActions.ts
│   ├── useSnoozeForm.ts
│   ├── useNoteForm.ts
│   ├── useScheduleForm.ts
│   ├── useReminderForm.ts
│   ├── useAssignEmployeeDialog.ts
│   └── useStatusDialog.ts
└── detail/
    ├── RequestDetailStates.tsx
    ├── RequestDetailHeader.tsx
    ├── RequestInfoCard.tsx
    ├── PropertyOrPreferencesCard.tsx
    ├── AIMatchingCard.tsx
    ├── AppointmentsCard.tsx
    ├── RemindersCard.tsx
    ├── NotesCard.tsx
    ├── CustomerSummaryCard.tsx
    ├── RequestActionsCard.tsx
    ├── AssignEmployeeDialog.tsx
    ├── PropertyRequestStatusDialog.tsx
    └── CompletedDismissedMessage.tsx
```

---

## 5. قواعد يجب الالتزام بها أثناء التنفيذ

- **المرجعية:** اتباع `docs/live-editor/` و `docs/important/liveEditor/` لأي جزء يمس Live Editor أو Tenant؛ وتحديث `docs/updates/` عند تغيير سلوك أو واجهة.
- **الأبعاد:** أي حقل يمثل padding, height, width, margin, maxWidth, maxHeight يجب أن يكون `type: "number"` مع `unit`، واستخدام `toDimension()` من `lib/utils.ts` عند التطبيق (حسب AGENTS.md).
- **عدم كسر السلوك:** كل مرحلة يُفضّل أن تنتهي بتحقق يدوي أو آلي من أن الصفحة تعمل كما قبل (تحميل، إتمام، تأجيل، جدولة، تعيين، تغيير حالة).
- **الاختبار:** بعد المرحلة 3 يمكن تشغيل أي tests موجودة للمسار customers-hub/requests والتأكد من عدم كسرها.

---

## 6. ملخص الأولويات

1. **عاجل (بدون تغيير واجهة):** المرحلة 0 + المرحلة 1 (ثوابت، أنواع، دوال تنسيق واشتقاق).
2. **قصير المدى:** المرحلة 2 (hooks) ثم المرحلة 3 (استخراج المكونات).
3. **متوسط المدى:** المرحلة 4 (تنظيم المكون الرئيسي ومعالجة الكود الميت).
4. **لاحقاً:** المرحلة 5 (أداء، tests، a11y).

بعد تنفيذ الخطة، الملف الرئيسي `RequestDetailPage.tsx` يصبح قصيراً وواضحاً، ويخضع لقواعد Clean Code من حيث المسؤولية الواحدة، حجم الملف، قلة التكرار، وأنواع واضحة وقابلية الاختبار.
