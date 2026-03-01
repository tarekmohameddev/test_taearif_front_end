/**
 * Default data for Theme1 Storybook stories.
 * Re-exports and calls existing getDefault*Data from editorStoreFunctions only.
 * No new default logic; used only as args for stories.
 */

import { getDefaultHeaderData } from "@/context/editorStoreFunctions/headerFunctions";
import { getDefaultFooterData } from "@/context/editorStoreFunctions/footerFunctions";
import { getDefaultHeroData, getDefaultHero2Data } from "@/context/editorStoreFunctions/heroFunctions";
import { getDefaultApplicationFormData } from "@/context/editorStoreFunctions/applicationFormFunctions";
import { getDefaultJobFormData } from "@/context/editorStoreFunctions/jobFormFunctions";
import { getDefaultBlogsSectionsData } from "@/context/editorStoreFunctions/blogsSectionsFunctions";
import { getDefaultBlogCardData } from "@/context/editorStoreFunctions/blogCardFunctions";
import { getDefaultContactCardsData } from "@/context/editorStoreFunctions/contactCardsFunctions";
import { getDefaultContactFormSectionData } from "@/context/editorStoreFunctions/contactFormSectionFunctions";
import { getDefaultContactMapSectionData } from "@/context/editorStoreFunctions/contactMapSectionFunctions";
import { getDefaultContactUsHomePageData } from "@/context/editorStoreFunctions/contactUsHomePageFunctions";
import { getDefaultCtaValuationData } from "@/context/editorStoreFunctions/ctaValuationFunctions";
import { getDefaultFilterButtonsData } from "@/context/editorStoreFunctions/filterButtonsFunctions";
import { getDefaultGridData } from "@/context/editorStoreFunctions/gridFunctions";
import {
  getDefaultHalfTextHalfImageData,
  getDefaultHalfTextHalfImage2Data,
  getDefaultHalfTextHalfImage3Data,
} from "@/context/editorStoreFunctions/halfTextHalfImageFunctions";
import {
  getDefaultSideBySideData,
  getDefaultSideBySide2Data,
  getDefaultSideBySide3Data,
} from "@/context/editorStoreFunctions/sideBySideFunctions";
import { getDefaultInputsData } from "@/context/editorStoreFunctions/inputsFunctions";
import { getDefaultInputs2Data } from "@/context/editorStoreFunctions/inputs2Functions";
import { getDefaultPartnersData, getDefaultPartners2Data } from "@/context/editorStoreFunctions/partnersFunctions";
import { getDefaultPhotosGridData } from "@/context/editorStoreFunctions/photosGridFunctions";
import { getDefaultProjectDetailsData } from "@/context/editorStoreFunctions/projectDetailsFunctions";
import { getDefaultPropertyFilterData } from "@/context/editorStoreFunctions/propertyFilterFunctions";
import { getDefaultPropertySliderData } from "@/context/editorStoreFunctions/propertySliderFunctions";
import { getDefaultStepsSectionData } from "@/context/editorStoreFunctions/stepsSectionFunctions";
import { getDefaultTestimonialsData } from "@/context/editorStoreFunctions/testimonialsFunctions";
import { getDefaultWhyChooseUsData } from "@/context/editorStoreFunctions/whyChooseUsFunctions";

type DefaultDataGetter = () => Record<string, unknown>;

const theme1DefaultGetters: Record<string, DefaultDataGetter> = {
  applicationForm1: getDefaultApplicationFormData,
  jobForm1: getDefaultJobFormData,
  blogsSections1: getDefaultBlogsSectionsData,
  blogCard1: getDefaultBlogCardData,
  contactCards1: getDefaultContactCardsData,
  contactFormSection1: getDefaultContactFormSectionData,
  contactMapSection1: getDefaultContactMapSectionData,
  contactUsHomePage1: getDefaultContactUsHomePageData,
  ctaValuation1: getDefaultCtaValuationData,
  filterButtons1: getDefaultFilterButtonsData,
  footer1: getDefaultFooterData,
  grid1: getDefaultGridData,
  halfTextHalfImage1: getDefaultHalfTextHalfImageData,
  halfTextHalfImage2: getDefaultHalfTextHalfImage2Data,
  halfTextHalfImage3: getDefaultHalfTextHalfImage3Data,
  sideBySide1: getDefaultSideBySideData,
  sideBySide2: getDefaultSideBySide2Data,
  sideBySide3: getDefaultSideBySide3Data,
  header1: getDefaultHeaderData,
  hero1: getDefaultHeroData,
  hero2: getDefaultHero2Data,
  inputs1: getDefaultInputsData,
  inputs2: getDefaultInputs2Data,
  partners1: getDefaultPartnersData,
  partners2: getDefaultPartners2Data,
  photosGrid2: getDefaultPhotosGridData,
  projectDetails1: getDefaultProjectDetailsData,
  propertyFilter1: getDefaultPropertyFilterData,
  propertySlider1: getDefaultPropertySliderData,
  stepsSection1: getDefaultStepsSectionData,
  testimonials1: getDefaultTestimonialsData,
  whyChooseUs1: getDefaultWhyChooseUsData,
};

/**
 * Returns default data for a theme1 component by name, or undefined if none.
 */
export function getDefaultDataForTheme1Component(
  componentName: string
): Record<string, unknown> | undefined {
  const getter = theme1DefaultGetters[componentName];
  if (!getter) return undefined;
  return getter() as Record<string, unknown>;
}

export { getDefaultHeaderData, getDefaultFooterData, getDefaultHeroData, getDefaultHero2Data };
