/**
 * Lightweight store for tenant static page data only.
 * Used by TenantPageWrapper so it does not need to import the full editorStore.
 * Populated by tenant fetch (context/tenantStore/fetchFunctions.js).
 * See docs/updates/performance/compile-deps.md and task 2.3.
 */
import { create } from "zustand";

export type StaticPageEntry = {
  slug: string;
  components: any[];
  apiEndpoints?: Record<string, unknown>;
};

type TenantStaticPagesState = {
  staticPagesData: Record<string, StaticPageEntry>;
  setStaticPageData: (slug: string, data: StaticPageEntry) => void;
  getStaticPageData: (slug: string) => StaticPageEntry | null;
};

export const useTenantStaticPagesStore = create<TenantStaticPagesState>(
  (set, get) => ({
    staticPagesData: {},
    setStaticPageData: (slug, data) =>
      set((state) => ({
        staticPagesData: {
          ...state.staticPagesData,
          [slug]: data,
        },
      })),
    getStaticPageData: (slug) => {
      return get().staticPagesData[slug] ?? null;
    },
  })
);
