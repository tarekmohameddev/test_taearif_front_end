"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Loader2,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
  User,
} from "lucide-react";

// TypeScript interfaces based on API documentation
interface JobApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  description: string | null;
  pdf_path: string | null;
  created_at: string;
}

interface JobApplicationsListResponse {
  success: true;
  data: {
    job_applications: JobApplication[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
}

export default function JobApplicationsPage() {
  const router = useRouter();
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("job-applications");
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Fetch job applications
  const fetchJobApplications = async () => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("per_page", String(perPage));
      params.set("page", String(currentPage));
      if (activeSearchTerm.trim()) {
        params.set("search", activeSearchTerm.trim());
      }

      const response = await axiosInstance.get<JobApplicationsListResponse>(
        `/v1/job-applications?${params.toString()}`
      );

      if (response.data.success && response.data.data) {
        setApplications(response.data.data.job_applications);
        setCurrentPage(response.data.data.pagination.current_page);
        setTotal(response.data.data.pagination.total);
        setLastPage(response.data.data.pagination.last_page);
      } else {
        setError("فشل تحميل البيانات");
      }
    } catch (err: any) {
      console.error("Error fetching job applications:", err);
      setError(
        err.response?.data?.message ||
          "حدث خطأ أثناء تحميل طلبات التوظيف"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    fetchJobApplications();
  }, [userData?.token, authLoading, activeSearchTerm, perPage, currentPage]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "غير محدد";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/job-applications/${id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  if (authLoading || !userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  المتقدمين للوظائف
                </h1>
                <p className="text-muted-foreground mt-1">
                  إدارة طلبات التوظيف والموظفين المتقدمين
                </p>
              </div>
            </div>

            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي المتقدمين</p>
                    <p className="text-2xl font-bold">{total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الصفحة الحالية</p>
                    <p className="text-2xl font-bold">
                      {currentPage} / {lastPage}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">عدد النتائج في الصفحة</p>
                    <p className="text-2xl font-bold">{applications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
                      className="pr-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit">بحث</Button>
                </form>
              </CardContent>
            </Card>

            {/* Error State */}
            {error && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={fetchJobApplications}>إعادة المحاولة</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Table */}
            {!error && (
              <Card>
                <CardHeader>
                  <CardTitle>قائمة المتقدمين</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-6 space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="p-6 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "لم يتم العثور على نتائج"
                          : "لا توجد طلبات توظيف حالياً"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right">الاسم</TableHead>
                              <TableHead className="text-right">البريد الإلكتروني</TableHead>
                              <TableHead className="text-right">رقم الهاتف</TableHead>
                              <TableHead className="text-right">السيرة الذاتية</TableHead>
                              <TableHead className="text-right">تاريخ التقديم</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applications.map((application) => (
                              <TableRow
                                key={application.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleRowClick(application.id)}
                              >
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {application.name}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {application.email}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {application.phone}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {application.pdf_path ? (
                                    <Badge variant="default" className="gap-1">
                                      <FileText className="h-3 w-3" />
                                      متوفر
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">غير متوفر</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {formatDate(application.created_at)}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {lastPage > 1 && (
                        <div className="p-4 border-t flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            عرض {applications.length} من {total} متقدم
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (currentPage > 1) {
                                  setCurrentPage(currentPage - 1);
                                }
                              }}
                              disabled={currentPage === 1}
                            >
                              السابق
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (currentPage < lastPage) {
                                  setCurrentPage(currentPage + 1);
                                }
                              }}
                              disabled={currentPage === lastPage}
                            >
                              التالي
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
