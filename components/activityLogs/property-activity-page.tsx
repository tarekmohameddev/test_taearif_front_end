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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Building,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

// Types
interface PropertyLog {
  id: number;
  action: string;
  actor: {
    id: number | null;
    type: string;
  };
  ip: string | null;
  user_agent: string | null;
  note: string | null;
  changes: {
    before: any;
    after: any;
  };
  created_at: string;
}

interface PropertyLogsResponse {
  status: string;
  data: {
    logs: PropertyLog[];
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

export default function PropertyActivityLogPage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const params = useParams();
  const propertyId = params.slug as string;

  // State
  const [propertyLogs, setPropertyLogs] = useState<PropertyLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  // Fetch property logs
  const fetchPropertyLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<PropertyLogsResponse>(
        `/v1/properties/${propertyId}/logs`,
        {
          params: {
            page: currentPage,
            search: searchQuery,
            action: actionFilter !== "all" ? actionFilter : undefined,
          },
        },
      );

      setPropertyLogs(response.data.data.logs);
      setTotalPages(response.data.data.pagination.last_page);
      setTotalLogs(response.data.data.pagination.total);
    } catch (err: any) {
      console.error("Error fetching property logs:", err);
      setError("فشل في جلب سجل نشاطات العقار");
    } finally {
      setLoading(false);
    }
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
    switch (action) {
      case "created":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "updated":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "deleted":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "custom":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get action badge variant
  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "created":
        return "default";
      case "updated":
        return "secondary";
      case "deleted":
        return "destructive";
      case "custom":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Filter logs based on search and filters
  const filteredLogs = propertyLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  // Calculate statistics
  const createdCount = propertyLogs.filter(
    (log) => log.action === "created",
  ).length;
  const updatedCount = propertyLogs.filter(
    (log) => log.action === "updated",
  ).length;
  const deletedCount = propertyLogs.filter(
    (log) => log.action === "deleted",
  ).length;
  const customCount = propertyLogs.filter(
    (log) => log.action === "custom",
  ).length;

  // Effects
  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    fetchPropertyLogs();
  }, [propertyId, currentPage, searchQuery, actionFilter, userData?.token, authLoading]);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
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
                  <Building className="h-6 w-6 text-gray-600" />
                  <h1 className="text-3xl font-bold text-gray-900">
                    سجل نشاطات العقار
                  </h1>
                </div>
              </div>
              <p className="text-gray-600">
                مراقبة وتتبع جميع الأنشطة المتعلقة بهذا العقار
              </p>
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
                      <p className="text-sm text-gray-600">إجراءات مخصصة</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {customCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
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
                      <option value="created">تم الإنشاء</option>
                      <option value="updated">تم التحديث</option>
                      <option value="deleted">تم الحذف</option>
                      <option value="custom">إجراءات مخصصة</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 ml-2" />
                      تصدير
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  سجل النشاطات ({totalLogs})
                </CardTitle>
                <CardDescription>
                  عرض جميع الأنشطة والعمليات المتعلقة بهذا العقار
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
                    <Button onClick={fetchPropertyLogs} variant="outline">
                      إعادة المحاولة
                    </Button>
                  </div>
                ) : filteredLogs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {getActionIcon(log.action)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {log.action}
                              </h4>
                              <Badge
                                variant={getActionBadgeVariant(log.action)}
                                className="text-xs"
                              >
                                {getActionIcon(log.action)}
                                <span className="mr-1">{log.action}</span>
                              </Badge>
                            </div>

                            {log.note && (
                              <p className="text-sm text-gray-600 mb-2">
                                {log.note}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(log.created_at)}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {log.actor.type}
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                ID: {log.id}
                              </div>
                            </div>
                          </div>

                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 ml-2" />
                            تفاصيل
                          </Button>
                        </div>
                      </div>
                    ))}
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
