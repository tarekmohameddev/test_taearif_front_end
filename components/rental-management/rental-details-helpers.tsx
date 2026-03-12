import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import {
  formatCurrency as baseFormatCurrency,
  formatDate as baseFormatDate,
} from "@/components/rental-management/dashboard-stats/utils/formatters";

import type {
  RentalDetails,
  RentalPaymentItem,
} from "@/components/rental-management/rental-details-types";

export const formatDate = (dateString: string | null): string =>
  baseFormatDate(dateString);

export const formatCurrency = (
  amount: number | string | null,
  currency: string = "SAR",
): string => baseFormatCurrency(amount, currency);

export const getUnitName = (details: RentalDetails | null): string => {
  if (!details) return "غير محدد";

  if (details.contract?.property_name) {
    return details.contract.property_name;
  }
  if (details.contract?.project_name) {
    return details.contract.project_name;
  }

  if (details.property?.name) {
    return details.property.name;
  }
  if (details.property?.unit_label) {
    return details.property.unit_label;
  }
  if (details.property?.building?.name) {
    return details.property.building.name;
  }
  if (details.property?.project?.name) {
    return details.property.project.name;
  }

  if (details.rental?.unit_name) {
    return details.rental.unit_name;
  }
  if (details.rental?.unit_label) {
    return details.rental.unit_label;
  }
  if (details.rental?.property_name) {
    return details.rental.property_name;
  }
  if (details.rental?.project_name) {
    return details.rental.project_name;
  }
  if (details.rental?.building_name) {
    return details.rental.building_name;
  }

  return "غير محدد";
};

export const getPropertyNumber = (details: RentalDetails | null): string => {
  if (!details) return "غير محدد";

  if (details.contract?.property_id) {
    return String(details.contract.property_id);
  }
  if (details.contract?.project_id) {
    return String(details.contract.project_id);
  }

  if (details.property?.property_number) {
    return details.property.property_number;
  }
  if (details.property?.id) {
    return String(details.property.id);
  }
  if (details.property?.building?.id) {
    return String(details.property.building.id);
  }
  if (details.property?.project?.id) {
    return String(details.property.project.id);
  }

  if (details.rental?.property_number) {
    return details.rental.property_number;
  }
  if (details.rental?.property_id) {
    return String(details.rental.property_id);
  }
  if (details.rental?.project_id) {
    return String(details.rental.project_id);
  }
  if (details.rental?.building_id) {
    return String(details.rental.building_id);
  }

  return "غير محدد";
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 ml-1" />;
    case "pending":
      return <Clock className="h-4 w-4 ml-1" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 ml-1" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 ml-1" />;
    default:
      return <AlertCircle className="h-4 w-4 ml-1" />;
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "active":
      return "نشط";
    case "pending":
      return "في الانتظار";
    case "completed":
      return "مكتمل";
    case "cancelled":
      return "ملغي";
    default:
      return status;
  }
};

export const getPaymentStatusColor = (payment: RentalPaymentItem): string => {
  if (payment.paid_amount >= payment.amount) {
    return "bg-green-100 text-green-800 border-green-200";
  }

  if (payment.status === "paid" || payment.status === "paid_in_full") {
    return "bg-green-100 text-green-800 border-green-200";
  }

  switch (payment.payment_status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200";
    case "not_due":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getPaymentStatusText = (payment: RentalPaymentItem): string => {
  if (payment.paid_amount >= payment.amount) {
    return "مدفوع";
  }

  if (payment.status === "paid" || payment.status === "paid_in_full") {
    return "مدفوع";
  }

  switch (payment.payment_status) {
    case "pending":
      return "في الانتظار";
    case "overdue":
      return "متأخر";
    case "not_due":
      return "غير مستحق";
    default:
      return payment.payment_status;
  }
};

