"use client";
import { useEffect, useState, useRef } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ShieldCheck } from "lucide-react";

interface PaymentPopupProps {
  paymentUrl: string;
  onClose: () => void;
  onPaymentSuccess?: () => void;
  addonId?: number;
}

const PaymentPopup = ({ paymentUrl, onClose, onPaymentSuccess, addonId }: PaymentPopupProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback: Monitor iframe URL changes
  useEffect(() => {
    const checkIframeUrl = () => {
      try {
        if (iframeRef.current?.contentWindow) {
          const iframeUrl = iframeRef.current.contentWindow.location.href;
          
          // Check if iframe navigated to success URL
          if (iframeUrl.includes("/payment/success/")) {
            console.log("Payment success detected via iframe URL:", iframeUrl);
            if (showSuccess || showFailed) return; // Prevent multiple calls
            
            setShowSuccess(true);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            setTimeout(() => {
              onClose();
              // Call onPaymentSuccess callback if provided
              if (onPaymentSuccess) {
                onPaymentSuccess();
              } else {
                // Fallback to reload if no callback
                window.location.reload();
              }
            }, 2000);
          } else if (iframeUrl.includes("/payment/failed/")) {
            console.log("Payment failed detected via iframe URL:", iframeUrl);
            if (showSuccess || showFailed) return; // Prevent multiple calls
            
            setShowFailed(true);
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            setTimeout(() => {
              onClose();
              window.location.reload();
            }, 2000);
          }
        }
      } catch (e) {
        // Cross-origin error is expected, ignore it
        // This means we can't access iframe URL due to CORS
      }
    };

    // Check iframe URL every 2 seconds as fallback
    if (!showSuccess && !showFailed) {
      pollingIntervalRef.current = setInterval(checkIframeUrl, 2000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [showSuccess, showFailed, onClose, onPaymentSuccess]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Log all messages for debugging
      console.log("Payment popup received message:", {
        data: event.data,
        origin: event.origin,
        currentHostname: window.location.hostname,
        expectedOrigins: ["https://api.taearif.com", "https://taearif.vercel.app"]
      });
      
      // Accept messages from api.taearif.com or any origin (for development)
      const isAllowedOrigin = 
        event.origin.includes("api.taearif.com") ||
        event.origin.includes("taearif.vercel.app") ||
        event.origin.includes("taearif.com") ||
        window.location.hostname === "localhost" || // Allow localhost for development
        window.location.hostname.includes("mandhoor.com"); // Allow dev mode online
      
      if (!isAllowedOrigin) {
        console.warn("Message from unauthorized origin:", event.origin);
        return;
      }
      
      if (event.data === "payment_success") {
        console.log("Payment success message received");
        if (showSuccess || showFailed) return; // Prevent multiple calls
        
        setShowSuccess(true);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        setTimeout(() => {
          onClose();
          // Call onPaymentSuccess callback if provided
          if (onPaymentSuccess) {
            onPaymentSuccess();
          } else {
            // Fallback to reload if no callback
            window.location.reload();
          }
        }, 2000);
      } else if (event.data === "payment_failed") {
        console.log("Payment failed message received");
        if (showSuccess || showFailed) return; // Prevent multiple calls
        
        setShowFailed(true);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
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
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [onClose, onPaymentSuccess, showSuccess, showFailed]);

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
                  onLoad={() => setIsLoading(false)}
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
