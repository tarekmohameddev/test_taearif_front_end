# خطة تنفيذ: إيقاف مؤقت واستئناف حملات SMS (Pause & Resume)

**المرجع:** [SMS Campaign Pause & Resume — Frontend Integration Guide](./SMS-Campaign-Pause-Resume-Frontend-Integration-Guide)  
**مبادئ إلزامية:** Clean Code، Best Practices، Single Responsibility، عدم تكرار المنطق.

---

## المبادئ المُلزمة

| المبدأ | التطبيق الإلزامي |
|--------|-------------------|
| **Single Responsibility (SRP)** | كل ملف/دالة مسؤولة عن شيء واحد فقط. |
| **DRY** | عدم تكرار المنطق؛ استخراج الثوابت والرسائل والدوال المشتركة. |
| **Explicit Naming** | أسماء توضّح النية (مثل `canPauseCampaign`, `resumeCampaignContinue`). |
| **Single Level of Abstraction** | داخل الدالة نفس مستوى التجريد؛ التفاصيل في دوال فرعية. |
| **Error Handling** | معالجة 400/404/409/422 بشكل صريح؛ رسائل مستخدم واضحة. |
| **Types Over Any** | تعريف أنواع للـ API responses/errors؛ عدم استخدام `any`. |
| **Separation of Concerns** | API في `lib/`، حالة UI في hooks، عرض في components. |
| **Immutability** | عدم تحوير الـ state مباشرة؛ إرجاع/تعيين قيم جديدة. |

---

## Phase 1: Types & API Layer

### Task 1.1 — توسيع أنواع الحملة والحالات (Types)

**الملف:** `components/sms-campaigns/types.ts`

**قواعد:**
- تعريف نوع اتحادي (union) لحالة الحملة من مصدر واحد وإعادة استخدامه.
- عدم تكرار السلاسل النصية؛ استخدام الـ type كمرجع وحيد.

**الإجراءات:**
1. إضافة نوع:  
   `CampaignStatus = "draft" | "scheduled" | "in_progress" | "paused" | "sent" | "failed" | "cancelled"`.
2. استبدال `SMSCampaign.status` ليكون من نوع `CampaignStatus`.
3. إضافة حقول اختيارية إن رجعها الـ API:  
   `reservedCredits?: number`, `pausedCount?: number`.
4. تحديث توقيع `mapApiCampaignToUI` لقبول الحقول الجديدة من الـ API (مثل `reserved_credits`, `paused_count`) مع قيم افتراضية آمنة.
5. إنشاء نوع للـ credit info من استجابات pause/resume:  
   `PauseCreditInfo`, `ResumeCreditInfo` (في نفس الملف أو في ملف types خاص بالـ SMS إن وُجد).

**معايير القبول:** لا أخطاء TypeScript؛ استخدام `CampaignStatus` في كل مكان يعرض أو يتحقق من الحالة.

---

### Task 1.2 — أنواع استجابات Pause/Resume وأخطاء الـ API

**الملف:** `lib/services/sms-api.ts` (أو `components/sms-campaigns/types.ts` إن فضّل الفريق وضع كل أنواع الـ SMS معاً)

**قواعد:**
- كل استجابة API لها واجهة معرّفة.
- أخطاء الباك اند (code + message) لها نوع معرّف لاستخدامها في معالجة الأخطاء.

**الإجراءات:**
1. تعريف واجهات:
   - `PauseCampaignResponse` (تحتوي `campaign_id`, `status`, `sent_count`, `paused_count`, `credit_info`).
   - `ResumeCampaignResponse` (تحتوي `campaign_id`, `status`, `mode`, `recipient_count`, `credit_info`).
   - `CreditInfo` (حقول: `consumed?`, `released?`, `reserved?`, `balance_after_release?`, `balance_after_reserve?`, `note?`).
2. تعريف واجهة لأخطاء الـ API:  
   `SmsApiErrorBody { status?: boolean; code?: string; message?: string; errors?: Record<string, string[]> }`.
3. تصدير الأنواع من مكان واحد (لا تكرار للتعريفات).

**معايير القبول:** استدعاءات pause/resume تستخدم هذه الأنواع في التوقيعات والـ response handling.

---

### Task 1.3 — دوال Pause و Resume في طبقة الـ API

**الملف:** `lib/services/sms-api.ts`

**قواعد:**
- دوال الـ API لا تحتوي منطق UI أو toast؛ فقط استدعاء HTTP وإرجاع/رمي بيانات.
- استخراج منطق قراءة الخطأ من الاستجابة في دالة مساعدة واحدة (DRY).
- استخدام الـ types المُعرّفة في Task 1.2.

**الإجراءات:**
1. إنشاء دالة مساعدة لاستخراج رسالة الخطأ من استجابة Axios:  
   `getSmsApiErrorMessage(error: unknown): string`، مع دعم `response.data.message` و`response.data.code` و`errors` إن وُجدت.
2. إضافة `pauseCampaign(id: number): Promise<PauseCampaignResponse>`:  
   `POST /v1/sms/campaigns/{id}/pause`، بدون body، وإرجاع `getData<PauseCampaignResponse>(res)`.
3. إضافة واجهة `ResumeCampaignBody`:  
   `{ mode: "continue" | "restart"; customer_ids?: number[]; manual_phones?: string[] }`.
4. إضافة `resumeCampaign(id: number, body: ResumeCampaignBody, idempotencyKey: string): Promise<ResumeCampaignResponse>`:  
   `POST /v1/sms/campaigns/{id}/resume` مع هيدر `Idempotency-Key: idempotencyKey`.
5. التأكد أن `getData` يرمي خطأ عند 4xx/5xx وأن الـ caller يلتقطه ويستخدم `getSmsApiErrorMessage` عند العرض.

**معايير القبول:** لا منطق toast داخل sms-api؛ الدوال مُختبرة يدوياً أو بوحدة اختبار مع mock لـ axios.

---

### Task 1.4 — دعم status و reserved في getCampaigns و ApiCampaign

**الملف:** `lib/services/sms-api.ts`

**قواعد:**
- واجهة الـ API تعكس عقد الباك اند دون زيادة أو نقصان في الحقول المستخدمة.

**الإجراءات:**
1. توسيع `ApiCampaign.status` ليشمل `paused` و`failed` و`cancelled` (أو استخدام نوع مشتق من `CampaignStatus` إن وُضع في طبقة مشتركة).
2. إضافة حقول اختيارية إن رجعها الباك اند:  
   `reserved_credits?: number`, `paused_count?: number`.
3. إضافة دعم فلتر القائمة:  
   `CampaignListParams` يتضمن `status?: string` وتمريره كـ query: `?status=paused` عند الحاجة.

**معايير القبول:** عرض الحملات المتوقفة وعرض reserved/paused_count إن وُجدت في الاستجابة.

---

## Phase 2: Constants & User Messages

### Task 2.1 — ثوابت الحالات والرسائل (لا تكرار)

**الملف:** `components/sms-campaigns/constants.ts`

**قواعد:**
- كل رسالة مستخدم (عربي) في مكان واحد.
- أسماء الثوابت دالة على الغرض (مثل `STATUS_LABEL_PAUSED` أو استخدام خريطة واحدة `STATUS_LABELS`).

**الإجراءات:**
1. إضافة إلى `STATUS_COLORS` و`STATUS_LABELS`:  
   `paused`, `cancelled` (و`failed` إن لم تكن مستخدمة لحملات كاملة من قبل).
2. إضافة ترجمات عربية لرسائل الباك اند في `SMS_ERROR_MESSAGES_AR`:
   - "Only in-progress or scheduled campaigns can be paused."
   - "Only draft, scheduled or paused campaigns can be updated."
   - "Insufficient credits." (أو النص المخصّص إن رجع الباك اند مع Required/Available).
   - رسالة تعارض Idempotency (409) إن رجعها الباك اند بنص ثابت.
3. إنشاء كائن واحد للرسائل المقترحة في الدوك (قبل الإرسال، بعد الإيقاف، بعد الاستئناف، رصيد غير كافٍ) كـ constants يُستورد من مكان واحد؛ استخدام المفتاح بدل نسخ النص في الـ UI.

**معايير القبول:** لا رسالة عربية مكررة في أكثر من component؛ التعديل من constants فقط.

---

## Phase 3: Business Logic & Hooks

### Task 3.1 — دوال مساعدة للحملة (بدون side effects)

**الملف:** `components/sms-campaigns/utils/campaignActions.ts` (ملف جديد)

**قواعد:**
- دوال نقية (pure) قدر الإمكان؛ لا استدعاء API ولا toast.
- أسماء توضّح القصد: متى يُسمح بالإجراء.

**الإجراءات:**
1. `canPauseCampaign(status: CampaignStatus): boolean`  
   يرجع true فقط لـ `in_progress` و `scheduled`.
2. `canEditCampaign(status: CampaignStatus): boolean`  
   يرجع true لـ `draft`, `scheduled`, `paused`.
3. `canResumeCampaign(status: CampaignStatus): boolean`  
   يرجع true لـ `paused` فقط.
4. `canSendCampaign(status: CampaignStatus): boolean`  
   يرجع true لـ `draft`, `scheduled` (للتوافق مع الدوك).
5. تصدير الدوال واستيرادها من الـ components والـ hooks فقط؛ عدم وضع منطق التحقق مكرراً في الـ UI.

**معايير القبول:** كل شرط "هل نعرض الزر X" يستخدم هذه الدوال؛ لا شرط مكرر من نوع `status === 'paused'` في أكثر من مكان.

---

### Task 3.2 — Hook useSmsCampaigns: Pause و Resume

**الملف:** `components/sms-campaigns/hooks/useSmsCampaigns.ts`

**قواعد:**
- الـ Hook مسؤول عن التنسيق بين API والـ state والـ toast فقط؛ لا يحتوي تفاصيل UI (نصوص طويلة تُستورد من constants).
- معالجة الأخطاء حسب الكود (400, 404, 409, 422) ورسالة واحدة واضحة للمستخدم.
- توليد Idempotency-Key في طبقة واحدة فقط (هنا عند استدعاء resume).

**الإجراءات:**
1. إضافة `handlePauseCampaign(id: string): Promise<void>`:  
   استدعاء `pauseCampaign(Number(id))`، عند النجاح: تحديث الـ state المحلي للحملة إلى `paused` (أو إعادة fetchCampaigns)، عرض `credit_info.note` أو الرسالة من constants، استدعاء `fetchCreditBalance` إن وُجد في الـ store.
2. إضافة `handleResumeCampaign(id: string, params: { mode: "continue" | "restart"; customer_ids?: number[]; manual_phones?: string[] }): Promise<void>`:  
   توليد `idempotencyKey = crypto.randomUUID()`، استدعاء `resumeCampaign(Number(id), body, idempotencyKey)`، عند 202: تحديث الحالة (أو إعادة fetch)، عرض رسالة من `credit_info.note` أو constants، تحديث الرصيد.
3. عند الخطأ: استخدام `getSmsApiErrorMessage` و`getSmsErrorAr` لعرض رسالة واحدة في toast؛ عدم رمي رسائل تقنية للمستخدم.
4. التعامل صراحة مع 400 (INSUFFICIENT_CREDITS) و 409 (idempotency) و 422 (validation) إن أمكن تمييزها من الـ response.

**معايير القبول:** لا تكرار لمنطق الاستدعاء في الـ component؛ الـ component يستدعي فقط `handlePauseCampaign` و `handleResumeCampaign`.

---

## Phase 4: UI Components

### Task 4.1 — أزرار الإجراءات حسب الحالة (قائمة الحملات)

**الملف:** `components/sms-campaigns/SmsCampaignsList.tsx`

**قواعد:**
- عرض الأزرار يعتمد فقط على دوال `canPauseCampaign`, `canEditCampaign`, `canResumeCampaign`, `canSendCampaign`.
- عدم تكرار نفس شريط الأزرار في عرض البطاقات والجدول؛ استخراج مكوّن فرعي واحد للأزرار يُمرَّر له الحملة والـ callbacks.

**الإجراءات:**
1. إنشاء مكوّن داخلي أو في ملف منفصل:  
   `CampaignActionButtons({ campaign, onPause, onResumeContinue, onResumeRestart, onEdit, onSend, onDelete })`  
   يعرض حسب الحالة: إيقاف مؤقت، متابعة، إعادة من البداية، تعديل، إرسال، حذف.
2. استخدام `canPauseCampaign(campaign.status)` لإظهار زر "إيقاف مؤقت".
3. استخدام `canResumeCampaign(campaign.status)` لإظهار زرّي "متابعة" و"إعادة من البداية".
4. استخدام `canEditCampaign(campaign.status)` لإظهار "تعديل".
5. ربط الأزرار بالـ handlers من الـ parent (الذي يأخذها من `useSmsCampaigns`).
6. استخدام نفس المكوّن في عرض البطاقات والجدول لتفادي التكرار.

**معايير القبول:** تغيير شرط عرض زر واحد من مكان واحد؛ لا نسخ للشريط في مكانين.

---

### Task 4.2 — حوار الاستئناف (متابعة / إعادة من البداية)

**قواعد:**
- فصل المسؤوليات: حوار يختار الوضع (continue/restart) واختياري قائمة جديدة عند restart.
- النصوص من constants.

**الإجراءات:**
1. عند النقر على "متابعة": استدعاء مباشر لـ `handleResumeCampaign(id, { mode: "continue" })` مع toast بالرسالة من الدوك.
2. عند النقر على "إعادة من البداية":
   - خيار (أ): إعادة بنفس القائمة — استدعاء `handleResumeCampaign(id, { mode: "restart" })`.
   - خيار (ب): إعادة بقائمة جديدة — فتح حوار (أو إعادة استخدام حوار اختيار المستلمين الموجود) ثم استدعاء `handleResumeCampaign(id, { mode: "restart", customer_ids, manual_phones })`.
3. توليد Idempotency-Key داخل الـ hook وليس داخل الـ component.
4. عرض رسالة رصيد غير كافٍ عند 400 مع الإشارة لشراء الكريديت إن وُجد الرابط.

**معايير القبول:** لا منطق API داخل الحوار؛ الحوار يحدد فقط الـ mode والقائمة ثم يستدعي الـ handler.

---

### Task 4.3 — عرض معلومات الكريديت والتقدم

**الملف:** `components/sms-campaigns/SmsCampaignsList.tsx` (أو مكوّن فرعي مثل `CampaignCreditSummary`)

**قواعد:**
- عرض reserved/consumed فقط إن كانت القيم متوفرة من الـ API (لا افتراضات غير موثقة).
- نص واحد للمستخدم (من الدوك) عند الحالة "جارية" يوضح: مرسل حتى الآن، محجوز للمتبقين.

**الإجراءات:**
1. عند وجود `reservedCredits` (أو من الـ API): عرض "X كريديت محجوز للمتبقين" أو ما يعادله من constants.
2. للحملة `in_progress`: الإبقاء على شريط التقدم الحالي (sent/recipient) مع إضافة جملة توضيحية إن أمكن: "X مستخدم، Z محجوز للمتبقين" من constants.
3. عدم تكرار حساب التكلفة في أكثر من مكان؛ استخدام دالة أو constant مثل `CREDITS_PER_SMS` إن وُجد.

**معايير القبول:** النص الموحّد من constants؛ لا أرقام "سحرية" في الـ JSX.

---

### Task 4.4 — تحديث mapApiCampaignToUI وتمرير الحقول الجديدة

**الملف:** `components/sms-campaigns/types.ts`

**قواعد:**
- المابّر يبقى في مكان واحد؛ الـ API response type يحدد الحقول الاختيارية.

**الإجراءات:**
1. التأكد أن `mapApiCampaignToUI` يقرأ `reserved_credits` و `paused_count` من الـ API ويملأ `reservedCredits` و `pausedCount` في `SMSCampaign`.
2. التعامل مع `status` الجديدة (`paused`, `failed`, `cancelled`) دون كسر الحالات الحالية (استخدام type assertion آمن أو تحقق من القيم المسموحة).

**معايير القبول:** قائمة الحملات تعرض "متوقفة" و "محجوز" و "متبقي" بشكل صحيح عند توفر البيانات.

---

## Phase 5: Error Handling & Edge Cases

### Task 5.1 — معالجة موحّدة لأخطاء SMS API

**الملف:** `components/sms-campaigns/utils/smsErrorHandler.ts` (أو داخل constants + دالة في نفس ملف constants)

**قواعد:**
- استخراج رسالة المستخدم النهائية من مكان واحد (دالة واحدة تأخذ error وترجع string).
- دعم الأكواد: CAMPAIGN_NOT_FOUND, VALIDATION_FAILED, INSUFFICIENT_CREDITS، ورسالة عامة لـ 409.

**الإجراءات:**
1. دالة `getSmsUserFacingMessage(error: unknown): string`:  
   إن وُجد `response.data.code` استخدم خريطة من الكود إلى الرسالة العربية؛ وإلا استخدم `response.data.message` ثم `getSmsErrorAr` ثم رسالة افتراضية.
2. إضافة مدخلات في `SMS_ERROR_MESSAGES_AR` أو خريطة منفصلة لأكواد الخطأ (مثل `INSUFFICIENT_CREDITS`) إن رجعها الباك اند كنص أو كود.
3. استخدام هذه الدالة في `useSmsCampaigns` لجميع استدعاءات pause/resume/send/update.

**معايير القبول:** المستخدم يرى دائماً رسالة مفهومة بالعربي؛ لا ظهور لـ "Request failed" أو نصوص تقنية.

---

### Task 5.2 — Idempotency: مفتاح جديد لكل إجراء متميز

**قواعد:**
- مفتاح جديد عند كل ضغطة "متابعة" أو "إعادة من البداية" (إجراء مستقل).
- نفس المفتاح فقط عند إعادة المحاولة لنفس الطلب (نفس الـ body).

**الإجراءات:**
1. توليد المفتاح داخل الـ hook عند استدعاء `handleResumeCampaign` (مرة واحدة لكل استدعاء).
2. عدم تخزين المفتاح في الـ component أو إعادة استخدامه عند تغيير الـ mode أو القائمة.
3. توثيق ذلك في تعليق قصير فوق `resumeCampaign` أو `handleResumeCampaign`.

**معايير القبول:** لا إعادة استخدام لـ Idempotency-Key بين طلبين مختلفين (mode أو body مختلف).

---

## Phase 6: Optional Enhancements

### Task 6.1 — Polling بعد الاستئناف (اختياري)

**قواعد:**
- فصل منطق الـ polling في hook أو دالة قابلة لإعادة الاستخدام (مثل `useCampaignProgress(campaignId, { enabled, interval })`).
- إيقاف الـ polling عند وصول الحالة إلى `sent` أو `failed` أو عند unmount.

**الإجراءات:**
1. عند 202 من resume، تفعيل polling لـ `GET /sms/campaigns/{id}` على فترات معقولة (مثلاً 3–5 ثوان).
2. تحديث الـ campaign في الـ state من الاستجابة وإيقاف الـ polling عند `status === 'sent' || status === 'failed'`.

**معايير القبول:** لا polling داخل الـ component بشكل مبعثر؛ منطق واحد واضح.

---

### Task 6.2 — فلتر القائمة بحالة "متوقفة" (اختياري)

**قواعد:**
- استخدام الـ query parameter `status` إن دعمه الباك اند دون افتراضات على الباك اند.

**الإجراءات:**
1. إضافة فلتر اختياري في واجهة قائمة الحملات (مثل تبويب أو dropdown: الكل / مسودة / مجدولة / جارية / متوقفة / مرسلة).
2. عند اختيار "متوقفة" استدعاء `getCampaigns({ status: "paused", ... })`.

**معايير القبول:** لا تحميل كل الحملات ثم فلترتها على العميل إن كان الباك اند يدعم الفلتر.

---

## ترتيب التنفيذ الموصى به

1. **Task 1.1 → 1.2 → 1.3 → 1.4** (Types & API بالكامل).
2. **Task 2.1** (Constants & messages).
3. **Task 3.1 → 3.2** (Utils & hook).
4. **Task 4.1 → 4.2 → 4.3 → 4.4** (UI + mapper).
5. **Task 5.1 → 5.2** (Error handling & idempotency).
6. **Task 6.1, 6.2** (اختياري).

---

## Checklist نهائي (قبل الإغلاق)

- [ ] لا تكرار لشروط الحالة (استخدام دوال `can*` فقط).
- [ ] لا رسائل عربية مكررة (جميعها من constants).
- [ ] لا منطق API أو Idempotency داخل الـ components (فقط في api + hook).
- [ ] معالجة 400/404/409/422 برسائل واضحة.
- [ ] أنواع TypeScript لجميع استجابات pause/resume والأخطاء المستخدمة.
- [ ] زر إيقاف مؤقت يظهر فقط لـ in_progress و scheduled.
- [ ] زرّا متابعة وإعادة يظهران فقط لـ paused.
- [ ] التعديل مسموح لـ draft و scheduled و paused.
- [ ] Idempotency-Key فريد لكل استدعاء resume متميز.
