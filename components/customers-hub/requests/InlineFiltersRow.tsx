"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon, UserPlus, Filter, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SourceBadge } from "../actions/SourceBadge";
import type { CustomerSource } from "@/types/unified-customer";

const SOURCES: CustomerSource[] = [
  "whatsapp",
  "inquiry",
  "manual",
  "referral",
  "import",
];

export interface InlineFiltersRowProps {
  selectedSources: string[];
  setSelectedSources: (v: string[] | ((prev: string[]) => string[])) => void;
  requestDateFrom: string | null;
  setRequestDateFrom: (v: string | null) => void;
  requestDateTo: string | null;
  setRequestDateTo: (v: string | null) => void;
  selectedAssignees: string[];
  setSelectedAssignees: (v: string[] | ((prev: string[]) => string[])) => void;
  uniqueAssignees: { id: string; name: string }[];
}

export function InlineFiltersRow({
  selectedSources,
  setSelectedSources,
  requestDateFrom,
  setRequestDateFrom,
  requestDateTo,
  setRequestDateTo,
  selectedAssignees,
  setSelectedAssignees,
  uniqueAssignees,
}: InlineFiltersRowProps) {
  const btnClass =
    "gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700";

  return (
    <div className="flex flex-wrap items-center gap-2 ">
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
          {SOURCES.map((source) => (
            <DropdownMenuCheckboxItem
              key={source}
              checked={selectedSources.includes(source)}
              onCheckedChange={(checked) =>
                setSelectedSources((prev) =>
                  checked ? [...prev, source] : prev.filter((s) => s !== source)
                )
              }
            >
              <SourceBadge source={source} className="text-xs" />
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={btnClass}
          >
            <CalendarIcon className="h-4 w-4" />
            {requestDateFrom || requestDateTo ? (
              <span className="text-xs">
                {requestDateFrom ?? "؟"} – {requestDateTo ?? "؟"}
              </span>
            ) : (
              "التاريخ"
            )}
            {(requestDateFrom || requestDateTo) && (
              <Badge variant="secondary" className="mr-1">
                1
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-3" dir="rtl">
          <div className="space-y-3">
            <div className="text-sm font-medium">تاريخ إنشاء الطلب</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">من</div>
                <div className="relative">
                  <input
                    type="date"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    value={requestDateFrom ?? ""}
                    onChange={(e) =>
                      setRequestDateFrom(e.target.value || null)
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-between pointer-events-none"
                  >
                    <span className="text-xs truncate">
                      {requestDateFrom || "اختر التاريخ"}
                    </span>
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">إلى</div>
                <div className="relative">
                  <input
                    type="date"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    value={requestDateTo ?? ""}
                    onChange={(e) =>
                      setRequestDateTo(e.target.value || null)
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-between pointer-events-none"
                  >
                    <span className="text-xs truncate">
                      {requestDateTo || "اختر التاريخ"}
                    </span>
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setRequestDateFrom(null);
                  setRequestDateTo(null);
                }}
              >
                مسح
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={btnClass}
            disabled={uniqueAssignees.length === 0}
          >
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
          {uniqueAssignees.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">لا يوجد موظفين</div>
          ) : (
            uniqueAssignees.map((a) => (
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
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
