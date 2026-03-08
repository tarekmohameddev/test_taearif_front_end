"use client";

import { useProjectData, useProject, useImageGallery } from "./hooks";
import { getProjectImages } from "./utils";
import {
  LoadingSkeleton,
  ErrorDisplay,
  HeroSection,
  MainImageSection,
  GalleryThumbnails,
  DescriptionSection,
  SpecsSection,
  AmenitiesSection,
  VideoSection,
  MapSection,
  RelatedPropertiesSection,
  ImageDialog,
} from "./components";
import type { ProjectDetails2Props } from "./types";

export default function ProjectDetails2(props: ProjectDetails2Props) {
  // Get merged data from store
  const {
    mergedData,
    primaryColor,
    logoImage,
    heroBackgroundType,
    heroImageSrc,
    getHeroBackgroundColor,
    getHeroOverlayColor,
    heroOverlayOpacity,
  } = useProjectData(props);

  // Early return if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Fetch project data
  const { project, loadingProject, projectError, tenantLoading, refetch } =
    useProject(props.projectSlug);

  // Image gallery management
  const {
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
  } = useImageGallery(project);

  // Get project images for gallery
  const projectImages = getProjectImages(project);

  // Show loading skeleton
  if (tenantLoading || loadingProject) {
    return (
      <LoadingSkeleton
        heroHeight={
          typeof mergedData.hero?.height === "number"
            ? `${mergedData.hero.height}px`
            : (mergedData.hero?.height || "500px")
        }
        maxWidth={mergedData.layout?.maxWidth}
      />
    );
  }

  // Show error if no tenant ID
  if (!project && !projectError) {
    return (
      <ErrorDisplay error="لم يتم العثور على معرف الموقع" />
    );
  }

  // Show error if project failed to load
  if (projectError || !project) {
    return <ErrorDisplay error={projectError || "المشروع غير موجود"} onRetry={refetch} />;
  }

  return (
    <main className="w-full" dir="rtl">
      {/* Top Hero Image Section */}
      <HeroSection
        project={project}
        heroHeight={
          typeof mergedData.hero?.height === "number"
            ? `${mergedData.hero.height}px`
            : (mergedData.hero?.height || "500px")
        }
        maxWidth={mergedData.layout?.maxWidth}
        primaryColor={primaryColor}
        heroBackgroundType={heroBackgroundType}
        heroImageSrc={heroImageSrc}
        getHeroBackgroundColor={getHeroBackgroundColor}
        getHeroOverlayColor={getHeroOverlayColor}
        heroOverlayOpacity={heroOverlayOpacity}
      />

      {/* Main Content Container */}
      <div
        className="container mx-auto px-4 pb-12 -mt-[12rem]"
        style={{ maxWidth: mergedData.layout?.maxWidth }}
      >
        {/* Hero Section - Main Image */}
        <MainImageSection
          project={project}
          mainImage={mainImage}
          mainImageIndex={mainImageIndex}
          allImages={allImages}
          logoImage={logoImage}
          primaryColor={primaryColor}
          onImageClick={handleImageClick}
          onPrevious={handleMainImagePrevious}
          onNext={handleMainImageNext}
        />

        {/* Gallery Thumbnails */}
        <GalleryThumbnails
          project={project}
          projectImages={projectImages}
          mainImage={mainImage}
          primaryColor={primaryColor}
          showThumbnails={mergedData.gallery?.showThumbnails}
          onThumbnailClick={handleThumbnailClick}
        />

        {/* Main Grid Layout - Two Columns */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10"
          style={{ gap: mergedData.layout?.gap || "3rem" }}
          dir="rtl"
        >
          {/* Right Column: Description & Specs */}
          <div className="space-y-12">
            {/* Property Description */}
            <DescriptionSection
              description={project.description}
              title={mergedData.content?.descriptionTitle}
              textColor={mergedData.styling?.textColor}
              primaryColor={primaryColor}
              showDescription={mergedData.displaySettings?.showDescription}
            />

            {/* Specs Section */}
            <SpecsSection
              project={project}
              title={mergedData.content?.specsTitle}
              textColor={mergedData.styling?.textColor}
              primaryColor={primaryColor}
              showSpecs={mergedData.displaySettings?.showSpecs}
            />

            {/* Amenities Section */}
            <AmenitiesSection
              project={project}
              textColor={mergedData.styling?.textColor}
              primaryColor={primaryColor}
            />
          </div>

          {/* Left Column: Video & Map */}
          <div className="space-y-12">
            {/* Video */}
            <VideoSection
              project={project}
              showVideoUrl={mergedData.displaySettings?.showVideoUrl}
            />

            {/* Map */}
            <MapSection
              project={project}
              primaryColor={primaryColor}
              showMap={mergedData.displaySettings?.showMap}
            />
          </div>
        </div>

        {/* Related Properties Grid */}
        <RelatedPropertiesSection
          project={project}
          textColor={mergedData.styling?.textColor}
          primaryColor={primaryColor}
        />
      </div>

      {/* Image Dialog */}
      <ImageDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedImage={selectedImage}
        selectedImageIndex={selectedImageIndex}
        allImages={allImages}
        project={project}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
      />
    </main>
  );
}
