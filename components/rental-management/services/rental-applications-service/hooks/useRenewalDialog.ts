import { useState } from "react";
import { renewRentalAPI } from "../services/api";

export const useRenewalDialog = () => {
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);
  const [selectedRentalForRenewal, setSelectedRentalForRenewal] =
    useState<any>(null);
  const [renewalFormData, setRenewalFormData] = useState({
    rental_type: "monthly",
    rental_duration: 12,
    paying_plan: "monthly",
    total_rental_amount: "",
    payment_frequency: "per_installment",
    description: "",
  });
  const [renewalLoading, setRenewalLoading] = useState(false);

  const openRenewalDialog = (rental: any) => {
    setSelectedRentalForRenewal(rental);
    setRenewalFormData({
      rental_type: "monthly",
      rental_duration: 12,
      paying_plan: "monthly",
      total_rental_amount: "",
      payment_frequency: "per_installment",
      description: "",
    });
    setIsRenewalDialogOpen(true);
  };

  const closeRenewalDialog = () => {
    setIsRenewalDialogOpen(false);
    setSelectedRentalForRenewal(null);
    setRenewalFormData({
      rental_type: "monthly",
      rental_duration: 12,
      paying_plan: "monthly",
      total_rental_amount: "",
      payment_frequency: "per_installment",
      description: "",
    });
  };

  const handleRentalRenewal = async () => {
    if (!selectedRentalForRenewal) return;

    try {
      setRenewalLoading(true);

      const renewalData = {
        rental_type: renewalFormData.rental_type,
        rental_duration: parseInt(renewalFormData.rental_duration.toString()),
        paying_plan: renewalFormData.paying_plan,
        total_rental_amount: parseFloat(renewalFormData.total_rental_amount),
        notes: renewalFormData.description,
        cost_items: [
          {
            name: "Platform Fee",
            cost: 500,
            type: "fixed",
            payer: "tenant",
            payment_frequency: renewalFormData.payment_frequency,
            description: renewalFormData.description,
          },
        ],
      };

      const response = await renewRentalAPI(
        selectedRentalForRenewal.id,
        renewalData,
      );

      if (response.status) {
        alert("تم تجديد العقد بنجاح");
        closeRenewalDialog();
        window.location.reload();
      } else {
        alert(
          "فشل في تجديد العقد: " + (response.message || "خطأ غير معروف"),
        );
      }
    } catch (error: any) {
      alert(
        "خطأ في تجديد العقد: " +
          (error.response?.data?.message || error.message || "خطأ غير معروف"),
      );
    } finally {
      setRenewalLoading(false);
    }
  };

  return {
    isRenewalDialogOpen,
    selectedRentalForRenewal,
    renewalFormData,
    setRenewalFormData,
    renewalLoading,
    openRenewalDialog,
    closeRenewalDialog,
    handleRentalRenewal,
  };
};
