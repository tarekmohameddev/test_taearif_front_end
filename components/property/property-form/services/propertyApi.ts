import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import useStore from "@/context/Store";

export interface PropertyData {
  [key: string]: any;
}

export interface CompletionData {
  title: string;
  address: string;
  description: string;
  city_id: number | null;
  purpose: string;
  type: string;
  area: number;
  state_id: number | null;
  category_id: number | null;
  price: number | null;
  beds: number | null;
  bath: number | null;
  featured_image: string | null;
  gallery_images: string[];
}

export const createProperty = async (
  propertyData: PropertyData,
): Promise<any> => {
  const response = await axiosInstance.post("/properties", propertyData);
  toast.success("تم نشر الوحدة بنجاح");
  
  const currentState = useStore.getState();
  const createdProperty = response.data.user_property;
  createdProperty.status =
    createdProperty.status === true ? "منشور" : "مسودة";
  const updatedProperties = [
    createdProperty,
    ...currentState.propertiesManagement.properties,
  ];
  useStore.getState().setPropertiesManagement({ properties: updatedProperties });

  // تحديث خطوات الإعداد
  const setpOB = { step: "properties" };
  await axiosInstance.post("/steps/complete", setpOB);
  const { fetchSetupProgressData } = currentState.homepage;
  await fetchSetupProgressData();

  return response;
};

export const updateProperty = async (
  id: string | number,
  propertyData: PropertyData,
  publish: boolean,
): Promise<any> => {
  propertyData.status = publish ? 1 : 0;
  const response = await axiosInstance.post(`/properties/${id}`, propertyData);
  toast.success(
    publish ? "تم تحديث ونشر الوحدة بنجاح" : "تم حفظ التغييرات كمسودة",
  );
  
  const currentState = useStore.getState();
  const updatedProperty = response.data.property;
  updatedProperty.status = updatedProperty.status === 1 ? "منشور" : "مسودة";
  const updatedProperties =
    currentState.propertiesManagement.properties.map((prop) =>
      prop.id === updatedProperty.id ? updatedProperty : prop,
    );
  useStore.getState().setPropertiesManagement({ properties: updatedProperties });

  return response;
};

export const getProperty = async (
  id: string | number,
  isDraft: boolean = false,
): Promise<any> => {
  const endpoint = isDraft ? `/properties/drafts/${id}` : `/properties/${id}`;
  const response = await axiosInstance.get(endpoint);
  return isDraft ? response.data.data : response.data.data.property;
};

export const completeDraft = async (
  id: string | number,
  completionData: CompletionData,
): Promise<any> => {
  const response = await axiosInstance.post(
    `/properties/drafts/${id}/complete`,
    completionData,
  );

  if (response.data.status === "success") {
    toast.success("تم إكمال المسودة بنجاح");
  }

  return response;
};

export const translateError = (errorMessage: string): string => {
  if (
    errorMessage.includes("City location is required") ||
    errorMessage.includes("Please provide city_id or city_name")
  ) {
    return "المدينة مطلوبة. يرجى اختيار المدينة.";
  }
  return errorMessage;
};

export const handleApiError = (error: any): {
  errorMessage: string;
  validationErrors?: Record<string, string>;
  validationErrorsArray?: string[];
} => {
  let errorMessage =
    error.response?.data?.message ||
    error.message ||
    "حدث خطأ أثناء العملية";

  errorMessage = translateError(errorMessage);

  const validationErrors: Record<string, string> = {};
  let validationErrorsArray: string[] = [];

  // Handle validation errors
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    Object.keys(errors).forEach((key) => {
      let errorText = Array.isArray(errors[key])
        ? errors[key][0]
        : errors[key];

      errorText = translateError(errorText);
      validationErrors[key] = errorText;
    });
  }

  // Handle conflicts/messages array
  if (error.response?.data?.conflicts) {
    const conflicts = error.response.data.conflicts;
    validationErrorsArray = conflicts
      .map((conflict: any) => translateError(conflict.message || ""))
      .filter((msg: string) => msg);
  }

  return {
    errorMessage,
    validationErrors: Object.keys(validationErrors).length > 0 ? validationErrors : undefined,
    validationErrorsArray: validationErrorsArray.length > 0 ? validationErrorsArray : undefined,
  };
};
