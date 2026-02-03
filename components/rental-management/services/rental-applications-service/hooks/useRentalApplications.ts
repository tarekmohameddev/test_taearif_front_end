import { useState, useEffect } from "react";
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
}: UseRentalApplicationsProps) => {
  const { userData } = useAuthStore();
  const [tableMaxWidth, setTableMaxWidth] = useState<number | null>(null);

  const {
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
    isInitialized,
  } = rentalApplications;

  const [localSearchTerm, setLocalSearchTerm] = useState<string>(
    contractSearchTerm || "",
  );

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
    const timer = setTimeout(() => {
      if (localSearchTerm !== contractSearchTerm) {
        setRentalApplications({ contractSearchTerm: localSearchTerm });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [localSearchTerm, contractSearchTerm, setRentalApplications]);

  useEffect(() => {
    setLocalSearchTerm(contractSearchTerm || "");
  }, [contractSearchTerm]);

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

      const response = await fetchRentalsAPI({
        page,
        perPage: perPage || 20,
        sortBy: sortBy || "created_at",
        sortOrder: sortOrder || "desc",
        contractStatusFilter: contractStatusFilter || "",
        buildingFilter: buildingFilter || "",
        unitFilter: unitFilter || "",
        projectFilter: projectFilter || "",
        rentalMethodFilter: rentalMethodFilter || "",
        contractSearchTerm: contractSearchTerm || "",
        filterByYear: filterByYear || "",
        fromDate: fromDate || "",
        toDate: toDate || "",
        contractCreatedFromDate: contractCreatedFromDate || "",
        contractCreatedToDate: contractCreatedToDate || "",
        contractStartDateFilter: contractStartDateFilter || "",
        contractStartFromDate: contractStartFromDate || "",
        contractStartToDate: contractStartToDate || "",
        contractEndDateFilter: contractEndDateFilter || "",
        contractEndFromDate: contractEndFromDate || "",
        contractEndToDate: contractEndToDate || "",
        collectionsPeriod,
        collectionsFromDate,
        collectionsToDate,
        paymentsDuePeriod,
        paymentsDueFromDate,
        paymentsDueToDate,
      });

      if (response.status) {
        setRentalApplications({
          rentals: response.data || [],
          pagination: (response as any).pagination || {
            current_page: page,
            per_page: perPage || 20,
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
  ]);

  useEffect(() => {
    if (userData?.token && isInitialized) {
      fetchRentals(1);
    }
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

  return {
    tableMaxWidth,
    localSearchTerm,
    setLocalSearchTerm,
    fetchRentals,
  };
};
