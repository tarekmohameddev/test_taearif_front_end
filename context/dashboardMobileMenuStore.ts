import { create } from "zustand";

type DashboardMobileMenuState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

export const useDashboardMobileMenuStore = create<DashboardMobileMenuState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
