// Helpers to update array fields (slides, gallery) and top-level fields when needed
export const useArrayHelpers = (
  tempData: any,
  setTempData: (data: any) => void,
) => {
  const updateSlides = (newSlides: any[]) => {
    setTempData({ ...tempData, slides: newSlides });
  };

  const updateSlideField = (index: number, key: string, value: any) => {
    const cloned = [...(tempData.slides || [])];
    const current = { ...(cloned[index] || {}) };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (current as any)[key] = value;
    cloned[index] = current;
    updateSlides(cloned);
  };

  const removeSlide = (index: number) => {
    const cloned = [...(tempData.slides || [])];
    cloned.splice(index, 1);
    updateSlides(cloned);
  };

  const updateGallery = (newGallery: string[]) => {
    setTempData({ ...tempData, gallery: newGallery });
  };

  const updateGalleryField = (index: number, value: string) => {
    const cloned = [...(tempData.gallery || [])];
    cloned[index] = value;
    updateGallery(cloned);
  };

  const removeGallery = (index: number) => {
    const cloned = [...(tempData.gallery || [])];
    cloned.splice(index, 1);
    updateGallery(cloned);
  };

  return {
    updateSlides,
    updateSlideField,
    removeSlide,
    updateGallery,
    updateGalleryField,
    removeGallery,
  };
};
