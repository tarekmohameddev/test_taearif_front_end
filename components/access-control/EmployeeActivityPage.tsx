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

  // Fetch employee logs
  const fetchEmployeeLogs = async () => {
    if (!employeeId || !userData?.token) return;
    setLoading(true);
    setError(null);
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
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  العودة
                </Button>
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-gray-600" />
                  <h1 className="text-3xl font-bold text-gray-900">
                    سجل الموظف
                  </h1>
                </div>
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
                                {log.action_label || log.action}
                              </h4>
                              <Badge
                                variant={getActionBadgeVariant(log.action)}
                                className="text-xs"
                              >
                                {log.action}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-2">
                              {log.target_type && (
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {log.target_type}
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
                              <details className="mt-2">
                                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                                  عرض التفاصيل
                                </summary>
                                <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs">
                                  {log.old_values && (
                                    <div className="mb-2">
                                      <p className="font-medium text-red-600 mb-1">
                                        القيم السابقة:
                                      </p>
                                      <pre className="overflow-auto">
                                        {JSON.stringify(log.old_values, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  {log.new_values && (
                                    <div>
                                      <p className="font-medium text-green-600 mb-1">
                                        القيم الجديدة:
                                      </p>
                                      <pre className="overflow-auto">
                                        {JSON.stringify(log.new_values, null, 2)}
                                      </pre>
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

