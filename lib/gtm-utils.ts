// Google Tag Manager Utilities
// Comprehensive GTM integration for deep tracking

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Initialize dataLayer if it doesn't exist
 */
export const initializeDataLayer = () => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    console.log("✅ GTM dataLayer initialized");
  }
};

/**
 * Push event to GTM dataLayer
 */
export const pushToDataLayer = (data: Record<string, any>) => {
  if (typeof window !== "undefined") {
    if (!window.dataLayer) {
      initializeDataLayer();
    }
    window.dataLayer.push(data);
    console.log("📊 GTM Event Pushed:", data);
  }
};

/**
 * Track page view
 */
export const trackPageView = (url: string, title?: string) => {
  pushToDataLayer({
    event: "pageview",
    page: {
      url,
      title: title || (typeof document !== "undefined" ? document.title : ""),
      path: typeof window !== "undefined" ? window.location.pathname : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track virtual page view (for SPA navigation)
 */
export const trackVirtualPageView = (url: string, title: string) => {
  pushToDataLayer({
    event: "virtualPageview",
    page: {
      url,
      title,
      path: url,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track custom event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  pushToDataLayer({
    event: eventName,
    ...eventParams,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track user interaction
 */
export const trackInteraction = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  pushToDataLayer({
    event: "interaction",
    eventAction: action,
    eventCategory: category,
    eventLabel: label,
    eventValue: value,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track button click
 */
export const trackButtonClick = (
  buttonName: string,
  buttonLocation?: string,
  additionalData?: Record<string, any>
) => {
  pushToDataLayer({
    event: "button_click",
    buttonName,
    buttonLocation: buttonLocation || (typeof window !== "undefined" ? window.location.pathname : ""),
    ...additionalData,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track form submission
 */
export const trackFormSubmit = (
  formName: string,
  formId?: string,
  formData?: Record<string, any>
) => {
  pushToDataLayer({
    event: "form_submit",
    formName,
    formId,
    formData,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track form start
 */
export const trackFormStart = (formName: string, formId?: string) => {
  pushToDataLayer({
    event: "form_start",
    formName,
    formId,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track form error
 */
export const trackFormError = (
  formName: string,
  errorField: string,
  errorMessage: string
) => {
  pushToDataLayer({
    event: "form_error",
    formName,
    errorField,
    errorMessage,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track link click
 */
export const trackLinkClick = (
  linkUrl: string,
  linkText?: string,
  linkType?: "internal" | "external" | "download"
) => {
  pushToDataLayer({
    event: "link_click",
    linkUrl,
    linkText,
    linkType,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (depth: number) => {
  pushToDataLayer({
    event: "scroll_depth",
    scrollDepth: depth,
    page: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track video interaction
 */
export const trackVideoEvent = (
  action: "play" | "pause" | "complete" | "seek",
  videoTitle: string,
  videoUrl?: string,
  currentTime?: number
) => {
  pushToDataLayer({
    event: "video_interaction",
    videoAction: action,
    videoTitle,
    videoUrl,
    videoCurrentTime: currentTime,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track search
 */
export const trackSearch = (
  searchTerm: string,
  searchResults?: number,
  searchCategory?: string
) => {
  pushToDataLayer({
    event: "search",
    searchTerm,
    searchResults,
    searchCategory,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track property view (real estate specific)
 */
export const trackPropertyView = (
  propertyId: string,
  propertyData?: Record<string, any>
) => {
  pushToDataLayer({
    event: "property_view",
    propertyId,
    propertyData,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track project view (real estate specific)
 */
export const trackProjectViewGTM = (
  projectId: string,
  projectData?: Record<string, any>
) => {
  pushToDataLayer({
    event: "project_view",
    projectId,
    projectData,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track contact form submission (real estate specific)
 */
export const trackContactFormSubmit = (
  formType: string,
  propertyId?: string,
  projectId?: string
) => {
  pushToDataLayer({
    event: "contact_form_submit",
    formType,
    propertyId,
    projectId,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track phone click
 */
export const trackPhoneClick = (phoneNumber: string, location?: string) => {
  pushToDataLayer({
    event: "phone_click",
    phoneNumber,
    location,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track email click
 */
export const trackEmailClick = (email: string, location?: string) => {
  pushToDataLayer({
    event: "email_click",
    email,
    location,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track WhatsApp click
 */
export const trackWhatsAppClick = (phoneNumber: string, location?: string) => {
  pushToDataLayer({
    event: "whatsapp_click",
    phoneNumber,
    location,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track filter usage
 */
export const trackFilterUsage = (
  filterType: string,
  filterValue: any,
  filterLocation?: string
) => {
  pushToDataLayer({
    event: "filter_usage",
    filterType,
    filterValue,
    filterLocation,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track user engagement
 */
export const trackUserEngagement = (
  engagementType: string,
  engagementData?: Record<string, any>
) => {
  pushToDataLayer({
    event: "user_engagement",
    engagementType,
    ...engagementData,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track error
 */
export const trackError = (
  errorType: string,
  errorMessage: string,
  errorLocation?: string
) => {
  pushToDataLayer({
    event: "error",
    errorType,
    errorMessage,
    errorLocation,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Set user properties
 */
export const setUserProperties = (userProperties: Record<string, any>) => {
  pushToDataLayer({
    event: "user_properties",
    ...userProperties,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track tenant info (for multi-tenant tracking)
 */
export const setTenantInfo = (tenantId: string, tenantData?: Record<string, any>) => {
  pushToDataLayer({
    event: "tenant_info",
    tenantId,
    ...tenantData,
    timestamp: new Date().toISOString(),
  });
};
