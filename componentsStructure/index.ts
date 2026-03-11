/**
 * Barrel for component structures. For a single type or helper, prefer direct imports:
 * - Types: @/componentsStructure/types
 * - Translation: @/componentsStructure/translationHelper
 */
export { heroStructure } from "./hero";
export { heroBannerStructure } from "./heroBanner";
export { commitmentSectionStructure } from "./commitmentSection";
export { creativityTriadSectionStructure } from "./creativityTriadSection";
export { essenceSectionStructure } from "./essenceSection";
export { featuresSectionStructure } from "./featuresSection";
export { journeySectionStructure } from "./journeySection";
export { landInvestmentFormSectionStructure } from "./landInvestmentFormSection";
export { philosophyCtaSectionStructure } from "./philosophyCtaSection";
export { quoteSectionStructure } from "./quoteSection";
export { projectsHeaderStructure } from "./projectsHeader";
export { valuesSectionStructure } from "./valuesSection";
export { headerStructure } from "./header";
export { halfTextHalfImageStructure } from "./halfTextHalfImage";
export { sideBySideStructure } from "./sideBySide";
export { propertySliderStructure } from "./propertySlider";
export { ctaValuationStructure } from "./ctaValuation";
export { stepsSectionStructure } from "./stepsSection";
export { whyChooseUsStructure } from "./whyChooseUs";
export { testimonialsStructure } from "./testimonials";
export { projectDetailsStructure } from "./projectDetails";
export { propertyDetailStructure } from "./propertyDetail";
export { blogDetailsStructure } from "./blogDetails";
export { propertiesShowcaseStructure } from "./propertiesShowcase";
export { cardStructure } from "./card";
export { jobFormStructure } from "./jobForm";
export { logosTickerStructure } from "./logosTicker";
export { partnersStructure } from "./partners";
export { contactMapSectionStructure } from "./contactMapSection";
export { footerStructure } from "./footer";
export { gridStructure } from "./grid";
export { filterButtonsStructure } from "./filterButtons";
export { propertyFilterStructure } from "./propertyFilter";
export { propertiesPageStructure } from "./propertiesPage";
export { imageTextStructure } from "./imageText";
export { contactUsHomePageStructure } from "./contactUsHomePage";
export { blogsSectionsStructure } from "./blogsSections";
export { blogCardStructure } from "./blogCard";
export { mapSectionStructure } from "./mapSection";
export { responsiveImageStructure } from "./responsiveImage";
export { titleStructure } from "./title";
export { photosGridStructure } from "./photosGrid";
export { videoStructure } from "./video";
export type {
  ComponentStructure,
  VariantDefinition,
  FieldDefinition,
} from "./types";

// Export translation helpers
export {
  translateLabel,
  translateOptions,
  translateFieldDefinition,
  translateVariantDefinition,
  translateComponentStructure,
} from "./translationHelper";
