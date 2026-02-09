import axiosInstance from "@/lib/axiosInstance";
import type { Project } from "../types";

// Mock data for Live Editor
export const getMockProject = (): Project => ({
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
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  amenities: [
    "موقف سيارات",
    "حديقة",
    "صالة ألعاب",
    "مسبح",
    "نادي صحي",
    "أمن 24/7",
  ],
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
  properties: [
    {
      id: 1,
      project_id: 1,
      title: "عقار فاخر للبيع",
      slug: "luxury-property-1",
      address: "الرياض، حي النرجس",
      description: "عقار فاخر في موقع ممتاز",
      price: "1,250,000",
      pricePerMeter: "8,333",
      purpose: "sale",
      type: "residential",
      beds: 3,
      bath: 2,
      area: "150",
      size: "150",
      featured_image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      gallery: [],
      location: {
        latitude: "24.7136",
        longitude: "46.6753",
      },
      status: true,
      featured: true,
      property_status: "available",
      features: [],
      faqs: [],
      category_id: 1,
      payment_method: null,
      video_url: null,
      virtual_tour: null,
      created_at: "2024-01-15",
      updated_at: "2024-12-01",
    },
    {
      id: 2,
      project_id: 1,
      title: "شقة للإيجار",
      slug: "apartment-rent-1",
      address: "الرياض، حي العليا",
      description: "شقة حديثة للإيجار",
      price: "5,000",
      pricePerMeter: "33",
      purpose: "rent",
      type: "residential",
      beds: 2,
      bath: 1,
      area: "120",
      size: "120",
      featured_image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      gallery: [],
      location: {
        latitude: "24.7136",
        longitude: "46.6753",
      },
      status: true,
      featured: false,
      property_status: "available",
      features: [],
      faqs: [],
      category_id: 1,
      payment_method: "monthly",
      video_url: null,
      virtual_tour: null,
      created_at: "2024-01-15",
      updated_at: "2024-12-01",
    },
  ],
});

// جلب بيانات المشروع
export const fetchProject = async (
  tenantId: string,
  projectSlug: string,
): Promise<Project | null> => {
  try {
    const response = await axiosInstance.get(
      `/v1/tenant-website/${tenantId}/projects/${projectSlug}`,
    );

    let projectData = null;
    if (response.data && response.data.project) {
      projectData = response.data.project;
    } else if (response.data) {
      projectData = response.data;
    } else {
      throw new Error("المشروع غير موجود");
    }

    // Normalize completeStatus: convert number to string if needed
    if (
      projectData.completeStatus !== undefined &&
      projectData.completeStatus !== null
    ) {
      if (typeof projectData.completeStatus === "number") {
        projectData.completeStatus = String(projectData.completeStatus);
      }
    }

    return projectData;
  } catch (error) {
    console.error("ProjectDetails2: Error fetching project:", error);
    throw error;
  }
};
