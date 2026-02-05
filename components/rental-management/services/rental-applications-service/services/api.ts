import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse, RentalData } from "../types/types";

interface FetchRentalsParams {
  page: number;
  perPage: number;
  sortBy: string;
  sortOrder: string;
  contractStatusFilter: string;
  paymentStatusFilter: string;
  buildingFilter: string;
  unitFilter: string;
  projectFilter: string;
  rentalMethodFilter: string;
  contractSearchTerm: string;
  filterByYear: string;
  fromDate: string;
  toDate: string;
  contractCreatedFromDate: string;
  contractCreatedToDate: string;
  contractStartDateFilter: string;
  contractStartFromDate: string;
  contractStartToDate: string;
  contractEndDateFilter: string;
  contractEndFromDate: string;
  contractEndToDate: string;
  collectionsPeriod: string;
  collectionsFromDate: string;
  collectionsToDate: string;
  paymentsDuePeriod: string;
  paymentsDueFromDate: string;
  paymentsDueToDate: string;
}

export const fetchRentalsAPI = async (
  params: FetchRentalsParams,
): Promise<ApiResponse> => {
  const {
    page,
    perPage,
    sortBy,
    sortOrder,
    contractStatusFilter,
    paymentStatusFilter,
    buildingFilter,
    unitFilter,
    projectFilter,
    rentalMethodFilter,
    contractSearchTerm,
    filterByYear,
    fromDate,
    toDate,
    contractCreatedFromDate,
    contractCreatedToDate,
    contractStartDateFilter,
    contractStartFromDate,
    contractStartToDate,
    contractEndDateFilter,
    contractEndFromDate,
    contractEndToDate,
  } = params;

  const queryParams: any = {
    page,
    per_page: perPage || 20,
    sort_by: sortBy || "created_at",
    sort_order: sortOrder || "desc",
  };

  if (contractStatusFilter && contractStatusFilter !== "all") {
    queryParams.contract_status = contractStatusFilter; // Fixed: use contract_status not status
  }

  if (paymentStatusFilter && paymentStatusFilter !== "all") {
    queryParams.payment_status = paymentStatusFilter;
  }

  if (buildingFilter && buildingFilter !== "all") {
    queryParams.building_id = buildingFilter;
  }

  if (unitFilter) {
    queryParams.unit_id = unitFilter;
  }

  if (projectFilter) {
    queryParams.project_id = projectFilter;
  }

  if (rentalMethodFilter && rentalMethodFilter !== "all") {
    queryParams.paying_plan = rentalMethodFilter;
  }

  if (contractSearchTerm) {
    queryParams.q = contractSearchTerm;
  }

  if (filterByYear) {
    queryParams.filter_by_year = filterByYear;
  }

  if (fromDate) {
    queryParams.from_date = fromDate;
  }
  if (toDate) {
    queryParams.to_date = toDate;
  }

  if (contractCreatedFromDate) {
    queryParams.contract_created_from_date = contractCreatedFromDate;
  }
  if (contractCreatedToDate) {
    queryParams.contract_created_to_date = contractCreatedToDate;
  }

  // Contract start date filter - use period for non-custom values (today, week, month, quarter, year)
  if (contractStartDateFilter && contractStartDateFilter !== "all") {
    if (contractStartDateFilter === "custom") {
      // Custom date range - use from/to dates
      if (contractStartFromDate) {
        queryParams.contract_start_from_date = contractStartFromDate;
      }
      if (contractStartToDate) {
        queryParams.contract_start_to_date = contractStartToDate;
      }
    } else {
      // Period filter (today, week, month, quarter, year) - use contract_start_period
      queryParams.contract_start_period = contractStartDateFilter;
    }
  }

  // Contract end date filter - use period for non-custom values (today, week, month, quarter, year)
  if (contractEndDateFilter && contractEndDateFilter !== "all") {
    if (contractEndDateFilter === "custom") {
      // Custom date range - use from/to dates
      if (contractEndFromDate) {
        queryParams.contract_end_from_date = contractEndFromDate;
      }
      if (contractEndToDate) {
        queryParams.contract_end_to_date = contractEndToDate;
      }
    } else {
      // Period filter (today, week, month, quarter, year) - use contract_end_period
      queryParams.contract_end_period = contractEndDateFilter;
    }
  }

  const response = await axiosInstance.get<ApiResponse>(`/v1/rms/rentals`, {
    params: queryParams,
  });

  return response.data;
};

export const createRentalAPI = async (formData: any) => {
  const response = await axiosInstance.post("/v1/rms/rentals", formData);
  return response.data;
};

export const updateRentalAPI = async (rentalId: number, formData: any) => {
  const response = await axiosInstance.patch(
    `/v1/rms/rentals/${rentalId}`,
    formData,
  );
  return response.data;
};

export const deleteRentalAPI = async (rentalId: number) => {
  const response = await axiosInstance.delete(`/v1/rms/rentals/${rentalId}`);
  return response;
};

export const renewRentalAPI = async (rentalId: number, renewalData: any) => {
  const response = await axiosInstance.post(
    `/v1/rms/rentals/${rentalId}/renew`,
    renewalData,
  );
  return response.data;
};

export const changeRentalStatusAPI = async (
  rentalId: number,
  status: string,
) => {
  const response = await axiosInstance.patch(
    `/v1/rms/rentals/${rentalId}/status`,
    { status },
  );
  return response.data;
};

export const fetchFilterOptionsAPI = async () => {
  const response = await axiosInstance.get("/v1/rms/rentals/filter-options");
  return response.data;
};

export const fetchProjectsAPI = async () => {
  const response = await axiosInstance.get("/projects");
  return response.data;
};

export const fetchPropertiesAPI = async () => {
  const response = await axiosInstance.get("/properties");
  return response.data;
};
