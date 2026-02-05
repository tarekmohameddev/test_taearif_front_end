import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/context/AuthContext";
import { fetchRentalsAPI } from "../services/api";
import type { RentalData } from "../types/types";

interface UseRentalApplicationsProps {
  collectionsPeriod: string;
  collectionsFromDate: string;
  collectionsToDate: string;
  paymentsDuePeriod: string;
  paymentsDueFromDate: string;
  paymentsDueToDate: string;
  rentalApplications: any;
  setRentalApplications: (updates: any) => void;
  newFilters: Record<string, any>;
}

export const useRentalApplications = ({
  collectionsPeriod,
  collectionsFromDate,
  collectionsToDate,
  paymentsDuePeriod,
  paymentsDueFromDate,
  paymentsDueToDate,
  rentalApplications,
  setRentalApplications,
  newFilters,
}: UseRentalApplicationsProps) => {
  const { userData } = useAuthStore();
  const [tableMaxWidth, setTableMaxWidth] = useState<number | null>(null);
  const prevFiltersRef = useRef<string>("");

  const {
    isInitialized,
  } = rentalApplications;

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 1000) {
        setTableMaxWidth(null);
      } else if (width < 1400) {
        setTableMaxWidth(null);
      } else if (width < 1550) {
        setTableMaxWidth(null);
      } else {
        setTableMaxWidth(null);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);


  useEffect(() => {
    const observer = new MutationObserver(() => {
      const body = document.body;
      if (body.style.pointerEvents === "none") {
        body.style.pointerEvents = "";
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    const checkAndRemove = () => {
      const body = document.body;
      if (body.style.pointerEvents === "none") {
        body.style.pointerEvents = "";
      }
    };

    checkAndRemove();
    const interval = setInterval(checkAndRemove, 50);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const fetchRentals = async (page: number = 1) => {
    if (!userData?.token) {
      console.log("No token available, skipping fetchRentals");
      setRentalApplications({
        loading: false,
        error: "Authentication required. Please login.",
      });
      return;
    }

    if (
      collectionsPeriod === "custom" &&
      (!collectionsFromDate || !collectionsToDate)
    ) {
      console.log("Collections custom period requires both from and to dates");
      return;
    }

    if (
      paymentsDuePeriod === "custom" &&
      (!paymentsDueFromDate || !paymentsDueToDate)
    ) {
      console.log("Payments due custom period requires both from and to dates");
      return;
    }

    try {
      setRentalApplications({ loading: true, error: null });

      // Extract filter values from newFilters object with defaults
      const apiParams = {
        page,
        perPage: newFilters.perPage || 20,
        sortBy: newFilters.sortBy || "created_at",
        sortOrder: newFilters.sortOrder || "desc",
        contractStatusFilter: newFilters.contractStatusFilter || "",
        paymentStatusFilter: newFilters.paymentStatusFilter || "", // Add paymentStatusFilter
        buildingFilter: newFilters.buildingFilter || "",
        unitFilter: newFilters.unitFilter || "",
        projectFilter: newFilters.projectFilter || "",
        rentalMethodFilter: newFilters.rentalMethodFilter || "",
        contractSearchTerm: newFilters.contractSearchTerm || "",
        filterByYear: newFilters.filterByYear || "",
        fromDate: newFilters.fromDate || "",
        toDate: newFilters.toDate || "",
        contractCreatedFromDate: newFilters.contractCreatedFromDate || "",
        contractCreatedToDate: newFilters.contractCreatedToDate || "",
        contractStartDateFilter: newFilters.contractStartDateFilter || "",
        contractStartFromDate: newFilters.contractStartFromDate || "",
        contractStartToDate: newFilters.contractStartToDate || "",
        contractEndDateFilter: newFilters.contractEndDateFilter || "",
        contractEndFromDate: newFilters.contractEndFromDate || "",
        contractEndToDate: newFilters.contractEndToDate || "",
        collectionsPeriod,
        collectionsFromDate,
        collectionsToDate,
        paymentsDuePeriod,
        paymentsDueFromDate,
        paymentsDueToDate,
      };

      console.log("📡 API Request with filters:", {
        newFilters,
        apiParams,
      });

      const response = await fetchRentalsAPI(apiParams);

      if (response.status) {
        setRentalApplications({
          rentals: response.data || [],
          pagination: (response as any).pagination || {
            current_page: page,
            per_page: newFilters.perPage || 20,
            total: 0,
            last_page: 1,
          },
          isInitialized: true,
        });
      } else {
        setRentalApplications({ error: "فشل في جلب البيانات" });
      }
    } catch (err) {
      setRentalApplications({ error: "حدث خطأ أثناء جلب البيانات" });
    } finally {
      setRentalApplications({ loading: false });
    }
  };

  useEffect(() => {
    if (!isInitialized && userData?.token) {
      fetchRentals();
    }
  }, [isInitialized, userData?.token]);

  // Fetch when collections/payments periods change
  useEffect(() => {
    if (userData?.token && isInitialized) {
      fetchRentals(1);
    }
  }, [
    collectionsPeriod,
    collectionsFromDate,
    collectionsToDate,
    paymentsDuePeriod,
    paymentsDueFromDate,
    paymentsDueToDate,
    isInitialized,
    userData?.token,
  ]);

  // Fetch when filters change (like Properties)
  // Use JSON.stringify to properly detect object changes
  useEffect(() => {
    if (!userData?.token || !isInitialized) {
      return;
    }

    const currentFiltersString = JSON.stringify(newFilters);
    
    // Only fetch if filters actually changed
    if (prevFiltersRef.current !== currentFiltersString) {
      prevFiltersRef.current = currentFiltersString;
      console.log("🔄 Filters changed, fetching rentals with filters:", newFilters);
      fetchRentals(1);
    }
  }, [newFilters, isInitialized, userData?.token]);

  return {
    tableMaxWidth,
    fetchRentals,
  };
};
