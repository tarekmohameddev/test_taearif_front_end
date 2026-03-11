# Tenant static pages store (task 2.3)

## Chosen approach

**Option (a)**: Extract a "static page slice" into a separate lightweight store (`context/tenantStaticPagesStore.ts`) fed from the tenant API.

- **TenantPageWrapper** no longer imports `useEditorStore`. It uses `useTenantStaticPagesStore` for `staticPagesData` and `getStaticPageData` only.
- **Data source**: Tenant fetch (`context/tenantStore/fetchFunctions.js`) populates both `editorStore` (for live editor) and `tenantStaticPagesStore` (for tenant site view) when `fetchTenantData` runs.
- **Live Editor**: Still uses `editorStore` for static pages; save flows are unchanged. Tenant site view reads only from `tenantStaticPagesStore`, so the full editorStore is not required on tenant routes.

## Files

- `context/tenantStaticPagesStore.ts`: Zustand store with `staticPagesData`, `setStaticPageData`, `getStaticPageData`.
- `app/TenantPageWrapper.tsx`: Imports `useTenantStaticPagesStore` instead of `useEditorStore` for page data.
- `context/tenantStore/fetchFunctions.js`: After setting each static page on editorStore, also calls `useTenantStaticPagesStore.getState().setStaticPageData(slug, pageData)`.

## Result

Tenant routes (e.g. `/ar`) no longer pull the full `editorStore` bundle; they only load the small `tenantStaticPagesStore` and the data is filled by the existing tenant fetch.
