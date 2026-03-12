# Prevent Duplicate API Calls — Cursor Prompt

Use this prompt in Cursor AI chat together with the file(s) where API calls are made. It guides the AI to apply the same pattern used in the tenant store so the same API is **not sent twice** (e.g. in the same second or from multiple triggers).

**Reference:** Logic is taken from `docs/important/liveEditor/TENANT_STORE_AND_API.md` (Cache Management / Preventing Duplicate Requests and Data Fetching Flow).

---

## Prompt (copy into chat)

When implementing or reviewing API fetch logic in the attached file(s), apply this pattern so the same API is not sent twice:

1. **Before any fetch, run these checks in order:**
   - **Loading guard:** If a request for this resource is already in progress (e.g. `loading` / `loadingX` flag), return immediately — do not start another request.
   - **Cache / identity guard:** If we already have data for this exact key (e.g. same `websiteName`, same `id`, same query params), return and use existing data — do not refetch.
   - **Last-fetched guard (optional):** If we just fetched this same key (e.g. `lastFetchedX === key`), skip the request to avoid rapid duplicate calls.

2. **When starting a request:**
   - Set loading state to `true` and clear error.
   - Then perform the API call.

3. **On success:**
   - Store the response in state.
   - Set loading to `false` and update the "last fetched" key (e.g. `lastFetchedWebsite`, `lastFetchedId`) so the next call can skip if the key is the same.

4. **On error:**
   - Set loading to `false` and store the error; do not leave loading stuck.

Apply this pattern to the API calls in the file(s) I attached so duplicate requests are avoided.

---

## Example (from TENANT_STORE_AND_API.md)

```typescript
fetchTenantData: async (websiteName) => {
  const state = useTenantStore.getState();

  // CHECK 1: Already loading?
  if (state.loadingTenantData) {
    return;
  }

  // CHECK 2: Already have data for this website?
  if (state.tenantData && state.tenantData.username === websiteName) {
    return;
  }

  // CHECK 3: Same as last fetched?
  if (state.lastFetchedWebsite === websiteName) {
    return;
  }

  set({ loadingTenantData: true, error: null });
  try {
    const response = await axiosInstance.post("/v1/tenant-website/getTenant", { websiteName });
    const data = response.data || {};
    // ... load into stores ...
    set({
      tenantData: data,
      loadingTenantData: false,
      lastFetchedWebsite: websiteName,
    });
  } catch (error) {
    set({ error: error.message, loadingTenantData: false });
  }
};
```

Benefits: avoids duplicate API calls, reduces server load, faster UX, prevents data race conditions.
