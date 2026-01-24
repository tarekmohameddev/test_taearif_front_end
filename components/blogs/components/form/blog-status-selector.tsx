/**
 * Blog Status Selector Component
 * 
 * @description اختيار الحالة (draft/published) بتصميم modern جداً
 * 
 * @dependencies
 * - Uses: lucide-react (للأيقونات)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @props
 * - formData: { status: "draft" | "published" } (بيانات النموذج)
 * - onChange: (status: "draft" | "published") => void (دالة التغيير)
 * 
 * @related
 * - types/blog.types.ts (BlogFormData)
 */

import { Label } from "@/components/ui/label";
import { FileText, Globe, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogStatusSelectorProps {
  formData: {
    status: "draft" | "published";
  };
  onChange: (status: "draft" | "published") => void;
}

export function BlogStatusSelector({
  formData,
  onChange,
}: BlogStatusSelectorProps) {
  const statusOptions = [
    {
      value: "draft" as const,
      label: "مسودة",
      description: "المقال غير منشور ويمكنك التعديل عليه",
      icon: FileText,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      selectedBgColor: "bg-gray-100",
      selectedBorderColor: "border-gray-400",
      hoverBgColor: "hover:bg-gray-50",
    },
    {
      value: "published" as const,
      label: "منشور",
      description: "المقال منشور ومتاح للجمهور",
      icon: Globe,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      selectedBgColor: "bg-green-100",
      selectedBorderColor: "border-green-500",
      hoverBgColor: "hover:bg-green-50",
    },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">الحالة</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.status === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "relative group",
                "flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200",
                "text-right",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                isSelected
                  ? cn(
                      option.selectedBgColor,
                      option.selectedBorderColor,
                      "shadow-md shadow-black/5"
                    )
                  : cn(
                      "bg-white dark:bg-gray-900",
                      option.borderColor,
                      option.hoverBgColor,
                      "hover:shadow-sm hover:scale-[1.02]"
                    )
              )}
            >
              {/* Check Icon - يظهر فقط عند الاختيار */}
              {isSelected && (
                <div
                  className={cn(
                    "absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center",
                    "bg-white dark:bg-gray-800 shadow-sm",
                    "animate-in fade-in zoom-in duration-200"
                  )}
                >
                  <CheckCircle2
                    className={cn(
                      "w-4 h-4",
                      option.value === "published"
                        ? "text-green-600"
                        : "text-gray-600"
                    )}
                  />
                </div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200",
                  isSelected
                    ? option.selectedBgColor
                    : cn(option.bgColor, "group-hover:scale-110")
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-colors duration-200",
                    isSelected
                      ? option.color
                      : cn(option.color, "opacity-70 group-hover:opacity-100")
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={cn(
                      "font-semibold text-base transition-colors duration-200",
                      isSelected
                        ? option.color
                        : "text-gray-900 dark:text-gray-100"
                    )}
                  >
                    {option.label}
                  </h3>
                </div>
                <p
                  className={cn(
                    "text-sm transition-colors duration-200",
                    isSelected
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-gray-500 dark:text-gray-500"
                  )}
                >
                  {option.description}
                </p>
              </div>

              {/* Selection Indicator - Gradient Border Effect */}
              {isSelected && (
                <div
                  className={cn(
                    "absolute inset-0 rounded-xl pointer-events-none",
                    option.value === "published"
                      ? "bg-gradient-to-br from-green-500/10 to-green-600/5"
                      : "bg-gradient-to-br from-gray-500/10 to-gray-600/5"
                  )}
                />
              )}

              {/* Hover Effect - Ripple */}
              <div
                className={cn(
                  "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none",
                  option.value === "published"
                    ? "bg-gradient-to-br from-green-500/5 to-transparent"
                    : "bg-gradient-to-br from-gray-500/5 to-transparent"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
