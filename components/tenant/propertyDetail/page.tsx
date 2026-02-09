"use client";

import { useMemo } from "react";
import type { propertyDetail2Props } from "./types/types";
import { usePropertyData } from "./hooks/usePropertyData";
import { useImageGallery } from "./hooks/useImageGallery";
import { useContactForm } from "./hooks/useContactForm";
import { useFAQs } from "./hooks/useFAQs";
import { getDarkerColor } from "./utils/helpers";
import { getAllImages } from "./utils/imageUtils";
import {
  TopHeroSection,
  ImageDialog,
  LoadingSkeleton,
  ErrorDisplay,
  MainContentContainer,
} from "./components";

export default function PropertyDetail2(props: propertyDetail2Props) {
  // Get property data and merged data
  const {
    mergedData,
    property,
    loadingProperty,
    propertyError,
    tenantLoading,
    primaryColor,
    tenantData,
    propertyImages,
    finalTenantId,
  } = usePropertyData(props);

  // Image gallery hook
  const {
    selectedImage,
    selectedImageIndex,
    isDialogOpen,
    setIsDialogOpen,
    mainImage,
    mainImageIndex,
    handleImageClick,
    handlePreviousImage,
    handleNextImage,
    handleMainImagePrevious,
    handleMainImageNext,
  } = useImageGallery(property);

  // Contact form hook
  const {
    formData,
    formLoading,
    formError,
    formSuccess,
    handleChange,
    handleSubmit,
  } = useContactForm(finalTenantId, property);

  // FAQs hook
  const { expandedFaqs, toggleFaq } = useFAQs();

  // Computed values
  const allImages = useMemo(() => getAllImages(property), [property]);

  const primaryColorHover = useMemo(
    () => getDarkerColor(primaryColor),
    [primaryColor],
  );

  const textColor =
    mergedData.styling?.textColor ||
    tenantData?.WebsiteLayout?.branding?.colors?.text ||
    "#333333";

  const formBackgroundColor =
    mergedData.styling?.formBackgroundColor ||
    tenantData?.WebsiteLayout?.branding?.colors?.background ||
    "#ffffff";

  const formTextColor =
    mergedData.styling?.formTextColor ||
    tenantData?.WebsiteLayout?.branding?.colors?.text ||
    "#333333";

  const formButtonBackgroundColor =
    mergedData.styling?.formButtonBackgroundColor || primaryColor;

  const formButtonTextColor =
    mergedData.styling?.formButtonTextColor || "#ffffff";

  const maxWidth = mergedData.layout?.maxWidth || "1250px";

  // Loading state
  if (tenantLoading || loadingProperty) {
    return (
      <LoadingSkeleton
        heroHeight={mergedData.hero?.height || "500px"}
        maxWidth={maxWidth}
      />
    );
  }

  // Error state
  if (propertyError || !property) {
    return <ErrorDisplay error={propertyError || "العقار غير موجود"} />;
  }

  return (
    <main className="w-full" dir="rtl">
      {/* Top Hero Section */}
      <TopHeroSection
        property={property}
        primaryColor={primaryColor}
        heroHeight={mergedData.hero?.height || "500px"}
        titleFontSize={
          mergedData.typography?.title?.fontSize?.desktop as string
        }
      />

      {/* Main Content Container */}
      <MainContentContainer
        property={property}
        mergedData={mergedData}
        textColor={textColor}
        primaryColor={primaryColor}
        primaryColorHover={primaryColorHover}
        propertyImages={propertyImages}
        maxWidth={maxWidth}
        mainImage={mainImage}
        mainImageIndex={mainImageIndex}
        allImages={allImages}
        onImageClick={handleImageClick}
        onMainImagePrevious={handleMainImagePrevious}
        onMainImageNext={handleMainImageNext}
        expandedFaqs={expandedFaqs}
        toggleFaq={toggleFaq}
        formData={formData}
        formLoading={formLoading}
        formError={formError}
        formSuccess={formSuccess}
        formBackgroundColor={formBackgroundColor}
        formTextColor={formTextColor}
        formButtonBackgroundColor={formButtonBackgroundColor}
        formButtonTextColor={formButtonTextColor}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      {/* Image Dialog */}
      <ImageDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedImage={selectedImage}
        selectedImageIndex={selectedImageIndex}
        allImages={allImages}
        property={property}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
      />
    </main>
  );
}
