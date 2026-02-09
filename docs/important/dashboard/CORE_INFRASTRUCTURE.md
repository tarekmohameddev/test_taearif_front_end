# Dashboard Core Infrastructure

## Overview

This document covers the foundational components and stores that power the Dashboard System.

**Contents:**

1. Axios Instance - HTTP client with token injection
2. AuthContext/AuthStore - Dashboard authentication
3. Store - Modular dashboard stores
4. UserStore - Permissions management
5. OwnerAuthContext - Owner system (for comparison)

---

## 1. Axios Instance (`lib/axiosInstance.js`)

**Purpose:** Centralized HTTP client for all Dashboard API requests with automatic token injection and error handling

**File:** `lib/axiosInstance.js`

### Complete Implementation

```javascript
import axios from "axios";
import https from "https";
import useAuthStore from "@/context/AuthContext";

// Locking mechanism to prevent requests when unauthenticated
let axiosLocked = false;

// HTTPS agent for development (skip SSL verification)
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
});

// Create axios instance with base configuration
const baseURL = process.env.NEXT_PUBLIC_Backend_URL;

const axiosInstance = axios.create({
  baseURL: baseURL, // https://api.taearif.com/api
  httpsAgent: httpsAgent,
});

// ============================================
// REQUEST INTERCEPTOR - Automatic Token Injection
// ============================================
axiosInstance.interceptors.request.use(
  (config) => {
    // Security check: Reject if axios is locked
    if (axiosLocked) {
      return Promise.reject(
        new Error("Authentication required. Please login again."),
      );
    }

    // Get token from AuthStore
    const token = useAuthStore.getState().userData?.token;

    // Inject Bearer token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================
// RESPONSE INTERCEPTOR - Error Handling
// ============================================
axiosInstance.interceptors.response.use(
  (response) => {
    // Success - return response as-is
    return response;
  },
  async (error) => {
    // Handle different error types
    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized - Token expired or invalid
      if (status === 401 || data?.message === "Too Many Attempts.") {
        // Note: Auto-locking is disabled to allow retry
        // axiosLocked = true; // Disabled
      }

      // 500+ Server errors
      else if (status >= 500) {
        error.serverError = {
          status,
          message: data?.message || "خطأ في الخادم",
          timestamp: new Date().toISOString(),
          url: error.config?.url,
        };
      }

      // 400-499 Client errors
      else if (status >= 400 && status < 500) {
        error.clientError = {
          status,
          message: data?.message || "خطأ في الطلب",
          timestamp: new Date().toISOString(),
        };
      }
    }

    // Network errors (no response from server)
    else if (error.request) {
      error.networkError = {
        message: "خطأ في الاتصال بالخادم. تحقق من اتصال الإنترنت",
        timestamp: new Date().toISOString(),
      };
    }

    // Other errors
    else {
      error.unknownError = {
        message: error.message || "حدث خطأ غير متوقع",
        timestamp: new Date().toISOString(),
      };
    }

    return Promise.reject(error);
  },
);

// ============================================
// AXIOS LOCK/UNLOCK FUNCTIONS
// ============================================

export const unlockAxios = () => {
  axiosLocked = false;
};

export const isAxiosLocked = () => axiosLocked;

export const lockAxios = () => {
  axiosLocked = true;
};

export default axiosInstance;
```

### Key Features

**1. Automatic Token Injection:**

- Every request automatically gets `Authorization: Bearer {token}` header
- Token read from AuthStore in real-time
- No manual token management needed in components

**2. Request Locking Mechanism:**

- Prevents API calls when user is unauthenticated
- `unlockAxios()` called after successful login
- Protects against unauthorized request attempts

**3. Error Enhancement:**

- Categorizes errors: server, client, network, unknown
- Adds metadata: timestamp, URL, status
- Provides detailed error info for debugging

**4. HTTPS Agent Configuration:**

- Development: Skip SSL verification (self-signed certs)
- Production: Full SSL verification

### Usage Examples

```typescript
// In any dashboard component
import axiosInstance from "@/lib/axiosInstance";

// Simple GET request
const response = await axiosInstance.get("/properties");
// Request automatically includes: Authorization: Bearer {token}

// POST with data
const newProperty = await axiosInstance.post("/properties", {
  title: "New Property",
  price: 500000,
});

// Error handling
try {
  const data = await axiosInstance.get("/analytics");
} catch (error) {
  if (error.serverError) {
    console.log("Server error:", error.serverError.message);
  } else if (error.networkError) {
    toast.error("خطأ في الاتصال");
  } else if (error.clientError) {
    console.log("Client error:", error.clientError.message);
  }
}
```

### Integration Points

- **Used by:** ALL dashboard modules (properties, analytics, CRM, etc.)
- **Unlocked in:**
  - `AuthStore.login()` function
  - `AuthStore.fetchUserData()` function
  - `AuthStore.loginWithToken()` function
- **Error handling:** Components + global interceptor

---

## 2. AuthContext / AuthStore (`context/AuthContext.js`)

**Purpose:** Main authentication store for Dashboard User system

**Architecture:** Dual export pattern

- **Primary:** Zustand store (`useAuthStore`)
- **Legacy:** React Context (`AuthProvider` + `useAuth()`)

### File: `context/AuthContext.js`

### Store Structure

```javascript
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  // ============================================
  // STATE - User Session
  // ============================================
  UserIslogged: false, // Is user authenticated?
  IsLoading: true, // Loading state for async operations
  IsDone: false, // Fetch completion flag (prevents duplicate calls)
  authenticated: false, // Alternative auth flag
  error: null, // General error message
  errorLogin: null, // Login-specific error
  errorLoginATserver: null, // Server-side login error
  onboarding_completed: false, // Onboarding status

  // ============================================
  // STATE - User Data
  // ============================================
  userData: {
    // Basic Info
    email: null,
    token: null,
    username: null,
    first_name: null,
    last_name: null,
    company_name: null,
    domain: null,

    // Subscription Data
    is_free_plan: null,
    is_expired: false,
    days_remaining: null,
    package_title: null, // "Free", "Pro", "Enterprise"
    package_features: [], // Array of feature flags
    project_limit_number: null, // Max projects allowed
    real_estate_limit_number: null, // Max properties allowed

    // Permissions & Access
    permissions: [], // Array of permission strings
    account_type: null, // "admin", "manager", "editor"
    tenant_id: null, // Associated tenant (if any)

    // Messages
    message: null, // System message to display
  },

  // ============================================
  // STATE - Google OAuth
  // ============================================
  googleUrlFetched: false,
  googleAuthUrl: null,

  // ============================================
  // ACTIONS - Core
  // ============================================

  login: async (email, password, recaptchaToken) => {
    /* ... */
  },
  logout: async (options) => {
    /* ... */
  },
  fetchUserData: async () => {
    /* ... */
  },
  loginWithToken: async (token) => {
    /* ... */
  },
  fetchGoogleAuthUrl: async () => {
    /* ... */
  },

  // ============================================
  // SETTERS
  // ============================================
  setOnboardingCompleted: (boolean) => set({ onboarding_completed: boolean }),
  setErrorLogin: (error) => set({ errorLogin: error }),
  setAuthenticated: (value) => set({ authenticated: value }),
  setUserData: (data) => set({ userData: data }),
  setUserIsLogged: (isLogged) => set({ UserIslogged: isLogged }),
  setIsLoading: (loading) => set({ IsLoading: loading }),
  clearMessage: () =>
    set((state) => ({
      userData: { ...state.userData, message: null },
    })),
  setMessage: (message) =>
    set((state) => ({
      userData: { ...state.userData, message },
    })),
}));

export default useAuthStore;
```

### Core Actions Explained

#### login(email, password, recaptchaToken)

**Flow:**

```
1. Call external API: POST /login
2. Receive: { user, token }
3. Call internal API: POST /api/user/setAuth
4. Server sets httpOnly cookie: authToken
5. Update Zustand store: UserIslogged = true
6. Store in localStorage: "user"
7. Unlock axios
8. Return success
```

**Implementation:**

```javascript
login: async (email, password, recaptchaToken) => {
  set({ IsLoading: true, errorLogin: null });
  unlockAxios();

  try {
    // External API call
    const externalResponse = await fetch(
      `${process.env.NEXT_PUBLIC_Backend_URL}/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          recaptcha_token: recaptchaToken,
        }),
      },
    );

    if (!externalResponse.ok) {
      // Handle errors
      const errorData = await externalResponse.json();
      set({ errorLogin: errorData.message });
      return { success: false, error: errorData.message };
    }

    const { user, token: UserToken } = await externalResponse.json();

    // Set httpOnly cookie via internal API
    await fetch("/api/user/setAuth", {
      method: "POST",
      body: JSON.stringify({ user, UserToken }),
    });

    // Update store
    set({ UserIslogged: true, userData: { ...user, token: UserToken } });

    // Persist
    localStorage.setItem("user", JSON.stringify(safeUserData));
    unlockAxios();

    return { success: true };
  } catch (error) {
    set({ errorLoginATserver: "حدث خطأ أثناء الاتصال بالخادم" });
    return { success: false };
  } finally {
    set({ IsLoading: false });
  }
};
```

#### fetchUserData()

**Flow:**

```
1. Fetch user info from cookie: GET /api/user/getUserInfo
2. Update store with basic data
3. Store in localStorage
4. Fetch subscription data: GET /user
5. Update store with subscription data
```

**Implementation:**

```javascript
fetchUserData: async () => {
  set({ IsLoading: true });
  if (get().IsDone) return; // Prevent duplicates
  set({ IsDone: true });

  unlockAxios();

  try {
    // Get user from cookie
    const userInfoResponse = await fetch("/api/user/getUserInfo");
    const userData = await userInfoResponse.json();

    set({ UserIslogged: true, userData });
    localStorage.setItem("user", JSON.stringify(userData));

    // Fetch subscription if needed
    if (get().userData.is_free_plan == null) {
      const ress = await axiosInstance.get("/user");
      const subscriptionDATA = ress.data.data;

      set({
        userData: {
          ...userData,
          is_free_plan: subscriptionDATA.membership.is_free_plan,
          package_features: subscriptionDATA.membership.package.features,
          // ... more subscription data
        },
      });
    }
  } catch (error) {
    set({ UserIslogged: false, authenticated: false });
  } finally {
    set({ IsLoading: false, IsDone: false });
  }
};
```

#### logout(options)

**Flow:**

```
1. Call logout API: POST /api/user/logout
2. Clear server-side cookies
3. Clear Zustand store
4. Clear localStorage
5. Redirect to /login
```

**Implementation:**

```javascript
logout: async (options = { redirect: true, clearStore: true }) => {
  try {
    await fetch("/api/user/logout", {
      method: "POST",
      body: JSON.stringify({ token: get().userData.token }),
    });

    if (options.clearStore) {
      set({ UserIslogged: false, authenticated: false, userData: null });
    }

    localStorage.removeItem("user");

    if (options.redirect) {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};
```

#### loginWithToken(token)

**Purpose:** OAuth callback handler (Google login)

**Flow:**

```
1. Set token temporarily in store
2. Fetch user data using token: GET /user
3. Update store with full user data
4. Persist to localStorage
5. Unlock axios
6. Set httpOnly cookie via /api/user/setAuth
```

**Used by:** `/oauth/token/success/page.jsx`

### React Context (Backward Compatibility)

```javascript
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Usage Patterns

**Pattern 1: Zustand Store (Preferred - Modern)**

```typescript
import useAuthStore from "@/context/AuthContext";

function MyComponent() {
  // Subscribe to specific state
  const UserIslogged = useAuthStore((state) => state.UserIslogged);
  const userData = useAuthStore((state) => state.userData);

  // OR: Subscribe to multiple values
  const { UserIslogged, userData, login } = useAuthStore();

  // Call actions
  const handleLogin = async () => {
    const result = await login(email, password, recaptchaToken);
    if (result.success) {
      router.push("/dashboard");
    }
  };
}
```

**Pattern 2: React Context (Legacy - Backward Compatibility)**

```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, loading } = useAuth();

  // Simple data access only
  console.log(user?.email);
}
```

**When to use each:**

- **Zustand Store**: All new code, need actions, performance-critical
- **React Context**: Legacy components, simple read-only access

---

## 3. Store (`context/Store.js`)

**Purpose:** Modular Zustand store aggregating multiple dashboard sub-stores

**Architecture:** Micro-Store Pattern - Each module in separate file, all combined into one store

**File:** `context/Store.js`

### Complete Structure

```javascript
const { create } = require("zustand");
const axiosInstance = require("@/lib/axiosInstance");

const useStore = create((set, get) => ({
  // Global state
  loading: false,

  // ============================================
  // HOMEPAGE DASHBOARD STORES
  // ============================================
  homepage: {
    // Device statistics
    ...require("./store/homepage/dashboardDevice")(set),

    // Summary cards (visitors, pageviews, etc.)
    ...require("./store/homepage/dashboardSummary")(set),

    // Visitor analytics data
    ...require("./store/homepage/visitorData")(set),

    // Setup progress tracking
    ...require("./store/homepage/setupProgress")(set),

    // Traffic sources data
    ...require("./store/homepage/trafficSources")(set),

    // Time range selector
    setSelectedTimeRange: (range) =>
      set((state) => ({
        homepage: { ...state.homepage, selectedTimeRange: range },
      })),
  },

  // ============================================
  // MODULE-SPECIFIC STORES
  // ============================================

  ...require("./store/contentManagement")(set),
  ...require("./store/recentActivity")(set),
  ...require("./store/projectsManagement")(set),
  ...require("./store/propertiesManagement")(set),
  ...require("./store/blogManagement")(set, get),
  ...require("./store/affiliate")(set, get),
  ...require("./store/sidebar")(set, get),
  ...require("./store/rentalManagement")(set, get),
  ...require("./store/purchaseManagement")(set, get),
  ...require("./store/matchingPage")(set, get),
  ...require("./store/marketingDashboard")(set, get),
  ...require("./store/rentalOwnerDashboardPage")(set, get),
  ...require("./store/userAuth")(set),
}));

module.exports = useStore;
```

### Sub-Store Files

```
context/store/
├── homepage/
│   ├── dashboardDevice.js       # Device analytics
│   ├── dashboardSummary.js      # Summary cards
│   ├── visitorData.js           # Visitor metrics
│   ├── setupProgress.js         # Setup tracking
│   └── trafficSources.js        # Traffic data
├── contentManagement.js         # Content CRUD
├── recentActivity.js            # Activity feed
├── projectsManagement.js        # Projects CRUD
├── propertiesManagement.js      # Properties CRUD
├── blogManagement.js            # Blog CRUD
├── affiliate.js                 # Affiliate program
├── sidebar.js                   # Sidebar menu ← Used by EnhancedSidebar
├── rentalManagement.js          # Rental operations
├── purchaseManagement.js        # Purchase operations
├── matchingPage.js              # Property matching
├── marketingDashboard.js        # Marketing data
├── rentalOwnerDashboardPage.js  # Owner dashboard
└── userAuth.js                  # User auth (legacy?)
```

### Sub-Store Example: Sidebar

**File:** `context/store/sidebar.js`

```javascript
module.exports = (set, get) => ({
  sidebarData: {
    mainNavItems: [],
    loading: false,
    error: null,
  },

  fetchSideMenus: async () => {
    const currentState = get();
    set({
      sidebarData: {
        ...currentState.sidebarData,
        loading: true,
        error: null,
      },
    });

    try {
      const response = await axiosInstance.get("/dashboard/menu");
      const menuItems = response.data.mainNavItems || [];

      set({
        sidebarData: {
          mainNavItems: menuItems,
          loading: false,
          error: null,
        },
      });
    } catch (error) {
      set({
        sidebarData: {
          ...currentState.sidebarData,
          loading: false,
          error: error.message || "فشل تحميل القائمة",
        },
      });
    }
  },
});
```

### Usage in Components

```typescript
import useStore from "@/context/Store";

function DashboardComponent() {
  // Access sidebar data
  const { sidebarData, fetchSideMenus } = useStore();
  const { mainNavItems, loading, error } = sidebarData;

  // Access homepage data
  const { homepage } = useStore();
  const setTimeRange = useStore((state) => state.homepage.setSelectedTimeRange);

  // Call actions
  useEffect(() => {
    fetchSideMenus();
  }, []);

  // Use data
  return (
    <Sidebar items={mainNavItems} loading={loading} />
  );
}
```

### Modular Benefits

- ✅ Each module in separate file
- ✅ Easier maintenance and testing
- ✅ Lazy loading possible
- ✅ Clear separation of concerns
- ✅ All aggregated in single store (simple import)
- ✅ Shared `set` and `get` functions

---

## 4. UserStore (`store/userStore.ts`)

**Purpose:** Permission-focused user data store

**Why Separate from AuthStore?**

- **AuthStore:** Authentication, login, logout, session
- **UserStore:** Permissions, access control, page authorization
- **Separation of concerns:** Auth vs Authorization

**File:** `store/userStore.ts`

### Complete Implementation

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axiosInstance";

interface Permission {
  id: number;
  name: string; // e.g., "properties.view"
  name_ar: string; // "عرض العقارات"
  name_en: string; // "View Properties"
  description: string | null;
}

interface UserData {
  id: number;
  tenant_id: number | null;
  account_type: string; // "admin", "manager", "editor", "tenant"
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  permissions: Permission[]; // Array of permission objects
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // STATE
      userData: null,
      loading: false,
      error: null,
      lastFetched: null,
      isInitialized: false,

      // ACTIONS

      fetchUserData: async () => {
        const { lastFetched, userData } = get();

        // Return cached data if still valid
        if (
          userData &&
          lastFetched &&
          Date.now() - lastFetched < CACHE_DURATION
        ) {
          set({ isInitialized: true });
          return;
        }

        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.get("/user");
          const userData = response.data.data;

          set({
            userData,
            loading: false,
            lastFetched: Date.now(),
            isInitialized: true,
          });
        } catch (error) {
          set({
            loading: false,
            error: error.message,
            isInitialized: true,
          });
        }
      },

      checkPermission: (permissionName: string) => {
        const { userData } = get();
        if (!userData?.permissions) return false;

        return userData.permissions.some(
          (permission) => permission.name === permissionName,
        );
      },

      hasAccessToPage: (pageSlug: string | null) => {
        const { userData } = get();
        if (!userData || !pageSlug) return false;

        // Special case: access-control only for tenants
        if (pageSlug === "access-control") {
          return userData.account_type === "tenant";
        }

        // Tenant account type = full access
        if (userData.account_type === "tenant") {
          return true;
        }

        // Permission mapping
        const permissionMap = {
          properties: "properties.view",
          analytics: "analytics.view",
          "rental-management": "rental.management",
          // ... all mappings
        };

        const requiredPermission =
          permissionMap[pageSlug] || `${pageSlug}.view`;
        return get().checkPermission(requiredPermission);
      },

      refreshUserData: async () => {
        set({ lastFetched: null }); // Invalidate cache
        await get().fetchUserData();
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        userData: state.userData,
        lastFetched: state.lastFetched,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);
```

### Key Features

**1. 5-Minute Caching:**

```typescript
// Prevents excessive API calls
if (Date.now() - lastFetched < 5 * 60 * 1000) {
  return; // Use cached data
}
```

**2. Permission Checking:**

```typescript
// Check specific permission
checkPermission("properties.view"); // → true/false

// Check page access (used by PermissionWrapper)
hasAccessToPage("properties"); // → true/false
```

**3. Account Type Privileges:**

```typescript
// Tenant account = full access
if (userData.account_type === "tenant") {
  return true; // Bypass permission check
}
```

**4. Persistence:**

- Zustand persist middleware
- localStorage key: `user-store`
- Survives page refreshes

### Usage Examples

```typescript
// In PermissionWrapper
import { useUserStore } from "@/context/userStore";

const { userData, hasAccessToPage, loading } = useUserStore();
const hasPermission = hasAccessToPage("properties");

if (loading) return <LoadingScreen />;
if (!hasPermission) return <AccessDeniedScreen />;
return <>{children}</>;
```

```typescript
// In usePermissions hook
export const usePermissions = () => {
  const pathname = usePathname();
  const { userData, loading, error, hasAccessToPage } = useUserStore();

  const pageSlug = getPageSlug(pathname); // "properties"
  const hasPermission = hasAccessToPage(pageSlug);

  return { hasPermission, loading, userData, error };
};
```

### Relationship with AuthStore

| Feature               | AuthStore                         | UserStore            |
| --------------------- | --------------------------------- | -------------------- |
| **Purpose**           | Authentication & session          | Permissions & access |
| **Login/Logout**      | ✅ Yes                            | ❌ No                |
| **Token Storage**     | ✅ Yes                            | ❌ No                |
| **Permissions Check** | ❌ No                             | ✅ Yes               |
| **Caching**           | ❌ No                             | ✅ Yes (5 min)       |
| **Used By**           | Login flow, API calls             | PermissionWrapper    |
| **Fetch Endpoint**    | `/api/user/getUserInfo` + `/user` | `/user` only         |

**Both fetch `/user` endpoint but:**

- AuthStore: Stores token, subscription, session data
- UserStore: Focuses on permissions array and access logic

---

## 5. OwnerAuthContext (`context/OwnerAuthContext.js`)

**⚠️ CRITICAL: NOT PART OF DASHBOARD SYSTEM**

**Purpose:** Authentication for Owner Portal (`/owner/*` routes)

**Included here for COMPARISON and CLARITY**

**File:** `context/OwnerAuthContext.js`

### Store Structure

```javascript
import { create } from "zustand";

const useOwnerAuthStore = create((set, get) => ({
  // STATE
  ownerIsLogged: false,
  isLoading: false,
  isAuthenticated: false,
  errorLogin: null,
  errorRegister: null,

  ownerData: {
    email: null,
    token: null,
    first_name: null,
    last_name: null,
    tenant_id: null, // ← Always has tenant context
    owner_id: null,
    permissions: [],
  },

  // ACTIONS

  login: async (email, password) => {
    // Direct API call (NO internal wrapper)
    const response = await axios.post(
      "https://api.taearif.com/api/v1/owner-rental/login",
      { email, password },
    );

    const { owner_rental: user, token } = response.data.data;

    // Set CLIENT-SIDE cookies (NOT httpOnly)
    document.cookie = `owner_token=${token}; path=/; max-age=604800`;
    document.cookie = `ownerRentalToken=${token}; path=/; max-age=604800`;

    set({ ownerIsLogged: true, ownerData: { ...user, token } });
    localStorage.setItem("owner_user", JSON.stringify(ownerData));
  },

  logout: async () => {
    document.cookie =
      "owner_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "ownerRentalToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("owner_user");
    set({ ownerIsLogged: false, ownerData: null });
  },
}));

export default useOwnerAuthStore;
```

### Critical Differences from Dashboard AuthStore

| Feature              | Dashboard (AuthStore)                  | Owner (OwnerAuthStore)                 |
| -------------------- | -------------------------------------- | -------------------------------------- |
| **Routes**           | `/dashboard/*`                         | `/owner/*`                             |
| **Cookie Names**     | `authToken`, `next-auth.session-token` | `owner_token`, `ownerRentalToken`      |
| **Cookie Type**      | ✅ httpOnly (server-set, secure)       | ❌ Client-side (JavaScript accessible) |
| **API Endpoint**     | `/api/login` → `/login`                | Direct: `/v1/owner-rental/login`       |
| **API Wrapper**      | ✅ Internal `/api/user/*`              | ❌ No wrapper                          |
| **localStorage Key** | `user`                                 | `owner_user`                           |
| **Requires Tenant?** | ❌ NO (works on base domain)           | ✅ YES (subdomain/custom domain only)  |
| **Middleware Check** | Via ClientLayout (client)              | Via middleware.ts (server)             |
| **Security**         | ✅ High (httpOnly)                     | ⚠️ Lower (client cookies)              |
| **OAuth Support**    | ✅ Yes (NextAuth + Google)             | ❌ No                                  |

### Why They Don't Interact

**Complete Isolation:**

1. **Different Cookies:**
   - Dashboard: `authToken`
   - Owner: `owner_token`
   - No name collision

2. **Different Stores:**
   - Dashboard: `useAuthStore`
   - Owner: `useOwnerAuthStore`
   - Separate state management

3. **Different Routes:**
   - Dashboard: `/dashboard/*`
   - Owner: `/owner/*`
   - Different middleware logic

4. **Independent Sessions:**
   - Can be logged into both simultaneously
   - Separate session lifecycles
   - No shared state

### Example: Simultaneous Sessions

```
User logs into Dashboard:
  → localhost:3000/ar/dashboard
  → AuthStore.UserIslogged = true
  → Cookie: authToken = "abc123..."
  → localStorage: user = {...}

Same user visits Owner portal:
  → tenant1.localhost:3000/ar/owner/dashboard
  → Middleware checks owner_token → NOT FOUND
  → Redirect to /owner/login
  → User logs in as Owner
  → OwnerAuthStore.ownerIsLogged = true
  → Cookie: owner_token = "xyz789..."
  → localStorage: owner_user = {...}

Result:
  - Two active sessions
  - Different cookies
  - Different stores
  - Completely independent
```

### Security Implications

**Dashboard (Better Security):**

- ✅ httpOnly cookies (XSS protection)
- ✅ Server-side validation
- ✅ CSRF protection (NextAuth)
- ✅ Secure token storage

**Owner (Weaker Security):**

- ⚠️ Client-side cookies (XSS vulnerable)
- ⚠️ No server-side validation layer
- ⚠️ No CSRF protection
- ⚠️ JavaScript can access tokens

**Recommendation:** Migrate Owner system to use same security pattern as Dashboard

---

## Store Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Dashboard Stores                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐                                       │
│  │   AuthStore      │  ← Main authentication                │
│  │  (AuthContext)   │  ← Session management                 │
│  └────────┬─────────┘  ← Token storage                      │
│           │                                                  │
│           ↓                                                  │
│  ┌──────────────────┐                                       │
│  │  axiosInstance   │  ← Reads token from AuthStore        │
│  │ (lib/axios...)   │  ← Injects in ALL requests           │
│  └────────┬─────────┘                                       │
│           │                                                  │
│           ↓                                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Store (context/Store.js)            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │  sidebar   │  │ properties │  │  analytics │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │    crm     │  │   rental   │  │  affiliate │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │         ... (20+ sub-stores)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────┐                                       │
│  │   UserStore      │  ← Permission checking                │
│  │ (store/user...)  │  ← Page access control               │
│  └────────┬─────────┘  ← Caching (5 min)                   │
│           │                                                  │
│           ↓                                                  │
│  ┌──────────────────┐                                       │
│  │ PermissionWrapper│  ← Uses UserStore                     │
│  │ usePermissions   │  ← Blocks unauthorized access        │
│  └──────────────────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘

         vs (Completely Separate)

┌─────────────────────────────────────────────────────────────┐
│                      Owner System                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐                                       │
│  │ OwnerAuthStore   │  ← Owner authentication               │
│  │ (OwnerAuth...)   │  ← Client cookies                     │
│  └──────────────────┘  ← Direct API calls                   │
│                                                              │
│  NO axiosInstance                                            │
│  NO permission system                                        │
│  NO shared state with Dashboard                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Used by Stores

### AuthStore Endpoints

| Endpoint                | Method | Purpose                 | Returns                           |
| ----------------------- | ------ | ----------------------- | --------------------------------- |
| `/login`                | POST   | External login API      | `{ user, token }`                 |
| `/api/user/setAuth`     | POST   | Set httpOnly cookie     | `{ success: true }`               |
| `/api/user/getUserInfo` | GET    | Get user from cookie    | `{ email, token, username, ... }` |
| `/api/user/logout`      | POST   | Clear session           | `{ message: "..." }`              |
| `/user`                 | GET    | Get user + subscription | `{ data: { membership, ... } }`   |
| `/auth/google/redirect` | GET    | Get Google OAuth URL    | `{ url: "..." }`                  |

### Store (sidebar) Endpoints

| Endpoint          | Method | Purpose               | Returns                   |
| ----------------- | ------ | --------------------- | ------------------------- |
| `/dashboard/menu` | GET    | Get sidebar structure | `{ mainNavItems: [...] }` |

### UserStore Endpoints

| Endpoint | Method | Purpose                | Returns                                               |
| -------- | ------ | ---------------------- | ----------------------------------------------------- |
| `/user`  | GET    | Get user + permissions | `{ data: { permissions: [...], account_type, ... } }` |

---

## Summary

### Store Responsibilities

**AuthStore (`context/AuthContext.js`):**

- ✅ Login/logout
- ✅ Session management
- ✅ Token storage
- ✅ OAuth handling
- ✅ Subscription data
- ❌ NOT permissions checking

**Store (`context/Store.js`):**

- ✅ Sidebar menu
- ✅ Dashboard analytics
- ✅ Module-specific data (properties, CRM, etc.)
- ❌ NOT authentication

**UserStore (`store/userStore.ts`):**

- ✅ Permission checking
- ✅ Page access control
- ✅ Data caching (5 min)
- ❌ NOT login/logout

**OwnerAuthStore (`context/OwnerAuthContext.js`):**

- ⚠️ SEPARATE SYSTEM for `/owner/*` routes
- ❌ NOT used in dashboard
- Different cookies, different API, different purpose

### When to Use Each Store

**Need to check if user is logged in?**
→ Use `AuthStore.UserIslogged`

**Need to make API call?**
→ Use `axiosInstance` (reads token from AuthStore automatically)

**Need to check if user can access a page?**
→ Use `UserStore.hasAccessToPage(pageSlug)`

**Need sidebar menu items?**
→ Use `Store.sidebarData.mainNavItems`

**Need dashboard analytics?**
→ Use `Store.homepage.*`

**Working on Owner portal?**
→ Use `OwnerAuthStore` (completely separate)

---

**See Also:**

- [AUTHENTICATION.md](./AUTHENTICATION.md) - Auth flows in detail
- [../AUTHENTICATION_SYSTEMS.md](../AUTHENTICATION_SYSTEMS.md) - Complete auth architecture
