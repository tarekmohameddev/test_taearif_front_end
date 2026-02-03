import type { RentalData } from "../types/types";

export const getSafeValue = (value: any, fallback: string = "غير محدد") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return value;
};

export const getTenantName = (rental: RentalData) => {
  return getSafeValue(rental.tenant_full_name, "مستأجر غير محدد");
};

export const getUnitLabel = (rental: RentalData) => {
  if (rental.active_contract?.property_name) {
    return rental.active_contract.property_name;
  }
  if (rental.active_contract?.project_name) {
    return rental.active_contract.project_name;
  }
  if (rental.unit_name) {
    return rental.unit_name;
  }
  if (rental.unit_label) {
    return rental.unit_label;
  }
  if (rental.property_name) {
    return rental.property_name;
  }
  if (rental.project_name) {
    return rental.project_name;
  }
  return "غير محدد";
};

export const truncateText = (text: string, maxLength: number = 30) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

export const getFontSizeClass = (text: string) => {
  const length = text.length;
  if (length <= 20) {
    return "text-sm";
  } else if (length <= 40) {
    return "text-xs";
  } else if (length <= 60) {
    return "text-[11px]";
  } else {
    return "text-[10px]";
  }
};

export const getCellWidthStyle = (text: string) => {
  const length = text.length;
  if (length <= 20) {
    return { minWidth: "150px" };
  } else if (length <= 40) {
    return { minWidth: "150px" };
  } else if (length <= 60) {
    return { minWidth: "150px" };
  } else {
    return { minWidth: "150px" };
  }
};

export const getPropertyNumber = (rental: RentalData) => {
  if (rental.active_contract?.property_id) {
    return String(rental.active_contract.property_id);
  }
  if (rental.active_contract?.project_id) {
    return String(rental.active_contract.project_id);
  }
  if (rental.property_number) {
    return rental.property_number;
  }
  if (rental.property_id) {
    return String(rental.property_id);
  }
  if (rental.project_id) {
    return String(rental.project_id);
  }
  return "غير محدد";
};

export const getJobTitle = (rental: RentalData) => {
  return getSafeValue(rental.tenant_job_title, "غير محدد");
};

export const getPhoneNumber = (rental: RentalData) => {
  return getSafeValue(rental.tenant_phone, "غير محدد");
};

export const getEmail = (rental: RentalData) => {
  return getSafeValue(rental.tenant_email, "غير محدد");
};

export const getpropertyDetails = (rental: RentalData) => {
  if (!rental.property) {
    return { beds: "غير محدد", bath: "غير محدد", area: "غير محدد" };
  }
  return {
    beds: getSafeValue(rental.property.beds, "غير محدد"),
    bath: getSafeValue(rental.property.bath, "غير محدد"),
    area: getSafeValue(rental.property.area, "غير محدد"),
  };
};

export const getStatusColor = (status: string | null | undefined) => {
  const safeStatus = getSafeValue(status, "unknown");
  switch (safeStatus) {
    case "active":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "pending":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "expired":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "غير محدد";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "تاريخ غير صحيح";
    return date.toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "تاريخ غير صحيح";
  }
};

export const formatCurrency = (
  amount: string | null | undefined,
  currency: string | null | undefined,
) => {
  if (!amount || isNaN(parseFloat(amount))) return "غير محدد";
  try {
    return new Intl.NumberFormat("ar-US", {
      style: "currency",
      currency: currency || "SAR",
    }).format(parseFloat(amount));
  } catch (error) {
    return "مبلغ غير صحيح";
  }
};
