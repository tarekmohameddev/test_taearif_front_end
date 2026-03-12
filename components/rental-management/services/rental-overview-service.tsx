"use client";

import { useEffect } from "react";
import useStore from "@/context/Store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  Wrench,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface OverviewStats {
  totalProperties: number;
  availableProperties: number;
  occupiedProperties: number;
  maintenanceProperties: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  activeContracts: number;
  expiringContracts: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  maintenanceRequests: number;
}

interface RecentActivity {
  id: string;
  type: "request" | "payment" | "maintenance" | "contract";
  typeAr: string;
  description: string;
  descriptionAr: string;
  date: string;
  dateHijri: string;
  status: string;
  statusAr: string;
  amount?: number;
}

interface RentalOverviewServiceProps {
  onAddRentalClick?: () => void;
  onCreateMaintenanceClick?: () => void;
}

export function RentalOverviewService({
  onAddRentalClick,
  onCreateMaintenanceClick,
}: RentalOverviewServiceProps) {
  const { rentalOverview, setRentalOverview } = useStore();
  const { stats, recentActivity, loading, isInitialized } = rentalOverview;
  const userData = useAuthStore(selectUserData);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchOverviewData");
      setRentalOverview({ loading: false });
      return;
    }

    const fetchOverviewData = async () => {
      setRentalOverview({ loading: true });
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newStats: OverviewStats = {
        totalProperties: 25,
        availableProperties: 8,
        occupiedProperties: 15,
        maintenanceProperties: 2,
        totalRequests: 47,
        pendingRequests: 12,
        approvedRequests: 28,
        rejectedRequests: 7,
        activeContracts: 15,
        expiringContracts: 3,
        totalRevenue: 285000,
        monthlyRevenue: 67500,
        pendingPayments: 5,
        maintenanceRequests: 8,
      };

      const activity: RecentActivity[] = [
        {
          id: "1",
          type: "request",
          typeAr: "طلب إيجار",
          description: "New rental request submitted",
          descriptionAr: "تم تقديم طلب إيجار جديد من أحمد الراشد",
          date: "2024-01-16",
          dateHijri: "1446/07/16",
          status: "pending",
          statusAr: "قيد المراجعة",
        },
        {
          id: "2",
          type: "payment",
          typeAr: "دفعة",
          description: "Monthly rent payment received",
          descriptionAr: "تم استلام دفعة الإيجار الشهري من سارة المنصوري",
          date: "2024-01-16",
          dateHijri: "1446/07/16",
          status: "completed",
          statusAr: "مكتمل",
          amount: 8500,
        },
        {
          id: "3",
          type: "maintenance",
          typeAr: "صيانة",
          description: "Maintenance request submitted",
          descriptionAr: "تم تقديم طلب صيانة لإصلاح التكييف",
          date: "2024-01-15",
          dateHijri: "1446/07/15",
          status: "in_progress",
          statusAr: "قيد التنفيذ",
        },
        {
          id: "4",
          type: "contract",
          typeAr: "عقد",
          description: "Rental contract signed",
          descriptionAr: "تم توقيع عقد إيجار جديد مع خالد الحربي",
          date: "2024-01-15",
          dateHijri: "1446/07/15",
          status: "active",
          statusAr: "نشط",
        },
        {
          id: "5",
          type: "request",
          typeAr: "طلب إيجار",
          description: "Rental request approved",
          descriptionAr: "تم الموافقة على طلب إيجار فاطمة العتيبي",
          date: "2024-01-14",
          dateHijri: "1446/07/14",
          status: "approved",
          statusAr: "موافق عليه",
        },
      ];

      setRentalOverview({
        stats: newStats,
        recentActivity: activity,
        loading: false,
        isInitialized: true,
      });
    };

    if (!isInitialized) {
      fetchOverviewData();
    }
  }, [isInitialized, setRentalOverview, userData?.token]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "request":
        return <Users className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      case "maintenance":
        return <Wrench className="h-4 w-4" />;
      case "contract":
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
      case "completed":
      case "active":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-gray-500">
              يرجى تسجيل الدخول لعرض المحتوى
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">نظرة عامة على نظام الإيجارات</h2>
        <p className="text-muted-foreground">ملخص شامل لجميع أنشطة الإيجار</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Properties Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي العقارات
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground">
              <span>متاح: {stats.availableProperties}</span>
              <span>•</span>
              <span>مؤجر: {stats.occupiedProperties}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات الإيجار</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground">
              <span>قيد المراجعة: {stats.pendingRequests}</span>
              <TrendingUp className="h-3 w-3 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العقود النشطة</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeContracts}</div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground">
              <span>تنتهي قريباً: {stats.expiringContracts}</span>
              <AlertCircle className="h-3 w-3 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الإيرادات الشهرية
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.monthlyRevenue.toLocaleString()} ر.س
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground">
              <span>مدفوعات معلقة: {stats.pendingPayments}</span>
              <TrendingUp className="h-3 w-3 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - donw delete it , i want it later */}
      {/* <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
          <CardDescription>الإجراءات الأكثر استخداماً في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button onClick={onAddRentalClick} className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6" />
              <span>إضافة طلب إيجار</span>
            </Button>
            <Button onClick={onCreateMaintenanceClick} variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
              <Wrench className="h-6 w-6" />
              <span>طلب صيانة</span>
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
