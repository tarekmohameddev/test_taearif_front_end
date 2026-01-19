"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Phone,
  Eye,
  Edit,
  Globe,
  MessageSquare,
  AlertCircle,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Pagination } from "@/components/customers/page-components/Pagination";
import { useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

// Incomplete Request interface based on API response
export interface IncompleteRequest {
  id: number;
  source: "web" | "whatsapp";
  customer_name: string | null;
  phone: string;
  purpose: "rent" | "sale";
  category_id: number | null;
  property_type: string | null;
  budget_from: number | null;
  budget_to: number | null;
  budget: number | null;
  area_from: number | null;
  area_to: number | null;
  min_area_sqm: number | null;
  max_area_sqm: number | null;
  region: string | null;
  city_id: number | null;
  city: string | null;
  district_id: number | null;
  district: string | null;
  is_complete: boolean;
  match_count: number;
  created_at: string;
  updated_at: string;
}

interface IncompleteRequestsTableProps {
  requests: IncompleteRequest[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  perPage: number;
  loading?: boolean;
  onView?: (request: IncompleteRequest) => void;
  onEdit?: (request: IncompleteRequest) => void;
}

export const IncompleteRequestsTable = ({
  requests,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  perPage,
  loading = false,
  onView,
  onEdit,
}: IncompleteRequestsTableProps) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd", { locale: ar });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (amount: number | null) => {
    if (!amount) return "غير محدد";
    return new Intl.NumberFormat("ar-SA").format(amount);
  };

  const getBudgetDisplay = (request: IncompleteRequest) => {
    if (request.budget) {
      return `${formatPrice(request.budget)} ريال`;
    }
    if (request.budget_from && request.budget_to) {
      return `${formatPrice(request.budget_from)} - ${formatPrice(request.budget_to)} ريال`;
    }
    if (request.budget_from) {
      return `من ${formatPrice(request.budget_from)} ريال`;
    }
    return "غير محدد";
  };

  const openWhatsApp = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    let full = "";
    if (cleaned.startsWith("05")) full = "966" + cleaned.slice(1);
    else if (cleaned.startsWith("5")) full = "966" + cleaned;
    else if (cleaned.startsWith("1")) full = "20" + cleaned;
    else full = "966" + cleaned;
    window.open(`https://wa.me/${full}`, "_blank");
  };

  if (loading && requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>المصدر</TableHead>
                  <TableHead>الغرض</TableHead>
                  <TableHead>الميزانية</TableHead>
                  <TableHead>الموقع</TableHead>
                  <TableHead>عدد المطابقات</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead>المصدر</TableHead>
                <TableHead>الغرض</TableHead>
                <TableHead>الميزانية</TableHead>
                <TableHead>الموقع</TableHead>
                <TableHead>عدد المطابقات</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        لا توجد طلبات غير مكتملة
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {request.customer_name || "غير محدد"}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 ml-1" />
                          {request.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.source === "web" ? "default" : "secondary"
                        }
                        className="flex items-center gap-1 w-fit"
                      >
                        {request.source === "web" ? (
                          <Globe className="h-3 w-3" />
                        ) : (
                          <MessageSquare className="h-3 w-3" />
                        )}
                        {request.source === "web" ? "الويب" : "واتساب"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={request.purpose === "rent" ? "outline" : "default"}
                        className="flex items-center gap-1 w-fit"
                      >
                        <TrendingUp className="h-3 w-3" />
                        {request.purpose === "rent" ? "للإيجار" : "للبيع"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{getBudgetDisplay(request)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {request.region ||
                            request.city ||
                            request.district ||
                            "غير محدد"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Eye className="h-3 w-3" />
                        {request.match_count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(request.created_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === request.id.toString()
                                  ? null
                                  : request.id.toString(),
                              )
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(request)}>
                              <Eye className="h-4 w-4 ml-2" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(request)}>
                              <Edit className="h-4 w-4 ml-2" />
                              تعديل
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openWhatsApp(request.phone)}
                          >
                            <MessageSquare className="h-4 w-4 ml-2" />
                            واتساب
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {requests.length > 0 && (
          <div className="border-t p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={totalItems}
              perPage={perPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
