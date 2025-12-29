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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { CustomerForm } from "./CustomerForm";
import { Separator } from "@/components/ui/separator";
import { StageAssignmentDialog } from "./StageAssignmentDialog";
import { Pagination } from "./Pagination";
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
  Activity,
  CheckSquare,
  X,
  ArrowRight,
  User,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import useStore from "@/context/Store";
import { WhatsAppSendDialog } from "@/components/marketing/whatsapp-send-dialog";
import axiosInstance from "@/lib/axiosInstance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, CheckCircle } from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import toast from "react-hot-toast";

export const CustomerTable = ({
  filteredAndSortedCustomers,
  selectedCustomers,
  handleSelectAll,
  handleSelectCustomer,
  sortField,
  sortDirection,
  handleSort,
  openEditDialog,
  handleDelete,
  formData,
  open,
  setOpen,
  handleChange,
  handleUpdateCustomer,
  showBulkActionsDialog,
  setShowBulkActionsDialog,
  setSelectedCustomers,
  showStageDialog,
  setShowStageDialog,
  selectedCustomerForStage,
  setSelectedCustomerForStage,
  onStageUpdated,
  // Pagination props
  pagination,
  onPageChange,
  loading,
}: any) => {
  const { marketingChannels, fetchMarketingChannels } = useStore();
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const [selectedCustomerForWhatsApp, setSelectedCustomerForWhatsApp] =
    useState<any>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const router = useRouter();

  // Employee Assignment Dialog State
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [selectedCustomerForEmployee, setSelectedCustomerForEmployee] =
    useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null,
  );
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);
  const { userData } = useAuthStore();

  // جلب قنوات التسويق عند تحميل المكون
  useEffect(() => {
    fetchMarketingChannels();
  }, [fetchMarketingChannels]);

  // جلب الموظفين عند فتح dialog تعيين الموظف
  useEffect(() => {
    if (showEmployeeDialog && userData?.token) {
      fetchEmployees();
    }
  }, [showEmployeeDialog, userData?.token]);

  // تعيين الموظف الحالي عند فتح dialog
  useEffect(() => {
    if (selectedCustomerForEmployee && employees.length > 0) {
      const currentEmployeeId =
        selectedCustomerForEmployee.responsible_employee?.id || null;
      setSelectedEmployeeId(currentEmployeeId);
    }
  }, [selectedCustomerForEmployee, employees]);

  // دالة لجلب الموظفين
  const fetchEmployees = async () => {
    if (!userData?.token) return;

    setLoadingEmployees(true);
    try {
      const response = await axiosInstance.get("/v1/employees");
      if (response.data && response.data.data) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("حدث خطأ أثناء تحميل الموظفين", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setLoadingEmployees(false);
    }
  };

  // دالة لحفظ تعيين الموظف
  const handleAssignEmployee = async () => {
    if (!selectedCustomerForEmployee) return;

    if (!userData?.token) {
      toast.error("يجب تسجيل الدخول أولاً", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setSavingEmployee(true);
    try {
      const customer = selectedCustomerForEmployee;

      // إعداد البيانات للإرسال باستخدام بيانات العميل الموجودة
      const updateData: any = {
        stage_id: customer.stage?.id || null,
        name: customer.name,
        email: customer.email || "",
        note: customer.note || "",
        type_id: customer.type?.id || null,
        procedure_id: customer.procedure?.id || null,
        priority_id: customer.priority?.id || null,
        city_id: customer.city_id || customer.district?.city_id || null,
        district_id: customer.district?.id || null,
        interested_category_ids:
          customer.interested_categories?.map((cat: any) => cat.id) || null,
        interested_property_ids:
          customer.interested_properties?.map((prop: any) => prop.id) || null,
        phone_number: customer.phone_number || "",
        responsible_employee_id: selectedEmployeeId,
      };

      // إرسال طلب التحديث
      await axiosInstance.put(`/customers/${customer.id}`, updateData);

      toast.success("تم تعيين الموظف المسؤول بنجاح!", {
        duration: 4000,
        position: "top-center",
      });

      // تحديث الصفحة
      if (onPageChange && pagination) {
        onPageChange(pagination.current_page);
      }

      setShowEmployeeDialog(false);
      setSelectedCustomerForEmployee(null);
      setSelectedEmployeeId(null);
    } catch (error: any) {
      console.error("Error assigning employee:", error);
      toast.error(
        error.response?.data?.message ||
          "حدث خطأ أثناء تعيين الموظف المسؤول",
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#EF4444",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "8px",
          },
        },
      );
    } finally {
      setSavingEmployee(false);
    }
  };

  // دالة للانتقال إلى صفحة تفاصيل العميل
  const handleRowClick = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  // دالة لحساب موقع الزر
  const calculateDropdownPosition = useCallback((customerId: string) => {
    const button = buttonRefs.current[customerId];
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const dropdownWidth = 224; // w-56 = 14rem = 224px
    const dropdownHeight = 350; // تقريبي
    const padding = 8;

    // حساب الموقع الأفقي (من اليمين لأننا RTL)
    // نريد أن يظهر الـ dropdown بجانب الزر من جهة اليمين
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

  // التحقق من وجود قناة واتساب صالحة
  const hasValidWhatsAppChannel = () => {
    return marketingChannels.channels.some(
      (channel: any) =>
        channel.is_verified === true &&
        channel.is_connected === true &&
        channel.customers_page_integration_enabled === true,
    );
  };
  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedCustomers.length} عميل محدد
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
                <DialogTitle>إجراءات جماعية للعملاء</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Mail className="ml-2 h-4 w-4" />
                  إرسال بريد إلكتروني جماعي
                </Button>
                {hasValidWhatsAppChannel() && (
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <MessageSquare className="ml-2 h-4 w-4" />
                    إرسال رسالة واتساب جماعية
                  </Button>
                )}
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
                  حذف العملاء المحددين
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCustomers([])}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Customer Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedCustomers.length ===
                      filteredAndSortedCustomers.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-semibold "
                  >
                    العميل
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <SortAsc className="mr-2 h-4 w-4" />
                      ) : (
                        <SortDesc className="mr-2 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead className="text-right">معلومات الاتصال</TableHead>
                <TableHead className="text-right">الموظف المسؤول</TableHead>
                <TableHead className="text-right">نوع العقار</TableHead>
                <TableHead className="text-right">نوع الطلب</TableHead>
                <TableHead className="text-right">الرسالة</TableHead>
                <TableHead className="text-right">المرحلة</TableHead>
                <TableHead className="text-right">الموقع</TableHead>
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
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
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
                filteredAndSortedCustomers.map((customer: any) => (
                <TableRow
                  key={customer.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => handleRowClick(customer.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => handleSelectCustomer(customer.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-right">
                          {customer.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {/* Email */}
                      {customer.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="ml-2 h-3 w-3 text-blue-600" />
                          <span className="font-medium">{customer.email}</span>
                        </div>
                      )}

                      {/* Phone Number */}
                      {customer.phone_number ? (
                        <div className="flex items-center text-sm">
                          <Phone className="ml-2 h-3 w-3 text-green-600" />
                          <span className="font-medium">
                            {customer.phone_number}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="ml-2 h-3 w-3" />
                          <span className="italic">لا يوجد رقم هاتف</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.responsible_employee ? (
                      <div className="space-y-1 text-right">
                        <div className="font-medium text-sm">
                          {customer.responsible_employee.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {customer.responsible_employee.whatsapp_number}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground text-right italic">
                        لا يوجد موظف مسؤول
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        customer.type?.name === "Buyer" ||
                        customer.type?.name === "مشتري"
                          ? "border-blue-500 text-blue-700"
                          : customer.type?.name === "Seller" ||
                              customer.type?.name === "بائع"
                            ? "border-green-500 text-green-700"
                            : customer.type?.name === "Rented" ||
                                customer.type?.name === "مستأجر"
                              ? "border-purple-500 text-purple-700"
                              : customer.type?.name === "Landlord" ||
                                  customer.type?.name === "مؤجر"
                                ? "border-orange-500 text-orange-700"
                                : customer.type?.name === "Investor" ||
                                    customer.type?.name === "مستثمر"
                                  ? "border-red-500 text-red-700"
                                  : "border-gray-500 text-gray-700"
                      }
                    >
                      {customer.inquiry?.property_type || "غير محدد"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-gray-500 text-gray-700"
                    >
                      {customer.inquiry?.inquiry_type || "غير محدد"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] min-w-[200px] sm:max-w-40 ">
                    {customer.inquiry?.message || "غير محدد"}
                  </TableCell>
                  <TableCell>
                    {customer.stage?.name ? (
                      <Badge
                        variant="outline"
                        className="border-gray-500 text-gray-700"
                      >
                        {customer.stage.name}
                      </Badge>
                    ) : (
                      <div className="text-sm text-muted-foreground text-right italic">
                        غير محدد
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {/* City */}
                      <div className="font-medium text-right">
                        {customer.district?.city_name_ar || "غير محدد"}
                      </div>
                      {/* District */}
                      <div className="text-sm text-muted-foreground text-right">
                        {customer.district?.name_ar || "لا يوجد حي محدد"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(customer.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Custom Dropdown Menu */}
                      <Button
                        ref={(el) => {
                          buttonRefs.current[customer.id] = el;
                        }}
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openDropdownId === customer.id) {
                            setOpenDropdownId(null);
                            setDropdownPosition(null);
                          } else {
                            setOpenDropdownId(customer.id);
                            // استخدام requestAnimationFrame للتأكد من حساب الموقع بعد الرسم
                            requestAnimationFrame(() => {
                              calculateDropdownPosition(customer.id);
                            });
                          }
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>

                      {/* Dropdown Menu using Portal */}
                      {openDropdownId === customer.id &&
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
                            {/* تعديل العميل */}
                            <button
                              className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenDropdownId(null);
                                setDropdownPosition(null);
                                openEditDialog(customer);
                              }}
                            >
                              <Edit className="ml-2 h-4 w-4" />
                              تعديل العميل
                            </button>

                            {/* تعيين المرحلة */}
                            <button
                              className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenDropdownId(null);
                                setDropdownPosition(null);
                                setSelectedCustomerForStage(customer);
                                setShowStageDialog(true);
                              }}
                            >
                              <ArrowRight className="ml-2 h-4 w-4" />
                              تعيين المرحلة
                            </button>

                            {/* تعيين الموظف المسؤول */}
                            <button
                              className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenDropdownId(null);
                                setDropdownPosition(null);
                                setSelectedCustomerForEmployee(customer);
                                setShowEmployeeDialog(true);
                              }}
                            >
                              <User className="ml-2 h-4 w-4" />
                              تعيين الموظف المسؤول
                            </button>

                            {/* إرسال واتساب */}
                            {hasValidWhatsAppChannel() && (
                              <button
                                className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setOpenDropdownId(null);
                                  setDropdownPosition(null);
                                  setSelectedCustomerForWhatsApp(customer);
                                  setTimeout(
                                    () => setShowWhatsAppDialog(true),
                                    50,
                                  );
                                }}
                              >
                                <MessageSquare className="ml-2 h-4 w-4" />
                                إرسال واتساب
                              </button>
                            )}

                            {/* Separator */}
                            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                            {/* حذف */}
                            <button
                              className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors"
                              onClick={() => {
                                setOpenDropdownId(null);
                                setDropdownPosition(null);
                                handleDelete(customer.id);
                              }}
                            >
                              <Trash2 className="ml-2 h-4 w-4" />
                              حذف
                            </button>
                          </div>,
                          document.body,
                        )}
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
      {pagination && (
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          perPage={pagination.per_page}
          from={pagination.from}
          to={pagination.to}
          onPageChange={onPageChange}
          loading={loading}
        />
      )}

      {/* Stage Assignment Dialog */}
      <StageAssignmentDialog
        open={showStageDialog}
        onOpenChange={setShowStageDialog}
        customer={selectedCustomerForStage}
        onStageUpdated={onStageUpdated}
      />

      {/* WhatsApp Send Dialog */}
      <WhatsAppSendDialog
        isOpen={showWhatsAppDialog}
        onClose={() => {
          setShowWhatsAppDialog(false);
          setSelectedCustomerForWhatsApp(null);
        }}
        customerPhone={selectedCustomerForWhatsApp?.phone_number}
        customerName={selectedCustomerForWhatsApp?.name}
        customerId={selectedCustomerForWhatsApp?.id}
      />

      {/* Edit Customer Dialog */}
      {formData && (
        <CustomDialog open={open} onOpenChange={setOpen} maxWidth="max-w-4xl">
          <CustomDialogContent className="p-6">
            <CustomDialogHeader>
              <CustomDialogTitle>تعديل بيانات العميل</CustomDialogTitle>
              <CustomDialogClose onClose={() => setOpen(false)} />
            </CustomDialogHeader>
            <div className="py-4">
              <CustomerForm
                formData={{
                  name: formData.name,
                  email: formData.email,
                  phone_number: formData.phone_number,
                  city_id: formData.city_id || null,
                  district_id: formData.district_id || null,
                  note: formData.note || "",
                  type_id: formData.type_id,
                  priority_id: formData.priority_id,
                  stage_id: formData.stage_id || null,
                  procedure_id: formData.procedure_id || null,
                }}
                onChange={(field, value) => {
                  handleChange(field)({ target: { value } } as any);
                }}
                errors={{}}
                isEditMode={true}
              />
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  إلغاء
                </Button>
                <Button onClick={handleUpdateCustomer}>
                  تعديل
                </Button>
              </div>
            </div>
          </CustomDialogContent>
        </CustomDialog>
      )}

      {/* Employee Assignment Dialog */}
      <CustomDialog
        open={showEmployeeDialog}
        onOpenChange={setShowEmployeeDialog}
        maxWidth="max-w-md"
      >
        <CustomDialogContent className="p-3">
          <CustomDialogHeader>
            <CustomDialogTitle className="flex items-center gap-3 ">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">تعيين الموظف المسؤول</div>
                <div className="text-sm text-muted-foreground font-normal">
                  اختر الموظف المسؤول عن هذا العميل
                </div>
              </div>
            </CustomDialogTitle>
            <CustomDialogClose
              onClose={() => {
                setShowEmployeeDialog(false);
                setSelectedCustomerForEmployee(null);
                setSelectedEmployeeId(null);
              }}
            />
          </CustomDialogHeader>

          <div className="space-y-6">
            {/* معلومات العميل */}
            {selectedCustomerForEmployee && (
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {selectedCustomerForEmployee.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    عميل رقم #{selectedCustomerForEmployee.id}
                  </div>
                </div>
              </div>
            )}

            {/* اختيار الموظف */}
            <div className="space-y-3">
              <label className="text-sm font-medium">اختر الموظف:</label>
              {loadingEmployees ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="mr-2 text-sm text-muted-foreground">
                    جاري تحميل الموظفين...
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Select
                    value={
                      selectedEmployeeId
                        ? selectedEmployeeId.toString()
                        : undefined
                    }
                    onValueChange={(value) =>
                      setSelectedEmployeeId(value ? Number(value) : null)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الموظف" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => {
                        // استخدام first_name و last_name إذا كانا متوفرين
                        const employeeName = employee.first_name && employee.last_name
                          ? `${employee.first_name} ${employee.last_name}`
                          : employee.name || employee.email || `موظف #${employee.id}`;
                        
                        return (
                          <SelectItem
                            key={employee.id}
                            value={employee.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <span>{employeeName}</span>
                              {employee.email && (
                                <span className="text-xs text-muted-foreground">
                                  ({employee.email})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {selectedEmployeeId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                      onClick={() => setSelectedEmployeeId(null)}
                    >
                      إلغاء تعيين الموظف
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* معاينة الموظف المختار */}
            {selectedEmployeeId && (
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">الموظف المختار:</span>
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const selectedEmployee = employees.find(
                      (emp) => emp.id === selectedEmployeeId,
                    );
                    if (!selectedEmployee) return null;
                    
                    const employeeName =
                      selectedEmployee.first_name && selectedEmployee.last_name
                        ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                        : selectedEmployee.name ||
                          selectedEmployee.email ||
                          `موظف #${selectedEmployee.id}`;
                    
                    return (
                      <>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedEmployee.photo || "/placeholder.svg"} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employeeName}</div>
                          {selectedEmployee.email && (
                            <div className="text-xs text-muted-foreground">
                              {selectedEmployee.email}
                            </div>
                          )}
                          {selectedEmployee.phone && (
                            <div className="text-xs text-muted-foreground">
                              {selectedEmployee.phone}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowEmployeeDialog(false);
                setSelectedCustomerForEmployee(null);
                setSelectedEmployeeId(null);
              }}
              disabled={savingEmployee}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleAssignEmployee}
              disabled={savingEmployee || loadingEmployees}
              className="min-w-[100px]"
            >
              {savingEmployee ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckCircle className="ml-2 h-4 w-4" />
                  تطبيق
                </>
              )}
            </Button>
          </div>
        </CustomDialogContent>
      </CustomDialog>

    </div>
  );
};
