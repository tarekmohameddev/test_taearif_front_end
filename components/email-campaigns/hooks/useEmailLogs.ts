"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getLogs } from "@/lib/services/email-api";
import type { EmailLog } from "../types";
import { mapApiLogToUI } from "../types";

export function useEmailLogs() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLogs({ per_page: 50 });
      setLogs((res.logs ?? []).map(mapApiLogToUI));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "فشل تحميل السجل";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { logs, loading, error, fetchLogs };
}
