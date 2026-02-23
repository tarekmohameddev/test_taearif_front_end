import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";
import type { ComponentInstanceWithPosition } from "../../types/types";

// Import all component functions for setData
import { heroFunctions } from "../../../editorStoreFunctions/heroFunctions";
import { heroBannerFunctions } from "../../../editorStoreFunctions/heroBannerFunctions";
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

export const createDatabaseActions = (
  set: StateCreator<EditorStore>["setState"],
  get: StateCreator<EditorStore>["getState"],
): Pick<EditorStore, "loadFromDatabase"> => ({
  loadFromDatabase: (tenantData: any) => {
    if (!tenantData) {
      console.warn("⚠️ loadFromDatabase: tenantData is null or undefined");
      return;
    }

    set((state) => {
      const newState = { ...state };

      // Load global components data
      if (tenantData.globalHeaderData) {
        newState.globalHeaderData = tenantData.globalHeaderData;
      }
      if (tenantData.globalFooterData) {
        newState.globalFooterData = tenantData.globalFooterData;
      }
      if (tenantData.globalComponentsData) {
        newState.globalComponentsData = tenantData.globalComponentsData;
      }

      // Load page components from componentSettings
      if (tenantData.componentSettings) {
        Object.entries(tenantData.componentSettings).forEach(
          ([page, pageSettings]: [string, any]) => {
            if (pageSettings && typeof pageSettings === "object") {
              const pageComponents: ComponentInstanceWithPosition[] = [];

              Object.entries(pageSettings).forEach(
                ([id, comp]: [string, any]) => {
                  if (comp && comp.data && comp.componentName) {
                    const componentType = comp.type || comp.componentName?.replace(/\d+$/, "") || "";
                    const componentId = comp.id || id;

                    // Add to pageComponentsByPage
                    pageComponents.push({
                      id: componentId,
                      type: componentType,
                      name: comp.componentName || componentType,
                      componentName: comp.componentName || componentType,
                      data: comp.data,
                      position: comp.position || pageComponents.length,
                      layout: comp.layout || { row: pageComponents.length, col: 0, span: 2 },
                    });

                    // Load into component type states using setData
                    switch (componentType) {
                      case "hero":
                        Object.assign(newState, heroFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "heroBanner":
                        Object.assign(newState, heroBannerFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "header":
                        Object.assign(newState, headerFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "footer":
                        Object.assign(newState, footerFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "halfTextHalfImage":
                        Object.assign(newState, halfTextHalfImageFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "sideBySide":
                        Object.assign(newState, sideBySideFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "propertySlider":
                        Object.assign(newState, propertySliderFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "ctaValuation":
                        Object.assign(newState, ctaValuationFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "stepsSection":
                        Object.assign(newState, stepsSectionFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "testimonials":
                        Object.assign(newState, testimonialsFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "logosTicker":
                        Object.assign(newState, logosTickerFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "propertiesShowcase":
                        Object.assign(newState, propertiesShowcaseFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "card":
                        if (comp.componentName?.includes("card5") || componentId.includes("card5")) {
                          Object.assign(newState, card5Functions.setData(newState, componentId, comp.data));
                        } else {
                          Object.assign(newState, card4Functions.setData(newState, componentId, comp.data));
                        }
                        break;
                      case "partners":
                        Object.assign(newState, partnersFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "whyChooseUs":
                        Object.assign(newState, whyChooseUsFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "contactMapSection":
                        Object.assign(newState, contactMapSectionFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "grid":
                        Object.assign(newState, gridFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "filterButtons":
                        Object.assign(newState, filterButtonsFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "propertyFilter":
                        Object.assign(newState, propertyFilterFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "mapSection":
                        Object.assign(newState, mapSectionFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "contactCards":
                        Object.assign(newState, contactCardsFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "contactFormSection":
                        Object.assign(newState, contactFormSectionFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "applicationForm":
                        Object.assign(newState, applicationFormFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "jobForm":
                        Object.assign(newState, jobFormFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "inputs":
                        Object.assign(newState, inputsFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "inputs2":
                        Object.assign(newState, inputs2Functions.setData(newState, componentId, comp.data));
                        break;
                      case "imageText":
                        Object.assign(newState, imageTextFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "contactUsHomePage":
                        Object.assign(newState, contactUsHomePageFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "blogsSections":
                        Object.assign(newState, blogsSectionsFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "blogCard":
                        Object.assign(newState, blogCardFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "title":
                        Object.assign(newState, titleFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "responsiveImage":
                        Object.assign(newState, responsiveImageFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "photosGrid":
                        Object.assign(newState, photosGridFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "video":
                        Object.assign(newState, videoFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "projectDetails":
                        Object.assign(newState, projectDetailsFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "propertyDetail":
                        Object.assign(newState, propertyDetailFunctions.setData(newState, componentId, comp.data));
                        break;
                      case "blogDetails":
                        Object.assign(newState, blogDetailsFunctions.setData(newState, componentId, comp.data));
                        break;
                      default:
                        // Fallback to generic componentStates
                        if (!newState.componentStates) {
                          newState.componentStates = {};
                        }
                        if (!newState.componentStates[componentType]) {
                          newState.componentStates[componentType] = {};
                        }
                        newState.componentStates[componentType][componentId] = comp.data;
                        break;
                    }
                  }
                },
              );

              // Set pageComponentsByPage for this page
              if (pageComponents.length > 0) {
                newState.pageComponentsByPage = {
                  ...newState.pageComponentsByPage,
                  [page]: pageComponents,
                };
              }
            }
          },
        );
      }

      return newState;
    });
  },
});
