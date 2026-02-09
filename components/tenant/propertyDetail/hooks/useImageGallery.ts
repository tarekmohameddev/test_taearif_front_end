import { useState, useEffect } from "react";
import type { Property } from "../types/types";
import { getAllImages } from "../utils/imageUtils";

export const useImageGallery = (property: Property | null) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  // Update main image when property loads
  useEffect(() => {
    if (property?.image) {
      setMainImage(property.image);
      setMainImageIndex(0);
    }
  }, [property]);

  const allImages = getAllImages(property);

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
    selectedImageIndex,
    isDialogOpen,
    setIsDialogOpen,
    mainImage,
    mainImageIndex,
    allImages,
    handlePreviousImage,
    handleNextImage,
    handleImageClick,
    handleThumbnailClick,
    handleMainImagePrevious,
    handleMainImageNext,
  };
};
