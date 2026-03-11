# whyChooseUs – تقسيم وبيانات ثابتة وتكرار

## ما تم تنفيذه

- **تقسيم إلى ملفات فرعية:** تم نقل تعريفات الـ variants إلى `componentsStructure/whyChooseUs.variants.ts`، والملف الرئيسي `whyChooseUs.ts` يستوردها ويصدّر `whyChooseUsStructure` فقط.
- **تأجيل التحميل:** لا يتم استيراد `whyChooseUs` ثابتاً في `ComponentsList`؛ يتم تحميله عند الطلب عبر `getComponentStructureAsync('whyChooseUs')`.

## توصيات لاحقة

- **استخراج البيانات الثابتة:** قائمة خيارات الأيقونات (Lucide، React Icons، إلخ) في `whyChooseUs.variants.ts` يمكن نقلها إلى ملف منفصل (مثلاً `whyChooseUs.iconOptions.ts`) أو إلى JSON وتحميلها عند الحاجة لتقليل حجم الملف.
- **تقليل التكرار:** أنماط الحقول المتكررة (مثل `key`, `label`, `type`, `placeholder`) يمكن توحيدها بدوال أو مصنّعات (factories) لتقليل التكرار والحفاظ على نفس السلوك.
