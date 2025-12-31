// ============================================================================
// Delete Page Dialog
// ============================================================================

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeletePageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmation: string;
  onConfirmationChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export function DeletePageDialog({
  open,
  onOpenChange,
  confirmation,
  onConfirmationChange,
  onConfirm,
  onCancel,
  t,
}: DeletePageDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="max-w-lg"
        onClick={() => onOpenChange(false)}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
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
            <div>
              <AlertDialogTitle className="text-2xl font-bold text-gray-900">
                {t("live_editor.delete_page_permanently")}
              </AlertDialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {t("live_editor.delete_page_description")}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-red-800 mb-2">
                  ⚠️ {t("live_editor.critical_warning")}
                </h4>
                <ul className="text-red-700 space-y-1 text-sm">
                  <li>• {t("live_editor.page_will_be_deleted")}</li>
                  <li>• {t("live_editor.all_components_lost")}</li>
                  <li>• {t("live_editor.affect_live_website")}</li>
                  <li>• {t("live_editor.no_backup")}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">
              {t("live_editor.confirm_deletion")}
            </p>
            <div className="bg-gray-100 p-3 rounded-lg border">
              <p className="text-sm font-mono text-gray-800">
                "{t("live_editor.confirmation_text")}"
              </p>
            </div>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => onConfirmationChange(e.target.value)}
              placeholder={t("live_editor.type_confirmation")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 pt-4">
          <AlertDialogCancel
            onClick={onCancel}
            className="flex-1 sm:flex-none bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 px-6 py-3"
          >
            {t("theme_selector.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={
              confirmation !== "I am sure I want to delete this page" &&
              confirmation !== "أنا متأكد من أنني أريد حذف هذه الصفحة" &&
              confirmation !== "أنا متأكد"
            }
            className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 border-0 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {t("live_editor.yes_im_sure")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
