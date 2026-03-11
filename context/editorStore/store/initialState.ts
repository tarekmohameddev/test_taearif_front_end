import { getDefaultHeaderData } from "../../editorStoreFunctions/headerFunctions";
import { getDefaultFooterData } from "../../editorStoreFunctions/footerFunctions";
import type { EditorStore } from "../types/types";

export const getInitialState = (): Partial<EditorStore> => ({
  showDialog: false,
  openSaveDialogFn: () => { },
  tempData: {},
  currentPage: "homepage",
  hasChangesMade: false,

  // Components Sidebar states - default values
  isComponentsSidebarOpen: false,
  isTabsContentOpen: false,
  wasComponentsSidebarManuallyClosed: false,

  // Initialize Global Components with default data
  globalHeaderData: getDefaultHeaderData(),
  globalFooterData: getDefaultFooterData(),
  globalHeaderVariant: "header1", // Default to header1
  globalFooterVariant: "footer1", // ⭐ NEW: Default to footer1

  // Initialize Global Components Data
  globalComponentsData: {
    header: getDefaultHeaderData(),
    footer: getDefaultFooterData(),
  },

  // WebsiteLayout - Meta tags and SEO data
  WebsiteLayout: {
    metaTags: {
      pages: [],
    },
    currentTheme: null,
    CustomBranding: {
      header: {
        logo: "",
        name: "",
      },
      footer: {
        logo: "",
        name: "",
      },
    },
  },

  // Static Pages Data - Initialize as empty
  staticPagesData: {},

  // Theme backup
  themeBackup: null,
  themeBackupKey: null,
  themeChangeTimestamp: 0,

  // Theme backups collection - Initialize as empty object
  ThemesBackup: {},

  // Structures loaded on demand via getComponentByIdWithStructureAsync (no pre-load of heavy structures)
  structures: {},
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

  // Dynamic component states
  componentStates: {},

  // Aggregated page components with positions
  pageComponentsByPage: {},
});
