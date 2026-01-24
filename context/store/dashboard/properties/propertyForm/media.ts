import type { PropertyFormStore, Images, Previews } from "./types";
import { initialImages, initialPreviews } from "./initialState";

export const createMediaSlice = (
  set: (partial: Partial<PropertyFormStore>) => void,
  get: () => PropertyFormStore
): Pick<
  PropertyFormStore,
  | "images"
  | "previews"
  | "video"
  | "videoPreview"
  | "setImages"
  | "setPreviews"
  | "setThumbnail"
  | "addGalleryImage"
  | "removeGalleryImage"
  | "addFloorPlan"
  | "removeFloorPlan"
  | "setDeedImage"
  | "setVideo"
  | "setVideoPreview"
  | "removeImage"
> => ({
  images: initialImages,
  previews: initialPreviews,
  video: null,
  videoPreview: null,

  setImages: (images) => {
    const current = get();
    if (typeof images === "function") {
      set({ images: images(current.images) });
    } else {
      set({ images });
    }
  },

  setPreviews: (previews) => {
    const current = get();
    if (typeof previews === "function") {
      set({ previews: previews(current.previews) });
    } else {
      set({ previews });
    }
  },

  setThumbnail: (file, preview) => {
    const current = get();
    set({
      images: {
        ...current.images,
        thumbnail: file,
      },
      previews: {
        ...current.previews,
        thumbnail: preview,
      },
    });
  },

  addGalleryImage: (file, preview) => {
    const current = get();
    set({
      images: {
        ...current.images,
        gallery: [...current.images.gallery, file],
      },
      previews: {
        ...current.previews,
        gallery: [...current.previews.gallery, preview],
      },
    });
  },

  removeGalleryImage: (index) => {
    const current = get();
    const newGallery = current.images.gallery.filter((_, i) => i !== index);
    const newPreviews = current.previews.gallery.filter((_, i) => i !== index);
    set({
      images: {
        ...current.images,
        gallery: newGallery,
      },
      previews: {
        ...current.previews,
        gallery: newPreviews,
      },
    });
  },

  addFloorPlan: (file, preview) => {
    const current = get();
    set({
      images: {
        ...current.images,
        floorPlans: [...current.images.floorPlans, file],
      },
      previews: {
        ...current.previews,
        floorPlans: [...current.previews.floorPlans, preview],
      },
    });
  },

  removeFloorPlan: (index) => {
    const current = get();
    const newFloorPlans = current.images.floorPlans.filter((_, i) => i !== index);
    const newPreviews = current.previews.floorPlans.filter((_, i) => i !== index);
    set({
      images: {
        ...current.images,
        floorPlans: newFloorPlans,
      },
      previews: {
        ...current.previews,
        floorPlans: newPreviews,
      },
    });
  },

  setDeedImage: (file, preview) => {
    const current = get();
    set({
      images: {
        ...current.images,
        deedImage: file,
      },
      previews: {
        ...current.previews,
        deedImage: preview,
      },
    });
  },

  setVideo: (file) => {
    set({ video: file });
  },

  setVideoPreview: (preview) => {
    set({ videoPreview: preview });
  },

  removeImage: (type, index) => {
    const current = get();
    
    if (type === "thumbnail") {
      set({
        images: { ...current.images, thumbnail: null },
        previews: { ...current.previews, thumbnail: null },
      });
    } else if (type === "gallery" && typeof index === "number") {
      current.removeGalleryImage(index);
    } else if (type === "floorPlans" && typeof index === "number") {
      current.removeFloorPlan(index);
    } else if (type === "deedImage") {
      set({
        images: { ...current.images, deedImage: null },
        previews: { ...current.previews, deedImage: null },
      });
    }
  },
});
