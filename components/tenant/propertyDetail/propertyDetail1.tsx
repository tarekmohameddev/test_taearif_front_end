"use client";

import { useState, useRef } from "react";
import useTenantStore from "@/context/tenantStore";
import { propertyDetailProps } from "./types/types";
import { useProperty } from "./hooks/useProperty";
import { useImages } from "./hooks/useImages";
import { useWhatsApp } from "./hooks/useWhatsApp";
import { getTransactionTypeLabel } from "./utils/transactionType";
import { getDarkerColor, getLighterColor, hexToFilter } from "./utils/colors";
import { PropertyHeader } from "./components/PropertyHeader";
import { PropertyInfo } from "./components/PropertyInfo";
import { PropertyGallery } from "./components/PropertyGallery";
import { PropertyDetailsGrid } from "./components/PropertyDetailsGrid";
import { PropertyFAQs } from "./components/PropertyFAQs";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ProjectLink } from "./components/ProjectLink";
import { PropertyFloorPlans } from "./components/PropertyFloorPlans";
import { PropertyVideo } from "./components/PropertyVideo";
import { PropertyVirtualTour } from "./components/PropertyVirtualTour";
import { PropertyMap } from "./components/PropertyMap";
import { SimilarProperties } from "./components/SimilarProperties";
import { ImageDialog } from "./components/ImageDialog";
import { ShareDialog } from "./components/ShareDialog";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { ErrorState } from "./components/ErrorState";
import { PropertyInterestCollapsible } from "./components/PropertyInterestCollapsible";
import { fetchPropertyData } from "./services/property.api";

export default function propertyDetail({
  propertySlug,
  whatsApp,
  displaySettings,
  content,
}: propertyDetailProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const {
    property,
    loadingProperty,
    propertyError,
    similarProperties,
    loadingSimilar,
    tenantId,
    tenantLoading,
  } = useProperty(propertySlug);

  const {
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
  } = useImages(property);

  const { tenantData, loadingTenantData } = useTenantStore();

  const logoImage = loadingTenantData
    ? null
    : tenantData?.globalComponentsData?.header?.logo?.image ||
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/logo.png`;

  const primaryColor =
    tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#059669";

  const primaryColorHover = getDarkerColor(primaryColor, 20);
  const primaryColorLight = getLighterColor(primaryColor, 0.2, primaryColor);
  const primaryColorFilter = hexToFilter(primaryColor);

  const whatsAppData = useWhatsApp(tenantData, whatsApp, displaySettings, content);

  const toggleFaq = (faqId: number) => {
    setExpandedFaqs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
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

  const handleImageDialogOpen = (imageSrc: string, index?: number) => {
    handleImageClick(imageSrc, index);
    setIsDialogOpen(true);
  };

  const handleRetry = async () => {
    if (tenantId) {
      const { property: fetchedProperty, error } = await fetchPropertyData(
        tenantId,
        propertySlug,
        false,
      );
      if (fetchedProperty) {
        window.location.reload();
      }
    }
  };

  if (tenantLoading || loadingProperty) {
    return <SkeletonLoader primaryColor={primaryColor} primaryColorLight={primaryColorLight} />;
  }

  if (!tenantId) {
    return <ErrorState type="no-tenant" />;
  }

  if (propertyError || !property) {
    return (
      <ErrorState
        type="property-error"
        message={propertyError || undefined}
        onRetry={handleRetry}
      />
    );
  }

  const transactionTypeLabel = getTransactionTypeLabel(
    property.transactionType,
    property.transactionType_en,
  );

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
          {/* المحتوى الرئيسي */}
          <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
            <div className="flex flex-col gap-y-8 lg:gap-y-10">
              <PropertyHeader
                transactionTypeLabel={transactionTypeLabel}
                primaryColor={primaryColor}
                onShareClick={() => setIsShareDialogOpen(true)}
              />
              <PropertyInfo property={property} />
            </div>
          </div>

          {/* معرض الصور */}
          <PropertyGallery
            property={property}
            mainImage={mainImage}
            mainImageIndex={mainImageIndex}
            propertyImages={propertyImages}
            logoImage={logoImage}
            primaryColor={primaryColor}
            primaryColorFilter={primaryColorFilter}
            getAllImages={getAllImages}
            handleImageClick={handleImageDialogOpen}
            handleThumbnailClick={handleThumbnailClick}
            handleMainImagePrevious={handleMainImagePrevious}
            handleMainImageNext={handleMainImageNext}
          />
        </div>

        {/* القسم السفلي */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأول - المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyDetailsGrid
              property={property}
              transactionTypeLabel={transactionTypeLabel}
              primaryColor={primaryColor}
              primaryColorFilter={primaryColorFilter}
            />

            <WhatsAppButton
              showButton={whatsAppData.showButton}
              phoneNumber={whatsAppData.phoneNumber}
              buttonText={whatsAppData.buttonText}
            />

            {/* Property Interest → Property Request (أنا مهتم بهذا العقار) - collapsible */}
            {displaySettings?.showContactForm !== false && tenantId && property?.id != null && (
              <PropertyInterestCollapsible
                propertyId={Number(property.id)}
                tenantUsername={tenantId}
                primaryColor={primaryColor}
                submitButtonText={content?.submitButtonText || "إرسال الطلب"}
              />
            )}

            <PropertyFAQs
              faqs={property.faqs}
              expandedFaqs={expandedFaqs}
              onToggleFaq={toggleFaq}
            />

            <ProjectLink project={property.project} primaryColor={primaryColor} />
          </div>

          {/* العمود الثاني */}
          <div className="lg:col-span-1 space-y-8">
            <PropertyFloorPlans
              floorPlans={property.floor_planning_image}
              primaryColor={primaryColor}
              onImageClick={handleThumbnailClick}
            />

            <PropertyVideo
              videoUrl={property.video_url || ""}
              videoImage={property.video_image}
              primaryColor={primaryColor}
            />

            <PropertyVirtualTour
              virtualTourUrl={property.virtual_tour || ""}
              primaryColor={primaryColor}
            />

            <PropertyMap
              location={property.location}
              primaryColor={primaryColor}
              primaryColorHover={primaryColorHover}
            />

            <SimilarProperties
              properties={similarProperties}
              loading={loadingSimilar}
              primaryColor={primaryColor}
              primaryColorFilter={primaryColorFilter}
              logoImage={logoImage}
            />
          </div>
        </div>
      </div>

      <ImageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedImage={selectedImage}
        selectedImageIndex={selectedImageIndex}
        property={property}
        getAllImages={getAllImages}
        handlePreviousImage={handlePreviousImage}
        handleNextImage={handleNextImage}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      />

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        property={property}
        primaryColor={primaryColor}
        primaryColorHover={primaryColorHover}
      />

    </section>
  );
}
