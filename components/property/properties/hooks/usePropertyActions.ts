import { useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  deleteProperty,
  duplicateProperty,
  togglePropertyStatus,
} from "../services/properties.api";
import useStore from "@/context/Store";

export const usePropertyActions = (
  currentPage: number,
  fetchProperties: (page: number, filters: any) => void,
  newFilters: Record<string, any>
) => {
  const router = useRouter();
  const {
    propertiesManagement: { properties },
    setPropertiesManagement,
  } = useStore();

  const handleDeleteProperty = useCallback(
    async (id: string) => {
      const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذه الوحدة؟");
      if (confirmDelete) {
        try {
          await deleteProperty(id);
          toast.success("تم حذف الوحدة بنجاح");
          fetchProperties(currentPage, newFilters);
        } catch (error) {
          toast.error("فشل في حذف الوحدة");
          console.error("Error deleting property:", error);
        }
      }
    },
    [currentPage, newFilters, fetchProperties]
  );

  const handleDuplicateProperty = useCallback(
    async (property: any) => {
      try {
        await duplicateProperty(property);
        toast.success("تم مضاعفة الوحدة بنجاح");
        fetchProperties(currentPage, newFilters);
      } catch (error) {
        toast.error("فشل في مضاعفة الوحدة");
        console.error("Error duplicating property:", error);
      }
    },
    [currentPage, newFilters, fetchProperties]
  );

  const handleToggleStatus = useCallback(
    async (property: any) => {
      try {
        await togglePropertyStatus(property.id);
        const newStatus = property.status === "منشور" ? "مسودة" : "منشور";
        toast.success(
          `تم ${property.status === "منشور" ? "إلغاء النشر" : "النشر"} بنجاح`
        );
        setPropertiesManagement({
          properties: properties.map((p: any) =>
            p.id === property.id ? { ...p, status: newStatus } : p
          ),
        });
      } catch (error) {
        toast.error("فشل في تغيير حالة النشر");
        console.error("Error toggling status:", error);
      }
    },
    [properties, setPropertiesManagement]
  );

  return {
    handleDeleteProperty,
    handleDuplicateProperty,
    handleToggleStatus,
  };
};
