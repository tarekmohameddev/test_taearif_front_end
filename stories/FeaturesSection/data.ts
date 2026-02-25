const BASE_URL = "https://clusters.sa";

export const DEFAULT_HEADING = "6 مميزات تجعل تجمعات شريكك الأمثل";

export const DEFAULT_FEATURES = [
  {
    title: "الصك باسمك 100%",
    description:
      "الأرض باسمك طوال مدة المشروع، وعقد تطوير يحفظ حقوقك بدون نقل الملكية",
  },
  {
    title: "رأس مال نقدي (صفر ريال)",
    description: "نموذج يتيح لك المساهمة بأرضك فقط، وتجمعات تتولى كامل التطوير",
  },
  {
    title: "تقييم عادل وشفاف لأرضك",
    description:
      "3 مقيمين معتمدين لتحديد قيمة سوقية عادلة لأرضك بشفافية كاملة",
  },
  {
    title: "عوائد استثمارية",
    description: "فرصة تحقيق عوائد استثمارية على قيمة أرضك تصل إلى 25%",
  },
  {
    title: "رسوم الأراضي البيضاء",
    description:
      "عزز إمكانية الاستفادة من المزايا والضوابط النظامية المتعلقة برسوم الأراضي البيضاء",
  },
  {
    title: "أولوية شراء الوحدات",
    description: "فرصة شراء وحدات في المشروع بخصم يصل إلى 20%",
  },
];

export const DEFAULT_CERTIFICATIONS: { imageSrc: string; imageAlt: string; text: string }[] = [
  {
    imageSrc: `${BASE_URL}/momah.svg`,
    imageAlt: "Ministry of Municipalities and Housing",
    text: "شهادة تأهيل مطور عقاري رقم (2271160386)",
  },
  {
    imageSrc: `${BASE_URL}/rega.svg`,
    imageAlt: "rega",
    text: "شهادة تأهيل مطور عقاري لممارسة نشاط بيع وتأجير مشروعات عقارية على الخارطة (1609)",
  },
];
