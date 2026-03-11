/**
 * Lazy loaders for component structures. Use these to load a structure only when needed
 * (e.g. by componentType) instead of pulling in all structures with ComponentsList.
 */

const STRUCTURE_LOADERS: Record<string, () => Promise<{ default?: unknown; [key: string]: unknown }>> = {
  hero: () => import("@/componentsStructure/hero").then((m) => ({ default: m.heroStructure })),
  heroBanner: () => import("@/componentsStructure/heroBanner").then((m) => ({ default: m.heroBannerStructure })),
  commitmentSection: () => import("@/componentsStructure/commitmentSection").then((m) => ({ default: m.commitmentSectionStructure })),
  creativityTriadSection: () => import("@/componentsStructure/creativityTriadSection").then((m) => ({ default: m.creativityTriadSectionStructure })),
  essenceSection: () => import("@/componentsStructure/essenceSection").then((m) => ({ default: m.essenceSectionStructure })),
  featuresSection: () => import("@/componentsStructure/featuresSection").then((m) => ({ default: m.featuresSectionStructure })),
  journeySection: () => import("@/componentsStructure/journeySection").then((m) => ({ default: m.journeySectionStructure })),
  landInvestmentFormSection: () => import("@/componentsStructure/landInvestmentFormSection").then((m) => ({ default: m.landInvestmentFormSectionStructure })),
  philosophyCtaSection: () => import("@/componentsStructure/philosophyCtaSection").then((m) => ({ default: m.philosophyCtaSectionStructure })),
  quoteSection: () => import("@/componentsStructure/quoteSection").then((m) => ({ default: m.quoteSectionStructure })),
  projectsHeader: () => import("@/componentsStructure/projectsHeader").then((m) => ({ default: m.projectsHeaderStructure })),
  valuesSection: () => import("@/componentsStructure/valuesSection").then((m) => ({ default: m.valuesSectionStructure })),
  header: () => import("@/componentsStructure/header").then((m) => ({ default: m.headerStructure })),
  propertiesShowcase: () => import("@/componentsStructure/propertiesShowcase").then((m) => ({ default: m.propertiesShowcaseStructure })),
  halfTextHalfImage: () => import("@/componentsStructure/halfTextHalfImage").then((m) => ({ default: m.halfTextHalfImageStructure })),
  sideBySide: () => import("@/componentsStructure/sideBySide").then((m) => ({ default: m.sideBySideStructure })),
  propertySlider: () => import("@/componentsStructure/propertySlider").then((m) => ({ default: m.propertySliderStructure })),
  ctaValuation: () => import("@/componentsStructure/ctaValuation").then((m) => ({ default: m.ctaValuationStructure })),
  stepsSection: () => import("@/componentsStructure/stepsSection").then((m) => ({ default: m.stepsSectionStructure })),
  footer: () => import("@/componentsStructure/footer").then((m) => ({ default: m.footerStructure })),
  testimonials: () => import("@/componentsStructure/testimonials").then((m) => ({ default: m.testimonialsStructure })),
  projectDetails: () => import("@/componentsStructure/projectDetails").then((m) => ({ default: m.projectDetailsStructure })),
  propertyDetail: () => import("@/componentsStructure/propertyDetail").then((m) => ({ default: m.propertyDetailStructure })),
  blogDetails: () => import("@/componentsStructure/blogDetails").then((m) => ({ default: m.blogDetailsStructure })),
  logosTicker: () => import("@/componentsStructure/logosTicker").then((m) => ({ default: m.logosTickerStructure })),
  partners: () => import("@/componentsStructure/partners").then((m) => ({ default: m.partnersStructure })),
  contactMapSection: () => import("@/componentsStructure/contactMapSection").then((m) => ({ default: m.contactMapSectionStructure })),
  whyChooseUs: () => import("@/componentsStructure/whyChooseUs").then((m) => ({ default: m.whyChooseUsStructure })),
  grid: () => import("@/componentsStructure/grid").then((m) => ({ default: m.gridStructure })),
  filterButtons: () => import("@/componentsStructure/filterButtons").then((m) => ({ default: m.filterButtonsStructure })),
  propertyFilter: () => import("@/componentsStructure/propertyFilter").then((m) => ({ default: m.propertyFilterStructure })),
  mapSection: () => import("@/componentsStructure/mapSection").then((m) => ({ default: m.mapSectionStructure })),
  contactFormSection: () => import("@/componentsStructure/contactFormSection").then((m) => ({ default: m.contactFormSectionStructure })),
  contactCards: () => import("@/componentsStructure/contactCards").then((m) => ({ default: m.contactCardsStructure })),
  jobForm: () => import("@/componentsStructure/jobForm").then((m) => ({ default: m.jobFormStructure })),
  card: () => import("@/componentsStructure/card").then((m) => ({ default: m.cardStructure })),
  propertiesPage: () => import("@/componentsStructure/propertiesPage").then((m) => ({ default: m.propertiesPageStructure })),
  inputs: () => import("@/componentsStructure/inputs").then((m) => ({ default: m.inputsStructure })),
  inputs2: () => import("@/componentsStructure/inputs2").then((m) => ({ default: m.inputs2Structure })),
  imageText: () => import("@/componentsStructure/imageText").then((m) => ({ default: m.imageTextStructure })),
  contactUsHomePage: () => import("@/componentsStructure/contactUsHomePage").then((m) => ({ default: m.contactUsHomePageStructure })),
  blogsSections: () => import("@/componentsStructure/blogsSections").then((m) => ({ default: m.blogsSectionsStructure })),
  blogCard: () => import("@/componentsStructure/blogCard").then((m) => ({ default: m.blogCardStructure })),
  responsiveImage: () => import("@/componentsStructure/responsiveImage").then((m) => ({ default: m.responsiveImageStructure })),
  title: () => import("@/componentsStructure/title").then((m) => ({ default: m.titleStructure })),
  video: () => import("@/componentsStructure/video").then((m) => ({ default: m.videoStructure })),
  photosGrid: () => import("@/componentsStructure/photosGrid").then((m) => ({ default: m.photosGridStructure })),
};

const structureCache: Record<string, unknown> = {};

/**
 * Load and cache the structure for a component type. Resolves with the structure object.
 * Only the requested component chunk is loaded (e.g. whyChooseUs loads only whyChooseUs.ts).
 */
export async function getComponentStructureAsync(id: string): Promise<unknown> {
  if (structureCache[id] !== undefined) return structureCache[id];
  const loader = STRUCTURE_LOADERS[id];
  if (!loader) return undefined;
  const mod = await loader();
  const structure = (mod as { default?: unknown }).default;
  if (structure !== undefined) structureCache[id] = structure;
  return structure;
}

export function hasStructureLoader(id: string): boolean {
  return id in STRUCTURE_LOADERS;
}

export function getComponentStructureLoaderIds(): string[] {
  return Object.keys(STRUCTURE_LOADERS);
}
