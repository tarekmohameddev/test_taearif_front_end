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
import { Filter, ChevronDown, AlertTriangle, UserPlus } from "lucide-react";
import { SourceBadge } from "../actions/SourceBadge";
import { priorityLabels } from "./constants";
import type { CustomerSource, Priority } from "@/types/unified-customer";

const SOURCES: CustomerSource[] = [
  "whatsapp",
  "inquiry",
  "manual",
  "referral",
  "import",
];
const PRIORITIES: Priority[] = ["urgent", "high", "medium", "low"];

export interface InlineFiltersRowProps {
  selectedSources: string[];
  setSelectedSources: (v: string[] | ((prev: string[]) => string[])) => void;
  selectedPriorities: string[];
  setSelectedPriorities: (v: string[] | ((prev: string[]) => string[])) => void;
  selectedAssignees: string[];
  setSelectedAssignees: (v: string[] | ((prev: string[]) => string[])) => void;
  uniqueAssignees: { id: string; name: string }[];
}

export function InlineFiltersRow({
  selectedSources,
  setSelectedSources,
  selectedPriorities,
  setSelectedPriorities,
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
