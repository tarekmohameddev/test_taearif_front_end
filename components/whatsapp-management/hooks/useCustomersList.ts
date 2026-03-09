"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getCustomersList } from "@/lib/services/customers-hub-list-api";
import type { CustomerOption } from "@/components/customComponents/CustomersCheckboxesDropdown";
import { CUSTOMERS_PAGE_SIZE } from "../constants";

export function useCustomersList(pageSize: number = CUSTOMERS_PAGE_SIZE) {
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const mapCustomer = (c: { id: number | string; name?: string | null; phone?: string }): CustomerOption => ({
    id: typeof c.id === "string" ? c.id : c.id,
    name: c.name ?? "",
    phone: c.phone,
  });

  const loadInitial = useCallback(() => {
    setLoading(true);
    setPage(1);
    getCustomersList({
      action: "list",
      filters: {},
      pagination: { page: 1, limit: pageSize },
    })
      .then((res) => {
        const list = res.data?.customers ?? [];
        const pag = res.data?.pagination;
        setCustomers(list.map(mapCustomer));
        setHasMore(Boolean(pag && pag.currentPage < pag.totalPages));
      })
      .catch(() => {
        toast.error("فشل تحميل قائمة العملاء");
        setCustomers([]);
        setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, [pageSize]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setLoadMoreLoading(true);
    getCustomersList({
      action: "list",
      filters: {},
      pagination: { page: nextPage, limit: pageSize },
    })
      .then((res) => {
        const list = res.data?.customers ?? [];
        const pag = res.data?.pagination;
        setCustomers((prev) => [...prev, ...list.map(mapCustomer)]);
        setPage(nextPage);
        setHasMore(Boolean(pag && pag.currentPage < pag.totalPages));
      })
      .catch(() => toast.error("فشل تحميل المزيد"))
      .finally(() => setLoadMoreLoading(false));
  }, [page, pageSize]);

  const reset = useCallback(() => {
    setCustomers([]);
    setPage(1);
    setHasMore(false);
  }, []);

  return {
    customers,
    page,
    hasMore,
    loading,
    loadMoreLoading,
    loadInitial,
    loadMore,
    reset,
  };
}
