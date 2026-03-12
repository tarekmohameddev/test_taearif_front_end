/**
 * Standalone sidebar store for dashboard header/layout.
 * Use this instead of full Store when only sidebarData and fetchSideMenus are needed
 * so dashboard routes don't compile the entire Store (~20 modules).
 */
import { create } from "zustand";
import sidebar from "./store/sidebar";

const useSidebarStore = create((set, get) => ({
  ...sidebar(set, get),
}));

export default useSidebarStore;
