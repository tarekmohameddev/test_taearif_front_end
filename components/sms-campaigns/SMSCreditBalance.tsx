"use client";

import { useState, useEffect } from "react";
import useStore from "@/context/Store";
import { Coins, Plus, CreditCard, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

/** 1 credit = 1 SMS (configurable if backend changes) */
export const CREDITS_PER_SMS = 1;

interface CreditPackage {
  id: number;
  name: string;
  description: string | null;
  credits: number;
  price: string;
  currency: string;
  discounted_price: string;
  savings_amount: number;
  savings_percentage: number | null;
  price_per_credit: number;
  is_popular: boolean;
  features: string[];
  is_recommended: boolean;
}

export function SMSCreditBalance() {
  const {
    creditBalance,
    fetchCreditBalance,
    creditPackages,
    fetchCreditPackages,
    purchaseCredits,
  } = useStore();

  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");

  const availableCredits = creditBalance.data?.available_credits ?? 0;
  const isLoading = creditBalance.loading;
  const error = creditBalance.error;

  useEffect(() => {
    fetchCreditBalance({ silent: true });
    fetchCreditPackages();
  }, [fetchCreditBalance, fetchCreditPackages]);

  const handleBuyCredits = async () => {
    const pkg = creditPackages.packages.find(
      (p: CreditPackage) => p.id.toString() === selectedPackage
    );
    if (!pkg || !selectedPaymentMethod) return;
    setIsProcessingPayment(true);
    try {
      const paymentMethod =
        selectedPaymentMethod === "alrajhi" ? "arb" : "myfatoorah";
      const result = await purchaseCredits(pkg.id, paymentMethod);
      if (result?.success && result?.data?.redirect_url) {
        setPaymentUrl(result.data.redirect_url);
        setIsPaymentPopupOpen(true);
        setIsBuyDialogOpen(false);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentClose = () => {
    setIsPaymentPopupOpen(false);
    setPaymentUrl("");
    fetchCreditBalance({ silent: true });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">رصيد الرسائل</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              <span className="text-sm text-muted-foreground">جاري التحميل...</span>
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && (
            <>
              <div className="text-2xl font-bold">
                {availableCredits.toLocaleString()}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  كريديت
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                كريديت واحد = رسالة واحدة
              </p>
              <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="mt-3 w-full"
                    disabled={creditPackages.loading || creditPackages.packages.length === 0}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    شراء كريديت
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>شراء رصيد للرسائل النصية</DialogTitle>
                    <DialogDescription>
                      اختر الباقة وطريقة الدفع. كل كريديت = رسالة SMS واحدة.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {creditPackages.error && (
                      <Alert variant="destructive">
                        <AlertDescription>{creditPackages.error}</AlertDescription>
                      </Alert>
                    )}
                    {creditPackages.loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="h-24 rounded-lg bg-muted animate-pulse"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {creditPackages.packages.map((pkg: CreditPackage) => (
                          <div
                            key={pkg.id}
                            className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                              selectedPackage === pkg.id.toString()
                                ? "border-primary bg-primary/5"
                                : "border-muted hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedPackage(pkg.id.toString())}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{pkg.name}</span>
                                  {pkg.is_popular && (
                                    <Badge variant="secondary" className="text-xs">
                                      الأكثر
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {pkg.credits.toLocaleString()} رسالة
                                </p>
                              </div>
                              <div className="text-left">
                                <span className="font-semibold">
                                  {pkg.discounted_price} {pkg.currency}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">طريقة الدفع</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className={`border-2 rounded-lg p-3 cursor-pointer text-center ${
                            selectedPaymentMethod === "alrajhi"
                              ? "border-primary bg-primary/5"
                              : "border-muted"
                          }`}
                          onClick={() => setSelectedPaymentMethod("alrajhi")}
                        >
                          <span className="text-sm font-medium">بنك الراجحي</span>
                        </div>
                        <div
                          className={`border-2 rounded-lg p-3 cursor-pointer text-center opacity-60 pointer-events-none`}
                          title="غير متاح حالياً"
                        >
                          <span className="text-sm font-medium">ماي فاتورة</span>
                          <span className="block text-xs text-muted-foreground">قريباً</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        disabled={
                          !selectedPackage ||
                          !selectedPaymentMethod ||
                          isProcessingPayment
                        }
                        onClick={handleBuyCredits}
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                            جاري التوجيه للدفع...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 ml-2" />
                            تأكيد والدفع
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsBuyDialogOpen(false)}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Payment iframe popup */}
              <Dialog open={isPaymentPopupOpen} onOpenChange={(open) => !open && handlePaymentClose()}>
                <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden" dir="rtl">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">إتمام الدفع</h3>
                    <Button variant="ghost" size="icon" onClick={handlePaymentClose}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  {paymentUrl && (
                    <iframe
                      src={paymentUrl}
                      className="w-full h-[calc(80vh-60px)] border-0 min-h-[400px]"
                      title="Payment"
                      sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
                    />
                  )}
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
