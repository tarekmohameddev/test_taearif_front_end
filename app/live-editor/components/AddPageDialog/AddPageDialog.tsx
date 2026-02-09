"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEditorT } from "@/context/editorI18nStore";
import useAuthStore from "@/context/AuthContext";
import { usePageForm } from "../../hooks/usePageForm";
import { usePageValidation } from "../../hooks/usePageValidation";
import { createPageHandler } from "../../utils/createPageHandler";
import { BasicInfoSection } from "./BasicInfoSection";
import { SeoSettingsSection } from "./SeoSettingsSection";
import { AdvancedSettingsSection } from "./AdvancedSettingsSection";
import { AddPageDialogProps } from "../../types/types";

export function AddPageDialog({
  onPageCreated,
  open: externalOpen,
  onOpenChange,
}: AddPageDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = useEditorT();
  const { userData } = useAuthStore();
  const router = useRouter();

  const {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    resetForm,
  } = usePageForm();

  const { validateForm } = usePageValidation();

  // التأكد من وجود tenantId من userData.username
  const tenantId = userData?.username;

  // إذا لم يكن هناك tenantId، لا نعرض المكون
  if (!tenantId) {
    return null;
  }

  // معالج تغيير الحقول
  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // التحقق من صحة البيانات
  const handleValidate = () => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إنشاء صفحة جديدة مع WebsiteLayout
  const handleSubmit = async () => {
    if (!handleValidate()) return;

    setIsLoading(true);
    try {
      await createPageHandler(formData, (slug) => {
        // التحقق من نوع الصفحة
        const predefinedPages = [
          "homepage",
          "about",
          "contact",
          "products",
          "collections",
        ];
        const isPredefinedPage = predefinedPages.includes(slug);

        const successMessage = isPredefinedPage
          ? "تم إنشاء الصفحة مع المكونات الافتراضية"
          : "تم إنشاء الصفحة المخصصة بنجاح";

        toast.success(successMessage);
        setOpen(false);

        // إضافة الصفحة إلى القائمة المحلية
        onPageCreated?.(slug);

        // إعادة توجيه إلى الصفحة الجديدة
        router.push(`/live-editor/${slug}`);

        // إعادة تعيين النموذج
        resetForm();
        setErrors({});
      });
    } catch (error) {
      toast.error("حدث خطأ في إنشاء الصفحة");
      console.error("Error creating page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Hide DialogTrigger (green button) when dialog is controlled externally */}
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:text-white hover:scale-[calc(1.05)] border-0 hover:from-emerald-600 hover:to-teal-600 transition-all duration-2000 shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {t("editor.add_page")}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto relative"
        dir="ltr"
      >
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {t("editor.add_page")}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                {t("editor.page_information")} و {t("editor.seo_settings")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <BasicInfoSection
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
          />

          <Separator />

          <SeoSettingsSection
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
          />

          <Separator />

          <AdvancedSettingsSection
            formData={formData}
            onFieldChange={handleFieldChange}
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            {t("editor.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-2000"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                جاري الإنشاء...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                إنشاء الصفحة
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
