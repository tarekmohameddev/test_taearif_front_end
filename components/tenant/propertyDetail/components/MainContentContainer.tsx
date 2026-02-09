import type { Property } from "../types/types";
import type { propertyDetail2Props } from "../types/types";
import {
  HeroSection,
  GalleryThumbnails,
  DescriptionSection,
  SpecsSection,
  VideoSection,
  VirtualTourSection,
  MapSection,
  FAQsSection,
  WhatsAppButton,
  ProjectLink,
  ContactFormSection,
} from "./";

interface MainContentContainerProps {
  property: Property | null;
  mergedData: any;
  textColor: string;
  primaryColor: string;
  primaryColorHover: string;
  propertyImages: string[];
  maxWidth: string;
  mainImage: string;
  mainImageIndex: number;
  allImages: string[];
  onImageClick: (imageSrc: string, index: number) => void;
  onMainImagePrevious: () => void;
  onMainImageNext: () => void;
  expandedFaqs: Set<number>;
  toggleFaq: (faqId: number) => void;
  formData: {
    name: string;
    phone: string;
    email: string;
    message: string;
  };
  formLoading: boolean;
  formError: string | null;
  formSuccess: boolean;
  formBackgroundColor: string;
  formTextColor: string;
  formButtonBackgroundColor: string;
  formButtonTextColor: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const MainContentContainer = ({
  property,
  mergedData,
  textColor,
  primaryColor,
  primaryColorHover,
  propertyImages,
  maxWidth,
  mainImage,
  mainImageIndex,
  allImages,
  onImageClick,
  onMainImagePrevious,
  onMainImageNext,
  expandedFaqs,
  toggleFaq,
  formData,
  formLoading,
  formError,
  formSuccess,
  formBackgroundColor,
  formTextColor,
  formButtonBackgroundColor,
  formButtonTextColor,
  handleChange,
  handleSubmit,
}: MainContentContainerProps) => {
  if (!property) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12" style={{ maxWidth }}>
      <HeroSection
        property={property}
        mainImage={mainImage}
        mainImageIndex={mainImageIndex}
        allImages={allImages}
        onImageClick={onImageClick}
        onPrevious={onMainImagePrevious}
        onNext={onMainImageNext}
      />

      <GalleryThumbnails
        property={property}
        propertyImages={propertyImages}
        mainImage={mainImage}
        primaryColor={primaryColor}
        onThumbnailClick={onImageClick}
        showThumbnails={mergedData.gallery?.showThumbnails !== false}
      />

      <DescriptionSection
        property={property}
        title={mergedData.content?.descriptionTitle}
        textColor={textColor}
        showDescription={mergedData.displaySettings?.showDescription !== false}
      />

      <SpecsSection
        property={property}
        textColor={textColor}
        specsTitle={mergedData.content?.specsTitle}
        showSpecs={mergedData.displaySettings?.showSpecs !== false}
      />

      <WhatsAppButton
        showButton={mergedData.whatsApp?.showButton}
        phoneNumber={mergedData.whatsApp?.phoneNumber}
        buttonText={mergedData.whatsApp?.buttonText}
      />

      <FAQsSection
        property={property}
        expandedFaqs={expandedFaqs}
        toggleFaq={toggleFaq}
        textColor={textColor}
        primaryColor={primaryColor}
      />

      <ProjectLink
        property={property}
        textColor={textColor}
        primaryColor={primaryColor}
      />

      <VideoSection
        property={property}
        primaryColor={primaryColor}
        showVideoUrl={mergedData.displaySettings?.showVideoUrl !== false}
      />

      <VirtualTourSection property={property} />

      <MapSection
        property={property}
        primaryColor={primaryColor}
        primaryColorHover={primaryColorHover}
        showMap={mergedData.displaySettings?.showMap !== false}
      />

      <ContactFormSection
        property={property}
        formData={formData}
        formLoading={formLoading}
        formError={formError}
        formSuccess={formSuccess}
        formBackgroundColor={formBackgroundColor}
        formTextColor={formTextColor}
        formButtonBackgroundColor={formButtonBackgroundColor}
        formButtonTextColor={formButtonTextColor}
        primaryColorHover={primaryColorHover}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        title={mergedData.content?.contactFormTitle}
        description={mergedData.content?.contactFormDescription}
        submitButtonText={mergedData.content?.submitButtonText}
        showForm={mergedData.displaySettings?.showContactForm !== false}
      />
    </div>
  );
};
