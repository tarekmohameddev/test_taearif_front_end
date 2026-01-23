"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  Download,
  RefreshCw,
  Search,
  Settings,
  FileText,
  Home,
  DollarSign,
  Clock,
  Users,
  Trophy,
  Map,
  CarIcon as ChartIcon,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Mail,
  Clock3,
  MessageSquare,
  Building2,
  HandCoins,
} from "lucide-react";


// Placeholder data - replace with your actual data fetching logic
const employeeData = [
  {
    name: "أحمد محمد",
    role: "وسيط عقاري",
    properties: 15,
    sales: 23,
    revenue: 1200000,
    commission: 60000,
    rating: 4.5,
    performance: 85,
  },
  {
    name: "فاطمة علي",
    role: "وسيط عقاري",
    properties: 12,
    sales: 18,
    revenue: 950000,
    commission: 47500,
    rating: 4.7,
    performance: 80,
  },
  {
    name: "محمود السيد",
    role: "وسيط عقاري",
    properties: 20,
    sales: 31,
    revenue: 1800000,
    commission: 90000,
    rating: 4.8,
    performance: 92,
  },
  {
    name: "سارة خالد",
    role: "مسؤولة تسويق",
    properties: 5,
    sales: 12,
    revenue: 600000,
    commission: 30000,
    rating: 4.2,
    performance: 75,
  },
  {
    name: "علي أحمد",
    role: "مدير مبيعات",
    properties: 18,
    sales: 15,
    revenue: 1100000,
    commission: 55000,
    rating: 4.6,
    performance: 88,
  },
];

const comparisonData = {
  month: [
    { period: "يناير", current: 420000, previous: 380000, target: 400000 },
    { period: "فبراير", current: 380000, previous: 350000, target: 370000 },
    { period: "مارس", current: 520000, previous: 480000, target: 500000 },
    { period: "أبريل", current: 590000, previous: 550000, target: 580000 },
    { period: "مايو", current: 690000, previous: 650000, target: 670000 },
    { period: "يونيو", current: 820000, previous: 780000, target: 800000 },
  ],
};

const geoDistributionData = [
  {
    city: "الرياض",
    properties: 245,
    revenue: 450000,
    agents: 45,
    status: "نشط",
  },
  { city: "جدة", properties: 156, revenue: 280000, agents: 28, status: "نشط" },
  {
    city: "الدمام",
    properties: 89,
    revenue: 160000,
    agents: 16,
    status: "نشط",
  },
  { city: "المدينة", properties: 34, revenue: 62000, agents: 8, status: "نشط" },
  { city: "مكة", properties: 23, revenue: 42000, agents: 5, status: "نشط" },
];

const propertyDistributionByArea = [
  {
    area: "الروضة",
    city: "الرياض",
    rentalProperties: 28,
    saleProperties: 17,
    rentalValue: 84000000,
    saleValue: 141000000,
    availableRentals: 8,
    availableSales: 4,
  },
  {
    area: "السليمانية",
    city: "جدة",
    rentalProperties: 22,
    saleProperties: 16,
    rentalValue: 66000000,
    saleValue: 124000000,
    availableRentals: 5,
    availableSales: 3,
  },
  {
    area: "الخليج",
    city: "الدمام",
    rentalProperties: 15,
    saleProperties: 11,
    rentalValue: 45000000,
    saleValue: 85000000,
    availableRentals: 3,
    availableSales: 2,
  },
  {
    area: "العزيزية",
    city: "الرياض",
    rentalProperties: 19,
    saleProperties: 13,
    rentalValue: 57000000,
    saleValue: 103000000,
    availableRentals: 6,
    availableSales: 4,
  },
  {
    area: "الشرفية",
    city: "جدة",
    rentalProperties: 16,
    saleProperties: 12,
    rentalValue: 48000000,
    saleValue: 92000000,
    availableRentals: 4,
    availableSales: 3,
  },
  {
    area: "النخيل",
    city: "الرياض",
    rentalProperties: 21,
    saleProperties: 14,
    rentalValue: 63000000,
    saleValue: 112000000,
    availableRentals: 5,
    availableSales: 4,
  },
  {
    area: "الراقي",
    city: "الدمام",
    rentalProperties: 11,
    saleProperties: 7,
    rentalValue: 33000000,
    saleValue: 57000000,
    availableRentals: 2,
    availableSales: 1,
  },
  {
    area: "القرية",
    city: "المدينة",
    rentalProperties: 12,
    saleProperties: 8,
    rentalValue: 36000000,
    saleValue: 64000000,
    availableRentals: 4,
    availableSales: 2,
  },
];

const performanceAlerts = [
  {
    metric: "معدل التحويل",
    value: 68,
    threshold: 75,
    status: "warning",
    message: "أقل من الهدف المطلوب",
  },
  {
    metric: "رضا العملاء",
    value: 92,
    threshold: 90,
    status: "good",
    message: "يتجاوز الهدف",
  },
  {
    metric: "وقت الإغلاق",
    value: 14,
    threshold: 10,
    status: "warning",
    message: "أكثر من المتوقع",
  },
  {
    metric: "نسبة الإلغاء",
    value: 12,
    threshold: 15,
    status: "good",
    message: "في الحدود المقبولة",
  },
];

const scheduledReports = [
  {
    name: "تقرير المبيعات الأسبوعي",
    frequency: "أسبوعي",
    email: "manager@realestate.com",
    nextDate: "2025-01-15",
  },
  {
    name: "تقرير الموظفين الشهري",
    frequency: "شهري",
    email: "hr@realestate.com",
    nextDate: "2025-02-01",
  },
  {
    name: "تقرير الأداء المالي",
    frequency: "يومي",
    email: "finance@realestate.com",
    nextDate: "2025-01-14",
  },
];

const propertyDetails = [
  {
    id: 1,
    address: "حي الروضة - الرياض",
    type: "شقة",
    price: 450000,
    agent: "أحمد محمد",
    status: "مباعة",
  },
  {
    id: 2,
    address: "حي السليمانية - جدة",
    type: "فيلا",
    price: 850000,
    agent: "فاطمة علي",
    status: "معروضة",
  },
  {
    id: 3,
    address: "حي الخليج - الدمام",
    type: "شقة",
    price: 320000,
    agent: "محمود السيد",
    status: "مباعة",
  },
];

const monthlyRevenueData = [
  { month: "يناير", revenue: 420000, expenses: 240000 },
  { month: "فبراير", revenue: 380000, expenses: 220000 },
  { month: "مارس", revenue: 520000, expenses: 290000 },
  { month: "أبريل", revenue: 590000, expenses: 300000 },
  { month: "مايو", revenue: 690000, expenses: 350000 },
  { month: "يونيو", revenue: 820000, expenses: 400000 },
];

const propertyTypeData = [
  { name: "شقق - إيجار", value: 145, color: "#3b82f6", worth: 435000000 },
  { name: "شقق - بيع", value: 100, color: "#60a5fa", worth: 380000000 },
  { name: "فلل - إيجار", value: 68, color: "#10b981", worth: 272000000 },
  { name: "فلل - بيع", value: 60, color: "#34d399", worth: 450000000 },
  { name: "محلات - إيجار", value: 54, color: "#f59e0b", worth: 162000000 },
  { name: "محلات - بيع", value: 35, color: "#fbbf24", worth: 140000000 },
  { name: "أراضي - بيع", value: 56, color: "#8b5cf6", worth: 560000000 },
];

const reservationStatusData = [
  { name: "مقبولة", value: 156, color: "#10b981" },
  { name: "قيد الانتظار", value: 89, color: "#f59e0b" },
  { name: "مرفوضة", value: 34, color: "#ef4444" },
];

const employeePerformanceData = [
  { name: "أحمد محمد", sales: 23, conversions: 18 },
  { name: "فاطمة علي", sales: 18, conversions: 14 },
  { name: "محمود السيد", sales: 31, conversions: 26 },
  { name: "سارة خالد", sales: 12, conversions: 9 },
  { name: "علي أحمد", sales: 15, conversions: 11 },
];

const keyMetrics = [
  {
    title: "إجمالي الموظفين",
    value: "145",
    change: "+12%",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    description: "نشط و غير نشط",
  },
  {
    title: "العقارات المدرجة",
    value: "512",
    change: "+23%",
    icon: Home,
    color: "bg-green-100 text-green-600",
    description: "جميع الأنواع",
  },
  {
    title: "الإيرادات الشهرية",
    value: "820,000 ر.س",
    change: "+18%",
    icon: DollarSign,
    color: "bg-amber-100 text-amber-600",
    description: "الشهر الحالي",
  },
  {
    title: "متوسط وقت الإغلاق",
    value: "14 يوم",
    change: "-3 أيام",
    icon: Clock,
    color: "bg-purple-100 text-purple-600",
    description: "أسرع من المتوسط",
  },
];

const availableReports = [
  { id: "overview", name: "نظرة عامة", icon: ChartIcon },
  { id: "employees", name: "الموظفين", icon: Users },
  { id: "properties", name: "العقارات", icon: Home },
  { id: "financial", name: "مالي", icon: DollarSign },
  { id: "geo", name: "الجغرافية", icon: Map },
  { id: "performance", name: "الأداء", icon: Trophy },
];

const handleExportPDF = () => {
  console.log("[v0] Exporting reports to PDF");
  // PDF export logic would go here
};

const handleExportExcel = () => {
  console.log("[v0] Exporting reports to Excel");
  // Excel export logic would go here
};

export function PlatformReportsPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState("month");
  const [selectedReports, setSelectedReports] = useState([
    "overview",
    "employees",
    "properties",
    "financial",
    "geo",
    "performance",
  ]);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchEmployee, setSearchEmployee] = useState("");

  const handleRefreshData = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const filteredEmployees = employeeData.filter((emp) =>
    emp.name.toLowerCase().includes(searchEmployee.toLowerCase()),
  );

  const totalPropertyWorth = propertyTypeData.reduce(
    (sum, prop) => sum + prop.worth,
    0,
  );
  const rentalPortfolioWorth = propertyTypeData
    .filter((p) => p.name.includes("إيجار"))
    .reduce((sum, p) => sum + p.worth, 0);
  const salePortfolioWorth = propertyTypeData
    .filter((p) => p.name.includes("بيع") || p.name.includes("أراضي"))
    .reduce((sum, p) => sum + p.worth, 0);

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 overflow-auto">
          <div className="space-y-6 p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Header with controls */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    تقارير المنصة
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    عرض شامل لجميع البيانات والإحصائيات
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshData}
                    disabled={refreshing}
                    className="gap-2 bg-transparent"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                    />
                    {refreshing ? "جاري التحديث..." : "تحديث"}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-transparent"
                      >
                        <Download className="h-4 w-4" />
                        تصدير
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تصدير التقارير</DialogTitle>
                        <DialogDescription>
                          اختر صيغة التصدير المطلوبة
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleExportPDF}
                          className="flex-1 gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          PDF
                        </Button>
                        <Button
                          onClick={handleExportExcel}
                          className="flex-1 gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Excel
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Date Range and Report Builder Controls */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">هذا الأسبوع</SelectItem>
                      <SelectItem value="month">هذا الشهر</SelectItem>
                      <SelectItem value="quarter">الربع الحالي</SelectItem>
                      <SelectItem value="year">هذه السنة</SelectItem>
                      <SelectItem value="custom">نطاق مخصص</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto gap-2 bg-transparent"
                      >
                        <Settings className="h-4 w-4" />
                        تخصيص التقارير
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تخصيص التقارير</DialogTitle>
                        <DialogDescription>
                          اختر التقارير التي تريد عرضها
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        {availableReports.map((report) => (
                          <label
                            key={report.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedReports.includes(report.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedReports([
                                    ...selectedReports,
                                    report.id,
                                  ]);
                                } else {
                                  setSelectedReports(
                                    selectedReports.filter(
                                      (r) => r !== report.id,
                                    ),
                                  );
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{report.name}</span>
                          </label>
                        ))}
                      </div>
                      <Button onClick={() => {}} className="w-full">
                        حفظ التفضيلات
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
              {keyMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                            {metric.title}
                          </p>
                          <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-xl sm:text-2xl font-bold truncate">
                              {metric.value}
                            </p>
                            <span className="text-xs font-semibold text-green-600 shrink-0">
                              {metric.change}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {metric.description}
                          </p>
                        </div>
                        <div
                          className={`${metric.color} p-2 sm:p-3 rounded-lg shrink-0`}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              <Card className="overflow-hidden border-t-4 border-t-blue-500">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        إجمالي قيمة العقارات
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold mt-2">
                        {(totalPropertyWorth / 1000000).toFixed(0)}م ر.س
                      </p>
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> +8.5% من الربع السابق
                      </p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg shrink-0">
                      <Building2 className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-t-4 border-t-green-500">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        قيمة محفظة الإيجارات
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold mt-2">
                        {(rentalPortfolioWorth / 1000000).toFixed(0)}م ر.س
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {propertyTypeData
                          .filter((p) => p.name.includes("إيجار"))
                          .reduce((sum, p) => sum + p.value, 0)}{" "}
                        عقار للإيجار
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-600 p-3 rounded-lg shrink-0">
                      <Home className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-t-4 border-t-amber-500">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        قيمة محفظة البيع
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold mt-2">
                        {(salePortfolioWorth / 1000000).toFixed(0)}م ر.س
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {propertyTypeData
                          .filter(
                            (p) =>
                              p.name.includes("بيع") ||
                              p.name.includes("أراضي"),
                          )
                          .reduce((sum, p) => sum + p.value, 0)}{" "}
                        عقار للبيع
                      </p>
                    </div>
                    <div className="bg-amber-100 text-amber-600 p-3 rounded-lg shrink-0">
                      <HandCoins className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Analytics */}
            {selectedReports.includes("overview") && (
              <Card>
                <CardHeader>
                  <CardTitle>مقارنة الأداء</CardTitle>
                  <CardDescription>
                    مقارنة الإيرادات مع الفترة السابقة والأهداف
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={comparisonData.month}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="current"
                        stroke="#3b82f6"
                        name="الفترة الحالية"
                      />
                      <Line
                        type="monotone"
                        dataKey="previous"
                        stroke="#10b981"
                        name="الفترة السابقة"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#f59e0b"
                        name="الهدف"
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Alerts & Thresholds */}
            {selectedReports.includes("performance") && (
              <Card>
                <CardHeader>
                  <CardTitle>تنبيهات الأداء</CardTitle>
                  <CardDescription>
                    المقاييس التي تتطلب انتباهاً
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {performanceAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {alert.status === "warning" ? (
                          <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm">{alert.metric}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge
                          variant={
                            alert.status === "warning"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {alert.value}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tabs for different reports */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 overflow-x-auto">
                {selectedReports.includes("overview") && (
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                )}
                {selectedReports.includes("employees") && (
                  <TabsTrigger value="employees">الموظفين</TabsTrigger>
                )}
                {selectedReports.includes("properties") && (
                  <TabsTrigger value="properties">العقارات</TabsTrigger>
                )}
                {selectedReports.includes("financial") && (
                  <TabsTrigger value="financial">مالي</TabsTrigger>
                )}
                {selectedReports.includes("geo") && (
                  <TabsTrigger value="geo">الجغرافية</TabsTrigger>
                )}
                {selectedReports.includes("performance") && (
                  <TabsTrigger value="performance">الأداء</TabsTrigger>
                )}
              </TabsList>

              {/* Overview Tab - with Comparison */}
              {selectedReports.includes("overview") && (
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Monthly Revenue */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm sm:text-base">
                          الإيرادات الشهرية
                        </CardTitle>
                        <CardDescription className="text-xs">
                          مقارنة الإيرادات والنفقات
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={monthlyRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="revenue"
                              fill="#3b82f6"
                              name="الإيرادات"
                            />
                            <Bar
                              dataKey="expenses"
                              fill="#ef4444"
                              name="النفقات"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm sm:text-base">
                          توزيع العقارات حسب النوع والقيمة
                        </CardTitle>
                        <CardDescription className="text-xs">
                          الإيجار مقابل البيع
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={propertyTypeData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{ fontSize: 11 }} />
                            <YAxis
                              dataKey="name"
                              type="category"
                              width={100}
                              tick={{ fontSize: 10 }}
                            />
                            <Tooltip
                              formatter={(value: number, name: string) => {
                                if (name === "القيمة")
                                  return `${(value / 1000000).toFixed(1)}م ر.س`;
                                return value;
                              }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" name="العدد" />
                            <Bar dataKey="worth" fill="#10b981" name="القيمة" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}

              {/* Employees Tab - with detailed analytics and leaderboard */}
              {selectedReports.includes("employees") && (
                <TabsContent value="employees" className="space-y-4">
                  {/* Search and filter for employees */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="ابحث عن موظف..."
                        value={searchEmployee}
                        onChange={(e) => setSearchEmployee(e.target.value)}
                        className="pr-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Top Performers Leaderboard */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        أفضل الموظفين أداءً
                      </CardTitle>
                      <CardDescription className="text-xs">
                        تصنيف الموظفين حسب الأداء
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {employeeData
                        .sort((a, b) => b.performance - a.performance)
                        .slice(0, 5)
                        .map((emp, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-sm">
                                  {emp.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {emp.sales} مبيعات
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {emp.performance}%
                            </Badge>
                          </div>
                        ))}
                    </CardContent>
                  </Card>

                  {/* Employee Performance Comparison */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">
                        مقارنة أداء الموظفين
                      </CardTitle>
                      <CardDescription className="text-xs">
                        المبيعات مقابل التحويلات
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={employeePerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="sales" fill="#3b82f6" name="المبيعات" />
                          <Bar
                            dataKey="conversions"
                            fill="#10b981"
                            name="التحويلات"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Detailed Employee Table with search filtering and commission tracking */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">
                        بيانات الموظفين المفصلة
                      </CardTitle>
                      <CardDescription className="text-xs">
                        معلومات مفصلة عن جميع الموظفين والوسطاء
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead className="border-b bg-muted/50">
                          <tr>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              الاسم
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              الدور
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold hidden sm:table-cell">
                              العقارات
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold hidden md:table-cell">
                              المبيعات
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              الإيرادات
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold hidden lg:table-cell">
                              عمولة
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold hidden lg:table-cell">
                              تقييم
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredEmployees.map((emp, idx) => (
                            <tr key={idx} className="hover:bg-muted/50">
                              <td className="px-2 sm:px-4 py-3 font-medium text-xs sm:text-sm">
                                {emp.name}
                              </td>
                              <td className="px-2 sm:px-4 py-3">
                                <Badge variant="outline" className="text-xs">
                                  {emp.role}
                                </Badge>
                              </td>
                              <td className="px-2 sm:px-4 py-3 hidden sm:table-cell text-xs">
                                {emp.properties}
                              </td>
                              <td className="px-2 sm:px-4 py-3 hidden md:table-cell text-xs">
                                {emp.sales}
                              </td>
                              <td className="px-2 sm:px-4 py-3 font-semibold text-xs">
                                {(emp.revenue / 1000).toFixed(0)}ك
                              </td>
                              <td className="px-2 sm:px-4 py-3 hidden lg:table-cell text-xs">
                                {(emp.commission / 1000).toFixed(1)}ك ر.س
                              </td>
                              <td className="px-2 sm:px-4 py-3 hidden lg:table-cell">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs">{emp.rating}</span>
                                  <span className="text-yellow-500">★</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>

                  {/* Commission and Payment Tracking */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">
                        تتبع العمولات
                      </CardTitle>
                      <CardDescription className="text-xs">
                        معلومات العمولات والمدفوعات
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {filteredEmployees.map((emp, idx) => (
                        <div
                          key={idx}
                          className="p-3 border rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {emp.name}
                            </span>
                            <Badge className="text-xs">
                              {emp.commission.toLocaleString()} ر.س
                            </Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-full"
                              style={{
                                width: `${(emp.commission / 12000) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Geographic Distribution Tab */}
              {selectedReports.includes("geo") && (
                <TabsContent value="geo" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <Map className="h-4 w-4" />
                        التوزيع الجغرافي
                      </CardTitle>
                      <CardDescription className="text-xs">
                        توزيع العقارات والموظفين حسب المدينة
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead className="border-b bg-muted/50">
                          <tr>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              المدينة
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              العقارات
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              الموظفين
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              الإيرادات
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              الحالة
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {geoDistributionData.map((geo, idx) => (
                            <tr key={idx} className="hover:bg-muted/50">
                              <td className="px-2 sm:px-4 py-3 font-medium text-xs sm:text-sm">
                                {geo.city}
                              </td>
                              <td className="px-2 sm:px-4 py-3 text-xs">
                                {geo.properties}
                              </td>
                              <td className="px-2 sm:px-4 py-3 text-xs">
                                {geo.agents}
                              </td>
                              <td className="px-2 sm:px-4 py-3 font-semibold text-xs">
                                {(geo.revenue / 1000).toFixed(0)}ك
                              </td>
                              <td className="px-2 sm:px-4 py-3">
                                <Badge variant="outline" className="text-xs">
                                  {geo.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">
                        توزيع العقارات حسب المنطقة
                      </CardTitle>
                      <CardDescription className="text-xs">
                        معلومات مفصلة عن العقارات للإيجار والبيع في كل منطقة
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Distribution Chart - Rental vs Sale Values */}
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={propertyDistributionByArea}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="area"
                            tick={{ fontSize: 11 }}
                            angle={-15}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            formatter={(value: number) =>
                              `${(Number(value) / 1000000).toFixed(1)}م ر.س`
                            }
                            labelStyle={{ fontSize: 12 }}
                          />
                          <Legend />
                          <Bar
                            dataKey="rentalValue"
                            fill="#10b981"
                            name="قيمة عقارات الإيجار"
                          />
                          <Bar
                            dataKey="saleValue"
                            fill="#3b82f6"
                            name="قيمة عقارات البيع"
                          />
                        </BarChart>
                      </ResponsiveContainer>

                      {/* Detailed Area Table with Rental and Sale breakdown */}
                      <div className="border-t pt-4">
                        <h3 className="text-xs sm:text-sm font-semibold mb-3">
                          تفاصيل المناطق - الإيجار والبيع
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs sm:text-sm">
                            <thead className="border-b bg-muted/50">
                              <tr>
                                <th className="px-2 sm:px-3 py-2 text-right font-semibold">
                                  المنطقة
                                </th>
                                <th className="px-2 sm:px-3 py-2 text-right font-semibold hidden lg:table-cell">
                                  المدينة
                                </th>
                                <th className="px-2 sm:px-3 py-2 text-right font-semibold">
                                  إيجار
                                </th>
                                <th className="px-2 sm:px-3 py-2 text-right font-semibold">
                                  بيع
                                </th>
                                <th className="px-2 sm:px-3 py-2 text-right font-semibold hidden md:table-cell">
                                  قيمة الإيجار
                                </th>
                                <th className="px-2 sm:px-3 py-2 text-right font-semibold hidden md:table-cell">
                                  قيمة البيع
                                </th>
                                <th className="px-2 sm:px-3 py-2 text-right font-semibold">
                                  متاحة
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {propertyDistributionByArea.map((area, idx) => (
                                <tr key={idx} className="hover:bg-muted/50">
                                  <td className="px-2 sm:px-3 py-2 font-medium text-xs">
                                    {area.area}
                                  </td>
                                  <td className="px-2 sm:px-3 py-2 hidden lg:table-cell">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {area.city}
                                    </Badge>
                                  </td>
                                  <td className="px-2 sm:px-3 py-2 text-xs">
                                    {area.rentalProperties}
                                  </td>
                                  <td className="px-2 sm:px-3 py-2 text-xs">
                                    {area.saleProperties}
                                  </td>
                                  <td className="px-2 sm:px-3 py-2 hidden md:table-cell text-xs font-semibold text-green-600">
                                    {(area.rentalValue / 1000000).toFixed(1)}م
                                  </td>
                                  <td className="px-2 sm:px-3 py-2 hidden md:table-cell text-xs font-semibold text-blue-600">
                                    {(area.saleValue / 1000000).toFixed(1)}م
                                  </td>
                                  <td className="px-2 sm:px-3 py-2">
                                    <div className="flex gap-1">
                                      <Badge className="text-xs bg-green-100 text-green-800">
                                        {area.availableRentals}إ
                                      </Badge>
                                      <Badge className="text-xs bg-blue-100 text-blue-800">
                                        {area.availableSales}ب
                                      </Badge>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Top Areas by Total Value */}
                      <div className="border-t pt-4">
                        <h3 className="text-xs sm:text-sm font-semibold mb-3">
                          أفضل المناطق حسب القيمة الإجمالية
                        </h3>
                        <div className="grid gap-2 md:grid-cols-2">
                          {propertyDistributionByArea
                            .map((area) => ({
                              ...area,
                              totalValue: area.rentalValue + area.saleValue,
                            }))
                            .sort((a, b) => b.totalValue - a.totalValue)
                            .slice(0, 6)
                            .map((area, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-gradient-to-l from-blue-50 to-transparent rounded-lg border"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-xs">
                                    {area.area}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {area.city}
                                  </p>
                                  <div className="flex gap-2 mt-1">
                                    <span className="text-xs text-green-600">
                                      إيجار:{" "}
                                      {(area.rentalValue / 1000000).toFixed(1)}م
                                    </span>
                                    <span className="text-xs text-blue-600">
                                      بيع:{" "}
                                      {(area.saleValue / 1000000).toFixed(1)}م
                                    </span>
                                  </div>
                                </div>
                                <span className="font-bold text-sm shrink-0">
                                  {(area.totalValue / 1000000).toFixed(1)}م ر.س
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Properties Tab with drill-down */}
              {selectedReports.includes("properties") && (
                <TabsContent value="properties" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm sm:text-base">
                          حالة العقارات
                        </CardTitle>
                        <CardDescription className="text-xs">
                          توزيع الحجوزات
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={reservationStatusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {reservationStatusData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm sm:text-base">
                          إحصائيات العقارات
                        </CardTitle>
                        <CardDescription className="text-xs">
                          معلومات مفصلة
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-xs sm:text-sm">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-muted-foreground">
                            إجمالي العقارات
                          </span>
                          <span className="font-semibold">518</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-muted-foreground">
                            العقارات المتاحة
                          </span>
                          <span className="font-semibold">234</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-muted-foreground">
                            العقارات المحجوزة
                          </span>
                          <span className="font-semibold">178</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-muted-foreground">
                            العقارات المباعة
                          </span>
                          <span className="font-semibold">106</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-muted-foreground">
                            متوسط السعر
                          </span>
                          <span className="font-semibold">450ك ر.س</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Property Details Drill-down Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">
                        تفاصيل العقارات
                      </CardTitle>
                      <CardDescription className="text-xs">
                        معلومات مفصلة عن كل عقار
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead className="border-b bg-muted/50">
                          <tr>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              العنوان
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              النوع
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold hidden sm:table-cell">
                              السعر
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold hidden md:table-cell">
                              الوسيط
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold">
                              الحالة
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {propertyDetails.map((prop, idx) => (
                            <tr key={idx} className="hover:bg-muted/50">
                              <td className="px-2 sm:px-4 py-3 font-medium text-xs truncate">
                                {prop.address}
                              </td>
                              <td className="px-2 sm:px-4 py-3 text-xs">
                                <Badge variant="outline" className="text-xs">
                                  {prop.type}
                                </Badge>
                              </td>
                              <td className="px-2 sm:px-4 py-3 hidden sm:table-cell text-xs">
                                {(prop.price / 1000).toFixed(0)}ك
                              </td>
                              <td className="px-2 sm:px-4 py-3 hidden md:table-cell text-xs">
                                {prop.agent}
                              </td>
                              <td className="px-2 sm:px-4 py-3">
                                <Badge variant="secondary" className="text-xs">
                                  {prop.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Financial Tab */}
              {selectedReports.includes("financial") && (
                <TabsContent value="financial" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">
                        الأداء المالي
                      </CardTitle>
                      <CardDescription className="text-xs">
                        الإيرادات والتوقعات
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyRevenueData}>
                          <defs>
                            <linearGradient
                              id="colorRevenue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            name="الإيرادات"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Financial Summary */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium">
                          إجمالي الإيرادات
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                          3,820ك ر.س
                        </div>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> +12% من الشهر
                          الماضي
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium">
                          إجمالي النفقات
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                          1,650ك ر.س
                        </div>
                        <p className="text-xs text-red-600 mt-1">
                          -8% من الشهر الماضي
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium">
                          الربح الإجمالي
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                          2,170ك ر.س
                        </div>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> +15% هامش الربح
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Report Scheduling */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        جدولة التقارير
                      </CardTitle>
                      <CardDescription className="text-xs">
                        إرسال التقارير تلقائياً بالبريد الإلكتروني
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {scheduledReports.map((report, idx) => (
                        <div
                          key={idx}
                          className="p-3 border rounded-lg space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm">
                                {report.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {report.email}
                              </p>
                            </div>
                            <Badge className="text-xs shrink-0">
                              {report.frequency}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock3 className="h-3 w-3" />
                            {report.nextDate}
                          </p>
                        </div>
                      ))}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full text-xs">
                            <Mail className="h-3 w-3 ml-1" />
                            جدولة تقرير جديد
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-sm">
                              جدولة تقرير جديد
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium">
                                اسم التقرير
                              </label>
                              <Input
                                placeholder="مثال: تقرير المبيعات"
                                className="mt-1 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium">
                                البريد الإلكتروني
                              </label>
                              <Input
                                type="email"
                                placeholder="example@email.com"
                                className="mt-1 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium">
                                التكرار
                              </label>
                              <Select>
                                <SelectTrigger className="mt-1 text-xs">
                                  <SelectValue placeholder="اختر التكرار" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="daily">يومي</SelectItem>
                                  <SelectItem value="weekly">أسبوعي</SelectItem>
                                  <SelectItem value="monthly">شهري</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button size="sm" className="w-full text-xs">
                              حفظ جدولة التقرير
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Performance Tab with KPIs */}
              {selectedReports.includes("performance") && (
                <TabsContent value="performance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">
                        مؤشرات الأداء الرئيسية
                      </CardTitle>
                      <CardDescription className="text-xs">
                        قياس أداء المنصة الشاملة
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div className="space-y-3 sm:space-y-4">
                        {[
                          {
                            label: "معدل التحويل",
                            value: 68,
                            max: 100,
                            icon: CheckCircle2,
                            color: "text-green-600",
                          },
                          {
                            label: "رضا العملاء",
                            value: 92,
                            max: 100,
                            icon: CheckCircle2,
                            color: "text-green-600",
                          },
                          {
                            label: "نسبة الإكمال",
                            value: 85,
                            max: 100,
                            icon: CheckCircle2,
                            color: "text-green-600",
                          },
                          {
                            label: "معدل الإلغاء",
                            value: 12,
                            max: 100,
                            icon: AlertCircle,
                            color: "text-orange-600",
                          },
                        ].map((kpi, idx) => {
                          const Icon = kpi.icon;
                          const percentage = (kpi.value / kpi.max) * 100;
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Icon
                                    className={`h-4 w-4 ${kpi.color} shrink-0`}
                                  />
                                  <span className="text-xs sm:text-sm font-medium truncate">
                                    {kpi.label}
                                  </span>
                                </div>
                                <span className="font-semibold text-xs sm:text-sm shrink-0">
                                  {kpi.value}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline/History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        سجل التغييرات
                      </CardTitle>
                      <CardDescription className="text-xs">
                        أحدث التحديثات والتغييرات
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        {
                          action: "تم قبول حجز جديد",
                          time: "2025-01-13 14:30",
                          user: "أحمد محمد",
                        },
                        {
                          action: "تم إضافة موظف جديد",
                          time: "2025-01-13 10:15",
                          user: "الإدارة",
                        },
                        {
                          action: "تم إغلاق عقار",
                          time: "2025-01-12 16:45",
                          user: "فاطمة علي",
                        },
                        {
                          action: "تم تحديث الإيرادات",
                          time: "2025-01-12 08:00",
                          user: "النظام",
                        },
                      ].map((log, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 py-2 border-l-2 border-blue-500 pl-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium">
                              {log.action}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              بواسطة: {log.user}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {log.time}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Message History Tab */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        الرسائل والملاحظات
                      </CardTitle>
                      <CardDescription className="text-xs">
                        آخر 10 رسائل
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        {
                          from: "محمود السيد",
                          message: "تم إغلاق صفقة جديدة بقيمة 2 مليون",
                          time: "2025-01-13",
                        },
                        {
                          from: "فاطمة علي",
                          message: "تم توقيع عقد مع عميل جديد",
                          time: "2025-01-12",
                        },
                        {
                          from: "أحمد محمد",
                          message: "تم استقبال طلب عرض أسعار",
                          time: "2025-01-12",
                        },
                      ].map((msg, idx) => (
                        <div key={idx} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm">
                                {msg.from}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 break-words">
                                {msg.message}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
    </div>
  );
}
