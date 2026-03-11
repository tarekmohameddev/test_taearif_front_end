/**
 * Component groups by section. Import this when you only need section/group
 * mapping without pulling full COMPONENTS or structures.
 */

export const COMPONENT_IDS_BY_SECTION: Record<string, string[]> = {
  homepage: [
    "header",
    "hero",
    "heroBanner",
    "commitmentSection",
    "creativityTriadSection",
    "essenceSection",
    "featuresSection",
    "journeySection",
    "landInvestmentFormSection",
    "philosophyCtaSection",
    "quoteSection",
    "projectsHeader",
    "valuesSection",
    "halfTextHalfImage",
    "sideBySide",
    "propertySlider",
    "ctaValuation",
    "stepsSection",
    "whyChooseUs",
    "testimonials",
    "propertiesShowcase",
    "logosTicker",
    "partners",
    "contactMapSection",
    "footer",
    "grid",
    "filterButtons",
    "propertyFilter",
    "mapSection",
    "contactFormSection",
    "contactCards",
    "jobForm",
    "card",
    "propertiesPage",
    "inputs",
    "inputs2",
    "imageText",
    "contactUsHomePage",
    "blogsSections",
    "blogCard",
    "responsiveImage",
    "title",
    "video",
    "photosGrid",
    "blogDetails",
  ],
  project: ["projectDetails"],
  property: ["propertyDetail"],
};

export const SECTION_IDS = ["homepage", "project", "property"] as const;

export type SectionId = (typeof SECTION_IDS)[number];
