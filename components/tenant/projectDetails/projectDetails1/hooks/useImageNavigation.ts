import { useState, useEffect } from "react";
import { Project } from "../types";

/**
 * Hook to manage image navigation and state
 */
export const useImageNavigation = (
  project: Project | null,
  mainImage: string,
  setMainImage: (image: string) => void,
) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Get project images (computed value with duplicate removal)
  const projectImages = (() => {
    if (!project?.image) return [];

    const allImages: string[] = [];
    const seen = new Set<string>();

    // Add main image first
    if (project.image.trim() !== "") {
      allImages.push(project.image);
      seen.add(project.image);
    }

    // Add additional images (excluding duplicates)
    if (project.images) {
      project.images.forEach((img) => {
        if (img && img.trim() !== "" && !seen.has(img)) {
          allImages.push(img);
          seen.add(img);
        }
      });
    }

    return allImages;
  })();

  // Update main image when project loads
  useEffect(() => {
    if (project?.id && project?.image) {
      if (project.id !== projectId) {
        setProjectId(project.id);
        setMainImage(project.image);
        const index = projectImages.findIndex((img) => img === project.image);
        setMainImageIndex(index >= 0 ? index : 0);
      } else if (!mainImage) {
        setMainImage(project.image);
        const index = projectImages.findIndex((img) => img === project.image);
        setMainImageIndex(index >= 0 ? index : 0);
      }
    }
  }, [project?.id, project?.image, projectImages, projectId, mainImage]);

  const handleImageClick = (imageSrc: string, index?: number) => {
    if (imageSrc && imageSrc.trim() !== "") {
      setSelectedImage(imageSrc);
      setSelectedImageIndex(index || 0);
      setIsDialogOpen(true);
    }
  };

  const handleThumbnailClick = (imageSrc: string, index: number) => {
    const actualIndex = projectImages.findIndex((img) => img === imageSrc);
    if (actualIndex >= 0) {
      setMainImage(imageSrc);
      setMainImageIndex(actualIndex);
    }
    handleImageClick(imageSrc, actualIndex >= 0 ? actualIndex : index);
  };

  const handlePreviousImage = () => {
    if (projectImages.length === 0) return;

    const prevIndex =
      selectedImageIndex > 0
        ? selectedImageIndex - 1
        : projectImages.length - 1;

    const prevImage = projectImages[prevIndex];
    if (prevImage && prevImage.trim() !== "") {
      setSelectedImageIndex(prevIndex);
      setSelectedImage(prevImage);
    }
  };

  const handleNextImage = () => {
    if (projectImages.length === 0) return;

    const nextIndex =
      selectedImageIndex < projectImages.length - 1
        ? selectedImageIndex + 1
        : 0;

    const nextImage = projectImages[nextIndex];
    if (nextImage && nextImage.trim() !== "") {
      setSelectedImageIndex(nextIndex);
      setSelectedImage(nextImage);
    }
  };

  const handleMainImagePrevious = () => {
    if (projectImages.length === 0) return;

    setMainImageIndex((currentIndex) => {
      const prevIndex =
        currentIndex > 0 ? currentIndex - 1 : projectImages.length - 1;
      const prevImage = projectImages[prevIndex];
      if (prevImage && prevImage.trim() !== "") {
        setMainImage(prevImage);
        return prevIndex;
      }
      return currentIndex;
    });
  };

  const handleMainImageNext = () => {
    if (projectImages.length === 0) return;

    setMainImageIndex((currentIndex) => {
      const nextIndex =
        currentIndex < projectImages.length - 1 ? currentIndex + 1 : 0;
      const nextImage = projectImages[nextIndex];
      if (nextImage && nextImage.trim() !== "") {
        setMainImage(nextImage);
        return nextIndex;
      }
      return currentIndex;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePreviousImage();
    }
  };

  return {
    projectImages,
    selectedImage,
    selectedImageIndex,
    isDialogOpen,
    setIsDialogOpen,
    mainImage,
    mainImageIndex,
    handleImageClick,
    handleThumbnailClick,
    handlePreviousImage,
    handleNextImage,
    handleMainImagePrevious,
    handleMainImageNext,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    setMainImage,
  };
};
