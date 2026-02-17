# Antigravity AI Debug System

## 📋 نظرة عامة

نظام debug متقدم لـ Antigravity AI مشابه 99% لنظام Cursor Debug Mode. يسمح لـ Antigravity AI بحقن debug code تلقائياً، جمع logs، وتحليل النتائج.

## 🎯 الهدف

بناء نظام حيث **Antigravity AI** هو من:
- يقرر أين يتم وضع debug lines
- يحلل النتائج
- يكتب debug code تلقائياً

## 🏗️ المكونات الأساسية

### 1. Ingest Server
**الموقع:** `scripts/antigravity-ingest-server.ts`

سيرفر محلي يستقبل POST requests من الكود المحقون ويكتب logs في `.antigravity/debug.log` بصيغة NDJSON.

**المميزات:**
- ✅ Sanitization للبيانات الحساسة
- ✅ حد أقصى لحجم payload (1MB)
- ✅ Endpoints للقراءة والحذف
- ✅ Status endpoint للتحقق من حالة السيرفر

### 2. Codemod (Code Injection)
**الموقع:** `scripts/antigravity-codemod.js`

يستخدم `jscodeshift` لحقن debug code تلقائياً في نقاط محددة.

**الاستراتيجيات:**
- حقن في بداية كل function declaration
- حقن في بداية arrow functions
- حقن قبل return statements (اختياري)

### 3. Cleanup Script
**الموقع:** `scripts/antigravity-cleanup.js`

يزيل جميع debug code المحقون من الملفات.

## 🚀 دورة العمل الكاملة

### الخطوة 1: Antigravity AI يكتشف Bug Area
```plaintext
Antigravity AI يحلل الكود ويحدد:
- الملفات المشبوهة
- الأسطر المحددة
- نوع المشكلة
```

### الخطوة 2: توليد Hypotheses
```plaintext
Antigravity AI يولد فرضيات:
- H1: المشكلة في function X
- H2: المشكلة في data flow
- H3: المشكلة في state management
```

### الخطوة 3: تحديد نقاط الحقن
```plaintext
Antigravity AI يقرر:
- الملفات: context/editorStoreFunctions/imageTextFunctions.ts
- الأسطر: 132, 145, 178
- نوع الحقن: function-entry
```

### الخطوة 4: تشغيل Ingest Server
```bash
npm run antigravity:server
```

### الخطوة 5: حقن Debug Code
```bash
AGENT_RUNID=run_20260217_001 AGENT_HYP=H1 \
npm run antigravity:inject "context/editorStoreFunctions/imageTextFunctions.ts"
```

### الخطوة 6: تشغيل الاختبارات/التطبيق
```plaintext
شغل التطبيق أو الاختبارات
سيتم إرسال logs تلقائياً للسيرفر عند تنفيذ الكود المحقون
```

### الخطوة 7: جمع Logs
```bash
# قراءة logs من API
curl http://127.0.0.1:7242/logs

# أو قراءة الملف مباشرة
cat .antigravity/debug.log
```

### الخطوة 8: تحليل النتائج
```plaintext
Antigravity AI يحلل:
- ترتيب تنفيذ functions
- القيم في نقاط مختلفة
- التوقيت (timing)
- الأنماط (patterns)
```

### الخطوة 9: اقتراح Patch
```plaintext
Antigravity AI يقترح:
- التغييرات المطلوبة
- السبب
- الحل المقترح
```

### الخطوة 10: Cleanup
```bash
npm run antigravity:cleanup
```

## 📝 شكل Debug Code المحقون

```javascript
// #region agent log
(function(){
  try {
    const payload = {
      location: 'context/editorStoreFunctions/imageTextFunctions.ts:132',
      message: 'function-entry',
      timestamp: Date.now(),
      runId: 'run_20260217_001',
      hypothesisId: 'H1'
    };
    if (typeof globalThis !== 'undefined' && globalThis.fetch) {
      globalThis.fetch('http://127.0.0.1:7242/ingest/run_20260217_001', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function(){});
    }
  } catch(e) {}
})();
// #endregion
```

## 📊 شكل Log Entry

كل entry في `.antigravity/debug.log` هو JSON object (NDJSON format):

```json
{
  "id": "run_20260217_001",
  "receivedAt": "2026-02-17T10:30:45.123Z",
  "payload": {
    "location": "context/editorStoreFunctions/imageTextFunctions.ts:132",
    "message": "function-entry",
    "timestamp": 1708162245123,
    "runId": "run_20260217_001",
    "hypothesisId": "H1"
  }
}
```

## 🔒 الأمان والاحتياطات

### ✅ ما تم تطبيقه:
1. `.antigravity/` مضاف إلى `.gitignore`
2. Sanitization للبيانات الحساسة (passwords, tokens, etc.)
3. حد أقصى لحجم payload (1MB)
4. يعمل فقط في development mode
5. Cleanup script لمنع commit للـ debug code

### ⚠️ ملاحظات مهمة:
- **لا تنسى Cleanup:** دائماً نظف debug code قبل commit
- **Development Only:** النظام يعمل فقط في development mode
- **Security:** البيانات الحساسة يتم redact تلقائياً
- **Performance:** Debug code قد يؤثر على الأداء

## 🛠️ Environment Variables

| Variable | الوصف | القيمة الافتراضية |
|----------|-------|-------------------|
| `ANTIGRAVITY_DEBUG` | تفعيل النظام | `true` |
| `ANTIGRAVITY_PORT` | منفذ السيرفر | `7242` |
| `AGENT_RUNID` | معرف الجلسة | `debug-run` |
| `AGENT_HYP` | معرف الفرضية | `H0` |
| `DRY_RUN` | تجربة بدون حقن فعلي | `false` |

## 📚 Integration مع Antigravity AI

### كيفية استخدام Antigravity AI للنظام:

1. **اكتشاف Bug:**
   ```plaintext
   Antigravity AI يحلل الكود ويحدد المشكلة
   ```

2. **توليد Hypotheses:**
   ```plaintext
   Antigravity AI يولد فرضيات متعددة:
   - H1: المشكلة في function X
   - H2: المشكلة في data flow
   - H3: المشكلة في state management
   ```

3. **تحديد نقاط الحقن:**
   ```plaintext
   Antigravity AI يقرر:
   - الملفات التي تحتاج debug
   - الأسطر المحددة
   - نوع الحقن (function-entry, before-return, etc.)
   ```

4. **تشغيل Codemod:**
   ```bash
   AGENT_RUNID=<generated-id> AGENT_HYP=<hypothesis-id> \
   npm run antigravity:inject "<file-pattern>"
   ```

5. **جمع وتحليل:**
   ```plaintext
   Antigravity AI:
   - يجمع logs من .antigravity/debug.log
   - يحلل النتائج
   - يقترح patch
   ```

6. **تنظيف:**
   ```bash
   npm run antigravity:cleanup
   ```

## 🧪 أمثلة عملية

### مثال 1: Debug Component Function
```bash
# 1. شغل السيرفر
npm run antigravity:server

# 2. Antigravity AI يقرر حقن في imageTextFunctions.ts
AGENT_RUNID=test1 AGENT_HYP=H1 \
npm run antigravity:inject "context/editorStoreFunctions/imageTextFunctions.ts"

# 3. شغل التطبيق واستخدم المكون
# 4. Antigravity AI يقرأ logs
curl http://127.0.0.1:7242/logs

# 5. Antigravity AI يحلل ويقترح patch
# 6. نظف
npm run antigravity:cleanup
```

### مثال 2: Debug Multiple Files
```bash
AGENT_RUNID=test2 AGENT_HYP=H2 \
npm run antigravity:inject "context/editorStoreFunctions/*.ts"
```

### مثال 3: Dry Run (تجربة بدون حقن)
```bash
DRY_RUN=true AGENT_RUNID=test3 AGENT_HYP=H3 \
npm run antigravity:inject "context/editorStoreFunctions/*.ts"
```

## 🔍 Troubleshooting

### السيرفر لا يعمل
```bash
# تحقق من المنفذ
lsof -i :7242  # Linux/Mac
netstat -ano | findstr :7242  # Windows

# أو استخدم منفذ آخر
ANTIGRAVITY_PORT=8080 npm run antigravity:server
```

### Logs لا تظهر
- تأكد أن السيرفر يعمل
- تحقق من console للـ errors
- تأكد من أن fetch متاح في البيئة
- تحقق من network requests في browser dev tools

### Cleanup لا يعمل
- تأكد من وجود `globby` في dependencies
- تحقق من file patterns
- راجع console للـ errors

### Codemod لا يعمل
- تأكد من وجود `jscodeshift` في devDependencies
- تحقق من file patterns
- راجع console للـ errors

## 📖 الملفات المرجعية

- `scripts/antigravity-ingest-server.ts` - كود السيرفر
- `scripts/antigravity-codemod.js` - كود الحقن
- `scripts/antigravity-cleanup.js` - كود التنظيف
- `.antigravity/README.md` - دليل الاستخدام
- `.antigravity/antigravity-config.json` - ملف التكوين

## 🎓 الفروقات عن Cursor Debug Mode

| الميزة | Cursor | Antigravity System |
|--------|--------|-------------------|
| التكامل | مدمج في IDE | خارجي، يمكن التحكم فيه |
| التحكم | Cursor يقرر | Antigravity AI يقرر |
| الحقن | تلقائي من Cursor | تلقائي من Antigravity AI |
| التحليل | Cursor يحلل | Antigravity AI يحلل |
| النتيجة | نفس الفكرة | نفس الفكرة |

## ✅ Checklist للاستخدام

- [ ] تشغيل ingest server
- [ ] Antigravity AI يحدد نقاط الحقن
- [ ] حقن debug code
- [ ] تشغيل التطبيق/الاختبارات
- [ ] جمع logs
- [ ] تحليل النتائج
- [ ] اقتراح patch
- [ ] تنظيف debug code
- [ ] التحقق من عدم وجود debug code في git

## 🚀 الخطوات التالية

1. تثبيت dependencies:
   ```bash
   npm install
   ```

2. اختبار النظام:
   ```bash
   npm run antigravity:server
   ```

3. تكوين Antigravity AI لاستخدام النظام

4. البدء في استخدام النظام للـ debugging

---

**ملاحظة:** هذا النظام مصمم خصيصاً لـ Antigravity AI ويجب استخدامه فقط في بيئة development.
