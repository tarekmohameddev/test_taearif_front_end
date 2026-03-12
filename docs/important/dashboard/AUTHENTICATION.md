# Dashboard Authentication & Access Control

## Overview

Complete guide to authentication flows and access control layers in the Dashboard System.

---

## Authentication Requirements

Dashboard pages require:

1. ✅ **Dashboard User Login** (not Owner login)
2. ✅ **Valid session token** (stored in httpOnly cookie)
3. ✅ **Active subscription** (for some features)
4. ✅ **Base domain access** (not tenant domain)

**See [../AUTHENTICATION_SYSTEMS.md](../AUTHENTICATION_SYSTEMS.md) for auth architecture.**

---

## Protection Layers

### Layer 1: Middleware (Server-Side)

**File:** `middleware.ts`

**Function:** Locale enforcement

```typescript
// All dashboard routes must have locale prefix
/dashboard → redirects to → /ar/dashboard
/en/dashboard → redirects to → /ar/dashboard
```

**See [../LOCALE_ROUTING_SYSTEM.md](../LOCALE_ROUTING_SYSTEM.md)**

---

### Layer 2: Dashboard Layout (Client-Side)

**File:** `app/dashboard/layout.tsx`

**Complete Implementation:**

```typescript
"use client";

import { useEffect, useState } from "react";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import GTMProvider from "@/components/GTMProvider2";
import PermissionWrapper from "@/components/PermissionWrapper";

export default function DashboardLayout({ children }) {
  const { tokenValidation } = useTokenValidation();
  const [isValidDomain, setIsValidDomain] = useState<boolean | null>(null);

  // ✅ CHECK 1: Verify base domain (not tenant domain)
  useEffect(() => {
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const productionDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
      const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
      const isDevelopment = process.env.NODE_ENV === "development";

      const isOnBaseDomain = isDevelopment
        ? hostname === localDomain || hostname === `${localDomain}:3000`
        : hostname === productionDomain || hostname === `www.${productionDomain}`;

      const isCustomDomain = /\.(com|net|org|io|co|me)$/i.test(hostname);

      if (isCustomDomain && !isOnBaseDomain) {
        setIsValidDomain(false); // Block tenant domains
        return;
      }

      setIsValidDomain(isOnBaseDomain);
    };

    checkDomain();
  }, []);

  // ✅ CHECK 2: Validate authentication token
  if (isValidDomain === null || tokenValidation.loading) {
    return <LoadingScreen message="جاري التحقق..." />;
  }

  // If tenant domain, block access
  if (isValidDomain === false) {
    const TenantPageWrapper = require('@/app/TenantPageWrapper').default;
    return <TenantPageWrapper />;
  }

  // ✅ CHECK 3: Enforce RTL direction for Arabic
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "dashboard-rtl-styles";
    style.textContent = `
      html { direction: rtl !important; }
      body { direction: rtl !important; }
      * { direction: rtl !important; }
    `;
    document.head.appendChild(style);

    return () => {
      document.getElementById("dashboard-rtl-styles")?.remove();
    };
  }, []);

  return (
    <GTMProvider containerId="GTM-KBL37C9T">
      <div dir="rtl" style={{ direction: "rtl" }}>
        <PermissionWrapper>
          {children}
        </PermissionWrapper>
      </div>
    </GTMProvider>
  );
}
```

**Key Features:**

- **Domain Validation:** Blocks tenant domains (lines 16-41)
- **Token Validation:** Verifies session (line 2)
- **RTL Enforcement:** Forces Arabic layout (lines 56-69)
- **Permission Wrapper:** Role-based access (line 73)
- **GTM Tracking:** Analytics integration (line 71)

---

### Layer 3: ClientLayout (Global Auth)

**File:** `app/ClientLayout.tsx`

```typescript
export default function ClientLayout({ children }) {
  const UserIslogged = useAuthStore((state) => state.UserIslogged);
  const IsLoading = useAuthStore((state) => state.IsLoading);
  const pathname = usePathname();

  const publicPages = ["/login", "/register", "/oauth", "/forgot-password"];

  const isPublicPage = publicPages.some(page => pathname?.startsWith(page));

  useEffect(() => {
    if (!IsLoading && !UserIslogged && !isPublicPage) {
      router.push("/login");
    }
  }, [IsLoading, UserIslogged, pathname]);

  if (!UserIslogged && !isPublicPage) {
    return null; // Block render
  }

  return <AuthProvider>{children}</AuthProvider>;
}
```

**See [../AUTHENTICATION_SYSTEMS.md](../AUTHENTICATION_SYSTEMS.md)**

---

## Token Validation System

### Hook: `hooks/useTokenValidation.ts`

**Purpose:** Validates user session on dashboard load

**Complete Flow:**

```
Dashboard layout loads
  ↓
useTokenValidation() called
  ↓
Step 1: Fetch user info from cookie
  GET /api/user/getUserInfo
  ↓
Step 2: Extract token from response
  ↓
Step 3: Validate token with backend
  GET /user with Bearer token
  ↓
Step 4: If valid → update AuthStore
Step 4: If invalid → clear session + redirect
```

**Implementation:**

```typescript
export function useTokenValidation() {
  const [tokenValidation, setTokenValidation] = useState({
    isValid: null,
    message: "",
    loading: true,
  });

  const fetchUserInfo = async () => {
    const response = await fetch("/api/user/getUserInfo");
    return await response.json();
  };

  const validateToken = async (token: string) => {
    try {
      const response = await axiosInstance.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        // Token valid - update AuthStore
        const userData = response.data.data;
        setUserData(userData);
        setTokenValidation({ isValid: true, loading: false });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Token invalid - clear session
        clearAuthCookie();
        clearAuthContextData();
        await logout({ redirect: false });
        setTokenValidation({ isValid: false, loading: false });
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      const userInfo = await fetchUserInfo();

      if (!userInfo?.token) {
        setTokenValidation({ isValid: false, loading: false });
        router.push("/login");
        return;
      }

      await validateToken(userInfo.token);
    };

    init();
  }, []);

  return { tokenValidation };
}
```

**Cookie Clearing:**

```typescript
const clearAuthCookie = () => {
  document.cookie = "authToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  document.cookie = `authToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
};
```

**Store Clearing:**

```typescript
const clearAuthContextData = () => {
  setUserData({
    email: null,
    token: null,
    permissions: [],
    // ... reset all fields
  });
  setUserIsLogged(false);
  setAuthenticated(false);
};
```

---

## Permission System

### Components

**1. PermissionWrapper** (`components/PermissionWrapper.tsx`)

**Purpose:** Wraps dashboard content, blocks unauthorized access

```typescript
export default function PermissionWrapper({ children, fallback }) {
  const { hasPermission, loading, error } = usePermissions();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">خطأ في النظام</h2>
          <p className="text-gray-600">{error}</p>
          <button onClick={refreshUserData}>إعادة المحاولة</button>
        </CardContent>
      </Card>
    );
  }

  if (!hasPermission) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <EnhancedSidebar />
          <main className="flex-1">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">
                  ليس لديك صلاحية للوصول
                </h2>
                <p className="text-gray-600 mb-4">
                  عذراً، ليس لديك الصلاحية المطلوبة.
                </p>
                <button onClick={() => window.history.back()}>
                  العودة للخلف
                </button>
                <button onClick={() => router.push("/dashboard")}>
                  الذهاب للوحة التحكم
                </button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

**2. usePermissions Hook** (`hooks/usePermissions.ts`)

```typescript
export const usePermissions = () => {
  const pathname = usePathname();
  const { userData, loading, error, hasAccessToPage, fetchUserData } =
    useUserStore();

  // Initialize user data
  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, [userData, fetchUserData]);

  // Extract page slug from pathname
  const getPageSlug = (pathname: string): string => {
    let cleanPath = pathname.replace(/^\/[a-z]{2}/, ""); // Remove locale
    cleanPath = cleanPath.replace(/^\/dashboard/, ""); // Remove /dashboard
    const segments = cleanPath.split("/").filter(Boolean);
    return segments[0] || "";
  };

  // Slug → permission name: single source in @/lib/permissions/slugToPermission
  // usePermissions exposes getPermissionName(slug) which delegates there (e.g. "properties" → "properties.view").
  const pageSlug = getPageSlug(pathname);
  const hasPermission = hasAccessToPage(pageSlug);

  return {
    hasPermission,
    loading,
    userData,
    error,
    getPageSlug: () => pageSlug,
  };
};
```

### Permission Checking Logic

**In UserStore (`context/userStore.ts`):** Imports `getPermissionNameForSlug` from `@/lib/permissions/slugToPermission`.

```typescript
hasAccessToPage: (pageSlug: string | null) => {
  const { userData } = get();
  if (!userData || !pageSlug) return false;

  // Special case: access-control only for tenant account
  if (pageSlug === "access-control") {
    return userData.account_type === "tenant";
  }

  // Tenant account type → full access to all pages
  if (userData.account_type === "tenant") {
    return true;
  }

  // Permission-based access: slug → permission name from @/lib/permissions/slugToPermission
  const requiredPermission = getPermissionNameForSlug(pageSlug);
  return get().checkPermission(requiredPermission);
},

checkPermission: (permissionName: string) => {
  const { userData } = get();
  if (!userData?.permissions) return false;

  return userData.permissions.some(
    (permission) => permission.name === permissionName
  );
},
```

---

## Permission Levels

### Account Types

**1. Tenant (account_type === "tenant"):**

- ✅ Full access to ALL pages (except nothing)
- ✅ Bypasses permission checks
- ✅ Can access `/dashboard/access-control`
- ✅ Owner of the dashboard instance

**2. Admin:**

- ✅ Full access based on permissions array
- ✅ Typically has all permissions assigned
- ✅ Can manage other users

**3. Manager:**

- ⚠️ Limited access based on assigned permissions
- ✅ Can access only permitted modules
- ❌ Cannot manage users (unless permission granted)

**4. Editor:**

- ⚠️ Content management only
- ✅ Access to `/dashboard/content/*`
- ❌ No access to settings, analytics, etc.

**5. Viewer:**

- ⚠️ Read-only access
- ✅ View data only
- ❌ Cannot create, edit, or delete

---

## ReCAPTCHA Integration

**See [../RECAPTCHA_SYSTEM.md](../RECAPTCHA_SYSTEM.md) for complete details.**

### Login Protection

**File:** `components/signin-up/login-page.tsx`

```typescript
const handleLogin = async (e) => {
  e.preventDefault();

  // Execute reCAPTCHA
  const recaptchaToken = await executeRecaptcha("login");

  if (!recaptchaToken) {
    toast.error("فشل التحقق من reCAPTCHA");
    return;
  }

  // Login with token
  const result = await login(email, password, recaptchaToken);

  if (result.success) {
    router.push("/dashboard");
  }
};
```

**Backend Validation:**

```
POST /api/login
  Body: { email, password, recaptcha_token }
  ↓
Backend validates reCAPTCHA with Google
  ↓
If valid → proceed with auth
If invalid → reject login
```

**Protection Against:**

- Brute force attacks
- Automated login attempts
- Bot traffic
- Account takeover

---

## OAuth Integration

**See [../AUTHENTICATION_SYSTEMS.md](../AUTHENTICATION_SYSTEMS.md) - OAuth section**

### Google OAuth Flow

```
User clicks "Sign in with Google"
  ↓
NextAuth redirects to Google consent
  ↓
User approves
  ↓
Google redirects to /api/auth/callback/google
  ↓
NextAuth JWT callback:
  - Check if user exists: POST /auth/check-user
  - If exists: POST /auth/google/login
  - If new: POST /auth/google/register
  ↓
Redirect to /oauth/token/success?token=...
  ↓
Page extracts token
  ↓
Call AuthStore.loginWithToken(token)
  ↓
Update store + localStorage
  ↓
Redirect to /dashboard
```

**File:** `pages/api/auth/[...nextauth].js`

**Providers:**

- Google (configured)
- Credentials (email/password)

---

## Domain Validation

### Why Dashboard Blocks Tenant Domains

**Scenario:**

```
User visits: tenant1.localhost:3000/ar/dashboard
  ↓
Dashboard layout loads
  ↓
Domain check: hostname = "tenant1.localhost"
  ↓
Detects subdomain (tenant domain)
  ↓
isValidDomain = false
  ↓
Loads TenantPageWrapper instead
  ↓
Dashboard blocked
```

**Reason:**

- Dashboard = platform administration
- Tenant domains = customer websites
- Prevents confusion and security risks
- Keeps admin/tenant contexts separate

**Valid Access:**

- `localhost:3000/ar/dashboard` ✅
- `taearif.com/ar/dashboard` ✅
- `tenant1.localhost:3000/ar/dashboard` ❌

---

## Onboarding System

### First-Time User Flow

```
User registers → Login → Dashboard loads
  ↓
ClientLayout checks onboarding_completed
  ↓
If false → Redirect to /onboarding
  ↓
User completes onboarding
  ↓
Backend updates: onboarding_completed = true
  ↓
Redirect to /dashboard
  ↓
GuidedTour component shows
  ↓
User completes tour
  ↓
localStorage: hasVisitedBefore = "true"
```

**File:** `app/ClientLayout.tsx` (lines 161-193)

```typescript
useEffect(() => {
  async function fetchUser() {
    if (UserIslogged && !onboardingCompleted) {
      if (pathname !== "/onboarding") {
        const response = await axiosInstance.get("/user");
        const completed = response.data.data.onboarding_completed;

        if (completed == undefined) {
          router.push("/onboarding");
        }
      }
    }
  }
  fetchUser();
}, [UserIslogged, onboardingCompleted]);
```

**GuidedTour:** Shown on first visit to dashboard

**LocalStorage Key:** `hasVisitedBefore`

---

## RTL Enforcement

### Dashboard Layout RTL

**File:** `app/dashboard/layout.tsx` (lines 86-111)

```typescript
useEffect(() => {
  const style = document.createElement("style");
  style.id = "dashboard-rtl-styles";
  style.textContent = `
    html { direction: rtl !important; }
    body { direction: rtl !important; }
    * { direction: rtl !important; }
  `;
  document.head.appendChild(style);

  return () => {
    document.getElementById("dashboard-rtl-styles")?.remove();
  };
}, []);
```

**Why?**

- Dashboard designed for Arabic interface
- All UI text in Arabic
- Complements locale system (always `/ar/` prefix)

**See [../LOCALE_ROUTING_SYSTEM.md](../LOCALE_ROUTING_SYSTEM.md)**

---

## Access Control Flow

### Complete Authentication & Authorization Flow

```
User visits /dashboard/properties
  ↓
┌─────────────────────────────────────┐
│ Layer 1: Middleware                 │
│ - Check locale prefix              │
│ - Redirect to /ar/ if needed       │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Layer 2: Dashboard Layout           │
│ - Validate domain (base only)      │
│ - Validate token (useTokenValidation)│
│ - If invalid → redirect to /login  │
│ - Enforce RTL direction            │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Layer 3: ClientLayout               │
│ - Check AuthStore.UserIslogged     │
│ - If false → redirect to /login    │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Layer 4: PermissionWrapper          │
│ - Call usePermissions()            │
│ - Check UserStore.hasAccessToPage()│
│ - If no permission → show denied   │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Layer 5: Page Component             │
│ - PropertiesManagementPage renders │
│ - Makes API calls via axiosInstance│
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Layer 6: API Request                │
│ - axiosInstance adds Bearer token  │
│ - Backend validates token          │
│ - If 401 → redirect to login       │
└─────────────────────────────────────┘
```

---

## Security Summary

### Security Layers

1. ✅ **Middleware:** Locale enforcement
2. ✅ **Dashboard Layout:** Domain + token validation
3. ✅ **ClientLayout:** Session check
4. ✅ **PermissionWrapper:** Role-based access
5. ✅ **API Layer:** Bearer token validation
6. ✅ **ReCAPTCHA:** Login protection

### Token Storage

**httpOnly Cookie:**

- Name: `authToken`
- Set by: `/api/user/setAuth`
- Expires: 30 days
- Secure: true (production)
- SameSite: lax
- ✅ Cannot be accessed by JavaScript (XSS protection)

**localStorage:**

- Key: `user`
- Contains: User data (including token copy)
- Purpose: Quick access, persistence
- ⚠️ Accessible by JavaScript

### Best Practices

**✅ DO:**

- Use AuthStore for authentication
- Use UserStore for permissions
- Use axiosInstance for API calls
- Check permissions before rendering
- Clear all auth data on logout

**❌ DON'T:**

- Store sensitive data in localStorage
- Mix Dashboard and Owner auth systems
- Bypass PermissionWrapper
- Access dashboard from tenant domains

---

**See Also:**

- [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md) - AuthStore details
- [../AUTHENTICATION_SYSTEMS.md](../AUTHENTICATION_SYSTEMS.md) - Complete auth system
- [../RECAPTCHA_SYSTEM.md](../RECAPTCHA_SYSTEM.md) - ReCAPTCHA implementation
