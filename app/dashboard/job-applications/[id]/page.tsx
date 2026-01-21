"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  ArrowRight,
  User,
  Loader2,
  AlertCircle,
  Mail,
  FileText,
  Calendar,
  MessageSquare,
  Download,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import useAuthStore from "@/context/AuthContext";

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

interface JobApplicationShowResponse {
  success: true;
  data: JobApplication;
}

export default function JobApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params?.id as string;
  const { userData, IsLoading: authLoading } = useAuthStore();

  const [activeTab, setActiveTab] = useState("job-applications");
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch job application details
  const fetchJobApplicationDetails = async (id: string) => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    setLoadingDetails(true);
    setError(null);
    try {
      const response = await axiosInstance.get<JobApplicationShowResponse>(
        `/v1/job-applications/${id}`
      );

      if (response.data.success && response.data.data) {
        setApplication(response.data.data);
      } else {
        setError("فشل تحميل بيانات المتقدم");
      }
    } catch (error: any) {
      console.error("Error fetching job application details:", error);
      setError(
        error.response?.data?.message ||
          "حدث خطأ أثناء تحميل بيانات المتقدم"
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    if (applicationId) {
      fetchJobApplicationDetails(applicationId);
    }
  }, [applicationId, userData?.token, authLoading]);

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

  const handleCall = () => {
    if (application?.phone) {
      window.open(`tel:${application.phone}`, "_blank");
    }
  };

  const handleEmail = () => {
    if (application?.email) {
      window.open(`mailto:${application.email}`, "_blank");
    }
  };

  const handleDownloadPDF = () => {
    if (application?.pdf_path) {
      window.open(application.pdf_path, "_blank");
    }
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

  if (loadingDetails) {
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

  if (error || !application) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-4 md:p-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
                  <p className="text-muted-foreground mb-4">
                    {error || "لم يتم العثور على بيانات المتقدم"}
                  </p>
                  <Button onClick={() => router.push("/dashboard/job-applications")}>
                    <ArrowRight className="ml-2 h-4 w-4" />
                    العودة إلى قائمة المتقدمين
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/dashboard/job-applications")}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    تفاصيل المتقدم #{application.id}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    تم التقديم في {formatDate(application.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* معلومات المتقدم */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    معلومات المتقدم
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{application.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      متقدم للوظيفة #{application.id}
                    </p>
                  </div>

                  {/* معلومات الاتصال */}
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-semibold text-sm mb-3">معلومات الاتصال</h4>
                    {application.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">البريد الإلكتروني:</span>
                        <a
                          href={`mailto:${application.email}`}
                          className="text-sm font-medium hover:text-primary flex items-center gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          {application.email}
                        </a>
                      </div>
                    )}
                    {application.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">الهاتف:</span>
                        <a
                          href={`tel:${application.phone}`}
                          className="text-sm font-medium hover:text-primary flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {application.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* أزرار الاتصال */}
                  {(application.phone || application.email) && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 flex-wrap">
                        {application.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={handleCall}
                          >
                            <Phone className="h-4 w-4" />
                            <span className="hidden sm:inline">اتصل</span>
                          </Button>
                        )}
                        {application.email && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={handleEmail}
                          >
                            <Mail className="h-4 w-4" />
                            <span className="hidden sm:inline">إرسال بريد</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* معلومات الطلب */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    معلومات الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">رقم الطلب</p>
                      <p className="font-semibold">#{application.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تاريخ التقديم</p>
                      <p className="font-semibold text-sm">
                        {formatDate(application.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* السيرة الذاتية */}
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-semibold text-sm mb-3">السيرة الذاتية</h4>
                    {application.pdf_path ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">حالة الملف:</span>
                        <Badge variant="default" className="gap-1">
                          <FileText className="h-3 w-3" />
                          متوفر
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">حالة الملف:</span>
                        <Badge variant="secondary">غير متوفر</Badge>
                      </div>
                    )}
                    {application.pdf_path && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={handleDownloadPDF}
                      >
                        <Download className="h-4 w-4" />
                        تحميل السيرة الذاتية
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* الوصف / الرسالة */}
            {application.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    الرسالة / الوصف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {application.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* معاينة PDF */}
            {application.pdf_path && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    معاينة السيرة الذاتية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <iframe
                      src={application.pdf_path}
                      className="w-full h-[600px]"
                      title="السيرة الذاتية"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
