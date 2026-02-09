"use client";

import { createPortal } from "react-dom";
import { AlertCircle, Loader2, X } from "lucide-react";

interface RemovePropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  removing: boolean;
}

export function RemovePropertyDialog({
  isOpen,
  onClose,
  onConfirm,
  removing,
}: RemovePropertyDialogProps) {
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        dir="rtl"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              تأكيد إلغاء الربط
            </h3>
            <p className="text-sm text-gray-500">
              هذا الإجراء سيقوم بإلغاء ربط العقار
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-gray-700 text-center">
              هل أنت متأكد من إلغاء ربط هذا العقار بالمالك؟
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            disabled={removing}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            disabled={removing}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
          >
            {removing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الإلغاء...
              </>
            ) : (
              <>
                <X className="h-4 w-4" />
                تأكيد الإلغاء
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
