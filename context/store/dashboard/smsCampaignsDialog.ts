import { create } from "zustand";

export interface SelectedTemplateForCampaign {
  id: number;
  content: string;
}

interface SmsCampaignsDialogState {
  createCampaignDialogOpen: boolean;
  selectedTemplateForCampaign: SelectedTemplateForCampaign | null;
  setCreateCampaignDialogOpen: (open: boolean) => void;
  openCreateCampaignDialog: () => void;
  openCreateCampaignWithTemplate: (template: { id: string | number; content: string }) => void;
  clearSelectedTemplate: () => void;
}

export const useSmsCampaignsDialogStore = create<SmsCampaignsDialogState>((set) => ({
  createCampaignDialogOpen: false,
  selectedTemplateForCampaign: null,

  setCreateCampaignDialogOpen: (open) =>
    set((state) => ({
      createCampaignDialogOpen: open,
      ...(open ? {} : { selectedTemplateForCampaign: null }),
    })),

  openCreateCampaignDialog: () =>
    set({ createCampaignDialogOpen: true, selectedTemplateForCampaign: null }),

  openCreateCampaignWithTemplate: (template) =>
    set({
      createCampaignDialogOpen: true,
      selectedTemplateForCampaign: {
        id: Number(template.id),
        content: template.content,
      },
    }),

  clearSelectedTemplate: () => set({ selectedTemplateForCampaign: null }),
}));
