import type { PropertyFormStore } from "./types";
import { initialState } from "./initialState";

export const createUIStateSlice = (
  set: (partial: Partial<PropertyFormStore>) => void,
  get: () => PropertyFormStore
): Pick<
  PropertyFormStore,
  | "activeTab"
  | "isDetailsOpen"
  | "isThumbnailOpen"
  | "isGalleryOpen"
  | "isVideoOpen"
  | "isFloorPlansOpen"
  | "isVirtualTourOpen"
  | "isLocationOpen"
  | "isFaqsOpen"
  | "isOwnerDetailsOpen"
  | "isLoading"
  | "loadingProperty"
  | "uploading"
  | "isCompletingDraft"
  | "submitError"
  | "setActiveTab"
  | "toggleCard"
  | "setIsDetailsOpen"
  | "setIsThumbnailOpen"
  | "setIsGalleryOpen"
  | "setIsVideoOpen"
  | "setIsFloorPlansOpen"
  | "setIsVirtualTourOpen"
  | "setIsLocationOpen"
  | "setIsFaqsOpen"
  | "setIsOwnerDetailsOpen"
  | "setLoading"
  | "setLoadingProperty"
  | "setUploading"
  | "setIsCompletingDraft"
  | "setSubmitError"
> => ({
  activeTab: initialState.activeTab,
  isDetailsOpen: initialState.isDetailsOpen,
  isThumbnailOpen: initialState.isThumbnailOpen,
  isGalleryOpen: initialState.isGalleryOpen,
  isVideoOpen: initialState.isVideoOpen,
  isFloorPlansOpen: initialState.isFloorPlansOpen,
  isVirtualTourOpen: initialState.isVirtualTourOpen,
  isLocationOpen: initialState.isLocationOpen,
  isFaqsOpen: initialState.isFaqsOpen,
  isOwnerDetailsOpen: initialState.isOwnerDetailsOpen,
  isLoading: initialState.isLoading,
  loadingProperty: initialState.loadingProperty,
  uploading: initialState.uploading,
  isCompletingDraft: initialState.isCompletingDraft,
  submitError: initialState.submitError,

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  toggleCard: (cardName) => {
    const current = get();
    const cardStateMap: Record<string, keyof PropertyFormStore> = {
      details: "isDetailsOpen",
      thumbnail: "isThumbnailOpen",
      gallery: "isGalleryOpen",
      video: "isVideoOpen",
      floorPlans: "isFloorPlansOpen",
      virtualTour: "isVirtualTourOpen",
      location: "isLocationOpen",
      faqs: "isFaqsOpen",
      ownerDetails: "isOwnerDetailsOpen",
    };

    const stateKey = cardStateMap[cardName];
    if (stateKey) {
      const currentValue = current[stateKey] as boolean;
      set({ [stateKey]: !currentValue } as any);
    }
  },

  setIsDetailsOpen: (open) => {
    set({ isDetailsOpen: open });
  },

  setIsThumbnailOpen: (open) => {
    set({ isThumbnailOpen: open });
  },

  setIsGalleryOpen: (open) => {
    set({ isGalleryOpen: open });
  },

  setIsVideoOpen: (open) => {
    set({ isVideoOpen: open });
  },

  setIsFloorPlansOpen: (open) => {
    set({ isFloorPlansOpen: open });
  },

  setIsVirtualTourOpen: (open) => {
    set({ isVirtualTourOpen: open });
  },

  setIsLocationOpen: (open) => {
    set({ isLocationOpen: open });
  },

  setIsFaqsOpen: (open) => {
    set({ isFaqsOpen: open });
  },

  setIsOwnerDetailsOpen: (open) => {
    set({ isOwnerDetailsOpen: open });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setLoadingProperty: (loading) => {
    set({ loadingProperty: loading });
  },

  setUploading: (uploading) => {
    set({ uploading });
  },

  setIsCompletingDraft: (isCompleting) => {
    set({ isCompletingDraft: isCompleting });
  },

  setSubmitError: (error) => {
    set({ submitError: error });
  },
});
