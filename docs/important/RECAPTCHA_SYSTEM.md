# Google reCAPTCHA v3 Integration System

## Overview

The application uses **Google reCAPTCHA v3** to protect forms from spam and bot attacks. reCAPTCHA v3 works **invisibly** in the background without requiring user interaction (no "I'm not a robot" checkbox).

### Key Configuration

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ldqrg0rAAAAAKOdI-d1m5hUJ7fQ4QbDmq7lRgUb
```

### Recent Update (Fixed Client Navigation Bug)

**Previous Issue:**

- Opening `/login` via direct URL worked ✓
- Opening `/login` via `<Link>` from another page failed ✗

**Root Cause:**

- Server component in layout used `headers()` for pathname
- `headers()` only updates on server requests, not client navigation
- Stale pathname caused wrong reCAPTCHA loading decision

**Solution:**

- Created `ClientReCaptchaLoader` component
- Uses `usePathname()` which updates on ALL navigation types
- Real-time pathname tracking for accurate loading decisions

**Result:**

- ✅ Works with direct URL access
- ✅ Works with `<Link>` navigation
- ✅ Works with `router.push()`
- ✅ Works with browser back/forward buttons

For detailed bug analysis, see: `docs/important/RECAPTCHA_BUG_ANALYSIS.md`

---

## reCAPTCHA Loading Strategy

### Client-Side Conditional Loading (Updated System)

The application uses a **client-side dynamic loading** approach that solves the client navigation issue:

1. **ClientReCaptchaLoader** (`app/ClientReCaptchaLoader.tsx`) - Primary loading system
2. **Component-Level Loading** (fallback) - For additional safety

**Why Client-Side?**

- ✅ Works with `<Link>` navigation (client-side routing)
- ✅ Works with direct URL access
- ✅ Updates in real-time on route changes
- ✅ No stale pathname issues

---

## Primary System: ClientReCaptchaLoader

### How It Works

**File: `app/ClientReCaptchaLoader.tsx`**

```typescript
"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { DynamicReCaptcha } from "@/components/DynamicReCaptcha";

export function ClientReCaptchaLoader({ children }: ClientReCaptchaLoaderProps) {
  const pathname = usePathname(); // ✅ Updates on ALL navigation types

  // List of pages that need reCAPTCHA
  const recaptchaPages = [
    "/dashboard/affiliate",
    "/dashboard/analytics",
    "/dashboard/apps",
    "/dashboard/blog",
    "/dashboard/blogs",
    "/dashboard/content",
    "/dashboard/crm",
    "/dashboard/customers",
    "/dashboard/forgot-password",
    "/dashboard/marketing",
    "/dashboard/messages",
    "/dashboard/projects",
    "/dashboard/properties",
    "/dashboard/property-requests",
    "/dashboard/purchase-management",
    "/dashboard/rental-management",
    "/dashboard/reset",
    "/dashboard/settings",
    "/dashboard/templates",
    "/dashboard/whatsapp-ai",
    "/dashboard",
    "/register",
    "/login",
    "/live-editor",
    "/oauth/token/success",
    "/oauth/social/extra-info",
    "/onboarding",
    "/forgot-password",
    "/landing",
    "/get-started",
  ];

  // Determine if current page needs reCAPTCHA
  const shouldLoadReCaptcha = useMemo(() => {
    let cleanPathname = pathname;

    // Remove locale prefix (/ar/ or /en/)
    const localePattern = /^\/(en|ar)\//;
    if (localePattern.test(pathname)) {
      cleanPathname = pathname.replace(/^\/(en|ar)/, "");
    }

    // Check if matches any reCAPTCHA page
    return recaptchaPages.some((page) => {
      return cleanPathname === page || cleanPathname.startsWith(page + "/");
    });
  }, [pathname]);

  // Conditionally wrap children
  if (shouldLoadReCaptcha) {
    return <DynamicReCaptcha>{children}</DynamicReCaptcha>;
  }

  return <>{children}</>;
}
```

### Usage in Layout

**File: `app/layout.tsx`**

```typescript
import { ClientReCaptchaLoader } from "./ClientReCaptchaLoader";

export default async function RootLayout({ children }) {
  return (
    <html lang="ar" dir={dir}>
      <body>
        <ThemeProvider>
          <Toaster />
          <ClientReCaptchaLoader>
            <ClientLayout>{children}</ClientLayout>
          </ClientReCaptchaLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Detection Logic

```typescript
const shouldLoadReCaptcha = useMemo(() => {
  let cleanPathname = pathname;

  // Remove locale prefix if present
  const localePattern = /^\/(en|ar)\//;
  if (localePattern.test(pathname)) {
    cleanPathname = pathname.replace(/^\/(en|ar)/, "");
  }

  // Check if current path matches any reCAPTCHA page
  return recaptchaPages.some((page) => {
    return cleanPathname === page || cleanPathname.startsWith(page + "/");
  });
}, [pathname]);
```

**Examples:**

- `/login` → shouldLoadReCaptcha = `true`
- `/ar/login` → shouldLoadReCaptcha = `true` ✓ (locale removed)
- `/en/register` → shouldLoadReCaptcha = `true` ✓
- `/get-started` → shouldLoadReCaptcha = `true`
- `/ar/get-started` → shouldLoadReCaptcha = `true` ✓ (locale removed)
- `/dashboard/analytics` → shouldLoadReCaptcha = `true`
- `/ar/dashboard/settings` → shouldLoadReCaptcha = `true` ✓
- `/about-us` → shouldLoadReCaptcha = `false`
- `/property/123` → shouldLoadReCaptcha = `false`

### Flow (All Navigation Types)

```
User navigates to page (ANY method: direct URL, <Link>, router.push, back button)
  ↓
ClientReCaptchaLoader.pathname updates (usePathname hook)
  ↓
useMemo recalculates shouldLoadReCaptcha
  ↓
Is page in recaptchaPages list?
  ├─ YES → Render <DynamicReCaptcha>{children}</DynamicReCaptcha>
  │         ↓
  │         Load reCAPTCHA script
  │         ↓
  │         Provide executeRecaptcha() to children
  │
  └─ NO → Render <>{children}</>
          ↓
          No reCAPTCHA script loaded
          ↓
          executeRecaptcha() = undefined
```

### Why This Works for Client Navigation

**Old System (Broken):**

```
Server Component uses headers() → pathname from middleware
  ↓
Client navigation (<Link>) doesn't trigger middleware
  ↓
pathname stays stale → wrong shouldLoadReCaptcha value
  ↓
reCAPTCHA doesn't load on <Link> navigation ✗
```

**New System (Fixed):**

```
Client Component uses usePathname() → pathname from Next.js router
  ↓
Client navigation (<Link>) triggers router update
  ↓
usePathname() updates → correct pathname value
  ↓
shouldLoadReCaptcha recalculates correctly
  ↓
reCAPTCHA loads on ALL navigation types ✓
```

---

## Fallback System: Component-Level Loading

### LoginPageWithReCaptcha Wrapper

**File: `components/signin-up/LoginPageWithReCaptcha.tsx`**

```typescript
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import dynamic from 'next/dynamic';

const GoogleReCaptchaProvider = dynamic(
  () => import('react-google-recaptcha-v3').then(mod => mod.GoogleReCaptchaProvider),
  { ssr: false, loading: () => null }
);

function LocalReCaptchaWrapper({ children }: { children: ReactNode }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [needsLocalWrapper, setNeedsLocalWrapper] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Wait 1 second to check if ReCAPTCHA is available from layout
    const timer = setTimeout(() => {
      if (!executeRecaptcha) {
        // If not available, load local wrapper
        setNeedsLocalWrapper(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [executeRecaptcha]);

  if (!mounted) {
    return <>{children}</>;
  }

  // If ReCAPTCHA available from layout, use it
  if (executeRecaptcha || !needsLocalWrapper) {
    return <>{children}</>;
  }

  // If not available, load local wrapper
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{ async: true, defer: true, appendTo: "head" }}
      container={{ parameters: { badge: 'bottomleft', theme: 'light' } }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

export function LoginPageWithReCaptcha({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <LocalReCaptchaWrapper>{children}</LocalReCaptchaWrapper>;
}
```

**Why this fallback?**

- Ensures reCAPTCHA always loads, even if page is not in ClientReCaptchaLoader's list
- Prevents errors if logic changes
- Provides redundancy for critical auth pages
- **Note:** With ClientReCaptchaLoader, this is rarely needed but kept for safety

### Usage Example

```typescript
// components/signin-up/login-page.tsx
export function LoginPage() {
  return (
    <LoginPageWithReCaptcha>
      <LoginPageContent />
    </LoginPageWithReCaptcha>
  );
}
```

---

## reCAPTCHA Wrapper Components

### 1. ClientReCaptchaLoader (Primary System)

**File: `app/ClientReCaptchaLoader.tsx`**

```typescript
"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { DynamicReCaptcha } from "@/components/DynamicReCaptcha";

export function ClientReCaptchaLoader({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // Real-time pathname tracking

  const shouldLoadReCaptcha = useMemo(() => {
    // Remove locale, check if page needs reCAPTCHA
  }, [pathname]);

  if (shouldLoadReCaptcha) {
    return <DynamicReCaptcha>{children}</DynamicReCaptcha>;
  }

  return <>{children}</>;
}
```

**Key Features:**

- **Client-side component** (`"use client"`)
- **Real-time pathname tracking** via `usePathname()`
- **Works with all navigation types**
- **Memoized for performance**
- **Locale-aware** (removes `/ar/` or `/en/` prefix)

**Used in:** `app/layout.tsx` (wraps entire app)

### 2. DynamicReCaptcha (Dynamic Loader)

**File: `components/DynamicReCaptcha.tsx`**

```typescript
"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const ReCaptchaClientWrapper = dynamic(
  () => import('./ReCaptchaClientWrapper').then(mod => ({ default: mod.ReCaptchaClientWrapper })),
  { ssr: false, loading: () => null }
);

export function DynamicReCaptcha({ children }: { children: ReactNode }) {
  return <ReCaptchaClientWrapper>{children}</ReCaptchaClientWrapper>;
}
```

**Key Features:**

- Dynamic import (client-side only)
- SSR disabled (`ssr: false`)
- No loading fallback (loads transparently)

**Used by:** ClientReCaptchaLoader (when page needs reCAPTCHA)

### 3. ReCaptchaClientWrapper (Core Implementation)

**File: `components/ReCaptchaClientWrapper.tsx`**

```typescript
"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function ReCaptchaClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(0);
  const prevPathname = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only when pathname changes
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;

      // Cleanup old ReCAPTCHA
      const cleanupReCaptcha = () => {
        try {
          // Remove old badges
          const badges = document.querySelectorAll('.grecaptcha-badge');
          badges.forEach(badge => {
            const parent = badge.parentElement;
            if (parent) parent.remove();
          });

          // Remove old iframes
          const iframes = document.querySelectorAll('iframe[src*="recaptcha"]');
          iframes.forEach(iframe => iframe.remove());

          // Reset grecaptcha
          if (typeof window !== 'undefined' && (window as any).grecaptcha) {
            try {
              (window as any).grecaptcha.reset?.();
            } catch (e) {
              console.log('grecaptcha reset failed:', e);
            }
          }
        } catch (error) {
          console.log('Cleanup error:', error);
        }
      };

      cleanupReCaptcha();

      // Remount with new key
      const timer = setTimeout(() => {
        setKey(prev => prev + 1);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <GoogleReCaptchaProvider
      key={key} // Force remount on route change
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{ async: true, defer: true, appendTo: "head" }}
      container={{ parameters: { badge: 'bottomleft', theme: 'light' } }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
```

**Key Features:**

- **Automatic cleanup** on route change
- **Remounts with new key** to prevent stale state
- **Removes duplicate badges** and iframes
- **Resets grecaptcha instance** for fresh state

**Used by:** DynamicReCaptcha component

### 4. ReCaptchaWrapper (Simple Version - Legacy)

**File: `components/ReCaptchaWrapper.tsx`**

```typescript
"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode, useEffect } from "react";

export function ReCaptchaWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      const recaptchaScripts = document.querySelectorAll('script[src*="recaptcha"]');
      const recaptchaBadges = document.querySelectorAll('.grecaptcha-badge');

      // Don't remove scripts/badges - let library handle it
    };
  }, []);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{ async: true, defer: true, appendTo: "head" }}
      container={{ parameters: { badge: 'bottomleft', theme: 'light' } }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
```

**Usage:** Simple wrapper without cleanup logic (used in older components).

---

## Using reCAPTCHA in Components

### Hook: useGoogleReCaptcha()

```typescript
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function MyFormComponent() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async () => {
    if (!executeRecaptcha) {
      console.error("reCAPTCHA not available");
      return;
    }

    const token = await executeRecaptcha("form_submit");
    // Use token in API call
  };
}
```

### Action Names (Best Practices)

Each form/action should have a unique action name:

```typescript
// Login
const token = await executeRecaptcha("login");

// Register
const token = await executeRecaptcha("register");

// Google Register
const token = await executeRecaptcha("google_register");

// Forgot Password
const token = await executeRecaptcha("forgot_password");

// Reset Password
const token = await executeRecaptcha("reset_password");

// Landing Page Register
const token = await executeRecaptcha("register");

// Get Started Page (Event Registration)
const token = await executeRecaptcha("get_started_registration");
```

**Why unique names?**

- Better analytics in Google reCAPTCHA Admin Console
- Can track which forms have bot issues
- Can set different score thresholds per action

---

## Complete Integration Examples

### Example 1: Login Page

**File: `components/signin-up/login-page.tsx`**

```typescript
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function LoginPageContent() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Monitor reCAPTCHA readiness with retry
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;

    const checkRecaptcha = () => {
      if (executeRecaptcha) {
        setRecaptchaReady(true);
        return true;
      }
      return false;
    };

    // Immediate check
    if (checkRecaptcha()) return;

    // Retry every 500ms
    const interval = setInterval(() => {
      retryCount++;

      if (checkRecaptcha()) {
        clearInterval(interval);
      } else if (retryCount >= maxRetries) {
        clearInterval(interval);
        console.warn('ReCAPTCHA failed to load after multiple retries');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [executeRecaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if reCAPTCHA is available
    if (!executeRecaptcha) {
      setErrors({
        general: "reCAPTCHA غير متاح بعد. يرجى الانتظار قليلاً والمحاولة مرة أخرى.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Execute reCAPTCHA
      const token = await executeRecaptcha("login");

      // Call login API with token
      const { login } = useAuthStore.getState();
      const result = await login(email, password, token);

      if (result.success) {
        router.push("/dashboard");
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Show loading indicator if reCAPTCHA not ready */}
      {!recaptchaReady && (
        <div className="p-2 bg-blue-50 border border-blue-200 text-blue-700">
          <svg className="animate-spin h-3 w-3">...</svg>
          جاري تحميل التحقق الأمني...
        </div>
      )}

      {/* Input fields */}

      <Button
        type="submit"
        disabled={isLoading || !recaptchaReady}
      >
        تسجيل الدخول
      </Button>
    </form>
  );
}

// Wrap with fallback provider
export function LoginPage() {
  return (
    <LoginPageWithReCaptcha>
      <LoginPageContent />
    </LoginPageWithReCaptcha>
  );
}
```

**Key Points:**

1. **Readiness check** with retry mechanism (up to 10 attempts)
2. **Loading indicator** shown while reCAPTCHA initializes
3. **Button disabled** until reCAPTCHA is ready
4. **Fallback wrapper** ensures reCAPTCHA always loads

### Example 2: Register Page

**File: `components/signin-up/register-page.tsx`**

```typescript
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function RegisterPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form fields first
    const hasErrors = validateFormFields();
    if (hasErrors) return;

    try {
      // Check if reCAPTCHA is available
      if (!executeRecaptcha) {
        setErrors({
          general: "reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.",
        });
        return;
      }

      // Get reCAPTCHA token
      const token = await executeRecaptcha("register");

      // Prepare payload
      const payload = {
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        username: formData.subdomain,
        recaptcha_token: token, // Include token in request
      };

      // Call register API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/register`,
        payload,
      );

      // Handle success
      if (response.status === 200) {
        const { user, token: UserToken } = response.data;

        // Set auth
        await setAuth(user, UserToken);

        // Redirect to onboarding
        router.push("/onboarding");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;

        // Handle specific errors
        if (/recaptcha failed/i.test(errorMessage)) {
          setErrors({
            api: "فشل التحقق من reCAPTCHA. يرجى إعادة المحاولة أو تحديث الصفحة.",
          });
        } else if (errorMessage.includes("The email has already been taken")) {
          setErrors({ api: "هذا البريد الإلكتروني مسجل بالفعل." });
        }
      }
    }
  };
}
```

### Example 3: Forgot Password Page

**File: `components/signin-up/forgot-password-page.tsx`**

```typescript
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function ForgotPasswordPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.");
      return;
    }

    setIsLoading(true);
    try {
      // Execute reCAPTCHA with unique action name
      const recaptchaToken = await executeRecaptcha("forgot_password");

      // Prepare request body
      const requestBody = {
        identifier: identifier.trim(),
        method: method, // "email" or "phone"
        recaptcha_token: recaptchaToken,
      };

      // Call API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("تم إرسال رمز إعادة التعيين بنجاح");
        setShowCodeForm(true);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    if (!executeRecaptcha) {
      toast.error("reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.");
      return;
    }

    const recaptchaToken = await executeRecaptcha("forgot_password");
    // ... same API call
  };
}
```

### Example 4: Reset Password Page

**File: `components/signin-up/reset-password-page.tsx`**

```typescript
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function ResetPasswordPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.");
      return;
    }

    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("reset_password");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/verify-reset-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: resetCode,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
            recaptcha_token: recaptchaToken,
          }),
        },
      );

      if (response.ok) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        router.push("/login");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };
}
```

### Example 5: Google OAuth Registration

**File: `components/signin-up/google-register-page.tsx`**

```typescript
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function GoogleRegisterPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!executeRecaptcha) {
        setErrors({
          general: "reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.",
        });
        return;
      }

      // Execute reCAPTCHA with unique action
      const recaptchaToken = await executeRecaptcha("google_register");

      const payload = {
        phone: formData.phone,
        username: formData.subdomain,
        temp_token: tempToken, // From Google OAuth flow
        recaptcha_token: recaptchaToken,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/register`,
        payload,
      );

      // Handle success
    } catch (error) {
      // Handle error
    }
  };
}
```

### Example 6: Landing Page Registration

**File: `components/landing-page.tsx`**

```typescript
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function LandingPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!executeRecaptcha) {
        setErrors({
          general: "reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.",
        });
        return;
      }

      // Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha("register");

      const payload = {
        email: validatedData.email,
        password: validatedData.password,
        phone: validatedData.phone,
        username: validatedData.company.toLowerCase().replace(/\s+/g, "-"),
        recaptcha_token: recaptchaToken,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/register`,
        payload,
      );

      if (response.ok) {
        toast.success("تم إنشاء حسابك بنجاح!");
        router.push("/onboarding");
      }
    } catch (error) {
      // Handle error
    }
  };
}
```

### Example 7: Get Started Event Registration Page

**File: `components/getStartedPage/getStartedPage.tsx`**

```typescript
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function GetStartedPage() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Monitor reCAPTCHA readiness with retry mechanism
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;

    const checkRecaptcha = () => {
      if (executeRecaptcha) {
        setRecaptchaReady(true);
        return true;
      }
      return false;
    };

    if (checkRecaptcha()) return;

    const interval = setInterval(() => {
      retryCount++;

      if (checkRecaptcha()) {
        clearInterval(interval);
      } else if (retryCount >= maxRetries) {
        clearInterval(interval);
        console.warn('reCAPTCHA failed to load after multiple retries');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [executeRecaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if reCAPTCHA is available
    if (!executeRecaptcha) {
      setMessage('reCAPTCHA غير متاح بعد. يرجى الانتظار قليلاً والمحاولة مرة أخرى.');
      return;
    }

    setLoading(true);
    try {
      // Execute reCAPTCHA with unique action name
      const recaptchaToken = await executeRecaptcha('get_started_registration');

      // Send request with token
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/isthara`,
        {
          name,
          phone,
          event: 'معرض بروبتك للتقنيات العقارية',
          timestamp: new Date().toISOString(),
          recaptcha_token: recaptchaToken
        }
      );

      // Check for success: either response.data.success or 2xx status code
      if (response.data.success || (response.status >= 200 && response.status < 300)) {
        setMessage('تم التسجيل بنجاح! شكراً لك');
        setName('');
        setPhone('');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error;

        if (errorMessage && /recaptcha/i.test(errorMessage)) {
          setMessage('فشل التحقق الأمني. يرجى إعادة المحاولة أو تحديث الصفحة.');
        } else {
          setMessage(errorMessage || 'حدث خطأ، الرجاء المحاولة مرة أخرى');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Show loading indicator if reCAPTCHA not ready */}
      {!recaptchaReady && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span>جاري تحميل التحقق الأمني...</span>
        </div>
      )}

      {/* Input fields */}

      <button
        type="submit"
        disabled={loading || !recaptchaReady}
      >
        {loading ? 'جارٍ التسجيل...' : !recaptchaReady ? 'جاري التحميل...' : 'تسجيل'}
      </button>
    </form>
  );
}
```

**Key Points:**

1. **Event-specific registration** - Used for PropTech exhibition
2. **Status code handling** - Checks both `success` flag and 2xx status codes (200, 201)
3. **Readiness monitoring** - 10 retries over 5 seconds
4. **UI feedback** - Loading indicator and disabled button state
5. **Error handling** - Specific messages for reCAPTCHA failures

---

## Backend API Integration

### How Backend Validates reCAPTCHA Token

**Expected by all authenticated endpoints:**

```json
POST /api/login
{
  "email": "user@example.com",
  "password": "password123",
  "recaptcha_token": "03AGdBq24..."
}
```

```json
POST /api/register
{
  "email": "user@example.com",
  "password": "password123",
  "phone": "512345678",
  "username": "mywebsite",
  "recaptcha_token": "03AGdBq24..."
}
```

```json
POST /api/auth/forgot-password
{
  "identifier": "user@example.com",
  "method": "email",
  "recaptcha_token": "03AGdBq24..."
}
```

```json
POST /api/auth/verify-reset-code
{
  "code": "123456",
  "new_password": "newpass123",
  "new_password_confirmation": "newpass123",
  "recaptcha_token": "03AGdBq24..."
}
```

```json
POST /api/isthara
{
  "name": "محمد أحمد",
  "phone": "0512345678",
  "event": "معرض بروبتك للتقنيات العقارية",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "recaptcha_token": "03AGdBq24..."
}
```

### Backend Validation Flow

```
1. Backend receives request with recaptcha_token
   ↓
2. Extract token from request body
   ↓
3. Send verification request to Google:
   POST https://www.google.com/recaptcha/api/siteverify
   Body: {
     secret: "YOUR_SECRET_KEY",
     response: recaptcha_token,
     remoteip: client_ip
   }
   ↓
4. Google responds with:
   {
     "success": true/false,
     "score": 0.0 - 1.0,
     "action": "login",
     "challenge_ts": "timestamp",
     "hostname": "taearif.com"
   }
   ↓
5. Backend checks:
   - success === true
   - score >= 0.5 (threshold)
   - action matches expected action
   ↓
6. If valid:
   - Process request normally
   ↓
7. If invalid:
   - Return error: "reCAPTCHA verification failed"
```

---

## Error Handling

### Common Error Scenarios

#### 1. reCAPTCHA Not Available

```typescript
if (!executeRecaptcha) {
  setErrors({
    general: "reCAPTCHA غير متاح بعد. يرجى الانتظار قليلاً والمحاولة مرة أخرى.",
  });
  return;
}
```

**Causes:**

- Script not loaded yet
- Network issues
- Script blocked by ad blocker
- CSP (Content Security Policy) blocking Google domains

**Solution:**

- Show loading indicator
- Disable submit button
- Retry mechanism
- Fallback to local wrapper

#### 2. reCAPTCHA Verification Failed (Backend)

```typescript
if (axios.isAxiosError(error)) {
  const errorMessage = error.response?.data?.message;

  if (/recaptcha failed/i.test(errorMessage)) {
    setErrors({
      api: "فشل التحقق من reCAPTCHA. يرجى إعادة المحاولة أو تحديث الصفحة.",
    });
  }
}
```

**Causes:**

- Low score (bot detected)
- Token expired (tokens valid for 2 minutes)
- Token used multiple times
- Wrong secret key on backend
- Network issues between backend and Google

**Solution:**

- Ask user to try again
- Refresh page to get new token
- Check backend logs for actual failure reason

#### 3. Token Expiration

```typescript
// reCAPTCHA tokens expire after 2 minutes
const token = await executeRecaptcha("login");

// If API call takes too long, token may expire
setTimeout(
  () => {
    await apiCall(token); // May fail if > 2 minutes
  },
  3 * 60 * 1000,
); // 3 minutes - TOO LATE
```

**Best Practice:**

```typescript
// Execute reCAPTCHA immediately before API call
const handleSubmit = async () => {
  const token = await executeRecaptcha("login");

  // Call API immediately (don't delay)
  await loginAPI(token);
};
```

---

## Pages Using reCAPTCHA

### Summary Table

| Page                       | Action Name                  | Wrapper Source                   | Notes                                         |
| -------------------------- | ---------------------------- | -------------------------------- | --------------------------------------------- |
| `/login`                   | `"login"`                    | ClientReCaptchaLoader + Fallback | Retry mechanism                               |
| `/register`                | `"register"`                 | ClientReCaptchaLoader            | Basic implementation                          |
| `/landing`                 | `"register"`                 | ClientReCaptchaLoader            | Landing page registration form                |
| `/get-started`             | `"get_started_registration"` | ClientReCaptchaLoader            | Event registration form (PropTech exhibition) |
| `/forgot-password`         | `"forgot_password"`          | ClientReCaptchaLoader            | Used twice (send + resend)                    |
| `/oauth/social/extra-info` | `"google_register"`          | ClientReCaptchaLoader            | Completes Google OAuth                        |
| `/dashboard/*`             | Various                      | ClientReCaptchaLoader            | All dashboard pages                           |
| `/live-editor`             | N/A                          | ClientReCaptchaLoader (loaded)   | Future use                                    |
| `/onboarding`              | N/A                          | ClientReCaptchaLoader (loaded)   | Future use                                    |

### Pages NOT Using reCAPTCHA

- `/about-us` - Informational page
- `/solutions` - Marketing page
- `/updates` - News page
- `/privacy-policy` - Legal page
- `/property/[id]` - Property details
- `/project/[id]` - Project details
- `/owner/*` - Owner portal (different auth system)

---

## Advanced Features

### 1. Readiness Monitoring

```typescript
const [recaptchaReady, setRecaptchaReady] = useState(false);

useEffect(() => {
  let retryCount = 0;
  const maxRetries = 10;

  const checkRecaptcha = () => {
    if (executeRecaptcha) {
      setRecaptchaReady(true);
      return true;
    }
    return false;
  };

  // Immediate check
  if (checkRecaptcha()) return;

  // Retry every 500ms up to 10 times (5 seconds total)
  const interval = setInterval(() => {
    retryCount++;

    if (checkRecaptcha()) {
      clearInterval(interval);
    } else if (retryCount >= maxRetries) {
      clearInterval(interval);
      console.warn("ReCAPTCHA failed to load after 5 seconds");
    }
  }, 500);

  return () => clearInterval(interval);
}, [executeRecaptcha]);
```

**Benefits:**

- Handles slow network connections
- Provides user feedback
- Prevents form submission before ready

### 2. Cleanup on Route Change

```typescript
useEffect(() => {
  if (prevPathname.current !== pathname) {
    // Cleanup old ReCAPTCHA instances
    const badges = document.querySelectorAll(".grecaptcha-badge");
    badges.forEach((badge) => {
      const parent = badge.parentElement;
      if (parent) parent.remove();
    });

    const iframes = document.querySelectorAll('iframe[src*="recaptcha"]');
    iframes.forEach((iframe) => iframe.remove());

    // Reset grecaptcha
    if ((window as any).grecaptcha) {
      (window as any).grecaptcha.reset?.();
    }

    // Remount with new key
    setKey((prev) => prev + 1);
  }
}, [pathname]);
```

**Prevents:**

- Multiple reCAPTCHA badges on screen
- Memory leaks from old instances
- Stale tokens from previous pages

### 3. Badge Customization

```typescript
<GoogleReCaptchaProvider
  reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
  container={{
    parameters: {
      badge: 'bottomleft', // Position: bottomright, bottomleft, inline
      theme: 'light',       // Theme: light or dark
    },
  }}
>
  {children}
</GoogleReCaptchaProvider>
```

**Badge Positions:**

- `bottomright` - Bottom right corner
- `bottomleft` - Bottom left corner (used in this project)
- `inline` - Inline with form (for custom positioning)

---

## Complete Flow Diagrams

### Flow 1: Login with reCAPTCHA (Direct URL)

```
1. User types URL: localhost:3000/login
   ↓
2. Browser sends HTTP request → Middleware processes
   ↓
3. Layout (server) renders with ClientReCaptchaLoader
   ↓
4. ClientReCaptchaLoader mounts (client-side)
   ↓
5. usePathname() = "/ar/login" (after middleware redirect)
   ↓
6. Remove locale → cleanPathname = "/login"
   ↓
7. Check: "/login" in recaptchaPages? YES
   ↓
8. shouldLoadReCaptcha = true
   ↓
9. Render: <DynamicReCaptcha>{children}</DynamicReCaptcha>
   ↓
10. DynamicReCaptcha loads ReCaptchaClientWrapper
    ↓
11. ReCaptchaClientWrapper loads GoogleReCaptchaProvider
    ↓
12. Google script loads (async)
    ↓
13. LoginPage component mounts
    ↓
14. LoginPageContent monitors readiness:
    - Check every 500ms (up to 10 times)
    - When ready: setRecaptchaReady(true)
    ↓
15. User sees form:
    - Submit button enabled (recaptchaReady = true)
    ↓
16. User submits form
    ↓
17. executeRecaptcha("login") called
    ↓
18. Google generates token (invisible to user)
    ↓
19. Token sent to backend with credentials
    ↓
20. Backend verifies with Google
    ↓
21. If valid: Login succeeds
    If invalid: Error returned
```

### Flow 1b: Login with reCAPTCHA (Via Link Click) ✅ FIXED

```
1. User on: /about-us (reCAPTCHA not loaded)
   ↓
2. ClientReCaptchaLoader state:
   - pathname = "/ar/about-us"
   - shouldLoadReCaptcha = false
   - Renders: <>{children}</>
   ↓
3. User clicks: <Link href="/login">
   ↓
4. Next.js client-side navigation (no server request)
   ↓
5. usePathname() hook updates: "/ar/login"
   ↓
6. useMemo recalculates:
   - Remove locale → cleanPathname = "/login"
   - Check: "/login" in recaptchaPages? YES
   - shouldLoadReCaptcha = true ✅
   ↓
7. Component re-renders with new condition
   ↓
8. Render: <DynamicReCaptcha>{children}</DynamicReCaptcha>
   ↓
9. DynamicReCaptcha mounts → loads reCAPTCHA
   ↓
10. Google script loads
    ↓
11. LoginPage sees executeRecaptcha ✅
    ↓
12. Form works correctly ✅
```

### Flow 2: Register with reCAPTCHA

```
1. User visits /register (any method: direct or via Link)
   ↓
2. ClientReCaptchaLoader detects:
   - usePathname() = "/ar/register"
   - cleanPathname = "/register"
   - shouldLoadReCaptcha = true
   ↓
3. Renders: <DynamicReCaptcha>{children}</DynamicReCaptcha>
   ↓
4. reCAPTCHA loads
   ↓
5. RegisterPage component renders
   ↓
6. User fills form fields
   ↓
7. User clicks "إنشاء الحساب"
   ↓
8. Check if executeRecaptcha available
   ↓
9. executeRecaptcha("register") called
   ↓
10. Token generated
    ↓
11. POST /api/register with:
    {
      email, password, phone, username,
      recaptcha_token: token
    }
    ↓
12. Backend validates token with Google
    ↓
13. If valid (score >= 0.5):
    - Create user account
    - Return user + auth token
    ↓
14. Frontend sets auth
    ↓
15. Redirect to /onboarding
```

### Flow 3: Forgot Password with reCAPTCHA

```
1. User visits /forgot-password
   ↓
2. ClientReCaptchaLoader detects path → loads reCAPTCHA
   ↓
3. User enters email/phone
   ↓
4. User clicks "إرسال رمز إعادة التعيين"
   ↓
5. executeRecaptcha("forgot_password")
   ↓
6. POST /auth/forgot-password with token
   ↓
7. Backend validates + sends reset code
   ↓
8. User sees code input form
   ↓
9. User clicks "إعادة إرسال الكود"
   ↓
10. executeRecaptcha("forgot_password") again
    ↓
11. New token generated
    ↓
12. POST /auth/forgot-password (resend)
    ↓
13. Backend validates + resends code
```

### Flow 4: Google OAuth with reCAPTCHA

```
1. User clicks "Sign in with Google"
   ↓
2. Redirect to Google OAuth consent
   ↓
3. User approves
   ↓
4. Google redirects to /api/auth/callback/google
   ↓
5. NextAuth processes callback:
   - Check if user exists
   - If new: Need extra info
   ↓
6. Redirect to /oauth/social/extra-info?temp_token=...
   ↓
7. ClientReCaptchaLoader detects path → loads reCAPTCHA
   ↓
8. User fills phone + subdomain
   ↓
9. executeRecaptcha("google_register")
   ↓
10. POST /register with:
    {
      phone, username, temp_token,
      recaptcha_token: token
    }
    ↓
11. Backend validates token + temp_token
    ↓
12. Creates user account
    ↓
13. Returns auth token
    ↓
14. Redirect to /onboarding
```

---

## Best Practices

### 1. Always Check Availability

```typescript
// ✅ GOOD
if (!executeRecaptcha) {
  setErrors({ general: "reCAPTCHA غير متاح." });
  return;
}
const token = await executeRecaptcha("action");

// ❌ BAD
const token = await executeRecaptcha("action"); // May crash if undefined
```

### 2. Use Descriptive Action Names

```typescript
// ✅ GOOD
await executeRecaptcha("login");
await executeRecaptcha("register");
await executeRecaptcha("forgot_password");

// ❌ BAD
await executeRecaptcha("submit");
await executeRecaptcha("form");
await executeRecaptcha("action");
```

### 3. Execute Immediately Before API Call

```typescript
// ✅ GOOD
const handleSubmit = async () => {
  const token = await executeRecaptcha("login");
  await loginAPI(token); // Immediate use
};

// ❌ BAD
const token = await executeRecaptcha("login");
await new Promise((resolve) => setTimeout(resolve, 5000)); // Long delay
await loginAPI(token); // Token may have expired
```

### 4. Handle Errors Gracefully

```typescript
try {
  const token = await executeRecaptcha("login");
  await loginAPI(token);
} catch (error) {
  if (/recaptcha/i.test(error.message)) {
    setErrors({ general: "فشل التحقق الأمني. يرجى تحديث الصفحة." });
  } else {
    setErrors({ general: "حدث خطأ غير متوقع." });
  }
}
```

### 5. Provide User Feedback

```typescript
// Show loading state
{!recaptchaReady && (
  <div className="p-2 bg-blue-50 text-blue-700">
    جاري تحميل التحقق الأمني...
  </div>
)}

// Disable submit button
<Button disabled={isLoading || !recaptchaReady}>
  تسجيل الدخول
</Button>
```

### 6. Check Both Success Flag and Status Code

```typescript
// ✅ GOOD - Handles both success patterns
if (
  response.data.success ||
  (response.status >= 200 && response.status < 300)
) {
  // Success! Handle both:
  // - APIs that return { success: true }
  // - APIs that just return 2xx status (200, 201, etc.)
}

// ❌ BAD - Only checks success flag
if (response.data.success) {
  // Fails when API returns 201 without success flag
}

// ❌ BAD - Only checks status code
if (response.status === 200) {
  // Fails when API returns 201 or 204
}
```

**Why Both?**

- Different APIs have different response patterns
- Some return `{ success: true }` with 200
- Others just return 201 Created without body
- Checking both ensures compatibility

---

## Debugging reCAPTCHA Issues

### Check if reCAPTCHA Loaded

```javascript
// Browser console
console.log(window.grecaptcha); // Should be object, not undefined

// Check for badge
document.querySelector(".grecaptcha-badge"); // Should exist

// Check for script
document.querySelector('script[src*="recaptcha"]'); // Should exist
```

### Check executeRecaptcha Availability

```javascript
// In component
console.log("executeRecaptcha:", executeRecaptcha); // Should be function

// If undefined:
// - Check if page is in recaptchaPages list
// - Check if DynamicReCaptcha wrapper is present
// - Check for console errors
```

### Test Token Generation

```javascript
// In component with useGoogleReCaptcha
const { executeRecaptcha } = useGoogleReCaptcha();

const testRecaptcha = async () => {
  if (!executeRecaptcha) {
    console.error("executeRecaptcha not available");
    return;
  }

  try {
    const token = await executeRecaptcha("test");
    console.log("Token generated:", token.substring(0, 50) + "...");
  } catch (error) {
    console.error("Token generation failed:", error);
  }
};
```

### Common Issues

#### Issue 1: "executeRecaptcha is not a function"

**Cause:** Component not wrapped in GoogleReCaptchaProvider

**Solution:**

- Check if page is in `recaptchaPages` list in `ClientReCaptchaLoader`
- Verify ClientReCaptchaLoader is wrapping app in layout
- Add fallback wrapper (like LoginPageWithReCaptcha)
- Check browser console for errors

**Debug:**

```javascript
// Check current pathname
console.log("Current pathname:", window.location.pathname);

// Check if in recaptchaPages
const recaptchaPages = ["/login", "/register" /* ... */];
const cleanPath = window.location.pathname.replace(/^\/(en|ar)/, "");
console.log("Should load reCAPTCHA:", recaptchaPages.includes(cleanPath));
```

#### Issue 2: "reCAPTCHA works on direct URL but not via Link"

**Cause:** This was the main bug - now FIXED with ClientReCaptchaLoader

**Verification:**

```javascript
// Test the fix:
// 1. Go to /about-us
// 2. Open console
// 3. Check: document.querySelector('.grecaptcha-badge') → should be null
// 4. Click Link to /login
// 5. Wait 1 second
// 6. Check: document.querySelector('.grecaptcha-badge') → should exist ✓
```

**If still broken:**

- Verify ClientReCaptchaLoader is imported in layout
- Check component wrapping order in layout
- Ensure no conditional rendering of ClientReCaptchaLoader

#### Issue 3: "reCAPTCHA غير متاح"

**Cause:** Script blocked or slow to load

**Solution:**

- Check browser console for errors
- Disable ad blockers
- Check network tab for failed requests to Google
- Verify NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set correctly

#### Issue 4: "Multiple reCAPTCHA badges showing"

**Cause:** Provider mounted multiple times without cleanup

**Solution:**

- ReCaptchaClientWrapper handles cleanup automatically
- Check for duplicate ClientReCaptchaLoader instances
- Verify DynamicReCaptcha not used elsewhere

#### Issue 5: Backend rejects token

**Cause:** Token expired, invalid, or low score

**Solution:**

- Execute reCAPTCHA immediately before API call
- Check backend logs for Google's response
- Verify backend has correct SECRET_KEY
- Check score threshold (should be 0.5 or lower)

---

## Security Considerations

### reCAPTCHA v3 Scoring

Google returns a score from **0.0 to 1.0**:

- **1.0**: Very likely human
- **0.5**: Uncertain (recommended threshold)
- **0.0**: Very likely bot

**Backend should:**

```javascript
if (googleResponse.score >= 0.5) {
  // Allow action
} else {
  // Reject or require additional verification
}
```

### Token Security

**DO:**

- ✅ Send token over HTTPS only
- ✅ Validate token on backend (never trust client)
- ✅ Use token immediately (2-minute expiration)
- ✅ Use unique action names for analytics

**DON'T:**

- ❌ Store token in localStorage
- ❌ Reuse tokens across requests
- ❌ Trust client-side validation only
- ❌ Expose SECRET_KEY in frontend

### Environment Variables

```bash
# Frontend (public - can be exposed)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ldqrg0rAAAAAKOdI...

# Backend (private - must be secret)
RECAPTCHA_SECRET_KEY=6Ldqrg0rAAAAAK... (different key)
```

**Important:** SITE_KEY and SECRET_KEY are **different values**!

---

## Performance Optimization

### 1. Conditional Loading

```typescript
// Only load on pages that need it
{shouldLoadReCaptcha ? (
  <DynamicReCaptcha>{children}</DynamicReCaptcha>
) : (
  {children}
)}
```

**Benefits:**

- Reduces script load on pages that don't need it
- Faster page load for informational pages
- Better Core Web Vitals scores

### 2. Dynamic Import

```typescript
const ReCaptchaClientWrapper = dynamic(
  () => import("./ReCaptchaClientWrapper"),
  { ssr: false, loading: () => null },
);
```

**Benefits:**

- Client-side only (no SSR overhead)
- Lazy loaded (not in initial bundle)
- No loading flash (null fallback)

### 3. Script Loading Strategy

```typescript
scriptProps={{
  async: true,      // Non-blocking load
  defer: true,      // Execute after page parse
  appendTo: "head", // Load in head section
}}
```

---

## Summary

### When reCAPTCHA Loads

**Loaded on these pages (via ClientReCaptchaLoader):**

- All `/dashboard/*` pages (20+ pages)
- `/login` - Login page
- `/register` - Registration page
- `/landing` - Landing page with registration form
- `/get-started` - Event registration page (PropTech exhibition)
- `/forgot-password` - Standalone password reset
- `/live-editor` - Live editor
- `/oauth/token/success` - OAuth success callback
- `/oauth/social/extra-info` - Google OAuth extra info
- `/onboarding` - User onboarding

**Total: 30 pages** with reCAPTCHA protection

**NOT loaded on these pages:**

- `/` - Homepage (Taearif landing)
- `/about-us`, `/solutions`, `/updates` - Marketing pages
- `/privacy-policy` - Legal page
- `/property/[id]`, `/project/[id]` - Detail pages
- `/owner/*` - Owner portal (separate auth system)
- Tenant-specific pages on subdomains

### reCAPTCHA Actions Used

| Action Name                | Used In                     | Purpose                                  |
| -------------------------- | --------------------------- | ---------------------------------------- |
| `login`                    | Login page                  | User authentication                      |
| `register`                 | Register page, Landing page | Account creation                         |
| `google_register`          | Google OAuth completion     | OAuth account creation                   |
| `forgot_password`          | Forgot password page        | Password reset request                   |
| `reset_password`           | Reset password page         | Password reset confirmation              |
| `get_started_registration` | Get Started page            | Event registration (PropTech exhibition) |

### Key Components

1. **ClientReCaptchaLoader** - Primary loading system (client-side, uses usePathname)
2. **DynamicReCaptcha** - Dynamic loader, called by ClientReCaptchaLoader
3. **ReCaptchaClientWrapper** - Core wrapper with cleanup logic
4. **ReCaptchaWrapper** - Simple wrapper (legacy)
5. **LoginPageWithReCaptcha** - Fallback wrapper for login page

### Critical Points

1. **Invisible to users** - reCAPTCHA v3 works in background
2. **Token expires in 2 minutes** - Execute immediately before API call
3. **Client-side loading** - Uses usePathname() for real-time updates
4. **Works with all navigation** - Direct URL, `<Link>`, router.push(), back button
5. **Fallback mechanism** - Components can load own provider if needed
6. **Cleanup on navigation** - Prevents duplicate badges/instances
7. **Backend validates** - Never trust client-side validation alone

### Architecture Summary

```
app/layout.tsx (Server Component)
  └─ <ClientReCaptchaLoader> (Client Component)
      ├─ usePathname() → monitors route changes
      ├─ Checks if page needs reCAPTCHA
      └─ Conditionally renders:
          ├─ <DynamicReCaptcha> if needed
          │   └─ <ReCaptchaClientWrapper>
          │       └─ <GoogleReCaptchaProvider>
          │           └─ Provides executeRecaptcha()
          │
          └─ <>{children}</> if not needed
```

This system provides robust bot protection while maintaining excellent user experience with no interaction required, and works correctly with both server and client navigation.
