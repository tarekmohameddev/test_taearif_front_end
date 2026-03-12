# جلب بيانات الـ tenant من طبقة واحدة (Tenant Fetch Single Layer)

## الملخص

تم توحيد جلب بيانات الـ tenant بحيث يتم تنفيذ استدعاء **واحد** لـ `POST /v1/tenant-website/getTenant` في كل رحلة تحميل، من **طبقة واحدة فقط** حسب السياق، مع إزالة استدعاء `fetchTenantData` من جميع المكونات الفرعية.

## الطبقات الوحيدة التي تجلب البيانات

| السياق | الطبقة | الملف |
|--------|--------|-------|
| الصفحة الرئيسية للـ tenant | HomePageWrapper | `app/HomePageWrapper.tsx` |
| صفحات الـ slug (about-us, project/…، إلخ) | TenantPageWrapper | `app/TenantPageWrapper.tsx` |
| Live Editor | useTenantDataEffect (داخل LiveEditorEffects) | `components/tenant/live-editor/LiveEditorEffects.tsx` → `effects/useTenantDataEffect.ts` |
| صفحة الخصوصية (إن وُجدت مستقلة) | PrivacyPageWrapper | `app/PrivacyPageWrapper.tsx` |
| Owner dashboard / login | الصفحات المعنية | `app/owner/...` |

## التغييرات المنفذة

1. **Live Editor**
   - إزالة الـ `useEffect` الذي يستدعي `fetchTenantData(tenantId)` من `app/live-editor/components/EditorNavBar/EditorNavBar.tsx`.
   - إزالة الـ `useEffect` "تحميل tenantData" من `app/live-editor/hooks/useEditorNavEffects.ts`.
   - الإبقاء على `useTenantDataEffect({ tenantId, fetchTenantData })` داخل `LiveEditorEffects.tsx` كمصدر وحيد لتفعيل الجلب في Live Editor.

2. **مكونات موقع الـ tenant**
   - إزالة الـ subscription لـ `fetchTenantData` والـ `useEffect` الذي يستدعي `fetchTenantData(tenantId)` (أو `fetchTenantData(finalTenantId)`) من عشرات المكونات، منها:
     - Header/Footer: header1, header2, header3, StaticHeader1, footer1, footer2, StaticFooter1, GlobalLayout.
     - Hero ومسارات الصفحة الرئيسية: hero1–4, heroBanner1, ctaValuation1, grid1, propertySlider1, propertyFilter1, filterButtons1, propertiesShowcase1.
     - بقية المكونات: halfTextHalfImage (1–7), cards, testimonials, partners, inputs, sideBySide (1–7), stepsSection, quoteSection, valuesSection, essenceSection, philosophyCtaSection, featuresSection, journeySection, landInvestmentFormSection, contactCards, contactUsHomePage, contactMapSection, mapSection, title, blogsSections, blogCard, blogDetails (1 و 2), photosGrid (1 و 2), commitmentSection, responsiveImage, video, imageText, creativityTriadSection, whyChooseUs, propertyDetail2, jobForm, applicationForm, logosTicker, contactFormSection, propertyFilter2, projectsHeader.
   - إزالة نفس النمط من الـ hooks الفرعية: `useProjectStore`, `useProjectData`, `usePropertyData`.

3. **السلوك بعد التعديل**
   - المكونات تقرأ `tenantData` و/أو `tenantId` من الـ store فقط، دون استدعاء `fetchTenantData`.
   - الاعتماد على أن الـ wrapper (أو useTenantDataEffect في Live Editor) قد قام بالجلب مسبقاً.

## المراجع

- الخطة: جلب tenant مرة واحدة من طبقة واحدة وإزالة fetchTenantData من المكونات.
- `docs/important/liveEditor/DATA_FLOW.md` — تدفق البيانات في Live Editor.
- `docs/important/liveEditor/TENANT_STORE_AND_API.md` — واجهة الـ tenant store والـ API.
