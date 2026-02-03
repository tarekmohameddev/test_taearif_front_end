import { useState } from "react";
import { changeRentalStatusAPI } from "../services/api";
import { getAvailableStatusOptions } from "../utils/statusHelpers";

export const useStatusChangeDialog = (
  rentals: any[],
  setRentalApplications: (updates: any) => void,
) => {
  const [isStatusChangeDialogOpen, setIsStatusChangeDialogOpen] =
    useState(false);
  const [selectedRentalForStatusChange, setSelectedRentalForStatusChange] =
    useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);

  const openStatusChangeDialog = (rental: any) => {
    setSelectedRentalForStatusChange(rental);
    setNewStatus("");
    setIsStatusChangeDialogOpen(true);
  };

  const closeStatusChangeDialog = () => {
    setIsStatusChangeDialogOpen(false);
    setSelectedRentalForStatusChange(null);
    setNewStatus("");
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedRentalForStatusChange || !status) {
      return;
    }

    setStatusChangeLoading(true);
    try {
      const response = await changeRentalStatusAPI(
        selectedRentalForStatusChange.id,
        status,
      );

      if (response.status) {
        const updatedRentals = rentals.map((rental: any) =>
          rental.id === selectedRentalForStatusChange.id
            ? { ...rental, status: status }
            : rental,
        );
        setRentalApplications({
          rentals: updatedRentals,
        });

        closeStatusChangeDialog();
        console.log("Status changed successfully");
      } else {
        throw new Error("Failed to change status");
      }
    } catch (error: any) {
      console.error("Error changing status:", error);
    } finally {
      setStatusChangeLoading(false);
    }
  };

  return {
    isStatusChangeDialogOpen,
    selectedRentalForStatusChange,
    newStatus,
    setNewStatus,
    statusChangeLoading,
    openStatusChangeDialog,
    closeStatusChangeDialog,
    handleStatusChange,
    getAvailableStatusOptions,
  };
};
