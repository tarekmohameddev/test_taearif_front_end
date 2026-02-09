import type { Property } from "../types/types";

// Get all images (main images + floor planning images)
export const getAllImages = (property: Property | null): string[] => {
  if (!property) return [];
  
  const allImages = [];
  if (property.image) {
    allImages.push(property.image);
  }
  if (property.images) {
    // Filter out the main image if it exists in images array to avoid duplicates
    const additionalImages = property.images.filter(
      (img) => img && img.trim() !== "" && img !== property.image,
    );
    allImages.push(...additionalImages);
  }
  if (property.floor_planning_image) {
    // Filter out the main image if it exists in floor planning images to avoid duplicates
    const floorImages = property.floor_planning_image.filter(
      (img) => img && img.trim() !== "" && img !== property.image,
    );
    allImages.push(...floorImages);
  }
  // Filter out empty images and remove duplicates
  const filtered = allImages.filter((img) => img && img.trim() !== "");
  // Remove duplicates by converting to Set and back to array
  return Array.from(new Set(filtered));
};

// Get property images for gallery (includes main images + floor planning images)
export const getPropertyImages = (property: Property | null): string[] => {
  if (!property || !property.image) return [];
  
  return [
    property.image,
    // Filter out the main image if it exists in images array to avoid duplicates
    ...(property.images || []).filter(
      (img) => img && img.trim() !== "" && img !== property.image,
    ),
    // Filter out the main image if it exists in floor planning images to avoid duplicates
    ...(property.floor_planning_image || []).filter(
      (img) => img && img.trim() !== "" && img !== property.image,
    ),
  ].filter((img) => img && img.trim() !== "");
};
