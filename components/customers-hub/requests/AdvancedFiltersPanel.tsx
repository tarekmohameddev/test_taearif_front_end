"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  ChevronDown,
  AlertTriangle,
  Calendar,
  UserPlus,
  Timer,
  MapPin,
  DollarSign,
  Building2,
} from "lucide-react";
import { SourceBadge } from "../actions/SourceBadge";
import {
  priorityLabels,
  APPOINTMENT_TYPES,
  PROPERTY_TYPE_OPTIONS,
} from "./constants";
import type { CustomerSource, Priority } from "@/types/unified-customer";
import type { DistrictsByCityItem } from "./hooks/useRequestsCenterPage";

export interface AppointmentTypeOption {
  id: string;
  label: string;
  labelEn?: string;
}

export type SourceOption = { id: string; label: string; labelEn: string };

export interface AdvancedFiltersPanelProps {
  /** Options from GET filter-options (data.sources). When provided, المصدر uses these. */
  sourceOptions?: SourceOption[];
  selectedSources: string[];
  setSelectedSources: (v: string[] | ((prev: string[]) => string[])) => void;
  selectedPriorities: string[];
  setSelectedPriorities: (v: string[] | ((prev: string[]) => string[])) => void;
  selectedAppointmentTypes: string[];
  setSelectedAppointmentTypes: (v: string[] | ((prev: string[]) => string[])) => void;
  appointmentTypes?: AppointmentTypeOption[];
  selectedAssignees: string[];
  setSelectedAssignees: (v: string[] | ((prev: string[]) => string[])) => void;
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
  uniqueAssignees: { id: string; name: string }[];
  uniqueCities: string[];
  /** أحياء مجمعة حسب المدينة. إن وُجدت تُعرض مع dividers. */
  districtsByCity?: DistrictsByCityItem[];
  districtsLoading?: boolean;
  /** مناطق من الباك اند (fallback). */
  regionOptions?: string[];
  tempBudgetMin: string;
  tempBudgetMax: string;
  setTempBudgetMin: (v: string) => void;
  setTempBudgetMax: (v: string) => void;
  isBudgetDialogOpen: boolean;
  setIsBudgetDialogOpen: (v: boolean) => void;
}

const FALLBACK_SOURCES: CustomerSource[] = [
  "whatsapp",
  "inquiry",
  "manual",
  "referral",
  "import",
];
const PRIORITIES: Priority[] = ["urgent", "high", "medium", "low"];

const DEFAULT_APPOINTMENT_OPTIONS: AppointmentTypeOption[] = APPOINTMENT_TYPES.map((t) => ({
  id: t.value,
  label: t.label,
  labelEn: t.label,
}));

export function AdvancedFiltersPanel({
  sourceOptions,
  selectedSources,
  setSelectedSources,
  selectedPriorities,
  setSelectedPriorities,
  selectedAppointmentTypes,
  setSelectedAppointmentTypes,
  appointmentTypes,
  selectedAssignees,
  setSelectedAssignees,
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
  uniqueAssignees,
  uniqueCities,
  districtsByCity = [],
  districtsLoading = false,
  regionOptions = [],
  tempBudgetMin,
  tempBudgetMax,
  setTempBudgetMin,
  setTempBudgetMax,
  isBudgetDialogOpen,
  setIsBudgetDialogOpen,
}: AdvancedFiltersPanelProps) {
  const sourceList = sourceOptions && sourceOptions.length > 0
    ? sourceOptions.map((o) => ({ id: o.id, label: o.label }))
    : FALLBACK_SOURCES.map((id) => ({ id, label: id }));
  const btnClass =
    "gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 border-t pt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={btnClass}>
            <Filter className="h-4 w-4" />
            المصدر
            {selectedSources.length > 0 && (
              <Badge variant="secondary" className="mr-1">
                {selectedSources.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>المصدر</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sourceList.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.id}
              checked={selectedSources.includes(item.id)}
              onCheckedChange={(checked) =>
                setSelectedSources((prev) =>
                  checked ? [...prev, item.id] : prev.filter((s) => s !== item.id)
                )
              }
            >
              <SourceBadge source={item.id} className="text-xs" />
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={btnClass}>
            <AlertTriangle className="h-4 w-4" />
            الأولوية
            {selectedPriorities.length > 0 && (
              <Badge variant="secondary" className="mr-1">
                {selectedPriorities.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>الأولوية</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PRIORITIES.map((p) => (
            <DropdownMenuCheckboxItem
              key={p}
              checked={selectedPriorities.includes(p)}
              onCheckedChange={(checked) =>
                setSelectedPriorities((prev) =>
                  checked ? [...prev, p] : prev.filter((x) => x !== p)
                )
              }
            >
              {priorityLabels[p as Priority]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={btnClass}>
            <Calendar className="h-4 w-4" />
            نوع الموعد
            {selectedAppointmentTypes.length > 0 && (
              <Badge variant="secondary" className="mr-1">
                {selectedAppointmentTypes.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>نوع الموعد</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(appointmentTypes && appointmentTypes.length > 0 ? appointmentTypes : DEFAULT_APPOINTMENT_OPTIONS).map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.id}
              checked={selectedAppointmentTypes.includes(opt.id)}
              onCheckedChange={(checked) =>
                setSelectedAppointmentTypes((prev) =>
                  checked ? [...prev, opt.id] : prev.filter((t) => t !== opt.id)
                )
              }
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {uniqueAssignees.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={btnClass}>
              <UserPlus className="h-4 w-4" />
              الموظف
              {selectedAssignees.length > 0 && (
                <Badge variant="secondary" className="mr-1">
                  {selectedAssignees.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>الموظف المعين</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {uniqueAssignees.map((a) => (
              <DropdownMenuCheckboxItem
                key={a.id}
                checked={selectedAssignees.includes(a.id)}
                onCheckedChange={(checked) =>
                  setSelectedAssignees((prev) =>
                    checked ? [...prev, a.id] : prev.filter((x) => x !== a.id)
                  )
                }
              >
                {a.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={btnClass}>
            <Timer className="h-4 w-4" />
            الإجراء
            {dueDateFilter !== "all" && (
              <Badge variant="secondary" className="mr-1">
                1
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>الإجراء</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDueDateFilter("all")}>الكل</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDueDateFilter("overdue")}>
            <span className="text-red-600">متأخر</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDueDateFilter("today")}>اليوم</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDueDateFilter("week")}>
            هذا الأسبوع
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDueDateFilter("no_date")}>
            بدون تاريخ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {uniqueCities.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={btnClass}>
              <MapPin className="h-4 w-4" />
              المدينة
              {selectedCities.length > 0 && (
                <Badge variant="secondary" className="mr-1">
                  {selectedCities.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>المدينة</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {uniqueCities.map((city, i) => (
              <DropdownMenuCheckboxItem
                key={`city-${i}-${city}`}
                checked={selectedCities.includes(city)}
                onCheckedChange={(checked) =>
                  setSelectedCities((prev) =>
                    checked ? [...prev, city] : prev.filter((c) => c !== city)
                  )
                }
              >
                {city}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={btnClass}>
            <MapPin className="h-4 w-4" />
            الحي / المنطقة
            {selectedStates.length > 0 && (
              <Badge variant="secondary" className="mr-1">
                {selectedStates.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-[320px] overflow-y-auto">
          <DropdownMenuLabel>الحي (حسب المدينة)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {districtsByCity.length === 0 && !districtsLoading ? (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {selectedCities.length === 0 ? "اختر مدينة أولاً" : "لا توجد أحياء"}
            </div>
          ) : districtsLoading ? (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">جاري التحميل...</div>
          ) : (
            districtsByCity.map(({ cityId, cityName, districts }) => (
              <React.Fragment key={`city-${cityId}`}>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {cityName}
                </DropdownMenuLabel>
                {districts.map((d) => {
                  const compositeKey = `${cityId}-${d.id}`;
                  return (
                    <DropdownMenuCheckboxItem
                      key={`district-${cityId}-${d.id}`}
                      checked={selectedStates.includes(compositeKey)}
                      onCheckedChange={(checked) =>
                        setSelectedStates((prev) =>
                          checked ? [...prev, compositeKey] : prev.filter((k) => k !== compositeKey)
                        )
                      }
                    >
                      {d.name}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu
        open={isBudgetDialogOpen}
        onOpenChange={(open) => {
          setIsBudgetDialogOpen(open);
          if (open) {
            setTempBudgetMin(budgetMin);
            setTempBudgetMax(budgetMax);
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={btnClass}>
            <DollarSign className="h-4 w-4" />
            الميزانية
            {(budgetMin !== "" || budgetMax !== "") && (
              <Badge variant="secondary" className="mr-1">
                1
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-3">
          <DropdownMenuLabel>نطاق الميزانية (ر.س)</DropdownMenuLabel>
          <DropdownMenuSeparator />
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
              }}
            >
              إعادة تعيين
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={btnClass}>
            <Building2 className="h-4 w-4" />
            نوع العقار
            {selectedPropertyTypes.length > 0 && (
              <Badge variant="secondary" className="mr-1">
                {selectedPropertyTypes.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>نوع العقار</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PROPERTY_TYPE_OPTIONS.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={selectedPropertyTypes.includes(opt.value)}
              onCheckedChange={(checked) =>
                setSelectedPropertyTypes((prev) =>
                  checked
                    ? [...prev, opt.value]
                    : prev.filter((t) => t !== opt.value)
                )
              }
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
