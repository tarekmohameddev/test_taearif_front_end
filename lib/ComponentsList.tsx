// ملف مركزي لإدارة جميع المكونات والخدمات في النظام
// Central file for managing all components and services in the system

/*
كيفية استخدام الدوال المترجمة:

1. استيراد دالة الترجمة:
   import { useEditorT } from "@/context/editorI18nStore";
   const t = useEditorT();

2. استخدام الدوال المترجمة:
   - getAllComponentsTranslated(t) - للحصول على جميع المكونات مترجمة
   - getAllSectionsTranslated(t) - للحصول على جميع الأقسام مترجمة
   - getComponentByIdTranslated('hero', t) - للحصول على مكون محدد مترجم
   - getSectionByIdTranslated('homepage', t) - للحصول على قسم محدد مترجم

3. مثال على الاستخدام في مكون React:
   const components = getAllComponentsTranslated(t);
   const sections = getAllSectionsTranslated(t);

ملاحظة: الدوال القديمة (بدون Translated) تبقى متاحة للتوافق مع الكود الموجود
*/

import { heroStructure } from "@/componentsStructure/hero";
import { useEditorT } from "@/context/editorI18nStore";
import { headerStructure } from "@/componentsStructure/header";
import { propertiesShowcaseStructure } from "@/componentsStructure/propertiesShowcase";
import { halfTextHalfImageStructure } from "@/componentsStructure/halfTextHalfImage";
import { propertySliderStructure } from "@/componentsStructure/propertySlider";
import { ctaValuationStructure } from "@/componentsStructure/ctaValuation";
import { stepsSectionStructure } from "@/componentsStructure/stepsSection";
import { footerStructure } from "@/componentsStructure/footer";
import { testimonialsStructure } from "@/componentsStructure/testimonials";
import { projectDetailsStructure } from "@/componentsStructure/projectDetails";
import { propertyDetailStructure } from "@/componentsStructure/propertyDetail";
import { logosTickerStructure } from "@/componentsStructure/logosTicker";
import { partnersStructure } from "@/componentsStructure/partners";
import { contactMapSectionStructure } from "@/componentsStructure/contactMapSection";
import { whyChooseUsStructure } from "@/componentsStructure/whyChooseUs";
import { gridStructure } from "@/componentsStructure/grid";
import { filterButtonsStructure } from "@/componentsStructure/filterButtons";
import { propertyFilterStructure } from "@/componentsStructure/propertyFilter";
import { mapSectionStructure } from "@/componentsStructure/mapSection";
import { contactFormSectionStructure } from "@/componentsStructure/contactFormSection";
import { contactCardsStructure } from "@/componentsStructure/contactCards";
import { cardStructure } from "@/componentsStructure/card";
import { propertiesPageStructure } from "@/componentsStructure/propertiesPage";
import { inputsStructure } from "@/componentsStructure/inputs";
import { inputs2Structure } from "@/componentsStructure/inputs2";
import { imageTextStructure } from "@/componentsStructure/imageText";
import { contactUsHomePageStructure } from "@/componentsStructure/contactUsHomePage";
import { blogsSectionsStructure } from "@/componentsStructure/blogsSections";
import { responsiveImageStructure } from "@/componentsStructure/responsiveImage";
import { titleStructure } from "@/componentsStructure/title";
import { videoStructure } from "@/componentsStructure/video";
import { photosGridStructure } from "@/componentsStructure/photosGrid";

export interface ComponentType {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  section: string;
  subPath: string;
  variants: any[];
  icon: string;
  hasStore?: boolean;
  hasStructure?: boolean;
  defaultTheme?: string;
}

export interface SectionType {
  id: string;
  name: string;
  displayName: string;
  path: string;
  description: string;
  icon: string;
  components: string[];
}

// دالة للحصول على الأقسام مع الترجمة
export const getSections = (
  t: (key: string) => string,
): Record<string, SectionType> => ({
  homepage: {
    id: "homepage",
    name: "homepage",
    displayName: t("sections.homepage.display_name"),
    path: "homepage",
    description: t("sections.homepage.description"),
    icon: "🏠",
    components: [
      "header",
      "hero",
      "halfTextHalfImage",
      "propertySlider",
      "ctaValuation",
      "stepsSection",
      "whyChooseUs",
      "testimonials",
      "contactMapSection",
      "footer",
      "grid",
      "filterButtons",
      "propertyFilter",
      "mapSection",
      "contactFormSection",
      "contactCards",
      "contactUsHomePage",
      "responsiveImage",
      "title",
      "video",
      "photosGrid",
      "propertiesPage",
      "inputs",
      "inputs2",
    ],
  },
});

// قائمة جميع الأقسام المتاحة (للتوافق مع الكود الموجود)
export const SECTIONS: Record<string, SectionType> = {
  homepage: {
    id: "homepage",
    name: "homepage",
    displayName: "الصفحة الرئيسية",
    path: "homepage",
    description: "مكونات الصفحة الرئيسية للموقع",
    icon: "🏠",
    components: [
      "header",
      "hero",
      "halfTextHalfImage",
      "propertySlider",
      "ctaValuation",
      "stepsSection",
      "whyChooseUs",
      "testimonials",
      "contactMapSection",
      "footer",
      "grid",
      "filterButtons",
      "propertyFilter",
      "mapSection",
      "contactFormSection",
      "contactCards",
      "propertiesPage",
      "responsiveImage",
      "title",
      "video",
      "photosGrid",
      "inputs",
      "inputs2",
    ],
  },
};

// دالة للحصول على المكونات مع الترجمة
export const getComponents = (
  t: (key: string) => string,
): Record<string, any> => ({
  hero: {
    id: "hero",
    name: "hero",
    displayName: t("components.hero.display_name"),
    description: t("components.hero.description"),
    category: "banner",
    section: "homepage",
    subPath: "hero",
    icon: "🌟",
    defaultTheme: "hero1",
    ...heroStructure,
  },
  header: {
    id: "header",
    name: "header",
    displayName: t("components.header.display_name"),
    description: t("components.header.description"),
    category: "navigation",
    section: "homepage",
    subPath: "header",
    icon: "📄",
    ...headerStructure,
  },
  halfTextHalfImage: {
    id: "halfTextHalfImage",
    name: "halfTextHalfImage",
    displayName: t("components.halfTextHalfImage.display_name"),
    description: t("components.halfTextHalfImage.description"),
    category: "content",
    section: "homepage",
    subPath: "halfTextHalfImage",
    icon: "🖼️",
    ...halfTextHalfImageStructure,
  },
  propertySlider: {
    id: "propertySlider",
    name: "propertySlider",
    displayName: t("components.propertySlider.display_name"),
    description: t("components.propertySlider.description"),
    category: "content",
    section: "homepage",
    subPath: "propertySlider",
    icon: "🏠",
    ...propertySliderStructure,
  },
  ctaValuation: {
    id: "ctaValuation",
    name: "ctaValuation",
    displayName: t("components.ctaValuation.display_name"),
    description: t("components.ctaValuation.description"),
    category: "content",
    section: "homepage",
    subPath: "ctaValuation",
    icon: "💰",
    ...ctaValuationStructure,
  },
  stepsSection: {
    id: "stepsSection",
    name: "stepsSection",
    displayName: t("components.stepsSection.display_name"),
    description: t("components.stepsSection.description"),
    category: "content",
    section: "homepage",
    subPath: "stepsSection",
    icon: "📋",
    ...stepsSectionStructure,
  },
  whyChooseUs: {
    id: "whyChooseUs",
    name: "whyChooseUs",
    displayName: t("components.whyChooseUs.display_name"),
    description: t("components.whyChooseUs.description"),
    category: "content",
    section: "homepage",
    subPath: "whyChooseUs",
    icon: "✨",
    ...whyChooseUsStructure,
  },
  testimonials: {
    id: "testimonials",
    name: "testimonials",
    displayName: t("components.testimonials.display_name"),
    description: t("components.testimonials.description"),
    category: "content",
    section: "homepage",
    subPath: "testimonials",
    icon: "💬",
    ...testimonialsStructure,
  },
  projectDetails: {
    id: "projectDetails",
    name: "projectDetails",
    displayName: t("components.projectDetails.display_name"),
    description: t("components.projectDetails.description"),
    category: "content",
    section: "project",
    subPath: "projectDetails",
    icon: "🏗️",
    hasStore: true,
    hasStructure: true,
    defaultTheme: "projectDetails1",
    variants: projectDetailsStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/projectDetails/${variant.id}.tsx`,
    })),
    ...projectDetailsStructure,
  },
  propertiesShowcase: {
    id: "propertiesShowcase",
    name: "propertiesShowcase",
    displayName: t("components.propertiesShowcase.display_name"),
    description: t("components.propertiesShowcase.description"),
    category: "content",
    section: "homepage",
    subPath: "propertiesShowcase",
    icon: "🏘️",
    ...propertiesShowcaseStructure,
  },
  logosTicker: {
    id: "logosTicker",
    name: "logosTicker",
    displayName: t("components.logosTicker.display_name"),
    description: t("components.logosTicker.description"),
    category: "marketing",
    section: "homepage",
    subPath: "logosTicker",
    icon: "🏢",
    variants: logosTickerStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/logosTicker/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "logosTicker1",
    ...logosTickerStructure,
  },
  partners: {
    id: "partners",
    name: "partners",
    displayName: t("components.partners.display_name"),
    description: t("components.partners.description"),
    category: "marketing",
    section: "homepage",
    subPath: "partners",
    icon: "🤝",
    variants: partnersStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/partners/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "partners1",
    ...partnersStructure,
  },
  contactMapSection: {
    id: "contactMapSection",
    name: "contactMapSection",
    displayName: t("components.contactMapSection.display_name"),
    description: t("components.contactMapSection.description"),
    category: "contact",
    section: "homepage",
    subPath: "contactMapSection",
    icon: "📍",
    ...contactMapSectionStructure,
  },
  footer: {
    id: "footer",
    name: "footer",
    displayName: t("components.footer.display_name"),
    description: t("components.footer.description"),
    category: "navigation",
    section: "homepage",
    subPath: "footer",
    icon: "🔽",
    ...footerStructure,
  },
  grid: {
    id: "grid",
    name: "grid",
    displayName: t("components.grid.display_name"),
    description: t("components.grid.description"),
    category: "content",
    section: "homepage",
    subPath: "grid",
    icon: "🏗️",
    ...gridStructure,
  },
  filterButtons: {
    id: "filterButtons",
    name: "filterButtons",
    displayName: t("components.filterButtons.display_name"),
    description: t("components.filterButtons.description"),
    category: "interaction",
    section: "homepage",
    subPath: "filterButtons",
    icon: "🔘",
    ...filterButtonsStructure,
  },
  propertyFilter: {
    id: "propertyFilter",
    name: "propertyFilter",
    displayName: t("components.propertyFilter.display_name"),
    description: t("components.propertyFilter.description"),
    category: "interaction",
    section: "homepage",
    subPath: "propertyFilter",
    icon: "🔍",
    ...propertyFilterStructure,
  },
  mapSection: {
    id: "mapSection",
    name: "mapSection",
    displayName: t("components.mapSection.display_name"),
    description: t("components.mapSection.description"),
    category: "content",
    section: "homepage",
    subPath: "mapSection",
    icon: "🗺️",
    ...mapSectionStructure,
  },
  contactFormSection: {
    id: "contactFormSection",
    name: "contactFormSection",
    displayName: t("components.contactFormSection.display_name"),
    description: t("components.contactFormSection.description"),
    category: "content",
    section: "homepage",
    subPath: "contactFormSection",
    icon: "📝",
    ...contactFormSectionStructure,
  },
  contactCards: {
    id: "contactCards",
    name: "contactCards",
    displayName: t("components.contactCards.display_name"),
    description: t("components.contactCards.description"),
    category: "content",
    section: "homepage",
    subPath: "contactCards",
    icon: "📇",
    ...contactCardsStructure,
  },
  contactUsHomePage: {
    id: "contactUsHomePage",
    name: "contactUsHomePage",
    displayName: t("components.contactUsHomePage.display_name"),
    description: t("components.contactUsHomePage.description"),
    category: "content",
    section: "homepage",
    subPath: "contactUsHomePage",
    icon: "📧",
    ...contactUsHomePageStructure,
  },
  blogsSections: {
    id: "blogsSections",
    name: "blogsSections",
    displayName: t("components.blogsSections.display_name"),
    description: t("components.blogsSections.description"),
    category: "content",
    section: "homepage",
    subPath: "blogsSections",
    icon: "📰",
    variants: blogsSectionsStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/blogsSections/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "blogsSections1",
    ...blogsSectionsStructure,
  },

  responsiveImage: {
    id: "responsiveImage",
    name: "responsiveImage",
    displayName: t("components.responsiveImage.display_name"),
    description: t("components.responsiveImage.description"),
    category: "content",
    section: "homepage",
    subPath: "responsiveImage",
    icon: "🖼️",
    variants: responsiveImageStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/responsiveImage/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "responsiveImage1",
    ...responsiveImageStructure,
  },
  title: {
    id: "title",
    name: "title",
    displayName: t("components.title.display_name"),
    description: t("components.title.description"),
    category: "content",
    section: "homepage",
    subPath: "title",
    variants: titleStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/title/${variant.id}.tsx`,
    })),
    icon: "🔠",
    hasStore: true,
    hasStructure: true,
    defaultTheme: "title1",
    ...titleStructure,
  },
  video: {
    id: "video",
    name: "video",
    displayName: t("components.video.display_name"),
    description: t("components.video.description"),
    category: "media",
    section: "homepage",
    subPath: "video",
    icon: "🎥",
    variants: videoStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/video/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "video1",
    ...videoStructure,
  },
  photosGrid: {
    id: "photosGrid",
    name: "photosGrid",
    displayName: t("components.photosGrid.display_name"),
    description: t("components.photosGrid.description"),
    category: "content",
    section: "homepage",
    subPath: "photosGrid",
    icon: "🖼️",
    variants: photosGridStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/photosGrid/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "photosGrid1",
    ...photosGridStructure,
  },
  propertiesPage: {
    id: "propertiesPage",
    name: "propertiesPage",
    displayName: t("components.propertiesPage.display_name"),
    description: t("components.propertiesPage.description"),
    category: "page",
    section: "homepage",
    subPath: "propertiesPage",
    icon: "🏘️",
    ...propertiesPageStructure,
  },
  inputs: {
    id: "inputs",
    name: "inputs",
    displayName: t("components.inputs.display_name"),
    description: t("components.inputs.description"),
    category: "form",
    section: "homepage",
    subPath: "inputs",
    icon: "📝",
    ...inputsStructure,
  },
  inputs2: {
    id: "inputs2",
    name: "inputs2",
    displayName: t("components.inputs2.display_name"),
    description: t("components.inputs2.description"),
    category: "form",
    section: "homepage",
    subPath: "inputs2",
    icon: "📝",
    ...inputs2Structure,
  },
  imageText: {
    id: "imageText",
    name: "imageText",
    displayName: t("components.imageText.display_name"),
    description: t("components.imageText.description"),
    category: "content",
    section: "homepage",
    subPath: "imageText",
    icon: "🖼️",
    variants: imageTextStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/imageText/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "imageText1",
    ...imageTextStructure,
  },
});

// قائمة جميع المكونات المتاحة (للتوافق مع الكود الموجود)
export const COMPONENTS: Record<string, any> = {
  hero: {
    id: "hero",
    name: "hero",
    displayName: "Hero",
    description:
      "Main banner section with compelling headline and call-to-action",
    category: "banner",
    section: "homepage",
    subPath: "hero",
    icon: "🌟",
    defaultTheme: "hero1",
    ...heroStructure,
  },
  header: {
    id: "header",
    name: "header",
    displayName: "Header",
    description: "Navigation bar with logo, menu, and user actions",
    category: "navigation",
    section: "homepage",
    subPath: "header",
    icon: "📄",
    ...headerStructure,
  },
  halfTextHalfImage: {
    id: "halfTextHalfImage",
    name: "halfTextHalfImage",
    displayName: "Half Text Half Image",
    description: "Section with text content and image side by side",
    category: "content",
    section: "homepage",
    subPath: "halfTextHalfImage",
    icon: "🖼️",
    ...halfTextHalfImageStructure,
  },
  propertySlider: {
    id: "propertySlider",
    name: "propertySlider",
    displayName: "Property Slider",
    description:
      "Carousel section displaying property cards in a slider format",
    category: "content",
    section: "homepage",
    subPath: "propertySlider",
    icon: "🏠",
    ...propertySliderStructure,
  },
  ctaValuation: {
    id: "ctaValuation",
    name: "ctaValuation",
    displayName: "CTA Valuation",
    description: "Call-to-action section with valuation content and image",
    category: "content",
    section: "homepage",
    subPath: "ctaValuation",
    icon: "💰",
    ...ctaValuationStructure,
  },
  stepsSection: {
    id: "stepsSection",
    name: "stepsSection",
    displayName: "Steps Section",
    description: "Section displaying steps or process in a grid layout",
    category: "content",
    section: "homepage",
    subPath: "stepsSection",
    icon: "📋",
    ...stepsSectionStructure,
  },
  whyChooseUs: {
    id: "whyChooseUs",
    name: "whyChooseUs",
    displayName: "Why Choose Us",
    description:
      "Section displaying features and reasons to choose the service",
    category: "content",
    section: "homepage",
    subPath: "whyChooseUs",
    icon: "✨",
    ...whyChooseUsStructure,
  },
  testimonials: {
    id: "testimonials",
    name: "testimonials",
    displayName: "Testimonials",
    description:
      "Section displaying customer testimonials and reviews in a carousel format",
    category: "content",
    section: "homepage",
    subPath: "testimonials",
    icon: "💬",
    ...testimonialsStructure,
  },
  projectDetails: {
    id: "projectDetails",
    name: "projectDetails",
    displayName: "Project Details",
    description:
      "Display real estate project details with images, specifications, and similar projects",
    category: "content",
    section: "project",
    subPath: "projectDetails",
    icon: "🏗️",
    hasStore: true,
    hasStructure: true,
    defaultTheme: "projectDetails1",
    variants: projectDetailsStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/projectDetails/${variant.id}.tsx`,
    })),
    ...projectDetailsStructure,
  },
  propertyDetail: {
    id: "propertyDetail",
    name: "propertyDetail",
    displayName: "Property Detail",
    description: "Property detail page with hero layout",
    category: "content",
    section: "property",
    subPath: "propertyDetail",
    icon: "🏠",
    hasStore: true,
    hasStructure: true,
    defaultTheme: "propertyDetail2",
    variants: propertyDetailStructure.variants.map((variant) => {
      // Convert propertyDetail1 -> propertyDetail1, propertyDetail2 -> propertyDetail2
      // Handle both lowercase and mixed case
      const fileName = variant.id.replace(/^propertyDetail/i, "propertyDetail");
      return {
        ...variant,
        componentPath: `components/tenant/propertyDetail/${fileName}.tsx`,
      };
    }),
    ...propertyDetailStructure,
  },
  propertiesShowcase: {
    id: "propertiesShowcase",
    name: "propertiesShowcase",
    displayName: "Properties Showcase",
    description: "Section displaying properties and projects in a grid layout",
    category: "content",
    section: "homepage",
    subPath: "propertiesShowcase",
    icon: "🏘️",
    ...propertiesShowcaseStructure,
  },
  logosTicker: {
    id: "logosTicker",
    name: "logosTicker",
    displayName: "Logos Ticker",
    description:
      "Scrolling logos section displaying trusted brands and partners",
    category: "marketing",
    section: "homepage",
    subPath: "logosTicker",
    icon: "🏢",
    variants: logosTickerStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/logosTicker/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "logosTicker1",
    ...logosTickerStructure,
  },
  partners: {
    id: "partners",
    name: "partners",
    displayName: "Partners",
    description:
      "Trusted partners section displaying partner logos in a grid layout",
    category: "marketing",
    section: "homepage",
    subPath: "partners",
    icon: "🤝",
    variants: partnersStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/partners/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "partners1",
    ...partnersStructure,
  },
  contactMapSection: {
    id: "contactMapSection",
    name: "contactMapSection",
    displayName: "Contact Map Section",
    description: "Section displaying a map for contact information",
    category: "contact",
    section: "homepage",
    subPath: "contactMapSection",
    icon: "📍",
    ...contactMapSectionStructure,
  },
  footer: {
    id: "footer",
    name: "footer",
    displayName: "Footer",
    description:
      "Footer section with company information, links, and contact details",
    category: "navigation",
    section: "homepage",
    subPath: "footer",
    icon: "🔽",
    ...footerStructure,
  },
  grid: {
    id: "grid",
    name: "grid",
    displayName: "Property Grid",
    description:
      "Grid layout for displaying property cards in a responsive grid",
    category: "content",
    section: "homepage",
    subPath: "grid",
    icon: "🏗️",
    ...gridStructure,
  },
  filterButtons: {
    id: "filterButtons",
    name: "filterButtons",
    displayName: "Filter Buttons",
    description:
      "Filter buttons for property status (available, sold, rented) with inspection request button",
    category: "interaction",
    section: "homepage",
    subPath: "filterButtons",
    icon: "🔘",
    ...filterButtonsStructure,
  },
  propertyFilter: {
    id: "propertyFilter",
    name: "propertyFilter",
    displayName: "Property Filter",
    description:
      "Search and filter form for properties with location, type, and price filters",
    category: "interaction",
    section: "homepage",
    subPath: "propertyFilter",
    icon: "🔍",
    ...propertyFilterStructure,
  },
  mapSection: {
    id: "mapSection",
    name: "mapSection",
    displayName: "Map Section",
    description:
      "Interactive map section with markers, info windows, and customizable content overlay",
    category: "content",
    section: "homepage",
    subPath: "mapSection",
    icon: "🗺️",
    ...mapSectionStructure,
  },
  contactFormSection: {
    id: "contactFormSection",
    name: "contactFormSection",
    displayName: "Contact Form Section",
    description:
      "Contact form section with social media links and contact form",
    category: "content",
    section: "homepage",
    subPath: "contactFormSection",
    icon: "📝",
    ...contactFormSectionStructure,
  },
  contactCards: {
    id: "contactCards",
    name: "contactCards",
    displayName: "Contact Cards",
    description: "Contact information cards with icons, titles, and content",
    category: "content",
    section: "homepage",
    subPath: "contactCards",
    icon: "📇",
    ...contactCardsStructure,
  },
  card: {
    id: "card",
    name: "card",
    displayName: "Card",
    description: "Property card component with multiple variants",
    category: "content",
    section: "homepage",
    subPath: "card",
    icon: "🃏",
    variants: cardStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/cards/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "card4",
    ...cardStructure,
  },
  contactUsHomePage: {
    id: "contactUsHomePage",
    name: "contactUsHomePage",
    displayName: "Contact Us Home Page",
    description: "Contact form for homepage with background image",
    category: "content",
    section: "homepage",
    subPath: "contactUsHomePage",
    icon: "📧",
    ...contactUsHomePageStructure,
  },
  blogsSections: {
    id: "blogsSections",
    name: "blogsSections",
    displayName: "Blogs Sections",
    description: "Blog cards section with paragraphs and grid layout",
    category: "content",
    section: "homepage",
    subPath: "blogsSections",
    icon: "📰",
    variants: blogsSectionsStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/blogsSections/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "blogsSections1",
    ...blogsSectionsStructure,
  },
  responsiveImage: {
    id: "responsiveImage",
    name: "responsiveImage",
    displayName: "Responsive Image",
    description: "Responsive image with comfortable width for all screen sizes",
    category: "content",
    section: "homepage",
    subPath: "responsiveImage",
    icon: "🖼️",
    variants: responsiveImageStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/responsiveImage/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "responsiveImage1",
    ...responsiveImageStructure,
  },
  title: {
    id: "title",
    name: "title",
    displayName: "Title",
    description: "Centered title text block",
    category: "content",
    section: "homepage",
    subPath: "title",
    variants: titleStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/title/${variant.id}.tsx`,
    })),
    icon: "🔠",
    hasStore: true,
    hasStructure: true,
    defaultTheme: "title1",
    ...titleStructure,
  },
  video: {
    id: "video",
    name: "video",
    displayName: "Video",
    description: "Responsive video player with fixed max width for all screens",
    category: "media",
    section: "homepage",
    subPath: "video",
    icon: "🎥",
    variants: videoStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/video/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "video1",
    ...videoStructure,
  },
  photosGrid: {
    id: "photosGrid",
    name: "photosGrid",
    displayName: "Photos Grid",
    description: "Responsive grid gallery for showcasing photos with captions",
    category: "content",
    section: "homepage",
    subPath: "photosGrid",
    icon: "🖼️",
    variants: photosGridStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/photosGrid/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "photosGrid1",
    ...photosGridStructure,
  },
  propertiesPage: {
    id: "propertiesPage",
    name: "propertiesPage",
    displayName: "Properties Page",
    description:
      "Complete properties listing page with filter, search, and grid components",
    category: "page",
    section: "homepage",
    subPath: "propertiesPage",
    icon: "🏘️",
    ...propertiesPageStructure,
  },
  inputs: {
    id: "inputs",
    name: "inputs",
    displayName: "Advanced Inputs System",
    description:
      "Dynamic form system with customizable cards, fields, and validation",
    category: "form",
    section: "homepage",
    subPath: "inputs",
    icon: "📝",
    ...inputsStructure,
  },
  inputs2: {
    id: "inputs2",
    name: "inputs2",
    displayName: "Advanced Inputs System 2",
    description:
      "Enhanced dynamic form system with improved cards, fields, and validation",
    category: "form",
    section: "homepage",
    subPath: "inputs2",
    icon: "📝",
    ...inputs2Structure,
  },
  imageText: {
    id: "imageText",
    name: "imageText",
    displayName: "Image Text",
    description: "Background image with text overlay section",
    category: "content",
    section: "homepage",
    subPath: "imageText",
    icon: "🖼️",
    variants: imageTextStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/imageText/${variant.id}.tsx`,
    })),
    hasStore: true,
    hasStructure: true,
    defaultTheme: "imageText1",
    ...imageTextStructure,
  },
};

// Helper Functions
export const getComponentById = (id: string): ComponentType | undefined => {
  return COMPONENTS[id];
};

export const getComponentsBySection = (sectionId: string): ComponentType[] => {
  return Object.values(COMPONENTS).filter((comp) => comp.section === sectionId);
};

export const getComponentsByCategory = (category: string): ComponentType[] => {
  return Object.values(COMPONENTS).filter((comp) => comp.category === category);
};

export const getSectionById = (id: string): SectionType | undefined => {
  return SECTIONS[id];
};

export const getAllSections = (): SectionType[] => {
  return Object.values(SECTIONS);
};

export const getAllComponents = (): ComponentType[] => {
  return Object.values(COMPONENTS);
};

// دوال جديدة تدعم الترجمة
// استخدام: const component = getComponentByIdTranslated('hero', t);
export const getComponentByIdTranslated = (
  id: string,
  t: (key: string) => string,
): ComponentType | undefined => {
  const components = getComponents(t);
  return components[id];
};

// استخدام: const components = getComponentsBySectionTranslated('homepage', t);
export const getComponentsBySectionTranslated = (
  sectionId: string,
  t: (key: string) => string,
): ComponentType[] => {
  const components = getComponents(t);
  return Object.values(components).filter((comp) => comp.section === sectionId);
};

// استخدام: const components = getComponentsByCategoryTranslated('content', t);
export const getComponentsByCategoryTranslated = (
  category: string,
  t: (key: string) => string,
): ComponentType[] => {
  const components = getComponents(t);
  return Object.values(components).filter((comp) => comp.category === category);
};

// استخدام: const section = getSectionByIdTranslated('homepage', t);
export const getSectionByIdTranslated = (
  id: string,
  t: (key: string) => string,
): SectionType | undefined => {
  const sections = getSections(t);
  return sections[id];
};

// استخدام: const sections = getAllSectionsTranslated(t);
export const getAllSectionsTranslated = (
  t: (key: string) => string,
): SectionType[] => {
  const sections = getSections(t);
  return Object.values(sections);
};

// استخدام: const components = getAllComponentsTranslated(t);
export const getAllComponentsTranslated = (
  t: (key: string) => string,
): ComponentType[] => {
  const components = getComponents(t);
  return Object.values(components);
};

export const getComponentsByHasStore = (hasStore: boolean): ComponentType[] => {
  return Object.values(COMPONENTS).filter((comp) => comp.hasStore === hasStore);
};

export const getComponentsByHasStructure = (
  hasStructure: boolean,
): ComponentType[] => {
  return Object.values(COMPONENTS).filter(
    (comp) => comp.hasStructure === hasStructure,
  );
};

export const isValidComponentType = (type: string): boolean => {
  return type in COMPONENTS;
};

export const isValidSectionType = (section: string): boolean => {
  return section in SECTIONS;
};

export const getComponentDisplayName = (type: string): string => {
  const component = COMPONENTS[type];
  return component ? component.displayName : type;
};

export const getComponentDefaultTheme = (type: string): string => {
  const component = COMPONENTS[type];
  return component ? component.defaultTheme || `${type}1` : `${type}1`;
};

export const getComponentSubPath = (baseName: string): string | undefined => {
  // ⭐ Handle special case: propertyDetail -> propertyDetail
  // Convert propertyDetail to propertyDetail to match COMPONENTS key
  const normalizedBaseName =
    baseName === "propertyDetail" || baseName.toLowerCase() === "propertydetail"
      ? "propertyDetail"
      : baseName;

  const component = COMPONENTS[normalizedBaseName];
  return component?.subPath;
};

export const getSectionPath = (section: string): string => {
  const sectionObj = SECTIONS[section];
  return sectionObj ? sectionObj.path : section;
};

// دوال إضافية تدعم الترجمة
// استخدام: const components = getComponentsByHasStoreTranslated(true, t);
export const getComponentsByHasStoreTranslated = (
  hasStore: boolean,
  t: (key: string) => string,
): ComponentType[] => {
  const components = getComponents(t);
  return Object.values(components).filter((comp) => comp.hasStore === hasStore);
};

// استخدام: const components = getComponentsByHasStructureTranslated(true, t);
export const getComponentsByHasStructureTranslated = (
  hasStructure: boolean,
  t: (key: string) => string,
): ComponentType[] => {
  const components = getComponents(t);
  return Object.values(components).filter(
    (comp) => comp.hasStructure === hasStructure,
  );
};

// استخدام: const displayName = getComponentDisplayNameTranslated('hero', t);
export const getComponentDisplayNameTranslated = (
  type: string,
  t: (key: string) => string,
): string => {
  const components = getComponents(t);
  const component = components[type];
  return component ? component.displayName : type;
};

// استخدام: const theme = getComponentDefaultThemeTranslated('hero', t);
export const getComponentDefaultThemeTranslated = (
  type: string,
  t: (key: string) => string,
): string => {
  const components = getComponents(t);
  const component = components[type];
  return component ? component.defaultTheme || `${type}1` : `${type}1`;
};

// استخدام: const subPath = getComponentSubPathTranslated('hero', t);
export const getComponentSubPathTranslated = (
  baseName: string,
  t: (key: string) => string,
): string | undefined => {
  const components = getComponents(t);
  const component = components[baseName];
  return component?.subPath;
};

// استخدام: const path = getSectionPathTranslated('homepage', t);
export const getSectionPathTranslated = (
  section: string,
  t: (key: string) => string,
): string => {
  const sections = getSections(t);
  const sectionObj = sections[section];
  return sectionObj ? sectionObj.path : section;
};

// Export types for external use
