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

const PaymentPopup = ({ paymentUrl, onClose, onPaymentSuccess, addonId }: PaymentPopupProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const statusPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialQuotaRef = useRef<number | null>(null);
  const initialUsageRef = useRef<number | null>(null);

  // Log when component mounts and addonId changes
  useEffect(() => {
    console.log("PaymentPopup component rendered/mounted, addonId:", addonId);
    // Reset initial values when popup opens
    initialQuotaRef.current = null;
    initialUsageRef.current = null;
  }, [addonId]);

  // Fallback: Monitor iframe URL changes and src changes
  useEffect(() => {
    console.log("Payment popup: Setting up iframe monitoring");
    
    const checkIframeUrl = () => {
      try {
        if (iframeRef.current?.contentWindow) {
          const iframeUrl = iframeRef.current.contentWindow.location.href;
          console.log("Checking iframe URL:", iframeUrl);
          
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
        console.log("Cannot access iframe URL (CORS):", e);
      }
    };

    // Also check iframe src attribute changes
    const checkIframeSrc = () => {
      if (iframeRef.current) {
        const currentSrc = iframeRef.current.src;
        console.log("Checking iframe src:", currentSrc);
        
        if (currentSrc.includes("/payment/success/")) {
          console.log("Payment success detected via iframe src:", currentSrc);
          if (showSuccess || showFailed) return;
          
          setShowSuccess(true);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
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
          console.log("Payment failed detected via iframe src:", currentSrc);
          if (showSuccess || showFailed) return;
          
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
    };

    // Check iframe URL and src every 1 second as fallback
    if (!showSuccess && !showFailed) {
      console.log("Starting iframe monitoring interval");
      pollingIntervalRef.current = setInterval(() => {
        checkIframeUrl();
        checkIframeSrc();
      }, 1000);
    }

    return () => {
      console.log("Cleaning up iframe monitoring");
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [showSuccess, showFailed, onClose, onPaymentSuccess]);

  useEffect(() => {
    console.log("Payment popup: Setting up message listener");
    console.log("Current window location:", window.location.href);
    console.log("Current hostname:", window.location.hostname);
    
    const handleMessage = (event: MessageEvent) => {
      // Log ALL messages for debugging (even if not from expected origin)
      console.log("Payment popup received message:", {
        data: event.data,
        origin: event.origin,
        currentHostname: window.location.hostname,
        currentOrigin: window.location.origin,
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
        console.warn("Message from unauthorized origin:", event.origin, "Current origin:", window.location.origin);
        // Still log the message data to see what we're receiving
        if (event.data === "payment_success" || event.data === "payment_failed") {
          console.warn("But message data matches payment status:", event.data);
        }
        return;
      }
      
      if (event.data === "payment_success") {
        console.log("Payment success message received and processed");
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
        console.log("Payment failed message received and processed");
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
    console.log("Message listener added");

    return () => {
      console.log("Cleaning up message listener");
      window.removeEventListener("message", handleMessage);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [onClose, onPaymentSuccess, showSuccess, showFailed]);

  // API Polling: Check payment status via API (works without addonId)
  useEffect(() => {
    if (showSuccess || showFailed) {
      console.log("Payment already processed, skipping API polling");
      return;
    }
    
    console.log("Starting payment status polling (addonId:", addonId || "not provided", ")");
    
    const checkPaymentStatus = async () => {
      try {
        console.log("Checking payment status via plans endpoint");
        
        // Use plans endpoint to check quota/usage changes
        const response = await axiosInstance.get("/api/whatsapp/addons/plans");
        console.log("Plans endpoint response:", response.data);
        
        if (response.data.success && response.data.data) {
          const currentQuota = response.data.data.quota || 0;
          const currentUsage = response.data.data.usage || 0;
          
          // Store initial values on first check
          if (initialQuotaRef.current === null || initialUsageRef.current === null) {
            initialQuotaRef.current = currentQuota;
            initialUsageRef.current = currentUsage;
            console.log("Initial values stored - Quota:", initialQuotaRef.current, "Usage:", initialUsageRef.current);
            return;
          }
          
          console.log("Current values - Quota:", currentQuota, "Usage:", currentUsage);
          console.log("Initial values - Quota:", initialQuotaRef.current, "Usage:", initialUsageRef.current);
          
          // Check if usage increased (indicates payment was processed)
          // Or if quota increased (indicates addon was added)
          if (currentUsage > initialUsageRef.current || currentQuota > initialQuotaRef.current) {
            console.log("Payment success detected via API polling (quota/usage changed)");
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
          
          // If addonId is provided, try status endpoint
          if (addonId) {
            try {
              const statusResponse = await axiosInstance.get(`/whatsapp/addons/${addonId}/status`);
              console.log("Status endpoint response:", statusResponse.data);
              
              if (statusResponse.data.status === "paid" || 
                  statusResponse.data.status === "success" ||
                  statusResponse.data.success === true) {
                console.log("Payment success detected via API polling (status endpoint)");
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
            } catch (statusErr: any) {
              // Status endpoint might not exist, continue with quota/usage check
              if (statusErr.response?.status === 404) {
                console.log("Status endpoint not found (404), using quota/usage method");
              }
            }
          }
        }
      } catch (err: any) {
        console.error("Error checking payment status:", err);
        // Don't stop polling on error, continue checking
      }
    };
    
    // Check immediately, then every 3 seconds
    checkPaymentStatus();
    statusPollingIntervalRef.current = setInterval(checkPaymentStatus, 3000);
    
    return () => {
      console.log("Cleaning up payment status polling");
      if (statusPollingIntervalRef.current) {
        clearInterval(statusPollingIntervalRef.current);
      }
    };
  }, [addonId, showSuccess, showFailed, onClose, onPaymentSuccess]);

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
                  onLoad={(e) => {
                    console.log("Iframe loaded, src:", e.currentTarget.src);
                    setIsLoading(false);
                    // Check if src contains success/failed URL
                    if (e.currentTarget.src.includes("/payment/success/")) {
                      console.log("Success URL detected in iframe src on load");
                      if (!showSuccess && !showFailed) {
                        setShowSuccess(true);
                        setTimeout(() => {
                          onClose();
                          if (onPaymentSuccess) {
                            onPaymentSuccess();
                          } else {
                            window.location.reload();
                          }
                        }, 2000);
                      }
                    } else if (e.currentTarget.src.includes("/payment/failed/")) {
                      console.log("Failed URL detected in iframe src on load");
                      if (!showSuccess && !showFailed) {
                        setShowFailed(true);
                        setTimeout(() => {
                          onClose();
                          window.location.reload();
                        }, 2000);
                      }
                    }
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
