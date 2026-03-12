"use client";

import React, { useState, useEffect } from "react";
import { Building, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { CustomDropdown, DropdownItem } from "@/components/customComponents/customDropdown";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import axiosInstance from "@/lib/axiosInstance";
import { assignPropertyToCustomer } from "@/lib/services/customer-assigned-properties-api";

interface Property {
  id: number;
  title: string;
  address?: string;
  price?: number;
  transaction_type?: string;
}

interface AddPropertyToCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  onSuccess?: () => void;
}

export function AddPropertyToCustomerDialog({
  open,
  onOpenChange,
  customerId,
  onSuccess,
}: AddPropertyToCustomerDialogProps) {
  const userData = useAuthStore(selectUserData);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch properties when dialog opens
  useEffect(() => {
    if (open && userData?.token) {
      fetchProperties();
    }
  }, [open, userData?.token]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedPropertyId("");
    }
  }, [open]);

  const fetchProperties = async () => {
    if (!userData?.token) {
      return;
    }

    setIsLoadingProperties(true);
    try {
      const response = await axiosInstance.get("/properties");
      if (response.data.status === "success") {
        setProperties(response.data.data.properties || []);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      toast.error("فشل في تحميل العقارات");
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPropertyId) {
      toast.error("الرجاء اختيار عقار");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await assignPropertyToCustomer(customerId, {
        propertyId: parseInt(selectedPropertyId),
      });

      if (response.status === "success") {
        toast.success("تم إضافة العقار للعميل بنجاح");
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Handle specific error cases
        if (response.message?.includes("already assigned")) {
          toast.error("هذا العقار مخصص بالفعل لهذا العميل");
        } else {
          toast.error(response.message || "فشل في إضافة العقار");
        }
      }
    } catch (error: any) {
      console.error("Error assigning property:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء إضافة العقار";
      
      // Handle specific HTTP status codes
      if (error.response?.status === 409) {
        toast.error("هذا العقار مخصص بالفعل لهذا العميل");
      } else if (error.response?.status === 404) {
        if (error.response?.data?.message?.includes("Customer")) {
          toast.error("العميل غير موجود");
        } else {
          toast.error("العقار غير موجود أو لا ينتمي لحسابك");
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <CustomDialogContent className="p-4 sm:p-6">
        <CustomDialogClose onClose={() => onOpenChange(false)} />
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            إضافة عقار للعميل
          </CustomDialogTitle>
          <CustomDialogDescription>
            اختر العقار الذي تريد إضافته لهذا العميل
          </CustomDialogDescription>
        </CustomDialogHeader>

        <div className="space-y-4 py-4">
          {isLoadingProperties ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="mr-2 text-sm text-gray-500">
                جاري تحميل العقارات...
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">اختر العقار</label>
              {properties.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500 border border-gray-200 rounded-md">
                  لا توجد عقارات متاحة
                </div>
              ) : (
                <CustomDropdown
                  trigger={
                    <span className="text-sm">
                      {selectedPropertyId
                        ? properties.find((p) => p.id.toString() === selectedPropertyId)?.title ||
                          "اختر العقار"
                        : "اختر العقار"}
                    </span>
                  }
                  triggerClassName="w-full justify-between"
                  dropdownWidth="w-[20rem]"
                  maxHeight="280px"
                >
                  {properties.map((property) => (
                    <DropdownItem
                      key={property.id}
                      onClick={() => setSelectedPropertyId(property.id.toString())}
                      className={
                        selectedPropertyId === property.id.toString()
                          ? "bg-gray-100 font-medium"
                          : ""
                      }
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{property.title}</span>
                        {property.address && (
                          <span className="text-xs text-gray-500">{property.address}</span>
                        )}
                        {property.price && (
                          <span className="text-xs text-green-600">
                            {property.price.toLocaleString()} ريال
                          </span>
                        )}
                      </div>
                    </DropdownItem>
                  ))}
                </CustomDropdown>
              )}
              {selectedPropertyId && (
                <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
                  <span className="text-gray-600">العقار المختار: </span>
                  <span className="font-medium">
                    {properties.find((p) => p.id.toString() === selectedPropertyId)?.title}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <CustomDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedPropertyId || isSubmitting || isLoadingProperties}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الإضافة...
              </>
            ) : (
              "إضافة"
            )}
          </Button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
