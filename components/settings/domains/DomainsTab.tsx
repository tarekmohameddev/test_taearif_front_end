"use client";

import { Globe, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Domain, DnsInstructions } from "@/components/settings/types";
import type { DomainStatusFilter } from "@/components/settings/types";
import { DOMAIN_STATUS_FILTER } from "@/components/settings/constants";
import { DomainCard } from "./DomainCard";
import { AddDomainDialog } from "./AddDomainDialog";
import { NameserversCard } from "./NameserversCard";

export interface DomainsTabProps {
  domains: Domain[];
  dnsInstructions: DnsInstructions | null;
  isLoading: boolean;
  statusFilter: DomainStatusFilter;
  setStatusFilter: (v: DomainStatusFilter) => void;
  filteredDomains: Domain[];
  verifyingDomains: Record<string, boolean>;
  isAddDomainOpen: boolean;
  setIsAddDomainOpen: (v: boolean) => void;
  newDomain: string;
  setNewDomain: (v: string) => void;
  hasFormatError: boolean;
  setHasFormatError: (v: boolean) => void;
  errorMessage: string;
  setErrorMessage: (v: string) => void;
  handleAddDomain: () => Promise<void>;
  handleVerifyDomain: (domainId: string) => void;
  handleSetPrimaryDomain: (domainId: string) => void;
  openDeleteDialog: (domainId: string) => void;
  clearFilters: () => void;
}

export function DomainsTab({
  domains,
  dnsInstructions,
  isLoading,
  statusFilter,
  setStatusFilter,
  filteredDomains,
  verifyingDomains,
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
  openDeleteDialog,
  clearFilters,
}: DomainsTabProps) {
  const handleFormatErrorChange = (hasError: boolean, message: string) => {
    setHasFormatError(hasError);
    setErrorMessage(message);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">إدارة النطاقات</h2>
          <p className="text-muted-foreground">
            ربط وإدارة النطاقات المخصصة لموقعك
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as DomainStatusFilter)}
          >
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="تصفية حسب الحالة" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DOMAIN_STATUS_FILTER.ALL}>
                جميع النطاقات
              </SelectItem>
              <SelectItem value={DOMAIN_STATUS_FILTER.ACTIVE}>
                النطاقات النشطة
              </SelectItem>
              <SelectItem value={DOMAIN_STATUS_FILTER.PENDING}>
                النطاقات المعلقة
              </SelectItem>
            </SelectContent>
          </Select>

          <AddDomainDialog
            open={isAddDomainOpen}
            onOpenChange={setIsAddDomainOpen}
            value={newDomain}
            onChange={setNewDomain}
            onSubmit={handleAddDomain}
            hasFormatError={hasFormatError}
            errorMessage={errorMessage}
            onFormatErrorChange={handleFormatErrorChange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-start justify-between p-6">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
              </CardHeader>
              <CardContent className="px-6 pb-2">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-2 flex gap-2">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : !filteredDomains.length ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Globe className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">لا توجد نطاقات مطابقة</h3>
          <p className="text-muted-foreground mb-4">
            لم يتم العثور على نطاقات تطابق معايير التصفية الحالية
          </p>
          <Button variant="outline" onClick={clearFilters}>
            عرض جميع النطاقات
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDomains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              onVerify={handleVerifyDomain}
              onSetPrimary={handleSetPrimaryDomain}
              onDelete={openDeleteDialog}
              isVerifying={!!verifyingDomains[domain.id]}
            />
          ))}
        </div>
      )}

      <NameserversCard dnsInstructions={dnsInstructions} />
    </div>
  );
}
