# خطة مراجعة: ربط المكوّنات بـ Component Structure بعد توحيد fontSize

**الهدف:** التأكد من أن كل مكوّن معدّل (بعد توحيد حقول fontSize كـ number) مرتبط بشكل صحيح مع الـ Structure، وأن العرض في Live Editor وصفحات التينانت يعمل دون أخطاء.

**مرجع التعديلات:** `docs/updates/tenantWebsite/componentsStructure-fontSize-number-type.txt`

---

## قائمة التحقق العامة (لكل مكوّن)

لكل مكوّن في الجدول أدناه تحقق من:

1. **Structure**
   - كل حقل `fontSize` (وأي font size مشابه) في الملف المعني في `componentsStructure/` يكون إما:
     - `type: "number"` مع `unit: "px"` (أو وحدة مناسبة) و`defaultValue` رقمي، أو
     - `type: "object"` بحقول فرعية (مثل desktop/tablet/mobile) وكل حقل فرعي `type: "number"` مع `unit`.
   - لا يتبقى `type: "text"` أو `type: "select"` لحقول تعبّر عن حجم خط فعلي (px).

2. **Tenant Component**
   - المكوّن في `components/tenant/<ComponentName>/` يقرأ القيمة من المسار الصحيح (مثل `mergedData.typography?.title?.fontSize` أو من الـ default/store).
   - عند تطبيق الحجم على `style.fontSize` يُستخدم **`toDimension(value, "px", fallback)`** من `lib/utils.ts` (لدعم القيم الرقمية والنصية القديمة).
   - إن وُجدت قيم responsive (desktop/tablet/mobile) يُطبَّق الحجم المناسب للشاشة أو يُستخدم desktop كافتراضي عند عدم وجود media logic.

3. **Default Data**
   - إن وُجد ملف في `context/editorStoreFunctions/` للمكوّن (مثل `gridFunctions.ts`, `card4Functions.ts`): القيم الافتراضية لـ `fontSize` أرقام (أو object بأرقام) وليست نصوص (مثل `"sm"`, `"xl"`).

4. **Live Editor**
   - فتح الصفحة في وضع Live Editor واختيار المكوّن المعني.
   - التأكد أن حقول "Font Size" (أو "حجم الخط") تظهر كـ **مدخل رقم** مع عرض الوحدة (مثل px) وليس كـ نص حر أو قائمة select.
   - تغيير القيمة وحفظها ثم إعادة تحميل الصفحة: القيمة المحفوظة تظهر ولا تُستبدَل بقيمة افتراضية خاطئة.

---

## المهام المفصّلة حسب المكوّن

### 1. propertySlider

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 1.1 | `componentsStructure/propertySlider.ts` | `typography.link.fontSize`: `type: "number"`, `unit: "px"`, `defaultValue: 14`. و`typography.title.fontSize` و`typography.subtitle.fontSize` كـ object بحقول desktop/tablet/mobile أرقام مع unit. |
| 1.2 | `components/tenant/propertySlider/propertySlider1.tsx` | استخدام `toDimension(mergedData.typography?.link?.fontSize, "px", "14px")` لـ link، وتطبيق title/subtitle fontSize من object (مثلاً desktop) عبر toDimension أو دالة تحويل. |
| 1.3 | نفس الملف (default data داخل المكوّن) | `typography.link.fontSize: 14` (رقم). |
| 1.4 | Live Editor | فتح صفحة تحتوي Property Slider، التأكد أن "Font Size" للرابط يظهر كـ number input مع px. |

---

### 2. grid

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 2.1 | `componentsStructure/grid.ts` | `contentSettings.titleStyle.fontSize` و`contentSettings.priceStyle.fontSize`: `type: "number"`, `unit: "px"`, مع defaultValue (مثلاً 18 و 20). |
| 2.2 | `context/editorStoreFunctions/gridFunctions.ts` | `contentSettings.titleStyle.fontSize` و`priceStyle.fontSize` في الـ default كأرقام (مثلاً 18 و 20). |
| 2.3 | `components/tenant/grid/grid1.tsx` | إن كان يمرّر contentSettings للكروت: التأكد أن الكروت (card1/2/3 أو card4/5) تستقبل وتطبّق fontSize رقمية؛ إن لم يُستخدم في الـ render حالياً فالتعديل في Structure و default كافٍ. |
| 2.4 | Live Editor | فتح صفحة تحتوي Grid، التحقق من حقول Font Size للعنوان والسعر (number + px). |

---

### 3. card (card4 و card5)

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 3.1 | `componentsStructure/card.ts` | كل حقول `typography.*.fontSize` (title, cityDistrict, status, detailLabel, detailValue, price, whatsappButton) في كلا الـ variant: `type: "number"`, `unit: "px"`, مع defaultValue مناسبة. |
| 3.2 | `context/editorStoreFunctions/card4Functions.ts` و `card5Functions.ts` | `typography.title.fontSize` وغيرها أرقام (20, 14, 18, 12, 14, 16، إلخ). |
| 3.3 | `components/tenant/cards/card4.tsx` و `card5.tsx` | كل موضع يُطبَّق فيه `typography.*.fontSize` يستخدم `toDimension(..., "px", "…px")` مع fallback مناسب. |
| 3.4 | Live Editor | فتح صفحة تعرض كروت (مثلاً من Grid بثيم card4 أو card5)، التحقق من حقول Font Size في التايبوغرافي (number + px). |

---

### 4. whyChooseUs

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 4.1 | `componentsStructure/whyChooseUs.ts` | كل حقول fontSize في header و features (title, description): `type: "number"`, `unit: "px"`, defaultValue (مثلاً 18). |
| 4.2 | `components/tenant/whyChooseUs/whyChooseUs1.tsx` | تطبيق `toDimension(mergedData.header?.typography?.title?.fontSize, "px", "18px")` ووصف الهيدر، ونفس الفكرة لـ features.typography.title و description. |
| 4.3 | Live Editor | فتح قسم "لماذا تختارنا"، التحقق من ظهور حقول Font Size كـ number مع px. |

---

### 5. header

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 5.1 | `componentsStructure/header.ts` | `sizes.links.fontSize`: object بحقول desktop و mobile من نوع number مع unit "px". |
| 5.2 | `components/tenant/header/header2.tsx` (أو الملف الذي يستخدم sizes.links) | استخدام `toDimension(mergedData.sizes?.links?.fontSize?.desktop, "px", "18px")` ونسخة mobile عند العرض على الموبايل. |
| 5.3 | Live Editor | فتح الهيدر في المحرر، التحقق من حقول Font Size للروابط (number + px). |

---

### 6. propertyFilter

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 6.1 | `componentsStructure/propertyFilter.ts` | حقلا fontSize (input و searchButton): `type: "number"`, `unit: "px"`, defaultValue (مثلاً 14). |
| 6.2 | `components/tenant/propertyFilter/propertyFilter1.tsx` (أو 2) | إن كان يطبّق styling.input.fontSize أو searchButton.fontSize في الـ style: استخدام toDimension. |
| 6.3 | Live Editor | التحقق من حقول Font Size في إعدادات الفلتر. |

---

### 7. filterButtons

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 7.1 | `componentsStructure/filterButtons.ts` | حقلا fontSize (searchInput و filterButtons): `type: "number"`, `unit: "px"`, defaultValue (مثلاً 14). |
| 7.2 | `components/tenant/filterButtons/filterButtons1.tsx` | إن وُجد استخدام لـ fontSize من الـ styling: تطبيق toDimension. |
| 7.3 | Live Editor | التحقق من ظهور حقول Font Size كـ number. |

---

### 8. applicationForm

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 8.1 | `componentsStructure/applicationForm.ts` | header.typography.title.fontSize و description.fontSize: `type: "number"`, `unit: "px"`, defaultValue (مثلاً 24 و 18). |
| 8.2 | `components/tenant/applicationForm/applicationForm1.tsx` | استخدام toDimension لـ header.typography.title.fontSize و description.fontSize في style العناصر. |
| 8.3 | Live Editor | التحقق من حقول Font Size في ترويسة النموذج. |

---

### 9. contactFormSection

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 9.1 | `componentsStructure/contactFormSection.ts` | حقل fontSize المعرّف في الـ structure: `type: "number"`, `unit: "px"`, defaultValue. |
| 9.2 | `components/tenant/contactFormSection/contactFormSection1.tsx` | إن وُجد استخدام لـ fontSize: تطبيق toDimension. |
| 9.3 | Live Editor | التحقق من الحقل إن ظهر في الشريط الجانبي. |

---

### 10. contactMapSection

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 10.1 | `componentsStructure/contactMapSection.ts` | حقل fontSize (مثلاً للزر): `type: "number"`, `unit: "px"`, defaultValue (مثلاً 18). |
| 10.2 | `components/tenant/contactMapSection/contactMapSection1.tsx` | استخدام toDimension لـ form.submitButton.fontSize في style الزر؛ والقيمة الافتراضية في الـ default data رقمية. |
| 10.3 | Live Editor | التحقق من حقل Font Size للزر. |

---

### 11. logosTicker

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 11.1 | `componentsStructure/logosTicker.ts` | typography.title.fontSize و subtitle.fontSize: object بحقول mobile/tablet/desktop كلها `type: "number"`, `unit: "px"`, مع defaultValue. |
| 11.2 | `components/tenant/logosTicker/logosTicker1.tsx` | استخدام toDimension لـ typography.title.fontSize.desktop و subtitle.fontSize.desktop (أو القيم responsive إن وُجدت). |
| 11.3 | Live Editor | التحقق من حقول Font Size (عددية مع px). |

---

### 12. partners

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 12.1 | `componentsStructure/partners.ts` | typography.title.fontSize و description.fontSize (وفي الـ variant الثاني إن وُجد): object بأرقام و unit. |
| 12.2 | `components/tenant/partners/partners1.tsx` و `partners2.tsx` | تطبيق toDimension عند استخدام typography.title.fontSize أو description/subtitle في الـ style. |
| 12.3 | Live Editor | التحقق من حقول Font Size. |

---

### 13. photosGrid

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 13.1 | `componentsStructure/photosGrid.ts` | typography.title.fontSize و subtitle و caption: object (mobile/tablet/desktop) بأرقام و unit. |
| 13.2 | `components/tenant/photosGrid/photosGrid1.tsx` و `photosGrid2.tsx` | استخدام toDimension لجميع المواضع التي تُطبَّق فيها typography.*.fontSize (title, subtitle, caption، وdesktop/mobile حسب الاستخدام). |
| 13.3 | Live Editor | التحقق من حقول Font Size. |

---

### 14. blogDetails

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 14.1 | `componentsStructure/blogDetails.ts` | typography.title.fontSize و subtitle.fontSize: object بأرقام و unit. |
| 14.2 | `components/tenant/blogDetails/blogDetails2.tsx` | استخدام toDimension لـ typography.title.fontSize.desktop (أو القيم responsive). |
| 14.3 | Live Editor | التحقق من حقول Font Size في تفاصيل المدونة. |

---

### 15. propertiesShowcase

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 15.1 | `componentsStructure/propertiesShowcase.ts` | typography.title.fontSize: object بأرقام و unit. |
| 15.2 | `components/tenant/propertiesShowcase/propertiesShowcase1.tsx` | استخدام toDimension في style العنوان بدل كلاسات Tailwind المعتمدة على النص (مثل text-xl). |
| 15.3 | Live Editor | التحقق من حقل Font Size للعنوان. |

---

### 16. propertyDetail

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 16.1 | `componentsStructure/propertyDetail.ts` | typography.title.fontSize و subtitle.fontSize: object بأرقام و unit. |
| 16.2 | `components/tenant/propertyDetail/propertyDetail2.tsx` و `page.tsx` | استخدام toDimension لـ typography.title.fontSize (مثلاً desktop) عند تمرير titleFontSize أو في الـ style. |
| 16.3 | Live Editor | التحقق من حقول Font Size في تفاصيل العقار. |

---

### 17. title

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 17.1 | `componentsStructure/title.ts` | typography.fontSize: object (mobile/tablet/desktop) بحقول `type: "number"`, `unit: "px"`, مع defaultValue. |
| 17.2 | `components/tenant/title/title1.tsx` | استخدام toDimension(fontSizeDesktop, "px", "40px") (أو القيم responsive إن وُجدت). |
| 17.3 | Live Editor | التحقق من حقول Font Size. |

---

### 18. projectDetails

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 18.1 | `componentsStructure/projectDetails.ts` | typography.title و subtitle و price: كل منها fontSize كـ object بأرقام و unit. |
| 18.2 | `components/tenant/projectDetails/` | إن وُجد استخدام لـ typography.*.fontSize: تطبيق toDimension. |
| 18.3 | Live Editor | التحقق من حقول Font Size. |

---

### 19. imageText

| الخطوة | الملف | ما الذي تراجعه |
|--------|-------|-----------------|
| 19.1 | `componentsStructure/imageText.ts` | textStyleGroup.fontSize: `type: "number"` (مع unit إن لم تُضف سابقاً). |
| 19.2 | `components/tenant/imageText/imageText1.tsx` | تطبيق fontSize كـ رقم (مثلاً `${item.fontSize}px` أو toDimension) عند عرض النص. |
| 19.3 | Live Editor | التحقق من أن الحقل يظهر كـ number. |

---

## ختام المراجعة

| # | المهمة | ملاحظات |
|---|--------|---------|
| 1 | تشغيل المشروع محلياً | `npm run dev` وفتح صفحة تحتوي المكوّنات المذكورة. |
| 2 | فتح Live Editor | التأكد أن كل حقل Font Size يظهر كـ **number input** مع وحدة (px) وليس text أو select. |
| 3 | تغيير قيم وحفظ | تغيير حجم خط في مكوّن واحد على الأقل من كل نوع (مثلاً propertySlider، card، whyChooseUs)، حفظ الصفحة، ثم إعادة التحميل: القيم المحفوظة تظهر بشكل صحيح. |
| 4 | بناء الإنتاج | `npm run build` للتأكد من عدم وجود أخطاء TypeScript أو استيراد. |
| 5 | توثيق أي خلل | إن وُجد مكوّن لا يطبّق toDimension أو لا يقرأ من المسار الصحيح: توثيق المسار والملف في هذا المستند أو في `docs/updates/`. |

---

**تاريخ إنشاء الخطة:** 2025-03-02  
**مرتبط بتحديث:** componentsStructure-fontSize-number-type (توحيد fontSize كـ number).
