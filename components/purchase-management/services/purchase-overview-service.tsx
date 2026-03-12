"use client";

import { useState, useEffect } from "react";
import { PurchaseRequestsService } from "./purchase-requests-service";
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
  Search,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface OverviewStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  activeContracts: number;
  completedPurchases: number;
  totalInvestment: number;
  monthlyInvestment: number;
  pendingPayments: number;
  scheduledInspections: number;
  availableProperties: number;
  underNegotiation: number;
}

interface RecentActivity {
  id: string;
  type: "request" | "payment" | "inspection" | "contract" | "negotiation";
  typeAr: string;
  description: string;
  descriptionAr: string;
  date: string;
  dateHijri: string;
  status: string;
  statusAr: string;
  amount?: number;
}

export function PurchaseOverviewService() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const userData = useAuthStore(selectUserData);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchOverviewData");
      return;
    }

    const fetchOverviewData = async () => {
      setLoading(true);
      try {
        // Fetch purchase requests data from API
        const response = await PurchaseRequestsService.getPurchaseRequests();
        const requests = response.data;

        // Calculate statistics from the data
        const stats = {
          totalRequests: requests.length,
          pendingRequests: requests.filter(
            (req) => req.overall_status === "pending",
          ).length,
          approvedRequests: requests.filter(
            (req) => req.overall_status === "completed",
          ).length,
          rejectedRequests: 0, // Not provided in API
          activeContracts: requests.filter(
            (req) => req.overall_status === "in_progress",
          ).length,
          completedPurchases: requests.filter(
            (req) => req.overall_status === "completed",
          ).length,
          totalInvestment: requests.reduce(
            (sum, req) => sum + parseFloat(req.budget_amount),
            0,
          ),
          monthlyInvestment:
            requests.reduce(
              (sum, req) => sum + parseFloat(req.budget_amount),
              0,
            ) * 0.1, // 10% of total
          pendingPayments: requests.filter(
            (req) => req.overall_status === "pending",
          ).length,
          scheduledInspections: 5, // Not provided in API, using default
          availableProperties: 45, // Not provided in API, using default
          underNegotiation: requests.filter(
            (req) => req.overall_status === "in_progress",
          ).length,
        };

        setStats(stats);

        // Transform recent requests to activity format
        const recentRequests = requests.slice(0, 5);
        const transformedActivity: RecentActivity[] = recentRequests.map(
          (request) => ({
            id: request.id.toString(),
            type: "request",
            typeAr: "طلب شراء",
            description: `Purchase request ${request.request_number}`,
            descriptionAr: `طلب شراء ${request.request_number} - ${request.client_name}`,
            date: request.created_at.split("T")[0],
            dateHijri: new Date(request.created_at).toLocaleDateString(
              "ar-US-u-ca-islamic",
            ),
            status: request.overall_status,
            statusAr:
              request.overall_status === "pending"
                ? "قيد المراجعة"
                : request.overall_status === "in_progress"
                  ? "قيد التنفيذ"
                  : "مكتمل",
            amount: parseFloat(request.budget_amount),
          }),
        );

        setRecentActivity(transformedActivity);
      } catch (error) {
        console.error("Error fetching overview data:", error);
        // Fallback to default data on error
        setStats({
          totalRequests: 0,
          pendingRequests: 0,
          approvedRequests: 0,
          rejectedRequests: 0,
          activeContracts: 0,
          completedPurchases: 0,
          totalInvestment: 0,
          monthlyInvestment: 0,
          pendingPayments: 0,
          scheduledInspections: 0,
          availableProperties: 0,
          underNegotiation: 0,
        });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [userData?.token]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "request":
        return <Users className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      case "inspection":
        return <Search className="h-4 w-4" />;
      case "contract":
        return <FileText className="h-4 w-4" />;
      case "negotiation":
        return <Building2 className="h-4 w-4" />;
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
      case "agreed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">نظرة عامة على نظام المشتريات</h2>
        <p className="text-muted-foreground">
          ملخص شامل لجميع أنشطة شراء العقارات
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Purchase Requests Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات الشراء</CardTitle>
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
              <span>مكتملة: {stats.completedPurchases}</span>
              <TrendingUp className="h-3 w-3 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الاستثمار الشهري
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.monthlyInvestment / 1000000).toFixed(1)}م ر.س
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground">
              <span>مدفوعات معلقة: {stats.pendingPayments}</span>
              <Clock className="h-3 w-3 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              المعاينات المجدولة
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.scheduledInspections}
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground">
              <span>قيد التفاوض: {stats.underNegotiation}</span>
              <AlertCircle className="h-3 w-3 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
          <CardDescription>
            الإجراءات الأكثر استخداماً في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6" />
              <span>إضافة طلب شراء</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
            >
              <Search className="h-6 w-6" />
              <span>جدولة معاينة</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
            >
              <FileText className="h-6 w-6" />
              <span>إنشاء عقد شراء</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
            >
              <DollarSign className="h-6 w-6" />
              <span>تسجيل دفعة</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Market Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>النشاطات الأخيرة</CardTitle>
            <CardDescription>آخر الأنشطة في نظام المشتريات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 space-x-reverse"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {activity.descriptionAr}
                      </p>
                      <Badge
                        className={`text-xs ${getStatusColor(activity.status)}`}
                      >
                        {activity.statusAr}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground mt-1">
                      <span>{activity.typeAr}</span>
                      <span>•</span>
                      <span>{activity.dateHijri}</span>
                      {activity.amount && (
                        <>
                          <span>•</span>
                          <span>{activity.amount.toLocaleString()} ر.س</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Insights and Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>رؤى السوق والتنبيهات</CardTitle>
            <CardDescription>معلومات مهمة حول السوق العقاري</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 space-x-reverse p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    فرص استثمارية جديدة
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {stats.availableProperties} عقار متاح للشراء في المنطقة
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    معاينات مجدولة
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {stats.scheduledInspections} معاينات مجدولة هذا الأسبوع
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    طلبات تحتاج مراجعة
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    {stats.pendingRequests} طلب شراء يحتاج للمراجعة
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse p-3 bg-purple-50 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    تفاوضات جارية
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    {stats.underNegotiation} عقارات قيد التفاوض
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الاستثمارات</CardTitle>
          <CardDescription>إحصائيات الاستثمار العقاري</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(stats.totalInvestment / 1000000).toFixed(1)}م
              </div>
              <div className="text-sm text-blue-700">
                إجمالي الاستثمارات (ر.س)
              </div>
              <div className="text-xs text-blue-600 mt-1">
                متوسط الاستثمار:{" "}
                {(
                  stats.totalInvestment /
                  stats.completedPurchases /
                  1000
                ).toFixed(0)}
                ك ر.س
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.completedPurchases}
              </div>
              <div className="text-sm text-green-700">عمليات شراء مكتملة</div>
              <div className="text-xs text-green-600 mt-1">
                معدل النجاح:{" "}
                {(
                  (stats.completedPurchases / stats.totalRequests) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats.activeContracts}
              </div>
              <div className="text-sm text-orange-700">عقود نشطة</div>
              <div className="text-xs text-orange-600 mt-1">
                قيد التنفيذ:{" "}
                {((stats.activeContracts / stats.totalRequests) * 100).toFixed(
                  1,
                )}
                %
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
