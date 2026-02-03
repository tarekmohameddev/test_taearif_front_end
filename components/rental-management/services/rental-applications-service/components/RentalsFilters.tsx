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
  paymentStatusFilter: string;
  rentalMethodFilter: string;
  buildingFilter: string;
  dateFilter: string;
  fromDate: string;
  toDate: string;
  contractStartDateFilter: string;
  contractStartFromDate: string;
  contractStartToDate: string;
  contractEndDateFilter: string;
  contractEndFromDate: string;
  contractEndToDate: string;
  filterOptions: FilterOptions;
  setRentalApplications: (updates: any) => void;
}

export function RentalsFilters({
  localSearchTerm,
  setLocalSearchTerm,
  contractStatusFilter,
  paymentStatusFilter,
  rentalMethodFilter,
  buildingFilter,
  dateFilter,
  fromDate,
  toDate,
  contractStartDateFilter,
  contractStartFromDate,
  contractStartToDate,
  contractEndDateFilter,
  contractEndFromDate,
  contractEndToDate,
  filterOptions,
  setRentalApplications,
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
          onValueChange={(value) =>
            setRentalApplications({ contractStatusFilter: value })
          }
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
          onValueChange={(value) =>
            setRentalApplications({ paymentStatusFilter: value })
          }
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
          onValueChange={(value) =>
            setRentalApplications({ rentalMethodFilter: value })
          }
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
          onValueChange={(value) =>
            setRentalApplications({ buildingFilter: value })
          }
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
          onValueChange={(value) =>
            setRentalApplications({ dateFilter: value })
          }
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
              onChange={(e) =>
                setRentalApplications({ fromDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to-date">إلى تاريخ</Label>
            <Input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(e) =>
                setRentalApplications({ toDate: e.target.value })
              }
            />
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="contract-start-date-filter">تاريخ بداية العقد</Label>
        <Select
          value={contractStartDateFilter || "all"}
          onValueChange={(value) =>
            setRentalApplications({ contractStartDateFilter: value })
          }
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
              onChange={(e) =>
                setRentalApplications({
                  contractStartFromDate: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contract-start-to-date">إلى تاريخ</Label>
            <Input
              id="contract-start-to-date"
              type="date"
              value={contractStartToDate || ""}
              onChange={(e) =>
                setRentalApplications({ contractStartToDate: e.target.value })
              }
            />
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="contract-end-date-filter">تاريخ نهاية العقد</Label>
        <Select
          value={contractEndDateFilter || "all"}
          onValueChange={(value) =>
            setRentalApplications({ contractEndDateFilter: value })
          }
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
              onChange={(e) =>
                setRentalApplications({ contractEndFromDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contract-end-to-date">إلى تاريخ</Label>
            <Input
              id="contract-end-to-date"
              type="date"
              value={contractEndToDate || ""}
              onChange={(e) =>
                setRentalApplications({ contractEndToDate: e.target.value })
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
