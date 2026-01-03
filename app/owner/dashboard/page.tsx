"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useOwnerAuthStore from "@/context/OwnerAuthContext";
import useTenantStore from "@/context/tenantStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Home,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  User,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function OwnerDashboard() {
  const {
    ownerData,
    logout,
    ownerIsLogged,
    fetchOwnerData,
    initializeFromStorage,
  } = useOwnerAuthStore();
  const { fetchTenantData, tenantData } = useTenantStore();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to extract tenant ID from hostname (same logic as middleware)
  const extractTenantId = (host: string): string | null => {
    const productionDomain =
      process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
    const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
    const isDevelopment = process.env.NODE_ENV === "development";

    // Reserved words that should not be tenant IDs
    const reservedWords = [
      "www",
      "api",
      "admin",
      "app",
      "mail",
      "ftp",
      "blog",
      "shop",
      "store",
      "dashboard",
      "live-editor",
      "auth",
      "login",
      "register",
    ];

    console.log("🔍 Dashboard: Checking host:", host);
    console.log("🔍 Dashboard: Is development:", isDevelopment);

    // Check if on base domain
    const isOnBaseDomain = isDevelopment
      ? host === localDomain || host === `${localDomain}:3000`
      : host === productionDomain || host === `www.${productionDomain}`;

    if (isOnBaseDomain) {
      console.log(
        "🔍 Dashboard: Host is base domain, not tenant-specific:",
        host,
      );
      return null;
    }

    // For localhost development: tenant1.localhost:3000 -> tenant1
    if (isDevelopment && host.includes(localDomain)) {
      const parts = host.split(".");
      if (parts.length > 1 && parts[0] !== localDomain) {
        const potentialTenantId = parts[0];
        console.log(
          "🔍 Dashboard: Potential tenant ID (local):",
          potentialTenantId,
        );

        if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
          console.log(
            "✅ Dashboard: Valid tenant ID (local):",
            potentialTenantId,
          );
          return potentialTenantId;
        } else {
          console.log(
            "❌ Dashboard: Reserved word (local):",
            potentialTenantId,
          );
        }
      }
    }

    // For production: tenant1.taearif.com -> tenant1
    if (!isDevelopment && host.includes(productionDomain)) {
      const parts = host.split(".");
      if (parts.length > 2) {
        const potentialTenantId = parts[0];
        const domainPart = parts.slice(1).join(".");

        if (domainPart === productionDomain) {
          console.log(
            "🔍 Dashboard: Potential tenant ID (production):",
            potentialTenantId,
          );

          if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
            console.log(
              "✅ Dashboard: Valid tenant ID (production):",
              potentialTenantId,
            );
            return potentialTenantId;
          } else {
            console.log(
              "❌ Dashboard: Reserved word (production):",
              potentialTenantId,
            );
          }
        }
      }
    }

    // For custom domain: custom-domain.com -> custom-domain.com
    const isCustomDomain =
      /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(
        host,
      );

    if (isCustomDomain) {
      console.log("✅ Dashboard: Custom domain detected:", host);
      return host;
    }

    console.log("❌ Dashboard: No valid tenant ID found for host:", host);
    return null;
  };

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      // Check if user is actually logged in by verifying token
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("owner_token="))
        ?.split("=")[1];

      if (!token) {
        router.push("/owner/login");
        return;
      }

      // Initialize from storage first
      await initializeFromStorage();

      if (!ownerIsLogged) {
        router.push("/owner/login");
        return;
      }

      // Fetch fresh owner data, dashboard data, and tenant data
      try {
        await fetchOwnerData();
        await fetchDashboardData();

        // Extract tenant ID from subdomain or custom domain
        const tenantId = extractTenantId(window.location.hostname);
        console.log("Extracted tenant ID:", tenantId);
        if (tenantId) {
          await fetchTenantData(tenantId);
        } else {
          console.log("No tenant ID found, skipping tenant data fetch");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("فشل في تحميل البيانات");
        // If fetch fails, redirect to login
        router.push("/owner/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoad();
  }, []); // إزالة dependencies لتجنب إعادة التشغيل المتكررة

  const fetchDashboardData = useCallback(async () => {
    // منع إعادة استدعاء API إذا كانت البيانات محملة بالفعل
    if (dashboardData) {
      return;
    }

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("ownerRentalToken="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("No token found");
      }

      console.log("Fetching dashboard data...");
      const response = await fetch(
        "https://api.taearif.com/api/v1/owner-rental/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data.data);
      console.log("Dashboard data loaded successfully");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("فشل في تحميل بيانات لوحة التحكم");
    }
  }, [dashboardData]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/owner/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              {/* Logo from tenant data */}
              {tenantData?.globalComponentsData?.header?.logo?.image && (
                <img
                  src={tenantData.globalComponentsData.header.logo.image}
                  alt="Logo"
                  className="h-24 w-auto object-contain"
                />
              )}
              <h1 className="text-xl font-semibold text-gray-900">
                لوحة تحكم المالك
              </h1>
            </div>
            <div className="flex items-center space-x-4 gap-x-4">
              <span className="text-sm text-gray-700">
                مرحباً، {ownerData?.first_name} {ownerData?.last_name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Statistics Cards */}
          {dashboardData?.summary_cards && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي العقارات
                  </CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.summary_cards.total_properties}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    الإيجار المستحق
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {dashboardData.summary_cards.due_rent} ريال
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    الإيجار المتأخر
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {dashboardData.summary_cards.overdue_rent} ريال
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    معدل التحصيل
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {dashboardData.summary_cards.collection_rate}%
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Properties Table */}
          {dashboardData?.properties_table && (
            <Card>
              <CardHeader>
                <CardTitle>عقاراتي</CardTitle>
                <CardDescription>
                  قائمة بجميع عقاراتك ومعلومات الإيجار
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">العقار</TableHead>
                      <TableHead className="text-right">المشروع</TableHead>
                      <TableHead className="text-right">
                        الإيجار المستحق
                      </TableHead>
                      <TableHead className="text-right">
                        الإيجار المتأخر
                      </TableHead>
                      <TableHead className="text-right">
                        تاريخ الاستحقاق
                      </TableHead>
                      <TableHead className="text-right">آخر دفع</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.properties_table.map(
                      (item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center space-x-3 gap-x-3 ">
                              {item.property.image_url && (
                                <img
                                  src={item.property.image_url}
                                  alt={item.property.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">
                                  {item.property.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  الوحدة: {item.property.unit_number}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {item.project.name}
                            </div>
                            {item.building.name && (
                              <div className="text-sm text-gray-500">
                                {item.building.name}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-blue-600 font-medium">
                              {item.due_rent} {item.currency}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-red-600 font-medium">
                              {item.overdue_rent} {item.currency}
                            </span>
                          </TableCell>
                          <TableCell>
                            {item.due_date
                              ? new Date(item.due_date).toLocaleDateString(
                                  "ar-US",
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {item.last_payment
                              ? new Date(item.last_payment).toLocaleDateString(
                                  "ar-US",
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status.color === "red"
                                  ? "destructive"
                                  : item.status.color === "green"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {item.status.text}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
