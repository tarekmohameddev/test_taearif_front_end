# Live Editor — documentation

This folder is the **canonical place for Live Editor logic and documentation**. It is intended to stay minimal and clear: subfolders and files here describe how the Live Editor and related Tenant behavior work.

---

## For agents

- Before any work on the Live Editor or Tenant components, **read the logic here and in `docs/important/liveEditor/`** (see **`docs/live-editor/AGENTS.md`**).
- When you change Live Editor logic, **update the docs in this folder** (and in `docs/important/liveEditor/` where relevant).

---

## Where to read

| Purpose | Location |
|--------|----------|
| Agent rules (read first, update after logic changes) | `docs/live-editor/AGENTS.md` |
| **Component Structure: `condition`** (شرط إظهار/إخفاء الحقول) | `docs/live-editor/componentsStructure/components-structure-condition.md` |
| Full Live Editor docs (architecture, state, sidebar, context) | `docs/important/liveEditor/` |
| Quick start and core concepts | `docs/important/liveEditor/QUICK_START.md`, `CORE_CONCEPTS.md` |
| Component architecture | `docs/important/liveEditor/COMPONENT_ARCHITECTURE.md` |
| State management | `docs/important/liveEditor/STATE_MANAGEMENT.md` |
| Editor sidebar | `docs/important/liveEditor/editorSidebar/` |
| Context and stores | `docs/important/liveEditor/context/` |

---

## Structure of this folder

```
docs/live-editor/
├── AGENTS.md
├── README.md
├── componentsStructure/       ← تعريفات وشروحات Component Structure
│   └── components-structure-condition.md
├── editorFunctions/          ← دوال ومنطق الـ Live Editor
├── TenantComponents/         ← مكونات Tenant المرتبطة بالمحرر
├── editorSidebar/            ← الشريط الجانبي الأيمن (التحرير)
│   └── dynamic-fields/       ← نظام الحقول الديناميكية
├── leftSidebar/              ← الشريط الجانبي الأيسر (Components Sidebar)
│   ├── components/           ← Tab: قائمة المكونات
│   ├── branding/             ← Tab: البراندينغ
│   ├── theme1/               ← Tab: الثيم 1
│   ├── theme2/               ← Tab: الثيم 2
│   └── theme3/               ← Tab: الثيم 3
└── editor-header/            ← هيدر الـ Live Editor (أعلى الشاشة)
```

- Detailed reference material remains in **`docs/important/liveEditor/`**; this folder is the entry point and the place to keep agent-facing and high-level logic docs up to date.
