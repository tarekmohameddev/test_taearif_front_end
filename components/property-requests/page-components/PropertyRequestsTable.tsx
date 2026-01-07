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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PropertyRequestStageAssignmentDialog } from "./PropertyRequestStageAssignmentDialog";
import { PropertyRequestStatusChangeDialog } from "./PropertyRequestStatusChangeDialog";
import { PropertyRequestEmployeeAssignmentDialog } from "./PropertyRequestEmployeeAssignmentDialog";
import {
  MoreHorizontal,
  Mail,
  Phone,
  Tag,
  Download,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Clock,
  SortAsc,
  SortDesc,
  CheckSquare,
  X,
  ArrowRight,
  User,
  Building,
} from "lucide-react";
import { Pagination } from "@/components/customers/page-components/Pagination";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

// Import PropertyRequest interface from parent
interface PropertyRequest {
  id: number;
  user_id: number;
  customer_id?: number;
  region: string;
  property_type: string;
  category_id: number;
  city_id: number;
  districts_id: number | null;
  districtName: string | null;
  category: string | null;
  neighborhoods: string[] | null;
  area_from: number | null;
  area_to: number | null;
  purchase_method: string;
  budget_from: number;
  budget_to: number;
  seriousness: string;
  purchase_goal: string;
  wants_similar_offers: boolean;
  full_name: string;
  phone: string;
  contact_on_whatsapp: boolean;
  notes: string;
  is_read: number;
  is_active?: number;
  status?: {
    id: number;
    name_ar: string;
    name_en: string;
  } | null;
  employee?: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface PropertyRequestsTableProps {
  filteredAndSortedPropertyRequests: PropertyRequest[];
  selectedPropertyRequests: number[];
  handleSelectAll: () => void;
  handleSelectPropertyRequest: (id: number) => void;
  sortField: string;
  sortDirection: string;
  handleSort: (field: keyof PropertyRequest) => void;
  openEditDialog: (request: PropertyRequest) => void;
  handleDelete: (id: number) => void;
  formData: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleChange: (
    field: keyof PropertyRequest,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleUpdatePropertyRequest: () => void;
  showBulkActionsDialog: boolean;
  setShowBulkActionsDialog: (show: boolean) => void;
  setSelectedPropertyRequests: (ids: number[]) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  perPage?: number;
  onStatusUpdated?: (propertyRequestId: number, newStatus: string) => void;
  onEmployeeAssigned?: (propertyRequestId: number, employeeId: number | null) => void;
  loading?: boolean;
}

export const PropertyRequestsTable = ({
  filteredAndSortedPropertyRequests,
  selectedPropertyRequests,
  handleSelectAll,
  handleSelectPropertyRequest,
  sortField,
  sortDirection,
  handleSort,
  openEditDialog,
  handleDelete,
  formData,
  open,
  setOpen,
  handleChange,
  handleUpdatePropertyRequest,
  showBulkActionsDialog,
  setShowBulkActionsDialog,
  setSelectedPropertyRequests,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  perPage = 20,
  onStatusUpdated,
  onEmployeeAssigned,
  loading = false,
}: PropertyRequestsTableProps) => {
  const router = useRouter();
  
  // Dropdown menu state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Dialogs state
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [selectedPropertyRequestForAction, setSelectedPropertyRequestForAction] =
    useState<PropertyRequest | null>(null);
  const openWhatsApp = (raw: string) => {
    const phone = raw.replace(/\D/g, ""); // remove non-digits
    let full = "";

    // Saudi numbers
    if (phone.startsWith("05")) full = "966" + phone.slice(1);
    else if (phone.startsWith("5")) full = "966" + phone;
    // Egyptian numbers
    else if (phone.startsWith("1")) full = "20" + phone;
    // fallback: assume KSA
    else full = "966" + phone;

    window.open(`https://wa.me/${full}`, "_blank");
  };

  // Extract customer from property request (find customer by phone number)
  const findCustomerByPhone = async (phone: string): Promise<number | null> => {
    try {
      const response = await axiosInstance.get("/customers");
      if (response.data?.status === "success") {
        const customers = response.data.data?.customers || [];
        const customer = customers.find(
          (c: any) => c.phone_number === phone || c.phone_number?.replace(/\D/g, "") === phone.replace(/\D/g, "")
        );
        return customer?.id || null;
      }
      return null;
    } catch (error) {
      console.error("Error finding customer by phone:", error);
      return null;
    }
  };

  // Check if customer has existing deal
  const checkExistingDeal = async (customerId: number): Promise<boolean> => {
    try {
      const response = await axiosInstance.get(`/v1/crm/requests?customer_id=${customerId}`);
      const requests = response.data?.data?.requests || response.data?.data || [];
      return Array.isArray(requests) && requests.length > 0;
    } catch (error) {
      console.error("Error checking existing deal:", error);
      return false;
    }
  };

  // Handle convert to CRM from property request
  const handleConvertToCrm = async (propertyRequest: PropertyRequest) => {
    try {
      // First, try to get customer_id from property request
      let customerId: number | null = propertyRequest.customer_id || null;

      // If no customer_id, try to find customer by phone number
      if (!customerId && propertyRequest.phone) {
        customerId = await findCustomerByPhone(propertyRequest.phone);
      }

      if (!customerId) {
        toast.error("لم يتم العثور على عميل مرتبط بهذا الطلب", {
          duration: 4000,
          position: "top-center",
        });
        return;
      }

      // Check if customer has existing deal
      const hasDeal = await checkExistingDeal(customerId);
      if (hasDeal) {
        toast.error("يوجد صفقة فعلياً مع هذا العميل", {
          duration: 4000,
          position: "top-center",
        });
        return;
      }

      // Redirect to create deal page with customer_id
      router.push(`/dashboard/crm/new-deal?customer_id=${customerId}`);
    } catch (error) {
      console.error("Error converting to CRM:", error);
      toast.error("حدث خطأ أثناء التحويل إلى CRM", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  // دالة لحساب موقع الزر
  const calculateDropdownPosition = useCallback((propertyRequestId: string) => {
    const button = buttonRefs.current[propertyRequestId];
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const dropdownWidth = 224; // w-56 = 14rem = 224px
    const dropdownHeight = 200; // تقريبي
    const padding = 8;

    // حساب الموقع الأفقي (من اليمين لأننا RTL)
    let left = rect.left - dropdownWidth + rect.width;

    // إذا خرج من الجهة اليسرى، اجعله يبدأ من اليسار
    if (left < padding) {
      left = rect.left;
    }

    // إذا خرج من الجهة اليمنى، اجعله بالقرب من الحافة اليمنى
    if (left + dropdownWidth > window.innerWidth - padding) {
      left = window.innerWidth - dropdownWidth - padding;
    }

    // حساب الموقع العمودي
    let top = rect.bottom + padding;

    // التحقق من الحدود السفلية
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      // اعرضه فوق الزر
      top = rect.top - dropdownHeight - padding;
      // إذا كان فوق أيضاً خارج الشاشة، اجعله في أعلى مكان ممكن
      if (top < padding) {
        top = padding;
      }
    }

    // تأكد من أن القمة لا تخرج من الشاشة
    if (top < padding) {
      top = padding;
    }

    setDropdownPosition({ top, left });
  }, []);

  // إغلاق الـ dropdown عند الضغط خارجه أو السكرول
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        const isButton = Object.values(buttonRefs.current).some(
          (button) => button && button.contains(event.target as Node),
        );
        if (!isButton) {
          setOpenDropdownId(null);
          setDropdownPosition(null);
        }
      }
    };

    const handleScroll = () => {
      if (openDropdownId) {
        // إعادة حساب الموقع عند السكرول
        requestAnimationFrame(() => {
          calculateDropdownPosition(openDropdownId);
        });
      }
    };

    const handleResize = () => {
      if (openDropdownId) {
        setOpenDropdownId(null);
        setDropdownPosition(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true); // true للـ capture phase
      window.addEventListener("resize", handleResize);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [openDropdownId, calculateDropdownPosition]);

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedPropertyRequests.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedPropertyRequests.length} طلب عقار محدد
          </span>
          <Dialog
            open={showBulkActionsDialog}
            onOpenChange={setShowBulkActionsDialog}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <CheckSquare className="ml-2 h-4 w-4" />
                إجراءات جماعية
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إجراءات جماعية لطلبات العقارات</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Mail className="ml-2 h-4 w-4" />
                  إرسال بريد إلكتروني جماعي
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <MessageSquare className="ml-2 h-4 w-4" />
                  إرسال رسالة واتساب جماعية
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Tag className="ml-2 h-4 w-4" />
                  إضافة علامات
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Download className="ml-2 h-4 w-4" />
                  تصدير البيانات المحددة
                </Button>
                <Separator />
                <Button className="w-full justify-start" variant="destructive">
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف طلبات العقارات المحددة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPropertyRequests([])}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Property Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedPropertyRequests.length ===
                      filteredAndSortedPropertyRequests.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("full_name")}
                    className="h-auto p-0 font-semibold "
                  >
                    مقدم الطلب
                    {sortField === "full_name" &&
                      (sortDirection === "asc" ? (
                        <SortAsc className="mr-2 h-4 w-4" />
                      ) : (
                        <SortDesc className="mr-2 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead className="text-right">الاتصال</TableHead>
                <TableHead className="text-right">الموظف</TableHead>
                <TableHead className="text-right">نوع العقار</TableHead>
                <TableHead className="text-right">المنطقة</TableHead>
                <TableHead className="text-right">الحي</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تاريخ الطلب</TableHead>
                <TableHead className="w-[100px] text-right">
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading Skeleton Rows
                [...Array(8)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                filteredAndSortedPropertyRequests.map((propertyRequest: any) => (
                <TableRow key={propertyRequest.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPropertyRequests.includes(
                        propertyRequest.id,
                      )}
                      onCheckedChange={() =>
                        handleSelectPropertyRequest(propertyRequest.id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-right">
                          {propertyRequest.full_name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {/* Phone Number */}
                      {propertyRequest.phone ? (
                        <div className="flex items-center text-sm">
                          <Phone className="ml-2 h-3 w-3 text-green-600" />
                          <span className="font-medium">
                            {propertyRequest.phone}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="ml-2 h-3 w-3" />
                          <span className="italic">لا يوجد رقم</span>
                        </div>
                      )}

                      {/* WhatsApp */}
                      {propertyRequest.contact_on_whatsapp ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="ml-2 h-3 w-3 text-green-500" />
                          <span className="text-xs">متاح عبر واتساب</span>
                        </div>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    {propertyRequest.employee ? (
                      <div className="space-y-1">
                        <div className="font-medium text-right">
                          {propertyRequest.employee.name}
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          #{propertyRequest.employee.id}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">
                        غير محدد
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        propertyRequest.property_type === "سكني"
                          ? "border-blue-500 text-blue-700"
                          : propertyRequest.property_type === "تجاري"
                            ? "border-green-500 text-green-700"
                            : propertyRequest.property_type === "صناعي"
                              ? "border-purple-500 text-purple-700"
                              : propertyRequest.property_type === "أرض"
                                ? "border-orange-500 text-orange-700"
                                : "border-red-500 text-red-700"
                      }
                    >
                      {propertyRequest.property_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-right">
                        {propertyRequest.region || (
                          <span className="text-muted-foreground text-sm italic">
                            غير محددة
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {propertyRequest.districtName ? (
                        <div className="font-medium text-right text-sm">
                          {propertyRequest.districtName}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">
                          غير محدد
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {propertyRequest.status ? (
                      <Badge
                        variant="outline"
                        className="border-gray-500 text-gray-700"
                      >
                        {propertyRequest.status.name_ar}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">
                        غير محدد
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Clock className="ml-2 h-3 w-3 text-blue-500" />
                      <span className="font-medium">
                        {new Date(
                          propertyRequest.created_at,
                        ).toLocaleDateString("ar-US")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/dashboard/property-requests/${propertyRequest.id}`,
                          );
                        }}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Custom Dropdown Menu */}
                      <Button
                        ref={(el) => {
                          buttonRefs.current[propertyRequest.id] = el;
                        }}
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openDropdownId === propertyRequest.id.toString()) {
                            setOpenDropdownId(null);
                            setDropdownPosition(null);
                          } else {
                            setOpenDropdownId(propertyRequest.id.toString());
                            // استخدام requestAnimationFrame للتأكد من حساب الموقع بعد الرسم
                            requestAnimationFrame(() => {
                              calculateDropdownPosition(propertyRequest.id.toString());
                            });
                          }
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>

                      {/* Dropdown Menu using Portal */}
                      {openDropdownId === propertyRequest.id.toString() &&
                        dropdownPosition &&
                        typeof window !== "undefined" &&
                        createPortal(
                          <div
                            ref={dropdownRef}
                            className="w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-[calc(100vh-16px)] overflow-y-auto"
                            style={{
                              position: "fixed",
                              top: `${dropdownPosition.top}px`,
                              left: `${dropdownPosition.left}px`,
                              zIndex: 9999,
                              direction: "rtl",
                            }}
                          >
                            {/* تعيين الموظف المسؤول */}
                            <button
                              className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenDropdownId(null);
                                setDropdownPosition(null);
                                setSelectedPropertyRequestForAction(propertyRequest);
                                setShowEmployeeDialog(true);
                              }}
                            >
                              <User className="ml-2 h-4 w-4" />
                              تعيين موظف
                            </button>

                            {/* تغيير الحالة */}
                            <button
                              className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenDropdownId(null);
                                setDropdownPosition(null);
                                setSelectedPropertyRequestForAction(propertyRequest);
                                setShowStatusDialog(true);
                              }}
                            >
                              <Tag className="ml-2 h-4 w-4" />
                              تغيير الحالة
                            </button>

                            {/* تحويل الى الcrm */}
                            <button
                              className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpenDropdownId(null);
                                setDropdownPosition(null);
                                handleConvertToCrm(propertyRequest);
                              }}
                            >
                              <Building className="ml-2 h-4 w-4" />
                              تحويل الى الcrm
                            </button>
                          </div>,
                          document.body,
                        )}
                      {/* DropdownMenu - Hidden */}
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              openEditDialog(propertyRequest);
                            }}
                          >
                            <Edit className="ml-2 h-4 w-4" />
                            تعديل الطلب
                          </DropdownMenuItem>

                          {formData && (
                            <Dialog open={open} onOpenChange={setOpen}>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    تعديل بيانات طلب العقار
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4">
                                  <Input
                                    id="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange("full_name")}
                                  />
                                  <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange("phone")}
                                  />
                                  <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={handleChange("notes")}
                                  />

                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => setOpen(false)}
                                    >
                                      إلغاء
                                    </Button>
                                    <Button
                                      onClick={handleUpdatePropertyRequest}
                                    >
                                      تعديل
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openWhatsApp(propertyRequest.phone)}
                          >
                            <MessageSquare className="ml-2 h-4 w-4" />
                            إرسال واتساب
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Phone className="ml-2 h-4 w-4" />
                            اتصال هاتفي
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="ml-2 h-4 w-4" />
                            إرسال بريد إلكتروني
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(propertyRequest.id)}
                          >
                            <Trash2 className="ml-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {onPageChange && totalPages > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            lastPage={totalPages}
            total={totalItems}
            perPage={perPage}
            from={(currentPage - 1) * perPage + 1}
            to={Math.min(currentPage * perPage, totalItems)}
            onPageChange={onPageChange}
            loading={loading}
          />
        </div>
      )}

      {/* Status Change Dialog */}
      <PropertyRequestStatusChangeDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        propertyRequest={selectedPropertyRequestForAction}
        onStatusUpdated={(propertyRequestId, newStatus) => {
          if (onStatusUpdated) {
            onStatusUpdated(propertyRequestId, newStatus);
          }
          setSelectedPropertyRequestForAction(null);
        }}
      />

      {/* Employee Assignment Dialog */}
      <PropertyRequestEmployeeAssignmentDialog
        open={showEmployeeDialog}
        onOpenChange={setShowEmployeeDialog}
        propertyRequest={selectedPropertyRequestForAction}
        onEmployeeAssigned={(propertyRequestId, employeeId) => {
          if (onEmployeeAssigned) {
            onEmployeeAssigned(propertyRequestId, employeeId);
          }
          setSelectedPropertyRequestForAction(null);
        }}
      />
    </div>
  );
};
