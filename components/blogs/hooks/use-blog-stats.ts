/**
 * useBlogStats Hook
 * 
 * @description Hook لجلب الإحصائيات (إجمالي المقالات، المشاهدات، التصنيفات)
 * 
 * @dependencies
 * - Uses: services/blog-api.ts (getBlogStats)
 * - Used by: components/stats/blog-stats-cards.tsx
 * 
 * @returns {Object} { stats, loading, error, refetch }
 * 
 * @related
 * - types/blog.types.ts (BlogStats type)
 * - services/blog-api.ts (API calls)
 * - components/stats/blog-stats-cards.tsx (يعرض البيانات)
 */

import { useState, useEffect } from "react";
import { blogApi } from "../services/blog-api";
import type { BlogStats } from "../types/blog.types";
import useAuthStore from "@/context/AuthContext";
import { selectUserData, selectIsLoading } from "@/context/auth/selectors";

export function useBlogStats() {
  const userData = useAuthStore(selectUserData);
  const authLoading = useAuthStore(selectIsLoading);
  const [stats, setStats] = useState<BlogStats>({
    total_blogs: 0,
    total_views: 0,
    total_categories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      // جلب الإحصائيات (قد يكون endpoint منفصل أو يتم حسابه من البيانات)
      const data = await blogApi.getBlogStats();
      setStats(data);
    } catch (err: any) {
      console.error("Error fetching blog stats:", err);
      setError(err.message || "فشل في تحميل الإحصائيات");
      setStats({
        total_blogs: 0,
        total_views: 0,
        total_categories: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    fetchStats();
  }, [authLoading, userData?.token]); // Include token and authLoading in dependencies

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
