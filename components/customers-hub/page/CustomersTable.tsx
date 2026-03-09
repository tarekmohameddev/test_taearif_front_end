"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
  MapPin,
  Home,
} from "lucide-react";
import type { LastPropertyRequest } from "@/types/unified-customer";
import { getStageNameAr, getStageColor, LIFECYCLE_STAGES } from "@/types/unified-customer";
import { translatePropertyType } from "@/components/customers-hub/actions/utils/propertyUtils";
import Link from "next/link";
import { AssignmentDropdown } from "../assignment";

export function CustomersTable() {
  const {
    filteredCustomers,
    currentPage,
    pageSize,
    totalPages,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    nextPage,
    prevPage,
    filters,
    setFilters,
  } = useUnifiedCustomersStore();

  // Get paginated customers
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Normalize customer.stage to always be a string (handle API objects; id: null → بدون مرحلة)
  const normalizeStage = (stage: any): string => {
    if (!stage) return "new_lead";
    if (typeof stage === "string") return stage;
    if (typeof stage === "object" && stage !== null) {
      const id = (stage as any).id;
      if (id == null || id === "") return "no_stage";
      return id || (stage as any).name || "new_lead";
    }
    return String(stage);
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: any; text: string }> = {
      urgent: { variant: "destructive", text: "عاجل" },
      high: { variant: "default", text: "عالي" },
      medium: { variant: "secondary", text: "متوسط" },
      low: { variant: "outline", text: "منخفض" },
    };
    const config = variants[priority] || variants.medium;
    return (
      <Badge variant={config.variant as any} className="text-xs">
        {config.text}
      </Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    const labels: Record<string, string> = {
      inquiry: "استفسار موقع",
      manual: "إدخال يدوي",
      whatsapp: "واتساب",
      import: "مستورد",
      referral: "إحالة",
    };
    return (
      <Badge variant="outline" className="text-xs">
        {labels[source] || source}
      </Badge>
    );
  };

  const hasLastRequest = (req: LastPropertyRequest | null | undefined): boolean =>
    req != null && (
      [req.city, req.district, req.propertyType, req.listingTypeLabel].some(
        (v) => v != null && String(v).trim() !== ""
      )
    );

  const renderLastPropertyRequest = (req: LastPropertyRequest | null | undefined) => {
    if (!hasLastRequest(req)) {
      return <span className="text-gray-400 text-sm">—</span>;
    }
    const r = req!;
    const city = r.city?.trim();
    const district = r.district?.trim();
    const propertyTypeAr = translatePropertyType(r.propertyType);
    const listingType = r.listingTypeLabel?.trim();
    const locationParts = [district, city].filter(Boolean);
    const location = locationParts.length > 0 ? locationParts.join("، ") : null;
    const typeParts = [propertyTypeAr, listingType].filter(Boolean);
    const typeLine = typeParts.length > 0 ? typeParts.join(" · ") : null;
    return (
      <div className="text-right text-sm space-y-0.5 min-w-[100px]">
        {location && (
          <div className="flex items-center gap-1 justify-start text-gray-700 dark:text-gray-300">
            <MapPin className="h-3.5 w-3.5 text-gray-400 " />
            <span>{location}</span>
          </div>
        )}
        {typeLine && (
          <div className="flex items-center gap-1 justify-start text-gray-600 dark:text-gray-400 text-xs">
            <Home className="h-3.5 w-3.5 text-gray-400 " />
            <span>{typeLine}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المرحلة</TableHead>
              <TableHead className="text-right">الأولوية</TableHead>
              <TableHead className="text-right">المصدر</TableHead>
              <TableHead className="text-right">الموظف المسؤول</TableHead>
              <TableHead className="text-right">آخر طلب عقاري</TableHead>
              <TableHead className="text-right">آخر تواصل</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  لا توجد نتائج
                </TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer) => {
                const normalizedStage = normalizeStage(customer.stage);
                return (
                <TableRow key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: getStageColor(normalizedStage),
                        color: getStageColor(normalizedStage),
                      }}
                    >
                      {getStageNameAr(normalizedStage)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getPriorityBadge(customer.priority)}</TableCell>
                  <TableCell>
                    {customer.sourceAr ? (
                      <Badge variant="outline" className="text-xs">{customer.sourceAr}</Badge>
                    ) : (
                      getSourceBadge(customer.source)
                    )}
                  </TableCell>
                  <TableCell>
                    <AssignmentDropdown
                      customerId={customer.id}
                      currentEmployeeId={customer.assignedEmployeeId}
                      currentEmployeeName={customer.assignedEmployee?.name}
                    />
                  </TableCell>
                  <TableCell>
                    {renderLastPropertyRequest(customer.lastPropertyRequest)}
                  </TableCell>
                  <TableCell className="min-w-[100px]">
                    {customer.lastContactAt ? (
                      <div className="text-sm">
                        <div>
                          {new Date(customer.lastContactAt).toLocaleDateString("ar-SA", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {customer.lastContactType}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">لا يوجد</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/ar/dashboard/customers-hub/${customer.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            صفحة {currentPage} من {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
