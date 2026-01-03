/**
 * مجموعة من الأدوات المساعدة للنظام المحسن
 */

// دالة لتوليد ID فريد للمكونات
export const generateComponentId = (componentType: string): string => {
  console.log("🔍 [UTILS] generateComponentId called for:", componentType);
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  const id = `${componentType}-${timestamp}-${random}`;
  console.log("🔍 [UTILS] Generated ID:", id);
  return id;
};

// دالة للتحقق من صحة البيانات
export const validateComponentData = (data: any): boolean => {
  console.log("🔍 [UTILS] validateComponentData called with:", data);
  const isValid =
    data &&
    typeof data.componentType === "string" &&
    typeof data.zone === "string" &&
    typeof data.index === "number";
  console.log("🔍 [UTILS] Validation result:", isValid);
  return isValid;
};

// دالة لحساب الموضع الأمثل للإفلات
export const calculateOptimalDropPosition = (
  dragY: number,
  targetElements: HTMLElement[],
): number => {
  console.log("🔍 [UTILS] calculateOptimalDropPosition called:", {
    dragY,
    elementsCount: targetElements.length,
  });

  if (targetElements.length === 0) {
    console.log("🔍 [UTILS] No target elements, returning 0");
    return 0;
  }

  for (let i = 0; i < targetElements.length; i++) {
    const element = targetElements[i];
    const rect = element.getBoundingClientRect();

    if (dragY < rect.top + rect.height / 2) {
      console.log("🔍 [UTILS] Found optimal position at index:", i);
      return i;
    }
  }

  console.log(
    "🔍 [UTILS] No optimal position found, returning end:",
    targetElements.length,
  );
  return targetElements.length;
};

// دالة للتحقق من دعم الجهاز للميزات المتقدمة
export const getDeviceCapabilities = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent,
    );
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return {
    isMobile,
    isTouch,
    supportsTransforms: "transform" in document.documentElement.style,
    supportsAnimations: "animation" in document.documentElement.style,
    supportsBackdropFilter: "backdropFilter" in document.documentElement.style,
  };
};

// دالة لتحسين الأداء عبر debouncing
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// دالة لتحسين الأداء عبر throttling
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// دالة للحصول على معلومات الجهاز للتحسين
export const getDeviceInfo = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;

  let deviceType: "mobile" | "tablet" | "desktop";

  if (width < 768) {
    deviceType = "mobile";
  } else if (width < 1024) {
    deviceType = "tablet";
  } else {
    deviceType = "desktop";
  }

  return {
    width,
    height,
    devicePixelRatio,
    deviceType,
    aspectRatio: width / height,
  };
};

// دالة لتحسين الانيميشن بناءً على تفضيلات المستخدم
export const getAnimationPreferences = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const prefersHighContrast = window.matchMedia(
    "(prefers-contrast: high)",
  ).matches;

  return {
    prefersReducedMotion,
    prefersHighContrast,
    animationDuration: prefersReducedMotion ? 0 : 200,
    animationEasing: "cubic-bezier(0.2, 0, 0, 1)",
  };
};

// دالة لتحسين الألوان حسب النسق
export const getThemeColors = (isDark: boolean = false) => {
  return {
    primary: isDark ? "#60a5fa" : "#3b82f6",
    secondary: isDark ? "#34d399" : "#10b981",
    accent: isDark ? "#a78bfa" : "#8b5cf6",
    success: isDark ? "#4ade80" : "#22c55e",
    warning: isDark ? "#fbbf24" : "#f59e0b",
    error: isDark ? "#f87171" : "#ef4444",
    surface: isDark ? "#1f2937" : "#ffffff",
    background: isDark ? "#111827" : "#f9fafb",
    text: isDark ? "#f9fafb" : "#111827",
    textSecondary: isDark ? "#d1d5db" : "#6b7280",
    border: isDark ? "#374151" : "#e5e7eb",
    borderHover: isDark ? "#4b5563" : "#d1d5db",
  };
};

// دالة للكشف عن الجهاز وتحسين التجربة
export const optimizeForDevice = () => {
  const capabilities = getDeviceCapabilities();
  const deviceInfo = getDeviceInfo();
  const animationPrefs = getAnimationPreferences();

  return {
    // تقليل الانيميشن على الأجهزة الضعيفة
    shouldReduceAnimations:
      capabilities.isMobile || animationPrefs.prefersReducedMotion,

    // تحسين اللمس للأجهزة التي تدعمه
    touchOptimizations: capabilities.isTouch,

    // تحسين الأداء للأجهزة المحمولة
    performanceMode: capabilities.isMobile ? "optimized" : "enhanced",

    // إعدادات الانيميشن المحسنة
    animation: {
      duration: animationPrefs.animationDuration,
      easing: animationPrefs.animationEasing,
    },

    // إعدادات العرض المحسنة
    display: {
      deviceType: deviceInfo.deviceType,
      showAdvancedFeatures: !capabilities.isMobile,
      highDensityDisplay: deviceInfo.devicePixelRatio > 1,
    },
  };
};
