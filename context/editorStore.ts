"use client";

import { create } from "zustand";
import { ComponentData } from "@/lib/types";
import { COMPONENTS } from "@/lib/ComponentsList";
import { heroStructure } from "@/componentsStructure/hero";
import { headerStructure } from "@/componentsStructure/header";
import { halfTextHalfImageStructure } from "@/componentsStructure/halfTextHalfImage";
import { propertySliderStructure } from "@/componentsStructure/propertySlider";
import { ctaValuationStructure } from "@/componentsStructure/ctaValuation";
import { stepsSectionStructure } from "@/componentsStructure/stepsSection";
import { footerStructure } from "@/componentsStructure/footer";
import { gridStructure } from "@/componentsStructure/grid";
import { filterButtonsStructure } from "@/componentsStructure/filterButtons";
import { propertyFilterStructure } from "@/componentsStructure/propertyFilter";
import { mapSectionStructure } from "@/componentsStructure/mapSection";
import { contactFormSectionStructure } from "@/componentsStructure/contactFormSection";
import { contactCardsStructure } from "@/componentsStructure/contactCards";
import { cardStructure } from "@/componentsStructure/card";
import { inputsStructure } from "@/componentsStructure/inputs";
import { inputs2Structure } from "@/componentsStructure/inputs2";

// Deep merge function for nested objects
const deepMerge = (target: any, source: any): any => {
  if (!source || typeof source !== "object") return target || source;
  if (!target || typeof target !== "object") return source;

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
};

// Import component functions
import { heroFunctions } from "./editorStoreFunctions/heroFunctions";
import { headerFunctions } from "./editorStoreFunctions/headerFunctions";
import { footerFunctions } from "./editorStoreFunctions/footerFunctions";
import { halfTextHalfImageFunctions } from "./editorStoreFunctions/halfTextHalfImageFunctions";
import { propertySliderFunctions } from "./editorStoreFunctions/propertySliderFunctions";
import { ctaValuationFunctions } from "./editorStoreFunctions/ctaValuationFunctions";
import { stepsSectionFunctions } from "./editorStoreFunctions/stepsSectionFunctions";
import { testimonialsFunctions } from "./editorStoreFunctions/testimonialsFunctions";
import { logosTickerFunctions } from "./editorStoreFunctions/logosTickerFunctions";
import { propertiesShowcaseFunctions } from "./editorStoreFunctions/propertiesShowcaseFunctions";
import { card4Functions } from "./editorStoreFunctions/card4Functions";
import { card5Functions } from "./editorStoreFunctions/card5Functions";
import { partnersFunctions } from "./editorStoreFunctions/partnersFunctions";
import { whyChooseUsFunctions } from "./editorStoreFunctions/whyChooseUsFunctions";
import { contactMapSectionFunctions } from "./editorStoreFunctions/contactMapSectionFunctions";
import { gridFunctions } from "./editorStoreFunctions/gridFunctions";
import { filterButtonsFunctions } from "./editorStoreFunctions/filterButtonsFunctions";
import { propertyFilterFunctions } from "./editorStoreFunctions/propertyFilterFunctions";
import { mapSectionFunctions } from "./editorStoreFunctions/mapSectionFunctions";
import { contactCardsFunctions } from "./editorStoreFunctions/contactCardsFunctions";
import { contactFormSectionFunctions } from "./editorStoreFunctions/contactFormSectionFunctions";
import { applicationFormFunctions } from "./editorStoreFunctions/applicationFormFunctions";
import { inputsFunctions } from "./editorStoreFunctions/inputsFunctions";
import { inputs2Functions } from "./editorStoreFunctions/inputs2Functions";
import { imageTextFunctions } from "./editorStoreFunctions/imageTextFunctions";
import { contactUsHomePageFunctions } from "./editorStoreFunctions/contactUsHomePageFunctions";
import { blogsSectionsFunctions } from "./editorStoreFunctions/blogsSectionsFunctions";
import { responsiveImageFunctions } from "./editorStoreFunctions/responsiveImageFunctions";
import { titleFunctions } from "./editorStoreFunctions/titleFunctions";
import { photosGridFunctions } from "./editorStoreFunctions/photosGridFunctions";
import { videoFunctions } from "./editorStoreFunctions/videoFunctions";
import { projectDetailsFunctions } from "./editorStoreFunctions/projectDetailsFunctions";
import { propertyDetailFunctions as propertyDetailFunctions } from "./editorStoreFunctions/propertyDetailFunctions";
import { createDefaultData } from "./editorStoreFunctions/types";
import { getDefaultHeaderData } from "./editorStoreFunctions/headerFunctions";
import { getDefaultFooterData } from "./editorStoreFunctions/footerFunctions";
import { getDefaultInputs2Data } from "./editorStoreFunctions/inputs2Functions";
import defaultData from "@/lib/defaultData.json";
import { normalizeComponentSettings } from "@/services/live-editor/componentSettingsHelper";

type OpenDialogFn = () => void;

type ComponentInstanceWithPosition = {
  id: string;
  type: string;
  name: string;
  componentName: string;
  data: ComponentData;
  position: number;
};

interface EditorStore {
  // حالة حفظ البيانات
  showDialog: boolean;
  openSaveDialogFn: OpenDialogFn;

  // دالة حفظ ديناميكية
  setOpenSaveDialog: (fn: OpenDialogFn) => void;
  requestSave: () => void;
  closeDialog: () => void;

  // حالة تتبع التعديلات
  hasChangesMade: boolean;
  setHasChangesMade: (hasChanges: boolean) => void;

  // Current page for tracking
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // بيانات التعديل المؤقتة للمكون
  tempData: ComponentData;
  setTempData: (data: ComponentData) => void;
  updateTempField: (
    field: "texts" | "colors" | "settings",
    key: string,
    value: string | boolean | number,
  ) => void;
  updateByPath: (path: string, value: any) => void;

  // Global Components - Header and Footer shared across all pages
  globalHeaderData: ComponentData;
  globalFooterData: ComponentData;
  globalHeaderVariant: string; // Variant for global header (StaticHeader1, header1, header2)
  globalFooterVariant: string; // ⭐ NEW: Variant for global footer (StaticFooter1, footer1, footer2)
  setGlobalHeaderData: (data: ComponentData) => void;
  setGlobalFooterData: (data: ComponentData) => void;
  setGlobalHeaderVariant: (variant: string) => void;
  setGlobalFooterVariant: (variant: string) => void; // ⭐ NEW
  updateGlobalHeaderByPath: (path: string, value: any) => void;
  updateGlobalFooterByPath: (path: string, value: any) => void;

  // Global Components Data - unified state for all global components
  globalComponentsData: {
    header: ComponentData;
    footer: ComponentData;
  };
  setGlobalComponentsData: (data: {
    header: ComponentData;
    footer: ComponentData;
  }) => void;
  updateGlobalComponentByPath: (
    componentType: "header" | "footer",
    path: string,
    value: any,
  ) => void;

  // WebsiteLayout - Meta tags and SEO data
  WebsiteLayout: {
    metaTags: {
      pages: Array<{
        TitleAr: string;
        TitleEn: string;
        DescriptionAr: string;
        DescriptionEn: string;
        KeywordsAr: string;
        KeywordsEn: string;
        Author: string;
        AuthorEn: string;
        Robots: string;
        RobotsEn: string;
        "og:title": string;
        "og:description": string;
        "og:keywords": string;
        "og:author": string;
        "og:robots": string;
        "og:url": string;
        "og:image": string;
        "og:type": string;
        "og:locale": string;
        "og:locale:alternate": string;
        "og:site_name": string;
        "og:image:width": string;
        "og:image:height": string;
        "og:image:type": string;
        "og:image:alt": string;
        path: string;
      }>;
    };
    branding?: {
      colors: {
        primary: string;
        secondary: string;
        accent: string;
      };
      mainBgColor: string;
    };
    currentTheme?: number | null; // 1 or 2
  };
  setWebsiteLayout: (data: any) => void;
  addPageToWebsiteLayout: (pageData: any) => void;
  setCurrentTheme: (themeNumber: number) => void;

  // Static Pages Data - Pages with fixed API endpoints (e.g., /project/[id])
  staticPagesData: Record<
    string,
    {
      slug: string;
      components: ComponentInstanceWithPosition[];
      apiEndpoints?: {
        fetchData?: string;
        [key: string]: string | undefined;
      };
    }
  >;
  setStaticPageData: (slug: string, data: any) => void;
  getStaticPageData: (slug: string) => any;

  // Theme backup
  themeBackup: Record<string, any> | null;
  themeBackupKey: string | null;
  setThemeBackup: (key: string, backup: Record<string, any>) => void;

  // Theme backups collection - Separate from WebsiteLayout
  ThemesBackup: Record<string, any>; // { Theme1Backup: {...}, Theme2Backup: {...} }
  setThemesBackup: (backups: Record<string, any>) => void;
  deleteThemeBackup: (backupKey: string) => void;

  // Theme change timestamp for forcing sync after theme restore
  themeChangeTimestamp: number;

  // Structures registry
  structures: Record<string, any>;

  // Dynamic component states - يتم إنشاؤها تلقائياً من ComponentsList
  componentStates: Record<string, Record<string, ComponentData>>;

  // Dynamic component getters - يتم إنشاؤها تلقائياً من ComponentsList
  componentGetters: Record<string, (variantId: string) => ComponentData>;

  // Generic functions for all components
  ensureComponentVariant: (
    componentType: string,
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getComponentData: (componentType: string, variantId: string) => ComponentData;
  setComponentData: (
    componentType: string,
    variantId: string,
    data: ComponentData,
  ) => void;
  updateComponentByPath: (
    componentType: string,
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Legacy specific component states (للتوافق مع الكود الحالي)
  heroStates: Record<string, ComponentData>;
  ensureHeroVariant: (variantId: string, initial?: ComponentData) => void;
  getHeroData: (variantId: string) => ComponentData;
  setHeroData: (variantId: string, data: ComponentData) => void;
  updateHeroByPath: (variantId: string, path: string, value: any) => void;

  headerStates: Record<string, ComponentData>;
  ensureHeaderVariant: (variantId: string, initial?: ComponentData) => void;
  getHeaderData: (variantId: string) => ComponentData;
  setHeaderData: (variantId: string, data: ComponentData) => void;
  updateHeaderByPath: (variantId: string, path: string, value: any) => void;

  // Half Text Half Image states
  halfTextHalfImageStates: Record<string, ComponentData>;
  ensurehalfTextHalfImageVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  gethalfTextHalfImageData: (variantId: string) => ComponentData;
  sethalfTextHalfImageData: (variantId: string, data: ComponentData) => void;
  updatehalfTextHalfImageByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Property Slider states
  propertySliderStates: Record<string, ComponentData>;
  ensurePropertySliderVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getPropertySliderData: (variantId: string) => ComponentData;
  setPropertySliderData: (variantId: string, data: ComponentData) => void;
  updatePropertySliderByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // CTA Valuation states
  ctaValuationStates: Record<string, ComponentData>;
  ensureCtaValuationVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getCtaValuationData: (variantId: string) => ComponentData;
  setCtaValuationData: (variantId: string, data: ComponentData) => void;
  updateCtaValuationByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Steps Section states
  stepsSectionStates: Record<string, ComponentData>;
  ensureStepsSectionVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getStepsSectionData: (variantId: string) => ComponentData;
  setStepsSectionData: (variantId: string, data: ComponentData) => void;
  updateStepsSectionByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Testimonials states
  testimonialsStates: Record<string, ComponentData>;
  ensureTestimonialsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getTestimonialsData: (variantId: string) => ComponentData;
  setTestimonialsData: (variantId: string, data: ComponentData) => void;
  updateTestimonialsByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;
  // Project Details states
  projectDetailsStates: Record<string, ComponentData>;
  ensureProjectDetailsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getProjectDetailsData: (variantId: string) => ComponentData;
  setProjectDetailsData: (variantId: string, data: ComponentData) => void;
  updateProjectDetailsByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Property Detail states
  propertyDetailStates: Record<string, ComponentData>;
  ensurepropertyDetailVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getpropertyDetailData: (variantId: string) => ComponentData;
  setpropertyDetailData: (variantId: string, data: ComponentData) => void;
  updatepropertyDetailByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  propertiesShowcaseStates: Record<string, ComponentData>;
  ensurePropertiesShowcaseVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getPropertiesShowcaseData: (variantId: string) => ComponentData;
  setPropertiesShowcaseData: (variantId: string, data: ComponentData) => void;
  updatePropertiesShowcaseByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Card4 states
  card4States: Record<string, ComponentData>;
  ensureCard4Variant: (variantId: string, initial?: ComponentData) => void;
  getCard4Data: (variantId: string) => ComponentData;
  setCard4Data: (variantId: string, data: ComponentData) => void;
  updateCard4ByPath: (variantId: string, path: string, value: any) => void;

  // Card5 states
  card5States: Record<string, ComponentData>;
  ensureCard5Variant: (variantId: string, initial?: ComponentData) => void;
  getCard5Data: (variantId: string) => ComponentData;
  setCard5Data: (variantId: string, data: ComponentData) => void;
  updateCard5ByPath: (variantId: string, path: string, value: any) => void;

  // Logos Ticker states
  logosTickerStates: Record<string, ComponentData>;
  ensureLogosTickerVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getLogosTickerData: (variantId: string) => ComponentData;
  setLogosTickerData: (variantId: string, data: ComponentData) => void;
  updateLogosTickerByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Partners states
  partnersStates: Record<string, ComponentData>;
  ensurePartnersVariant: (variantId: string, initial?: ComponentData) => void;
  getPartnersData: (variantId: string) => ComponentData;
  setPartnersData: (variantId: string, data: ComponentData) => void;
  updatePartnersByPath: (variantId: string, path: string, value: any) => void;

  // Why Choose Us states
  whyChooseUsStates: Record<string, ComponentData>;
  ensureWhyChooseUsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getWhyChooseUsData: (variantId: string) => ComponentData;
  setWhyChooseUsData: (variantId: string, data: ComponentData) => void;
  updateWhyChooseUsByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Contact Map Section states
  contactMapSectionStates: Record<string, ComponentData>;
  ensureContactMapSectionVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getContactMapSectionData: (variantId: string) => ComponentData;
  setContactMapSectionData: (variantId: string, data: ComponentData) => void;
  updateContactMapSectionByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Footer states
  footerStates: Record<string, ComponentData>;
  ensureFooterVariant: (variantId: string, initial?: ComponentData) => void;
  getFooterData: (variantId: string) => ComponentData;
  setFooterData: (variantId: string, data: ComponentData) => void;
  updateFooterByPath: (variantId: string, path: string, value: any) => void;

  // Grid states
  gridStates: Record<string, ComponentData>;
  ensureGridVariant: (variantId: string, initial?: ComponentData) => void;
  getGridData: (variantId: string) => ComponentData;
  setGridData: (variantId: string, data: ComponentData) => void;
  updateGridByPath: (variantId: string, path: string, value: any) => void;

  // Filter Buttons states
  filterButtonsStates: Record<string, ComponentData>;
  ensureFilterButtonsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getFilterButtonsData: (variantId: string) => ComponentData;
  setFilterButtonsData: (variantId: string, data: ComponentData) => void;
  updateFilterButtonsByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Property Filter states
  propertyFilterStates: Record<string, ComponentData>;
  ensurePropertyFilterVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getPropertyFilterData: (variantId: string) => ComponentData;
  setPropertyFilterData: (variantId: string, data: ComponentData) => void;
  updatePropertyFilterByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Map Section states
  mapSectionStates: Record<string, ComponentData>;
  ensureMapSectionVariant: (variantId: string, initial?: ComponentData) => void;
  getMapSectionData: (variantId: string) => ComponentData;
  setMapSectionData: (variantId: string, data: ComponentData) => void;
  updateMapSectionByPath: (variantId: string, path: string, value: any) => void;

  // Contact Form Section states
  contactFormSectionStates: Record<string, ComponentData>;
  ensureContactFormSectionVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getContactFormSectionData: (variantId: string) => ComponentData;
  setContactFormSectionData: (variantId: string, data: ComponentData) => void;
  updateContactFormSectionByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Contact Cards states
  contactCardsStates: Record<string, ComponentData>;
  ensureContactCardsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getContactCardsData: (variantId: string) => ComponentData;
  setContactCardsData: (variantId: string, data: ComponentData) => void;
  updateContactCardsByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Application Form states
  applicationFormStates: Record<string, ComponentData>;
  ensureApplicationFormVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getApplicationFormData: (variantId: string) => ComponentData;
  setApplicationFormData: (variantId: string, data: ComponentData) => void;
  updateApplicationFormByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Image Text states
  imageTextStates: Record<string, ComponentData>;
  ensureImageTextVariant: (variantId: string, initial?: ComponentData) => void;
  getImageTextData: (variantId: string) => ComponentData;
  setImageTextData: (variantId: string, data: ComponentData) => void;
  updateImageTextByPath: (variantId: string, path: string, value: any) => void;

  contactUsHomePageStates: Record<string, ComponentData>;
  ensureContactUsHomePageVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getContactUsHomePageData: (variantId: string) => ComponentData;
  setContactUsHomePageData: (variantId: string, data: ComponentData) => void;
  updateContactUsHomePageByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Blogs Sections states
  blogsSectionsStates: Record<string, ComponentData>;
  ensureBlogsSectionsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getBlogsSectionsData: (variantId: string) => ComponentData;
  setBlogsSectionsData: (variantId: string, data: ComponentData) => void;
  updateBlogsSectionsByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Title states
  titleStates: Record<string, ComponentData>;
  ensureTitleVariant: (variantId: string, initial?: ComponentData) => void;
  getTitleData: (variantId: string) => ComponentData;
  setTitleData: (variantId: string, data: ComponentData) => void;
  updateTitleByPath: (variantId: string, path: string, value: any) => void;

  // Responsive Image states
  responsiveImageStates: Record<string, ComponentData>;
  ensureResponsiveImageVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getResponsiveImageData: (variantId: string) => ComponentData;
  setResponsiveImageData: (variantId: string, data: ComponentData) => void;
  updateResponsiveImageByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Photos Grid states
  photosGridStates: Record<string, ComponentData>;
  ensurePhotosGridVariant: (variantId: string, initial?: ComponentData) => void;
  getPhotosGridData: (variantId: string) => ComponentData;
  setPhotosGridData: (variantId: string, data: ComponentData) => void;
  updatePhotosGridByPath: (variantId: string, path: string, value: any) => void;

  // Video states
  videoStates: Record<string, ComponentData>;
  ensureVideoVariant: (variantId: string, initial?: ComponentData) => void;
  getVideoData: (variantId: string) => ComponentData;
  setVideoData: (variantId: string, data: ComponentData) => void;
  updateVideoByPath: (variantId: string, path: string, value: any) => void;

  // Inputs states
  inputsStates: Record<string, ComponentData>;
  ensureInputsVariant: (variantId: string, initial?: ComponentData) => void;
  getInputsData: (variantId: string) => ComponentData;
  setInputsData: (variantId: string, data: ComponentData) => void;
  updateInputsByPath: (variantId: string, path: string, value: any) => void;

  // Inputs2 states
  inputs2States: Record<string, ComponentData>;
  ensureInputs2Variant: (variantId: string, initial?: ComponentData) => void;
  getInputs2Data: (variantId: string) => ComponentData;
  setInputs2Data: (variantId: string, data: ComponentData) => void;
  updateInputs2ByPath: (variantId: string, path: string, value: any) => void;

  // Page-wise components aggregation (for saving all pages)
  pageComponentsByPage: Record<string, ComponentInstanceWithPosition[]>;
  setPageComponentsForPage: (
    page: string,
    components: {
      id: string;
      type: string;
      name: string;
      componentName: string;
      data: ComponentData;
    }[],
  ) => void;

  // Load data from database into editor stores
  loadFromDatabase: (tenantData: any) => void;

  // Create new page
  createPage: (pageData: {
    slug: string;
    name: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    components?: ComponentInstanceWithPosition[];
  }) => void;

  // Get all pages
  getAllPages: () => string[];

  // Delete page
  deletePage: (slug: string) => void;

  // Force update page components for immediate save
  forceUpdatePageComponents: (slug: string, components: any[]) => void;

  // Clear all states (for theme change)
  clearAllStates: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  showDialog: false,
  openSaveDialogFn: () => {},
  tempData: {},
  currentPage: "homepage",
  hasChangesMade: false,

  // Initialize Global Components with default data
  globalHeaderData: getDefaultHeaderData(),
  globalFooterData: getDefaultFooterData(),
  globalHeaderVariant: "StaticHeader1", // Default to StaticHeader1
  globalFooterVariant: "StaticFooter1", // ⭐ NEW: Default to StaticFooter1

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
  },

  // Static Pages Data - Initialize as empty
  staticPagesData: {},

  // Theme backup
  themeBackup: null,
  themeBackupKey: null,
  themeChangeTimestamp: 0,

  // Theme backups collection - Initialize as empty object
  ThemesBackup: {},

  structures: Object.keys(COMPONENTS).reduce(
    (acc, componentType) => {
      acc[componentType] = COMPONENTS[componentType];
      return acc;
    },
    {} as Record<string, any>,
  ),
  heroStates: {},
  headerStates: {},
  footerStates: {},
  halfTextHalfImageStates: {},
  propertySliderStates: {},
  ctaValuationStates: {},
  stepsSectionStates: {},
  testimonialsStates: {},
  projectDetailsStates: {},
  propertyDetailStates: {},
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
  inputsStates: {},
  inputs2States: {},
  imageTextStates: {},
  contactUsHomePageStates: {},
  blogsSectionsStates: {},
  titleStates: {},
  responsiveImageStates: {},
  photosGridStates: {},
  videoStates: {},

  // Dynamic component states
  componentStates: {},

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

  // Aggregated page components with positions
  pageComponentsByPage: {},

  setOpenSaveDialog: (fn) => set(() => ({ openSaveDialogFn: fn })),
  requestSave: () => set(() => ({ showDialog: true })),
  closeDialog: () => set(() => ({ showDialog: false })),
  setHasChangesMade: (hasChanges) => {
    set((state) => {
      // Only update if the value is actually different to prevent infinite loops
      if (state.hasChangesMade !== hasChanges) {
        return { hasChangesMade: hasChanges };
      }
      return state; // Return current state if no change needed
    });
  },

  setCurrentPage: (page) => set(() => ({ currentPage: page })),

  setTempData: (data) => set(() => ({ tempData: data })),

  // Global Components management
  setGlobalHeaderData: (data) =>
    set(() => {
      return { globalHeaderData: data };
    }),
  setGlobalFooterData: (data) =>
    set(() => {
      return { globalFooterData: data };
    }),
  setGlobalHeaderVariant: (variant) =>
    set(() => {
      return { globalHeaderVariant: variant };
    }),
  setGlobalFooterVariant: (variant) =>
    set(() => {
      return { globalFooterVariant: variant };
    }),

  updateGlobalHeaderByPath: (path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Use default data if current data is empty
      let currentData = state.globalHeaderData;
      if (!currentData || Object.keys(currentData).length === 0) {
        currentData = getDefaultHeaderData();
      }

      let newData: any = { ...currentData };
      let cursor: any = newData;

      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];

        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          cursor[key] = nextIsIndex ? [] : {};
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }
      const lastKey = segments[segments.length - 1]!;
      cursor[lastKey] = value;

      // Force a new reference to ensure React re-renders
      const result = {
        globalHeaderData: JSON.parse(JSON.stringify(newData)),
      };
      return result;
    }),

  updateGlobalFooterByPath: (path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Use default data if current data is empty
      let currentData = state.globalFooterData;
      if (!currentData || Object.keys(currentData).length === 0) {
        currentData = getDefaultFooterData();
      }

      let newData: any = { ...currentData };
      let cursor: any = newData;

      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];

        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          cursor[key] = nextIsIndex ? [] : {};
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }
      const lastKey = segments[segments.length - 1]!;
      cursor[lastKey] = value;

      // Force a new reference to ensure React re-renders
      const result = {
        globalFooterData: JSON.parse(JSON.stringify(newData)),
      };
      return result;
    }),

  // Global Components Data management
  setGlobalComponentsData: (data) =>
    set(() => {
      return { globalComponentsData: data };
    }),

  updateGlobalComponentByPath: (componentType, path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Get current data or initialize with defaults
      let currentData = state.globalComponentsData[componentType];
      if (!currentData || Object.keys(currentData).length === 0) {
        currentData =
          componentType === "header"
            ? getDefaultHeaderData()
            : getDefaultFooterData();
      }

      // Create a deep copy to avoid mutations
      let newData = JSON.parse(JSON.stringify(currentData));
      let cursor: any = newData;

      // Navigate to the target path
      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];

        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          cursor[key] = nextIsIndex ? [] : {};
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }

      // Set the final value
      const lastKey = segments[segments.length - 1]!;
      cursor[lastKey] = value;

      // Return new state with properly replaced data
      return {
        globalComponentsData: {
          ...state.globalComponentsData,
          [componentType]: newData,
        },
      };
    }),

  updateTempField: (field, key, value) =>
    set((state) => {
      const updated = {
        ...state.tempData,
        [field]: {
          ...state.tempData?.[field],
          [key]: value,
        },
      } as ComponentData;
      return { tempData: updated };
    }),
  updateByPath: (path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Initialize tempData with current component data if it's empty
      let newData: any = { ...(state.tempData || {}) };

      // Special handling for menu items - always preserve tempData if it exists
      if (path === "menu" && state.tempData && state.tempData.menu) {
        newData = { ...state.tempData };
      }
      // If tempData is empty, try to get current component data
      else if (!state.tempData || Object.keys(state.tempData).length === 0) {
        // For global components, use the global data as base
        if (
          state.currentPage === "global-header" ||
          path.includes("menu") ||
          path.includes("logo")
        ) {
          // This is likely a global header component, use globalHeaderData as base
          newData = { ...state.globalHeaderData };
        } else if (
          state.currentPage === "global-footer" ||
          path.includes("footer")
        ) {
          // This is likely a global footer component, use globalFooterData as base
          newData = { ...state.globalFooterData };
        } else {
          // For other components, use empty object
          newData = {};
        }
      } else {
        // If tempData exists, use it as base and merge with global data for missing fields
        if (
          state.currentPage === "global-header" ||
          path.includes("menu") ||
          path.includes("logo")
        ) {
          // Merge tempData with globalHeaderData to ensure all fields are present
          // Use deep merge to preserve nested objects like menu arrays
          // Priority: tempData > globalHeaderData (tempData should override)
          newData = deepMerge(state.globalHeaderData, state.tempData);
        } else if (
          state.currentPage === "global-footer" ||
          path.includes("footer")
        ) {
          // Merge tempData with globalFooterData to ensure all fields are present
          // Use deep merge to preserve nested objects
          newData = deepMerge(state.globalFooterData, state.tempData);
        }
      }

      let cursor: any = newData;
      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];
        const nextKey = segments[i + 1]!;

        // Special handling: If we're navigating to a property of a color field (e.g., bgColor.useDefaultColor),
        // and the existing value is a string (color hex), preserve it in a value property
        const isColorFieldProperty =
          (nextKey === "useDefaultColor" || nextKey === "globalColorType") &&
          typeof existing === "string" &&
          existing.startsWith("#");

        // إذا كان existing string أو primitive value، استبدله بـ object أو array
        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          if (isColorFieldProperty) {
            // Preserve the color value when converting to object
            cursor[key] = { value: existing };
            if (path.includes("styling") && path.includes("bgColor")) {
              console.log(
                `🔧 Preserving color value: ${existing} in ${key}.value`,
              );
            }
          } else {
            cursor[key] = nextIsIndex ? [] : {};
          }
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }
      const lastKey = segments[segments.length - 1]!;

      // Special handling: If we're setting useDefaultColor or globalColorType on a color field,
      // and the parent object has a value property (from a previous string-to-object conversion),
      // preserve it
      if (
        (lastKey === "useDefaultColor" || lastKey === "globalColorType") &&
        cursor &&
        typeof cursor === "object" &&
        !Array.isArray(cursor) &&
        cursor.value &&
        typeof cursor.value === "string" &&
        cursor.value.startsWith("#")
      ) {
        // The value property already exists, just update useDefaultColor or globalColorType
        cursor[lastKey] = value;
        if (path.includes("styling") && path.includes("bgColor")) {
          console.log(
            `🔧 Preserving existing color value: ${cursor.value} while setting ${lastKey} to ${value}`,
          );
        }
      } else {
        cursor[lastKey] = value;
      }

      // Debug: Log the update for styling paths
      if (
        path.includes("styling") ||
        path.includes("searchButton") ||
        path.includes("bgColor")
      ) {
        console.group("🔧 updateByPath Debug");
        console.log("Path:", path);
        console.log("Value:", value);
        console.log("Segments:", segments);
        console.log("New Data:", newData);
        console.group("Styling in New Data");
        console.log("Styling:", newData?.styling);
        console.log("SearchButton:", newData?.styling?.searchButton);
        console.groupEnd();
        console.groupEnd();
      }

      // Only update tempData, don't update global data until Save Changes is pressed

      return { tempData: newData };
    }),

  // Hero functions using modular approach
  ensureHeroVariant: (variantId, initial) =>
    set((state) => heroFunctions.ensureVariant(state, variantId, initial)),
  getHeroData: (variantId) => {
    const state = get();
    return heroFunctions.getData(state, variantId);
  },
  setHeroData: (variantId, data) =>
    set((state) => heroFunctions.setData(state, variantId, data)),
  updateHeroByPath: (variantId, path, value) =>
    set((state) => heroFunctions.updateByPath(state, variantId, path, value)),

  // Header functions using modular approach
  ensureHeaderVariant: (variantId, initial) =>
    set((state) => headerFunctions.ensureVariant(state, variantId, initial)),
  getHeaderData: (variantId) => {
    const state = get();
    return headerFunctions.getData(state, variantId);
  },
  setHeaderData: (variantId, data) =>
    set((state) => headerFunctions.setData(state, variantId, data)),
  updateHeaderByPath: (variantId, path, value) =>
    set((state) => headerFunctions.updateByPath(state, variantId, path, value)),

  // Footer functions using modular approach
  ensureFooterVariant: (variantId, initial) =>
    set((state) => footerFunctions.ensureVariant(state, variantId, initial)),
  getFooterData: (variantId) => {
    const state = get();
    return footerFunctions.getData(state, variantId);
  },
  setFooterData: (variantId, data) =>
    set((state) => footerFunctions.setData(state, variantId, data)),
  updateFooterByPath: (variantId, path, value) =>
    set((state) => footerFunctions.updateByPath(state, variantId, path, value)),

  // Generic functions for all components
  ensureComponentVariant: (componentType, variantId, initial) => {
    // ⭐ CRITICAL: Check if variant already exists BEFORE calling set()
    // This prevents unnecessary store updates that can cause infinite loops
    const currentState = get();
    const existingData = (() => {
      switch (componentType) {
        case "hero":
          return currentState.heroStates[variantId];
        case "header":
          return currentState.headerStates[variantId];
        case "footer":
          return currentState.footerStates[variantId];
        case "halfTextHalfImage":
          return currentState.halfTextHalfImageStates[variantId];
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
        case "contactFormSection":
          return currentState.contactFormSectionStates[variantId];
        case "contactCards":
          return currentState.contactCardsStates[variantId];
        case "applicationForm":
          return currentState.applicationFormStates[variantId];
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
        case "propertySlider":
          return propertySliderFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
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
        case "contactFormSection":
          return contactFormSectionFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "contactCards":
          return contactCardsFunctions.ensureVariant(state, variantId, initial);
        case "applicationForm":
          return applicationFormFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
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
          return blogsSectionsFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
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
      // Note: Zustand should handle {} automatically, but we're being explicit
      if (
        !result ||
        (typeof result === "object" && Object.keys(result).length === 0)
      ) {
        return state;
      }

      return result;
    });
  },

  getComponentData: (componentType, variantId) => {
    const state = get();

    // Try to use specific component functions first for better default data handling
    switch (componentType) {
      case "hero":
        return heroFunctions.getData(state, variantId);
      case "header":
        return headerFunctions.getData(state, variantId);
      case "footer":
        return footerFunctions.getData(state, variantId);
      case "halfTextHalfImage":
        return halfTextHalfImageFunctions.getData(state, variantId);
      case "propertySlider":
        return propertySliderFunctions.getData(state, variantId);
      case "ctaValuation":
        return ctaValuationFunctions.getData(state, variantId);
      case "stepsSection":
        return stepsSectionFunctions.getData(state, variantId);
      case "testimonials":
        return testimonialsFunctions.getData(state, variantId);
      case "projectDetails":
        return projectDetailsFunctions.getData(state, variantId);
      case "propertyDetail":
        return propertyDetailFunctions.getData(state, variantId);
      case "propertiesShowcase":
        return propertiesShowcaseFunctions.getData(state, variantId);
      case "card":
        // Determine which card variant based on variantId
        if (variantId.includes("card5") || variantId === "card5") {
          return card5Functions.getData(state, variantId);
        }
        return card4Functions.getData(state, variantId);
      case "logosTicker":
        return logosTickerFunctions.getData(state, variantId);
      case "partners":
        return partnersFunctions.getData(state, variantId);
      case "whyChooseUs":
        return whyChooseUsFunctions.getData(state, variantId);
      case "contactMapSection":
        return contactMapSectionFunctions.getData(state, variantId);
      case "grid":
        return gridFunctions.getData(state, variantId);
      case "filterButtons":
        return filterButtonsFunctions.getData(state, variantId);
      case "propertyFilter":
        const propertyFilterData = propertyFilterFunctions.getData(
          state,
          variantId,
        );
        // Debug: Log propertyFilter data retrieval
        if (variantId === "1") {
          console.group("🔍 getComponentData Debug for propertyFilter");
          console.log("VariantId:", variantId);
          console.log(
            "PropertyFilterStates keys:",
            Object.keys(state.propertyFilterStates),
          );
          console.log(
            "PropertyFilterStates['1']:",
            state.propertyFilterStates["1"],
          );
          console.log("Returned Data:", propertyFilterData);
          console.groupEnd();
        }
        return propertyFilterData;
      case "mapSection":
        return mapSectionFunctions.getData(state, variantId);
      case "contactCards":
        return contactCardsFunctions.getData(state, variantId);
      case "contactFormSection":
        return contactFormSectionFunctions.getData(state, variantId);
      case "applicationForm":
        return applicationFormFunctions.getData(state, variantId);
      case "inputs":
        return inputsFunctions.getData(state, variantId);
      case "inputs2":
        return inputs2Functions.getData(state, variantId);
      case "imageText":
        return imageTextFunctions.getData(state, variantId);
      case "contactUsHomePage":
        return contactUsHomePageFunctions.getData(state, variantId);
      case "blogsSections":
        return blogsSectionsFunctions.getData(state, variantId);
      case "title":
        return titleFunctions.getData(state, variantId);
      case "responsiveImage":
        return responsiveImageFunctions.getData(state, variantId);
      case "photosGrid":
        return photosGridFunctions.getData(state, variantId);
      case "video":
        return videoFunctions.getData(state, variantId);
      default:
        // Fallback to generic component data with default data creation
        const data = state.componentStates[componentType]?.[variantId];
        if (!data || Object.keys(data).length === 0) {
          const defaultData = createDefaultData(componentType);
          return defaultData;
        }
        return data;
    }
  },

  setComponentData: (componentType, variantId, data) =>
    set((state) => {
      // Use specific component functions first for better consistency
      let newState: any = {};

      switch (componentType) {
        case "hero":
          newState = heroFunctions.setData(state, variantId, data);
          break;
        case "header":
          newState = headerFunctions.setData(state, variantId, data);
          break;
        case "footer":
          newState = footerFunctions.setData(state, variantId, data);
          break;
        case "halfTextHalfImage":
          newState = halfTextHalfImageFunctions.setData(state, variantId, data);
          break;
        case "propertySlider":
          newState = propertySliderFunctions.setData(state, variantId, data);
          break;
        case "ctaValuation":
          newState = ctaValuationFunctions.setData(state, variantId, data);
          break;
        case "stepsSection":
          newState = stepsSectionFunctions.setData(state, variantId, data);
          break;
        case "testimonials":
          newState = testimonialsFunctions.setData(state, variantId, data);
          break;
        case "projectDetails":
          newState = projectDetailsFunctions.setData(state, variantId, data);
          break;
        case "propertyDetail":
          newState = propertyDetailFunctions.setData(state, variantId, data);
          break;
        case "propertiesShowcase":
          newState = propertiesShowcaseFunctions.setData(
            state,
            variantId,
            data,
          );
          break;
        case "card":
          // Determine which card variant based on variantId
          if (variantId.includes("card5") || variantId === "card5") {
            newState = card5Functions.setData(state, variantId, data);
          } else {
            newState = card4Functions.setData(state, variantId, data);
          }
          break;
        case "logosTicker":
          newState = logosTickerFunctions.setData(state, variantId, data);
          break;
        case "partners":
          newState = partnersFunctions.setData(state, variantId, data);
          break;
        case "whyChooseUs":
          newState = whyChooseUsFunctions.setData(state, variantId, data);
          break;
        case "contactMapSection":
          newState = contactMapSectionFunctions.setData(state, variantId, data);
          break;
        case "grid":
          newState = gridFunctions.setData(state, variantId, data);
          break;
        case "filterButtons":
          newState = filterButtonsFunctions.setData(state, variantId, data);
          break;
        case "propertyFilter":
          newState = propertyFilterFunctions.setData(state, variantId, data);
          // Debug: Log propertyFilter data save
          if (variantId === "1") {
            console.group("💾 setComponentData Debug for propertyFilter");
            console.log("VariantId:", variantId);
            console.log("Data to save:", data);
            console.log("NewState:", newState);
            console.log(
              "PropertyFilterStates after save:",
              newState.propertyFilterStates,
            );
            console.groupEnd();
          }
          break;
        case "mapSection":
          newState = mapSectionFunctions.setData(state, variantId, data);
          break;
        case "contactFormSection":
          newState = contactFormSectionFunctions.setData(
            state,
            variantId,
            data,
          );
          break;
        case "contactCards":
          newState = contactCardsFunctions.setData(state, variantId, data);
          break;
        case "contactFormSection":
          newState = contactFormSectionFunctions.setData(
            state,
            variantId,
            data,
          );
          break;
        case "applicationForm":
          newState = applicationFormFunctions.setData(state, variantId, data);
          break;
        case "inputs":
          newState = inputsFunctions.setData(state, variantId, data);
          break;
        case "inputs2":
          newState = inputs2Functions.setData(state, variantId, data);
          break;
        case "imageText":
          newState = imageTextFunctions.setData(state, variantId, data);
          break;
        case "contactUsHomePage":
          newState = contactUsHomePageFunctions.setData(state, variantId, data);
          break;
        case "blogsSections":
          newState = blogsSectionsFunctions.setData(state, variantId, data);
          break;
        case "title":
          newState = titleFunctions.setData(state, variantId, data);
          break;
        case "responsiveImage":
          newState = responsiveImageFunctions.setData(state, variantId, data);
          break;
        case "photosGrid":
          newState = photosGridFunctions.setData(state, variantId, data);
          break;
        case "video":
          newState = videoFunctions.setData(state, variantId, data);
          break;
        default:
          // Fallback to generic component handling
          newState = {
            componentStates: {
              ...state.componentStates,
              [componentType]: {
                ...state.componentStates[componentType],
                [variantId]: data,
              },
            },
          } as any;
      }

      // Update pageComponents with the new data
      const updatedState = { ...state, ...newState };
      const updatedPageComponents =
        updatedState.pageComponentsByPage[updatedState.currentPage] || [];

      // Find and update the component in pageComponents
      const updatedComponents = updatedPageComponents.map((comp: any) => {
        if (comp.type === componentType && comp.id === variantId) {
          return {
            ...comp,
            data: data,
          };
        }
        return comp;
      });

      return {
        ...newState,
        pageComponentsByPage: {
          ...updatedState.pageComponentsByPage,
          [updatedState.currentPage]: updatedComponents,
        },
      };
    }),

  updateComponentByPath: (componentType, variantId, path, value) =>
    set((state) => {
      // Use specific component functions first for better consistency
      let newState: any = {};

      switch (componentType) {
        case "hero":
          newState = heroFunctions.updateByPath(state, variantId, path, value);
          break;
        case "header":
          newState = headerFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "footer":
          newState = footerFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "halfTextHalfImage":
          newState = halfTextHalfImageFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "propertySlider":
          newState = propertySliderFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "ctaValuation":
          newState = ctaValuationFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "stepsSection":
          newState = stepsSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "testimonials":
          newState = testimonialsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "projectDetails":
          newState = projectDetailsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "propertyDetail":
          newState = propertyDetailFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "propertiesShowcase":
          newState = propertiesShowcaseFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "card":
          // Determine which card variant based on variantId
          if (variantId.includes("card5") || variantId === "card5") {
            newState = card5Functions.updateByPath(
              state,
              variantId,
              path,
              value,
            );
          } else {
            newState = card4Functions.updateByPath(
              state,
              variantId,
              path,
              value,
            );
          }
          break;
        case "logosTicker":
          newState = logosTickerFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "partners":
          newState = partnersFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "whyChooseUs":
          newState = whyChooseUsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "contactMapSection":
          newState = contactMapSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "grid":
          newState = gridFunctions.updateByPath(state, variantId, path, value);
          break;
        case "filterButtons":
          newState = filterButtonsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "propertyFilter":
          newState = propertyFilterFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "mapSection":
          newState = mapSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "contactFormSection":
          newState = contactFormSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "contactCards":
          newState = contactCardsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "contactFormSection":
          newState = contactFormSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "applicationForm":
          newState = applicationFormFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "inputs":
          newState = inputsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "inputs2":
          newState = inputs2Functions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "imageText":
          newState = imageTextFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "contactUsHomePage":
          newState = contactUsHomePageFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "blogsSections":
          newState = blogsSectionsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "title":
          newState = titleFunctions.updateByPath(state, variantId, path, value);
          break;
        case "responsiveImage":
          newState = responsiveImageFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "photosGrid":
          newState = photosGridFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "video":
          newState = videoFunctions.updateByPath(state, variantId, path, value);
          break;
        default:
          // Fallback to generic component handling
          const source =
            state.componentStates[componentType]?.[variantId] || {};
          const segments = path
            .replace(/\[(\d+)\]/g, ".$1")
            .split(".")
            .filter(Boolean);
          const newData: any = { ...source };
          let cursor: any = newData;

          for (let i = 0; i < segments.length - 1; i++) {
            const key = segments[i]!;
            const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
            const existing = cursor[key];

            if (
              existing == null ||
              typeof existing === "string" ||
              typeof existing === "number" ||
              typeof existing === "boolean"
            ) {
              cursor[key] = nextIsIndex ? [] : {};
            } else if (Array.isArray(existing) && !nextIsIndex) {
              cursor[key] = {};
            } else if (
              typeof existing === "object" &&
              !Array.isArray(existing) &&
              nextIsIndex
            ) {
              cursor[key] = [];
            }
            cursor = cursor[key];
          }

          const lastKey = segments[segments.length - 1]!;
          cursor[lastKey] = value;

          newState = {
            componentStates: {
              ...state.componentStates,
              [componentType]: {
                ...state.componentStates[componentType],
                [variantId]: newData,
              },
            },
          } as any;
      }

      // Update pageComponents with the new data
      const updatedState = { ...state, ...newState };
      const updatedPageComponents =
        updatedState.pageComponentsByPage[updatedState.currentPage] || [];

      // Find and update the component in pageComponents
      const updatedComponents = updatedPageComponents.map((comp: any) => {
        if (comp.type === componentType && comp.id === variantId) {
          // Get the updated data from the store
          const updatedData =
            updatedState[`${componentType}States`]?.[variantId] || comp.data;
          return {
            ...comp,
            data: updatedData,
          };
        }
        return comp;
      });

      return {
        ...newState,
        pageComponentsByPage: {
          ...updatedState.pageComponentsByPage,
          [updatedState.currentPage]: updatedComponents,
        },
      };
    }),

  // Half Text Half Image functions using modular approach
  ensurehalfTextHalfImageVariant: (variantId, initial) =>
    set((state) =>
      halfTextHalfImageFunctions.ensureVariant(state, variantId, initial),
    ),
  gethalfTextHalfImageData: (variantId) => {
    const state = get();
    return halfTextHalfImageFunctions.getData(state, variantId);
  },
  sethalfTextHalfImageData: (variantId, data) =>
    set((state) => halfTextHalfImageFunctions.setData(state, variantId, data)),
  updatehalfTextHalfImageByPath: (variantId, path, value) =>
    set((state) =>
      halfTextHalfImageFunctions.updateByPath(state, variantId, path, value),
    ),

  // Property Slider functions using modular approach
  ensurePropertySliderVariant: (variantId, initial) =>
    set((state) =>
      propertySliderFunctions.ensureVariant(state, variantId, initial),
    ),
  getPropertySliderData: (variantId) => {
    const state = get();
    return propertySliderFunctions.getData(state, variantId);
  },
  setPropertySliderData: (variantId, data) =>
    set((state) => propertySliderFunctions.setData(state, variantId, data)),
  updatePropertySliderByPath: (variantId, path, value) =>
    set((state) =>
      propertySliderFunctions.updateByPath(state, variantId, path, value),
    ),

  // CTA Valuation functions using modular approach
  ensureCtaValuationVariant: (variantId, initial) =>
    set((state) =>
      ctaValuationFunctions.ensureVariant(state, variantId, initial),
    ),
  getCtaValuationData: (variantId) => {
    const state = get();
    return ctaValuationFunctions.getData(state, variantId);
  },
  setCtaValuationData: (variantId, data) =>
    set((state) => ctaValuationFunctions.setData(state, variantId, data)),
  updateCtaValuationByPath: (variantId, path, value) =>
    set((state) =>
      ctaValuationFunctions.updateByPath(state, variantId, path, value),
    ),

  // Steps Section functions using modular approach
  ensureStepsSectionVariant: (variantId, initial) =>
    set((state) =>
      stepsSectionFunctions.ensureVariant(state, variantId, initial),
    ),
  getStepsSectionData: (variantId) => {
    const state = get();
    return stepsSectionFunctions.getData(state, variantId);
  },
  setStepsSectionData: (variantId, data) =>
    set((state) => stepsSectionFunctions.setData(state, variantId, data)),
  updateStepsSectionByPath: (variantId, path, value) =>
    set((state) =>
      stepsSectionFunctions.updateByPath(state, variantId, path, value),
    ),

  // Testimonials functions using modular approach
  ensureTestimonialsVariant: (variantId, initial) =>
    set((state) =>
      testimonialsFunctions.ensureVariant(state, variantId, initial),
    ),
  getTestimonialsData: (variantId) => {
    const state = get();
    return testimonialsFunctions.getData(state, variantId);
  },
  setTestimonialsData: (variantId, data) =>
    set((state) => testimonialsFunctions.setData(state, variantId, data)),
  updateTestimonialsByPath: (variantId, path, value) =>
    set((state) =>
      testimonialsFunctions.updateByPath(state, variantId, path, value),
    ),

  // Project Details functions using modular approach
  ensureProjectDetailsVariant: (variantId, initial) =>
    set((state) =>
      projectDetailsFunctions.ensureVariant(state, variantId, initial),
    ),
  getProjectDetailsData: (variantId) => {
    const state = get();
    return projectDetailsFunctions.getData(state, variantId);
  },
  setProjectDetailsData: (variantId, data) =>
    set((state) => projectDetailsFunctions.setData(state, variantId, data)),
  updateProjectDetailsByPath: (variantId, path, value) =>
    set((state) =>
      projectDetailsFunctions.updateByPath(state, variantId, path, value),
    ),

  // Property Detail functions using modular approach
  ensurepropertyDetailVariant: (variantId, initial) =>
    set((state) =>
      propertyDetailFunctions.ensureVariant(state, variantId, initial),
    ),
  getpropertyDetailData: (variantId) => {
    const state = get();
    return propertyDetailFunctions.getData(state, variantId);
  },
  setpropertyDetailData: (variantId, data) =>
    set((state) => propertyDetailFunctions.setData(state, variantId, data)),
  updatepropertyDetailByPath: (variantId, path, value) =>
    set((state) =>
      propertyDetailFunctions.updateByPath(state, variantId, path, value),
    ),

  // Properties Showcase specific functions
  ensurePropertiesShowcaseVariant: (variantId, initial) =>
    set((state) =>
      propertiesShowcaseFunctions.ensureVariant(state, variantId, initial),
    ),
  getPropertiesShowcaseData: (variantId) => {
    const state = get();
    return propertiesShowcaseFunctions.getData(state, variantId);
  },
  setPropertiesShowcaseData: (variantId, data) =>
    set((state) => propertiesShowcaseFunctions.setData(state, variantId, data)),
  updatePropertiesShowcaseByPath: (variantId, path, value) =>
    set((state) =>
      propertiesShowcaseFunctions.updateByPath(state, variantId, path, value),
    ),

  // Card4 specific functions
  ensureCard4Variant: (variantId, initial) =>
    set((state) => card4Functions.ensureVariant(state, variantId, initial)),
  getCard4Data: (variantId) => {
    const state = get();
    return card4Functions.getData(state, variantId);
  },
  setCard4Data: (variantId, data) =>
    set((state) => card4Functions.setData(state, variantId, data)),
  updateCard4ByPath: (variantId, path, value) =>
    set((state) => card4Functions.updateByPath(state, variantId, path, value)),

  // Card5 specific functions
  ensureCard5Variant: (variantId, initial) =>
    set((state) => card5Functions.ensureVariant(state, variantId, initial)),
  getCard5Data: (variantId) => {
    const state = get();
    return card5Functions.getData(state, variantId);
  },
  setCard5Data: (variantId, data) =>
    set((state) => card5Functions.setData(state, variantId, data)),
  updateCard5ByPath: (variantId, path, value) =>
    set((state) => card5Functions.updateByPath(state, variantId, path, value)),

  // Partners functions using modular approach
  ensurePartnersVariant: (variantId, initial) =>
    set((state) => partnersFunctions.ensureVariant(state, variantId, initial)),
  getPartnersData: (variantId) => {
    const state = get();
    return partnersFunctions.getData(state, variantId);
  },
  setPartnersData: (variantId, data) =>
    set((state) => partnersFunctions.setData(state, variantId, data)),
  updatePartnersByPath: (variantId, path, value) =>
    set((state) =>
      partnersFunctions.updateByPath(state, variantId, path, value),
    ),

  // Logos Ticker functions using modular approach
  ensureLogosTickerVariant: (variantId, initial) =>
    set((state) =>
      logosTickerFunctions.ensureVariant(state, variantId, initial),
    ),
  getLogosTickerData: (variantId) => {
    const state = get();
    return logosTickerFunctions.getData(state, variantId);
  },
  setLogosTickerData: (variantId, data) =>
    set((state) => logosTickerFunctions.setData(state, variantId, data)),
  updateLogosTickerByPath: (variantId, path, value) =>
    set((state) =>
      logosTickerFunctions.updateByPath(state, variantId, path, value),
    ),

  // Why Choose Us functions using modular approach
  ensureWhyChooseUsVariant: (variantId, initial) =>
    set((state) =>
      whyChooseUsFunctions.ensureVariant(state, variantId, initial),
    ),
  getWhyChooseUsData: (variantId) => {
    const state = get();
    return whyChooseUsFunctions.getData(state, variantId);
  },
  setWhyChooseUsData: (variantId, data) =>
    set((state) => whyChooseUsFunctions.setData(state, variantId, data)),
  updateWhyChooseUsByPath: (variantId, path, value) =>
    set((state) =>
      whyChooseUsFunctions.updateByPath(state, variantId, path, value),
    ),

  // Contact Map Section functions using modular approach
  ensureContactMapSectionVariant: (variantId, initial) =>
    set((state) =>
      contactMapSectionFunctions.ensureVariant(state, variantId, initial),
    ),
  getContactMapSectionData: (variantId) => {
    const state = get();
    return contactMapSectionFunctions.getData(state, variantId);
  },
  setContactMapSectionData: (variantId, data) =>
    set((state) => contactMapSectionFunctions.setData(state, variantId, data)),
  updateContactMapSectionByPath: (variantId, path, value) =>
    set((state) =>
      contactMapSectionFunctions.updateByPath(state, variantId, path, value),
    ),

  // Grid functions using modular approach
  ensureGridVariant: (variantId, initial) =>
    set((state) => gridFunctions.ensureVariant(state, variantId, initial)),
  getGridData: (variantId) => {
    const state = get();
    return gridFunctions.getData(state, variantId);
  },
  setGridData: (variantId, data) =>
    set((state) => gridFunctions.setData(state, variantId, data)),
  updateGridByPath: (variantId, path, value) =>
    set((state) => gridFunctions.updateByPath(state, variantId, path, value)),

  // Filter Buttons functions using modular approach
  ensureFilterButtonsVariant: (variantId, initial) =>
    set((state) =>
      filterButtonsFunctions.ensureVariant(state, variantId, initial),
    ),
  getFilterButtonsData: (variantId) => {
    const state = get();
    return filterButtonsFunctions.getData(state, variantId);
  },
  setFilterButtonsData: (variantId, data) =>
    set((state) => filterButtonsFunctions.setData(state, variantId, data)),
  updateFilterButtonsByPath: (variantId, path, value) =>
    set((state) =>
      filterButtonsFunctions.updateByPath(state, variantId, path, value),
    ),

  // Property Filter functions using modular approach
  ensurePropertyFilterVariant: (variantId, initial) =>
    set((state) =>
      propertyFilterFunctions.ensureVariant(state, variantId, initial),
    ),
  getPropertyFilterData: (variantId) => {
    const state = get();
    return propertyFilterFunctions.getData(state, variantId);
  },
  setPropertyFilterData: (variantId, data) =>
    set((state) => propertyFilterFunctions.setData(state, variantId, data)),
  updatePropertyFilterByPath: (variantId, path, value) =>
    set((state) =>
      propertyFilterFunctions.updateByPath(state, variantId, path, value),
    ),

  // Map Section functions using modular approach
  ensureMapSectionVariant: (variantId, initial) =>
    set((state) =>
      mapSectionFunctions.ensureVariant(state, variantId, initial),
    ),
  getMapSectionData: (variantId) => {
    const state = get();
    return mapSectionFunctions.getData(state, variantId);
  },
  setMapSectionData: (variantId, data) =>
    set((state) => mapSectionFunctions.setData(state, variantId, data)),
  updateMapSectionByPath: (variantId, path, value) =>
    set((state) =>
      mapSectionFunctions.updateByPath(state, variantId, path, value),
    ),

  // Contact Form Section functions using modular approach
  ensureContactFormSectionVariant: (variantId, initial) =>
    set((state) => {
      const newState = contactFormSectionFunctions.ensureVariant(
        state,
        variantId,
        initial,
      );
      return {
        ...state,
        contactFormSectionStates: newState.contactFormSectionStates,
      };
    }),
  getContactFormSectionData: (variantId) => {
    const state = get();
    return contactFormSectionFunctions.getData(state, variantId);
  },
  setContactFormSectionData: (variantId, data) =>
    set((state) => {
      const newState = contactFormSectionFunctions.setData(
        state,
        variantId,
        data,
      );
      return {
        ...state,
        contactFormSectionStates: newState.contactFormSectionStates,
      };
    }),
  updateContactFormSectionByPath: (variantId, path, value) =>
    set((state) => {
      const newState = contactFormSectionFunctions.updateByPath(
        state,
        variantId,
        path,
        value,
      );
      return {
        ...state,
        contactFormSectionStates: newState.contactFormSectionStates,
        pageComponentsByPage: newState.pageComponentsByPage,
      };
    }),

  // Contact Cards functions using modular approach
  ensureContactCardsVariant: (variantId, initial) =>
    set((state) =>
      contactCardsFunctions.ensureVariant(state, variantId, initial),
    ),
  getContactCardsData: (variantId) => {
    const state = get();
    return contactCardsFunctions.getData(state, variantId);
  },
  setContactCardsData: (variantId, data) =>
    set((state) => contactCardsFunctions.setData(state, variantId, data)),
  updateContactCardsByPath: (variantId, path, value) =>
    set((state) =>
      contactCardsFunctions.updateByPath(state, variantId, path, value),
    ),

  // Application Form functions using modular approach
  ensureApplicationFormVariant: (variantId, initial) =>
    set((state) =>
      applicationFormFunctions.ensureVariant(state, variantId, initial),
    ),
  getApplicationFormData: (variantId) => {
    const state = get();
    return applicationFormFunctions.getData(state, variantId);
  },
  setApplicationFormData: (variantId, data) =>
    set((state) => applicationFormFunctions.setData(state, variantId, data)),
  updateApplicationFormByPath: (variantId, path, value) =>
    set((state) =>
      applicationFormFunctions.updateByPath(state, variantId, path, value),
    ),

  // Inputs functions using modular approach
  ensureInputsVariant: (variantId, initial) =>
    set((state) => inputsFunctions.ensureVariant(state, variantId, initial)),
  getInputsData: (variantId) => {
    const state = get();
    return inputsFunctions.getData(state, variantId);
  },
  setInputsData: (variantId, data) =>
    set((state) => inputsFunctions.setData(state, variantId, data)),
  updateInputsByPath: (variantId, path, value) =>
    set((state) => inputsFunctions.updateByPath(state, variantId, path, value)),

  // Inputs2 functions using modular approach
  ensureInputs2Variant: (variantId, initial) =>
    set((state) => inputs2Functions.ensureVariant(state, variantId, initial)),
  getInputs2Data: (variantId) => {
    const state = get();
    return inputs2Functions.getData(state, variantId);
  },
  setInputs2Data: (variantId, data) =>
    set((state) => inputs2Functions.setData(state, variantId, data)),
  updateInputs2ByPath: (variantId, path, value) =>
    set((state) =>
      inputs2Functions.updateByPath(state, variantId, path, value),
    ),

  // Image Text functions using modular approach
  ensureImageTextVariant: (variantId, initial) =>
    set((state) => imageTextFunctions.ensureVariant(state, variantId, initial)),
  getImageTextData: (variantId) => {
    const state = get();
    return imageTextFunctions.getData(state, variantId);
  },
  setImageTextData: (variantId, data) =>
    set((state) => imageTextFunctions.setData(state, variantId, data)),
  updateImageTextByPath: (variantId, path, value) =>
    set((state) =>
      imageTextFunctions.updateByPath(state, variantId, path, value),
    ),

  // ContactUsHomePage functions using modular approach
  ensureContactUsHomePageVariant: (variantId, initial) =>
    set((state) =>
      contactUsHomePageFunctions.ensureVariant(state, variantId, initial),
    ),
  getContactUsHomePageData: (variantId) => {
    const state = get();
    return contactUsHomePageFunctions.getData(state, variantId);
  },
  setContactUsHomePageData: (variantId, data) =>
    set((state) => contactUsHomePageFunctions.setData(state, variantId, data)),
  updateContactUsHomePageByPath: (variantId, path, value) =>
    set((state) =>
      contactUsHomePageFunctions.updateByPath(state, variantId, path, value),
    ),

  // Blogs Sections functions using modular approach
  ensureBlogsSectionsVariant: (variantId, initial) =>
    set((state) =>
      blogsSectionsFunctions.ensureVariant(state, variantId, initial),
    ),
  getBlogsSectionsData: (variantId) => {
    const state = get();
    return blogsSectionsFunctions.getData(state, variantId);
  },
  setBlogsSectionsData: (variantId, data) =>
    set((state) => blogsSectionsFunctions.setData(state, variantId, data)),
  updateBlogsSectionsByPath: (variantId, path, value) =>
    set((state) =>
      blogsSectionsFunctions.updateByPath(state, variantId, path, value),
    ),

  // Title specific functions
  ensureTitleVariant: (variantId, initial) =>
    set((state) => titleFunctions.ensureVariant(state, variantId, initial)),
  getTitleData: (variantId) => {
    const state = get();
    return titleFunctions.getData(state, variantId);
  },
  setTitleData: (variantId, data) =>
    set((state) => titleFunctions.setData(state, variantId, data)),
  updateTitleByPath: (variantId, path, value) =>
    set((state) => titleFunctions.updateByPath(state, variantId, path, value)),

  // Responsive Image specific functions
  ensureResponsiveImageVariant: (variantId, initial) =>
    set((state) =>
      responsiveImageFunctions.ensureVariant(state, variantId, initial),
    ),
  getResponsiveImageData: (variantId) => {
    const state = get();
    return responsiveImageFunctions.getData(state, variantId);
  },
  setResponsiveImageData: (variantId, data) =>
    set((state) => responsiveImageFunctions.setData(state, variantId, data)),
  updateResponsiveImageByPath: (variantId, path, value) =>
    set((state) =>
      responsiveImageFunctions.updateByPath(state, variantId, path, value),
    ),

  // Photos Grid specific functions
  ensurePhotosGridVariant: (variantId, initial) =>
    set((state) =>
      photosGridFunctions.ensureVariant(state, variantId, initial),
    ),
  getPhotosGridData: (variantId) => {
    const state = get();
    return photosGridFunctions.getData(state, variantId);
  },
  setPhotosGridData: (variantId, data) =>
    set((state) => photosGridFunctions.setData(state, variantId, data)),
  updatePhotosGridByPath: (variantId, path, value) =>
    set((state) =>
      photosGridFunctions.updateByPath(state, variantId, path, value),
    ),

  // Video specific functions
  ensureVideoVariant: (variantId, initial) =>
    set((state) => videoFunctions.ensureVariant(state, variantId, initial)),
  getVideoData: (variantId) => {
    const state = get();
    return videoFunctions.getData(state, variantId);
  },
  setVideoData: (variantId, data) =>
    set((state) => videoFunctions.setData(state, variantId, data)),
  updateVideoByPath: (variantId, path, value) =>
    set((state) => videoFunctions.updateByPath(state, variantId, path, value)),

  // Page components management
  setPageComponentsForPage: (page, components) =>
    set((state) => {
      const withPositions: ComponentInstanceWithPosition[] = components.map(
        (c, index) => ({ ...c, position: index }),
      );
      return {
        pageComponentsByPage: {
          ...state.pageComponentsByPage,
          [page]: withPositions,
        },
      } as any;
    }),

  // ═══════════════════════════════════════════════════════════
  // STATIC PAGES MANAGEMENT
  // ═══════════════════════════════════════════════════════════

  // Set static page data
  setStaticPageData: (slug, data) =>
    set((state) => {
      console.log(`📝 Setting static page data for: ${slug}`, data);

      // ⭐ NEW: If theme change is in progress, ensure immediate update
      // If themeChangeTimestamp is recent (within last 5 seconds),
      // this is likely a theme change - ensure update
      const isThemeChangeInProgress =
        state.themeChangeTimestamp > Date.now() - 5000;

      if (isThemeChangeInProgress) {
        console.log(
          `[setStaticPageData] Theme change in progress, ensuring immediate update for: ${slug}`,
        );
      }

      return {
        staticPagesData: {
          ...state.staticPagesData,
          [slug]: data,
        },
      };
    }),

  // Get static page data
  getStaticPageData: (slug) => {
    const state = get();
    return state.staticPagesData[slug] || null;
  },

  loadFromDatabase: (tenantData) =>
    set((state) => {
      if (!tenantData?.componentSettings) {
        return {} as any;
      }

      const newState: any = { ...state };

      // Load Global Header and Footer data
      if (
        tenantData.globalHeaderData &&
        Object.keys(tenantData.globalHeaderData).length > 0
      ) {
        newState.globalHeaderData = tenantData.globalHeaderData;
      } else {
        // Only initialize with default header data if not already set in editorStore
        if (
          !state.globalHeaderData ||
          Object.keys(state.globalHeaderData).length === 0
        ) {
          const defaultHeaderData = getDefaultHeaderData();
          newState.globalHeaderData = defaultHeaderData;
        } else {
          // Keep existing globalHeaderData from editorStore
          newState.globalHeaderData = state.globalHeaderData;
        }
      }

      if (
        tenantData.globalFooterData &&
        Object.keys(tenantData.globalFooterData).length > 0
      ) {
        newState.globalFooterData = tenantData.globalFooterData;
      } else {
        // Only initialize with default footer data if not already set in editorStore
        if (
          !state.globalFooterData ||
          Object.keys(state.globalFooterData).length === 0
        ) {
          const defaultFooterData = getDefaultFooterData();
          newState.globalFooterData = defaultFooterData;
        } else {
          // Keep existing globalFooterData from editorStore
          newState.globalFooterData = state.globalFooterData;
        }
      }

      // Load WebsiteLayout including currentTheme
      if (tenantData.WebsiteLayout) {
        newState.WebsiteLayout = {
          ...state.WebsiteLayout,
          ...tenantData.WebsiteLayout,
          currentTheme: tenantData.WebsiteLayout.currentTheme || null,
        };
      } else {
        // Preserve existing WebsiteLayout if not in tenantData
        newState.WebsiteLayout = state.WebsiteLayout;
      }

      // Load theme backups from ThemesBackup object (NEW: separate field)
      // Regex pattern /^Theme\d+Backup$/ supports any number (1, 2, 10, 11, 100, etc.)
      if (
        tenantData.ThemesBackup &&
        typeof tenantData.ThemesBackup === "object"
      ) {
        // Store backups in separate ThemesBackup field
        newState.ThemesBackup = { ...tenantData.ThemesBackup };

        // Auto-detect and set themeBackup and themeBackupKey from loaded backups
        // Find first available backup that is NOT the current theme
        const currentTheme = newState.WebsiteLayout?.currentTheme;
        let foundBackupKey: string | null = null;
        let foundBackupData: Record<string, any> | null = null;

        Object.entries(tenantData.ThemesBackup).forEach(
          ([backupKey, backupData]) => {
            if (backupKey.match(/^Theme\d+Backup$/)) {
              // Extract theme number from backup key
              const themeMatch = backupKey.match(/^Theme(\d+)Backup$/);
              const backupThemeNumber = themeMatch
                ? parseInt(themeMatch[1], 10)
                : null;

              // Only use backup if it's not the current theme and we haven't found one yet
              if (
                backupThemeNumber !== null &&
                backupThemeNumber !== currentTheme &&
                !foundBackupKey
              ) {
                if (
                  backupData &&
                  typeof backupData === "object" &&
                  Object.keys(backupData).length > 0
                ) {
                  foundBackupKey = backupKey;
                  foundBackupData = backupData as Record<string, any>;
                }
              }
            }
          },
        );

        // Set themeBackup and themeBackupKey if we found a valid backup
        if (foundBackupKey && foundBackupData) {
          newState.themeBackup = foundBackupData;
          newState.themeBackupKey = foundBackupKey;
        }
      } else {
        // Initialize empty ThemesBackup if not in database
        newState.ThemesBackup = {};
      }

      // Preserve existing backup state if not in tenantData
      if (!tenantData.ThemesBackup) {
        newState.themeBackup = state.themeBackup;
        newState.themeBackupKey = state.themeBackupKey;
      }

      // Load Global Components Data
      if (
        tenantData.globalComponentsData &&
        Object.keys(tenantData.globalComponentsData).length > 0
      ) {
        newState.globalComponentsData = tenantData.globalComponentsData;

        // ⭐ Load globalHeaderVariant from globalComponentsData
        if (tenantData.globalComponentsData.globalHeaderVariant) {
          newState.globalHeaderVariant =
            tenantData.globalComponentsData.globalHeaderVariant;
        } else if (tenantData.globalComponentsData.header?.variant) {
          newState.globalHeaderVariant =
            tenantData.globalComponentsData.header.variant;
        }

        // ⭐ Load globalFooterVariant from globalComponentsData
        if (tenantData.globalComponentsData.globalFooterVariant) {
          newState.globalFooterVariant =
            tenantData.globalComponentsData.globalFooterVariant;
        } else if (tenantData.globalComponentsData.footer?.variant) {
          newState.globalFooterVariant =
            tenantData.globalComponentsData.footer.variant;
        }
      } else {
        // Only initialize with default data if not already set in editorStore
        if (
          !state.globalComponentsData ||
          Object.keys(state.globalComponentsData).length === 0
        ) {
          const defaultHeaderData = getDefaultHeaderData();
          const defaultFooterData = getDefaultFooterData();
          newState.globalComponentsData = {
            header: defaultHeaderData,
            footer: defaultFooterData,
          };
        } else {
          // Keep existing globalComponentsData from editorStore
          newState.globalComponentsData = state.globalComponentsData;
        }
      }

      // ⭐ PRIORITY 1: Load staticPagesData from tenantData.staticPagesData (if exists)
      // This is the new format that comes from API after theme changes
      if (
        tenantData.staticPagesData &&
        typeof tenantData.staticPagesData === "object" &&
        Object.keys(tenantData.staticPagesData).length > 0
      ) {
        newState.staticPagesData = {
          ...state.staticPagesData,
          ...tenantData.staticPagesData,
        };
        console.log(
          "[loadFromDatabase] Loaded staticPagesData from tenantData.staticPagesData:",
          Object.keys(tenantData.staticPagesData),
        );
      }

      // ⭐ PRIORITY 2: Load StaticPages data (separate from regular pages)
      // Convert StaticPages format: handle [slug, components, apiEndpoints] and { slug, components, apiEndpoints }
      if (
        tenantData.StaticPages &&
        typeof tenantData.StaticPages === "object"
      ) {
        // Convert StaticPages format: handle both [slug, components, apiEndpoints] and { slug, components, apiEndpoints }
        const convertedStaticPages: Record<string, any> = {};

        Object.entries(tenantData.StaticPages).forEach(
          ([pageSlug, pageData]: [string, any]) => {
            // Only convert if not already in staticPagesData (Priority 1 takes precedence)
            if (!newState.staticPagesData[pageSlug]) {
              // Format: [slug, components, apiEndpoints]
              if (Array.isArray(pageData) && pageData.length >= 2) {
                const slug = pageData[0] || pageSlug;
                const components = Array.isArray(pageData[1])
                  ? pageData[1]
                  : [];
                const apiEndpoints = pageData[2] || {};

                convertedStaticPages[pageSlug] = {
                  slug,
                  components,
                  apiEndpoints,
                };
              }
              // Format: { slug, components, apiEndpoints }
              else if (
                typeof pageData === "object" &&
                !Array.isArray(pageData)
              ) {
                convertedStaticPages[pageSlug] = {
                  slug: pageData.slug || pageSlug,
                  components: Array.isArray(pageData.components)
                    ? pageData.components
                    : [],
                  apiEndpoints: pageData.apiEndpoints || {},
                };
              }
            }
          },
        );

        // Merge converted StaticPages into staticPagesData (only if not already present)
        if (Object.keys(convertedStaticPages).length > 0) {
          newState.staticPagesData = {
            ...newState.staticPagesData,
            ...convertedStaticPages,
          };
          console.log(
            "[loadFromDatabase] Converted StaticPages to staticPagesData:",
            Object.keys(convertedStaticPages),
          );
        }
      }

      // ⭐ FALLBACK: Load StaticPages from defaultData.json if not in tenantData
      // This ensures newly added static pages (like create-request) are always available
      if (defaultData?.StaticPages && typeof defaultData.StaticPages === "object") {
        const defaultStaticPages: Record<string, any> = {};

        Object.entries(defaultData.StaticPages).forEach(
          ([pageSlug, pageData]: [string, any]) => {
            // Only load if page doesn't already exist in staticPagesData (from tenantData)
            if (!newState.staticPagesData[pageSlug]) {
              // Handle both formats: { slug, components } or direct object
              if (
                typeof pageData === "object" &&
                !Array.isArray(pageData) &&
                pageData.slug &&
                Array.isArray(pageData.components)
              ) {
                // Format: { slug, components }
                defaultStaticPages[pageSlug] = {
                  slug: pageData.slug || pageSlug,
                  components: pageData.components || [],
                };
              }
            }
          },
        );

        // Merge default StaticPages into staticPagesData (only if not already present)
        if (Object.keys(defaultStaticPages).length > 0) {
          newState.staticPagesData = {
            ...newState.staticPagesData,
            ...defaultStaticPages,
          };
        }
      }

      // Load page components from componentSettings (regular pages only)
      // ⚠️ Note: Static pages should NOT be in componentSettings
      Object.entries(tenantData.componentSettings).forEach(
        ([page, pageSettings]: [string, any]) => {
          const normalizedSettings = normalizeComponentSettings(pageSettings);
          if (Object.keys(normalizedSettings).length > 0) {
            const components = Object.entries(normalizedSettings).map(
              ([id, comp]: [string, any]) => ({
                id,
                ...comp,
                position: comp.position ?? 0,
              }),
            );
            newState.pageComponentsByPage[page] = components;
          }
        },
      );

      // Load component data into respective stores using modular functions
      Object.entries(tenantData.componentSettings).forEach(
        ([page, pageSettings]: [string, any]) => {
          const normalizedSettings = normalizeComponentSettings(pageSettings);
          Object.entries(normalizedSettings).forEach(
            ([id, comp]: [string, any]) => {
              if (comp.data && comp.componentName) {
                switch (comp.type) {
                    case "header":
                      newState.headerStates = headerFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).headerStates;
                      break;
                    case "hero":
                      newState.heroStates = heroFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).heroStates;
                      break;
                    case "halfTextHalfImage":
                      newState.halfTextHalfImageStates =
                        halfTextHalfImageFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).halfTextHalfImageStates;
                      break;
                    case "propertySlider":
                      newState.propertySliderStates =
                        propertySliderFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).propertySliderStates;
                      break;
                    case "ctaValuation":
                      newState.ctaValuationStates =
                        ctaValuationFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).ctaValuationStates;
                      break;
                    case "stepsSection":
                      newState.stepsSectionStates =
                        stepsSectionFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).stepsSectionStates;
                      break;
                    case "testimonials":
                      newState.testimonialsStates =
                        testimonialsFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).testimonialsStates;
                      break;
                    case "projectDetails":
                      newState.projectDetailsStates =
                        projectDetailsFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).projectDetailsStates;
                      break;
                    case "propertyDetail":
                      newState.propertyDetailStates =
                        propertyDetailFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).propertyDetailStates;
                      break;
                    case "propertiesShowcase":
                      newState.propertiesShowcaseStates =
                        propertiesShowcaseFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).propertiesShowcaseStates;
                      break;
                    case "card":
                      // Determine which card variant based on componentName
                      if (
                        comp.componentName === "card5" ||
                        comp.id?.includes("card5")
                      ) {
                        newState.card5States = card5Functions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).card5States;
                      } else {
                        newState.card4States = card4Functions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).card4States;
                      }
                      break;
                    case "whyChooseUs":
                      newState.whyChooseUsStates = whyChooseUsFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).whyChooseUsStates;
                      break;
                    case "logosTicker":
                      newState.logosTickerStates = logosTickerFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).logosTickerStates;
                      break;
                    case "partners":
                      newState.partnersStates = partnersFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).partnersStates;
                      break;
                    case "contactMapSection":
                      newState.contactMapSectionStates =
                        contactMapSectionFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).contactMapSectionStates;
                      break;
                    case "footer":
                      newState.footerStates = footerFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).footerStates;
                      break;
                    case "grid":
                      newState.gridStates = gridFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).gridStates;
                      break;
                    case "filterButtons":
                      newState.filterButtonsStates =
                        filterButtonsFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).filterButtonsStates;
                      break;
                    case "propertyFilter":
                      newState.propertyFilterStates =
                        propertyFilterFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).propertyFilterStates;
                      break;
                    case "mapSection":
                      newState.mapSectionStates = mapSectionFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).mapSectionStates;
                      break;
                    case "contactFormSection":
                      newState.contactFormSectionStates =
                        contactFormSectionFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).contactFormSectionStates;
                      break;
                    case "contactCards":
                      newState.contactCardsStates =
                        contactCardsFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).contactCardsStates;
                      break;
                    case "applicationForm":
                      newState.applicationFormStates =
                        applicationFormFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).applicationFormStates;
                      break;
                    case "inputs":
                      newState.inputsStates = inputsFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).inputsStates;
                      break;
                    case "inputs2":
                      newState.inputs2States = inputs2Functions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).inputs2States;
                      break;
                    case "imageText":
                      newState.imageTextStates = imageTextFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).imageTextStates;
                      break;
                    case "contactUsHomePage":
                      newState.contactUsHomePageStates =
                        contactUsHomePageFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).contactUsHomePageStates;
                      break;
                    case "blogsSections":
                      newState.blogsSectionsStates =
                        blogsSectionsFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).blogsSectionsStates;
                      break;
                    case "title":
                      newState.titleStates = titleFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).titleStates;
                      break;
                    case "responsiveImage":
                      newState.responsiveImageStates =
                        responsiveImageFunctions.setData(
                          newState,
                          comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                          comp.data,
                        ).responsiveImageStates;
                      break;
                    case "photosGrid":
                      newState.photosGridStates = photosGridFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).photosGridStates;
                      break;
                    case "video":
                      newState.videoStates = videoFunctions.setData(
                        newState,
                        comp.id, // ✅ استخدام comp.id بدلاً من comp.componentName
                        comp.data,
                      ).videoStates;
                      break;
                  }
                }
              },
            );
          }
        ,
      );

      // Initialize default inputs2 data if no inputs2 components exist in database
      const hasInputs2InDatabase = Object.values(
        tenantData.componentSettings || {},
      ).some((pageSettings: any) => {
        if (!pageSettings || typeof pageSettings !== "object") return false;
        return Object.values(pageSettings).some(
          (comp: any) => comp.type === "inputs2",
        );
      });

      if (!hasInputs2InDatabase) {
        const defaultInputs2Data = getDefaultInputs2Data();
        newState.inputs2States = {
          ...newState.inputs2States,
          "inputs2-default": defaultInputs2Data,
        };
      }

      return newState;
    }),

  createPage: (pageData) =>
    set((state) => {
      const newState: any = { ...state };

      if (pageData.components) {
        newState.pageComponentsByPage[pageData.slug] = pageData.components;

        // Initialize component data using modular functions
        pageData.components.forEach((comp) => {
          switch (comp.type) {
            case "header":
              newState.headerStates = headerFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).headerStates;
              break;
            case "hero":
              newState.heroStates = heroFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).heroStates;
              break;
            case "halfTextHalfImage":
              newState.halfTextHalfImageStates =
                halfTextHalfImageFunctions.setData(
                  newState,
                  comp.componentName,
                  comp.data,
                ).halfTextHalfImageStates;
              break;
            case "propertySlider":
              newState.propertySliderStates = propertySliderFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).propertySliderStates;
              break;
            case "ctaValuation":
              newState.ctaValuationStates = ctaValuationFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).ctaValuationStates;
              break;
            case "stepsSection":
              newState.stepsSectionStates = stepsSectionFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).stepsSectionStates;
              break;
            case "testimonials":
              newState.testimonialsStates = testimonialsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).testimonialsStates;
              break;
            case "projectDetails":
              newState.projectDetailsStates = projectDetailsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).projectDetailsStates;
              break;
            case "propertyDetail":
              newState.propertyDetailStates = propertyDetailFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).propertyDetailStates;
              break;
            case "whyChooseUs":
              newState.whyChooseUsStates = whyChooseUsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).whyChooseUsStates;
              break;
            case "contactMapSection":
              newState.contactMapSectionStates =
                contactMapSectionFunctions.setData(
                  newState,
                  comp.componentName,
                  comp.data,
                ).contactMapSectionStates;
              break;
            case "footer":
              newState.footerStates = footerFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).footerStates;
              break;
            case "grid":
              newState.gridStates = gridFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).gridStates;
              break;
            case "filterButtons":
              newState.filterButtonsStates = filterButtonsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).filterButtonsStates;
              break;
            case "propertyFilter":
              newState.propertyFilterStates = propertyFilterFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).propertyFilterStates;
              break;
            case "mapSection":
              newState.mapSectionStates = mapSectionFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).mapSectionStates;
              break;
            case "contactFormSection":
              newState.contactFormSectionStates =
                contactFormSectionFunctions.setData(
                  newState,
                  comp.componentName,
                  comp.data,
                ).contactFormSectionStates;
              break;
            case "contactCards":
              newState.contactCardsStates = contactCardsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).contactCardsStates;
              break;
            case "applicationForm":
              newState.applicationFormStates = applicationFormFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).applicationFormStates;
              break;
            case "inputs":
              newState.inputsStates = inputsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).inputsStates;
              break;
            case "inputs2":
              newState.inputs2States = inputs2Functions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).inputs2States;
              break;
            case "imageText":
              newState.imageTextStates = imageTextFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).imageTextStates;
              break;
            case "contactUsHomePage":
              newState.contactUsHomePageStates =
                contactUsHomePageFunctions.setData(
                  newState,
                  comp.componentName,
                  comp.data,
                ).contactUsHomePageStates;
              break;
            case "blogsSections":
              newState.blogsSectionsStates = blogsSectionsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).blogsSectionsStates;
              break;
            case "responsiveImage":
              newState.responsiveImageStates = responsiveImageFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).responsiveImageStates;
              break;
            case "photosGrid":
              newState.photosGridStates = photosGridFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).photosGridStates;
              break;
            case "video":
              newState.videoStates = videoFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).videoStates;
              break;
            case "contactFormSection":
              newState.contactFormSectionStates =
                contactFormSectionFunctions.setData(
                  newState,
                  comp.componentName,
                  comp.data,
                ).contactFormSectionStates;
              break;
          }
        });
      }

      return newState;
    }),

  getAllPages: () => {
    const state = get();
    return Object.keys(state.pageComponentsByPage);
  },

  deletePage: (slug) =>
    set((state) => {
      const newPageComponentsByPage = { ...state.pageComponentsByPage };
      delete newPageComponentsByPage[slug];
      return { pageComponentsByPage: newPageComponentsByPage } as any;
    }),

  forceUpdatePageComponents: (slug, components) =>
    set((state) => {
      return {
        pageComponentsByPage: {
          ...state.pageComponentsByPage,
          [slug]: components,
        },
      };
    }),

  // WebsiteLayout functions
  setWebsiteLayout: (data) =>
    set((state) => ({
      WebsiteLayout: data,
    })),

  addPageToWebsiteLayout: (pageData) =>
    set((state) => ({
      WebsiteLayout: {
        ...state.WebsiteLayout,
        metaTags: {
          ...state.WebsiteLayout.metaTags,
          pages: [...state.WebsiteLayout.metaTags.pages, pageData],
        },
      },
    })),

  setCurrentTheme: (themeNumber) =>
    set((state) => ({
      WebsiteLayout: {
        ...state.WebsiteLayout,
        currentTheme: themeNumber,
      },
      themeChangeTimestamp: Date.now(), // Force sync after theme change
    })),

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

  // Clear all states (for theme change)
  clearAllStates: () =>
    set((state) => {
      // Get default header and footer data
      const defaultHeaderData = getDefaultHeaderData();
      const defaultFooterData = getDefaultFooterData();

      return {
        // Clear all component type states
        heroStates: {},
        headerStates: {},
        footerStates: {},
        halfTextHalfImageStates: {},
        propertySliderStates: {},
        ctaValuationStates: {},
        stepsSectionStates: {},
        testimonialsStates: {},
        projectDetailsStates: {},
        propertyDetailStates: {},
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
        inputsStates: {},
        inputs2States: {},
        imageTextStates: {},
        contactUsHomePageStates: {},
        blogsSectionsStates: {},
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
}));
