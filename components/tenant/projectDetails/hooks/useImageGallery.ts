import { useState, useEffect } from "react";
import { getAllImages } from "../utils";
import type { Project } from "../types";

export const useImageGallery = (project: Project | null) => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [mainImage, setMainImage] = useState<string>("");
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Update main image when project loads
  useEffect(() => {
    if (project?.image) {
      setMainImage(project.image);
      setMainImageIndex(0);
      setSelectedImage(project.image);
    }
  }, [project]);

  // Get all images
  const allImages = getAllImages(project);

  // Navigation functions for dialog
  const handlePreviousImage = () => {
    if (allImages.length > 0) {
      const currentIndex = selectedImageIndex;
      const previousIndex =
        currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
      setSelectedImage(allImages[previousIndex]);
      setSelectedImageIndex(previousIndex);
    }
  };

  const handleNextImage = () => {
    if (allImages.length > 0) {
      const currentIndex = selectedImageIndex;
      const nextIndex =
        currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
      setSelectedImage(allImages[nextIndex]);
      setSelectedImageIndex(nextIndex);
    }
  };

  const handleImageClick = (imageSrc: string, index?: number) => {
    if (imageSrc && imageSrc.trim() !== "") {
      setSelectedImage(imageSrc);
      setSelectedImageIndex(index || 0);
      setIsDialogOpen(true);
    }
  };

  const handleThumbnailClick = (imageSrc: string, index: number) => {
    // Update main image and index when clicking thumbnail
    setMainImage(imageSrc);
    setMainImageIndex(index);
    // Also open dialog
    handleImageClick(imageSrc, index);
  };

  // Navigation functions for main image
  const handleMainImagePrevious = () => {
    if (allImages.length > 0) {
      const currentIndex = mainImageIndex;
      const previousIndex =
        currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
      setMainImage(allImages[previousIndex]);
      setMainImageIndex(previousIndex);
    }
  };

  const handleMainImageNext = () => {
    if (allImages.length > 0) {
      const currentIndex = mainImageIndex;
      const nextIndex =
        currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
      setMainImage(allImages[nextIndex]);
      setMainImageIndex(nextIndex);
    }
  };

  return {
    selectedImage,
    mainImage,
    mainImageIndex,
    selectedImageIndex,
    isDialogOpen,
    setIsDialogOpen,
    allImages,
    handlePreviousImage,
    handleNextImage,
    handleImageClick,
    handleThumbnailClick,
    handleMainImagePrevious,
    handleMainImageNext,
  };
};
