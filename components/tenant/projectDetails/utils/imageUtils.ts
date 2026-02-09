import type { Project } from "../types";

// Get all images (main images + floor planning images)
export const getAllImages = (project: Project | null): string[] => {
  if (!project) return [];
  
  const allImages: string[] = [];
  if (project.image) {
    allImages.push(project.image);
  }
  if (project.images) {
    // Filter out the main image if it exists in images array to avoid duplicates
    const additionalImages = project.images.filter(
      (img) => img && img.trim() !== "" && img !== project.image,
    );
    allImages.push(...additionalImages);
  }
  if (project.floorplans) {
    // Filter out the main image if it exists in floor planning images to avoid duplicates
    const floorImages = project.floorplans.filter(
      (img) => img && img.trim() !== "" && img !== project.image,
    );
    allImages.push(...floorImages);
  }
  // Filter out empty images and remove duplicates
  const filtered = allImages.filter((img) => img && img.trim() !== "");
  // Remove duplicates by converting to Set and back to array
  return Array.from(new Set(filtered));
};

// Project images - computed value (includes main images + floor planning images)
export const getProjectImages = (project: Project | null): string[] => {
  if (!project || !project.image) return [];
  
  return [
    project.image,
    // Filter out the main image if it exists in images array to avoid duplicates
    ...(project.images || []).filter(
      (img) => img && img.trim() !== "" && img !== project.image,
    ),
    // Filter out the main image if it exists in floor planning images to avoid duplicates
    ...(project.floorplans || []).filter(
      (img) => img && img.trim() !== "" && img !== project.image,
    ),
  ].filter((img) => img && img.trim() !== "");
};
