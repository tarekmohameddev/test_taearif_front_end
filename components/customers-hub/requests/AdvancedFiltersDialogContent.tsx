"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Timer,
  MapPin,
  DollarSign,
  Building2,
  Filter,
  AlertTriangle,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPOINTMENT_TYPES,
  PROPERTY_TYPE_OPTIONS,
  priorityLabels,
} from "./constants";
import { SourceBadge } from "../actions/SourceBadge";
import type { AppointmentTypeOption, SourceOption } from "./AdvancedFiltersPanel";
import type { Priority } from "@/types/unified-customer";
import type { DistrictsByCityItem } from "./hooks/useRequestsCenterPage";

const PRIORITIES: Priority[] = ["urgent", "high", "medium", "low"];

export interface AdvancedFiltersDialogContentProps {
  /** Options from GET /v2/customers-hub/requests/filter-options (data.sources). */
  sourceOptions?: SourceOption[];
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
  /** نطاق تاريخ إنشاء الطلب (من / إلى) */
  requestDateFrom: string | null;
  setRequestDateFrom: (v: string | null) => void;
  requestDateTo: string | null;
  setRequestDateTo: (v: string | null) => void;
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
  /** أحياء مجمعة حسب المدينة (عند اختيار مدينة تُجلب أحياؤها). إن وُجدت تُعرض مع dividers. */
  districtsByCity?: DistrictsByCityItem[];
  /** جاري جلب الأحياء */
  districtsLoading?: boolean;
  /** مناطق من الباك اند (fallback قديم). */
  regionOptions?: string[];
  tempBudgetMin: string;
  tempBudgetMax: string;
  setTempBudgetMin: (v: string) => void;
  setTempBudgetMax: (v: string) => void;
  isBudgetDialogOpen: boolean;
  setIsBudgetDialogOpen: (v: boolean) => void;
  /** نص البحث داخل قائمة الفلاتر في الـ sidebar */
  filterSearch: string;
  setFilterSearch: (v: string) => void;
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

function DistrictItem({
  compositeKey,
  name,
  checked,
  onToggle,
}: {
  compositeKey: string;
  name: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full text-right cursor-pointer px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 rounded-lg",
        checked && "bg-gray-100 dark:bg-gray-800"
      )}
    >
      <span className="w-4 text-center">{checked ? "✓" : ""}</span>
      <span>{name}</span>
    </button>
  );
}

function DistrictsSection({
  districtsByCity,
  districtsLoading,
  selectedCities,
  selectedStates,
  setSelectedStates,
  hasSearch,
}: {
  districtsByCity: DistrictsByCityItem[];
  districtsLoading: boolean;
  selectedCities: string[];
  selectedStates: string[];
  setSelectedStates: (v: string[] | ((prev: string[]) => string[])) => void;
  hasSearch: boolean;
}) {
  const [expandedCityIds, setExpandedCityIds] = useState<Set<number>>(new Set());
  const multiCity = districtsByCity.length > 1;

  return (
    <SectionWrapper
      id="state"
      title={
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>الحي / المنطقة</span>
        </span>
      }
      badgeCount={selectedStates.length}
      searchActive={hasSearch}
    >
      {districtsByCity.length === 0 && !districtsLoading ? (
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          {selectedCities.length === 0
            ? "اختر مدينة أولاً لعرض الأحياء"
            : "لا توجد أحياء (تُجلب من الباك اند)"}
        </div>
      ) : districtsLoading ? (
        <div className="px-2 py-1.5 text-xs text-muted-foreground">جاري التحميل...</div>
      ) : multiCity ? (
        <div className="space-y-1">
          {districtsByCity.map(({ cityId, cityName, districts }) => {
            const isOpen = expandedCityIds.has(cityId);
            return (
              <div key={`city-${cityId}`} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCityIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(cityId)) next.delete(cityId);
                      else next.add(cityId);
                      return next;
                    })
                  }
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-right",
                    "hover:bg-gray-50 dark:hover:bg-gray-800 bg-gray-50/50 dark:bg-gray-800/50"
                  )}
                >
                  <span className="text-gray-700 dark:text-gray-300">{cityName}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 text-gray-500 transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen && (
                  <div className="px-2 pb-2 pt-0 space-y-0.5 border-t border-gray-200 dark:border-gray-700">
                    {districts.map((d) => {
                      const compositeKey = `${cityId}-${d.id}`;
                      const checked = selectedStates.includes(compositeKey);
                      return (
                        <DistrictItem
                          key={`district-${cityId}-${d.id}`}
                          compositeKey={compositeKey}
                          name={d.name}
                          checked={checked}
                          onToggle={() =>
                            setSelectedStates((prev) =>
                              checked ? prev.filter((k) => k !== compositeKey) : [...prev, compositeKey]
                            )
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        districtsByCity.length === 1 && (
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 px-2 py-1.5 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {districtsByCity[0].cityName}
              </span>
            </div>
            {districtsByCity[0].districts.map((d) => {
              const cityId = districtsByCity[0].cityId;
              const compositeKey = `${cityId}-${d.id}`;
              const checked = selectedStates.includes(compositeKey);
              return (
                <DistrictItem
                  key={`district-${cityId}-${d.id}`}
                  compositeKey={compositeKey}
                  name={d.name}
                  checked={checked}
                  onToggle={() =>
                    setSelectedStates((prev) =>
                      checked ? prev.filter((k) => k !== compositeKey) : [...prev, compositeKey]
                    )
                  }
                />
              );
            })}
          </div>
        )
      )}
    </SectionWrapper>
  );
}

function SectionWrapper({
  id,
  title,
  badgeCount,
  children,
  defaultOpen = false,
  searchActive,
}: {
  id: string;
  title: React.ReactNode;
  badgeCount?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  searchActive: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen || searchActive);

  return (
    <div
      data-section-id={id}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
    >
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-right",
          "hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          {title}
          {typeof badgeCount === "number" && badgeCount > 0 && (
            <Badge variant="secondary" className="mr-1">
              {badgeCount}
            </Badge>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 space-y-1 max-h-64 overflow-y-auto">{children}</div>
      )}
    </div>
  );
}

export function AdvancedFiltersDialogContent({
  sourceOptions = [],
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
  requestDateFrom,
  setRequestDateFrom,
  requestDateTo,
  setRequestDateTo,
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
  districtsByCity = [],
  districtsLoading = false,
  regionOptions = [],
  tempBudgetMin,
  tempBudgetMax,
  setTempBudgetMin,
  setTempBudgetMax,
  isBudgetDialogOpen,
  setIsBudgetDialogOpen,
  filterSearch,
  setFilterSearch,
}: AdvancedFiltersDialogContentProps) {
  const appointmentOpts = appointmentTypes && appointmentTypes.length > 0 ? appointmentTypes : DEFAULT_APPOINTMENT_OPTIONS;
  const search = filterSearch.trim().toLowerCase();
  const hasSearch = search.length > 0;

  const matches = (text: string | undefined | null) =>
    !!text && text.toString().toLowerCase().includes(search);

  return (
    <div className="space-y-3">
      {/* المصدر - multi-select */}
      {(!hasSearch || matches("المصدر")) && (
        <SectionWrapper
          id="source"
          title={
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>المصدر</span>
            </span>
          }
          badgeCount={selectedSources.length}
          searchActive={hasSearch}
        >
          {sourceOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">جاري تحميل المصادر...</div>
          ) : (
            sourceOptions.map((opt) => {
              const checked = selectedSources.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setSelectedSources((prev) =>
                      checked ? prev.filter((s) => s !== opt.id) : [...prev, opt.id]
                    )
                  }
                  className={cn(
                    "w-full text-right cursor-pointer px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 rounded-lg",
                    checked && "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <span className="w-4 text-center">{checked ? "✓" : ""}</span>
                  <SourceBadge source={opt.id} className="text-xs" />
                </button>
              );
            })
          )}
        </SectionWrapper>
      )}

      {/* الأولوية - multi-select */}
      {(!hasSearch || matches("الأولوية")) && (
        <SectionWrapper
          id="priority"
          title={
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>الأولوية</span>
            </span>
          }
          badgeCount={selectedPriorities.length}
          searchActive={hasSearch}
        >
          {PRIORITIES.map((p) => {
            const checked = selectedPriorities.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() =>
                  setSelectedPriorities((prev) =>
                    checked ? prev.filter((x) => x !== p) : [...prev, p]
                  )
                }
                className={cn(
                  "w-full text-right cursor-pointer px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 rounded-lg",
                  checked && "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <span className="w-4 text-center">{checked ? "✓" : ""}</span>
                <span>{priorityLabels[p as Priority]}</span>
              </button>
            );
          })}
        </SectionWrapper>
      )}

      {/* الموظف - multi-select */}
      {(!hasSearch || matches("الموظف")) && (
        <SectionWrapper
          id="assignee"
          title={
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>الموظف</span>
            </span>
          }
          badgeCount={selectedAssignees.length}
          searchActive={hasSearch}
        >
          {uniqueAssignees.length === 0 ? (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">لا يوجد موظفين</div>
          ) : (
            uniqueAssignees.map((a) => {
              const checked = selectedAssignees.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() =>
                    setSelectedAssignees((prev) =>
                      checked ? prev.filter((x) => x !== a.id) : [...prev, a.id]
                    )
                  }
                  className={cn(
                    "w-full text-right cursor-pointer px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 rounded-lg",
                    checked && "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <span className="w-4 text-center">{checked ? "✓" : ""}</span>
                  <span>{a.name}</span>
                </button>
              );
            })
          )}
        </SectionWrapper>
      )}

      {/* نوع الموعد - multi-select */}
      {(!hasSearch || matches("نوع الموعد")) && (
        <SectionWrapper
          id="appointment-type"
          title={
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>نوع الموعد</span>
            </span>
          }
          badgeCount={selectedAppointmentTypes.length}
          searchActive={hasSearch}
        >
          {appointmentOpts.map((opt) => {
            const checked = selectedAppointmentTypes.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  setSelectedAppointmentTypes((prev) =>
                    checked ? prev.filter((t) => t !== opt.id) : [...prev, opt.id]
                  )
                }
                className={cn(
                  "w-full text-right cursor-pointer px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 rounded-lg",
                  checked && "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <span className="w-4 text-center">{checked ? "✓" : ""}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </SectionWrapper>
      )}

      {/* الإجراء - single select */}
      {(!hasSearch || matches("الإجراء")) && (
        <SectionWrapper
          id="due-date"
          title={
            <span className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span>الإجراء</span>
            </span>
          }
          badgeCount={dueDateFilter !== "all" ? 1 : 0}
          searchActive={hasSearch}
        >
          {DUE_DATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDueDateFilter(opt.value)}
              className={cn(
                "w-full text-right cursor-pointer px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 rounded-lg",
                dueDateFilter === opt.value && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              <span className="w-4 text-center">
                {dueDateFilter === opt.value ? "✓" : ""}
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </SectionWrapper>
      )}

      {/* تاريخ إنشاء الطلب - نطاق (من / إلى) */}
      {(!hasSearch || matches("تاريخ إنشاء الطلب") || matches("التاريخ")) && (
        <SectionWrapper
          id="created-at-range"
          title={
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>تاريخ إنشاء الطلب</span>
            </span>
          }
          badgeCount={requestDateFrom || requestDateTo ? 1 : 0}
          searchActive={hasSearch}
        >
          <div className="grid grid-cols-2 gap-2 py-1">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">من</label>
              <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3">
                <input
                  type="date"
                  className="flex-1 min-w-0 border-0 bg-transparent p-0 text-xs outline-none [color-scheme:light]"
                  value={requestDateFrom ?? ""}
                  onChange={(e) => setRequestDateFrom(e.target.value || null)}
                />
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">إلى</label>
              <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3">
                <input
                  type="date"
                  className="flex-1 min-w-0 border-0 bg-transparent p-0 text-xs outline-none [color-scheme:light]"
                  value={requestDateTo ?? ""}
                  onChange={(e) => setRequestDateTo(e.target.value || null)}
                />
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setRequestDateFrom(null);
                setRequestDateTo(null);
              }}
            >
              مسح التاريخ
            </Button>
          </div>
        </SectionWrapper>
      )}

      {/* المدينة - multi-select */}
      {(!hasSearch || matches("المدينة")) && (
        <SectionWrapper
          id="city"
          title={
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>المدينة</span>
            </span>
          }
          badgeCount={selectedCities.length}
          searchActive={hasSearch}
        >
          {uniqueCities.length === 0 ? (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">لا توجد مدن</div>
          ) : (
            uniqueCities.map((city, i) => {
              const checked = selectedCities.includes(city);
              return (
                <button
                  key={`city-${i}-${city}`}
                  type="button"
                  onClick={() =>
                    setSelectedCities((prev) =>
                      checked ? prev.filter((c) => c !== city) : [...prev, city]
                    )
                  }
                  className={cn(
                    "w-full text-right cursor-pointer px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 rounded-lg",
                    checked && "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <span className="w-4 text-center">{checked ? "✓" : ""}</span>
                  <span>{city}</span>
                </button>
              );
            })
          )}
        </SectionWrapper>
      )}

      {/* المنطقة (الأحياء) - multi-select حسب المدن المختارة، collapsible عند تعدد المدن */}
      {(!hasSearch || matches("المنطقة") || matches("الحي") || matches("أحياء")) && (
        <DistrictsSection
          districtsByCity={districtsByCity}
          districtsLoading={districtsLoading}
          selectedCities={selectedCities}
          selectedStates={selectedStates}
          setSelectedStates={setSelectedStates}
          hasSearch={hasSearch}
        />
      )}

      {/* الميزانية - custom content with form */}
      {(!hasSearch || matches("الميزانية")) && (
        <SectionWrapper
          id="budget"
          title={
            <span className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>الميزانية</span>
            </span>
          }
          badgeCount={budgetMin !== "" || budgetMax !== "" ? 1 : 0}
          searchActive={hasSearch}
        >
          <div className="grid grid-cols-2 gap-2 py-1">
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
        </SectionWrapper>
      )}

      {/* نوع العقار - multi-select */}
      {(!hasSearch || matches("نوع العقار")) && (
        <SectionWrapper
          id="property-type"
          title={
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>نوع العقار</span>
            </span>
          }
          badgeCount={selectedPropertyTypes.length}
          searchActive={hasSearch}
        >
          {PROPERTY_TYPE_OPTIONS.map((opt) => {
            const checked = selectedPropertyTypes.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setSelectedPropertyTypes((prev) =>
                    checked ? prev.filter((t) => t !== opt.value) : [...prev, opt.value]
                  )
                }
                className={cn(
                  "w-full text-right cursor-pointer px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 rounded-lg",
                  checked && "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <span className="w-4 text-center">{checked ? "✓" : ""}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </SectionWrapper>
      )}
    </div>
  );
}
