# React Contexts - جميع الاستدعاءات والعلاقات

## 1. EditorContext (Legacy)

**الموقع**: `context-liveeditor\EditorContext.tsx`

### States الموجودة:

- showDialog (useState)
- openSaveDialogFn (useState)

### Context Definition:

```typescript
const EditorContext = createContext<EditorContextType | undefined>(undefined);
```

**الموقع**: `context-liveeditor\EditorContext.tsx` (line 22)

### Interface:

```typescript
interface EditorContextType {
  requestSave: () => void;
  setOpenSaveDialog: (fn: OpenDialogFn) => void;
}
```

**الموقع**: `context-liveeditor\EditorContext.tsx` (line 17-20)

### States داخل EditorProvider (في EditorContext.tsx):

#### showDialog

```typescript
const [showDialog, setShowDialog] = useState(false);
```

**الموقع**: `context-liveeditor\EditorContext.tsx` (line 28)

```typescript
const requestSave = () => setShowDialog(true);
const closeDialog = () => setShowDialog(false);
```

**الموقع**: `context-liveeditor\EditorContext.tsx` (line 30-31)

```typescript
<SaveConfirmationDialog
  open={showDialog}
  onClose={closeDialog}
  onConfirm={confirmSave}
/>
```

**الموقع**: `context-liveeditor\EditorContext.tsx` (line 51-55)

#### openSaveDialogFn

```typescript
const [openSaveDialogFn, setOpenSaveDialogFn] = useState<OpenDialogFn>(
  () => () => {},
);
```

**الموقع**: `context-liveeditor\EditorContext.tsx` (line 25-27)

```typescript
const handleSetOpenSaveDialog = useCallback((fn: OpenDialogFn) => {
  setOpenSaveDialogFn(() => fn);
}, []);
```

**الموقع**: `context-liveeditor\EditorContext.tsx` (line 39-41)

```typescript
const confirmSave = () => {
  setShowDialog(false);
  openSaveDialogFn(); // تنفيذ دالة الحفظ
  toast.success("Changes saved successfully!"); // عرض رسالة نجاح
};
```

**الموقع**: `context-liveeditor\EditorContext.tsx` (line 33-37)

### Context Provider:

```typescript
export const EditorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // ... states and functions ...

  const value = {
    requestSave,
    setOpenSaveDialog: handleSetOpenSaveDialog,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
      <SaveConfirmationDialog
        open={showDialog}
        onClose={closeDialog}
        onConfirm={confirmSave}
      />
    </EditorContext.Provider>
  );
};
```

**الموقع**: `context-liveeditor\EditorContext.tsx` (line 24-57)

### Hook للاستخدام:

```typescript
export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return context;
}
```

**الموقع**: `context-liveeditor\EditorContext.tsx` (line 60-66)

### الاستدعاءات والاستخدامات:

#### Import Statement

```typescript
// لا يوجد استخدام فعلي لـ EditorContext أو useEditor في الكود الحالي
// هذا Context يعتبر Legacy/Unused
```

**ملاحظة**: EditorContext.tsx موجود في الكود لكن لا يوجد استخدام فعلي له. الـ EditorProvider الجديد في EditorProvider.tsx يستخدم editorStore مباشرة بدلاً من هذا Context.

---

## 2. EditorProvider (Current/Active)

**الموقع**: `context-liveeditor\EditorProvider.tsx`

### الوصف:

EditorProvider الحالي لا يستخدم React Context، بل يستخدم Zustand store (editorStore) مباشرة. هو Provider component فقط لتوفير SaveConfirmationDialog.

### الاستدعاءات والاستخدامات:

#### 1. Import Statement

```typescript
import { EditorProvider } from "@/context-liveeditor/EditorProvider";
```

**المواقع**:

- `app\live-editor\layout.tsx` (line 7)
- `components\live-editor\LiveEditorPage.tsx` (line 7)

#### 2. استخدام EditorProvider في Layout:

```typescript
export default function LiveEditorLayout({
  children,
}: {
  children: ReactNode;
}) {
  // ... code ...

  return (
    <I18nProvider>
      <AuthProvider>
        <EditorProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col" dir="ltr">
            <Toaster position="top-center" reverseOrder={false} />
            <EditorNavBar showArrowTooltip={showArrowTooltip} />
            <main className="flex-1" dir="ltr">
              {children}
            </main>
          </div>
        </EditorProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
```

**الموقع**: `app\live-editor\layout.tsx` (line 3541-3561)

### Implementation Details:

#### EditorProvider Component:

```typescript
export function EditorProvider({ children }: { children: ReactNode }) {
  const { showDialog, closeDialog, openSaveDialogFn } = useEditorStore();
  const { userData } = useAuthStore();
  const tenantId = userData?.username;

  const confirmSave = async () => {
    openSaveDialogFn();
    const state = useEditorStore.getState();
    // ... save logic ...
  };

  return (
    <>
      {children}
      <SaveConfirmationDialog
        open={showDialog}
        isThemeConfirmation={false}
        onClose={closeDialog}
        onConfirm={confirmSave}
      />
    </>
  );
}
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 11-114)

### العلاقات والاعتماديات:

#### EditorProvider يستخدم:

##### 1. useEditorStore (Zustand)

```typescript
import { useEditorStore } from "./editorStore";
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 7)

```typescript
const { showDialog, closeDialog, openSaveDialogFn } = useEditorStore();
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 12)

```typescript
const state = useEditorStore.getState();
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 22)

**States المستخدمة من editorStore**:

- `showDialog` - للتحكم في عرض SaveConfirmationDialog
- `closeDialog` - لإغلاق الـ dialog
- `openSaveDialogFn` - دالة الحفظ الديناميكية
- `state.pageComponentsByPage` - جميع components في الصفحات
- `state.globalComponentsData` - بيانات global header و footer
- `state.globalHeaderVariant` - variant للـ header
- `state.globalFooterVariant` - variant للـ footer
- `state.WebsiteLayout` - بيانات SEO و meta tags
- `state.WebsiteLayout.currentTheme` - الـ theme الحالي
- `state.WebsiteLayout[Theme*Backup]` - backups للـ themes

##### 2. useAuthStore (Zustand)

```typescript
import useAuthStore from "@/context/AuthContext";
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 8)

```typescript
const { userData } = useAuthStore();
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 13)

```typescript
const tenantId = userData?.username;
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 15)

**الغرض**: الحصول على tenantId من userData لإرساله مع payload الحفظ

##### 3. axiosInstance

```typescript
import axiosInstance from "@/lib/axiosInstance";
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 9)

```typescript
await axiosInstance
  .post("/v1/tenant-website/save-pages", payload)
  .then(() => {
    closeDialog();
    toast.success("Changes saved successfully!");
  })
  .catch((e) => {
    console.error("[Save All] Error saving pages:", e);
    closeDialog();
    toast.error(
      e.response?.data?.message || e.message || "Failed to save changes",
    );
  });
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 88-100)

**الغرض**: إرسال البيانات المحفوظة إلى الـ backend

##### 4. SaveConfirmationDialog Component

```typescript
import SaveConfirmationDialog from "@/components/SaveConfirmationDialog";
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 6)

```typescript
<SaveConfirmationDialog
  open={showDialog}
  isThemeConfirmation={false}
  onClose={closeDialog}
  onConfirm={confirmSave}
/>
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 106-111)

**الغرض**: عرض dialog تأكيد الحفظ

##### 5. toast (react-hot-toast)

```typescript
import toast from "react-hot-toast";
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 5)

```typescript
toast.success("Changes saved successfully!");
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 92)

```typescript
toast.error(e.response?.data?.message || e.message || "Failed to save changes");
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 97-99)

**الغرض**: عرض رسائل النجاح/الفشل

### Payload Structure في confirmSave:

```typescript
const payload: any = {
  tenantId: tenantId || "",
  pages: state.pageComponentsByPage,
  globalComponentsData: {
    ...state.globalComponentsData,
    header: {
      ...headerData,
      variant: headerVariant,
    },
    footer: {
      ...footerData,
      variant: footerVariant,
    },
    globalHeaderVariant: headerVariant,
    globalFooterVariant: footerVariant,
  },
  WebsiteLayout: state.WebsiteLayout || {
    metaTags: {
      pages: [],
    },
  },
  ThemesBackup: themesBackup, // إذا كان هناك backups
};
```

**الموقع**: `context-liveeditor\EditorProvider.tsx` (line 36-84)

### Provider Hierarchy:

```
app/live-editor/layout.tsx
│
├─ I18nProvider
│  │  Purpose: i18n translations
│  │  Scope: Entire Live Editor
│  │
│  └─ AuthProvider
│     │  Purpose: User authentication
│     │  Scope: Access control, user data
│     │
│     └─ EditorProvider
│        │  Purpose: Save dialog management
│        │  Scope: Save operations
│        │  Uses: useEditorStore, useAuthStore
│        │
│        └─ [Live Editor Content]
```

**الموقع**: `app\live-editor\layout.tsx` (line 3543-3560)

### ملاحظات مهمة:

1. **EditorProvider لا يوفر Context**: EditorProvider الحالي لا يستخدم React Context API. هو فقط component wrapper يوفر SaveConfirmationDialog ويستخدم Zustand stores مباشرة.

2. **EditorContext.tsx هو Legacy**: EditorContext.tsx موجود في الكود لكن لا يتم استخدامه. الـ EditorProvider الجديد في EditorProvider.tsx يحل محله.

3. **لا يوجد useEditor() hook مستخدم**: Hook `useEditor()` الموجود في EditorContext.tsx لا يتم استدعاؤه في أي مكان في الكود الحالي.

4. **الاعتماد على Zustand**: EditorProvider يعتمد بشكل كامل على Zustand stores (editorStore و useAuthStore) وليس على React Context.

5. **Provider Hierarchy**: EditorProvider موجود في الـ hierarchy بعد I18nProvider و AuthProvider في `app/live-editor/layout.tsx`.

---

## ملخص العلاقات:

### EditorContext (Legacy):

- ❌ **غير مستخدم** في الكود الحالي
- ✅ موجود في `context-liveeditor\EditorContext.tsx`
- ✅ يحتوي على EditorContext و EditorProvider و useEditor hook
- ❌ لا يوجد استدعاءات له في الكود

### EditorProvider (Current):

- ✅ **مستخدم بشكل نشط** في `app/live-editor/layout.tsx`
- ✅ موجود في `context-liveeditor\EditorProvider.tsx`
- ✅ يستخدم Zustand stores (editorStore, useAuthStore)
- ✅ يوفر SaveConfirmationDialog
- ✅ يتعامل مع حفظ البيانات إلى الـ backend
- ✅ جزء من Provider hierarchy: I18nProvider → AuthProvider → EditorProvider

### العلاقات:

- EditorProvider → useEditorStore (للحصول على showDialog, closeDialog, pageComponentsByPage, etc.)
- EditorProvider → useAuthStore (للحصول على userData/tenantId)
- EditorProvider → axiosInstance (لإرسال البيانات إلى الـ backend)
- EditorProvider → SaveConfirmationDialog (لعرض dialog التأكيد)
- EditorProvider → toast (لعرض رسائل النجاح/الفشل)

---

## ملخص شامل:

### EditorContext (Legacy):

- **Status**: ❌ غير مستخدم
- **Location**: `context-liveeditor\EditorContext.tsx`
- **States**: showDialog, openSaveDialogFn
- **Hook**: useEditor()
- **ملاحظة**: موجود في الكود لكن لا يتم استخدامه

### EditorProvider (Current):

- **Status**: ✅ مستخدم بشكل نشط
- **Location**: `context-liveeditor\EditorProvider.tsx`
- **Used in**: `app\live-editor\layout.tsx` (line 3545)
- **Dependencies**: useEditorStore, useAuthStore, axiosInstance, SaveConfirmationDialog, toast
- **Purpose**: إدارة SaveConfirmationDialog وحفظ البيانات إلى الـ backend
- **Provider Hierarchy**: I18nProvider → AuthProvider → EditorProvider

### إحصائيات:

- **إجمالي React Contexts**: 2 contexts
- **Contexts المستخدمة**: 1 (EditorProvider)
- **Contexts غير المستخدمة**: 1 (EditorContext - Legacy)
- **إجمالي الاستدعاءات**: 2+ استدعاء
