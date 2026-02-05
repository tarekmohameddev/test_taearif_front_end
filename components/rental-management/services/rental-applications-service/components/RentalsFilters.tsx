"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterOptions } from "../types/types";

interface RentalsFiltersProps {
  localSearchTerm: string;
  setLocalSearchTerm: (value: string) => void;
  contractStatusFilter: string;
  setContractStatusFilter: (value: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (value: string) => void;
  rentalMethodFilter: string;
  setRentalMethodFilter: (value: string) => void;
  buildingFilter: string;
  setBuildingFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;
  contractStartDateFilter: string;
  setContractStartDateFilter: (value: string) => void;
  contractStartFromDate: string;
  setContractStartFromDate: (value: string) => void;
  contractStartToDate: string;
  setContractStartToDate: (value: string) => void;
  contractEndDateFilter: string;
  setContractEndDateFilter: (value: string) => void;
  contractEndFromDate: string;
  setContractEndFromDate: (value: string) => void;
  contractEndToDate: string;
  setContractEndToDate: (value: string) => void;
  filterOptions: FilterOptions;
}

export function RentalsFilters({
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
}: RentalsFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor="search">البحث</Label>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="البحث في الإيجارات..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contract-status">حالة الإيجار</Label>
        <Select
          value={contractStatusFilter}
          onValueChange={setContractStatusFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر حالة الإيجار" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {filterOptions.contract_statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="payment-status">حالة الدفع</Label>
        <Select
          value={paymentStatusFilter}
          onValueChange={setPaymentStatusFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر حالة الدفع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {filterOptions.payment_statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rental-method">طريقة الإيجار</Label>
        <Select
          value={rentalMethodFilter}
          onValueChange={setRentalMethodFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر طريقة الإيجار" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الطرق</SelectItem>
            {filterOptions.paying_plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="building">العمارة</Label>
        <Select
          value={buildingFilter}
          onValueChange={setBuildingFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر العمارة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المباني</SelectItem>
            {filterOptions.buildings.map((building) => (
              <SelectItem key={building.id} value={building.id.toString()}>
                {building.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">التاريخ</Label>
        <Select
          value={dateFilter}
          onValueChange={setDateFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر التاريخ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">اليوم</SelectItem>
            <SelectItem value="week">هذا الأسبوع</SelectItem>
            <SelectItem value="month">هذا الشهر</SelectItem>
            <SelectItem value="custom">مخصص</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {dateFilter === "custom" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="from-date">من تاريخ</Label>
            <Input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to-date">إلى تاريخ</Label>
            <Input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="contract-start-date-filter">تاريخ بداية العقد</Label>
        <Select
          value={contractStartDateFilter || "all"}
          onValueChange={setContractStartDateFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر التاريخ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التواريخ</SelectItem>
            <SelectItem value="today">اليوم</SelectItem>
            <SelectItem value="week">هذا الأسبوع</SelectItem>
            <SelectItem value="month">هذا الشهر</SelectItem>
            <SelectItem value="custom">مخصص</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {contractStartDateFilter === "custom" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="contract-start-from-date">من تاريخ</Label>
            <Input
              id="contract-start-from-date"
              type="date"
              value={contractStartFromDate || ""}
              onChange={(e) => setContractStartFromDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contract-start-to-date">إلى تاريخ</Label>
            <Input
              id="contract-start-to-date"
              type="date"
              value={contractStartToDate || ""}
              onChange={(e) => setContractStartToDate(e.target.value)}
            />
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="contract-end-date-filter">تاريخ نهاية العقد</Label>
        <Select
          value={contractEndDateFilter || "all"}
          onValueChange={setContractEndDateFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر التاريخ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التواريخ</SelectItem>
            <SelectItem value="today">اليوم</SelectItem>
            <SelectItem value="week">هذا الأسبوع</SelectItem>
            <SelectItem value="month">هذا الشهر</SelectItem>
            <SelectItem value="custom">مخصص</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {contractEndDateFilter === "custom" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="contract-end-from-date">من تاريخ</Label>
            <Input
              id="contract-end-from-date"
              type="date"
              value={contractEndFromDate || ""}
              onChange={(e) => setContractEndFromDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contract-end-to-date">إلى تاريخ</Label>
            <Input
              id="contract-end-to-date"
              type="date"
              value={contractEndToDate || ""}
              onChange={(e) => setContractEndToDate(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
}
