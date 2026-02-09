"use client";

import { create } from "zustand";
import { ComponentData } from "@/lib/types";
import { COMPONENTS } from "@/lib/ComponentsList";
import type { EditorStore } from "../types/types";
import { getInitialState } from "./initialState";
import { createDialogActions } from "./actions/dialogActions";
import { createSidebarActions } from "./actions/sidebarActions";
import { createPageStateActions } from "./actions/pageStateActions";
import { createTempDataActions } from "./actions/tempDataActions";
import { createGlobalComponentsActions } from "./actions/globalComponentsActions";
import { createWebsiteLayoutActions } from "./actions/websiteLayoutActions";
import { createStaticPageActions } from "./actions/staticPageActions";
import { createThemeActions } from "./actions/themeActions";
import { createPageActions } from "./actions/pageActions";
import { createComponentActions } from "./actions/componentActions";

// Import component functions for use in actions
import { heroFunctions } from "../../editorStoreFunctions/heroFunctions";
import { headerFunctions } from "../../editorStoreFunctions/headerFunctions";
import { footerFunctions } from "../../editorStoreFunctions/footerFunctions";
import { halfTextHalfImageFunctions } from "../../editorStoreFunctions/halfTextHalfImageFunctions";
import { sideBySideFunctions } from "../../editorStoreFunctions/sideBySideFunctions";
import { propertySliderFunctions } from "../../editorStoreFunctions/propertySliderFunctions";
import { ctaValuationFunctions } from "../../editorStoreFunctions/ctaValuationFunctions";
import { stepsSectionFunctions } from "../../editorStoreFunctions/stepsSectionFunctions";
import { testimonialsFunctions } from "../../editorStoreFunctions/testimonialsFunctions";
import { logosTickerFunctions } from "../../editorStoreFunctions/logosTickerFunctions";
import { propertiesShowcaseFunctions } from "../../editorStoreFunctions/propertiesShowcaseFunctions";
import { card4Functions } from "../../editorStoreFunctions/card4Functions";
import { card5Functions } from "../../editorStoreFunctions/card5Functions";
import { partnersFunctions } from "../../editorStoreFunctions/partnersFunctions";
import { whyChooseUsFunctions } from "../../editorStoreFunctions/whyChooseUsFunctions";
import { contactMapSectionFunctions } from "../../editorStoreFunctions/contactMapSectionFunctions";
import { gridFunctions } from "../../editorStoreFunctions/gridFunctions";
import { filterButtonsFunctions } from "../../editorStoreFunctions/filterButtonsFunctions";
import { propertyFilterFunctions } from "../../editorStoreFunctions/propertyFilterFunctions";
import { mapSectionFunctions } from "../../editorStoreFunctions/mapSectionFunctions";
import { contactCardsFunctions } from "../../editorStoreFunctions/contactCardsFunctions";
import { contactFormSectionFunctions } from "../../editorStoreFunctions/contactFormSectionFunctions";
import { applicationFormFunctions } from "../../editorStoreFunctions/applicationFormFunctions";
import { jobFormFunctions } from "../../editorStoreFunctions/jobFormFunctions";
import { inputsFunctions } from "../../editorStoreFunctions/inputsFunctions";
import { inputs2Functions } from "../../editorStoreFunctions/inputs2Functions";
import { imageTextFunctions } from "../../editorStoreFunctions/imageTextFunctions";
import { contactUsHomePageFunctions } from "../../editorStoreFunctions/contactUsHomePageFunctions";
import { blogsSectionsFunctions } from "../../editorStoreFunctions/blogsSectionsFunctions";
import { blogCardFunctions } from "../../editorStoreFunctions/blogCardFunctions";
import { responsiveImageFunctions } from "../../editorStoreFunctions/responsiveImageFunctions";
import { titleFunctions } from "../../editorStoreFunctions/titleFunctions";
import { photosGridFunctions } from "../../editorStoreFunctions/photosGridFunctions";
import { videoFunctions } from "../../editorStoreFunctions/videoFunctions";
import { projectDetailsFunctions } from "../../editorStoreFunctions/projectDetailsFunctions";
import { propertyDetailFunctions as propertyDetailFunctions } from "../../editorStoreFunctions/propertyDetailFunctions";
import { blogDetailsFunctions } from "../../editorStoreFunctions/blogDetailsFunctions";
import { createDefaultData } from "../../editorStoreFunctions/types";
import {
  logBefore,
  logAfter,
  logBeforeAfter,
  logDuring,
} from "@/lib/fileLogger";
import type { ComponentInstanceWithPosition } from "../types/types";

export const useEditorStore = create<EditorStore>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,

    // Dynamic component getters - generated from ComponentsList
    componentGetters: Object.keys(COMPONENTS).reduce(
      (acc, componentType) => {
        acc[componentType] = (variantId: string) => {
          const state = get();
          return state.getComponentData(componentType, variantId);
        };
        return acc;
      },
      {} as Record<string, (variantId: string) => ComponentData>,
    ),

    // Dialog actions
    ...createDialogActions(set),

    // Page state actions
    ...createPageStateActions(set),

    // Sidebar actions
    ...createSidebarActions(set),

    // Temp data actions
    ...createTempDataActions(set, get),

    // Global components actions
    ...createGlobalComponentsActions(set),

    // Website layout actions
    ...createWebsiteLayoutActions(set),

    // Static page actions
    ...createStaticPageActions(set, get),

    // Theme actions
    ...createThemeActions(set),

    // Page actions
    ...createPageActions(set, get),

    // Component actions (getComponentData, setComponentData, ensureComponentVariant, updateComponentByPath)
    ...createComponentActions(set, get),
  } as EditorStore;
});
