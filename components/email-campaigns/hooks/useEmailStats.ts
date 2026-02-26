"use client";

import { useState, useCallback } from "react";
import { getStats } from "@/lib/services/email-api";
import type { EmailStats } from "../types";
import { DEFAULT_STATS } from "../constants";

export function useEmailStats() {
  const [stats, setStats] = useState<EmailStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStats();
      setStats({
        totalCampaigns: res.total_campaigns ?? 0,
        totalSent: res.total_sent ?? 0,
        totalDelivered: res.total_delivered ?? 0,
        totalFailed: res.total_failed ?? 0,
        deliveryRate: res.delivery_rate ?? 0,
        thisMonthSent: res.this_month_sent ?? 0,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "فشل تحميل الإحصائيات";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, fetchStats };
}
