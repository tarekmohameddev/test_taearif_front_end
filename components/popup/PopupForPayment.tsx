"use client";
import { useEffect, useState, useRef } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ShieldCheck } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

interface PaymentPopupProps {
  paymentUrl: string;
  onClose: () => void;
  onPaymentSuccess?: () => void;
  addonId?: number;
}

const PaymentPopup = ({
  paymentUrl,
  onClose,
  onPaymentSuccess,
  addonId,
}: PaymentPopupProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const statusPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialQuotaRef = useRef<number | null>(null);
  const initialUsageRef = useRef<number | null>(null);

  // Fallback: Monitor iframe src changes (URL access blocked by CORS)
  useEffect(() => {
    const checkIframeSrc = () => {
      if (iframeRef.current) {
        const currentSrc = iframeRef.current.src;

        if (currentSrc.includes("/payment/success/")) {
          if (showSuccess || showFailed) return;

          setShowSuccess(true);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          if (statusPollingIntervalRef.current) {
            clearInterval(statusPollingIntervalRef.current);
          }
          setTimeout(() => {
            onClose();
            if (onPaymentSuccess) {
              onPaymentSuccess();
            } else {
              window.location.reload();
            }
          }, 2000);
        } else if (currentSrc.includes("/payment/failed/")) {
          if (showSuccess || showFailed) return;

          setShowFailed(true);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          if (statusPollingIntervalRef.current) {
            clearInterval(statusPollingIntervalRef.current);
          }
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2000);
        }
      }
    };

    // Check iframe src every 2 seconds as fallback
    if (!showSuccess && !showFailed) {
      pollingIntervalRef.current = setInterval(checkIframeSrc, 2000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [showSuccess, showFailed, onClose, onPaymentSuccess]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // قبول الرسائل من api.taearif.com (أو أي origin لأن PHP يرسل إلى "*")
      // التحقق من أن الرسالة هي payment_success أو payment_failed
      const isValidPaymentMessage =
        event.data === "payment_success" || event.data === "payment_failed";

      // قبول الرسائل من api.taearif.com أو إذا كانت الرسالة صحيحة
      const isAllowedOrigin =
        event.origin.includes("api.taearif.com") ||
        event.origin.includes("taearif.com") ||
        isValidPaymentMessage; // قبول إذا كانت الرسالة صحيحة (لأن PHP يرسل إلى "*")

      if (!isAllowedOrigin || !isValidPaymentMessage) {
        return;
      }

      if (event.data === "payment_success") {
        if (showSuccess || showFailed) return; // Prevent multiple calls

        setShowSuccess(true);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        if (statusPollingIntervalRef.current) {
          clearInterval(statusPollingIntervalRef.current);
        }
        setTimeout(() => {
          onClose();
          if (onPaymentSuccess) {
            onPaymentSuccess();
          } else {
            window.location.reload();
          }
        }, 2000);
      } else if (event.data === "payment_failed") {
        if (showSuccess || showFailed) return; // Prevent multiple calls

        setShowFailed(true);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        if (statusPollingIntervalRef.current) {
          clearInterval(statusPollingIntervalRef.current);
        }
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onClose, onPaymentSuccess, showSuccess, showFailed]);

  // API Polling: Fallback only (starts after 60 seconds if postMessage fails)
  useEffect(() => {
    if (showSuccess || showFailed) {
      return;
    }

    // Start polling only after 60 seconds as a fallback if postMessage doesn't work
    const fallbackTimeout = setTimeout(() => {
      const checkPaymentStatus = async () => {
        try {
          const response = await axiosInstance.get(
            "/api/whatsapp/addons/plans",
          );

          if (response.data.success && response.data.data) {
            const currentQuota = response.data.data.quota || 0;
            const currentUsage = response.data.data.usage || 0;

            // Store initial values on first check
            if (
              initialQuotaRef.current === null ||
              initialUsageRef.current === null
            ) {
              initialQuotaRef.current = currentQuota;
              initialUsageRef.current = currentUsage;
              return;
            }

            // Check if usage increased (indicates payment was processed)
            if (
              currentUsage > initialUsageRef.current ||
              currentQuota > initialQuotaRef.current
            ) {
              if (showSuccess || showFailed) return;

              setShowSuccess(true);
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
              }
              if (statusPollingIntervalRef.current) {
                clearInterval(statusPollingIntervalRef.current);
              }
              setTimeout(() => {
                onClose();
                if (onPaymentSuccess) {
                  onPaymentSuccess();
                } else {
                  window.location.reload();
                }
              }, 2000);
              return;
            }
          }
        } catch (err: any) {
          // Silently continue polling
        }
      };

      // Check every 10 seconds (less frequent than before)
      checkPaymentStatus();
      statusPollingIntervalRef.current = setInterval(checkPaymentStatus, 10000);
    }, 60000); // Start after 60 seconds

    return () => {
      clearTimeout(fallbackTimeout);
      if (statusPollingIntervalRef.current) {
        clearInterval(statusPollingIntervalRef.current);
      }
    };
  }, [showSuccess, showFailed, onClose, onPaymentSuccess]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    console.error("Iframe error occurred");
    // Don't show error immediately, wait for postMessage
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-2xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {showFailed ? (
          <div className="animate-bounce-in flex flex-col items-center justify-center h-[700px]">
            <FaTimesCircle className="text-6xl text-red-500 mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-red-700 mb-2">
              فشلت عملية الدفع!
            </h2>
            <p className="text-lg text-gray-600">
              سيتم إغلاق النافذة تلقائياً...
            </p>
          </div>
        ) : (
          <>
            {showSuccess ? (
              <div className="animate-bounce-in flex flex-col items-center justify-center h-[700px]">
                <FaCheckCircle className="text-6xl text-green-500 mb-4 animate-pulse" />
                <h2 className="text-3xl font-bold text-green-700 mb-2">
                  تمت العملية بنجاح!
                </h2>
                <p className="text-lg text-gray-600">
                  سيتم إغلاق النافذة تلقائياً...
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2 text-center text-blue-700">
                  بوابة دفع إلكترونية آمنة
                </h2>

                <div className="flex flex-row items-center justify-center gap-2 mb-4">
                  <ShieldCheck className="text-center" />
                  <p className="text-md text-center text-green-500 font-bold">
                    مدعومة من مصرف الراجحي - تشفير وحماية عالية
                  </p>
                  <ShieldCheck className="text-center" />
                </div>

                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-[700px]">
                    <p className="text-lg font-semibold mb-4">
                      جاري تحميل بوابة الدفع
                    </p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                  </div>
                )}

                <iframe
                  ref={iframeRef}
                  src={paymentUrl}
                  className={`w-full h-[700px] border-0 ${isLoading ? "hidden" : "block"}`}
                  title="Payment Gateway"
                  onLoad={() => {
                    setIsLoading(false);
                  }}
                />

                <div className="text-center text-sm mt-4">
                  تتم معالجة معلوماتك المالية من خلال نظام مشفر وآمن تمامًا
                  لضمان حماية بياناتك.
                </div>

                <button
                  className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={onClose}
                >
                  إلغاء
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPopup;
