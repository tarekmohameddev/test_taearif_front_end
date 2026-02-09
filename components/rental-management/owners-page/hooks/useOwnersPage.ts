"use client";

import { useEffect } from "react";
import useStore from "@/context/Store";
import { PAGE_SIZE, DEBOUNCE_DELAY } from "../constants/owners.constants";

export function useOwnersPage() {
  const {
    rentalOwnerDashboard,
    setRentalOwnerDashboard,
    fetchOwnerRentals,
  } = useStore();

  const {
    owners,
    pagination,
    loading,
    error,
    searchTerm,
    statusFilter,
    isInitialized,
  } = rentalOwnerDashboard;

  // Fetch owners on mount
  useEffect(() => {
    if (!isInitialized) {
      fetchOwnerRentals(1, PAGE_SIZE);
    }
  }, [isInitialized, fetchOwnerRentals]);

  // Refetch when search or filter changes
  useEffect(() => {
    if (isInitialized) {
      const timeoutId = setTimeout(() => {
        fetchOwnerRentals(1, PAGE_SIZE);
      }, DEBOUNCE_DELAY);

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, statusFilter, isInitialized, fetchOwnerRentals]);

  const handlePageChange = (page: number) => {
    fetchOwnerRentals(page, PAGE_SIZE);
  };

  const handleSearchChange = (value: string) => {
    setRentalOwnerDashboard({ searchTerm: value });
  };

  const handleStatusFilterChange = (value: string) => {
    setRentalOwnerDashboard({ statusFilter: value });
  };

  // Calculate statistics
  const totalOwners = pagination?.total || 0;
  const activeOwners = owners.filter((o: any) => o.is_active).length;
  const totalProperties = owners.reduce(
    (sum: number, o: any) => sum + (o.properties?.length || 0),
    0,
  );

  return {
    owners,
    pagination,
    loading,
    error,
    searchTerm,
    statusFilter,
    totalOwners,
    activeOwners,
    totalProperties,
    handlePageChange,
    handleSearchChange,
    handleStatusFilterChange,
    refetch: () => fetchOwnerRentals(pagination?.current_page || 1, PAGE_SIZE),
  };
}
