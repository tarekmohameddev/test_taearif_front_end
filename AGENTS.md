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

## Summary

| Need | Location |
|------|----------|
| History of changes / how something was implemented | `docs/updates/` |
| Live Editor and Tenant: read before coding | `docs/live-editor/` then `docs/important/liveEditor/` |
| Where to update docs when changing Live Editor logic | `docs/live-editor/` |
