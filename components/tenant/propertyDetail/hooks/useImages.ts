import { useState, useEffect, useCallback } from "react";
import { Property } from "../types/types";

export const useImages = (property: Property | null) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [mainImage, setMainImage] = useState<string>("");
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const getAllImages = useCallback((): string[] => {
    if (!property) return [];
    
    const allImages: string[] = [];
    const seen = new Set<string>();

    if (property.image && property.image.trim() !== "") {
      allImages.push(property.image);
      seen.add(property.image);
    }

    if (property.images) {
      property.images.forEach((img) => {
        if (img && img.trim() !== "" && !seen.has(img)) {
          allImages.push(img);
          seen.add(img);
        }
      });
    }

    if (property.floor_planning_image) {
      property.floor_planning_image.forEach((img) => {
        if (img && img.trim() !== "" && !seen.has(img)) {
          allImages.push(img);
          seen.add(img);
        }
      });
    }

    return allImages;
  }, [property]);

  const handleMainImagePrevious = useCallback(() => {
    const allImages = getAllImages();
    if (allImages.length > 0) {
      setMainImageIndex((currentIndex) => {
        const previousIndex =
          currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
        setMainImage(allImages[previousIndex]);
        return previousIndex;
      });
    }
  }, [getAllImages]);

  const handleMainImageNext = useCallback(() => {
    const allImages = getAllImages();
    if (allImages.length > 0) {
      setMainImageIndex((currentIndex) => {
        const nextIndex =
          currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
        setMainImage(allImages[nextIndex]);
        return nextIndex;
      });
    }
  }, [getAllImages]);

  const handlePreviousImage = useCallback(() => {
    const allImages = getAllImages();
    if (allImages.length > 0) {
      const currentIndex = selectedImageIndex;
      const previousIndex =
        currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
      setSelectedImage(allImages[previousIndex]);
      setSelectedImageIndex(previousIndex);
    }
  }, [getAllImages, selectedImageIndex]);

  const handleNextImage = useCallback(() => {
    const allImages = getAllImages();
    if (allImages.length > 0) {
      const currentIndex = selectedImageIndex;
      const nextIndex =
        currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
      setSelectedImage(allImages[nextIndex]);
      setSelectedImageIndex(nextIndex);
    }
  }, [getAllImages, selectedImageIndex]);

  const handleImageClick = useCallback(
    (imageSrc: string, index?: number) => {
      if (imageSrc && imageSrc.trim() !== "") {
        setSelectedImage(imageSrc);
        setSelectedImageIndex(index || 0);
      }
    },
    [],
  );

  const handleThumbnailClick = useCallback(
    (imageSrc: string, index: number) => {
      const allImages = getAllImages();
      const actualIndex = allImages.findIndex((img) => img === imageSrc);
      if (actualIndex >= 0) {
        setMainImage(imageSrc);
        setMainImageIndex(actualIndex);
      }
      handleImageClick(imageSrc, actualIndex >= 0 ? actualIndex : index);
    },
    [getAllImages, handleImageClick],
  );

  useEffect(() => {
    if (property?.id && property?.image) {
      if (property.id !== propertyId) {
        setPropertyId(property.id);
        setMainImage(property.image);
        const allImages = getAllImages();
        const index = allImages.findIndex((img) => img === property.image);
        setMainImageIndex(index >= 0 ? index : 0);
      } else if (!mainImage) {
        setMainImage(property.image);
        const allImages = getAllImages();
        const index = allImages.findIndex((img) => img === property.image);
        setMainImageIndex(index >= 0 ? index : 0);
      }
    }
  }, [property?.id, property?.image, propertyId, mainImage, getAllImages]);

  const propertyImages = (() => {
    if (!property?.image) return [];
    
    const allImages: string[] = [];
    const seen = new Set<string>();

    if (property.image.trim() !== "") {
      allImages.push(property.image);
      seen.add(property.image);
    }

    if (property.images) {
      property.images.forEach((img) => {
        if (img && img.trim() !== "" && !seen.has(img)) {
          allImages.push(img);
          seen.add(img);
        }
      });
    }

    return allImages;
  })();

  return {
    selectedImage,
    selectedImageIndex,
    mainImage,
    mainImageIndex,
    propertyImages,
    getAllImages,
    handleMainImagePrevious,
    handleMainImageNext,
    handlePreviousImage,
    handleNextImage,
    handleImageClick,
    handleThumbnailClick,
    setSelectedImage,
    setSelectedImageIndex,
  };
};
