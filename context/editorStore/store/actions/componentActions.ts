import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";
import { ComponentData } from "@/lib/types";
import { createDefaultData } from "../../../editorStoreFunctions/types";

// Import all component functions
import { heroFunctions } from "../../../editorStoreFunctions/heroFunctions";
import { heroBannerFunctions } from "../../../editorStoreFunctions/heroBannerFunctions";
import { commitmentSectionFunctions } from "../../../editorStoreFunctions/commitmentSectionFunctions";
import { creativityTriadSectionFunctions } from "../../../editorStoreFunctions/creativityTriadSectionFunctions";
import { essenceSectionFunctions } from "../../../editorStoreFunctions/essenceSectionFunctions";
import { featuresSectionFunctions } from "../../../editorStoreFunctions/featuresSectionFunctions";
import { journeySectionFunctions } from "../../../editorStoreFunctions/journeySectionFunctions";
import { landInvestmentFormSectionFunctions } from "../../../editorStoreFunctions/landInvestmentFormSectionFunctions";
import { philosophyCtaSectionFunctions } from "../../../editorStoreFunctions/philosophyCtaSectionFunctions";
import { quoteSectionFunctions } from "../../../editorStoreFunctions/quoteSectionFunctions";
import { projectsHeaderFunctions } from "../../../editorStoreFunctions/projectsHeaderFunctions";
import { valuesSectionFunctions } from "../../../editorStoreFunctions/valuesSectionFunctions";
import { headerFunctions } from "../../../editorStoreFunctions/headerFunctions";
import { footerFunctions } from "../../../editorStoreFunctions/footerFunctions";
import { halfTextHalfImageFunctions } from "../../../editorStoreFunctions/halfTextHalfImageFunctions";
import { sideBySideFunctions } from "../../../editorStoreFunctions/sideBySideFunctions";
import { propertySliderFunctions } from "../../../editorStoreFunctions/propertySliderFunctions";
import { ctaValuationFunctions } from "../../../editorStoreFunctions/ctaValuationFunctions";
import { stepsSectionFunctions } from "../../../editorStoreFunctions/stepsSectionFunctions";
import { testimonialsFunctions } from "../../../editorStoreFunctions/testimonialsFunctions";
import { logosTickerFunctions } from "../../../editorStoreFunctions/logosTickerFunctions";
import { propertiesShowcaseFunctions } from "../../../editorStoreFunctions/propertiesShowcaseFunctions";
import { card4Functions } from "../../../editorStoreFunctions/card4Functions";
import { card5Functions } from "../../../editorStoreFunctions/card5Functions";
import { partnersFunctions } from "../../../editorStoreFunctions/partnersFunctions";
import { whyChooseUsFunctions } from "../../../editorStoreFunctions/whyChooseUsFunctions";
import { contactMapSectionFunctions } from "../../../editorStoreFunctions/contactMapSectionFunctions";
import { gridFunctions } from "../../../editorStoreFunctions/gridFunctions";
import { filterButtonsFunctions } from "../../../editorStoreFunctions/filterButtonsFunctions";
import { propertyFilterFunctions } from "../../../editorStoreFunctions/propertyFilterFunctions";
import { mapSectionFunctions } from "../../../editorStoreFunctions/mapSectionFunctions";
import { contactCardsFunctions } from "../../../editorStoreFunctions/contactCardsFunctions";
import { contactFormSectionFunctions } from "../../../editorStoreFunctions/contactFormSectionFunctions";
import { applicationFormFunctions } from "../../../editorStoreFunctions/applicationFormFunctions";
import { jobFormFunctions } from "../../../editorStoreFunctions/jobFormFunctions";
import { inputsFunctions } from "../../../editorStoreFunctions/inputsFunctions";
import { inputs2Functions } from "../../../editorStoreFunctions/inputs2Functions";
import { imageTextFunctions } from "../../../editorStoreFunctions/imageTextFunctions";
import { contactUsHomePageFunctions } from "../../../editorStoreFunctions/contactUsHomePageFunctions";
import { blogsSectionsFunctions } from "../../../editorStoreFunctions/blogsSectionsFunctions";
import { blogCardFunctions } from "../../../editorStoreFunctions/blogCardFunctions";
import { responsiveImageFunctions } from "../../../editorStoreFunctions/responsiveImageFunctions";
import { titleFunctions } from "../../../editorStoreFunctions/titleFunctions";
import { photosGridFunctions } from "../../../editorStoreFunctions/photosGridFunctions";
import { videoFunctions } from "../../../editorStoreFunctions/videoFunctions";
import { projectDetailsFunctions } from "../../../editorStoreFunctions/projectDetailsFunctions";
import { propertyDetailFunctions } from "../../../editorStoreFunctions/propertyDetailFunctions";
import { blogDetailsFunctions } from "../../../editorStoreFunctions/blogDetailsFunctions";
import {
  logBefore,
  logAfter,
  logDuring,
} from "@/lib/fileLogger";
import { storeTracker } from "@/lib/debug/live-editor/trackers/storeTracker";
import { eventTracker } from "@/lib/debug/live-editor/trackers/eventTracker";
import { eventFormatter } from "@/lib/debug/live-editor/formatters/eventFormatter";
import { getSessionId, isDebugEnabled } from "@/lib/debug/live-editor/core/config";
import { extractContext } from "@/lib/debug/live-editor/utils/contextUtils";

export const createComponentActions = (
  set: StateCreator<EditorStore>["setState"],
  get: StateCreator<EditorStore>["getState"],
): Pick<
  EditorStore,
  | "getComponentData"
  | "setComponentData"
  | "ensureComponentVariant"
  | "updateComponentByPath"
> => ({
  getComponentData: (componentType: string, variantId: string): ComponentData => {
    const state = get();
    
    // Track getData call from editorStoreFunctions
    if (isDebugEnabled()) {
      const context = extractContext(
        {
          componentType,
          componentId: variantId,
          variantId,
        },
        {
          action: "getData",
          page: typeof window !== "undefined" ? window.location.pathname : "unknown",
        }
      );

      eventTracker.trackEvent(
        eventFormatter.formatEvent({
          eventType: "COMPONENT_UPDATED",
          context,
          details: {
            action: `getData:${componentType}Functions.getData`,
            source: "editorStoreFunctions",
            existingData: state.getComponentData(componentType, variantId) || {},
          },
          before: {
            componentData: state.getComponentData(componentType, variantId) || {},
            storeState: state,
            mergedData: state.getComponentData(componentType, variantId) || {},
          },
        })
      );
    }

    let result: ComponentData;
    switch (componentType) {
      case "hero":
        result = heroFunctions.getData(state, variantId);
        break;
      case "heroBanner":
        result = heroBannerFunctions.getData(state, variantId);
        break;
      case "commitmentSection":
        result = commitmentSectionFunctions.getData(state, variantId);
        break;
      case "creativityTriadSection":
        result = creativityTriadSectionFunctions.getData(state, variantId);
        break;
      case "essenceSection":
        result = essenceSectionFunctions.getData(state, variantId);
        break;
      case "featuresSection":
        result = featuresSectionFunctions.getData(state, variantId);
        break;
      case "journeySection":
        result = journeySectionFunctions.getData(state, variantId);
        break;
      case "landInvestmentFormSection":
        result = landInvestmentFormSectionFunctions.getData(state, variantId);
        break;
      case "philosophyCtaSection":
        result = philosophyCtaSectionFunctions.getData(state, variantId);
        break;
      case "quoteSection":
        result = quoteSectionFunctions.getData(state, variantId);
        break;
      case "projectsHeader":
        result = projectsHeaderFunctions.getData(state, variantId);
        break;
      case "valuesSection":
        result = valuesSectionFunctions.getData(state, variantId);
        break;
      case "header":
        result = headerFunctions.getData(state, variantId);
        break;
      case "footer":
        result = footerFunctions.getData(state, variantId);
        break;
      case "halfTextHalfImage":
        result = halfTextHalfImageFunctions.getData(state, variantId);
        break;
      case "sideBySide":
        result = sideBySideFunctions.getData(state, variantId);
        break;
      case "propertySlider":
        result = propertySliderFunctions.getData(state, variantId);
        break;
      case "ctaValuation":
        result = ctaValuationFunctions.getData(state, variantId);
        break;
      case "stepsSection":
        result = stepsSectionFunctions.getData(state, variantId);
        break;
      case "testimonials":
        result = testimonialsFunctions.getData(state, variantId);
        break;
      case "logosTicker":
        result = logosTickerFunctions.getData(state, variantId);
        break;
      case "propertiesShowcase":
        result = propertiesShowcaseFunctions.getData(state, variantId);
        break;
      case "card":
        // Determine which card variant based on variantId
        if (variantId.includes("card5") || variantId === "card5") {
          result = card5Functions.getData(state, variantId);
        } else {
          result = card4Functions.getData(state, variantId);
        }
        break;
      case "partners":
        result = partnersFunctions.getData(state, variantId);
        break;
      case "whyChooseUs":
        result = whyChooseUsFunctions.getData(state, variantId);
        break;
      case "contactMapSection":
        result = contactMapSectionFunctions.getData(state, variantId);
        break;
      case "grid":
        result = gridFunctions.getData(state, variantId);
        break;
      case "filterButtons":
        result = filterButtonsFunctions.getData(state, variantId);
        break;
      case "propertyFilter":
        result = propertyFilterFunctions.getData(state, variantId);
        break;
      case "mapSection":
        result = mapSectionFunctions.getData(state, variantId);
        break;
      case "contactCards":
        result = contactCardsFunctions.getData(state, variantId);
        break;
      case "contactFormSection":
        result = contactFormSectionFunctions.getData(state, variantId);
        break;
      case "applicationForm":
        result = applicationFormFunctions.getData(state, variantId);
        break;
      case "jobForm":
        result = jobFormFunctions.getData(state, variantId);
        break;
      case "inputs":
        result = inputsFunctions.getData(state, variantId);
        break;
      case "inputs2":
        result = inputs2Functions.getData(state, variantId);
        break;
      case "imageText":
        result = imageTextFunctions.getData(state, variantId);
        break;
      case "contactUsHomePage":
        result = contactUsHomePageFunctions.getData(state, variantId);
        break;
      case "blogsSections":
        result = blogsSectionsFunctions.getData(state, variantId);
        break;
      case "blogCard":
        result = blogCardFunctions.getData(state, variantId);
        break;
      case "title":
        result = titleFunctions.getData(state, variantId);
        break;
      case "responsiveImage":
        result = responsiveImageFunctions.getData(state, variantId);
        break;
      case "photosGrid":
        result = photosGridFunctions.getData(state, variantId);
        break;
      case "video":
        result = videoFunctions.getData(state, variantId);
        break;
      case "projectDetails":
        result = projectDetailsFunctions.getData(state, variantId);
        break;
      case "propertyDetail":
        result = propertyDetailFunctions.getData(state, variantId);
        break;
      case "blogDetails":
        result = blogDetailsFunctions.getData(state, variantId);
        break;
      default:
        result = state.componentStates[componentType]?.[variantId] || {};
    }
    
    // Track getData result
    if (isDebugEnabled()) {
      const context = extractContext(
        {
          componentType,
          componentId: variantId,
          variantId,
        },
        {
          action: "getData_result",
          page: typeof window !== "undefined" ? window.location.pathname : "unknown",
        }
      );

      eventTracker.trackEvent(
        eventFormatter.formatEvent({
          eventType: "COMPONENT_UPDATED",
          context,
          details: {
            action: `getData_result:${componentType}Functions.getData`,
            source: "editorStoreFunctions",
            existingData: result || {},
          },
          after: {
            componentData: result || {},
            storeState: state,
            mergedData: result || {},
          },
        })
      );
    }
    
    return result;
  },

  setComponentData: (
    componentType: string,
    variantId: string,
    data: ComponentData,
  ): void => {
    const state = get();
    const before = state.getComponentData(componentType, variantId);

    // Track setData call from editorStoreFunctions
    if (isDebugEnabled()) {
      const context = extractContext(
        {
          componentType,
          componentId: variantId,
          variantId,
        },
        {
          action: "setData",
          page: typeof window !== "undefined" ? window.location.pathname : "unknown",
        }
      );

      eventTracker.trackEvent(
        eventFormatter.formatEvent({
          eventType: "COMPONENT_UPDATED",
          context,
          details: {
            action: `setData:${componentType}Functions.setData`,
            source: "editorStoreFunctions",
            existingData: before || {},
            finalData: data || {},
          },
          before: {
            componentData: before || {},
            storeState: state,
            mergedData: before || {},
          },
          after: {
            componentData: data || {},
            storeState: state,
            mergedData: data || {},
          },
        })
      );
    }

    // Track store update
    storeTracker.trackUpdate({
      componentType,
      componentId: variantId,
      before,
      after: data,
      operation: "save",
      storeType: "editor",
    });

    switch (componentType) {
      case "hero":
        set(heroFunctions.setData(state, variantId, data));
        break;
      case "heroBanner":
        set(heroBannerFunctions.setData(state, variantId, data));
        break;
      case "commitmentSection":
        set(commitmentSectionFunctions.setData(state, variantId, data));
        break;
      case "creativityTriadSection":
        set(creativityTriadSectionFunctions.setData(state, variantId, data));
        break;
      case "essenceSection":
        set(essenceSectionFunctions.setData(state, variantId, data));
        break;
      case "featuresSection":
        set(featuresSectionFunctions.setData(state, variantId, data));
        break;
      case "journeySection":
        set(journeySectionFunctions.setData(state, variantId, data));
        break;
      case "landInvestmentFormSection":
        set(landInvestmentFormSectionFunctions.setData(state, variantId, data));
        break;
      case "philosophyCtaSection":
        set(philosophyCtaSectionFunctions.setData(state, variantId, data));
        break;
      case "quoteSection":
        set(quoteSectionFunctions.setData(state, variantId, data));
        break;
      case "projectsHeader":
        set(projectsHeaderFunctions.setData(state, variantId, data));
        break;
      case "valuesSection":
        set(valuesSectionFunctions.setData(state, variantId, data));
        break;
      case "header":
        set(headerFunctions.setData(state, variantId, data));
        break;
      case "footer":
        set(footerFunctions.setData(state, variantId, data));
        break;
      case "halfTextHalfImage":
        set(halfTextHalfImageFunctions.setData(state, variantId, data));
        break;
      case "sideBySide":
        set(sideBySideFunctions.setData(state, variantId, data));
        break;
      case "propertySlider":
        set(propertySliderFunctions.setData(state, variantId, data));
        break;
      case "ctaValuation":
        set(ctaValuationFunctions.setData(state, variantId, data));
        break;
      case "stepsSection":
        set(stepsSectionFunctions.setData(state, variantId, data));
        break;
      case "testimonials":
        set(testimonialsFunctions.setData(state, variantId, data));
        break;
      case "logosTicker":
        set(logosTickerFunctions.setData(state, variantId, data));
        break;
      case "propertiesShowcase":
        set(propertiesShowcaseFunctions.setData(state, variantId, data));
        break;
      case "card":
        // Determine which card variant based on variantId
        if (variantId.includes("card5") || variantId === "card5") {
          set(card5Functions.setData(state, variantId, data));
        } else {
          set(card4Functions.setData(state, variantId, data));
        }
        break;
      case "partners":
        set(partnersFunctions.setData(state, variantId, data));
        break;
      case "whyChooseUs":
        set(whyChooseUsFunctions.setData(state, variantId, data));
        break;
      case "contactMapSection":
        set(contactMapSectionFunctions.setData(state, variantId, data));
        break;
      case "grid":
        set(gridFunctions.setData(state, variantId, data));
        break;
      case "filterButtons":
        set(filterButtonsFunctions.setData(state, variantId, data));
        break;
      case "propertyFilter":
        set(propertyFilterFunctions.setData(state, variantId, data));
        break;
      case "mapSection":
        set(mapSectionFunctions.setData(state, variantId, data));
        break;
      case "contactCards":
        set(contactCardsFunctions.setData(state, variantId, data));
        break;
      case "contactFormSection":
        set(contactFormSectionFunctions.setData(state, variantId, data));
        break;
      case "applicationForm":
        set(applicationFormFunctions.setData(state, variantId, data));
        break;
      case "jobForm":
        set(jobFormFunctions.setData(state, variantId, data));
        break;
      case "inputs":
        set(inputsFunctions.setData(state, variantId, data));
        break;
      case "inputs2":
        set(inputs2Functions.setData(state, variantId, data));
        break;
      case "imageText":
        set(imageTextFunctions.setData(state, variantId, data));
        break;
      case "contactUsHomePage":
        set(contactUsHomePageFunctions.setData(state, variantId, data));
        break;
      case "blogsSections":
        set(blogsSectionsFunctions.setData(state, variantId, data));
        break;
      case "blogCard":
        set(blogCardFunctions.setData(state, variantId, data));
        break;
      case "title":
        set(titleFunctions.setData(state, variantId, data));
        break;
      case "responsiveImage":
        set(responsiveImageFunctions.setData(state, variantId, data));
        break;
      case "photosGrid":
        set(photosGridFunctions.setData(state, variantId, data));
        break;
      case "video":
        set(videoFunctions.setData(state, variantId, data));
        break;
      case "projectDetails":
        set(projectDetailsFunctions.setData(state, variantId, data));
        break;
      case "propertyDetail":
        set(propertyDetailFunctions.setData(state, variantId, data));
        break;
      case "blogDetails":
        set(blogDetailsFunctions.setData(state, variantId, data));
        break;
      default:
        // Fallback to generic componentStates
        set((currentState) => ({
          componentStates: {
            ...currentState.componentStates,
            [componentType]: {
              ...(currentState.componentStates[componentType] || {}),
              [variantId]: data,
            },
          },
        }));
    }
  },

  ensureComponentVariant: (
    componentType: string,
    variantId: string,
    initial?: ComponentData,
  ): void => {
    const currentState = get();
    
    // Track ensureVariant call from editorStoreFunctions
    if (isDebugEnabled()) {
      const context = extractContext(
        {
          componentType,
          componentId: variantId,
          variantId,
        },
        {
          action: "ensureVariant",
          page: typeof window !== "undefined" ? window.location.pathname : "unknown",
        }
      );

      const existingData = currentState.getComponentData(componentType, variantId) || {};
      eventTracker.trackEvent(
        eventFormatter.formatEvent({
          eventType: "COMPONENT_UPDATED",
          context,
          details: {
            action: `ensureVariant:${componentType}Functions.ensureVariant`,
            source: "editorStoreFunctions",
            existingData,
            storeData: initial || {},
          },
          before: {
            componentData: existingData,
            storeState: currentState,
            mergedData: existingData,
          },
        })
      );
    }
    
    // ⭐ CRITICAL: Check if variant already exists BEFORE calling set()
    // This prevents unnecessary store updates that can cause infinite loops
    const existingData = (() => {
      switch (componentType) {
        case "hero":
          return currentState.heroStates[variantId];
        case "heroBanner":
          return currentState.heroBannerStates[variantId];
        case "commitmentSection":
          return currentState.commitmentSectionStates[variantId];
        case "creativityTriadSection":
          return currentState.creativityTriadSectionStates[variantId];
        case "essenceSection":
          return currentState.essenceSectionStates[variantId];
        case "featuresSection":
          return currentState.featuresSectionStates[variantId];
        case "journeySection":
          return currentState.journeySectionStates[variantId];
        case "landInvestmentFormSection":
          return currentState.landInvestmentFormSectionStates[variantId];
        case "philosophyCtaSection":
          return currentState.philosophyCtaSectionStates[variantId];
        case "quoteSection":
          return currentState.quoteSectionStates[variantId];
        case "projectsHeader":
          return currentState.projectsHeaderStates[variantId];
        case "valuesSection":
          return currentState.valuesSectionStates[variantId];
        case "header":
          return currentState.headerStates[variantId];
        case "footer":
          return currentState.footerStates[variantId];
        case "halfTextHalfImage":
          return currentState.halfTextHalfImageStates[variantId];
        case "sideBySide":
          return currentState.sideBySideStates[variantId];
        case "propertySlider":
          return currentState.propertySliderStates[variantId];
        case "ctaValuation":
          return currentState.ctaValuationStates[variantId];
        case "stepsSection":
          return currentState.stepsSectionStates[variantId];
        case "testimonials":
          return currentState.testimonialsStates[variantId];
        case "projectDetails":
          return currentState.projectDetailsStates[variantId];
        case "propertyDetail":
          return currentState.propertyDetailStates[variantId];
        case "blogDetails":
          return currentState.blogDetailsStates[variantId];
        case "logosTicker":
          return currentState.logosTickerStates[variantId];
        case "partners":
          return currentState.partnersStates[variantId];
        case "whyChooseUs":
          return currentState.whyChooseUsStates[variantId];
        case "contactMapSection":
          return currentState.contactMapSectionStates[variantId];
        case "grid":
          return currentState.gridStates[variantId];
        case "filterButtons":
          return currentState.filterButtonsStates[variantId];
        case "propertyFilter":
          return currentState.propertyFilterStates[variantId];
        case "mapSection":
          return currentState.mapSectionStates[variantId];
        case "contactCards":
          return currentState.contactCardsStates[variantId];
        case "contactFormSection":
          return currentState.contactFormSectionStates[variantId];
        case "applicationForm":
          return currentState.applicationFormStates[variantId];
        case "jobForm":
          return currentState.jobFormStates[variantId];
        case "inputs":
          return currentState.inputsStates[variantId];
        case "inputs2":
          return currentState.inputs2States[variantId];
        case "imageText":
          return currentState.imageTextStates[variantId];
        case "contactUsHomePage":
          return currentState.contactUsHomePageStates[variantId];
        case "blogsSections":
          return currentState.blogsSectionsStates[variantId];
        case "blogCard":
          return currentState.blogCardStates[variantId];
        case "title":
          return currentState.titleStates[variantId];
        case "responsiveImage":
          return currentState.responsiveImageStates[variantId];
        case "photosGrid":
          return currentState.photosGridStates[variantId];
        case "video":
          return currentState.videoStates[variantId];
        case "propertiesShowcase":
          return currentState.propertiesShowcaseStates[variantId];
        default:
          return currentState.componentStates[componentType]?.[variantId];
      }
    })();

    // ⭐ CRITICAL: Check if we actually need to update
    // If variant already exists and has data, be very conservative about updates
    if (existingData && Object.keys(existingData).length > 0) {
      // If no initial data provided, skip update (variant already exists)
      if (!initial) {
        return; // Don't call set() at all - prevents any store update
      }

      // Initial data provided - but if it's a props object, it changes on every render
      // So we need to be more careful. Only update if initial is clearly different.
      // For props objects, we'll skip the update to prevent infinite loops
      // Components should use setComponentData explicitly if they need to update

      // Check if initial is a props-like object (has common React props)
      const isPropsLike =
        initial &&
        typeof initial === "object" &&
        ("useStore" in initial ||
          "variant" in initial ||
          "id" in initial ||
          "className" in initial ||
          "style" in initial);

      // If it's props-like and data exists, skip update to prevent loops
      // Components should initialize once, then use setComponentData for updates
      if (isPropsLike) {
        return; // Skip update - props change on every render
      }

      // For non-props initial data, do deep comparison
      try {
        const existingDataStr = JSON.stringify(existingData);
        const initialDataStr = JSON.stringify(initial);

        if (existingDataStr === initialDataStr) {
          // Data is the same - skip update to prevent unnecessary re-renders
          return;
        }
      } catch (e) {
        // If JSON.stringify fails (circular refs, etc), skip update to be safe
        // This prevents infinite loops when we can't compare
        return;
      }
    }

    // Only call set() if we actually need to create/update the variant
    set((state) => {
      // Use specific component functions first for better consistency
      let result: any;

      switch (componentType) {
        case "hero":
          result = heroFunctions.ensureVariant(state, variantId, initial);
          break;
        case "heroBanner":
          result = heroBannerFunctions.ensureVariant(state, variantId, initial);
          break;
        case "commitmentSection":
          result = commitmentSectionFunctions.ensureVariant(state, variantId, initial);
          break;
        case "creativityTriadSection":
          result = creativityTriadSectionFunctions.ensureVariant(state, variantId, initial);
          break;
        case "essenceSection":
          result = essenceSectionFunctions.ensureVariant(state, variantId, initial);
          break;
        case "featuresSection":
          result = featuresSectionFunctions.ensureVariant(state, variantId, initial);
          break;
        case "journeySection":
          result = journeySectionFunctions.ensureVariant(state, variantId, initial);
          break;
        case "landInvestmentFormSection":
          result = landInvestmentFormSectionFunctions.ensureVariant(state, variantId, initial);
          break;
        case "philosophyCtaSection":
          result = philosophyCtaSectionFunctions.ensureVariant(state, variantId, initial);
          break;
        case "quoteSection":
          result = quoteSectionFunctions.ensureVariant(state, variantId, initial);
          break;
        case "projectsHeader":
          result = projectsHeaderFunctions.ensureVariant(state, variantId, initial);
          break;
        case "valuesSection":
          result = valuesSectionFunctions.ensureVariant(state, variantId, initial);
          break;
        case "header":
          result = headerFunctions.ensureVariant(state, variantId, initial);
          break;
        case "footer":
          result = footerFunctions.ensureVariant(state, variantId, initial);
          break;
        case "halfTextHalfImage":
          return halfTextHalfImageFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "sideBySide":
          return sideBySideFunctions.ensureVariant(state, variantId, initial);
        case "propertySlider":
          return propertySliderFunctions.ensureVariant(state, variantId, initial);
        case "ctaValuation":
          return ctaValuationFunctions.ensureVariant(state, variantId, initial);
        case "stepsSection":
          return stepsSectionFunctions.ensureVariant(state, variantId, initial);
        case "testimonials":
          return testimonialsFunctions.ensureVariant(state, variantId, initial);
        case "projectDetails":
          return projectDetailsFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "propertyDetail":
          return propertyDetailFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "blogDetails":
          return blogDetailsFunctions.ensureVariant(state, variantId, initial);
        case "logosTicker":
          return logosTickerFunctions.ensureVariant(state, variantId, initial);
        case "partners":
          return partnersFunctions.ensureVariant(state, variantId, initial);
        case "whyChooseUs":
          return whyChooseUsFunctions.ensureVariant(state, variantId, initial);
        case "contactMapSection":
          return contactMapSectionFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "grid":
          return gridFunctions.ensureVariant(state, variantId, initial);
        case "filterButtons":
          return filterButtonsFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "propertyFilter":
          return propertyFilterFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "mapSection":
          return mapSectionFunctions.ensureVariant(state, variantId, initial);
        case "contactCards":
          return contactCardsFunctions.ensureVariant(state, variantId, initial);
        case "contactFormSection":
          return contactFormSectionFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "applicationForm":
          return applicationFormFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "jobForm":
          return jobFormFunctions.ensureVariant(state, variantId, initial);
        case "inputs":
          return inputsFunctions.ensureVariant(state, variantId, initial);
        case "inputs2":
          return inputs2Functions.ensureVariant(state, variantId, initial);
        case "imageText":
          return imageTextFunctions.ensureVariant(state, variantId, initial);
        case "contactUsHomePage":
          return contactUsHomePageFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "blogsSections":
          return blogsSectionsFunctions.ensureVariant(state, variantId, initial);
        case "blogCard":
          return blogCardFunctions.ensureVariant(state, variantId, initial);
        case "title":
          return titleFunctions.ensureVariant(state, variantId, initial);
        case "responsiveImage":
          return responsiveImageFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "photosGrid":
          return photosGridFunctions.ensureVariant(state, variantId, initial);
        case "video":
          return videoFunctions.ensureVariant(state, variantId, initial);
        case "propertiesShowcase":
          return propertiesShowcaseFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "card":
          // Determine which card variant based on variantId
          if (variantId.includes("card5") || variantId === "card5") {
            return card5Functions.ensureVariant(state, variantId, initial);
          }
          return card4Functions.ensureVariant(state, variantId, initial);
        default:
          // Fallback to generic component handling
          if (!state.componentStates[componentType]) {
            state.componentStates[componentType] = {};
          }

          if (
            state.componentStates[componentType][variantId] &&
            Object.keys(state.componentStates[componentType][variantId])
              .length > 0
          ) {
            return {} as any;
          }

          const fallbackDefaultData = createDefaultData(componentType);
          const fallbackData: ComponentData = initial || fallbackDefaultData;

          return {
            componentStates: {
              ...state.componentStates,
              [componentType]: {
                ...state.componentStates[componentType],
                [variantId]: fallbackData,
              },
            },
          } as any;
      }

      // ⭐ CRITICAL: If result is empty object (no changes), return state unchanged
      // This prevents Zustand from triggering unnecessary updates
      if (
        !result ||
        (typeof result === "object" && Object.keys(result).length === 0)
      ) {
        return {} as any;
      }

      return result;
    });
  },

  updateComponentByPath: (
    componentType: string,
    variantId: string,
    path: string,
    value: any,
  ): void => {
    const state = get();
    const before = state.getComponentData(componentType, variantId);

    // Track updateByPath call from editorStoreFunctions
    if (isDebugEnabled()) {
      const context = extractContext(
        {
          componentType,
          componentId: variantId,
          variantId,
        },
        {
          action: "updateByPath",
          page: typeof window !== "undefined" ? window.location.pathname : "unknown",
        }
      );

      eventTracker.trackEvent(
        eventFormatter.formatEvent({
          eventType: "COMPONENT_UPDATED",
          context,
          details: {
            action: `updateByPath:${componentType}Functions.updateByPath`,
            source: "editorStoreFunctions",
            field: {
              path,
              oldValue: before,
              newValue: value,
              type: typeof value,
            },
            existingData: before || {},
          },
          before: {
            componentData: before || {},
            storeState: state,
            mergedData: before || {},
          },
        })
      );
    }

    // Track store update
    if (isDebugEnabled()) {
      storeTracker.trackUpdate({
        componentType,
        componentId: variantId,
        before,
        after: before, // Will be updated after set()
        operation: "update",
        storeType: "editor",
        path,
      });
    }

    switch (componentType) {
      case "hero":
        set(heroFunctions.updateByPath(state, variantId, path, value));
        break;
      case "heroBanner":
        set(heroBannerFunctions.updateByPath(state, variantId, path, value));
        break;
      case "commitmentSection":
        set(commitmentSectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "creativityTriadSection":
        set(creativityTriadSectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "essenceSection":
        set(essenceSectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "featuresSection":
        set(featuresSectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "journeySection":
        set(journeySectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "landInvestmentFormSection":
        set(landInvestmentFormSectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "philosophyCtaSection":
        set(philosophyCtaSectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "quoteSection":
        set(quoteSectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "projectsHeader":
        set(projectsHeaderFunctions.updateByPath(state, variantId, path, value));
        break;
      case "valuesSection":
        set(valuesSectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "header":
        set(headerFunctions.updateByPath(state, variantId, path, value));
        break;
      case "footer":
        set(footerFunctions.updateByPath(state, variantId, path, value));
        break;
      case "halfTextHalfImage":
        set(
          halfTextHalfImageFunctions.updateByPath(state, variantId, path, value),
        );
        break;
      case "sideBySide":
        set(sideBySideFunctions.updateByPath(state, variantId, path, value));
        break;
      case "propertySlider":
        set(
          propertySliderFunctions.updateByPath(state, variantId, path, value),
        );
        break;
      case "ctaValuation":
        set(ctaValuationFunctions.updateByPath(state, variantId, path, value));
        break;
      case "stepsSection":
        set(stepsSectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "testimonials":
        set(testimonialsFunctions.updateByPath(state, variantId, path, value));
        break;
      case "logosTicker":
        set(logosTickerFunctions.updateByPath(state, variantId, path, value));
        break;
      case "propertiesShowcase":
        set(
          propertiesShowcaseFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          ),
        );
        break;
      case "card":
        // Determine which card variant based on variantId
        if (variantId.includes("card5") || variantId === "card5") {
          set(card5Functions.updateByPath(state, variantId, path, value));
        } else {
          set(card4Functions.updateByPath(state, variantId, path, value));
        }
        break;
      case "partners":
        set(partnersFunctions.updateByPath(state, variantId, path, value));
        break;
      case "whyChooseUs":
        set(whyChooseUsFunctions.updateByPath(state, variantId, path, value));
        break;
      case "contactMapSection":
        set(
          contactMapSectionFunctions.updateByPath(state, variantId, path, value),
        );
        break;
      case "grid":
        set(gridFunctions.updateByPath(state, variantId, path, value));
        break;
      case "filterButtons":
        set(
          filterButtonsFunctions.updateByPath(state, variantId, path, value),
        );
        break;
      case "propertyFilter":
        set(
          propertyFilterFunctions.updateByPath(state, variantId, path, value),
        );
        break;
      case "mapSection":
        set(mapSectionFunctions.updateByPath(state, variantId, path, value));
        break;
      case "contactCards":
        set(contactCardsFunctions.updateByPath(state, variantId, path, value));
        break;
      case "contactFormSection":
        set(
          contactFormSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          ),
        );
        break;
      case "applicationForm":
        set(
          applicationFormFunctions.updateByPath(state, variantId, path, value),
        );
        break;
      case "jobForm":
        set(jobFormFunctions.updateByPath(state, variantId, path, value));
        break;
      case "inputs":
        set(inputsFunctions.updateByPath(state, variantId, path, value));
        break;
      case "inputs2":
        set(inputs2Functions.updateByPath(state, variantId, path, value));
        break;
      case "imageText":
        set(imageTextFunctions.updateByPath(state, variantId, path, value));
        break;
      case "contactUsHomePage":
        set(
          contactUsHomePageFunctions.updateByPath(state, variantId, path, value),
        );
        break;
      case "blogsSections":
        set(blogsSectionsFunctions.updateByPath(state, variantId, path, value));
        break;
      case "blogCard":
        set(blogCardFunctions.updateByPath(state, variantId, path, value));
        break;
      case "title":
        set(titleFunctions.updateByPath(state, variantId, path, value));
        break;
      case "responsiveImage":
        set(
          responsiveImageFunctions.updateByPath(state, variantId, path, value),
        );
        break;
      case "photosGrid":
        set(photosGridFunctions.updateByPath(state, variantId, path, value));
        break;
      case "video":
        set(videoFunctions.updateByPath(state, variantId, path, value));
        break;
      case "projectDetails":
        set(
          projectDetailsFunctions.updateByPath(state, variantId, path, value),
        );
        break;
      case "propertyDetail":
        set(
          propertyDetailFunctions.updateByPath(state, variantId, path, value),
        );
        break;
      case "blogDetails":
        set(blogDetailsFunctions.updateByPath(state, variantId, path, value));
        break;
      default:
        // Fallback to generic componentStates
        set((currentState) => {
          const componentState =
            currentState.componentStates[componentType]?.[variantId] || {};
          const updatedState = { ...componentState };
          const segments = path.split(".");
          let cursor: any = updatedState;

          for (let i = 0; i < segments.length - 1; i++) {
            const key = segments[i]!;
            if (!cursor[key]) {
              cursor[key] = {};
            } else if (typeof cursor[key] !== "object") {
              cursor[key] = {};
            }
            cursor = cursor[key];
          }

          const lastKey = segments[segments.length - 1]!;
          cursor[lastKey] = value;

          const newState = {
            componentStates: {
              ...currentState.componentStates,
              [componentType]: {
                ...(currentState.componentStates[componentType] || {}),
                [variantId]: updatedState,
              },
            },
          };

          // Track store update after set
          if (isDebugEnabled()) {
            const after = newState.componentStates[componentType]?.[variantId];
            storeTracker.trackUpdate({
              componentType,
              componentId: variantId,
              before,
              after,
              operation: "update",
              storeType: "editor",
              path,
            });
          }

          return newState;
        });
    }
  },
});
