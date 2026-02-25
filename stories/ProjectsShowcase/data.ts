import type { ProjectCard, FilterType } from "./ProjectsShowcase.types";

export const DEFAULT_FILTERS = {
  all: "الكل",
  available: "متاحة",
  comingSoon: "قريبا",
  sold: "مباعة",
};

export const DEFAULT_PROJECTS: ProjectCard[] = [
  {
    title: "تجمعات جاكس",
    location: "الدرعية - حي جاكس",
    description:
      "حيث يتألق الفن بالعمارة الفاخرة في قلب حي جاكس النابض بالحياة",
    status: "available",
    statusColor: "#44580e",
    logoSrc: "https://clusters.sa/jx.png",
    logoAlt: "jx",
    unitTypes: [
      {
        label: "شقق فاخرة",
        iconSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/Appartment-b.svg",
        invertIcon: true,
      },
    ],
    ctaText: "اكتشف التحفة الفنية",
    ctaHref: "/ar/projects/jx-homes-1-diriyah-ar",
    ctaBgColor: "rgb(222, 173, 107)",
    imageSrc:
      "https://admin.clusters.sa/wp-content/uploads/2025/08/06-cut-out-1.png",
    imageAlt: "resident footer",
    patternSrc:
      "https://admin.clusters.sa/wp-content/uploads/2025/08/JX-Pattern-02.svg",
    backgroundColor: "rgb(76, 89, 70)",
    textColor: "rgb(255, 255, 255)",
  },
  {
    title: "تجمعات النرجس",
    location: "الرياض - حي النرجس (جنوب طريق الملك سلمان)",
    description:
      "تاون هاوس وبنتهاوس فاخرة في قلب النرجس، تمزج الأصالة النجدية بالعصرية ومداخل خاصة",
    status: "available",
    statusColor: "#44580e",
    unitTypes: [
      {
        label: "بنتهاوس",
        iconSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/Penthouse-b.svg",
        invertIcon: false,
      },
      {
        label: "تاون هاوس",
        iconSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/Townhouse-b.svg",
        invertIcon: false,
      },
    ],
    ctaText: "اكتشف مسكنك",
    ctaHref: "/ar/projects/alnarjis-clusters-ar",
    ctaBgColor: "rgb(222, 173, 107)",
    imageSrc:
      "https://admin.clusters.sa/wp-content/uploads/2025/08/4e607e282096633744890f948c4bdd6f5bb576fe-1-scaled.png",
    imageAlt: "resident footer",
    patternSrc:
      "https://admin.clusters.sa/wp-content/uploads/2025/08/Group-1000011980.png",
    backgroundColor: "rgb(232, 220, 211)",
    textColor: "rgb(0, 0, 0)",
  },
  {
    title: "تجمعات المونسية",
    location: "الرياض - حي المونسية",
    description:
      "تصاميم نجدية عصرية في ثلاث نماذج: فلل دوبلكس، تاون هاوس، وأدوار مستقلة بمداخل خاصة",
    status: "available",
    statusColor: "#44580e",
    unitTypes: [
      {
        label: "تاون هاوس",
        iconSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/Townhouse-b.svg",
        invertIcon: false,
      },
      {
        label: "دور مستقل",
        iconSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/Full-Floor-Apartment-b.svg",
        invertIcon: false,
      },
      {
        label: "فيلا دوبليكس",
        iconSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/Duplex-Villa-b.svg",
        invertIcon: false,
      },
    ],
    ctaText: "اكتشف مسكنك",
    ctaHref: "/ar/projects/al-munsiyah-clusters-ar",
    ctaBgColor: "rgb(222, 173, 107)",
    imageSrc:
      "https://admin.clusters.sa/wp-content/uploads/2025/08/تجمعات-المونسية-واجهة.png",
    imageAlt: "resident footer",
    patternSrc:
      "https://admin.clusters.sa/wp-content/uploads/2025/08/Group-1000011980.png",
    backgroundColor: "rgb(218, 199, 175)",
    textColor: "rgb(0, 0, 0)",
  },
  {
    title: "تجمعات الورود",
    location: "الرياض - حي الورود",
    description: "تصميم معماري يجمع بين الطابع الفاخر واللمسات العصرية الأنيقة",
    status: "sold",
    statusColor: "#868686",
    unitTypes: [
      {
        label: "فيلا دوبليكس",
        iconSrc:
          "https://admin.clusters.sa/wp-content/uploads/2025/08/Duplex-Villa-b.svg",
        invertIcon: true,
      },
    ],
    ctaText: "اطلع على المشروع",
    ctaHref: "/ar/projects/al-wurud-clusters-riyadh-ar",
    ctaBgColor: "rgb(69, 69, 69)",
    imageSrc:
      "https://admin.clusters.sa/wp-content/uploads/2025/08/الورود.png",
    imageAlt: "resident footer",
    patternSrc:
      "https://admin.clusters.sa/wp-content/uploads/2025/08/Al-Wrood-clusters-Pattern.svg",
    backgroundColor: "rgb(56, 56, 56)",
    textColor: "rgb(255, 255, 255)",
  },
];
