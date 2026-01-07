import { ComponentData } from "@/lib/types";
import { AVAILABLE_SECTIONS } from "./constants";
import { getComponentById, COMPONENTS } from "@/lib/ComponentsList";
import {
  getDefaultHalfTextHalfImageData,
  getDefaultHalfTextHalfImage2Data,
  getDefaultHalfTextHalfImage3Data,
  getDefaultHalfTextHalfImage4Data,
  getDefaultHalfTextHalfImage5Data,
  getDefaultHalfTextHalfImage6Data,
  getDefaultHalfTextHalfImage7Data,
} from "@/context/editorStoreFunctions/halfTextHalfImageFunctions";
import { getDefaultInputs2Data } from "@/context/editorStoreFunctions/inputs2Functions";
import { getDefaultTitleData } from "@/context/editorStoreFunctions/titleFunctions";
import { logSidebar } from "@/lib/debugLogger";

// دالة لإنشاء البيانات الافتراضية لكل نوع مكون
export const createDefaultData = (
  type: string,
  componentName?: string,
): ComponentData => {
  // الحصول على معلومات المكون من ComponentsList
  const component = getComponentById(type);

  if (!component) {
    // إذا لم يتم العثور على المكون، إرجاع بيانات افتراضية عامة
    return {
      texts: {
        title: `${type} Title`,
        subtitle: "This is a sample subtitle for the section.",
      },
      colors: {
        background: "#FFFFFF",
        textColor: "#1F2937",
      },
    };
  }

  // إنشاء بيانات افتراضية بناءً على نوع المكون
  switch (type) {
    case "hero":
      return {
        visible: true,
        height: {
          desktop: "90vh",
          tablet: "90vh",
          mobile: "90vh",
        },
        minHeight: {
          desktop: "520px",
          tablet: "520px",
          mobile: "520px",
        },
        background: {
          image: "https://dalel-lovat.vercel.app/images/hero.webp",
          alt: "صورة خلفية لغرفة معيشة حديثة",
          overlay: {
            enabled: true,
            opacity: "0.45",
            color: "#000000",
          },
        },
        content: {
          title: "اكتشف عقارك المثالي في أفضل المواقع",
          subtitle: "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية",
          font: {
            title: {
              family: "Tajawal",
              size: { desktop: "5xl", tablet: "4xl", mobile: "2xl" },
              weight: "extrabold",
              color: "#ffffff",
              lineHeight: "1.25",
            },
            subtitle: {
              family: "Tajawal",
              size: { desktop: "2xl", tablet: "2xl", mobile: "2xl" },
              weight: "normal",
              color: "rgba(255, 255, 255, 0.85)",
            },
          },
          alignment: "center",
          maxWidth: "5xl",
          paddingTop: "200px",
        },
        searchForm: {
          enabled: true,
          position: "bottom",
          offset: "32",
          background: {
            color: "#ffffff",
            opacity: "1",
            shadow: "2xl",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            borderRadius: "lg",
          },
          fields: {
            purpose: {
              enabled: true,
              options: [
                { value: "rent", label: "إيجار" },
                { value: "sell", label: "بيع" },
              ],
              default: "rent",
            },
            city: {
              enabled: true,
              placeholder: "أدخل المدينة أو المنطقة",
              icon: "MapPin",
            },
            type: {
              enabled: true,
              placeholder: "نوع العقار",
              icon: "Home",
              options: ["شقة", "فيلا", "دوبلكس", "أرض", "شاليه", "مكتب"],
            },
            price: {
              enabled: true,
              placeholder: "السعر",
              icon: "CircleDollarSign",
              options: [
                { id: "any", label: "أي سعر" },
                { id: "0-200k", label: "0 - 200 ألف" },
                { id: "200k-500k", label: "200 - 500 ألف" },
                { id: "500k-1m", label: "500 ألف - 1 مليون" },
                { id: "1m+", label: "أكثر من 1 مليون" },
              ],
            },
            keywords: {
              enabled: true,
              placeholder: "كلمات مفتاحية...",
            },
          },
          responsive: {
            desktop: "all-in-row",
            tablet: "two-rows",
            mobile: "stacked",
          },
        },
        animations: {
          title: {
            enabled: true,
            type: "fade-up",
            duration: 600,
            delay: 200,
          },
          subtitle: {
            enabled: true,
            type: "fade-up",
            duration: 600,
            delay: 400,
          },
          searchForm: {
            enabled: true,
            type: "fade-up",
            duration: 600,
            delay: 600,
          },
        },
      };

    case "header":
      return {
        visible: true,
        position: {
          type: "sticky",
          top: 0,
          zIndex: 50,
        },
        height: {
          desktop: 96,
          tablet: 80,
          mobile: 64,
        },
        background: {
          type: "solid",
          opacity: "0.8",
          blur: true,
          colors: {
            from: "#ffffff",
            to: "#ffffff",
          },
        },
        colors: {
          text: "#1f2937",
          link: "#374151",
          linkHover: "#1f2937",
          linkActive: "#059669",
          icon: "#374151",
          iconHover: "#1f2937",
          border: "#e5e7eb",
          accent: "#059669",
        },
        logo: {
          type: "image+text",
          image: "https://dalel-lovat.vercel.app/images/logo.svg",
          text: "الشركة العقارية",
          font: {
            family: "Tajawal",
            size: 24,
            weight: "600",
          },
          url: "/",
          clickAction: "navigate",
        },
        menu: [
          {
            id: "home",
            type: "link",
            text: "الرئيسية",
            url: "/",
          },
          {
            id: "about",
            type: "link",
            text: "حول",
            url: "/about-us",
          },
          {
            id: "services",
            type: "link",
            text: "الخدمات",
            url: "/services",
          },
          {
            id: "contact",
            type: "link",
            text: "اتصل بنا",
            url: "/contact-us",
          },
        ],
        actions: {
          search: {
            enabled: false,
            placeholder: "بحث...",
          },
          user: {
            showProfile: true,
            showCart: false,
            showWishlist: false,
            showNotifications: false,
          },
          mobile: {
            showLogo: true,
            showLanguageToggle: false,
            showSearch: false,
          },
        },
        responsive: {
          breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1280,
          },
          mobileMenu: {
            side: "right",
            width: 320,
            overlay: true,
          },
        },
        animations: {
          menuItems: {
            enabled: true,
            duration: 200,
            delay: 50,
          },
          mobileMenu: {
            enabled: true,
            duration: 300,
            easing: "ease-in-out",
          },
        },
      };

    case "halfTextHalfImage":
      // تحديد البيانات الافتراضية حسب componentName

      // Log the function call
      logSidebar(
        "CREATE_DEFAULT_DATA_CALLED",
        "unknown",
        componentName || "unknown",
        {
          type,
          componentName,
          reason: "Creating default data for component",
        },
      );

      if (componentName === "halfTextHalfImage1") {
        const data = getDefaultHalfTextHalfImageData();
        logSidebar(
          "CREATE_DEFAULT_DATA_RESULT",
          "unknown",
          "halfTextHalfImage1",
          {
            data: data,
            reason: "halfTextHalfImage1 default data",
          },
        );
        return data;
      } else if (componentName === "halfTextHalfImage2") {
        const data = getDefaultHalfTextHalfImage2Data();
        logSidebar(
          "CREATE_DEFAULT_DATA_RESULT",
          "unknown",
          "halfTextHalfImage2",
          {
            data: data,
            reason: "halfTextHalfImage2 default data",
          },
        );
        return data;
      } else if (componentName === "halfTextHalfImage3") {
        const data = getDefaultHalfTextHalfImage3Data();
        logSidebar(
          "CREATE_DEFAULT_DATA_RESULT",
          "unknown",
          "halfTextHalfImage3",
          {
            data: data,
            reason: "halfTextHalfImage3 default data",
          },
        );
        return data;
      } else if (componentName === "halfTextHalfImage4") {
        const data = getDefaultHalfTextHalfImage4Data();
        logSidebar(
          "CREATE_DEFAULT_DATA_RESULT",
          "unknown",
          "halfTextHalfImage4",
          {
            data: data,
            reason: "halfTextHalfImage4 default data",
          },
        );
        return data;
      } else if (componentName === "halfTextHalfImage5") {
        const data = getDefaultHalfTextHalfImage5Data();
        logSidebar(
          "CREATE_DEFAULT_DATA_RESULT",
          "unknown",
          "halfTextHalfImage5",
          {
            data: data,
            reason: "halfTextHalfImage5 default data",
          },
        );
        return data;
      } else if (componentName === "halfTextHalfImage6") {
        const data = getDefaultHalfTextHalfImage6Data();
        logSidebar(
          "CREATE_DEFAULT_DATA_RESULT",
          "unknown",
          "halfTextHalfImage6",
          {
            data: data,
            reason: "halfTextHalfImage6 default data",
          },
        );
        return data;
      } else if (componentName === "halfTextHalfImage7") {
        const data = getDefaultHalfTextHalfImage7Data();
        logSidebar(
          "CREATE_DEFAULT_DATA_RESULT",
          "unknown",
          "halfTextHalfImage7",
          {
            data: data,
            reason: "halfTextHalfImage7 default data",
          },
        );
        return data;
      } else {
        // Fallback للثيم 1 فقط إذا كان componentName غير معروف
        const data = getDefaultHalfTextHalfImageData();
        logSidebar(
          "CREATE_DEFAULT_DATA_RESULT",
          "unknown",
          "halfTextHalfImage1",
          {
            data: data,
            reason: `Fallback for unknown componentName: "${componentName}"`,
          },
        );
        return data;
      }

    case "propertySlider":
      return {
        visible: true,
        layout: {
          maxWidth: "1600px",
          padding: {
            top: "56px",
            bottom: "56px",
          },
        },
        spacing: {
          titleBottom: "24px",
          slideGap: "16px",
        },
        content: {
          title: "أحدث العقارات للإيجار",
          description: "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع",
          viewAllText: "عرض الكل",
          viewAllUrl: "#",
        },
        dataSource: {
          apiUrl:
            "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10",
          enabled: true,
        },
        typography: {
          title: {
            fontFamily: "Tajawal",
            fontSize: {
              desktop: "2xl",
              tablet: "xl",
              mobile: "lg",
            },
            fontWeight: "extrabold",
            color: "#1f2937",
          },
          subtitle: {
            fontFamily: "Tajawal",
            fontSize: {
              desktop: "lg",
              tablet: "base",
              mobile: "sm",
            },
            fontWeight: "normal",
            color: "#6b7280",
          },
          link: {
            fontSize: "sm",
            color: "#059669",
            hoverColor: "#047857",
          },
        },
        carousel: {
          desktopCount: 4,
          autoplay: true,
        },
        background: {
          color: "transparent",
        },
      };

    case "ctaValuation":
      return {
        visible: true,
        content: {
          title: "احصل على تقييم عقارك",
          subtitle: "تقييم عقاري احترافي خلال 24 ساعة",
          description:
            "فريقنا الخبير يوفر تقييمات عقارية دقيقة لمساعدتك في اتخاذ قرارات مستنيرة.",
          button: {
            text: "احصل على تقييم مجاني",
            url: "/valuation",
            style: "primary",
          },
        },
        image: {
          src: "https://dalel-lovat.vercel.app/images/cta-valuation%20section/house.webp",
          alt: "تقييم عقاري",
          position: "right",
        },
        styling: {
          background: "#F9FAFB",
          textColor: "#1F2937",
          buttonColor: "#10B981",
          layout: "split",
        },
      };

    case "contactCards":
      return {
        visible: true,
        layout: {
          container: {
            padding: {
              vertical: "py-[48px] md:py-[104px]",
              horizontal: "px-4 sm:px-10",
            },
          },
          grid: {
            columns: {
              mobile: "grid-cols-1",
              desktop: "md:grid-cols-3",
            },
            gap: "gap-[24px]",
            borderRadius: "rounded-[10px]",
          },
        },
        cards: [
          {
            icon: {
              src: "https://dalel-lovat.vercel.app/images/contact-us/address.svg",
              alt: "address Icon",
              size: {
                mobile: "w-[40px] h-[40px]",
                desktop: "md:w-[60px] md:h-[60px]",
              },
            },
            title: {
              text: "العنوان",
              style: {
                size: {
                  mobile: "text-[16px]",
                  desktop: "md:text-[24px]",
                },
                weight: "font-bold",
                color: "#525252",
                lineHeight: "leading-[35px]",
              },
            },
            content: {
              type: "text",
              text: "المملكة العربية السعودية",
              style: {
                size: {
                  mobile: "text-[16px]",
                  desktop: "md:text-[20px]",
                },
                weight: "font-normal",
                color: "#525252",
                lineHeight: "leading-[35px]",
              },
            },
            cardStyle: {
              height: {
                mobile: "h-[182px]",
                desktop: "md:h-[210px]",
              },
              gap: {
                main: "gap-y-[16px]",
                content: {
                  mobile: "gap-y-[8px]",
                  desktop: "md:gap-y-[16px]",
                },
                links: "gap-x-[50px]",
              },
              shadow: {
                enabled: true,
                value: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
              },
              alignment: {
                horizontal: "items-center",
                vertical: "justify-center",
              },
            },
          },
          {
            icon: {
              src: "https://dalel-lovat.vercel.app/images/contact-us/envelope.svg",
              alt: "email Icon",
              size: {
                mobile: "w-[40px] h-[40px]",
                desktop: "md:w-[60px] md:h-[60px]",
              },
            },
            title: {
              text: "الايميل",
              style: {
                size: {
                  mobile: "text-[16px]",
                  desktop: "md:text-[24px]",
                },
                weight: "font-bold",
                color: "#525252",
                lineHeight: "leading-[35px]",
              },
            },
            content: {
              type: "links",
              links: [
                {
                  text: "guidealjiwa22@gmail.com",
                  href: "mailto:guidealjiwa22@gmail.com",
                },
              ],
              style: {
                size: {
                  mobile: "text-[16px]",
                  desktop: "md:text-[20px]",
                },
                weight: "font-normal",
                color: "#525252",
                lineHeight: "leading-[35px]",
              },
            },
            cardStyle: {
              height: {
                mobile: "h-[182px]",
                desktop: "md:h-[210px]",
              },
              gap: {
                main: "gap-y-[16px]",
                content: {
                  mobile: "gap-y-[8px]",
                  desktop: "md:gap-y-[16px]",
                },
                links: "gap-x-[50px]",
              },
              shadow: {
                enabled: true,
                value: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
              },
              alignment: {
                horizontal: "items-center",
                vertical: "justify-center",
              },
            },
          },
          {
            icon: {
              src: "https://dalel-lovat.vercel.app/images/contact-us/phone.svg",
              alt: "phone Icon",
              size: {
                mobile: "w-[40px] h-[40px]",
                desktop: "md:w-[60px] md:h-[60px]",
              },
            },
            title: {
              text: "الجوال",
              style: {
                size: {
                  mobile: "text-[16px]",
                  desktop: "md:text-[24px]",
                },
                weight: "font-bold",
                color: "#525252",
                lineHeight: "leading-[35px]",
              },
            },
            content: {
              type: "links",
              links: [
                {
                  text: "0535150222",
                  href: "tel:0535150222",
                },
                {
                  text: "0000",
                  href: "tel:0000",
                },
              ],
              style: {
                size: {
                  mobile: "text-[16px]",
                  desktop: "md:text-[20px]",
                },
                weight: "font-normal",
                color: "#525252",
                lineHeight: "leading-[35px]",
              },
            },
            cardStyle: {
              height: {
                mobile: "h-[182px]",
                desktop: "md:h-[210px]",
              },
              gap: {
                main: "gap-y-[16px]",
                content: {
                  mobile: "gap-y-[8px]",
                  desktop: "md:gap-y-[16px]",
                },
                links: "gap-x-[50px]",
              },
              shadow: {
                enabled: true,
                value: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
              },
              alignment: {
                horizontal: "items-center",
                vertical: "justify-center",
              },
            },
          },
        ],
      };

    case "footer":
      // Check componentName to determine which footer theme default data to use
      if (componentName === "footer2" || componentName === "StaticFooter2") {
        // Import getDefaultFooter2Data dynamically to avoid circular dependencies
        const {
          getDefaultFooter2Data,
        } = require("@/context/editorStoreFunctions/footerFunctions");
        return getDefaultFooter2Data();
      }
      // Default to footer1/StaticFooter1
      const {
        getDefaultFooterData,
      } = require("@/context/editorStoreFunctions/footerFunctions");
      return getDefaultFooterData();

    case "inputs2":
      return getDefaultInputs2Data();

    case "title":
      return getDefaultTitleData();

    default:
      // للمكونات الأخرى، إرجاع بيانات افتراضية عامة
      return {
        visible: true,
        texts: {
          title: `${component.displayName || type} Title`,
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      };
  }
};

// دالة لتطبيع مسار الحقل
export const normalizePath = (path: string): string => {
  return path.replace(/\.\[(\d+)\]\./g, ".$1.");
};

// دالة للحصول على قيمة من مسار معين
export const getValueByPath = (obj: any, path: string): any => {
  const segments = normalizePath(path).split(".").filter(Boolean);

  let cursor = obj;
  for (const seg of segments) {
    if (cursor == null) return undefined;
    cursor = cursor[seg];
  }
  return cursor;
};

// دالة لتحديث قيمة في مسار معين
export const updateValueByPath = (obj: any, path: string, value: any): any => {
  const segments = normalizePath(path).split(".").filter(Boolean);

  const result = { ...obj };
  let cursor = result;

  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    if (!(seg in cursor)) {
      cursor[seg] = {};
    }
    cursor = cursor[seg];
  }

  cursor[segments[segments.length - 1]] = value;
  return result;
};
