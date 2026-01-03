// Default SEO data generator based on slug

export type DefaultSeo = {
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
  "og:url": string | null;
  "og:image": string | null;
  "og:type": string;
  "og:locale": string;
  "og:locale:alternate": string;
  "og:site_name": string;
  "og:image:width": string | number | null;
  "og:image:height": string | number | null;
  "og:image:type": string | null;
  "og:image:alt": string | null;
};

const humanize = (slug: string) =>
  (slug || "homepage")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase()) || "Homepage";

// Static defaults for known pages
const defaultData: Record<string, DefaultSeo> = {
  "/": {
    TitleAr: "الصفحة الرئيسية",
    TitleEn: "Homepage",
    DescriptionAr: "مرحباً بكم في موقعنا - الصفحة الرئيسية",
    DescriptionEn: "Welcome to our website - Homepage",
    KeywordsAr: "الرئيسية, الموقع, الصفحة الرئيسية",
    KeywordsEn: "homepage, main, website",
    Author: "الموقع",
    AuthorEn: "Website",
    Robots: "index, follow",
    RobotsEn: "index, follow",
    "og:title": "الصفحة الرئيسية",
    "og:description": "مرحباً بكم في موقعنا",
    "og:keywords": "الرئيسية, الموقع",
    "og:author": "الموقع",
    "og:robots": "index, follow",
    "og:url": "",
    "og:image": "",
    "og:type": "website",
    "og:locale": "ar",
    "og:locale:alternate": "en",
    "og:site_name": "الموقع",
    "og:image:width": null,
    "og:image:height": null,
    "og:image:type": null,
    "og:image:alt": "الصفحة الرئيسية",
  },
  "": {
    TitleAr: "الصفحة الرئيسية",
    TitleEn: "Homepage",
    DescriptionAr: "مرحباً بكم في موقعنا - الصفحة الرئيسية",
    DescriptionEn: "Welcome to our website - Homepage",
    KeywordsAr: "الرئيسية, الموقع, الصفحة الرئيسية",
    KeywordsEn: "homepage, main, website",
    Author: "الموقع",
    AuthorEn: "Website",
    Robots: "index, follow",
    RobotsEn: "index, follow",
    "og:title": "الصفحة الرئيسية",
    "og:description": "مرحباً بكم في موقعنا",
    "og:keywords": "الرئيسية, الموقع",
    "og:author": "الموقع",
    "og:robots": "index, follow",
    "og:url": "",
    "og:image": "",
    "og:type": "website",
    "og:locale": "ar",
    "og:locale:alternate": "en",
    "og:site_name": "الموقع",
    "og:image:width": null,
    "og:image:height": null,
    "og:image:type": null,
    "og:image:alt": "الصفحة الرئيسية",
  },
  "for-rent": {
    TitleAr: "عقارات للإيجار",
    TitleEn: "For Rent",
    DescriptionAr: "عقارات متاحة للإيجار",
    DescriptionEn: "Properties available for rent",
    KeywordsAr: "للإيجار, عقارات, شقق, منازل",
    KeywordsEn: "for rent, properties, apartments, houses",
    Author: "الموقع",
    AuthorEn: "Website",
    Robots: "index, follow",
    RobotsEn: "index, follow",
    "og:title": "للإيجار",
    "og:description": "عقارات متاحة للإيجار",
    "og:keywords": "للإيجار, عقارات",
    "og:author": "الموقع",
    "og:robots": "index, follow",
    "og:url": "",
    "og:image": "",
    "og:type": "website",
    "og:locale": "ar",
    "og:locale:alternate": "en",
    "og:site_name": "الموقع",
    "og:image:width": null,
    "og:image:height": null,
    "og:image:type": null,
    "og:image:alt": "للإيجار",
  },
  "for-sale": {
    TitleAr: "عقارات للبيع",
    TitleEn: "For Sale",
    DescriptionAr: "عقارات متاحة للبيع",
    DescriptionEn: "Properties available for sale",
    KeywordsAr: "للبيع, عقارات, شقق, منازل",
    KeywordsEn: "for sale, properties, apartments, houses",
    Author: "الموقع",
    AuthorEn: "Website",
    Robots: "index, follow",
    RobotsEn: "index, follow",
    "og:title": "للبيع",
    "og:description": "عقارات متاحة للبيع",
    "og:keywords": "للبيع, عقارات",
    "og:author": "الموقع",
    "og:robots": "index, follow",
    "og:url": "",
    "og:image": "",
    "og:type": "website",
    "og:locale": "ar",
    "og:locale:alternate": "en",
    "og:site_name": "الموقع",
    "og:image:width": null,
    "og:image:height": null,
    "og:image:type": null,
    "og:image:alt": "للبيع",
  },
  projects: {
    TitleAr: "المشاريع",
    TitleEn: "Projects",
    DescriptionAr: "مشاريعنا العقارية المتميزة",
    DescriptionEn: "Our distinguished real estate projects",
    KeywordsAr: "مشاريع, عقارية, تطوير, بناء",
    KeywordsEn: "projects, real estate, development, construction",
    Author: "الموقع",
    AuthorEn: "Website",
    Robots: "index, follow",
    RobotsEn: "index, follow",
    "og:title": "المشاريع",
    "og:description": "مشاريعنا العقارية المتميزة",
    "og:keywords": "مشاريع, عقارية",
    "og:author": "الموقع",
    "og:robots": "index, follow",
    "og:url": "",
    "og:image": "",
    "og:type": "website",
    "og:locale": "ar",
    "og:locale:alternate": "en",
    "og:site_name": "الموقع",
    "og:image:width": null,
    "og:image:height": null,
    "og:image:type": null,
    "og:image:alt": "المشاريع",
  },
  "about-us": {
    TitleAr: "من نحن",
    TitleEn: "About Us",
    DescriptionAr: "تعرف على شركتنا وخدماتنا المتميزة في مجال العقارات",
    DescriptionEn:
      "Learn about our company and our distinguished real estate services",
    KeywordsAr: "من نحن, شركة, خدمات, عقارات, معلومات",
    KeywordsEn: "about us, company, services, real estate, information",
    Author: "الموقع",
    AuthorEn: "Website",
    Robots: "index, follow",
    RobotsEn: "index, follow",
    "og:title": "من نحن",
    "og:description": "تعرف على شركتنا وخدماتنا المتميزة",
    "og:keywords": "من نحن, شركة, خدمات",
    "og:author": "الموقع",
    "og:robots": "index, follow",
    "og:url": "",
    "og:image": "",
    "og:type": "website",
    "og:locale": "ar",
    "og:locale:alternate": "en",
    "og:site_name": "الموقع",
    "og:image:width": null,
    "og:image:height": null,
    "og:image:type": null,
    "og:image:alt": "من نحن",
  },
  "contact-us": {
    TitleAr: "اتصل بنا",
    TitleEn: "Contact Us",
    DescriptionAr: "تواصل معنا للحصول على المساعدة والاستفسارات حول العقارات",
    DescriptionEn: "Contact us for assistance and inquiries about real estate",
    KeywordsAr: "اتصل بنا, تواصل, مساعدة, خدمة العملاء, عقارات",
    KeywordsEn:
      "contact us, communication, help, customer service, real estate",
    Author: "الموقع",
    AuthorEn: "Website",
    Robots: "index, follow",
    RobotsEn: "index, follow",
    "og:title": "اتصل بنا",
    "og:description": "تواصل معنا للحصول على المساعدة",
    "og:keywords": "اتصل بنا, تواصل, مساعدة",
    "og:author": "الموقع",
    "og:robots": "index, follow",
    "og:url": "",
    "og:image": "",
    "og:type": "website",
    "og:locale": "ar",
    "og:locale:alternate": "en",
    "og:site_name": "الموقع",
    "og:image:width": null,
    "og:image:height": null,
    "og:image:type": null,
    "og:image:alt": "اتصل بنا",
  },
};

export function getDefaultSeoData(slug: string): DefaultSeo {
  const isHome =
    !slug || slug === "/" || slug === "homepage" || slug === "home";
  const name = humanize(slug);

  // Use static defaults when available
  const normalizedKey = (() => {
    if (isHome) return "/";
    const s = (slug || "").replace(/^\/+|\/+$/g, "");
    return s;
  })();
  if (defaultData[normalizedKey] != null) {
    return defaultData[normalizedKey];
  }

  // Specialized defaults for dynamic sections like property and project
  const stripped = (slug || "").replace(/^\/+|\/+$/g, "");
  const firstSegment = stripped.split("/")[0] || "";

  if (firstSegment === "property") {
    const titleAr = "تفاصيل العقار";
    const titleEn = "Property Details";
    const descAr = "تعرّف على تفاصيل هذا العقار ومواصفاته وصوره";
    const descEn = "Explore this property's details, specifications and photos";
    const keywordsAr = "عقار, تفاصيل العقار, للبيع, للإيجار";
    const keywordsEn = "property, property details, for sale, for rent";

    return {
      TitleAr: titleAr,
      TitleEn: titleEn,
      DescriptionAr: descAr,
      DescriptionEn: descEn,
      KeywordsAr: keywordsAr,
      KeywordsEn: keywordsEn,
      Author: "الموقع",
      AuthorEn: "Website",
      Robots: "index, follow",
      RobotsEn: "index, follow",
      "og:title": titleAr,
      "og:description": descAr,
      "og:keywords": keywordsAr,
      "og:author": "الموقع",
      "og:robots": "index, follow",
      "og:url": null,
      "og:image": null,
      "og:type": "website",
      "og:locale": "ar",
      "og:locale:alternate": "en",
      "og:site_name": "الموقع",
      "og:image:width": null,
      "og:image:height": null,
      "og:image:type": null,
      "og:image:alt": titleAr,
    };
  }

  if (firstSegment === "project") {
    const titleAr = "تفاصيل المشروع";
    const titleEn = "Project Details";
    const descAr = "اكتشف تفاصيل هذا المشروع العقاري ومراحله ومواصفاته";
    const descEn =
      "Discover this real estate project's details, phases and specs";
    const keywordsAr = "مشروع, تفاصيل المشروع, تطوير, عقارات";
    const keywordsEn = "project, project details, development, real estate";

    return {
      TitleAr: titleAr,
      TitleEn: titleEn,
      DescriptionAr: descAr,
      DescriptionEn: descEn,
      KeywordsAr: keywordsAr,
      KeywordsEn: keywordsEn,
      Author: "الموقع",
      AuthorEn: "Website",
      Robots: "index, follow",
      RobotsEn: "index, follow",
      "og:title": titleAr,
      "og:description": descAr,
      "og:keywords": keywordsAr,
      "og:author": "الموقع",
      "og:robots": "index, follow",
      "og:url": null,
      "og:image": null,
      "og:type": "website",
      "og:locale": "ar",
      "og:locale:alternate": "en",
      "og:site_name": "الموقع",
      "og:image:width": null,
      "og:image:height": null,
      "og:image:type": null,
      "og:image:alt": titleAr,
    };
  }

  const titleAr = isHome ? "الصفحة الرئيسية" : name;
  const titleEn = isHome ? "Homepage" : name;
  const descAr = isHome
    ? "مرحباً بكم في موقعنا"
    : `تعرف على صفحة ${name} في موقعنا`;
  const descEn = isHome
    ? "Welcome to our website"
    : `Learn more about ${name} on our website`;
  const keywordsAr = isHome ? "الرئيسية, الموقع" : `${name}, الموقع`;
  const keywordsEn = isHome ? "homepage, website" : `${name}, website`;

  return {
    TitleAr: titleAr,
    TitleEn: titleEn,
    DescriptionAr: descAr,
    DescriptionEn: descEn,
    KeywordsAr: keywordsAr,
    KeywordsEn: keywordsEn,
    Author: "الموقع",
    AuthorEn: "Website",
    Robots: "index, follow",
    RobotsEn: "index, follow",
    "og:title": titleAr,
    "og:description": descAr,
    "og:keywords": keywordsAr,
    "og:author": "الموقع",
    "og:robots": "index, follow",
    "og:url": null,
    "og:image": null,
    "og:type": "website",
    "og:locale": "ar",
    "og:locale:alternate": "en",
    "og:site_name": isHome ? "الموقع" : name,
    "og:image:width": null,
    "og:image:height": null,
    "og:image:type": null,
    "og:image:alt": titleAr,
  };
}
