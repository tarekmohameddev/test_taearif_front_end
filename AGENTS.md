# Instructions for AI Agents

## Previous changes and updates

- **All previous changes, updates, and implementation notes** are under **`docs/updates/`**.
- Before assuming how something was done or what was changed, **read the relevant file(s) in `docs/updates/`** (by area: dashboard, tenantWebsite, backend-integration, TaearifLandingPages, etc.).

---

## Live Editor and Tenant components

- **Scope:** Any task that touches the **Live Editor** or **Tenant** components.
- **Rule:** Before writing or changing any code, **you must read and follow the documented logic first**.
  - Primary documentation: **`docs/live-editor/`** (this project’s live-editor docs).
  - Additional detail: **`docs/important/liveEditor/`** (architecture, state, sidebar, context, etc.).
- **After changing Live Editor logic:** Update the docs that describe that logic. Prefer updating docs under **`docs/live-editor/`** so they stay the single source of truth for agents.

---

## Component structure: dimensions (padding, height, width, margin, maxWidth, maxHeight)

- **Mandatory:** In `componentsStructure/` (and any new component structure), any field that represents **padding**, **height**, **width**, **margin**, **maxWidth**, or **maxHeight** must use **`type: "number"`** (with a `unit` property, e.g. `"px"`, `"vh"`, `"%"`), **not** `type: "text"`.
- In consuming components, use the shared helper `toDimension(value, unit, fallback)` from `lib/utils.ts` when applying these values to `style` (for backward compatibility with existing string values).

---

## Summary

| Need | Location |
|------|----------|
| History of changes / how something was implemented | `docs/updates/` |
| Live Editor and Tenant: read before coding | `docs/live-editor/` then `docs/important/liveEditor/` |
| Where to update docs when changing Live Editor logic | `docs/live-editor/` |
