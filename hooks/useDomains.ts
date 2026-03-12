"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import toast from "react-hot-toast";
import type {
  Domain,
  DnsInstructions,
  DomainStatusFilter,
} from "@/components/settings/types";
import { DOMAIN_STATUS } from "@/components/settings/constants";
import { validateDomainInput } from "@/components/settings/utils/domainValidation";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { data?: { message?: string } } })
      .response;
    if (res?.data?.message) return res.data.message;
  }
  return fallback;
}

export interface UseDomainsReturn {
  domains: Domain[];
  dnsInstructions: DnsInstructions | null;
  isLoading: boolean;
  statusFilter: DomainStatusFilter;
  setStatusFilter: (v: DomainStatusFilter) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredDomains: Domain[];
  verifyingDomains: Record<string, boolean>;
  deleteDomainId: string | null;
  isDeleteDialogOpen: boolean;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
  isAddDomainOpen: boolean;
  setIsAddDomainOpen: (v: boolean) => void;
  newDomain: string;
  setNewDomain: (v: string) => void;
  hasFormatError: boolean;
  setHasFormatError: (v: boolean) => void;
  errorMessage: string;
  setErrorMessage: (v: string) => void;
  handleAddDomain: () => Promise<void>;
  handleVerifyDomain: (domainId: string) => Promise<void>;
  handleSetPrimaryDomain: (domainId: string) => Promise<void>;
  handleDeleteDomain: () => Promise<void>;
  clearFilters: () => void;
}

export function useDomains(): UseDomainsReturn {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [dnsInstructions, setDnsInstructions] = useState<DnsInstructions | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<DomainStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifyingDomains, setVerifyingDomains] = useState<
    Record<string, boolean>
  >({});
  const [deleteDomainId, setDeleteDomainId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [hasFormatError, setHasFormatError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isAuthReady = !authLoading && !!userData?.token;

  const fetchDomains = useCallback(async () => {
    if (!isAuthReady) return;
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/settings/domain");
      setDomains(response.data.domains ?? []);
      setDnsInstructions(response.data.dnsInstructions ?? null);
    } catch (error) {
      console.error("Error fetching domains:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthReady]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const filteredDomains = domains.filter((domain) => {
    if (statusFilter !== "all") {
      if (statusFilter === DOMAIN_STATUS.ACTIVE && domain.status !== "active")
        return false;
      if (statusFilter === DOMAIN_STATUS.PENDING && domain.status !== "pending")
        return false;
    }
    if (searchQuery && !domain.custom_name.includes(searchQuery)) return false;
    return true;
  });

  const handleAddDomain = useCallback(async () => {
    const validation = validateDomainInput(newDomain);
    if (!validation.valid) {
      toast.error(validation.error);
      setErrorMessage(validation.error ?? "");
      setHasFormatError(true);
      return;
    }
    if (!isAuthReady) return;

    const loadingToast = toast.loading("جاري إضافة النطاق...");
    try {
      const response = await axiosInstance.post("/settings/domain", {
        custom_name: newDomain.trim(),
      });
      const addedDomain: Domain = {
        ...response.data.data,
        status: "pending",
      };
      setDomains((prev) => [...prev, addedDomain]);
      setNewDomain("");
      setIsAddDomainOpen(false);
      toast.dismiss(loadingToast);
      toast.success("تمت إضافة النطاق بنجاح");
      setErrorMessage("");
      setHasFormatError(false);
      try {
        await useAuthStore.getState().fetchUserFromAPI();
      } catch (e) {
        console.warn("Could not refresh user after add domain:", e);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const msg = getErrorMessage(error, "حدث خطأ أثناء إضافة النطاق");
      toast.error(msg);
      setErrorMessage(msg);
    }
  }, [newDomain, isAuthReady]);

  const handleVerifyDomain = useCallback(
    async (domainId: string) => {
      if (!isAuthReady) return;
      setVerifyingDomains((prev) => ({ ...prev, [domainId]: true }));
      const loadingToast = toast.loading("جاري التحقق من النطاق...");
      try {
        const response = await axiosInstance.post("/settings/domain/verify", {
          id: domainId,
        });
        const verifiedDomain: Domain = response.data.data;
        setDomains((prev) =>
          prev.map((d) => (d.id === domainId ? verifiedDomain : d)),
        );
        toast.dismiss(loadingToast);
        toast.success("تم التحقق من النطاق بنجاح");
        try {
          await useAuthStore.getState().fetchUserFromAPI();
        } catch (e) {
          console.warn("Could not refresh user after verify domain:", e);
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("حدث خطأ أثناء التحقق من النطاق");
      } finally {
        setVerifyingDomains((prev) => ({ ...prev, [domainId]: false }));
      }
    },
    [isAuthReady],
  );

  const handleSetPrimaryDomain = useCallback(
    async (domainId: string) => {
      if (!isAuthReady) return;
      const loadingToast = toast.loading("جاري تحديث النطاق الرئيسي...");
      try {
        await axiosInstance.post("/settings/domain/set-primary", {
          id: domainId,
        });
        setDomains((prev) =>
          prev.map((d) => ({ ...d, primary: d.id === domainId })),
        );
        toast.dismiss(loadingToast);
        toast.success("تم تحديث النطاق الرئيسي بنجاح");
        try {
          await useAuthStore.getState().fetchUserFromAPI();
        } catch (e) {
          console.warn("Could not refresh user after set-primary domain:", e);
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("حدث خطأ أثناء تحديث النطاق الرئيسي");
      }
    },
    [isAuthReady],
  );

  const handleDeleteDomain = useCallback(async () => {
    if (!deleteDomainId || !isAuthReady) return;
    const loadingToast = toast.loading("جاري حذف النطاق...");
    try {
      await axiosInstance.delete(`/settings/domain/${deleteDomainId}`);
      setDomains((prev) => prev.filter((d) => d.id !== deleteDomainId));
      toast.dismiss(loadingToast);
      toast.success("تم حذف النطاق بنجاح");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف النطاق"));
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteDomainId(null);
    }
  }, [deleteDomainId, isAuthReady]);

  const openDeleteDialog = useCallback((id: string) => {
    setDeleteDomainId(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setDeleteDomainId(null);
  }, []);

  const clearFilters = useCallback(() => {
    setStatusFilter("all");
    setSearchQuery("");
  }, []);

  return {
    domains,
    dnsInstructions,
    isLoading,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    filteredDomains,
    verifyingDomains,
    deleteDomainId,
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    isAddDomainOpen,
    setIsAddDomainOpen,
    newDomain,
    setNewDomain,
    hasFormatError,
    setHasFormatError,
    errorMessage,
    setErrorMessage,
    handleAddDomain,
    handleVerifyDomain,
    handleSetPrimaryDomain,
    handleDeleteDomain,
    clearFilters,
  };
}
