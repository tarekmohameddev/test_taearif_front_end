"use client";
import { useEffect } from "react";
import useStore from "@/context/Store"; // استيراد useStore
import {
  ArrowRight,
  FileText,
  Globe,
  LayoutGrid,
  Settings,
  Building,
  Home,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VisitorChart from "@/components/homepage/VisitorChart";
import MostVisitedPagesTable from "@/components/homepage/MostVisitedPagesTable";
import RecentActivity from "@/components/homepage/recent-activity";
import SetupProgressCard from "@/components/homepage/SetupProgressCard";
import useAuthStore from "@/context/AuthContext";

export function WelcomeDashboard() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const {
    homepage: {
      dashboardDevice,
      isDashboardDeviceUpdated,
      fetchDashboardDevice,
      dashboardSummary,
      isDashboardSummaryUpdated,
      fetchDashboardSummary,
      trafficSources,
      isTrafficSourcesUpdated,
      fetchTrafficSources,
    },
    loading,
  } = useStore();

  // جلب البيانات إذا لم تكن قد تم جلبها بعد
  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    if (!isDashboardDeviceUpdated) {
      fetchDashboardDevice();
    }
    if (!isDashboardSummaryUpdated) {
      fetchDashboardSummary();
    }
    if (!isTrafficSourcesUpdated) {
      fetchTrafficSources();
    }
  }, [
    userData?.token,
    authLoading,
    isDashboardDeviceUpdated,
    isDashboardSummaryUpdated,
    isTrafficSourcesUpdated,
    fetchDashboardDevice,
    fetchDashboardSummary,
    fetchTrafficSources,
  ]);

  // تحويل بيانات العقارات إلى التنسيق المطلوب للرسم البياني
  const propertyChartData =
    dashboardSummary?.properties?.properties_purposes?.map((item: any) => ({
      name:
        item.purpose === "rent"
          ? "للإيجار"
          : item.purpose === "sale"
            ? "للبيع"
            : item.purpose === "rented"
              ? "مؤجرة"
              : item.purpose === "sold"
                ? "مباعة"
                : item.purpose || "غير محدد",
      value: item.total || 0,
      color:
        item.purpose === "rent"
          ? "#10B981"
          : item.purpose === "sale"
            ? "#EF4444"
            : item.purpose === "rented"
              ? "#8B5CF6"
              : item.purpose === "sold"
                ? "#F59E0B"
                : "#3B82F6",
    })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          مرحباً بك في {userData?.username || "لوحة التحكم"}!
        </h1>
        <p className="text-muted-foreground">هذه نظرة عامة على موقعك وأدائه.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الزيارات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardSummary?.visits || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  (dashboardSummary?.visits_change || 0) > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {(dashboardSummary?.visits_change || 0) > 0 ? "↑" : "↓"}{" "}
                {Math.abs(dashboardSummary?.visits_change || 0)}%
              </span>{" "}
              من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              مشاهدات الصفحات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardSummary?.page_views || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  (dashboardSummary?.page_views_change || 0) > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {(dashboardSummary?.page_views_change || 0) > 0 ? "↑" : "↓"}{" "}
                {Math.abs(dashboardSummary?.page_views_change || 0)}%
              </span>{" "}
              من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">متوسط الوقت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardSummary?.average_time || "00:00"}
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  (dashboardSummary?.average_time_change || 0) > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {(dashboardSummary?.average_time_change || 0) > 0 ? "↑" : "↓"}{" "}
                {Math.abs(dashboardSummary?.average_time_change || 0)}%
              </span>{" "}
              من الشهر الماضي
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">معدل الارتداد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardSummary?.bounce_rate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  (dashboardSummary?.bounce_rate_change || 0) > 0
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {(dashboardSummary?.bounce_rate_change || 0) > 0 ? "↑" : "↓"}{" "}
                {Math.abs(dashboardSummary?.bounce_rate_change || 0).toFixed(2)}
                %
              </span>{" "}
              من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* إحصائيات العقارات */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي العقارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Building className="h-6 w-6 text-blue-600" />
              {dashboardSummary?.properties?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              إجمالي العقارات في الموقع
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">للإيجار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Home className="h-6 w-6 text-green-600" />
              {dashboardSummary?.properties?.properties_purposes?.find(
                (p: any) => p.purpose === "rent",
              )?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              عقارات متاحة للإيجار
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">للبيع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-red-600" />
              {dashboardSummary?.properties?.properties_purposes?.find(
                (p: any) => p.purpose === "sale",
              )?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">عقارات متاحة للبيع</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">مؤجرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-purple-600" />
              {dashboardSummary?.properties?.properties_purposes?.find(
                (p: any) => p.purpose?.toLowerCase() === "rented",
              )?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              عقارات تم تأجيرها بالفعل
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">مباعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-orange-600" />
              {dashboardSummary?.properties?.properties_purposes?.find(
                (p: any) => p.purpose?.toLowerCase() === "sold",
              )?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              عقارات تم بيعها بالفعل
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>نظرة عامة على الزيارات</CardTitle>
          </CardHeader>
          <CardContent>
            <VisitorChart />
          </CardContent>
        </Card>
        <SetupProgressCard />
      </div>

      <Tabs defaultValue="content" className="website-content">
        <TabsList>
          <TabsTrigger value="content">المحتوى</TabsTrigger>
          <TabsTrigger value="activity">النشاط الأخير</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Devices Chart */}
            <Card>
              <CardHeader>
                <CardTitle>الأجهزة</CardTitle>
                <CardDescription>توزيع الزيارات حسب نوع الجهاز</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardDevice}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {dashboardDevice?.map(
                          (
                            entry: { color: string | undefined },
                            index: any,
                          ) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="transparent"
                              strokeWidth={2}
                            />
                          ),
                        )}
                      </Pie>
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconType="circle"
                        iconSize={10}
                        formatter={(value, entry, index) => (
                          <span className="text-sm font-medium">{value}</span>
                        )}
                        wrapperStyle={{ paddingRight: 20 }}
                      />
                      <Tooltip
                        formatter={(value, name) => [`${value}%`, name]}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          padding: "8px 12px",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Properties Chart */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع العقارات</CardTitle>
                <CardDescription>توزيع العقارات حسب الغرض</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {propertyChartData?.map(
                          (
                            entry: { color: string | undefined },
                            index: any,
                          ) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="transparent"
                              strokeWidth={2}
                            />
                          ),
                        )}
                      </Pie>
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconType="circle"
                        iconSize={10}
                        formatter={(value, entry, index) => (
                          <span className="text-sm font-medium">{value}</span>
                        )}
                        wrapperStyle={{ paddingRight: 20 }}
                      />
                      <Tooltip
                        formatter={(value, name) => [`${value}`, name]}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          padding: "8px 12px",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <MostVisitedPagesTable />
        </TabsContent>
        <TabsContent value="activity">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
