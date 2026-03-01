/**
 * Maps theme1 component names to their variant fields from componentsStructure.
 * Used only by Storybook Theme1 to build merged default + structure data.
 */

import type { ComponentStructure, FieldDefinition } from "@/componentsStructure/types";
import { applicationFormStructure } from "@/componentsStructure/applicationForm";
import { blogCardStructure } from "@/componentsStructure/blogCard";
import { blogsSectionsStructure } from "@/componentsStructure/blogsSections";
import { cardStructure } from "@/componentsStructure/card";
import { contactCardsStructure } from "@/componentsStructure/contactCards";
import { contactFormSectionStructure } from "@/componentsStructure/contactFormSection";
import { contactMapSectionStructure } from "@/componentsStructure/contactMapSection";
import { contactUsHomePageStructure } from "@/componentsStructure/contactUsHomePage";
import { ctaValuationStructure } from "@/componentsStructure/ctaValuation";
import { filterButtonsStructure } from "@/componentsStructure/filterButtons";
import { footerStructure } from "@/componentsStructure/footer";
import { gridStructure } from "@/componentsStructure/grid";
import { halfTextHalfImageStructure } from "@/componentsStructure/halfTextHalfImage";
import { headerStructure } from "@/componentsStructure/header";
import { heroStructure } from "@/componentsStructure/hero";
import { inputsStructure } from "@/componentsStructure/inputs";
import { inputs2Structure } from "@/componentsStructure/inputs2";
import { jobFormStructure } from "@/componentsStructure/jobForm";
import { partnersStructure } from "@/componentsStructure/partners";
import { photosGridStructure } from "@/componentsStructure/photosGrid";
import { projectDetailsStructure } from "@/componentsStructure/projectDetails";
import { propertiesPageStructure } from "@/componentsStructure/propertiesPage";
import { propertyDetailStructure } from "@/componentsStructure/propertyDetail";
import { propertyFilterStructure } from "@/componentsStructure/propertyFilter";
import { propertySliderStructure } from "@/componentsStructure/propertySlider";
import { sideBySideStructure } from "@/componentsStructure/sideBySide";
import { stepsSectionStructure } from "@/componentsStructure/stepsSection";
import { testimonialsStructure } from "@/componentsStructure/testimonials";
import { whyChooseUsStructure } from "@/componentsStructure/whyChooseUs";

function extractBaseName(componentName: string): string {
  const match = componentName.match(/^(.*?)(\d+)$/);
  if (!match) return componentName;
  const base = match[1];
  if (base === "propertyDetail" || base.toLowerCase() === "propertydetail") {
    return "propertyDetail";
  }
  return base;
}

const structureByBaseName: Record<string, ComponentStructure> = {
  applicationForm: applicationFormStructure,
  blogCard: blogCardStructure,
  blogsSections: blogsSectionsStructure,
  card: cardStructure,
  contactCards: contactCardsStructure,
  contactFormSection: contactFormSectionStructure,
  contactMapSection: contactMapSectionStructure,
  contactUsHomePage: contactUsHomePageStructure,
  ctaValuation: ctaValuationStructure,
  filterButtons: filterButtonsStructure,
  footer: footerStructure,
  grid: gridStructure,
  halfTextHalfImage: halfTextHalfImageStructure,
  header: headerStructure,
  hero: heroStructure,
  inputs: inputsStructure,
  inputs2: inputs2Structure,
  jobForm: jobFormStructure,
  partners: partnersStructure,
  photosGrid: photosGridStructure,
  projectDetails: projectDetailsStructure,
  propertiesPage: propertiesPageStructure,
  propertyDetail: propertyDetailStructure,
  propertyFilter: propertyFilterStructure,
  propertySlider: propertySliderStructure,
  sideBySide: sideBySideStructure,
  stepsSection: stepsSectionStructure,
  testimonials: testimonialsStructure,
  whyChooseUs: whyChooseUsStructure,
};

/**
 * Returns the variant fields for a theme1 component name, or null if not found.
 */
export function getFieldsForVariant(componentName: string): FieldDefinition[] | null {
  const baseName = extractBaseName(componentName);
  const structure = structureByBaseName[baseName];
  if (!structure) return null;
  const variant = structure.variants.find((v) => v.id === componentName);
  if (!variant) return null;
  return variant.fields;
}
