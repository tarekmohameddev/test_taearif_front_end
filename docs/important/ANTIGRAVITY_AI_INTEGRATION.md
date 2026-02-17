# Antigravity AI Integration Guide

## 🎯 الهدف

هذا الدليل يشرح كيفية تكوين Antigravity AI لاستخدام نظام Debug تلقائياً.

---

## 📋 نظرة عامة

النظام الآن يدعم **Automation Layer** يسمح لـ Antigravity AI باستخدام النظام تلقائياً بدون تدخل يدوي.

---

## 🚀 الطريقة 1: استخدام Automation Script

### الخطوة 1: إرسال Prompt لـ Antigravity AI

انسخ محتوى `.antigravity/antigravity-prompt.txt` وأرسله لـ Antigravity AI في بداية المحادثة.

### الخطوة 2: Antigravity AI يستخدم الأوامر

Antigravity AI سيستخدم أوامر automation:

```bash
# تشغيل السيرفر
node scripts/antigravity-automation.js start-server

# حقن debug code
node scripts/antigravity-automation.js inject --runId=run123 --hypothesisId=H1 --filePattern="context/editorStoreFunctions/*.ts"

# جمع logs
node scripts/antigravity-automation.js get-logs

# تنظيف
node scripts/antigravity-automation.js cleanup
```

---

## 🔧 الطريقة 2: التكامل المباشر

### إذا كان Antigravity AI يدعم Custom Tools/Plugins:

1. **أضف Automation Script كـ Tool:**
   - Tool Name: `antigravity_debug`
   - Command: `node scripts/antigravity-automation.js`
   - Parameters: `action`, `runId`, `hypothesisId`, `filePattern`

2. **أضف Instructions:**
   - انسخ `.antigravity/ANTIGRAVITY_AI_INSTRUCTIONS.md`
   - أضفه كـ system instructions لـ Antigravity AI

---

## 📝 مثال على الاستخدام التلقائي

### السيناريو: المستخدم يخبر Antigravity AI بمشكلة

```
المستخدم: "imageText component لا يعمل بشكل صحيح"

Antigravity AI:
1. يقرأ المشكلة
2. يحدد الملفات المشبوهة: context/editorStoreFunctions/imageTextFunctions.ts
3. ينشئ hypotheses:
   - H1: المشكلة في updateByPath
   - H2: المشكلة في getData
4. يشغل السيرفر تلقائياً:
   node scripts/antigravity-automation.js start-server
5. يحقن debug code:
   node scripts/antigravity-automation.js inject --runId=img1 --hypothesisId=H1 --filePattern="context/editorStoreFunctions/imageTextFunctions.ts"
6. يطلب من المستخدم: "شغل التطبيق واستخدم المكون"
7. يجمع logs:
   node scripts/antigravity-automation.js get-logs
8. يحلل النتائج ويقترح الحل
9. ينظف:
   node scripts/antigravity-automation.js cleanup
```

---

## 🛠️ Automation Script API

### Actions المتاحة:

| Action | الوصف | Parameters |
|--------|-------|------------|
| `start-server` | تشغيل ingest server | - |
| `inject` | حقن debug code | `--runId`, `--hypothesisId`, `--filePattern` |
| `get-logs` | جمع logs | - |
| `cleanup` | تنظيف debug code | - |
| `status` | حالة السيرفر | - |

### أمثلة:

```bash
# تشغيل السيرفر
node scripts/antigravity-automation.js start-server

# حقن debug code
node scripts/antigravity-automation.js inject \
  --runId=run_$(date +%s) \
  --hypothesisId=H1 \
  --filePattern="context/editorStoreFunctions/imageTextFunctions.ts"

# جمع logs
node scripts/antigravity-automation.js get-logs

# تنظيف
node scripts/antigravity-automation.js cleanup

# حالة السيرفر
node scripts/antigravity-automation.js status
```

---

## 📚 الملفات المرجعية

### لـ Antigravity AI:
- `.antigravity/antigravity-prompt.txt` - Prompt للنسخ واللصق
- `.antigravity/ANTIGRAVITY_AI_INSTRUCTIONS.md` - تعليمات مفصلة

### للمطورين:
- `scripts/antigravity-automation.js` - Automation script
- `docs/important/ANTIGRAVITY_DEBUG_SYSTEM.md` - توثيق النظام

---

## ✅ Checklist للتكامل

- [ ] قراءة `.antigravity/antigravity-prompt.txt`
- [ ] إرسال prompt لـ Antigravity AI
- [ ] اختبار automation script
- [ ] التأكد من أن Antigravity AI يفهم الأوامر
- [ ] اختبار دورة عمل كاملة

---

## 🎓 نصائح

1. **ابدأ بسيط:** جرب أمر واحد في كل مرة
2. **تحقق من السيرفر:** استخدم `status` للتأكد
3. **نظف دائماً:** لا تنسى cleanup بعد كل جلسة
4. **وثق النتائج:** سجل ما اكتشفه Antigravity AI

---

## 🔄 Workflow الكامل

```
المستخدم يخبر Antigravity AI بمشكلة
    ↓
Antigravity AI يحدد الملفات المشبوهة
    ↓
Antigravity AI ينشئ hypotheses
    ↓
Antigravity AI يشغل السيرفر (automation)
    ↓
Antigravity AI يحقن debug code (automation)
    ↓
المستخدم يشغل التطبيق
    ↓
Antigravity AI يجمع logs (automation)
    ↓
Antigravity AI يحلل النتائج
    ↓
Antigravity AI يقترح الحل
    ↓
Antigravity AI ينظف (automation)
```

---

## 🚨 ملاحظات مهمة

1. **Automation Script** يحتاج Node.js
2. **السيرفر** يعمل على المنفذ 7242 (افتراضي)
3. **Cleanup** مهم جداً - لا تنساه
4. **Logs** تُحفظ في `.antigravity/debug.log`

---

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من أن السيرفر يعمل: `node scripts/antigravity-automation.js status`
2. راجع `.antigravity/README.md`
3. راجع `docs/important/ANTIGRAVITY_DEBUG_SYSTEM.md`

---

**الآن Antigravity AI يمكنه استخدام النظام تلقائياً! 🎉**
