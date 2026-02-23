import { ComponentData } from "@/lib/types";

export type OpenDialogFn = () => void;

export type ComponentInstanceWithPosition = {
  id: string;
  type: string;
  name: string;
  componentName: string;
  data: ComponentData;
  position: number;
};

export interface EditorStore {
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
    CustomBranding?: {
      header: {
        logo: string;
        name: string;
      };
      footer: {
        logo: string;
        name: string;
      };
    };
  };
  setWebsiteLayout: (data: any) => void;
  updateCustomBranding: (
    type: "header" | "footer",
    data: { logo?: string; name?: string },
  ) => void;
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
  heroBannerStates: Record<string, ComponentData>;
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

  // Side By Side states
  sideBySideStates: Record<string, ComponentData>;
  ensureSideBySideVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getSideBySideData: (variantId: string) => ComponentData;
  setSideBySideData: (variantId: string, data: ComponentData) => void;
  updateSideBySideByPath: (
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
  // Blog Details states
  blogDetailsStates: Record<string, ComponentData>;
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

  // Blog Details functions
  ensureBlogDetailsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getBlogDetailsData: (variantId: string) => ComponentData;
  setBlogDetailsData: (variantId: string, data: ComponentData) => void;
  updateBlogDetailsByPath: (
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

  // Job Form states
  jobFormStates: Record<string, ComponentData>;
  ensureJobFormVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getJobFormData: (variantId: string) => ComponentData;
  setJobFormData: (variantId: string, data: ComponentData) => void;
  updateJobFormByPath: (
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
  blogCardStates: Record<string, ComponentData>;
  ensureBlogCardVariant: (variantId: string, initial?: ComponentData) => void;
  getBlogCardData: (variantId: string) => ComponentData;
  setBlogCardData: (variantId: string, data: ComponentData) => void;
  updateBlogCardByPath: (variantId: string, path: string, value: any) => void;
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

  // Components Sidebar states
  isComponentsSidebarOpen: boolean;
  isTabsContentOpen: boolean;
  wasComponentsSidebarManuallyClosed: boolean;
  setIsComponentsSidebarOpen: (isOpen: boolean) => void;
  setIsTabsContentOpen: (isOpen: boolean) => void;
  setWasComponentsSidebarManuallyClosed: (wasClosed: boolean) => void;

  // Clear all states (for theme change)
  clearAllStates: () => void;
}
