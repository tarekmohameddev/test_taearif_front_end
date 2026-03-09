"use client";

import { useState, useCallback } from "react";
import { getWaCampaigns, getWhatsAppApiErrorMessage } from "@/lib/services/whatsapp-api";
import type { ApiWaCampaign } from "../types";
import type { Pagination } from "@/lib/services/whatsapp-api";

const DEFAULT_PER_PAGE = 20;

export function useWaCampaigns() {
  const [campaigns, setCampaigns] = useState<ApiWaCampaign[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
    last_page: 1,
  });
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWaCampaigns({
        page: pagination.current_page,
        per_page: pagination.per_page,
        status: statusFilter || undefined,
      });
      setCampaigns(res.campaigns);
      setPagination(res.pagination);
    } catch (e) {
      setError(getWhatsAppApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [pagination.current_page, pagination.per_page, statusFilter]);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  }, []);

  const setStatusFilterValue = useCallback((value: string) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, []);

  return {
    campaigns,
    pagination,
    loading,
    error,
    statusFilter,
    setStatusFilter: setStatusFilterValue,
    setPage,
    fetchCampaigns,
  };
}
