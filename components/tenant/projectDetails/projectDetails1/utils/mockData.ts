import { Project } from "../types";

/**
 * Mock project data for Live Editor
 */
export const mockProject: Project = {
  id: "mock-project-1",
  slug: "mock-project",
  title: "مشروع عقاري متميز",
  description:
    "هذا مشروع عقاري متميز يقع في موقع استراتيجي ويوفر جميع المرافق والخدمات الحديثة. المشروع مصمم بأحدث المعايير العالمية ويوفر تجربة سكنية فريدة.",
  address: "الرياض، حي النرجس، شارع الملك فهد",
  district: "حي النرجس",
  developer: "شركة التطوير العقاري المتميزة",
  units: 150,
  completionDate: "2025-12-31",
  completeStatus: "1",
  minPrice: "500000",
  maxPrice: "2000000",
  price: "1250000",
  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  images: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
  ],
  floorplans: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  ],
  videoUrl: null,
  amenities: [
    "موقف سيارات",
    "حديقة",
    "صالة ألعاب",
    "مسبح",
    "نادي صحي",
    "أمن 24/7",
  ],
  featured: true,
  published: true,
  location: {
    lat: 24.7136,
    lng: 46.6753,
    address: "الرياض، حي النرجس",
  },
  specifications: [
    { name: "المساحة الإجمالية", value: "50,000 متر مربع" },
    { name: "عدد الطوابق", value: "15 طابق" },
    { name: "نوع البناء", value: "خرسانة مسلحة" },
  ],
  types: [
    { name: "شقق", value: "apartments" },
    { name: "فلل", value: "villas" },
  ],
  features: ["إطلالة رائعة", "تصميم عصري", "مواصلات قريبة"],
  status: "available",
  views: 1250,
  bedrooms: 3,
  bathrooms: 2,
  area: "150 متر مربع",
  type: "شقة",
  transactionType: "بيع",
  createdAt: "2024-01-15",
  updatedAt: "2024-12-01",
};

/**
 * Get mock similar projects for Live Editor
 * @param baseProject - The base project to clone
 * @returns Array of mock similar projects
 */
export const getMockSimilarProjects = (baseProject: Project): Project[] => {
  return [
    {
      ...baseProject,
      id: "mock-2",
      title: "مشروع عقاري ثاني",
      district: "حي العليا",
    },
    {
      ...baseProject,
      id: "mock-3",
      title: "مشروع عقاري ثالث",
      district: "حي المطار",
    },
    {
      ...baseProject,
      id: "mock-4",
      title: "مشروع عقاري رابع",
      district: "حي الياسمين",
    },
  ];
};
