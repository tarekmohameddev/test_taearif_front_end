import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, FilterX, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface IncompleteRequestsFiltersAndSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  source: string;
  setSource: (value: string) => void;
  purpose: string;
  setPurpose: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  priceMin: string;
  setPriceMin: (value: string) => void;
  priceMax: string;
  setPriceMax: (value: string) => void;
  cityId: string;
  setCityId: (value: string) => void;
  onResetFilters: () => void;
}

export const IncompleteRequestsFiltersAndSearch = ({
  searchTerm,
  setSearchTerm,
  source,
  setSource,
  purpose,
  setPurpose,
  dateRange,
  setDateRange,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  cityId,
  setCityId,
  onResetFilters,
}: IncompleteRequestsFiltersAndSearchProps) => {
  const hasActiveFilters =
    searchTerm ||
    source ||
    purpose ||
    dateRange?.from ||
    priceMin ||
    priceMax ||
    cityId;

  return (
    <div className="space-y-4">
      {/* Search Bar and Clear Filters Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="البحث في الطلبات..."
            className="pr-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant={hasActiveFilters ? "destructive" : "outline"}
          size="default"
          onClick={onResetFilters}
          disabled={!hasActiveFilters}
          className={`flex items-center gap-2 transition-all ${
            hasActiveFilters
              ? "bg-red-500 hover:bg-red-600 text-white shadow-md"
              : "opacity-50 cursor-not-allowed"
          }`}
          title={
            hasActiveFilters
              ? "إزالة جميع الفلاتر والبحث"
              : "لا توجد فلاتر نشطة"
          }
        >
          <FilterX className="h-4 w-4" />
          <span className="font-semibold">إزالة الفلاتر</span>
          {hasActiveFilters && (
            <span className="mr-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
              {
                [
                  searchTerm,
                  source,
                  purpose,
                  dateRange?.from,
                  priceMin,
                  priceMax,
                  cityId,
                ].filter(Boolean).length
              }
            </span>
          )}
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Source Filter */}
        <Select value={source || "all"} onValueChange={(value) => setSource(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="المصدر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المصادر</SelectItem>
            <SelectItem value="web">الويب</SelectItem>
            <SelectItem value="whatsapp">واتساب</SelectItem>
          </SelectContent>
        </Select>

        {/* Purpose Filter */}
        <Select value={purpose || "all"} onValueChange={(value) => setPurpose(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="الغرض" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأغراض</SelectItem>
            <SelectItem value="rent">للإيجار</SelectItem>
            <SelectItem value="sale">للبيع</SelectItem>
          </SelectContent>
        </Select>

        {/* City Filter */}
        <Select value={cityId || "all"} onValueChange={(value) => setCityId(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="المدينة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المدن</SelectItem>
            {/* Cities will be populated from API if needed */}
          </SelectContent>
        </Select>

        {/* Price Min Filter */}
        <Input
          type="number"
          placeholder="الحد الأدنى للسعر"
          className="w-[180px]"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
        />

        {/* Price Max Filter */}
        <Input
          type="number"
          placeholder="الحد الأقصى للسعر"
          className="w-[180px]"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
        />

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[180px] justify-start text-right font-normal"
            >
              <CalendarIcon className="ml-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "yyyy-MM-dd", { locale: ar })} -{" "}
                    {format(dateRange.to, "yyyy-MM-dd", { locale: ar })}
                  </>
                ) : (
                  format(dateRange.from, "yyyy-MM-dd", { locale: ar })
                )
              ) : (
                <span>نطاق التاريخ</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={ar}
              toDate={new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
