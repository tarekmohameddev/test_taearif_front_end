"use client";

import { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomDropdown, DropdownItem, DropdownContext } from "@/components/customComponents/customDropdown";
import {
  Calendar,
  Timer,
  MapPin,
  DollarSign,
  Building2,
  Filter,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPOINTMENT_TYPES,
  PROPERTY_TYPE_OPTIONS,
  SAUDI_REGIONS,
  priorityLabels,
} from "./constants";
import { SourceBadge } from "../actions/SourceBadge";
import type { AppointmentTypeOption } from "./AdvancedFiltersPanel";
import type { CustomerSource, Priority } from "@/types/unified-customer";

const SOURCES: CustomerSource[] = [
  "whatsapp",
  "inquiry",
  "manual",
  "referral",
  "import",
];
const PRIORITIES: Priority[] = ["urgent", "high", "medium", "low"];

export interface AdvancedFiltersDialogContentProps {
  selectedSources: string[];
  setSelectedSources: (v: string[] | ((prev: string[]) => string[])) => void;
  selectedPriorities: string[];
  setSelectedPriorities: (v: string[] | ((prev: string[]) => string[])) => void;
  selectedAssignees: string[];
  setSelectedAssignees: (v: string[] | ((prev: string[]) => string[])) => void;
  uniqueAssignees: { id: string; name: string }[];
  selectedAppointmentTypes: string[];
  setSelectedAppointmentTypes: (v: string[] | ((prev: string[]) => string[])) => void;
  appointmentTypes?: AppointmentTypeOption[];
  dueDateFilter: string;
  setDueDateFilter: (v: string) => void;
  selectedCities: string[];
  setSelectedCities: (v: string[] | ((prev: string[]) => string[])) => void;
  selectedStates: string[];
  setSelectedStates: (v: string[] | ((prev: string[]) => string[])) => void;
  budgetMin: string;
  budgetMax: string;
  setBudgetMin: (v: string) => void;
  setBudgetMax: (v: string) => void;
  selectedPropertyTypes: string[];
  setSelectedPropertyTypes: (v: string[] | ((prev: string[]) => string[])) => void;
  uniqueCities: string[];
  tempBudgetMin: string;
  tempBudgetMax: string;
  setTempBudgetMin: (v: string) => void;
  setTempBudgetMax: (v: string) => void;
  isBudgetDialogOpen: boolean;
  setIsBudgetDialogOpen: (v: boolean) => void;
}

const DEFAULT_APPOINTMENT_OPTIONS: AppointmentTypeOption[] = APPOINTMENT_TYPES.map((t) => ({
  id: t.value,
  label: t.label,
  labelEn: t.label,
}));

const DUE_DATE_OPTIONS: { value: string; label: React.ReactNode }[] = [
  { value: "all", label: "الكل" },
  { value: "overdue", label: <span className="text-red-600">متأخر</span> },
  { value: "today", label: "اليوم" },
  { value: "week", label: "هذا الأسبوع" },
  { value: "no_date", label: "بدون تاريخ" },
];

const btnClass =
  "gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700";

function BudgetDropdownContent({
  budgetMin,
  budgetMax,
  setBudgetMin,
  setBudgetMax,
  tempBudgetMin,
  tempBudgetMax,
  setTempBudgetMin,
  setTempBudgetMax,
  setIsBudgetDialogOpen,
}: {
  budgetMin: string;
  budgetMax: string;
  setBudgetMin: (v: string) => void;
  setBudgetMax: (v: string) => void;
  tempBudgetMin: string;
  tempBudgetMax: string;
  setTempBudgetMin: (v: string) => void;
  setTempBudgetMax: (v: string) => void;
  setIsBudgetDialogOpen: (v: boolean) => void;
}) {
  const ctx = useContext(DropdownContext);

  // Sync temp from budget when dropdown opens (content mounts)
  useEffect(() => {
    setTempBudgetMin(budgetMin);
    setTempBudgetMax(budgetMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-64 p-3">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نطاق الميزانية (ر.س)</div>
      <div className="grid grid-cols-2 gap-2 py-2">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">من</label>
          <Input
            type="number"
            placeholder="الحد الأدنى"
            value={tempBudgetMin}
            onChange={(e) => setTempBudgetMin(e.target.value)}
            className="h-8"
            min={0}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">إلى</label>
          <Input
            type="number"
            placeholder="الحد الأقصى"
            value={tempBudgetMax}
            onChange={(e) => setTempBudgetMax(e.target.value)}
            className="h-8"
            min={0}
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          className="flex-1"
          onClick={() => {
            setBudgetMin(tempBudgetMin);
            setBudgetMax(tempBudgetMax);
            setIsBudgetDialogOpen(false);
            ctx?.closeDropdown();
          }}
        >
          تطبيق
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setTempBudgetMin("");
            setTempBudgetMax("");
            setBudgetMin("");
            setBudgetMax("");
            setIsBudgetDialogOpen(false);
            ctx?.closeDropdown();
          }}
        >
          إعادة تعيين
        </Button>
      </div>
    </div>
  );
}

export function AdvancedFiltersDialogContent({
  selectedSources,
  setSelectedSources,
  selectedPriorities,
  setSelectedPriorities,
  selectedAssignees,
  setSelectedAssignees,
  uniqueAssignees,
  selectedAppointmentTypes,
  setSelectedAppointmentTypes,
  appointmentTypes,
  dueDateFilter,
  setDueDateFilter,
  selectedCities,
  setSelectedCities,
  selectedStates,
  setSelectedStates,
  budgetMin,
  budgetMax,
  setBudgetMin,
  setBudgetMax,
  selectedPropertyTypes,
  setSelectedPropertyTypes,
  uniqueCities,
  tempBudgetMin,
  tempBudgetMax,
  setTempBudgetMin,
  setTempBudgetMax,
  isBudgetDialogOpen,
  setIsBudgetDialogOpen,
}: AdvancedFiltersDialogContentProps) {
  const appointmentOpts = appointmentTypes && appointmentTypes.length > 0 ? appointmentTypes : DEFAULT_APPOINTMENT_OPTIONS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {/* المصدر - multi-select */}
      <CustomDropdown
        contentZIndex={10003}
        dropdownWidth="w-48"
        maxHeight="300px"
        triggerClassName={btnClass}
        trigger={
          <>
            <Filter className="h-4 w-4" />
            <span>المصدر</span>
            {selectedSources.length > 0 && (
              <Badge variant="secondary" className="mr-1">
                {selectedSources.length}
              </Badge>
            )}
          </>
        }
      >
        {SOURCES.map((source) => {
          const checked = selectedSources.includes(source);
          return (
            <div
              key={source}
              onClick={() =>
                setSelectedSources((prev) =>
                  checked ? prev.filter((s) => s !== source) : [...prev, source]
                )
              }
              className={cn(
                "cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2",
                checked && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              {checked ? "✓ " : ""}
              <SourceBadge source={source} className="text-xs" />
            </div>
          );
        })}
      </CustomDropdown>

      {/* الأولوية - multi-select */}
      <CustomDropdown
        contentZIndex={10003}
        dropdownWidth="w-40"
        maxHeight="300px"
        triggerClassName={btnClass}
        trigger={
          <>
            <AlertTriangle className="h-4 w-4" />
            <span>الأولوية</span>
            {selectedPriorities.length > 0 && (
              <Badge variant="secondary" className="mr-1">
                {selectedPriorities.length}
              </Badge>
            )}
          </>
        }
      >
        {PRIORITIES.map((p) => {
          const checked = selectedPriorities.includes(p);
          return (
            <div
              key={p}
              onClick={() =>
                setSelectedPriorities((prev) =>
                  checked ? prev.filter((x) => x !== p) : [...prev, p]
                )
              }
              className={cn(
                "cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2",
                checked && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              {checked ? "✓ " : ""}
              {priorityLabels[p as Priority]}
            </div>
          );
        })}
      </CustomDropdown>

      {/* الموظف - multi-select */}
      {uniqueAssignees.length > 0 && (
        <CustomDropdown
          contentZIndex={10003}
          dropdownWidth="w-48"
          maxHeight="300px"
          triggerClassName={btnClass}
          trigger={
            <>
              <UserPlus className="h-4 w-4" />
              <span>الموظف</span>
              {selectedAssignees.length > 0 && (
                <Badge variant="secondary" className="mr-1">
                  {selectedAssignees.length}
                </Badge>
              )}
            </>
          }
        >
          {uniqueAssignees.map((a) => {
            const checked = selectedAssignees.includes(a.id);
            return (
              <div
                key={a.id}
                onClick={() =>
                  setSelectedAssignees((prev) =>
                    checked ? prev.filter((x) => x !== a.id) : [...prev, a.id]
                  )
                }
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2",
                  checked && "bg-gray-100 dark:bg-gray-800"
                )}
              >
                {checked ? "✓ " : ""}
                {a.name}
              </div>
            );
          })}
        </CustomDropdown>
      )}

      {/* نوع الموعد - multi-select */}
      <CustomDropdown
        contentZIndex={10003}
        dropdownWidth="w-48"
        maxHeight="300px"
        triggerClassName={btnClass}
        trigger={
          <>
            <Calendar className="h-4 w-4" />
            <span>نوع الموعد</span>
            {selectedAppointmentTypes.length > 0 && (
              <Badge variant="secondary" className="mr-1">
                {selectedAppointmentTypes.length}
              </Badge>
            )}
          </>
        }
      >
        {appointmentOpts.map((opt) => {
          const checked = selectedAppointmentTypes.includes(opt.id);
          return (
            <div
              key={opt.id}
              onClick={() =>
                setSelectedAppointmentTypes((prev) =>
                  checked ? prev.filter((t) => t !== opt.id) : [...prev, opt.id]
                )
              }
              className={cn(
                "cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2",
                checked && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              {checked ? "✓ " : ""}
              {opt.label}
            </div>
          );
        })}
      </CustomDropdown>

      {/* الإجراء - single select */}
      <CustomDropdown
        contentZIndex={10003}
        dropdownWidth="w-40"
        maxHeight="300px"
        triggerClassName={btnClass}
        trigger={
          <>
            <Timer className="h-4 w-4" />
            <span>الإجراء</span>
            {dueDateFilter !== "all" && (
              <Badge variant="secondary" className="mr-1">
                1
              </Badge>
            )}
          </>
        }
      >
        {DUE_DATE_OPTIONS.map((opt) => (
          <DropdownItem
            key={opt.value}
            onClick={() => setDueDateFilter(opt.value)}
          >
            {opt.label}
          </DropdownItem>
        ))}
      </CustomDropdown>

      {/* المدينة - multi-select */}
      {uniqueCities.length > 0 && (
        <CustomDropdown
          contentZIndex={10003}
          dropdownWidth="w-48"
          maxHeight="300px"
          triggerClassName={btnClass}
          trigger={
            <>
              <MapPin className="h-4 w-4" />
              <span>المدينة</span>
              {selectedCities.length > 0 && (
                <Badge variant="secondary" className="mr-1">
                  {selectedCities.length}
                </Badge>
              )}
            </>
          }
        >
          {uniqueCities.map((city) => {
            const checked = selectedCities.includes(city);
            return (
              <div
                key={city}
                onClick={() =>
                  setSelectedCities((prev) =>
                    checked ? prev.filter((c) => c !== city) : [...prev, city]
                  )
                }
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2",
                  checked && "bg-gray-100 dark:bg-gray-800"
                )}
              >
                {checked ? "✓ " : ""}
                {city}
              </div>
            );
          })}
        </CustomDropdown>
      )}

      {/* المنطقة - multi-select */}
      <CustomDropdown
        contentZIndex={10003}
        dropdownWidth="w-48"
        maxHeight="300px"
        triggerClassName={btnClass}
        trigger={
          <>
            <MapPin className="h-4 w-4" />
            <span>المنطقة</span>
            {selectedStates.length > 0 && (
              <Badge variant="secondary" className="mr-1">
                {selectedStates.length}
              </Badge>
            )}
          </>
        }
      >
        {SAUDI_REGIONS.map((region) => {
          const checked = selectedStates.includes(region);
          return (
            <div
              key={region}
              onClick={() =>
                setSelectedStates((prev) =>
                  checked ? prev.filter((r) => r !== region) : [...prev, region]
                )
              }
              className={cn(
                "cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2",
                checked && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              {checked ? "✓ " : ""}
              {region}
            </div>
          );
        })}
      </CustomDropdown>

      {/* الميزانية - custom content with form */}
      <CustomDropdown
        contentZIndex={10003}
        dropdownWidth="w-auto"
        maxHeight="300px"
        triggerClassName={btnClass}
        trigger={
          <>
            <DollarSign className="h-4 w-4" />
            <span>الميزانية</span>
            {(budgetMin !== "" || budgetMax !== "") && (
              <Badge variant="secondary" className="mr-1">
                1
              </Badge>
            )}
          </>
        }
      >
        <BudgetDropdownContent
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          setBudgetMin={setBudgetMin}
          setBudgetMax={setBudgetMax}
          tempBudgetMin={tempBudgetMin}
          tempBudgetMax={tempBudgetMax}
          setTempBudgetMin={setTempBudgetMin}
          setTempBudgetMax={setTempBudgetMax}
          setIsBudgetDialogOpen={setIsBudgetDialogOpen}
        />
      </CustomDropdown>

      {/* نوع العقار - multi-select */}
      <CustomDropdown
        contentZIndex={10003}
        dropdownWidth="w-40"
        maxHeight="300px"
        triggerClassName={btnClass}
        trigger={
          <>
            <Building2 className="h-4 w-4" />
            <span>نوع العقار</span>
            {selectedPropertyTypes.length > 0 && (
              <Badge variant="secondary" className="mr-1">
                {selectedPropertyTypes.length}
              </Badge>
            )}
          </>
        }
      >
        {PROPERTY_TYPE_OPTIONS.map((opt) => {
          const checked = selectedPropertyTypes.includes(opt.value);
          return (
            <div
              key={opt.value}
              onClick={() =>
                setSelectedPropertyTypes((prev) =>
                  checked
                    ? prev.filter((t) => t !== opt.value)
                    : [...prev, opt.value]
                )
              }
              className={cn(
                "cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2",
                checked && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              {checked ? "✓ " : ""}
              {opt.label}
            </div>
          );
        })}
      </CustomDropdown>
    </div>
  );
}
