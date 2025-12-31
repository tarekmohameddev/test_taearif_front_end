// ============================================================================
// Changes Made Dialog
// ============================================================================

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChangesMadeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: (key: string) => string;
}

export function ChangesMadeDialog({
  open,
  onOpenChange,
  t,
}: ChangesMadeDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        // Ensure pointer-events is restored when dialog closes
        if (!open) {
          setTimeout(() => {
            const body = document.body;
            if (body.style.pointerEvents === "none") {
              body.style.pointerEvents = "";
            }
          }, 100); // Small delay to ensure Radix UI cleanup is done
        }
      }}
    >
      <AlertDialogContent className="max-w-md border-0 shadow-2xl bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="sr-only">
            {t("live_editor.changes_not_saved_title")}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col items-center text-center p-6">
          {/* Modern Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {t("live_editor.changes_not_saved_title")}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t("live_editor.changes_not_saved_description")}
          </p>

          {/* Action Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold py-3 px-6 rounded-lg hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            {t("live_editor.understood")}
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
