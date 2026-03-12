import { useState, useEffect } from "react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import { fetchFilterOptionsAPI } from "../services/api";
import {
  translateContractStatus,
  translateRentalStatus,
  translatePaymentStatus,
  translatePayingPlan,
} from "../utils/translations";
import type { FilterOptions } from "../types/types";

export const useRentalFilters = () => {
  const userData = useAuthStore(selectUserData);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    contract_statuses: [],
    rental_statuses: [],
    payment_statuses: [],
    paying_plans: [],
    buildings: [],
    projects: [],
    units: [],
  });

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

  return { filterOptions };
};
