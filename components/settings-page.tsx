"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Globe, Palette, CreditCardIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuthStore from "@/context/AuthContext";
import PaymentPopup from "@/components/popup/Popup";
import { ThemeSection } from "@/components/settings/themes/ThemeSection";
import { useDomains } from "@/hooks/useDomains";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { DomainsTab } from "@/components/settings/domains/DomainsTab";
import { DeleteDomainDialog } from "@/components/settings/domains/DeleteDomainDialog";
import { SubscriptionTab } from "@/components/settings/subscription/SubscriptionTab";
import { UpgradeDialog } from "@/components/settings/subscription/UpgradeDialog";
import { TAB_IDS } from "@/components/settings/constants";

export function SettingsPage() {
  const { clickedOnSubButton } = useAuthStore();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams?.get("tab");
  const initialTab = tabFromUrl ?? `${clickedOnSubButton}`;
  const themeIdFromUrl = searchParams?.get("themeId");
  const [activeTab, setActiveTab] = useState(initialTab);

  const domains = useDomains();
  const subscription = useSubscriptionPlans();

  const currentPlans = subscription.getCurrentPlans();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">الإعدادات</h1>
              <p className="text-muted-foreground">
                إدارة إعدادات حسابك وتفضيلات موقعك
              </p>
            </div>
          </div>

          <Tabs
            defaultValue={TAB_IDS.DOMAINS}
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value={TAB_IDS.DOMAINS} className="flex gap-1 items-center">
                <Globe className="h-4 w-4" />
                <span>النطاقات</span>
              </TabsTrigger>
              <TabsTrigger value={TAB_IDS.SUBSCRIPTION} className="flex gap-1 items-center">
                <CreditCardIcon className="h-4 w-4" />
                <span>الاشتراك</span>
              </TabsTrigger>
              <TabsTrigger value={TAB_IDS.THEMES} className="flex gap-1 items-center">
                <Palette className="h-4 w-4" />
                <span>الثيمات</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={TAB_IDS.DOMAINS} className="space-y-4 pt-4">
              <DomainsTab
                domains={domains.domains}
                dnsInstructions={domains.dnsInstructions}
                isLoading={domains.isLoading}
                statusFilter={domains.statusFilter}
                setStatusFilter={domains.setStatusFilter}
                filteredDomains={domains.filteredDomains}
                verifyingDomains={domains.verifyingDomains}
                isAddDomainOpen={domains.isAddDomainOpen}
                setIsAddDomainOpen={domains.setIsAddDomainOpen}
                newDomain={domains.newDomain}
                setNewDomain={domains.setNewDomain}
                hasFormatError={domains.hasFormatError}
                setHasFormatError={domains.setHasFormatError}
                errorMessage={domains.errorMessage}
                setErrorMessage={domains.setErrorMessage}
                handleAddDomain={domains.handleAddDomain}
                handleVerifyDomain={domains.handleVerifyDomain}
                handleSetPrimaryDomain={domains.handleSetPrimaryDomain}
                openDeleteDialog={domains.openDeleteDialog}
                clearFilters={domains.clearFilters}
              />
            </TabsContent>

            <TabsContent value={TAB_IDS.SUBSCRIPTION} className="space-y-4 pt-4">
              <SubscriptionTab
                currentPlans={currentPlans}
                isLoadingPlans={subscription.isLoadingPlans}
                billingPeriod={subscription.billingPeriod}
                subscriptionPlans={subscription.subscriptionPlans}
                calculateSavings={subscription.calculateSavings}
                onUpgradeClick={subscription.handleUpgradeClick}
              />
            </TabsContent>

            <TabsContent value={TAB_IDS.THEMES} className="space-y-4 pt-4">
              <ThemeSection initialThemeId={themeIdFromUrl ?? undefined} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <DeleteDomainDialog
        open={domains.isDeleteDialogOpen}
        onOpenChange={(open) => !open && domains.closeDeleteDialog()}
        onConfirm={domains.handleDeleteDomain}
      />

      {subscription.isPopupOpen && (
        <PaymentPopup
          paymentUrl={subscription.paymentUrl}
          onClose={subscription.closePopup}
        />
      )}

      <UpgradeDialog
        open={subscription.isUpgradeDialogOpen}
        onOpenChange={subscription.setIsUpgradeDialogOpen}
        selectedPlan={subscription.selectedPlan}
        selectedMonths={subscription.selectedMonths}
        onMonthsChange={subscription.setSelectedMonths}
        onConfirm={subscription.handleConfirmUpgrade}
        onCancel={() => subscription.setIsUpgradeDialogOpen(false)}
        isProcessing={subscription.isProcessingPayment}
        isYearlyPlan={subscription.isYearlyPlan}
      />
    </div>
  );
}
