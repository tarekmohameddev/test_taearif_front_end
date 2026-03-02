# Live Editor — Agent rules

## Before any implementation

- **Mandatory:** Before writing or changing any code in the **Live Editor** or **Tenant** components, you **must read the documented logic first**.
- **Where to read:**
  1. This folder: **`docs/live-editor/`** (README and any subfolders/files here).
  2. Full detail: **`docs/important/liveEditor/`** (architecture, state, sidebar, context, data flow, etc.).
- Only after you have read and understood the logic, proceed with implementation.

---

## After changing Live Editor logic

- If you modify the **logic** of the Live Editor (state, data flow, sidebar, stores, Tenant behavior, etc.):
  1. Apply the code changes.
  2. **Update the documentation** that describes that logic.
  3. Prefer updating docs under **`docs/live-editor/`** so this folder stays the single source of truth for agents. If the change is covered by a file in `docs/important/liveEditor/`, update that file as well so both stay in sync.

---

## Component structure: dimensions (padding, height, width, margin, maxWidth, maxHeight)

- **Mandatory:** In component structures (`componentsStructure/`), any field that represents **padding**, **height**, **width**, **margin**, **maxWidth**, or **maxHeight** must use **`type: "number"`** with a **`unit`** (e.g. `"px"`, `"vh"`, `"%"`), **not** `type: "text"`.
- In Tenant components, apply these values via **`toDimension(value, unit, fallback)`** from `lib/utils.ts` when setting `style` (so both number and legacy string values work).

---

## Summary

| Step | Action |
|------|--------|
| Before coding in Live Editor / Tenant | Read logic in `docs/live-editor/` and `docs/important/liveEditor/` |
| After changing Live Editor logic | Update docs in `docs/live-editor/` (and related files in `docs/important/liveEditor/` as needed) |
