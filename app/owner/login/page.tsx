"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useOwnerAuthStore from "@/context/OwnerAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import useTenantStore from "@/context/tenantStore";

export default function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fetchTenantData, tenantData } = useTenantStore();

  const { login, ownerIsLogged, errorLogin, initializeFromStorage } =
    useOwnerAuthStore();
  const router = useRouter();

  // Function to extract tenant ID from hostname (same logic as dashboard)
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

    console.log("🔍 Login: Checking host:", host);
    console.log("🔍 Login: Is development:", isDevelopment);

    // Check if on base domain
    const isOnBaseDomain = isDevelopment
      ? host === localDomain || host === `${localDomain}:3000`
      : host === productionDomain || host === `www.${productionDomain}`;

    if (isOnBaseDomain) {
      console.log("🔍 Login: Host is base domain, not tenant-specific:", host);
      return null;
    }

    // For localhost development: tenant1.localhost:3000 -> tenant1
    if (isDevelopment && host.includes(localDomain)) {
      const parts = host.split(".");
      if (parts.length > 1 && parts[0] !== localDomain) {
        const potentialTenantId = parts[0];
        console.log(
          "🔍 Login: Potential tenant ID (local):",
          potentialTenantId,
        );

        if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
          console.log("✅ Login: Valid tenant ID (local):", potentialTenantId);
          return potentialTenantId;
        } else {
          console.log("❌ Login: Reserved word (local):", potentialTenantId);
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
            "🔍 Login: Potential tenant ID (production):",
            potentialTenantId,
          );

          if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
            console.log(
              "✅ Login: Valid tenant ID (production):",
              potentialTenantId,
            );
            return potentialTenantId;
          } else {
            console.log(
              "❌ Login: Reserved word (production):",
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
      console.log("✅ Login: Custom domain detected:", host);
      return host;
    }

    console.log("❌ Login: No valid tenant ID found for host:", host);
    return null;
  };
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      // Extract tenant ID from subdomain or custom domain
      const tenantId = extractTenantId(window.location.hostname);
      console.log("Extracted tenant ID:", tenantId);

      if (tenantId) {
        try {
          await fetchTenantData(tenantId);
        } catch (error) {
          console.error("Error fetching tenant data:", error);
        }
      } else {
        console.log("No tenant ID found, skipping tenant data fetch");
      }
    };

    checkAuthAndLoad();
  }, []); // إزالة dependencies لتجنب إعادة التشغيل المتكررة

  useEffect(() => {
    const checkAuth = async () => {
      const isInitialized = await initializeFromStorage();

      // Check if user is actually logged in by verifying token
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("owner_token="))
        ?.split("=")[1];

      if (token && isInitialized) {
        router.push("/owner/dashboard");
      }
    };

    checkAuth();
  }, [router, initializeFromStorage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/owner/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            {tenantData?.globalComponentsData?.header?.logo?.image && (
              <div className="text-center ">
                <img
                  src={tenantData.globalComponentsData.header.logo.image}
                  alt="Logo"
                  className="h-24 w-auto object-contain mx-auto"
                />
              </div>
            )}
            <CardTitle className="text-2xl font-bold">
              تسجيل دخول المالك
            </CardTitle>
            <CardDescription>
              أدخل بياناتك لتسجيل الدخول إلى لوحة التحكم
            </CardDescription>
            {/* Logo from tenant data */}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorLogin && (
                <Alert variant="destructive">
                  <AlertDescription>{errorLogin}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="أدخل كلمة المرور"
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>

            {/* <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{" "}
                <Link 
                  href="/owner/register" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  سجل الآن
                </Link>
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
