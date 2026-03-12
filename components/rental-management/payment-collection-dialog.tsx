"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  DollarSign,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Hash,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calculator,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface PaymentCollectionData {
  rental_info: {
    id: number;
    tenant_name: string;
    tenant_phone: string;
    tenant_email: string;
    property_address: string;
    unit_label: string;
    property_number: string;
    contract_number: string | null;
  };
  contract: {
    id: number;
    contract_number: string | null;
    start_date: string;
  };
  property: {
    id: number | null;
    name: string | null;
    unit_label: string;
    property_number: string;
    project: {
      id: number | null;
      name: string | null;
    };
  };
  fees_breakdown: {
    platform_fee: number;
    water_fee: number;
    office_fee: number;
    total_fees: number;
  };
  available_fees: Array<{
    fee_type: string;
    fee_name: string;
    total_amount: number;
    paid_amount: string;
    remaining_amount: number;
    status: string;
  }>;
  payment_details: {
    items: Array<{
      id: number;
      sequence_no: number;
      due_date: string;
      rent_amount: number;
      paid_amount: number;
      remaining_amount: number;
      status: string;
      is_overdue: boolean;
    }>;
    summary: {
      total_rent_due: number;
      total_fees_due: number;
      total_due: number;
      total_paid: number;
      total_collected?: number;
      total_remaining: number;
      overdue_count: number;
      paid_count: number;
      partial_count: number;
      unpaid_count: number;
    };
  };
}

export function PaymentCollectionDialog() {
  const { rentalApplications, closePaymentCollectionDialog } = useStore();

  const { isPaymentCollectionDialogOpen, selectedPaymentRentalId } =
    rentalApplications;

  const userData = useAuthStore(selectUserData);

  const [data, setData] = useState<PaymentCollectionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** PREVENT_DUPLICATE_API: مفتاح آخر جلب لتفادي الطلبات المكررة */
  const [lastFetchedPaymentRentalId, setLastFetchedPaymentRentalId] = useState<
    number | null
  >(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [fullPaymentAmount, setFullPaymentAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<
    Array<{
      id: number;
      sequence_no: number;
      amount: number;
      due_date: string;
      rent_amount: number;
    }>
  >([]);
  const [fullPaymentItems, setFullPaymentItems] = useState<
    Array<{
      type: "payment" | "fee";
      id: number | string;
      amount: number;
      label: string;
    }>
  >([]);
  const [paymentType, setPaymentType] = useState<"rent" | "fees" | "both">(
    "rent",
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "bank_transfer" | "cash" | "credit_card"
  >("bank_transfer");
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [reference, setReference] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [transferTo, setTransferTo] = useState<string>("منصة ناجز");
  const [bankNameError, setBankNameError] = useState<string>("");
  const [receiptImagePath, setReceiptImagePath] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [selectedFees, setSelectedFees] = useState<
    Array<{
      type: string;
      amount: number;
      label: string;
    }>
  >([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Cleanup effect to fix pointer-events issue and reset state
  useEffect(() => {
    if (!isPaymentCollectionDialogOpen) {
      // Fix pointer-events issue by removing the style attribute
      setTimeout(() => {
        const body = document.body;
        if (body.style.pointerEvents === "none") {
          body.style.pointerEvents = "";
        }
      }, 100);

      // Reset state when dialog closes
      setSelectedPayments([]);
      setSelectedFees([]);
      setPaymentAmount("");
      setFullPaymentItems([]);
      setData(null);
      setLastFetchedPaymentRentalId(null);
    }
  }, [isPaymentCollectionDialogOpen]);

  // Fetch payment collection data when dialog opens
  useEffect(() => {
    if (
      isPaymentCollectionDialogOpen &&
      selectedPaymentRentalId &&
      userData?.token
    ) {
      fetchPaymentCollectionData();
    }
  }, [isPaymentCollectionDialogOpen, selectedPaymentRentalId, userData?.token]);

  // Auto-select first unpaid payment when data is loaded and dialog is open
  useEffect(() => {
    if (
      isPaymentCollectionDialogOpen &&
      data?.payment_details?.items &&
      selectedPayments.length === 0
    ) {
      // Find first unpaid payment
      const firstUnpaidPayment = data.payment_details.items.find(
        (payment) => payment.status !== "paid",
      );

      if (firstUnpaidPayment && firstUnpaidPayment.remaining_amount > 0) {
        const paymentData = {
          id: firstUnpaidPayment.id,
          sequence_no: firstUnpaidPayment.sequence_no,
          amount: firstUnpaidPayment.rent_amount,
          due_date: firstUnpaidPayment.due_date,
          rent_amount: firstUnpaidPayment.rent_amount,
        };

        setSelectedPayments([paymentData]);
        setPaymentAmount(firstUnpaidPayment.remaining_amount.toString());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaymentCollectionDialogOpen, data?.payment_details?.items]);

  // Auto-update payment type based on selections
  useEffect(() => {
    if (selectedPayments.length > 0 && selectedFees.length > 0) {
      setPaymentType("both");
    } else if (selectedFees.length > 0) {
      setPaymentType("fees");
    } else if (selectedPayments.length > 0) {
      setPaymentType("rent");
    }
  }, [selectedPayments.length, selectedFees.length]);

  const fetchPaymentCollectionData = async () => {
    if (!selectedPaymentRentalId) return;

    if (!userData?.token) {
      console.log("No token available, skipping fetchPaymentCollectionData");
      return;
    }

    if (loading) return;
    if (
      data &&
      lastFetchedPaymentRentalId === selectedPaymentRentalId
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/v1/rms/rentals/${selectedPaymentRentalId}/payment-collection`,
      );

      if (response.data.status) {
        setData(response.data.data);
        setLastFetchedPaymentRentalId(selectedPaymentRentalId);
      } else {
        setError("فشل في تحميل بيانات تحصيل المدفوعات");
      }
    } catch (err: any) {
      console.error("Error fetching payment collection data:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSelect = (payment: any) => {
    const paymentData = {
      id: payment.id,
      sequence_no: payment.sequence_no,
      amount: payment.rent_amount, // Only rent amount now
      due_date: payment.due_date,
      rent_amount: payment.rent_amount,
    };

    setSelectedPayments((prev) => {
      const isSelected = prev.some((p) => p.id === payment.id);

      if (isSelected) {
        // Remove payment if already selected
        const newPayments = prev.filter((p) => p.id !== payment.id);
        // Subtract the removed payment amount from current input
        const currentAmount = Number(paymentAmount) || 0;
        const newAmount = Math.max(0, currentAmount - paymentData.amount);
        setPaymentAmount(newAmount.toString());
        return newPayments;
      } else {
        // Add payment if not selected
        const newPayments = [...prev, paymentData];
        // Add the new payment amount to current input
        const currentAmount = Number(paymentAmount) || 0;
        const newAmount = currentAmount + paymentData.amount;
        setPaymentAmount(newAmount.toString());
        return newPayments;
      }
    });
  };

  const handleFeeSelect = (feeType: string, amount: number, label: string) => {
    setSelectedFees((prev) => {
      const isSelected = prev.some((f) => f.type === feeType);

      if (isSelected) {
        // Remove fee if already selected
        const newFees = prev.filter((f) => f.type !== feeType);
        // Subtract the removed fee amount from current input
        const currentAmount = Number(paymentAmount) || 0;
        const newAmount = Math.max(0, currentAmount - amount);
        setPaymentAmount(newAmount.toString());
        return newFees;
      } else {
        // Add fee if not selected
        const newFees = [...prev, { type: feeType, amount, label }];
        // Add the new fee amount to current input
        const currentAmount = Number(paymentAmount) || 0;
        const newAmount = currentAmount + amount;
        setPaymentAmount(newAmount.toString());
        return newFees;
      }
    });
  };

  // Handle partial fee payment
  const handlePartialFeePayment = (
    feeType: string,
    maxAmount: number,
    label: string,
  ) => {
    const currentAmount = Number(paymentAmount) || 0;
    if (currentAmount > 0 && currentAmount < maxAmount) {
      // Add partial payment
      setSelectedFees((prev) => {
        const existingFee = prev.find((f) => f.type === feeType);
        if (existingFee) {
          // Update existing fee amount
          return prev.map((f) =>
            f.type === feeType ? { ...f, amount: currentAmount } : f,
          );
        } else {
          // Add new partial fee
          return [...prev, { type: feeType, amount: currentAmount, label }];
        }
      });
    }
  };

  // Calculate total amount from selected payments and fees
  const getTotalSelectedAmount = () => {
    const paymentsTotal = selectedPayments.reduce(
      (sum, p) => sum + p.amount,
      0,
    );
    const feesTotal = selectedFees.reduce((sum, f) => sum + f.amount, 0);
    return paymentsTotal + feesTotal;
  };

  // Calculate total full payment amount
  const getTotalFullPaymentAmount = () => {
    return fullPaymentItems.reduce((sum, item) => sum + item.amount, 0);
  };

  // Smart payment distribution logic
  const getSmartPaymentDistribution = () => {
    const enteredAmount = Number(paymentAmount) || 0;
    const totalSelectedAmount = getTotalSelectedAmount();

    if (enteredAmount <= 0 || totalSelectedAmount <= 0) {
      return {
        fullPayments: [],
        partialPayments: [],
        remainingAmount: 0,
        suggestion: null,
      };
    }

    // If amount is sufficient for all items
    if (enteredAmount >= totalSelectedAmount) {
      const allItems: Array<{
        type: "payment" | "fee";
        id: number | string;
        amount: number;
        sequence_no?: number;
        label?: string;
        partialAmount?: number;
      }> = [
        ...selectedPayments.map((p) => ({
          type: "payment" as const,
          id: p.id,
          amount: p.amount,
          sequence_no: p.sequence_no,
        })),
        ...selectedFees.map((f) => ({
          type: "fee" as const,
          id: f.type,
          amount: f.amount,
          label: f.label,
        })),
      ];

      return {
        fullPayments: allItems,
        partialPayments: [],
        remainingAmount: enteredAmount - totalSelectedAmount,
        suggestion:
          enteredAmount > totalSelectedAmount
            ? `المبلغ كافي لدفع جميع العناصر المحددة. المبلغ المتبقي: ${formatCurrency(enteredAmount - totalSelectedAmount)} سيتم توزيعه على باقي المستحقات بشكل جزئي.`
            : "المبلغ كافي لدفع جميع العناصر المحددة بالكامل.",
      };
    }

    // Sort items by amount (ascending) to prioritize smaller amounts for full payment
    const allItems: Array<{
      type: "payment" | "fee";
      id: number | string;
      amount: number;
      sequence_no?: number;
      label?: string;
      partialAmount?: number;
    }> = [
      ...selectedPayments.map((p) => ({
        type: "payment" as const,
        id: p.id,
        amount: p.amount,
        sequence_no: p.sequence_no,
      })),
      ...selectedFees.map((f) => ({
        type: "fee" as const,
        id: f.type,
        amount: f.amount,
        label: f.label,
      })),
    ].sort((a, b) => a.amount - b.amount);

    const fullPayments: typeof allItems = [];
    const partialPayments: typeof allItems = [];
    let remainingAmount = enteredAmount;

    // Try to pay full amounts starting from smallest
    for (const item of allItems) {
      if (remainingAmount >= item.amount) {
        fullPayments.push(item);
        remainingAmount -= item.amount;
      } else {
        partialPayments.push(item);
      }
    }

    // If we have remaining amount and partial payments, distribute it
    if (remainingAmount > 0 && partialPayments.length > 0) {
      const totalPartialAmount = partialPayments.reduce(
        (sum, item) => sum + item.amount,
        0,
      );
      if (remainingAmount < totalPartialAmount) {
        // Distribute remaining amount proportionally among partial payments
        for (const item of partialPayments) {
          const proportion = item.amount / totalPartialAmount;
          item.partialAmount =
            Math.round(remainingAmount * proportion * 100) / 100;
        }
        remainingAmount = 0;
      }
    }

    return {
      fullPayments,
      partialPayments,
      remainingAmount,
      suggestion:
        fullPayments.length > 0
          ? `سيتم دفع ${fullPayments.length} عنصر بالكامل و ${partialPayments.length} عنصر جزئياً.`
          : `سيتم دفع جميع العناصر جزئياً.`,
    };
  };

  // Check if payment amount is valid
  const isPaymentAmountValid = () => {
    const enteredAmount = Number(paymentAmount) || 0;
    return enteredAmount > 0 || fullPaymentItems.length > 0;
  };

  // Get validation message
  const getValidationMessage = () => {
    const enteredAmount = Number(paymentAmount) || 0;

    if (enteredAmount <= 0 && fullPaymentItems.length === 0) {
      return "يرجى إدخال مبلغ أكبر من صفر أو تحديد دفعات كاملة";
    }

    return null;
  };

  // Handle full payment for installments
  const handleFullPaymentSelect = (payment: any) => {
    const fullPaymentItem = {
      type: "payment" as const,
      id: payment.id,
      amount: payment.rent_amount,
      label: `الدفعة رقم ${payment.sequence_no}`,
    };

    setFullPaymentItems((prev) => {
      const isSelected = prev.some(
        (item) => item.type === "payment" && item.id === payment.id,
      );

      if (isSelected) {
        // Remove from full payment items
        return prev.filter(
          (item) => !(item.type === "payment" && item.id === payment.id),
        );
      } else {
        // Add to full payment items
        return [...prev, fullPaymentItem];
      }
    });
  };

  // Handle full payment for fees
  const handleFullFeeSelect = (
    feeType: string,
    amount: number,
    label: string,
  ) => {
    const fullPaymentItem = {
      type: "fee" as const,
      id: feeType,
      amount: amount,
      label: label,
    };

    setFullPaymentItems((prev) => {
      const isSelected = prev.some(
        (item) => item.type === "fee" && item.id === feeType,
      );

      if (isSelected) {
        // Remove from full payment items
        return prev.filter(
          (item) => !(item.type === "fee" && item.id === feeType),
        );
      } else {
        // Add to full payment items
        return [...prev, fullPaymentItem];
      }
    });
  };

  const handlePaymentSubmit = async () => {
    if (
      !selectedPaymentRentalId ||
      !paymentAmount ||
      isNaN(Number(paymentAmount)) ||
      Number(paymentAmount) <= 0
    ) {
      return;
    }

    // Validate bank name if payment method is bank transfer
    if (!validateBankName()) {
      return;
    }

    // Open confirmation dialog instead of submitting directly
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (
      !selectedPaymentRentalId ||
      !paymentAmount ||
      isNaN(Number(paymentAmount)) ||
      Number(paymentAmount) <= 0
    ) {
      return;
    }

    setIsSubmitting(true);
    setIsConfirmDialogOpen(false);

    try {
      const requestBody = {
        payments: [], // Always empty array
        payment_amount: paymentAmount, // Send as string
        payment_method: paymentMethod,
        payment_date: paymentDate,
        reference: reference || `PAY-${Date.now()}`,
        notes: notes,
        transfer_to: transferTo,
        ...(paymentMethod === "bank_transfer" && {
          bank_name: bankName,
        }),
        ...(receiptImagePath && {
          receipt_image_path: receiptImagePath,
        }),
      };

      const response = await axiosInstance.post(
        `/v1/rms/rentals/${selectedPaymentRentalId}/collect-payment`,
        requestBody,
      );

      if (response.data.status) {
        // Refresh data after successful payment
        await fetchPaymentCollectionData();
        setPaymentAmount("");
        setSelectedPayments([]);
        setSelectedFees([]);
        setFullPaymentItems([]);
        setReference("");
        setNotes("");
        setBankName("");
        setTransferTo("منصة ناجز");
        setReceiptImagePath("");
        // Show success message or handle success
      }
    } catch (err: any) {
      console.error("Error submitting payment:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء إرسال الدفع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "SAR") => {
    return new Intl.NumberFormat("ar-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("receipt_image", file);

      const response = await axiosInstance.post(
        "/v1/rms/rentals/upload-receipt-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status) {
        setReceiptImagePath(response.data.data.image_path);
        console.log(
          "Image uploaded successfully:",
          response.data.data.image_path,
        );
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // You might want to show a toast notification here
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Function to validate bank name
  const validateBankName = (): boolean => {
    if (paymentMethod === "bank_transfer" && !bankName.trim()) {
      setBankNameError("يجب كتابة اسم البنك");
      return false;
    }
    setBankNameError("");
    return true;
  };

  const translateFeeName = (feeName: string) => {
    const translations: { [key: string]: string } = {
      "Platform Fee": "رسوم المنصة",
      "Water Fee": "رسوم المياه",
      "Office Fee": "رسوم المكتب",
      platform_fee: "رسوم المنصة",
      water_fee: "رسوم المياه",
      office_fee: "رسوم المكتب",
    };

    return translations[feeName] || feeName;
  };

  const getPaymentStatusColor = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "unpaid":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "partial":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusText = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return "متأخر";
    }
    switch (status) {
      case "paid":
        return "مدفوع";
      case "pending":
        return "في الانتظار";
      case "overdue":
        return "متأخر";
      case "unpaid":
        return "غير مدفوع";
      case "partial":
        return "جزئي";
      default:
        return status;
    }
  };

  const getPaymentStatusIcon = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return <XCircle className="h-4 w-4 ml-1" />;
    }
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 ml-1" />;
      case "pending":
        return <Clock className="h-4 w-4 ml-1" />;
      case "overdue":
        return <XCircle className="h-4 w-4 ml-1" />;
      case "unpaid":
        return <AlertCircle className="h-4 w-4 ml-1" />;
      case "partial":
        return <DollarSign className="h-4 w-4 ml-1" />;
      default:
        return <AlertCircle className="h-4 w-4 ml-1" />;
    }
  };

  if (!isPaymentCollectionDialogOpen) return null;

  return (
    <Dialog
      open={isPaymentCollectionDialogOpen}
      onOpenChange={closePaymentCollectionDialog}
    >
      <DialogContent
        className="w-[95vw] max-w-7xl max-h-[95vh] overflow-y-auto text-right p-2 sm:p-4 md:p-6"
        dir="rtl"
        style={{
          pointerEvents: isPaymentCollectionDialogOpen ? "auto" : "none",
        }}
      >
        <DialogHeader className="space-y-2 sm:space-y-4 text-right">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right">
              تحصيل المدفوعات
            </DialogTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchPaymentCollectionData}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8 sm:py-12 text-right">
            <span className="ml-2 text-sm sm:text-base text-gray-500">
              جاري تحميل البيانات...
            </span>
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-500" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8 sm:py-12 text-right">
            <span className="text-sm sm:text-base text-red-500">{error}</span>
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mr-2" />
          </div>
        )}

        {data && !loading && (
          <div className="space-y-6 text-right">
            {/* Payment Summary */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <CardTitle
                  className="flex items-center gap-3 text-right text-lg sm:text-xl"
                  dir="rtl"
                >
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  ملخص المدفوعات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">إجمالي المستحق</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(
                        data.payment_details?.summary?.total_due || 0,
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">إجمالي المدفوع</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(
                        data.payment_details?.summary?.total_collected || 0,
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingDown className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">المتبقي</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(
                        data.payment_details?.summary?.total_remaining || 0,
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">المتأخرات</p>
                    <p className="text-lg font-bold text-gray-900">
                      {data.payment_details?.summary?.overdue_count || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Type Selection */}
            {/* مختفي فقط ولا اريد ازالته */}
            {/* <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <CardTitle
                  className="flex items-center gap-3 text-right text-lg sm:text-xl"
                  dir="rtl"
                >
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  نوع الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setPaymentType("rent")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      paymentType === "rent"
                        ? "bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    دفع الإيجار
                  </button>
                  <button
                    onClick={() => setPaymentType("fees")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      paymentType === "fees"
                        ? "bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    دفع الرسوم
                  </button>
                  <button
                    onClick={() => setPaymentType("both")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      paymentType === "both"
                        ? "bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    دفع الإيجار والرسوم
                  </button>
                </div>
              </CardContent>
            </Card> */}

            {/* Payment Details Section */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <CardTitle
                  className="flex items-center gap-3 text-right text-lg sm:text-xl"
                  dir="rtl"
                >
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  تفاصيل الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="payment-method"
                      className="text-right block text-sm font-medium text-gray-700"
                    >
                      طريقة الدفع
                    </Label>
                    <select
                      id="payment-method"
                      value={paymentMethod}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value as any);
                        if (bankNameError) {
                          setBankNameError("");
                        }
                      }}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 focus:ring-2 focus:ring-gray-200 text-right"
                      dir="rtl"
                    >
                      <option value="bank_transfer">تحويل بنكي</option>
                      <option value="cash">نقداً</option>
                      <option value="credit_card">بطاقة ائتمان</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="payment-date"
                      className="text-right block text-sm font-medium text-gray-700"
                    >
                      تاريخ الدفع
                    </Label>
                    <Input
                      id="payment-date"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="text-right border-2 border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="reference"
                      className="text-right block text-sm font-medium text-gray-700"
                    >
                      رقم المرجع (اختياري)
                    </Label>
                    <Input
                      id="reference"
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="مثال: TXN-001"
                      className="text-right border-2 border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="notes"
                      className="text-right block text-sm font-medium text-gray-700"
                    >
                      ملاحظات (اختياري)
                    </Label>
                    <Input
                      id="notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="ملاحظات إضافية..."
                      className="text-right border-2 border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                      dir="rtl"
                    />
                  </div>

                  {paymentMethod === "bank_transfer" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="bank-name"
                        className="text-right block text-sm font-medium text-gray-700"
                      >
                        اسم البنك
                      </Label>
                      <Input
                        id="bank-name"
                        type="text"
                        value={bankName}
                        onChange={(e) => {
                          setBankName(e.target.value);
                          if (bankNameError) {
                            setBankNameError("");
                          }
                        }}
                        placeholder="مثال: البنك الأهلي السعودي"
                        className="text-right border-2 border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                        dir="rtl"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="transfer-to"
                      className="text-right block text-sm font-medium text-gray-700"
                    >
                      التحويل إلى
                    </Label>
                    <select
                      id="transfer-to"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 focus:ring-2 focus:ring-gray-200 text-right"
                      dir="rtl"
                    >
                      <option value="منصة ناجز">منصة ناجز</option>
                      <option value="المكتب">المكتب</option>
                      <option value="المالك">المالك</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-right block text-sm font-medium text-gray-700">
                      رفع صورة الإيصال (اختياري)
                    </Label>

                    {receiptImagePath && receiptImagePath.trim() !== "" ? (
                      // حالة ما بعد الرفع - عرض الصورة مع إمكانية الحذف فقط
                      <div className="relative">
                        <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm text-green-700 font-medium">
                              تم رفع صورة الإيصال بنجاح
                            </p>
                            <p className="text-xs text-green-600">
                              يمكنك الضغط على الصورة لمشاهدتها
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setReceiptImagePath("");
                              // إعادة تعيين input file
                              const fileInput = document.getElementById(
                                "receipt-upload",
                              ) as HTMLInputElement;
                              if (fileInput) {
                                fileInput.value = "";
                              }
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="حذف الصورة"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-2">
                          <img
                            src={`${process.env.NEXT_PUBLIC_Backend_URLWithOutApi}/${receiptImagePath}`}
                            alt="صورة الإيصال"
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => {
                              const fullImageUrl = `${process.env.NEXT_PUBLIC_Backend_URLWithOutApi}/${receiptImagePath}`;
                              window.open(fullImageUrl, "_blank");
                            }}
                            onError={(e) => {
                              console.error(
                                "Error loading image:",
                                receiptImagePath,
                              );
                              console.error(
                                "Full image URL:",
                                `${process.env.NEXT_PUBLIC_Backend_URLWithOutApi}/${receiptImagePath}`,
                              );
                              // في حالة فشل تحميل الصورة، إعادة تعيين المسار
                              setReceiptImagePath("");
                            }}
                          />
                        </div>
                      </div>
                    ) : isUploadingImage ? (
                      // حالة الرفع - عرض مؤشر التحميل فقط
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="text-sm text-gray-600">
                            جاري رفع الصورة...
                          </p>
                        </div>
                      </div>
                    ) : (
                      // حالة ما قبل الرفع - منطقة السحب والإفلات
                      <div
                        className="border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-lg p-6 text-center cursor-pointer transition-all duration-200"
                        onDrop={(e) => {
                          e.preventDefault();
                          if (!isUploadingImage && !receiptImagePath) {
                            const files = e.dataTransfer.files;
                            if (files.length > 0) {
                              handleImageUpload(files[0]);
                            }
                          }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onClick={() => {
                          if (!isUploadingImage && !receiptImagePath) {
                            document.getElementById("receipt-upload")?.click();
                          }
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && !receiptImagePath) {
                              handleImageUpload(file);
                            }
                          }}
                          className="hidden"
                          id="receipt-upload"
                          disabled={!!receiptImagePath}
                        />

                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              اسحب الصورة هنا أو اضغط للرفع
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF حتى 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Input Section */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <CardTitle
                  className="flex items-center gap-3 text-right text-lg sm:text-xl"
                  dir="rtl"
                >
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-white" />
                  </div>
                  إدخال المبلغ المطلوب دفعه
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="max-w-md mx-auto space-y-4">
                  {/* Validation Message */}
                  {getValidationMessage() && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2 text-red-800">
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">
                          {getValidationMessage()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="payment-amount"
                      className="text-right block text-sm font-medium text-gray-700"
                    >
                      المبلغ المطلوب دفعه (ريال سعودي)
                    </Label>

                    <Input
                      id="payment-amount"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="أدخل المبلغ الذي تريد دفعه..."
                      className={`text-right border-2 focus:ring-2 ${
                        getValidationMessage()
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-gray-800 focus:ring-gray-200"
                      }`}
                      dir="rtl"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      المبلغ المتاح للدفع:{" "}
                      {formatCurrency(
                        data.payment_details?.summary?.total_remaining || 0,
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Name Error Message */}
            {bankNameError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-red-800 font-medium">
                    {bankNameError}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handlePaymentSubmit}
                disabled={
                  ((!paymentAmount ||
                    isNaN(Number(paymentAmount)) ||
                    Number(paymentAmount) <= 0) &&
                    fullPaymentItems.length === 0) ||
                  isSubmitting
                }
                className="bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-900 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                dir="rtl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 ml-2" />
                    دفع الرسوم المحددة
                  </>
                )}
              </Button>
              <Button
                onClick={closePaymentCollectionDialog}
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
                dir="rtl"
              >
                إغلاق
              </Button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <DialogContent
            className="w-[95vw] max-w-4xl max-h-[95vh] overflow-y-auto text-right p-2 sm:p-4 md:p-6"
            dir="rtl"
            style={{
              pointerEvents: isConfirmDialogOpen ? "auto" : "none",
            }}
          >
            <DialogHeader className="space-y-2 sm:space-y-4 text-right">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                تأكيد الدفع
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-right">
              {/* Warning Message */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-red-800 mb-2">
                      تحذير مهم
                    </h3>
                    <p className="text-red-700 font-medium">
                      أنت على وشك دفع المبلغ الإجمالي المحدد. يرجى التأكد من صحة
                      البيانات قبل المتابعة.
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice Section */}
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                  <CardTitle
                    className="flex items-center gap-3 text-right text-lg sm:text-xl"
                    dir="rtl"
                  >
                    <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    الفاتورة التي سيتم دفعها
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {(() => {
                    const distribution = getSmartPaymentDistribution();
                    const enteredAmount = Number(paymentAmount) || 0;
                    const totalFullPaymentAmount = getTotalFullPaymentAmount();
                    const totalAmount =
                      enteredAmount > 0
                        ? enteredAmount
                        : totalFullPaymentAmount;

                    return (
                      <div className="space-y-4">
                        {/* Total Amount */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-4 rounded-lg text-center">
                          <p className="text-lg font-bold">المبلغ الإجمالي</p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(totalAmount)}
                          </p>
                        </div>

                        {/* Full Payment Items */}
                        {/* {fullPaymentItems.length > 0 && ( 
                          <div className="space-y-2">
                            <h4 className="text-md font-bold text-gray-900 text-center">
                              الدفعات الكاملة المحددة
                            </h4>
                            <div className="space-y-2">
                              {fullPaymentItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg"
                                >
                                  <span className="text-green-800 font-medium">
                                    {item.label}
                                  </span>
                                  <span className="text-green-900 font-bold">
                                    {formatCurrency(item.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )} */}

                        {/* Smart Distribution */}
                        {/* {enteredAmount > 0 &&
                          (selectedPayments.length > 0 ||
                            selectedFees.length > 0) && (
                            <div className="space-y-4">
                              {distribution.fullPayments.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                  <p className="text-sm font-bold text-gray-900 mb-2">
                                    دفع كامل:
                                  </p>
                                  <div className="space-y-1">
                                    {distribution.fullPayments.map(
                                      (item, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center text-sm"
                                        >
                                          <span className="text-gray-700">
                                            {item.type === "payment"
                                              ? `الدفعة رقم ${item.sequence_no || "غير محدد"}`
                                              : translateFeeName(
                                                  item.label || "رسوم",
                                                )}
                                          </span>
                                          <span className="font-bold text-gray-900">
                                            {formatCurrency(item.amount)}
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}

                              {distribution.partialPayments.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                  <p className="text-sm font-bold text-gray-900 mb-2">
                                    دفع جزئي:
                                  </p>
                                  <div className="space-y-1">
                                    {distribution.partialPayments.map(
                                      (item, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center text-sm"
                                        >
                                          <span className="text-gray-700">
                                            {item.type === "payment"
                                              ? `الدفعة رقم ${item.sequence_no || "غير محدد"}`
                                              : translateFeeName(
                                                  item.label || "رسوم",
                                                )}
                                          </span>
                                          <span className="font-bold text-gray-900">
                                            {item.partialAmount
                                              ? formatCurrency(
                                                  item.partialAmount,
                                                )
                                              : "جزئي"}
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}

                              {distribution.remainingAmount > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <p className="text-sm font-bold text-yellow-800 text-center">
                                    المبلغ المتبقي:{" "}
                                    {formatCurrency(
                                      distribution.remainingAmount,
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                          )} */}

                        {/* Payment Details */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-bold text-gray-900 mb-3 text-center">
                            تفاصيل الدفع
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                طريقة الدفع:
                              </span>
                              <span className="font-medium text-gray-900">
                                {paymentMethod === "bank_transfer"
                                  ? "تحويل بنكي"
                                  : paymentMethod === "cash"
                                    ? "نقداً"
                                    : "بطاقة ائتمان"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                تاريخ الدفع:
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatDate(paymentDate)}
                              </span>
                            </div>
                            {reference && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  رقم المرجع:
                                </span>
                                <span className="font-medium text-gray-900">
                                  {reference}
                                </span>
                              </div>
                            )}
                            {notes && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">ملاحظات:</span>
                                <span className="font-medium text-gray-900">
                                  {notes}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  dir="rtl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 ml-2" />
                      متأكد - دفع المبلغ
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsConfirmDialogOpen(false)}
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
                  dir="rtl"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
