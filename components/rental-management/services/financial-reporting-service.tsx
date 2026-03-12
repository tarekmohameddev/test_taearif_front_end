"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Target,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface FinancialData {
  revenue: {
    monthly: number;
    yearly: number;
    growth: number;
  };
  expenses: {
    monthly: number;
    yearly: number;
    breakdown: Array<{
      category: string;
      categoryAr: string;
      amount: number;
      percentage: number;
    }>;
  };
  occupancy: {
    rate: number;
    trend: number;
  };
  profitability: {
    netIncome: number;
    margin: number;
    roi: number;
  };
  monthlyData: Array<{
    month: string;
    monthAr: string;
    revenue: number;
    expenses: number;
    netIncome: number;
  }>;
  zakahInfo: {
    zakahDue: number;
    zakahRate: number;
    zakahableAssets: number;
  };
}

export function FinancialReportingService() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [selectedProperty, setSelectedProperty] = useState("all");
  const userData = useAuthStore(selectUserData);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchFinancialData");
      return;
    }

    // Simulate API call to financial reporting microservice
    const fetchFinancialData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFinancialData({
        revenue: {
          monthly: 2850000, // SAR
          yearly: 34200000, // SAR
          growth: 18.5,
        },
        expenses: {
          monthly: 1140000, // SAR
          yearly: 13680000, // SAR
          breakdown: [
            {
              category: "Maintenance",
              categoryAr: "الصيانة",
              amount: 380000,
              percentage: 33.3,
            },
            {
              category: "Property Management",
              categoryAr: "إدارة العقارات",
              amount: 285000,
              percentage: 25.0,
            },
            {
              category: "Insurance",
              categoryAr: "التأمين",
              amount: 228000,
              percentage: 20.0,
            },
            {
              category: "Utilities",
              categoryAr: "المرافق",
              amount: 171000,
              percentage: 15.0,
            },
            {
              category: "Marketing",
              categoryAr: "التسويق",
              amount: 76000,
              percentage: 6.7,
            },
          ],
        },
        occupancy: {
          rate: 82.5,
          trend: 3.2,
        },
        profitability: {
          netIncome: 1710000, // SAR
          margin: 60.0,
          roi: 12.8,
        },
        monthlyData: [
          {
            month: "Jan",
            monthAr: "محرم",
            revenue: 2650000,
            expenses: 1060000,
            netIncome: 1590000,
          },
          {
            month: "Feb",
            monthAr: "صفر",
            revenue: 2700000,
            expenses: 1080000,
            netIncome: 1620000,
          },
          {
            month: "Mar",
            monthAr: "ربيع الأول",
            revenue: 2750000,
            expenses: 1100000,
            netIncome: 1650000,
          },
          {
            month: "Apr",
            monthAr: "ربيع الثاني",
            revenue: 2800000,
            expenses: 1120000,
            netIncome: 1680000,
          },
          {
            month: "May",
            monthAr: "جمادى الأولى",
            revenue: 2820000,
            expenses: 1130000,
            netIncome: 1690000,
          },
          {
            month: "Jun",
            monthAr: "جمادى الثانية",
            revenue: 2850000,
            expenses: 1140000,
            netIncome: 1710000,
          },
          {
            month: "Jul",
            monthAr: "رجب",
            revenue: 2880000,
            expenses: 1150000,
            netIncome: 1730000,
          },
          {
            month: "Aug",
            monthAr: "شعبان",
            revenue: 2900000,
            expenses: 1160000,
            netIncome: 1740000,
          },
          {
            month: "Sep",
            monthAr: "رمضان",
            revenue: 2850000,
            expenses: 1140000,
            netIncome: 1710000,
          },
          {
            month: "Oct",
            monthAr: "شوال",
            revenue: 2920000,
            expenses: 1170000,
            netIncome: 1750000,
          },
          {
            month: "Nov",
            monthAr: "ذو القعدة",
            revenue: 2950000,
            expenses: 1180000,
            netIncome: 1770000,
          },
          {
            month: "Dec",
            monthAr: "ذو الحجة",
            revenue: 2980000,
            expenses: 1190000,
            netIncome: 1790000,
          },
        ],
        zakahInfo: {
          zakahDue: 855000, // 2.5% of zakahable assets
          zakahRate: 2.5,
          zakahableAssets: 34200000,
        },
      });
      setLoading(false);
    };

    fetchFinancialData();
  }, [selectedPeriod, selectedProperty, userData?.token]);

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!financialData) return null;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">التقارير المالية</h2>
          <p className="text-muted-foreground">
            التحليلات المالية والتقارير الشاملة
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المشاريع</SelectItem>
              <SelectItem value="al-noor">مجمع النور السكني</SelectItem>
              <SelectItem value="jeddah-towers">أبراج جدة</SelectItem>
              <SelectItem value="dammam-gardens">حدائق الدمام</SelectItem>
              <SelectItem value="makkah-heights">مرتفعات مكة</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 أشهر</SelectItem>
              <SelectItem value="6months">6 أشهر</SelectItem>
              <SelectItem value="12months">12 شهر</SelectItem>
              <SelectItem value="ytd">السنة الحالية</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الإيرادات الشهرية
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {financialData.revenue.monthly.toLocaleString()} ر.س
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 ml-1 text-green-500" />+
              {financialData.revenue.growth}% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              المصروفات الشهرية
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {financialData.expenses.monthly.toLocaleString()} ر.س
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (financialData.expenses.monthly /
                  financialData.revenue.monthly) *
                100
              ).toFixed(1)}
              % من الإيرادات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي الدخل</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {financialData.profitability.netIncome.toLocaleString()} ر.س
            </div>
            <p className="text-xs text-muted-foreground">
              هامش ربح {financialData.profitability.margin}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الإشغال</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {financialData.occupancy.rate}%
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 ml-1 text-green-500" />+
              {financialData.occupancy.trend}% من الشهر الماضي
            </p>
            <Progress value={financialData.occupancy.rate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Zakah Information Card */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">معلومات الزكاة</CardTitle>
          <CardDescription>حساب الزكاة المستحقة على الأصول</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {financialData.zakahInfo.zakahDue.toLocaleString()} ر.س
              </div>
              <p className="text-sm text-green-600">الزكاة المستحقة</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {financialData.zakahInfo.zakahRate}%
              </div>
              <p className="text-sm text-green-600">معدل الزكاة</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {(financialData.zakahInfo.zakahableAssets / 1000000).toFixed(1)}
                م ر.س
              </div>
              <p className="text-sm text-green-600">الأصول الخاضعة للزكاة</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reports */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="revenue">تحليل الإيرادات</TabsTrigger>
          <TabsTrigger value="expenses">تفصيل المصروفات</TabsTrigger>
          <TabsTrigger value="profitability">الربحية</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>الأداء الشهري</CardTitle>
                <CardDescription>
                  اتجاهات الإيرادات والمصروفات وصافي الدخل
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.monthlyData.slice(-6).map((data, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">
                        {data.monthAr}
                      </span>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm">
                        <span className="text-green-600">
                          {(data.revenue / 1000000).toFixed(1)}م
                        </span>
                        <span className="text-red-600">
                          {(data.expenses / 1000000).toFixed(1)}م
                        </span>
                        <span className="text-blue-600 font-medium">
                          {(data.netIncome / 1000000).toFixed(1)}م
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>مؤشرات الأداء الرئيسية</CardTitle>
                <CardDescription>المقاييس المالية المهمة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    العائد على الاستثمار
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {financialData.profitability.roi}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">هامش الربح</span>
                  <span className="text-lg font-bold text-blue-600">
                    {financialData.profitability.margin}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">الإيرادات السنوية</span>
                  <span className="text-lg font-bold">
                    {(financialData.revenue.yearly / 1000000).toFixed(1)} مليون
                    ر.س
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">المصروفات السنوية</span>
                  <span className="text-lg font-bold">
                    {(financialData.expenses.yearly / 1000000).toFixed(1)} مليون
                    ر.س
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تحليل الإيرادات</CardTitle>
              <CardDescription>
                تفصيل مصادر الإيرادات والاتجاهات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {financialData.revenue.monthly.toLocaleString()} ر.س
                    </div>
                    <p className="text-sm text-muted-foreground">
                      الإيرادات الشهرية
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {(financialData.revenue.yearly / 1000000).toFixed(1)}{" "}
                      مليون ر.س
                    </div>
                    <p className="text-sm text-muted-foreground">
                      الإيرادات السنوية
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      +{financialData.revenue.growth}%
                    </div>
                    <p className="text-sm text-muted-foreground">معدل النمو</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">اتجاه الإيرادات الشهرية</h4>
                  <div className="space-y-2">
                    {financialData.monthlyData.slice(-6).map((data, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{data.monthAr}</span>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${(data.revenue / 3000000) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-16 text-left">
                            {(data.revenue / 1000000).toFixed(1)}م ر.س
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تفصيل المصروفات</CardTitle>
              <CardDescription>
                تحليل تفصيلي للمصروفات التشغيلية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {financialData.expenses.monthly.toLocaleString()} ر.س
                  </div>
                  <p className="text-muted-foreground">
                    إجمالي المصروفات الشهرية
                  </p>
                </div>

                <div className="space-y-4">
                  {financialData.expenses.breakdown.map((expense, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {expense.categoryAr}
                        </span>
                        <span className="text-sm">
                          {expense.amount.toLocaleString()} ر.س (
                          {expense.percentage}%)
                        </span>
                      </div>
                      <Progress value={expense.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>مقاييس الربحية</CardTitle>
                <CardDescription>مؤشرات الربحية الرئيسية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">صافي الدخل</span>
                    <span className="font-bold text-green-600">
                      {financialData.profitability.netIncome.toLocaleString()}{" "}
                      ر.س
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">هامش الربح</span>
                    <span className="font-bold">
                      {financialData.profitability.margin}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">العائد على الاستثمار</span>
                    <span className="font-bold text-blue-600">
                      {financialData.profitability.roi}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ملخص الأداء</CardTitle>
                <CardDescription>الأداء المالي العام</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">ممتاز</div>
                  <p className="text-sm text-muted-foreground">
                    درجة الصحة المالية
                  </p>
                  <Progress value={88} className="mt-2" />
                  <p className="text-xs text-muted-foreground">88/100</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
