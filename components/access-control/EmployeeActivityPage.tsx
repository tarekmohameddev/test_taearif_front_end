"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Search,
  Download,
  Clock,
  User,
  Eye,
  Loader2,
  XCircle,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
  Mail,
  Calendar,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

// Types
interface EmployeeLog {
  id: number;
  action: string;
  action_label: string;
  actor_type: string;
  actor_id: number;
  target_type: string;
  target_id: number;
  old_values: any;
  new_values: any;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
  actor: {
    id: number;
    name: string;
    email: string;
    account_type: string;
  };
}

interface EmployeeInfo {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  photo: string | null;
  phone: string;
}

interface EmployeeLogsResponse {
  status: string;
  data: {
    logs: EmployeeLog[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
}

interface EmployeeResponse {
  status: string;
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    photo: string | null;
    phone: string;
  };
}

export default function EmployeeActivityPage() {
  const params = useParams();
  const employeeId = params?.id as string;
  const { userData, IsLoading: authLoading } = useAuthStore();

  // State
  const [employeeLogs, setEmployeeLogs] = useState<EmployeeLog[]>([]);
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  // Fetch employee info
  const fetchEmployeeInfo = async () => {
    if (!employeeId || !userData?.token) return;
    setEmployeeLoading(true);
    try {
      const response = await axiosInstance.get<EmployeeResponse>(
        `/v1/employees/${employeeId}`,
      );
      if (response.data && response.data.data) {
        setEmployeeInfo({
          id: response.data.data.id,
          first_name: response.data.data.first_name || null,
          last_name: response.data.data.last_name || null,
          email: response.data.data.email,
          photo: response.data.data.photo || null,
          phone: response.data.data.phone,
        });
      }
    } catch (err: any) {
      console.error("Error fetching employee info:", err);
      setError("فشل في جلب معلومات الموظف");
    } finally {
      setEmployeeLoading(false);
    }
  };

  // Mock data for testing (temporary)
  const getMockLogs = (): EmployeeLog[] => {
    const mockLogs: EmployeeLog[] = [
      {
        id: 1,
        action: "activity.create.customer",
        action_label: "إنشاء عميل",
        actor_type: "employee",
        actor_id: Number(employeeId),
        target_type: "api_customers",
        target_id: 101,
        old_values: null,
        new_values: {
          body: {
            name: "محمد أحمد",
            email: "mohamed@example.com",
            phone: "+201234567890"
          },
          response_status: 201
        },
        ip: "192.168.1.100",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actor: {
          id: Number(employeeId),
          name: employeeInfo ? `${employeeInfo.first_name || ""} ${employeeInfo.last_name || ""}`.trim() : "موظف",
          email: employeeInfo?.email || "",
          account_type: "employee"
        }
      },
      {
        id: 2,
        action: "activity.update.property",
        action_label: "تحديث عقار",
        actor_type: "employee",
        actor_id: Number(employeeId),
        target_type: "api_properties",
        target_id: 205,
        old_values: {
          price: 500000,
          status: "available"
        },
        new_values: {
          price: 550000,
          status: "sold"
        },
        ip: "192.168.1.100",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        actor: {
          id: Number(employeeId),
          name: employeeInfo ? `${employeeInfo.first_name || ""} ${employeeInfo.last_name || ""}`.trim() : "موظف",
          email: employeeInfo?.email || "",
          account_type: "employee"
        }
      },
      {
        id: 3,
        action: "activity.delete.project",
        action_label: "حذف مشروع",
        actor_type: "employee",
        actor_id: Number(employeeId),
        target_type: "api_projects",
        target_id: 303,
        old_values: {
          name: "مشروع سكني جديد",
          status: "active"
        },
        new_values: null,
        ip: "192.168.1.100",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        actor: {
          id: Number(employeeId),
          name: employeeInfo ? `${employeeInfo.first_name || ""} ${employeeInfo.last_name || ""}`.trim() : "موظف",
          email: employeeInfo?.email || "",
          account_type: "employee"
        }
      },
      {
        id: 4,
        action: "activity.create.property",
        action_label: "إنشاء عقار",
        actor_type: "employee",
        actor_id: Number(employeeId),
        target_type: "api_properties",
        target_id: 404,
        old_values: null,
        new_values: {
          body: {
            title: "شقة للبيع - القاهرة الجديدة",
            price: 1200000,
            area: 150
          },
          response_status: 201
        },
        ip: "192.168.1.100",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        actor: {
          id: Number(employeeId),
          name: employeeInfo ? `${employeeInfo.first_name || ""} ${employeeInfo.last_name || ""}`.trim() : "موظف",
          email: employeeInfo?.email || "",
          account_type: "employee"
        }
      },
      {
        id: 5,
        action: "activity.update.customer",
        action_label: "تحديث عميل",
        actor_type: "employee",
        actor_id: Number(employeeId),
        target_type: "api_customers",
        target_id: 501,
        old_values: {
          phone: "+201111111111"
        },
        new_values: {
          phone: "+201222222222"
        },
        ip: "192.168.1.100",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        actor: {
          id: Number(employeeId),
          name: employeeInfo ? `${employeeInfo.first_name || ""} ${employeeInfo.last_name || ""}`.trim() : "موظف",
          email: employeeInfo?.email || "",
          account_type: "employee"
        }
      }
    ];

    // Apply filters to mock data
    let filtered = mockLogs;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.action_label.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.target_type.toLowerCase().includes(query)
      );
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter(log => {
        if (actionFilter === "create") return log.action.includes("create");
        if (actionFilter === "update") return log.action.includes("update");
        if (actionFilter === "delete") return log.action.includes("delete");
        return true;
      });
    }

    return filtered;
  };

  // Fetch employee logs
  const fetchEmployeeLogs = async () => {
    if (!employeeId || !userData?.token) return;
    setLoading(true);
    setError(null);
    
    // TODO: Remove this mock data when API is ready
    // TEMPORARY: Using mock data
    setTimeout(() => {
      try {
        const mockLogs = getMockLogs();
        setEmployeeLogs(mockLogs);
        setTotalPages(1);
        setTotalLogs(mockLogs.length);
      } catch (err: any) {
        console.error("Error with mock data:", err);
        setError("حدث خطأ في عرض البيانات الوهمية");
      } finally {
        setLoading(false);
      }
    }, 500); // Simulate API delay

    /* TODO: Uncomment when API is ready
    try {
      const params: any = {
        actor_id: employeeId,
        locale: "ar",
        with_actor: true,
        per_page: 20,
        page: currentPage,
      };

      if (searchQuery) {
        params.q = searchQuery;
      }

      if (actionFilter !== "all") {
        params.action = actionFilter;
      }

      if (dateFrom) {
        params.date_from = dateFrom;
      }

      if (dateTo) {
        params.date_to = dateTo;
      }

      const response = await axiosInstance.get<EmployeeLogsResponse>(
        "/v1/logs",
        { params },
      );

      setEmployeeLogs(response.data.data.logs);
      setTotalPages(response.data.data.pagination.last_page);
      setTotalLogs(response.data.data.pagination.total);
    } catch (err: any) {
      console.error("Error fetching employee logs:", err);
      setError("فشل في جلب سجل نشاطات الموظف");
    } finally {
      setLoading(false);
    }
    */
  };

  // Get user initials
  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName && firstName.length > 0 ? firstName.charAt(0) : "";
    const lastInitial = lastName && lastName.length > 0 ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase() || "??";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Translate action names to Arabic
  const translateAction = (action: string, actionLabel?: string): string => {
    // If action_label is provided, use it
    if (actionLabel) {
      return actionLabel;
    }

    // Action type translations
    const actionTypes: { [key: string]: string } = {
      create: "إنشاء",
      update: "تحديث",
      delete: "حذف",
      view: "عرض",
      manage: "إدارة",
    };

    // Entity type translations
    const entityTypes: { [key: string]: string } = {
      customer: "عميل",
      customers: "عميل",
      property: "عقار",
      properties: "عقار",
      project: "مشروع",
      projects: "مشروع",
      crm: "سجل إدارة العملاء",
      content: "محتوى",
      settings: "إعدادات",
      dashboard: "لوحة التحكم",
      live_editor: "المحرر المباشر",
      apps: "تطبيق",
      affiliate: "التسويق بالعمولة",
      rental: "إيجار",
      rentals: "إيجار",
      role: "دور",
      roles: "دور",
      permission: "صلاحية",
      permissions: "صلاحية",
      employee: "موظف",
      employees: "موظف",
    };

    // Extract action type and entity from action string
    const parts = action.toLowerCase().split(".");
    let actionType = "";
    let entity = "";

    // Find action type
    for (const [key, value] of Object.entries(actionTypes)) {
      if (action.includes(key)) {
        actionType = value;
        break;
      }
    }

    // Find entity type
    for (const [key, value] of Object.entries(entityTypes)) {
      if (action.includes(key)) {
        entity = value;
        break;
      }
    }

    // If we found both, combine them
    if (actionType && entity) {
      return `${actionType} ${entity}`;
    }

    // Fallback: translate common patterns
    if (action.includes("activity.create.customer")) return "إنشاء عميل";
    if (action.includes("activity.update.customer")) return "تحديث عميل";
    if (action.includes("activity.delete.customer")) return "حذف عميل";
    if (action.includes("activity.create.property")) return "إنشاء عقار";
    if (action.includes("activity.update.property")) return "تحديث عقار";
    if (action.includes("activity.delete.property")) return "حذف عقار";
    if (action.includes("activity.create.project")) return "إنشاء مشروع";
    if (action.includes("activity.update.project")) return "تحديث مشروع";
    if (action.includes("activity.delete.project")) return "حذف مشروع";
    if (action.includes("activity.create.crm")) return "إنشاء سجل إدارة العملاء";
    if (action.includes("activity.update.crm")) return "تحديث سجل إدارة العملاء";
    if (action.includes("activity.delete.crm")) return "حذف سجل إدارة العملاء";
    if (action.includes("activity.create.content")) return "إنشاء محتوى";
    if (action.includes("activity.update.content")) return "تحديث محتوى";
    if (action.includes("activity.delete.content")) return "حذف محتوى";

    // Return action as is if no translation found
    return action;
  };

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes("create")) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (action.includes("update")) {
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    } else if (action.includes("delete")) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    } else {
      return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  // Get action badge variant
  const getActionBadgeVariant = (action: string) => {
    if (action.includes("create")) {
      return "default";
    } else if (action.includes("update")) {
      return "secondary";
    } else if (action.includes("delete")) {
      return "destructive";
    } else {
      return "outline";
    }
  };

  // Format values for display (user-friendly format)
  const formatValuesForDisplay = (values: any, title: string): React.ReactNode => {
    if (!values) return null;

    // Handle response_status case (for create actions)
    if (values.response_status) {
      return (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium">حالة الاستجابة:</span>{" "}
            <span className={values.response_status === 201 ? "text-green-600" : "text-gray-900"}>
              {values.response_status === 201 ? "تم الإنشاء بنجاح" : values.response_status}
            </span>
          </div>
          {values.body && formatValuesForDisplay(values.body, "البيانات")}
        </div>
      );
    }

    // Handle regular object values
    if (typeof values === "object" && values !== null) {
      const entries = Object.entries(values);
      
      if (entries.length === 0) {
        return <p className="text-sm text-gray-500">لا توجد بيانات</p>;
      }

      return (
        <div className="space-y-2">
          {entries.map(([key, value]) => {
            // Translate field names
            const fieldTranslations: { [key: string]: string } = {
              name: "الاسم",
              title: "العنوان",
              email: "البريد الإلكتروني",
              phone: "رقم الهاتف",
              price: "السعر",
              area: "المساحة",
              status: "الحالة",
              body: "البيانات",
              response_status: "حالة الاستجابة",
              description: "الوصف",
              address: "العنوان",
              city: "المدينة",
              country: "الدولة",
            };

            const translatedKey = fieldTranslations[key] || key;
            let displayValue: React.ReactNode;

            if (value === null || value === undefined) {
              displayValue = <span className="text-gray-400">غير محدد</span>;
            } else if (typeof value === "object") {
              displayValue = (
                <div className="mr-4 mt-1 p-2 bg-gray-100 rounded border border-gray-200">
                  {formatValuesForDisplay(value, "")}
                </div>
              );
            } else if (typeof value === "boolean") {
              displayValue = (
                <span className={value ? "text-green-600" : "text-red-600"}>
                  {value ? "نعم" : "لا"}
                </span>
              );
            } else if (typeof value === "number") {
              // Format numbers with commas
              displayValue = typeof value === "number" && value > 1000
                ? value.toLocaleString("ar-EG")
                : value;
            } else {
              displayValue = String(value);
            }

            return (
              <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-1 border-b border-gray-200 last:border-b-0">
                <span className="font-medium text-gray-700 min-w-[120px]">
                  {translatedKey}:
                </span>
                <span className="text-gray-900 flex-1">{displayValue}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // Handle primitive values
    return <span className="text-gray-900">{String(values)}</span>;
  };

  // Calculate statistics
  const createdCount = employeeLogs.filter((log) =>
    log.action.includes("create"),
  ).length;
  const updatedCount = employeeLogs.filter((log) =>
    log.action.includes("update"),
  ).length;
  const deletedCount = employeeLogs.filter((log) =>
    log.action.includes("delete"),
  ).length;
  const otherCount =
    employeeLogs.length - createdCount - updatedCount - deletedCount;

  // Effects
  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    if (employeeId) {
      fetchEmployeeInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, userData?.token, authLoading]);

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    if (employeeId) {
      fetchEmployeeLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, currentPage, searchQuery, actionFilter, dateFrom, dateTo, userData?.token, authLoading]);

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setActionFilter("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="access-control" setActiveTab={() => {}} />
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-gray-600" />
                  <h1 className="text-3xl font-bold text-gray-900">
                    سجل الموظف
                  </h1>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  العودة
                </Button>
              </div>
              <p className="text-gray-600">
                مراقبة وتتبع جميع الأنشطة والتفاعلات التي قام بها الموظف
              </p>

              {/* Employee Information */}
              {employeeLoading ? (
                <Card className="mt-4">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ) : employeeInfo ? (
                <Card className="mt-4">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {employeeInfo.first_name || ""} {employeeInfo.last_name || ""}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{employeeInfo.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4" />
                            <span>ID: {employeeInfo.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">تم الإنشاء</p>
                      <p className="text-2xl font-bold text-green-600">
                        {createdCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">تم التحديث</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {updatedCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">تم الحذف</p>
                      <p className="text-2xl font-bold text-red-600">
                        {deletedCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">إجراءات أخرى</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {otherCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="البحث في سجل النشاطات..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">جميع الإجراءات</option>
                        <option value="create">تم الإنشاء</option>
                        <option value="update">تم التحديث</option>
                        <option value="delete">تم الحذف</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                      >
                        إعادة تعيين
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          placeholder="من تاريخ"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          placeholder="إلى تاريخ"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 ml-2" />
                      تصدير
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employee Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  سجل النشاطات ({totalLogs})
                </CardTitle>
                <CardDescription>
                  عرض جميع الأنشطة والعمليات التي قام بها الموظف
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      <span className="text-gray-600 font-medium">
                        جاري تحميل سجل النشاطات...
                      </span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchEmployeeLogs} variant="outline">
                      إعادة المحاولة
                    </Button>
                  </div>
                ) : employeeLogs.length > 0 ? (
                  <div className="space-y-4">
                    {employeeLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            {getActionIcon(log.action)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {translateAction(log.action, log.action_label)}
                              </h4>
                              <Badge
                                variant={getActionBadgeVariant(log.action)}
                                className="text-xs"
                              >
                                {translateAction(log.action, log.action_label)}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-2">
                              {log.target_type && (
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {log.target_type
                                    .replace("api_", "")
                                    .replace("customers", "عميل")
                                    .replace("properties", "عقار")
                                    .replace("projects", "مشروع")
                                    .replace("crm", "سجل إدارة العملاء")
                                    .replace("content", "محتوى")}
                                  {log.target_id && ` #${log.target_id}`}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(log.created_at)}
                              </div>
                              {log.ip && (
                                <div className="flex items-center gap-1">
                                  <Activity className="h-3 w-3" />
                                  {log.ip}
                                </div>
                              )}
                            </div>

                            {(log.old_values || log.new_values) && (
                              <details className="mt-3">
                                <summary className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800 flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  عرض التفاصيل
                                </summary>
                                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                                  {log.old_values && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="h-1 w-1 bg-red-500 rounded-full"></div>
                                        <p className="font-semibold text-red-700 text-sm">
                                          القيم السابقة
                                        </p>
                                      </div>
                                      <div className="bg-white p-3 rounded-md border border-red-200">
                                        {formatValuesForDisplay(log.old_values, "القيم السابقة")}
                                      </div>
                                    </div>
                                  )}
                                  {log.new_values && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="h-1 w-1 bg-green-500 rounded-full"></div>
                                        <p className="font-semibold text-green-700 text-sm">
                                          القيم الجديدة
                                        </p>
                                      </div>
                                      <div className="bg-white p-3 rounded-md border border-green-200">
                                        {formatValuesForDisplay(log.new_values, "القيم الجديدة")}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          عرض {employeeLogs.length} من أصل {totalLogs} سجل
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            السابق
                          </Button>
                          <span className="text-sm text-gray-600">
                            صفحة {currentPage} من {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                          >
                            التالي
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد سجلات نشاط
                    </h3>
                    <p className="text-gray-600">
                      لم يتم العثور على سجلات نشاط تطابق المعايير المحددة
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

