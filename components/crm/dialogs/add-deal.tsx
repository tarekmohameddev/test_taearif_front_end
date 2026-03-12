"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCrmStore from "@/context/store/crm";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import type { PipelineStage } from "@/types/crm";

interface Property {
  id: number;
  title: string;
  address: string;
  price: string;
  type: string;
  transaction_type: string;
}

interface AddDealDialogProps {
  onDealAdded?: () => void;
}

export default function AddDealDialog({ onDealAdded }: AddDealDialogProps) {
  const router = useRouter();
  const userData = useAuthStore(selectUserData);
  const { showAddDealDialog, setShowAddDealDialog, pipelineStages } =
    useCrmStore();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    stage_id: "",
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<
    "existing" | "new" | null
  >(null);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if all required fields are filled
  const isFormValid =
    formData.customer_name.trim() !== "" &&
    formData.customer_phone.trim() !== "" &&
    formData.stage_id !== "";

  // Check if cards should be shown
  const shouldShowCards = isFormValid;

  // Check if submit button should be enabled
  const isSubmitEnabled =
    selectedOption === "existing" && selectedProperty !== "";

  // Fetch properties when "existing" option is selected
  useEffect(() => {
    if (selectedOption === "existing" && properties.length === 0) {
      fetchProperties();
    }
  }, [selectedOption]);

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
      setError("فشل في تحميل العقارات");
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
    // Reset selection when form changes
    if (field !== "stage_id") {
      setSelectedOption(null);
      setSelectedProperty("");
    }
  };

  const handleClose = () => {
    setShowAddDealDialog(false);
    setFormData({
      customer_name: "",
      customer_phone: "",
      stage_id: "",
    });
    setSelectedOption(null);
    setSelectedProperty("");
    setError(null);
  };

  const handleOptionSelect = (option: "existing" | "new") => {
    setSelectedOption(option);
    setSelectedProperty("");
    setError(null);

    if (option === "new") {
      // Save data to store
      const { setNewDealData } = useCrmStore.getState();
      const dealData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        stage_id: formData.stage_id,
      };
      setNewDealData(dealData);

      // Close dialog
      handleClose();

      // Small delay to ensure store is updated before navigation
      setTimeout(() => {
        router.push("/dashboard/crm/new-deal");
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if (!userData?.token) {
      setError("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!isSubmitEnabled) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const requestData = {
        stage_id: parseInt(formData.stage_id),
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        property_id: parseInt(selectedProperty),
      };

      const response = await axiosInstance.post(
        "/v1/crm/requests",
        requestData,
      );

      if (response.data.status === "success" || response.data.status === true) {
        // Success - show toast and close dialog
        toast.success("تم إنشاء الصفقة بنجاح");
        handleClose();
        // Refresh CRM data
        if (onDealAdded) {
          onDealAdded();
        }
      } else {
        setError(response.data.message || "فشل في إنشاء الصفقة");
        toast.error(response.data.message || "فشل في إنشاء الصفقة");
      }
    } catch (err: any) {
      console.error("Error creating deal:", err);
      const errorMessage =
        err.response?.data?.message || "حدث خطأ أثناء إنشاء الصفقة";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showAddDealDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-8 overflow-y-auto">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 w-full max-w-md mx-4 mb-4 bg-white rounded-lg shadow-xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">إنشاء صفقة جديدة</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Customer Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              اسم العميل
            </label>
            <Input
              type="text"
              placeholder="أدخل اسم العميل"
              value={formData.customer_name}
              onChange={(e) =>
                handleInputChange("customer_name", e.target.value)
              }
              className="w-full"
            />
          </div>

          {/* Customer Phone Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              رقم هاتف العميل
            </label>
            <Input
              type="tel"
              placeholder="أدخل رقم الهاتف"
              value={formData.customer_phone}
              onChange={(e) =>
                handleInputChange("customer_phone", e.target.value)
              }
              className="w-full"
            />
          </div>

          {/* Stage Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">المرحلة</label>
            <Select
              value={formData.stage_id}
              onValueChange={(value) => handleInputChange("stage_id", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر المرحلة" />
              </SelectTrigger>
              <SelectContent>
                {pipelineStages.map((stage: PipelineStage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cards Section - Animated */}
          <AnimatePresence>
            {shouldShowCards && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-3 pt-2"
              >
                <label className="text-sm font-medium text-gray-700 block">
                  اختر نوع العقار:
                </label>

                <div className="grid grid-cols-1 gap-3">
                  {/* Existing Property Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    onClick={() => handleOptionSelect("existing")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOption === "existing"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedOption === "existing"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Home className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          عقار موجود بالفعل
                        </h3>
                        <p className="text-sm text-gray-500">
                          اختر عقار من قائمة العقارات الخاصة بك
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* New Property Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    onClick={() => handleOptionSelect("new")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOption === "new"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedOption === "new"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Plus className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          ربطه بعقار جديد
                        </h3>
                        <p className="text-sm text-gray-500">
                          أنشئ عقار جديد واربطه بهذه الصفقة
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Properties Dropdown - Show when "existing" is selected */}
                <AnimatePresence>
                  {selectedOption === "existing" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-medium text-gray-700">
                        اختر العقار
                      </label>
                      {isLoadingProperties ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                          <span className="mr-2 text-sm text-gray-500">
                            جاري تحميل العقارات...
                          </span>
                        </div>
                      ) : (
                        <Select
                          value={selectedProperty}
                          onValueChange={setSelectedProperty}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="اختر العقار" />
                          </SelectTrigger>
                          <SelectContent>
                            {properties.length === 0 ? (
                              <SelectItem value="no-properties" disabled>
                                لا توجد عقارات متاحة
                              </SelectItem>
                            ) : (
                              properties.map((property) => (
                                <SelectItem
                                  key={property.id}
                                  value={property.id.toString()}
                                >
                                  {property.title} - {property.address}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}

                      {/* Submit Button */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="pt-2"
                      >
                        <Button
                          onClick={handleSubmit}
                          disabled={!isSubmitEnabled || isSubmitting}
                          className="w-full"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              جاري الإرسال...
                            </>
                          ) : (
                            "إرسال"
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
