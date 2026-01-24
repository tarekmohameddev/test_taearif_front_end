import { useEffect } from "react";
import type { FormData } from "../types/propertyForm.types";
import { facilitiesList } from "../utils/constants";

export const useSelectedFacilities = (
  formData: FormData,
  setSelectedFacilities: (facilities: string[] | ((prev: string[]) => string[])) => void,
) => {
  useEffect(() => {
    const activeFacilities = facilitiesList
      .filter((facility) => {
        const value = formData[facility.key];
        // التحقق من أن القيمة موجودة وليست فارغة و >= 0
        if (value === "" || value === undefined || value === null) {
          return false;
        }
        const numValue = Number(value);
        return !isNaN(numValue) && numValue >= 0;
      })
      .map((facility) => facility.key);

    setSelectedFacilities(activeFacilities);
  }, [
    formData.bedrooms,
    formData.bathrooms,
    formData.rooms,
    formData.floors,
    formData.floor_number,
    formData.driver_room,
    formData.maid_room,
    formData.dining_room,
    formData.living_room,
    formData.majlis,
    formData.storage_room,
    formData.basement,
    formData.swimming_pool,
    formData.kitchen,
    formData.balcony,
    formData.garden,
    formData.annex,
    formData.elevator,
    formData.private_parking,
    setSelectedFacilities,
  ]);
};
