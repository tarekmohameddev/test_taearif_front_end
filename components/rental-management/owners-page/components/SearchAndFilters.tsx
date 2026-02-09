"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchAndFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

export function SearchAndFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: SearchAndFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-48">
          <Filter className="ml-2 h-4 w-4" />
          <SelectValue placeholder="جميع الحالات" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع الحالات</SelectItem>
          <SelectItem value="active">نشط</SelectItem>
          <SelectItem value="inactive">غير نشط</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
