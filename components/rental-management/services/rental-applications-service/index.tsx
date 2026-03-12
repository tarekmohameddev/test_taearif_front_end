"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useStore from "@/context/Store";
import useMarketingStore from "@/context/marketingStore";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import { StatusChangeDialog } from "../status-change-dialog";
import { PaymentCollectionDialog } from "../../payment-collection-dialog";
import { RentalWhatsAppDialog } from "../../rental-whatsapp-dialog";
import { RenewalDialog } from "../../rental-renewal-dialog";
import type { RentalApplicationsServiceProps } from "./types/types";
import { useRentalApplications } from "./hooks/useRentalApplications";
import { useRentalFiltersState } from "./hooks/useRentalFiltersState";
import { useRenewalDialog } from "./hooks/useRenewalDialog";
import { useStatusChangeDialog } from "./hooks/useStatusChangeDialog";
import {
  AddRentalForm,
  EditRentalForm,
  RentalsFilters,
  RentalsTable,
  RentalsPagination,
  RentalDetailsDialog,
  DeleteRentalDialog,
} from "./components";
import { createRentalAPI, updateRentalAPI, deleteRentalAPI } from "./services/api";

export function RentalApplicationsService({
  openAddDialogCounter = 0,
  collectionsPeriod = "this_month",
  collectionsFromDate = "",
  collectionsToDate = "",
  paymentsDuePeriod = "this_month",
  paymentsDueFromDate = "",
  paymentsDueToDate = "",
}: RentalApplicationsServiceProps) {
  const router = useRouter();
  const rentalApplications = useStore((state) => state.rentalApplications);
  const setRentalApplications = useStore((state) => state.setRentalApplications);
  const openRentalDetailsDialog = useStore((state) => state.openRentalDetailsDialog);
  const openPaymentCollectionDialog = useStore((state) => state.openPaymentCollectionDialog);
  const openRentalWhatsAppDialog = useStore((state) => state.openRentalWhatsAppDialog);
  const closeRentalWhatsAppDialog = useStore((state) => state.closeRentalWhatsAppDialog);
  const { marketingChannels, fetchMarketingChannels } = useMarketingStore();

  const userData = useAuthStore(selectUserData);

  const {
    rentals = [],
    pagination,
    loading,
    error,
    searchTerm,
    filterStatus,
    selectedRental,
    isAddRentalDialogOpen,
    isEditRentalDialogOpen,
    editingRental,
    isSubmitting,
    isDeleteDialogOpen,
    deletingRental,
    isDeleting,
    isInitialized,
    lastProcessedOpenAddDialogCounter = -1,
  } = rentalApplications ?? {};

  // Use the new filters hook (like Properties)
  const filterHooks = useRentalFiltersState();
  const {
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
    dateFilter,
    setDateFilter,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
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
    filterOptions,
    newFilters,
  } = filterHooks;

  const {
    tableMaxWidth,
    fetchRentals,
  } = useRentalApplications({
    collectionsPeriod,
    collectionsFromDate,
    collectionsToDate,
    paymentsDuePeriod,
    paymentsDueFromDate,
    paymentsDueToDate,
    rentalApplications,
    setRentalApplications,
    newFilters,
  });

  const {
    isRenewalDialogOpen,
    selectedRentalForRenewal,
    renewalFormData,
    setRenewalFormData,
    renewalLoading,
    openRenewalDialog,
    closeRenewalDialog,
    handleRentalRenewal,
  } = useRenewalDialog();

  const {
    isStatusChangeDialogOpen,
    selectedRentalForStatusChange,
    statusChangeLoading,
    openStatusChangeDialog,
    closeStatusChangeDialog,
    handleStatusChange,
  } = useStatusChangeDialog(rentals, setRentalApplications);

  const hasValidCRMWhatsAppChannel = () => {
    return marketingChannels.channels.some(
      (channel: any) =>
        channel.is_verified === true &&
        channel.is_connected === true &&
        channel.rental_page_integration_enabled === true,
    );
  };

  useEffect(() => {
    fetchMarketingChannels();
  }, [fetchMarketingChannels]);

  useEffect(() => {
    if (
      openAddDialogCounter > 0 &&
      openAddDialogCounter > lastProcessedOpenAddDialogCounter
    ) {
      setRentalApplications({
        isAddRentalDialogOpen: true,
        lastProcessedOpenAddDialogCounter: openAddDialogCounter,
      });
    } else if (
      lastProcessedOpenAddDialogCounter === -1 &&
      openAddDialogCounter >= 0
    ) {
      setRentalApplications({
        lastProcessedOpenAddDialogCounter: openAddDialogCounter,
      });
    }
  }, [
    openAddDialogCounter,
    lastProcessedOpenAddDialogCounter,
    setRentalApplications,
  ]);

  const handleCreateRental = async (formData: any) => {
    try {
      setRentalApplications({ isSubmitting: true });
      const response = await createRentalAPI(formData);

      if (response.status) {
        setRentalApplications({ isAddRentalDialogOpen: false });
        await fetchRentals(1);
        console.log("تم إضافة الإيجار بنجاح وإعادة تحميل البيانات");
      } else {
        alert(
          "فشل في إضافة الإيجار: " + (response.message || "خطأ غير معروف"),
        );
      }
    } catch (err: any) {
      alert(
        "خطأ في إضافة الإيجار: " +
          (err.response?.data?.message || err.message || "خطأ غير معروف"),
      );
      setRentalApplications({ isAddRentalDialogOpen: false });
    } finally {
      setRentalApplications({ isSubmitting: false });
    }
  };

  const handleUpdateRental = async (rentalId: number, formData: any) => {
    try {
      setRentalApplications({ isSubmitting: true });
      const response = await updateRentalAPI(rentalId, formData);

      if (response.status) {
        const updated = rentals.map((rental: any) =>
          rental.id === rentalId ? response.data : rental,
        );
        setRentalApplications({
          rentals: updated,
          isEditRentalDialogOpen: false,
          editingRental: null,
        });
      }
    } catch (err) {
      setRentalApplications({
        isEditRentalDialogOpen: false,
        editingRental: null,
      });
    } finally {
      setRentalApplications({ isSubmitting: false });
    }
  };

  const handleDeleteRental = async (rentalId: number) => {
    try {
      setRentalApplications({ isDeleteDialogOpen: false, isDeleting: true });
      const response = await deleteRentalAPI(rentalId);

      if (response.status) {
        const updated = rentals.filter(
          (rental: any) => rental.id !== rentalId,
        );
        setRentalApplications({
          rentals: updated,
          isDeleteDialogOpen: false,
          deletingRental: null,
        });
      }
    } catch (err) {
      setRentalApplications({
        isDeleteDialogOpen: false,
        deletingRental: null,
      });
    } finally {
      setRentalApplications({ isDeleting: false });
    }
  };

  if (!userData?.token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-gray-500">
            يرجى تسجيل الدخول لعرض المحتوى
          </p>
        </div>
      </div>
    );
  }

  if (error && !isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => fetchRentals()}>
          <Loader2 className="ml-2 h-4 w-4" />
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => router.push("/dashboard/rental-management/create")}
            className="bg-gray-700 hover:bg-gray-800"
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة إيجار جديد
          </Button>
          <Button
            onClick={() =>
              router.push("/dashboard/rental-management/daily-followup")
            }
            variant="outline"
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            المتابعة اليومية
          </Button>
        </div>
      </div>

      <RentalsFilters
        localSearchTerm={localSearchTerm}
        setLocalSearchTerm={setLocalSearchTerm}
        contractStatusFilter={contractStatusFilter}
        setContractStatusFilter={setContractStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        setPaymentStatusFilter={setPaymentStatusFilter}
        rentalMethodFilter={rentalMethodFilter}
        setRentalMethodFilter={setRentalMethodFilter}
        buildingFilter={buildingFilter}
        setBuildingFilter={setBuildingFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        contractStartDateFilter={contractStartDateFilter}
        setContractStartDateFilter={setContractStartDateFilter}
        contractStartFromDate={contractStartFromDate}
        setContractStartFromDate={setContractStartFromDate}
        contractStartToDate={contractStartToDate}
        setContractStartToDate={setContractStartToDate}
        contractEndDateFilter={contractEndDateFilter}
        setContractEndDateFilter={setContractEndDateFilter}
        contractEndFromDate={contractEndFromDate}
        setContractEndFromDate={setContractEndFromDate}
        contractEndToDate={contractEndToDate}
        setContractEndToDate={setContractEndToDate}
        filterOptions={filterOptions}
      />

      <RentalsTable
        loading={loading}
        rentals={rentals}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        tableMaxWidth={tableMaxWidth}
        onPaymentClick={openPaymentCollectionDialog}
        onRenewalClick={openRenewalDialog}
        onStatusChangeClick={openStatusChangeDialog}
        onWhatsAppClick={openRentalWhatsAppDialog}
        onEditClick={(rental) =>
          setRentalApplications({
            editingRental: rental,
            isEditRentalDialogOpen: true,
          })
        }
        onDeleteClick={(rental) =>
          setRentalApplications({
            deletingRental: rental,
            isDeleteDialogOpen: true,
          })
        }
        hasValidCRMWhatsAppChannel={hasValidCRMWhatsAppChannel()}
      />

      <RentalDetailsDialog
        selectedRental={selectedRental}
        onClose={() => setRentalApplications({ selectedRental: null })}
      />

      <Dialog
        open={isAddRentalDialogOpen}
        onOpenChange={() =>
          setRentalApplications({ isAddRentalDialogOpen: false })
        }
      >
        <DialogContent
          className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto"
          style={{
            pointerEvents: isAddRentalDialogOpen ? "auto" : "none",
          }}
        >
          <DialogHeader>
            <DialogTitle>إضافة إيجار جديد</DialogTitle>
            <DialogDescription>إضافة إيجار جديد إلى النظام</DialogDescription>
          </DialogHeader>
          <AddRentalForm
            onSubmit={handleCreateRental}
            onCancel={() =>
              setRentalApplications({ isAddRentalDialogOpen: false })
            }
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditRentalDialogOpen}
        onOpenChange={() =>
          setRentalApplications({ isEditRentalDialogOpen: false })
        }
      >
        <DialogContent
          className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto"
          style={{
            pointerEvents: isEditRentalDialogOpen ? "auto" : "none",
          }}
        >
          <DialogHeader>
            <DialogTitle>تعديل طلب الإيجار</DialogTitle>
            <DialogDescription>تعديل تفاصيل طلب الإيجار</DialogDescription>
          </DialogHeader>
          {editingRental && (
            <EditRentalForm
              rental={editingRental}
              onSubmit={(formData) =>
                handleUpdateRental(editingRental.id, formData)
              }
              onCancel={() => {
                setRentalApplications({
                  isEditRentalDialogOpen: false,
                  editingRental: null,
                });
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteRentalDialog
        isOpen={isDeleteDialogOpen}
        deletingRental={deletingRental}
        isDeleting={isDeleting}
        onClose={() =>
          setRentalApplications({
            isDeleteDialogOpen: false,
            deletingRental: null,
          })
        }
        onConfirm={() =>
          deletingRental && handleDeleteRental(deletingRental.id)
        }
      />

      <PaymentCollectionDialog />

      <StatusChangeDialog
        isOpen={isStatusChangeDialogOpen}
        onClose={closeStatusChangeDialog}
        rental={selectedRentalForStatusChange}
        onStatusChange={handleStatusChange}
        isLoading={statusChangeLoading}
        onOpenRenewal={() => openRenewalDialog(selectedRentalForStatusChange)}
      />

      <RentalsPagination
        pagination={pagination}
        onPageChange={fetchRentals}
      />

      <RentalWhatsAppDialog
        isOpen={rentalApplications.isRentalWhatsAppDialogOpen || false}
        onClose={closeRentalWhatsAppDialog}
        rental={rentalApplications.selectedRentalForWhatsApp}
      />

      <RenewalDialog
        isOpen={isRenewalDialogOpen}
        onClose={closeRenewalDialog}
        rental={selectedRentalForRenewal}
        formData={renewalFormData}
        setFormData={setRenewalFormData}
        onRenew={handleRentalRenewal}
        loading={renewalLoading}
      />
    </div>
  );
}
