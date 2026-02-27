import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";
import { getDefaultHeaderData } from "../../../editorStoreFunctions/headerFunctions";
import { getDefaultFooterData } from "../../../editorStoreFunctions/footerFunctions";

export const createThemeActions = (
  set: StateCreator<EditorStore>["setState"],
): Pick<
  EditorStore,
  | "setThemeBackup"
  | "setThemesBackup"
  | "deleteThemeBackup"
  | "clearAllStates"
> => ({
  setThemeBackup: (key, backup) =>
    set(() => ({
      themeBackup: backup,
      themeBackupKey: key,
    })),
  setThemesBackup: (backups) =>
    set(() => ({
      ThemesBackup: backups,
    })),
  deleteThemeBackup: (backupKey) =>
    set((state) => {
      const updatedBackups = { ...state.ThemesBackup };
      delete updatedBackups[backupKey];
      return { ThemesBackup: updatedBackups };
    }),
  clearAllStates: () =>
    set((state) => {
      // Get default header and footer data
      const defaultHeaderData = getDefaultHeaderData();
      const defaultFooterData = getDefaultFooterData();

      return {
        // Clear all component type states
        heroStates: {},
        heroBannerStates: {},
        commitmentSectionStates: {},
        creativityTriadSectionStates: {},
        essenceSectionStates: {},
        featuresSectionStates: {},
        journeySectionStates: {},
        landInvestmentFormSectionStates: {},
        philosophyCtaSectionStates: {},
        quoteSectionStates: {},
        projectsHeaderStates: {},
        projectsShowcaseStates: {},
        contactFormStates: {},
        valuesSectionStates: {},
        headerStates: {},
        footerStates: {},
        halfTextHalfImageStates: {},
        sideBySideStates: {},
        propertySliderStates: {},
        ctaValuationStates: {},
        stepsSectionStates: {},
        testimonialsStates: {},
        projectDetailsStates: {},
        propertyDetailStates: {},
        blogDetailsStates: {},
        propertiesShowcaseStates: {},
        card4States: {},
        card5States: {},
        logosTickerStates: {},
        partnersStates: {},
        whyChooseUsStates: {},
        contactMapSectionStates: {},
        gridStates: {},
        filterButtonsStates: {},
        propertyFilterStates: {},
        mapSectionStates: {},
        contactCardsStates: {},
        contactFormSectionStates: {},
        applicationFormStates: {},
        jobFormStates: {},
        inputsStates: {},
        inputs2States: {},
        imageTextStates: {},
        contactUsHomePageStates: {},
        blogsSectionsStates: {},
        blogCardStates: {},
        titleStates: {},
        responsiveImageStates: {},
        photosGridStates: {},
        videoStates: {},
        componentStates: {},

        // Clear page components
        pageComponentsByPage: {},

        // Clear static pages data
        staticPagesData: {},

        // Reset global components to defaults
        globalHeaderData: defaultHeaderData,
        globalFooterData: defaultFooterData,
        globalHeaderVariant: "StaticHeader1",
        globalFooterVariant: "StaticFooter1",
        globalComponentsData: {
          header: defaultHeaderData,
          footer: defaultFooterData,
        },

        // Clear temp data
        tempData: {},

        // Force sync after clearing
        themeChangeTimestamp: Date.now(),
      } as any;
    }),
});
