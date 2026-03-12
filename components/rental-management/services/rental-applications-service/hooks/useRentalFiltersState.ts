import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchFilterOptionsAPI } from "../services/api";
import {
  translateContractStatus,
  translateRentalStatus,
  translatePaymentStatus,
  translatePayingPlan,
} from "../utils/translations";
import type { FilterOptions } from "../types/types";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

export const useRentalFiltersState = () => {
  const userData = useAuthStore(selectUserData);
  
  // Filter states - local state like Properties
  const [contractSearchTerm, setContractSearchTerm] = useState<string>("");
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");
  const [contractStatusFilter, setContractStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [rentalMethodFilter, setRentalMethodFilter] = useState<string>("all");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [unitFilter, setUnitFilter] = useState<string>("");
  const [projectFilter, setProjectFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [contractCreatedFromDate, setContractCreatedFromDate] = useState<string>("");
  const [contractCreatedToDate, setContractCreatedToDate] = useState<string>("");
  const [filterByYear, setFilterByYear] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [perPage, setPerPage] = useState<number>(20);
  const [contractStartDateFilter, setContractStartDateFilter] = useState<string>("all");
  const [contractStartFromDate, setContractStartFromDate] = useState<string>("");
  const [contractStartToDate, setContractStartToDate] = useState<string>("");
  const [contractEndDateFilter, setContractEndDateFilter] = useState<string>("all");
  const [contractEndFromDate, setContractEndFromDate] = useState<string>("");
  const [contractEndToDate, setContractEndToDate] = useState<string>("");

  // Filter options data
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    contract_statuses: [],
    rental_statuses: [],
    payment_statuses: [],
    paying_plans: [],
    buildings: [],
    projects: [],
    units: [],
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== contractSearchTerm) {
        setContractSearchTerm(localSearchTerm);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [localSearchTerm, contractSearchTerm]);

  // Sync localSearchTerm with contractSearchTerm
  useEffect(() => {
    setLocalSearchTerm(contractSearchTerm || "");
  }, [contractSearchTerm]);

  // Build newFilters object automatically from filter states using useMemo
  // This ensures the object reference only changes when actual values change
  const newFilters = useMemo(() => {
    const filters: Record<string, any> = {};

    if (contractSearchTerm?.trim()) {
      filters.contractSearchTerm = contractSearchTerm.trim();
    }
    if (contractStatusFilter && contractStatusFilter !== "all") {
      filters.contractStatusFilter = contractStatusFilter;
    }
    if (paymentStatusFilter && paymentStatusFilter !== "all") {
      filters.paymentStatusFilter = paymentStatusFilter;
    }
    if (rentalMethodFilter && rentalMethodFilter !== "all") {
      filters.rentalMethodFilter = rentalMethodFilter;
    }
    if (buildingFilter && buildingFilter !== "all") {
      filters.buildingFilter = buildingFilter;
    }
    if (unitFilter?.trim()) {
      filters.unitFilter = unitFilter.trim();
    }
    if (projectFilter?.trim()) {
      filters.projectFilter = projectFilter.trim();
    }
    if (dateFilter && dateFilter !== "today") {
      filters.dateFilter = dateFilter;
    }
    if (fromDate) {
      filters.fromDate = fromDate;
    }
    if (toDate) {
      filters.toDate = toDate;
    }
    if (contractCreatedFromDate) {
      filters.contractCreatedFromDate = contractCreatedFromDate;
    }
    if (contractCreatedToDate) {
      filters.contractCreatedToDate = contractCreatedToDate;
    }
    if (filterByYear) {
      filters.filterByYear = filterByYear;
    }
    if (sortBy) {
      filters.sortBy = sortBy;
    }
    if (sortOrder) {
      filters.sortOrder = sortOrder;
    }
    if (perPage) {
      filters.perPage = perPage;
    }
    if (contractStartDateFilter && contractStartDateFilter !== "all") {
      filters.contractStartDateFilter = contractStartDateFilter;
    }
    if (contractStartFromDate) {
      filters.contractStartFromDate = contractStartFromDate;
    }
    if (contractStartToDate) {
      filters.contractStartToDate = contractStartToDate;
    }
    if (contractEndDateFilter && contractEndDateFilter !== "all") {
      filters.contractEndDateFilter = contractEndDateFilter;
    }
    if (contractEndFromDate) {
      filters.contractEndFromDate = contractEndFromDate;
    }
    if (contractEndToDate) {
      filters.contractEndToDate = contractEndToDate;
    }

    console.log("🔍 Building newFilters:", {
      contractStatusFilter,
      paymentStatusFilter,
      rentalMethodFilter,
      buildingFilter,
      contractSearchTerm,
      filters,
    });

    return filters;
  }, [
    contractSearchTerm,
    contractStatusFilter,
    paymentStatusFilter,
    rentalMethodFilter,
    buildingFilter,
    unitFilter,
    projectFilter,
    dateFilter,
    fromDate,
    toDate,
    contractCreatedFromDate,
    contractCreatedToDate,
    filterByYear,
    sortBy,
    sortOrder,
    perPage,
    contractStartDateFilter,
    contractStartFromDate,
    contractStartToDate,
    contractEndDateFilter,
    contractEndFromDate,
    contractEndToDate,
  ]);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (!userData?.token) {
        console.log("No token available, skipping fetchFilterOptions");
        return;
      }

      try {
        const response = await fetchFilterOptionsAPI();

        if (response.status && response.data) {
          const contractStatuses = (
            response.data.contract_statuses || []
          ).map((status: any) => ({
            id: status.id,
            name: translateContractStatus(status.id),
          }));

          const rentalStatuses = (response.data.rental_statuses || []).map(
            (status: any) => ({
              id: status.id,
              name: translateRentalStatus(status.id),
            }),
          );

          const paymentStatuses = (response.data.payment_statuses || []).map(
            (status: any) => ({
              id: status.id,
              name: translatePaymentStatus(status.id),
            }),
          );

          const payingPlans = (response.data.paying_plans || []).map(
            (plan: any) => ({
              id: plan.id,
              name: translatePayingPlan(plan.id),
            }),
          );

          const filterData: FilterOptions = {
            contract_statuses: contractStatuses,
            rental_statuses: rentalStatuses,
            payment_statuses: paymentStatuses,
            paying_plans: payingPlans,
            buildings: response.data.buildings || [],
            projects: response.data.projects || [],
            units: response.data.units || [],
          };

          setFilterOptions(filterData);
        }
      } catch (err: any) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilterOptions();
  }, [userData?.token]);

  const handleClearFilters = useCallback(() => {
    setContractSearchTerm("");
    setLocalSearchTerm("");
    setContractStatusFilter("all");
    setPaymentStatusFilter("all");
    setRentalMethodFilter("all");
    setBuildingFilter("all");
    setUnitFilter("");
    setProjectFilter("");
    setDateFilter("today");
    setFromDate("");
    setToDate("");
    setContractCreatedFromDate("");
    setContractCreatedToDate("");
    setFilterByYear("");
    setContractStartDateFilter("all");
    setContractStartFromDate("");
    setContractStartToDate("");
    setContractEndDateFilter("all");
    setContractEndFromDate("");
    setContractEndToDate("");
  }, []);

  const handleRemoveFilter = useCallback((filterKey: string) => {
    switch (filterKey) {
      case "search":
        setContractSearchTerm("");
        setLocalSearchTerm("");
        break;
      case "contractStatus":
        setContractStatusFilter("all");
        break;
      case "paymentStatus":
        setPaymentStatusFilter("all");
        break;
      case "rentalMethod":
        setRentalMethodFilter("all");
        break;
      case "building":
        setBuildingFilter("all");
        break;
      case "date":
        setDateFilter("today");
        setFromDate("");
        setToDate("");
        break;
      case "contractStartDate":
        setContractStartDateFilter("all");
        setContractStartFromDate("");
        setContractStartToDate("");
        break;
      case "contractEndDate":
        setContractEndDateFilter("all");
        setContractEndFromDate("");
        setContractEndToDate("");
        break;
      default:
        break;
    }
  }, []);

  return {
    // Filter states
    contractSearchTerm,
    setContractSearchTerm,
    localSearchTerm,
    setLocalSearchTerm,
    contractStatusFilter,
    setContractStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    rentalMethodFilter,
    setRentalMethodFilter,
    buildingFilter,
    setBuildingFilter,
    unitFilter,
    setUnitFilter,
    projectFilter,
    setProjectFilter,
    dateFilter,
    setDateFilter,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    contractCreatedFromDate,
    setContractCreatedFromDate,
    contractCreatedToDate,
    setContractCreatedToDate,
    filterByYear,
    setFilterByYear,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    perPage,
    setPerPage,
    contractStartDateFilter,
    setContractStartDateFilter,
    contractStartFromDate,
    setContractStartFromDate,
    contractStartToDate,
    setContractStartToDate,
    contractEndDateFilter,
    setContractEndDateFilter,
    contractEndFromDate,
    setContractEndFromDate,
    contractEndToDate,
    setContractEndToDate,
    // Filter options data
    filterOptions,
    // Computed filters object
    newFilters,
    // Handlers
    handleClearFilters,
    handleRemoveFilter,
  };
};
