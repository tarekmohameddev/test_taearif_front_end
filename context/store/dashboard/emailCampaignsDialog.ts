import { create } from "zustand";

export interface SelectedTemplateForCampaign {
  id: number;
  subject: string;
  body_html: string;
  body_text?: string;
}

interface EmailCampaignsDialogState {
  createCampaignDialogOpen: boolean;
  selectedTemplateForCampaign: SelectedTemplateForCampaign | null;
  setCreateCampaignDialogOpen: (open: boolean) => void;
  openCreateCampaignDialog: () => void;
  openCreateCampaignWithTemplate: (template: { id: string | number; subject: string; body_html: string; body_text?: string }) => void;
  clearSelectedTemplate: () => void;
}

export const useEmailCampaignsDialogStore = create<EmailCampaignsDialogState>((set) => ({
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
        subject: template.subject,
        body_html: template.body_html,
        body_text: template.body_text,
      },
    }),

  clearSelectedTemplate: () => set({ selectedTemplateForCampaign: null }),
}));
