"use client";

import { useState } from "react";
import { useThemes } from "@/hooks/useThemes";
import { ThemeCard } from "./ThemeCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { RefreshCw, Palette, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import PaymentPopup from "@/components/popup/PopupForPayment";

export function ThemeSection() {
  const {
    themes,
    activeThemeId,
    loading,
    error,
    handleThemeSwitch,
    purchaseAndSwitch,
    refreshThemes,
  } = useThemes();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [switchingThemeId, setSwitchingThemeId] = useState<string | null>(null);

  const handleSwitch = async (themeId: string) => {
    setSwitchingThemeId(themeId);
    try {
      const result = await handleThemeSwitch(themeId);

      if (result.success) {
        toast.success("تم تفعيل الثيم بنجاح");
        await refreshThemes();
      } else if (result.requiresPurchase) {
        // This shouldn't happen with handleThemeSwitch, but handle it anyway
        toast.error("يجب شراء الثيم أولاً");
      } else if (result.redirecting) {
        // Purchase initiated - payment URL should be handled differently
        // This case might not occur with current implementation
        toast.loading("جاري التوجيه إلى صفحة الدفع...");
      } else {
        const errorMessage = result.error || "فشل في تفعيل الثيم";
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "حدث خطأ";
      toast.error(errorMessage);
    } finally {
      setSwitchingThemeId(null);
    }
  };

  const handlePurchaseClick = async (themeId: string) => {
    setSwitchingThemeId(themeId);
    try {
      const result = await purchaseAndSwitch(themeId);

      if (result.success && result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);
        setIsPopupOpen(true);
      } else {
        toast.error(result.error || "فشل في بدء عملية الشراء");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "حدث خطأ";
      toast.error(errorMessage);
    } finally {
      setSwitchingThemeId(null);
    }
  };

  const handlePaymentSuccess = async () => {
    setIsPopupOpen(false);
    toast.success("تم الشراء بنجاح! يمكنك الآن تفعيل الثيم");
    await refreshThemes();
  };

  const handleThemeAction = async (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    const isFree = themes.indexOf(theme) === 0; // First theme is always free
    const canSwitch = isFree || theme.has_access;

    if (canSwitch) {
      await handleSwitch(themeId);
    } else {
      await handlePurchaseClick(themeId);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-right">ثيمات الموقع</h2>
            <p className="text-muted-foreground text-right">
              اختر وتخصيص ثيم موقعك
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="p-4 pt-0">
                <Skeleton className="h-9 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-right">ثيمات الموقع</h2>
            <p className="text-muted-foreground text-right">
              اختر وتخصيص ثيم موقعك
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 text-center border border-destructive/50 rounded-lg bg-destructive/10">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-1">حدث خطأ</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => refreshThemes()}>
            <RefreshCw className="h-4 w-4 ml-1" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (!themes || themes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-right">ثيمات الموقع</h2>
            <p className="text-muted-foreground text-right">
              اختر وتخصيص ثيم موقعك
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Palette className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">لا توجد ثيمات متاحة</h3>
          <p className="text-muted-foreground mb-4">
            لم يتم العثور على الثيمات أو حدث خطأ في التحميل
          </p>
          <Button variant="outline" onClick={() => refreshThemes()}>
            <RefreshCw className="h-4 w-4 ml-1" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-right">ثيمات الموقع</h2>
            <p className="text-muted-foreground text-right">
              اختر وتخصيص ثيم موقعك
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme, index) => {
            const isFree = index === 0; // First theme is always free
            const isActive = theme.id === activeThemeId;

            return (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={isActive}
                isFree={isFree}
                onSwitch={handleThemeAction}
                isSwitching={switchingThemeId === theme.id}
              />
            );
          })}
        </div>
      </div>

      {isPopupOpen && (
        <PaymentPopup
          paymentUrl={paymentUrl}
          onClose={() => setIsPopupOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
