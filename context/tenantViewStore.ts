"use client";

import { create } from "zustand";
import { initialState } from "./tenantStore/storeState";
import { createStoreActions } from "./tenantStore/storeActions";
import { createFetchFunctions } from "./tenantStore/fetchFunctions";

type TenantState = typeof initialState &
  ReturnType<typeof createStoreActions> &
  ReturnType<typeof createFetchFunctions>;

const useTenantViewStore = create<TenantState>((set, get) => ({
  ...initialState,
  // Basic tenant identity & state actions (setTenant, setTenantId, etc.)
  ...createStoreActions(set, get),
  // Fetch tenant data (now decoupled from editorStore for tenant routes)
  ...createFetchFunctions(set, get),
}));

export default useTenantViewStore;

