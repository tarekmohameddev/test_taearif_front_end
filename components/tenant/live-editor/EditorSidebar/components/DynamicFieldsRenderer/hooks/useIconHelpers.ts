import { useMemo, useCallback } from "react";
import * as LucideIcons from "lucide-react";
import * as ReactIconsFa from "react-icons/fa";
import * as ReactIconsMd from "react-icons/md";

export const useIconHelpers = () => {
  // Create icon cache using useMemo for better performance
  const iconCache = useMemo(() => {
    const cache = new Map<string, React.ComponentType<any> | null>();

    // Pre-populate cache with common icons
    const commonLucideIcons = [
      "UserCircle",
      "Building2",
      "GraduationCap",
      "TrendingUp",
      "Briefcase",
      "Settings",
      "Home",
      "MapPin",
      "Phone",
      "Mail",
    ];
    commonLucideIcons.forEach((iconName) => {
      const icon = (LucideIcons as any)[iconName];
      if (icon) cache.set(`lucide:${iconName}`, icon);
    });

    return cache;
  }, []);

  // Helper function to get icon component dynamically with caching
  const getIconComponent = useCallback(
    (iconName: string, iconLibrary?: string) => {
      if (!iconName) return null;

      const cacheKey = `${iconLibrary || "lucide"}:${iconName}`;

      // Check cache first
      if (iconCache.has(cacheKey)) {
        return iconCache.get(cacheKey) || null;
      }

      try {
        let icon: React.ComponentType<any> | null = null;

        if (iconLibrary === "lucide" || !iconLibrary) {
          // Try lucide-react icons
          icon = (LucideIcons as any)[iconName] || null;
          if (icon) {
            iconCache.set(cacheKey, icon);
            return icon;
          }
        }

        if (iconLibrary === "react-icons") {
          // Try react-icons Font Awesome first (most common)
          if (iconName.startsWith("Fa")) {
            icon = (ReactIconsFa as any)[iconName] || null;
            if (icon) {
              iconCache.set(cacheKey, icon);
              return icon;
            }
          }

          // Try react-icons Material Design
          if (iconName.startsWith("Md")) {
            icon = (ReactIconsMd as any)[iconName] || null;
            if (icon) {
              iconCache.set(cacheKey, icon);
              return icon;
            }
          }

          // Try all react-icons if prefix doesn't match
          icon =
            (ReactIconsFa as any)[iconName] ||
            (ReactIconsMd as any)[iconName] ||
            null;
          if (icon) {
            iconCache.set(cacheKey, icon);
            return icon;
          }
        }

        // Fallback: try lucide-react if no library specified
        if (!icon) {
          icon = (LucideIcons as any)[iconName] || null;
          if (icon) {
            iconCache.set(cacheKey, icon);
            return icon;
          }
        }

        // Cache null result to avoid repeated lookups
        iconCache.set(cacheKey, null);
        return null;
      } catch (error) {
        iconCache.set(cacheKey, null);
        return null;
      }
    },
    [iconCache],
  );

  // Memoize React Icon check function
  const isReactIcon = useCallback((iconName: string): boolean => {
    return (
      iconName.startsWith("Fa") ||
      iconName.startsWith("Md") ||
      iconName.startsWith("Io") ||
      iconName.startsWith("Bi") ||
      iconName.startsWith("Bs") ||
      iconName.startsWith("Hi") ||
      iconName.startsWith("Ai") ||
      iconName.startsWith("Ti") ||
      iconName.startsWith("Gi") ||
      iconName.startsWith("Si") ||
      iconName.startsWith("Ri") ||
      iconName.startsWith("Tb") ||
      iconName.startsWith("Vsc") ||
      iconName.startsWith("Wi") ||
      iconName.startsWith("Di") ||
      iconName.startsWith("Im")
    );
  }, []);

  return { iconCache, getIconComponent, isReactIcon };
};
