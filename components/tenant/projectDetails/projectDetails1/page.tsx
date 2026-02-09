"use client";

import { useState } from "react";
import { ProjectDetailsProps } from "./types";
import { useProjectStore } from "./hooks/useProjectStore";
import { useProjectData } from "./hooks/useProjectData";
import { useSimilarProjects } from "./hooks/useSimilarProjects";
import { useImageNavigation } from "./hooks/useImageNavigation";
import { useShare } from "./hooks/useShare";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { ErrorStates } from "./components/ErrorStates";
import { ProjectHeader } from "./components/ProjectHeader";
import { ProjectInfo } from "./components/ProjectInfo";
import { ProjectDetailsGrid } from "./components/ProjectDetailsGrid";
import { ProjectGallery } from "./components/ProjectGallery";
import { ProjectFloorplans } from "./components/ProjectFloorplans";
import { ProjectMap } from "./components/ProjectMap";
import { SimilarProjects } from "./components/SimilarProjects";
import { ShareDialog } from "./components/ShareDialog";
import { ImageDialog } from "./components/ImageDialog";

export default function ProjectDetails1(props: ProjectDetailsProps) {
  // Check if we're in Live Editor
  const isLiveEditor =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/live-editor");

  // Store integration
  const { mergedData, primaryColor } = useProjectStore(props);

  // Early return if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Project data
  const {
    project,
    loadingProject,
    projectError,
    mainImage,
    setMainImage,
    tenantLoading,
    refetch,
  } = useProjectData(props.projectSlug, isLiveEditor);

  // Similar projects
  const { similarProjects, loadingSimilar } = useSimilarProjects(
    mergedData.similarProjects?.enabled || false,
    mergedData.similarProjects?.limit || 10,
    isLiveEditor,
  );

  // Image navigation
  const {
    projectImages,
    selectedImage,
    selectedImageIndex,
    isDialogOpen,
    setIsDialogOpen,
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
  } = useImageNavigation(project, mainImage, setMainImage);

  // Share functionality
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const {
    copySuccess,
    shareToFacebook,
    shareToTwitter,
    shareToLinkedIn,
    shareToWhatsApp,
    copyToClipboard,
  } = useShare(project);


  // Loading state
  if (tenantLoading || loadingProject) {
    return <LoadingSkeleton mergedData={mergedData} />;
  }

  // Error states
  if (!project && !loadingProject) {
    return (
      <ErrorStates
        mergedData={mergedData}
        error={projectError}
        onRetry={refetch}
        type="project-error"
      />
    );
  }

  if (!project) {
    return null;
  }

  const handleFloorplanClick = (floorplan: string) => {
    handleImageClick(floorplan, 0);
  };

  return (
    <section
      className="py-12"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor,
        paddingTop: mergedData.layout?.padding?.top,
        paddingBottom: mergedData.layout?.padding?.bottom,
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4"
        style={{ maxWidth: mergedData.layout?.maxWidth }}
      >
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
          {/* المحتوى الرئيسي */}
          <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
            <div className="flex flex-col gap-y-8 lg:gap-y-10">
              <ProjectHeader
                mergedData={mergedData}
                primaryColor={primaryColor}
                onShareClick={() => setIsShareDialogOpen(true)}
              />

              <ProjectInfo
                project={project}
                mergedData={mergedData}
                primaryColor={primaryColor}
              />

              <ProjectDetailsGrid
                project={project}
                mergedData={mergedData}
                primaryColor={primaryColor}
              />
            </div>
          </div>

          {/* معرض الصور */}
          <div className="md:w-1/2 order-1 md:order-2">
            <ProjectGallery
              project={project}
              mergedData={mergedData}
              primaryColor={primaryColor}
              projectImages={projectImages}
              mainImage={mainImage}
              mainImageIndex={mainImageIndex}
              onImageClick={handleImageClick}
              onThumbnailClick={handleThumbnailClick}
              onMainImagePrevious={handleMainImagePrevious}
              onMainImageNext={handleMainImageNext}
            />

            <ProjectFloorplans
              project={project}
              mergedData={mergedData}
              primaryColor={primaryColor}
              onFloorplanClick={handleFloorplanClick}
            />

            <ProjectMap
              project={project}
              mergedData={mergedData}
              primaryColor={primaryColor}
            />
          </div>
        </div>

        {/* القسم السفلي */}
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-8">
          <SimilarProjects
            mergedData={mergedData}
            primaryColor={primaryColor}
            similarProjects={similarProjects}
            loadingSimilar={loadingSimilar}
          />
        </div>
      </div>

      {/* Dialogs */}
      <ImageDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedImage={selectedImage}
        selectedImageIndex={selectedImageIndex}
        projectImages={projectImages}
        project={project}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      <ShareDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        mergedData={mergedData}
        copySuccess={copySuccess}
        onShareFacebook={shareToFacebook}
        onShareTwitter={shareToTwitter}
        onShareLinkedIn={shareToLinkedIn}
        onShareWhatsApp={shareToWhatsApp}
        onCopyLink={copyToClipboard}
      />
    </section>
  );
}
