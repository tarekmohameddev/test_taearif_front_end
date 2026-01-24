import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

export const fetchCategories = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/properties/categories");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error("حدث خطأ أثناء جلب أنواع الوحدات.");
    throw error;
  }
};

export const fetchFacades = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/property/facades");
    return response.data.data;
  } catch (error) {
    console.error("خطأ في جلب الواجهات:", error);
    throw error;
  }
};

export const fetchProjects = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/user/projects");
    return response.data.data.user_projects;
  } catch (error) {
    toast.error("حدث خطأ أثناء جلب المشاريع.");
    throw error;
  }
};

export const fetchBuildings = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/buildings");
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching buildings:", error);
    toast.error("حدث خطأ أثناء جلب العمارات.");
    throw error;
  }
};

export const fetchSuggestedFaqs = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/property-faqs");
    return response.data.data.suggestedFaqs || [];
  } catch (error) {
    console.error("Error fetching suggested FAQs:", error);
    return [];
  }
};
