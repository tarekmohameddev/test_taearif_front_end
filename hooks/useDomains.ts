"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData, selectIsLoading } from "@/context/auth/selectors";
import toast from "react-hot-toast";
import type {
  Domain,
  DnsInstructions,
  DomainStatusFilter,
} from "@/components/settings/types";
import { DOMAIN_STATUS } from "@/components/settings/constants";
import { validateDomainInput } from "@/components/settings/utils/domainValidation";
import {
  getDomains,
  addDomain as addDomainApi,
  verifyDomain as verifyDomainApi,
  setPrimaryDomain as setPrimaryDomainApi,
  deleteDomain as deleteDomainApi,
} from "@/lib/services/settings-domains-api";

const DOMAINS_FETCH_DEBOUNCE_MS = 2000;

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
  const userData = useAuthStore(selectUserData);
  const authLoading = useAuthStore(selectIsLoading);
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
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [isDeletingDomain, setIsDeletingDomain] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);
  const lastFetchedDomainsAt = useRef<number>(0);
  const loadingDomainsRef = useRef<boolean>(false);

  const isAuthReady = !authLoading && !!userData?.token;

  const fetchDomains = useCallback(async () => {
    if (!isAuthReady) return;

    // 1) Loading guard: do not start another request if one is in progress
    if (loadingDomainsRef.current) return;

    // 2) Last-fetched guard: skip if we just fetched this resource (avoid rapid duplicate calls)
    const now = Date.now();
    if (now - lastFetchedDomainsAt.current < DOMAINS_FETCH_DEBOUNCE_MS) {
      setIsLoading(false);
      return;
    }

    loadingDomainsRef.current = true;
    setIsLoading(true);
    try {
      const data = await getDomains();
      setDomains(data.domains);
      setDnsInstructions(data.dnsInstructions);
      lastFetchedDomainsAt.current = Date.now();
    } catch (error) {
      console.error("Error fetching domains:", error);
    } finally {
      loadingDomainsRef.current = false;
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
    if (isAddingDomain) return;

    setIsAddingDomain(true);
    const loadingToast = toast.loading("جاري إضافة النطاق...");
    try {
      const response = await addDomainApi(newDomain.trim());
      const addedDomain: Domain = {
        ...response.data,
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
    } finally {
      setIsAddingDomain(false);
    }
  }, [newDomain, isAuthReady, isAddingDomain]);

  const handleVerifyDomain = useCallback(
    async (domainId: string) => {
      if (!isAuthReady) return;
      if (verifyingDomains[domainId]) return;

      setVerifyingDomains((prev) => ({ ...prev, [domainId]: true }));
      const loadingToast = toast.loading("جاري التحقق من النطاق...");
      try {
        const response = await verifyDomainApi(domainId);
        const verifiedDomain = response.data;
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
    [isAuthReady, verifyingDomains],
  );

  const handleSetPrimaryDomain = useCallback(
    async (domainId: string) => {
      if (!isAuthReady) return;
      if (isSettingPrimary) return;

      setIsSettingPrimary(true);
      const loadingToast = toast.loading("جاري تحديث النطاق الرئيسي...");
      try {
        await setPrimaryDomainApi(domainId);
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
      } finally {
        setIsSettingPrimary(false);
      }
    },
    [isAuthReady, isSettingPrimary],
  );

  const handleDeleteDomain = useCallback(async () => {
    if (!deleteDomainId || !isAuthReady) return;
    if (isDeletingDomain) return;

    setIsDeletingDomain(true);
    const loadingToast = toast.loading("جاري حذف النطاق...");
    try {
      await deleteDomainApi(deleteDomainId);
      setDomains((prev) => prev.filter((d) => d.id !== deleteDomainId));
      toast.dismiss(loadingToast);
      toast.success("تم حذف النطاق بنجاح");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف النطاق"));
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteDomainId(null);
      setIsDeletingDomain(false);
    }
  }, [deleteDomainId, isAuthReady, isDeletingDomain]);

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
