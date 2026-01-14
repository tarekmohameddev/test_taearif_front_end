"use client";
import { useMemo, useState, useEffect } from "react";
import {
  getErrorInfo,
  retryWithBackoff,
  logError,
  formatErrorMessage,
} from "@/utils/errorHandler";
import toast from "react-hot-toast";
import {
  Activity,
  Bath,
  Bed,
  Building,
  Copy,
  Edit,
  ExternalLink,
  Filter,
  Grid3X3,
  Eye,
  Heart,
  List,
  MapPin,
  MoreHorizontal,
  Plus,
  Ruler,
  Share2,
  Trash2,
  ChevronRight,
  ChevronLeft,
  X,
  Link2,
  MessageCircle,
  ChevronDown,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/context/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store";
import EmptyState from "@/components/empty-state";
import { ErrorDisplay } from "@/components/ui/error-display";
import { AdvancedFilterDialog } from "@/components/property/advanced-filter-dialog";
import { ActiveFiltersDisplay } from "@/components/property/active-filters-display";
import { PropertyStatisticsCards } from "@/components/property/property-statistics-cards";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

// Share Dialog Component
function ShareDialog({
  isOpen,
  onClose,
  property,
}: {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}) {
  const [copied, setCopied] = useState(false);
  const domain = useAuthStore.getState().userData?.domain || "";
  const propertyUrl = domain.startsWith("http")
    ? `${domain}/property/${property?.slug}`
    : `https://${domain}/property/${property?.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    toast.success("تم نسخ الرابط!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(property?.title || "")}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${property?.title || ""} ${propertyUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(property?.title || "")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(propertyUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(property?.title || "وحدة مميزة")}&body=${encodeURIComponent(`شاهد هذه الوحدة: ${propertyUrl}`)}`,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <button
          onClick={onClose}
          className="absolute left-2 top-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center">شارك الوحدة</h3>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="text-sm">فيسبوك</span>
          </a>

          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <span className="text-sm">إكس</span>
          </a>

          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <span className="text-sm">واتساب</span>
          </a>

          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
            <span className="text-sm">تيليجرام</span>
          </a>

          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <span className="text-sm">لينكدإن</span>
          </a>

          <a
            href={shareLinks.email}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm">بريد</span>
          </a>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {copied ? (
              <>
                <svg
                  className="w-5 h-5 text-green-500"
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
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Link2 className="h-5 w-5" />
                <span>نسخ الرابط</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  from,
  to,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  from: number;
  to: number;
}) {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-muted-foreground">
        عرض {from} إلى {to} من {totalItems} وحدة
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SkeletonPropertyCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative">
        <div className="aspect-[16/9] w-full bg-gray-300"></div>
      </div>
      <CardHeader className="p-4">
        <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <div className="h-8 w-full bg-gray-300 rounded"></div>
        <div className="h-8 w-full bg-gray-300 rounded"></div>
      </CardFooter>
    </Card>
  );
}

const getPaymentMethodText = (paymentMethod: any) => {
  const paymentMethods: { [key: string]: string } = {
    monthly: "شهري",
    quarterly: "ربع سنوي",
    semi_annual: "نصف سنوي",
    annual: "سنوي",
  };
  return paymentMethods[paymentMethod] || null;
};

const truncateTitle = (title: string, maxLength: number = 40): string => {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + "...";
};

export function PropertiesManagementPage() {
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportDateRange, setExportDateRange] = useState<DateRange | undefined>(undefined);
  const [importResult, setImportResult] = useState<{
    status: "success" | "partial_success" | "error" | null;
    message: string;
    code?: string;
    imported_count?: number;
    updated_count?: number;
    failed_count?: number;
    errors?: Array<{
      row: number;
      field: string;
      error: string;
      expected: string;
      actual: string | null;
      severity: string;
      suggestion: string;
    }>;
    details?: {
      suggestion?: string;
      [key: string]: any;
    };
  } | null>(null);
  const { clickedONSubButton, userData } = useAuthStore();

  const router = useRouter();
  const {
    propertiesManagement: {
      viewMode,
      priceRange,
      favorites,
      properties,
      loading,
      error,
      isInitialized,
      pagination,
      propertiesAllData,
    },
    setPropertiesManagement,
  } = useStore();

  const [reorderPopup, setReorderPopup] = useState<{
    open: boolean;
    type: "featured" | "normal";
  }>({ open: false, type: "normal" });

  const normalizeStatus = (status: any) => {
    if (status === "1" || status === 1) return "منشور";
    if (status === "0" || status === 0) return "مسودة";
    return status;
  };

  const clickedONButton = async () => {
    clickedONSubButton();
    router.push("/dashboard/settings");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv", // .csv
      ];

      if (
        !validTypes.includes(file.type) &&
        !file.name.endsWith(".xlsx") &&
        !file.name.endsWith(".xls") &&
        !file.name.endsWith(".csv")
      ) {
        toast.error("يرجى رفع ملف Excel صحيح (.xlsx, .xls, .csv)");
        return;
      }

      // التحقق من حجم الملف (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("حجم الملف كبير جداً. الحد الأقصى المسموح به هو 10MB");
        return;
      }

      setImportFile(file);
      setImportResult(null); // إعادة تعيين النتيجة عند اختيار ملف جديد
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("يرجى اختيار ملف للاستيراد");
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", importFile);

      const response = await axiosInstance.post(
        "/properties/bulk-import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        },
      );

      const data = response.data;

      // معالجة الاستجابة الناجحة (200 OK)
      if (response.status === 200 && data.status === "success") {
        setImportResult({
          status: "success",
          message: data.message || "تم استيراد الوحدات بنجاح",
          code: data.code,
          imported_count: data.imported_count || 0,
          updated_count: data.updated_count || 0,
          failed_count: data.failed_count || 0,
          errors: [],
        });

        // إعادة تحميل قائمة الوحدات
        fetchProperties(currentPage, appliedFilters);
      }
    } catch (error: any) {
      const response = error.response;
      const data = response?.data;

      // معالجة النجاح الجزئي (422 مع partial_success)
      if (
        response?.status === 422 &&
        data?.status === "partial_success"
      ) {
        setImportResult({
          status: "partial_success",
          message: data.message || "تم الاستيراد جزئياً",
          code: data.code,
          imported_count: data.imported_count || 0,
          updated_count: data.updated_count || 0,
          failed_count: data.failed_count || 0,
          errors: data.errors || [],
        });

        // إعادة تحميل قائمة الوحدات
        fetchProperties(currentPage, appliedFilters);
      }
      // معالجة الأخطاء
      else {
        const errorCode = data?.code || "UNKNOWN_ERROR";
        let errorMessage = data?.message || "حدث خطأ أثناء استيراد الوحدات";
        let suggestion = data?.details?.suggestion;

        // ترجمة رسائل الخطأ حسب الكود
        switch (errorCode) {
          case "IMPORT_VALIDATION_ERROR":
            if (data?.errors?.file) {
              errorMessage = Array.isArray(data.errors.file)
                ? data.errors.file[0]
                : data.errors.file;
            }
            break;
          case "IMPORT_FILE_TOO_LARGE":
            errorMessage =
              "حجم الملف يتجاوز الحد الأقصى المسموح به (10MB)";
            suggestion =
              "يرجى تقسيم الملف إلى ملفات أصغر (حد أقصى 10MB لكل ملف) أو تقليل عدد الصفوف.";
            break;
          case "IMPORT_FILE_INVALID":
            errorMessage = "الملف غير صحيح أو تالف";
            suggestion =
              "يرجى التأكد من أن الملف هو ملف Excel (.xlsx) أو CSV (.csv) صحيح. جرب فتحه في Excel أولاً للتحقق من أنه غير تالف.";
            break;
          case "IMPORT_PERMISSION_DENIED":
            if (response?.status === 401) {
              errorMessage = "يجب تسجيل الدخول لاستيراد الوحدات";
            } else if (response?.status === 403) {
              if (data?.details?.limit) {
                errorMessage =
                  "سيؤدي الاستيراد الجماعي إلى تجاوز حد قائمة الوحدات الخاص بك";
                suggestion = `الحد: ${data.details.limit}، الحالي: ${data.details.current_count}، المتوقع إضافته: ${data.details.incoming_count}، المتاح: ${data.details.available_slots}. يرجى إزالة بعض الوحدات الموجودة أو ترقية الباقة لزيادة الحد.`;
              } else {
                errorMessage = "لم يتم العثور على باقة نشطة للمستخدم";
                suggestion =
                  "يرجى تفعيل باقة عضوية لاستيراد الوحدات.";
              }
            }
            break;
          case "IMPORT_PROCESSING_ERROR":
            errorMessage = "حدث خطأ أثناء معالجة الاستيراد";
            suggestion =
              "يرجى التحقق من تنسيق الملف والبيانات، ثم المحاولة مرة أخرى. إذا استمرت المشكلة، يرجى الاتصال بالدعم.";
            break;
        }

        setImportResult({
          status: "error",
          message: errorMessage,
          code: errorCode,
          imported_count: 0,
          updated_count: 0,
          failed_count: 0,
          errors: data?.errors || [],
          details: {
            suggestion: suggestion || data?.details?.suggestion,
            ...data?.details,
          },
        });

        if (error instanceof Error) {
          logError(error, "handleImport");
        }
      }
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const response = await axiosInstance.get(
        "/properties/bulk-import/template",
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv",
          },
        },
      );

      // التحقق من أن الاستجابة هي blob
      if (response.data instanceof Blob) {
        // الحصول على اسم الملف من headers أو استخدام اسم افتراضي
        const contentDisposition = response.headers["content-disposition"];
        let filename = `properties-template-${new Date().toISOString().split("T")[0]}.xlsx`;

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
            // معالجة UTF-8 encoding إذا كان موجوداً
            if (filename.startsWith("UTF-8''")) {
              filename = decodeURIComponent(filename.replace("UTF-8''", ""));
            }
          }
        }

        // إنشاء رابط للتحميل
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // تنظيف
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("تم تحميل القالب بنجاح");
      } else {
        throw new Error("استجابة غير صحيحة من الخادم");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء تحميل القالب";
      toast.error(errorMessage);
      if (error instanceof Error) {
        logError(error, "handleDownloadTemplate");
      }
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleExport = async () => {
    // التحقق من وجود نطاق تاريخ محدد
    if (!exportDateRange?.from || !exportDateRange?.to) {
      toast.error("يرجى تحديد نطاق التاريخ للتصدير");
      return;
    }

    setIsExporting(true);
    setExportDialogOpen(false);
    
    try {
      // بناء معاملات الفلترة
      const params = new URLSearchParams();
      
      // إضافة نطاق التاريخ المحدد
      params.set("date_from", format(exportDateRange.from, "yyyy-MM-dd"));
      params.set("date_to", format(exportDateRange.to, "yyyy-MM-dd"));
      
      // إضافة الفلاتر المطبقة
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          // تخطي date_from و date_to لأننا نستخدم exportDateRange
          if (key === "date_from" || key === "date_to") {
            return;
          }
          
          if (Array.isArray(value)) {
            if (value.length > 0) {
              if (key === "employee_id" || key === "category_id" || key === "purpose") {
                value.forEach((item) => {
                  params.append(`${key}[]`, item.toString());
                });
              } else {
                params.set(key, value.join(","));
              }
            }
          } else {
            params.set(key, value.toString());
          }
        }
      });

      const response = await axiosInstance.get(
        `/properties/export?${params.toString()}`,
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv",
          },
        },
      );

      // التحقق من أن الاستجابة هي blob
      if (response.data instanceof Blob) {
        // الحصول على اسم الملف من headers أو استخدام اسم افتراضي
        const contentDisposition = response.headers["content-disposition"];
        let filename = `properties-export-${new Date().toISOString().split("T")[0]}.xlsx`;

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
            // معالجة UTF-8 encoding إذا كان موجوداً
            if (filename.startsWith("UTF-8''")) {
              filename = decodeURIComponent(filename.replace("UTF-8''", ""));
            }
          }
        }

        // إنشاء رابط للتحميل
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // تنظيف
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("تم تصدير الوحدات بنجاح");
      } else {
        throw new Error("استجابة غير صحيحة من الخادم");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء تصدير الوحدات";
      toast.error(errorMessage);
      if (error instanceof Error) {
        logError(error, "handleExport");
      }
    } finally {
      setIsExporting(false);
    }
  };

  const fetchProperties = async (page = 1, filters = {}) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      console.log("No token available, skipping fetchProperties");
      setPropertiesManagement({
        loading: false,
        error: "Authentication required. Please login.",
      });
      return;
    }

    // تحديث حالة التحميل
    setPropertiesManagement({
      loading: true,
      error: null,
    });

    try {
      // بناء معاملات الفلترة
      const params = new URLSearchParams();
      params.set("page", page.toString());

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              // For arrays, use multiple params: employee_id[]=1&employee_id[]=2
              // But also support comma-separated for backward compatibility
              if (key === "employee_id" || key === "category_id" || key === "purpose") {
                value.forEach((item) => {
                  params.append(`${key}[]`, item.toString());
                });
              } else {
                params.set(key, value.join(","));
              }
            }
          } else {
            params.set(key, value.toString());
          }
        }
      });

      // استخدام نظام إعادة المحاولة
      const response = await retryWithBackoff(
        async () => {
          const res = await axiosInstance.get(
            `/properties?${params.toString()}`,
          );
          return res;
        },
        3,
        1000,
      );

      const propertiesList = response.data?.data?.properties || [];
      const pagination = response.data?.data?.pagination || null;
      const propertiesAllData = response.data?.data || null;

      const mappedProperties = propertiesList.map((property, index) => ({
        ...property,
        thumbnail: property.featured_image,
        listingType:
          String(property.transaction_type) === "1" ||
          property.transaction_type === "sale"
            ? "للبيع"
            : "للإيجار",
        status: property.status === 1 ? "منشور" : "مسودة",
        lastUpdated: new Date(property.updated_at).toLocaleDateString("ar-AE"),
        features: Array.isArray(property.features) ? property.features : [],
      }));

      setPropertiesManagement({
        properties: mappedProperties,
        pagination,
        propertiesAllData,
        loading: false,
        isInitialized: true,
      });
    } catch (error) {
      const errorInfo = logError(error, "fetchProperties");

      setPropertiesManagement({
        error: formatErrorMessage(error, "حدث خطأ أثناء جلب بيانات الوحدات"),
        loading: false,
        isInitialized: true,
      });
    }
  };
  const normalizedProperties = useMemo(() => {
    return properties.map((property: any) => ({
      ...property,
      status: normalizeStatus(property.status),
    }));
  }, [properties]);

  const setViewMode = (mode: "grid" | "list") => {
    setPropertiesManagement({ viewMode: mode });
  };

  const handlePriceRangeChange = (newRange: number[]) => {
    setPropertiesManagement({ priceRange: newRange });
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((item: any) => item !== id)
      : [...favorites, id];
    setPropertiesManagement({ favorites: newFavorites });
  };

  const handleDeleteProperty = async (id: string) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      console.log("No token available, skipping handleDeleteProperty");
      alert("Authentication required. Please login.");
      return;
    }

    const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذه الوحدة؟");
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`properties/${id}`);
        toast.success("تم حذف الوحدة بنجاح");

        // إعادة تحميل الصفحة الحالية بعد الحذف
        fetchProperties(currentPage);
      } catch (error) {
        toast.error("فشل في حذف الوحدة");
        console.error("Error deleting property:", error);
      }
    }
  };

  const handleDuplicateProperty = async (property: any) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      console.log("No token available, skipping handleDuplicateProperty");
      alert("Authentication required. Please login.");
      return;
    }

    try {
      const duplicateData = {
        title: property.title || property.contents[0].title,
        price: property.price,
      };

      await axiosInstance.post(
        `/properties/${property.id}/duplicate`,
        duplicateData,
      );
      toast.success("تم مضاعفة الوحدة بنجاح");

      // إعادة تحميل الوحدات لعرض الوحدة المضاعفة
      fetchProperties(currentPage);
    } catch (error) {
      toast.error("فشل في مضاعفة الوحدة");
      console.error("Error duplicating property:", error);
    }
  };

  const handleToggleStatus = async (property: any) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      console.log("No token available, skipping handleToggleStatus");
      alert("Authentication required. Please login.");
      return;
    }

    try {
      await axiosInstance.post(`/properties/${property.id}/toggle-status`);

      const newStatus = property.status === "منشور" ? "مسودة" : "منشور";
      toast.success(
        `تم ${property.status === "منشور" ? "إلغاء النشر" : "النشر"} بنجاح`,
      );

      // تحديث حالة الوحدة في القائمة المحلية
      setPropertiesManagement({
        properties: properties.map((p: any) =>
          p.id === property.id ? { ...p, status: newStatus } : p,
        ),
      });
    } catch (error) {
      toast.error("فشل في تغيير حالة النشر");
      console.error("Error toggling status:", error);
    }
  };

  const handleShare = (property: any) => {
    setSelectedProperty(property);
    setShareDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProperties(page, appliedFilters);
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    fetchProperties(1, filters);
  };

  const handleRemoveFilter = (filterKey: string, filterValue?: any) => {
    const newFilters: Record<string, any> = { ...appliedFilters };

    if (Array.isArray(newFilters[filterKey])) {
      newFilters[filterKey] = newFilters[filterKey].filter(
        (item: any) => item !== filterValue,
      );
      if (newFilters[filterKey].length === 0) {
        delete newFilters[filterKey];
      }
    } else {
      delete newFilters[filterKey];
    }

    setAppliedFilters(newFilters);
    setCurrentPage(1);
    fetchProperties(1, newFilters);
  };

  const handleClearAllFilters = () => {
    setAppliedFilters({});
    setCurrentPage(1);
    fetchProperties(1);
  };

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const { userData } = useAuthStore.getState();
    if (!userData?.token) {
      console.log("No token available, skipping fetchProperties in useEffect");
      return;
    }

    if (!isInitialized && !loading) {
      fetchProperties(1);
    }
  }, [fetchProperties, isInitialized, loading]);

  const renderSkeletons = () => (
    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <SkeletonPropertyCard key={idx} />
      ))}
    </div>
  );

  const reorderList =
    reorderPopup.type === "featured"
      ? normalizedProperties.filter((p: any) => p.featured)
      : normalizedProperties;

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">
                  يرجى تسجيل الدخول لعرض المحتوى
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  إدارة الوحدات
                </h1>
                <p className="text-muted-foreground">
                  أضف وأدرج قوائم الوحدات لموقعك على الويب
                </p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:flex-wrap">
                <Button
                  className="gap-1 w-full md:w-auto"
                  onClick={() => {
                    const propertiesLength = pagination?.total || 0;
                    const limit =
                      useAuthStore.getState().userData?.package
                        ?.real_estate_limit_number;
                    if (propertiesLength >= limit) {
                      setIsLimitReached(true);
                    } else {
                      router.push("/dashboard/buildings");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                  ادارة العمارات
                </Button>
                <Button
                  variant="outline"
                  className="gap-1 w-full md:w-auto"
                  onClick={() => setImportDialogOpen(true)}
                >
                  <Upload className="h-4 w-4" />
                  استيراد وحدات
                </Button>
                <Button
                  variant="outline"
                  className="gap-1 w-full md:w-auto"
                  onClick={() => setExportDialogOpen(true)}
                  disabled={isExporting || loading}
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? "جاري التصدير..." : "تصدير وحدات"}
                </Button>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 md:flex-none ${
                      viewMode === "grid" ? "bg-muted" : ""
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`flex-1 md:flex-none ${
                      viewMode === "list" ? "bg-muted" : ""
                    }`}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setFilterDialogOpen(true)}
                  className="gap-2 border-black text-black hover:bg-gray-100 w-full md:w-auto"
                >
                  <Filter className="h-4 w-4" />
                  فلترة
                  {Object.keys(appliedFilters).length > 0 && (
                    <span className="bg-black text-white text-xs rounded-full px-2 py-0.5">
                      {Object.keys(appliedFilters).length}
                    </span>
                  )}
                </Button>
                <Dialog>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>فلتر الوحدات</DialogTitle>
                      <DialogDescription>
                        قم بتحسين البحث الخاص بك بمعايير محددة
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>نوع الوحدة</Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "House",
                            "Apartment",
                            "Condo",
                            "Townhouse",
                            "Loft",
                          ].map((type) => (
                            <div
                              key={type}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox id={`type-${type}`} />
                              <label htmlFor={`type-${type}`} />
                              <label
                                htmlFor={`type-${type}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>الحالة</Label>
                        <RadioGroup defaultValue="all">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="status-all" />
                            <Label htmlFor="status-all">All</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="for-sale"
                              id="status-for-sale"
                            />
                            <Label htmlFor="status-for-sale">For Sale</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="for-rent"
                              id="status-for-rent"
                            />
                            <Label htmlFor="status-for-rent">For Rent</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <Label>نطاق السعر</Label>
                          <span className="text-sm text-muted-foreground">
                            ${priceRange[0].toLocaleString()} - $
                            {priceRange[1].toLocaleString()}
                          </span>
                        </div>
                        <Slider
                          defaultValue={priceRange}
                          max={2000000}
                          min={0}
                          step={10000}
                          onValueChange={handlePriceRangeChange}
                          className="py-4"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="bedrooms">غرف النوم</Label>
                          <Select>
                            <SelectTrigger id="bedrooms">
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                              <SelectItem value="5">5+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bathrooms">حمام</Label>
                          <Select>
                            <SelectTrigger id="bathrooms">
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="size">
                            الحد الأدنى للمساحة (قدم مربع)
                          </Label>
                          <Input id="size" type="number" placeholder="Any" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Reset</Button>
                      <Button>Apply Filters</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  className="gap-1 w-full md:w-auto"
                  onClick={() => {
                    const propertiesLength = pagination?.total || 0;
                    const limit =
                      useAuthStore.getState().userData?.package
                        ?.real_estate_limit_number;
                    if (propertiesLength >= limit) {
                      setIsLimitReached(true);
                    } else {
                      router.push("properties/add");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                  إضافة وحدة
                </Button>
              </div>
            </div>

            {/* نافذة منبثقة عند الوصول للحد الأقصى */}
            <Dialog open={isLimitReached} onOpenChange={setIsLimitReached}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center text-red-500">
                    لقد وصلت للحد الأقصى للإضافة
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    برجاء ترقية الباقة لإضافة المزيد من الوحدات.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsLimitReached(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={clickedONButton}>اشتراك</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* نافذة منبثقة لتصدير الوحدات */}
            <CustomDialog
              open={exportDialogOpen}
              onOpenChange={(open) => {
                setExportDialogOpen(open);
                if (!open) {
                  setExportDateRange(undefined);
                }
              }}
              maxWidth="max-w-2xl"
            >
              <CustomDialogContent>
                <CustomDialogClose
                  onClose={() => {
                    setExportDialogOpen(false);
                    setExportDateRange(undefined);
                  }}
                />
                <CustomDialogHeader>
                  <CustomDialogTitle>تصدير الوحدات</CustomDialogTitle>
                  <CustomDialogDescription>
                    حدد نطاق التاريخ للوحدات التي تريد تصديرها
                  </CustomDialogDescription>
                </CustomDialogHeader>
                <div className="px-4 sm:px-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">نطاق التاريخ</Label>
                      <div className="flex justify-center">
                        <Calendar
                          mode="range"
                          selected={exportDateRange}
                          onSelect={setExportDateRange}
                          numberOfMonths={2}
                          locale={ar}
                          toDate={new Date()}
                          className="rounded-md border"
                        />
                      </div>
                      {exportDateRange?.from && exportDateRange?.to && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="text-sm">
                            <strong>الفترة المحددة:</strong>{" "}
                            {format(exportDateRange.from, "yyyy-MM-dd", { locale: ar })} -{" "}
                            {format(exportDateRange.to, "yyyy-MM-dd", { locale: ar })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setExportDialogOpen(false);
                      setExportDateRange(undefined);
                    }}
                    disabled={isExporting}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleExport}
                    disabled={!exportDateRange?.from || !exportDateRange?.to || isExporting}
                  >
                    {isExporting ? "جاري التصدير..." : "تصدير"}
                  </Button>
                </div>
              </CustomDialogContent>
            </CustomDialog>

            {/* نافذة منبثقة لاستيراد الوحدات */}
            <CustomDialog
              open={importDialogOpen}
              onOpenChange={(open) => {
                setImportDialogOpen(open);
                if (!open) {
                  setImportFile(null);
                  setImportResult(null);
                }
              }}
              maxWidth="max-w-xl"
            >
              <CustomDialogContent className="overflow-y-auto">
                <CustomDialogClose
                  onClose={() => {
                    setImportDialogOpen(false);
                    setImportFile(null);
                    setImportResult(null);
                  }}
                />
                <CustomDialogHeader>
                  <CustomDialogTitle>استيراد وحدات</CustomDialogTitle>
                  <CustomDialogDescription>
                    قم بتحميل القالب واملأه بالبيانات المطلوبة ثم قم برفعه
                  </CustomDialogDescription>
                </CustomDialogHeader>

                {!importResult ? (
                  <>
                    <div className="grid gap-4 py-4 px-4 sm:px-6">
                      <div className="flex flex-col gap-4">
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={handleDownloadTemplate}
                          disabled={isDownloadingTemplate}
                        >
                          <Download className="h-4 w-4" />
                          {isDownloadingTemplate
                            ? "جاري التحميل..."
                            : "تحميل القالب"}
                        </Button>

                        <div className="grid gap-2">
                          <Label htmlFor="import-file">رفع ملف Excel</Label>
                          <Input
                            id="import-file"
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                            disabled={isImporting}
                          />
                          {importFile && (
                            <p className="text-sm text-muted-foreground">
                              الملف المختار: {importFile.name} (
                              {(importFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setImportDialogOpen(false);
                          setImportFile(null);
                          setImportResult(null);
                        }}
                        disabled={isImporting}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleImport}
                        disabled={!importFile || isImporting}
                      >
                        {isImporting ? "جاري الاستيراد..." : "استيراد"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="grid gap-4 py-4 px-4 sm:px-6">
                    {/* عرض النتائج */}
                    {importResult.status === "success" && (
                      <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <CardTitle className="text-green-800">
                              نجاح الاستيراد
                            </CardTitle>
                          </div>
                          <CardDescription className="text-green-700">
                            {importResult.message}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-3">
                            {(importResult.imported_count ?? 0) > 0 && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-300"
                              >
                                تم إنشاء: {importResult.imported_count}
                              </Badge>
                            )}
                            {(importResult.updated_count ?? 0) > 0 && (
                              <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-800 border-blue-300"
                              >
                                تم تحديث: {importResult.updated_count}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {importResult.status === "partial_success" && (
                      <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <CardTitle className="text-yellow-800">
                              نجاح جزئي
                            </CardTitle>
                          </div>
                          <CardDescription className="text-yellow-700">
                            {importResult.message}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-3">
                            {(importResult.imported_count ?? 0) > 0 && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-300"
                              >
                                تم إنشاء: {importResult.imported_count}
                              </Badge>
                            )}
                            {(importResult.updated_count ?? 0) > 0 && (
                              <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-800 border-blue-300"
                              >
                                تم تحديث: {importResult.updated_count}
                              </Badge>
                            )}
                            {(importResult.failed_count ?? 0) > 0 && (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 border-red-300"
                              >
                                فشل: {importResult.failed_count}
                              </Badge>
                            )}
                          </div>

                          {importResult.errors && importResult.errors.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold mb-2 text-yellow-800">
                                تفاصيل الأخطاء ({importResult.errors.length})
                              </h4>
                              <ScrollArea className="h-[300px] w-full rounded-md border border-yellow-200 bg-white p-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-[80px]">الصف</TableHead>
                                      <TableHead className="w-[120px]">الحقل</TableHead>
                                      <TableHead>الخطأ</TableHead>
                                      <TableHead className="w-[150px]">المتوقع</TableHead>
                                      <TableHead className="w-[120px]">الفعلي</TableHead>
                                      <TableHead>الاقتراح</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {importResult.errors.map((error, index) => (
                                      <TableRow key={index}>
                                        <TableCell className="font-medium">
                                          {error.row}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                          {error.field}
                                        </TableCell>
                                        <TableCell className="text-red-600">
                                          {error.error}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                          {error.expected}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                          {error.actual || "-"}
                                        </TableCell>
                                        <TableCell className="text-sm text-blue-600">
                                          {error.suggestion}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </ScrollArea>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {importResult.status === "error" && (
                      <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <CardTitle className="text-red-800">خطأ في الاستيراد</CardTitle>
                          </div>
                          <CardDescription className="text-red-700">
                            {importResult.message}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {importResult.details?.suggestion && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-800">
                                <strong>اقتراح:</strong> {importResult.details.suggestion}
                              </p>
                            </div>
                          )}
                          {importResult.errors && importResult.errors.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold mb-2 text-red-800">
                                تفاصيل الأخطاء
                              </h4>
                              <ScrollArea className="h-[200px] w-full rounded-md border border-red-200 bg-white p-4">
                                <div className="space-y-2">
                                  {importResult.errors.map((error, index) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-red-50 border border-red-200 rounded text-sm"
                                    >
                                      <p className="font-medium text-red-800">
                                        الصف {error.row} - {error.field}: {error.error}
                                      </p>
                                      {error.suggestion && (
                                        <p className="text-red-600 mt-1">
                                          {error.suggestion}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setImportDialogOpen(false);
                          setImportFile(null);
                          setImportResult(null);
                        }}
                      >
                        إغلاق
                      </Button>
                      {importResult.status !== "success" && (
                        <Button
                          onClick={() => {
                            setImportResult(null);
                          }}
                        >
                          إعادة المحاولة
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CustomDialogContent>
            </CustomDialog>

            {/* إحصائيات الوحدات */}
            <PropertyStatisticsCards />

            {/* عرض الفلاتر النشطة */}
            <ActiveFiltersDisplay
              filters={appliedFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {loading ? (
              renderSkeletons()
            ) : error ? (
              <ErrorDisplay
                error={error}
                onRetry={() => fetchProperties(currentPage)}
                title="خطأ في تحميل الوحدات"
              />
            ) : (
              <Tabs defaultValue="all">
                {/* <TabsList>
                  <TabsTrigger value="all">جميع الوحدات</TabsTrigger>
                </TabsList> */}
                <TabsContent value="all" className="mt-4">
                  {normalizedProperties.length === 0 ? (
                    <EmptyState type="وحدات" />
                  ) : (
                    <>
                      {viewMode === "grid" ? (
                        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4  ">
                          {normalizedProperties.map((property: any) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              isFavorite={favorites.includes(
                                property.id.toString(),
                              )}
                              onToggleFavorite={toggleFavorite}
                              onDelete={handleDeleteProperty}
                              onDuplicate={handleDuplicateProperty}
                              onToggleStatus={handleToggleStatus}
                              onShare={handleShare}
                              setReorderPopup={setReorderPopup}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {normalizedProperties.map((property: any) => (
                            <PropertyListItem
                              key={property.id}
                              property={property}
                              isFavorite={favorites.includes(
                                property.id.toString(),
                              )}
                              onToggleFavorite={toggleFavorite}
                              onDelete={handleDeleteProperty}
                              onDuplicate={handleDuplicateProperty}
                              onToggleStatus={handleToggleStatus}
                              onShare={handleShare}
                              setReorderPopup={setReorderPopup}
                            />
                          ))}
                        </div>
                      )}

                      {pagination && pagination.last_page > 1 && (
                        <Pagination
                          currentPage={pagination.current_page}
                          totalPages={pagination.last_page}
                          onPageChange={handlePageChange}
                          totalItems={pagination.total}
                          itemsPerPage={pagination.per_page}
                          from={pagination.from}
                          to={pagination.to}
                        />
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>

          <ShareDialog
            isOpen={shareDialogOpen}
            onClose={() => setShareDialogOpen(false)}
            property={selectedProperty}
          />

          <AdvancedFilterDialog
            isOpen={filterDialogOpen}
            onClose={() => setFilterDialogOpen(false)}
            filterData={propertiesAllData}
            onApplyFilters={handleApplyFilters}
            appliedFilters={appliedFilters}
          />

          {reorderPopup.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() =>
                  setReorderPopup({ ...reorderPopup, open: false })
                }
              />
              <div className="relative z-10 bg-white dark:bg-background rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="font-bold mb-4 text-lg text-center">
                  {reorderPopup.type === "featured"
                    ? "ترتيب الوحدات المميزة"
                    : "ترتيب الوحدات"}
                </h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {reorderList.map((property: any, idx: number) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <span>
                        {property.title || property.contents?.[0]?.title}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex justify-evenly"
                          >
                            <div className="w-2">
                              {property.reorder_featured ||
                                property.reorder ||
                                idx + 1}
                            </div>
                            <ChevronDown className="-ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-[15rem] overflow-y-auto">
                          {(() => {
                            // تحديد العدد بناءً على نوع الترتيب
                            let itemCount =
                              reorderPopup.type === "featured"
                                ? propertiesAllData?.total_reorder_featured ||
                                  reorderList.length
                                : pagination?.total || reorderList.length;
                            return [...Array(itemCount)].map((_, i) => (
                              <DropdownMenuItem
                                key={i}
                                onClick={async () => {
                                  setReorderPopup({
                                    open: false,
                                    type: reorderPopup.type,
                                  });
                                  const toastId = toast.loading(
                                    "جاري تحديث الترتيب...",
                                  );
                                  try {
                                    if (reorderPopup.type === "featured") {
                                      await axiosInstance.post(
                                        "/properties/reorder-featured",
                                        [
                                          {
                                            id: property.id,
                                            reorder_featured: i + 1,
                                          },
                                        ],
                                      );
                                    } else {
                                      await axiosInstance.post(
                                        "/properties/reorder",
                                        [{ id: property.id, reorder: i + 1 }],
                                      );
                                    }
                                    toast.success("تم تحديث الترتيب");
                                  } catch (e) {
                                    toast.error("حدث خطأ أثناء الترتيب");
                                  } finally {
                                    toast.dismiss(toastId);
                                  }
                                }}
                              >
                                {i + 1}
                              </DropdownMenuItem>
                            ));
                          })()}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

interface PropertyCardProps {
  property: any;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (property: any) => void;
  onToggleStatus: (property: any) => void;
  onShare: (property: any) => void;
  setReorderPopup: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      type: "featured" | "normal";
    }>
  >;
}

// Helper function to extract city and district/neighborhood from property
function formatAddress(property: any): string {
  // First, check if property has city and district/neighborhood fields directly
  const city = property?.city?.name_ar || property?.city?.name || property?.city_name || property?.city;
  const district = property?.district?.name_ar || property?.district?.name || property?.district_name || property?.district || property?.neighborhood?.name_ar || property?.neighborhood?.name || property?.neighborhood;
  
  // If we have both city and district, return them
  if (district && city) {
    return `${district}، ${city}`;
  } else if (city) {
    return city;
  } else if (district) {
    return district;
  }
  
  // If not available directly, try to parse from address
  const address = property?.address || property?.contents?.[0]?.address;
  if (!address) return "";
  
  // Common Arabic city names
  const cities = [
    "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", 
    "الخبر", "الطائف", "بريدة", "تبوك", "خميس مشيط", "حائل",
    "الجبيل", "نجران", "أبها", "ينبع", "الباحة", "عرعر", "سكاكا"
  ];
  
  // Try to find city in address
  let parsedCity = "";
  let parsedDistrict = "";
  
  // Split by common separators
  const addressParts = address.split(/[،,،\-–—]/).map(p => p.trim()).filter(p => p);
  
  // Find city (usually at the end or contains city name)
  for (let i = addressParts.length - 1; i >= 0; i--) {
    const part = addressParts[i];
    for (const cityName of cities) {
      if (part.includes(cityName)) {
        parsedCity = cityName;
        break;
      }
    }
    if (parsedCity) break;
  }
  
  // District is usually the first part or before city
  if (addressParts.length > 0) {
    const cityIndex = addressParts.findIndex(p => p.includes(parsedCity));
    
    if (cityIndex > 0) {
      // Get the part before city (usually district/neighborhood)
      parsedDistrict = addressParts[cityIndex - 1];
    } else if (addressParts.length > 0 && !parsedCity) {
      // If city not found, use first part as district
      parsedDistrict = addressParts[0];
    }
  }
  
  // Return formatted: district, city or just city if no district
  if (parsedDistrict && parsedCity) {
    return `${parsedDistrict}، ${parsedCity}`;
  } else if (parsedCity) {
    return parsedCity;
  } else if (parsedDistrict) {
    return parsedDistrict;
  }
  
  // Fallback: return original address if parsing fails
  return address;
}

function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onShare,
  setReorderPopup,
}: PropertyCardProps & { setReorderPopup: any }) {
  const router = useRouter();
  const { userData } = useAuthStore();
  
  const formattedAddress = formatAddress(property);
  
  return (
    <Card className="overflow-hidden" dir="rtl">
      <div className="relative">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={
              property.thumbnail ||
              property.featured_image ||
              "/placeholder.svg"
            }
            alt={property.title || property.contents[0].title}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
        {property.featured && (
          <div className="absolute right-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            مميز
          </div>
        )}
        <div
          className={`absolute left-2 top-2 rounded-md px-2 py-1 text-xs font-medium ${
            property.status === "منشور"
              ? "bg-green-500 text-white"
              : "bg-amber-500 text-white"
          }`}
        >
          {property.status}
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle
              className={`line-clamp-2 max-w-[300px] font-semibold ${(property.title || property.contents[0].title).length > 20 ? "text-sm " : ""}`}
            >
              {truncateTitle(property.title || property.contents[0].title)}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {formattedAddress}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 bg-muted hover:bg-muted/80">
                <MoreHorizontal className="h-1 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* ترتيب الوحدة في الرئيسية */}
              {property.featured && (
                <DropdownMenuItem
                  onClick={() => {
                    /* TODO: ترتيب الوحدة في الرئيسية */
                    setReorderPopup({ open: true, type: "featured" });
                  }}
                >
                  <Grid3X3 className="ml-2 h-4 w-4" />
                  ترتيب الوحدة في الرئيسية
                </DropdownMenuItem>
              )}
              {/* ترتيب الوحدة */}
              <DropdownMenuItem
                onClick={() => {
                  /* TODO: ترتيب الوحدة */
                  setReorderPopup({ open: true, type: "normal" });
                }}
              >
                <List className="ml-2 h-4 w-4" />
                ترتيب الوحدة
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push("/dashboard/properties/" + property.id + "/edit")
                }
              >
                <Edit className="ml-2 h-4 w-4" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const domain = useAuthStore.getState().userData?.domain || "";
                  const url = domain.startsWith("http")
                    ? `${domain}property/${property.slug}`
                    : `https://${domain}/property/${property.slug}`;
                  window.open(url, "_blank");
                }}
              >
                <ExternalLink className="ml-2 h-4 w-4" />
                معاينة
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const url = `/dashboard/activity-logs/property/${property.id}`;
                  window.open(url, "_blank");
                }}
              >
                <Activity className="ml-2 h-4 w-4" />
                سجل النشاطات
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(property)}>
                <Copy className="ml-2 h-4 w-4" />
                مضاعفة
              </DropdownMenuItem>
              {property.status === "مسودة" ? (
                <DropdownMenuItem onClick={() => onToggleStatus(property)}>
                  <ExternalLink className="ml-2 h-4 w-4" />
                  نشر
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onToggleStatus(property)}>
                  <Edit className="ml-2 h-4 w-4" />
                  إلغاء النشر
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onShare(property)}>
                <Share2 className="ml-2 h-4 w-4" />
                شارك
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(property.id)}
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حذف الوحدة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div
          className={`grid gap-2 text-sm ${property.status === "منشور" && property.creator ? "grid-cols-3" : "grid-cols-2"}`}
        >
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">مشاهدات</span>
            <span className="font-medium flex items-center gap-1">
              <Eye className="h-3 w-3" /> {property.visits || 0}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">المساحة</span>
            <span className="font-medium flex items-center gap-1">
              <Ruler className="h-3 w-3" /> {property.size || property.area || 0} م²
            </span>
          </div>
          {property.status === "منشور" && property.creator && (
            <div className="flex flex-col items-end justify-center">
              <div className="rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white mt-1">
                {property.creator.name === "User"
                  ? userData?.first_name && userData?.last_name
                    ? `${userData.first_name} ${userData.last_name}`
                    : userData?.username || userData?.first_name || "User"
                  : property.creator.name}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1 pt-2">
          {Array.isArray(property.features) && property.features.length > 0 ? (
            <>
              {property.features
                .slice(0, 3)
                .map((feature: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {feature}
                  </span>
                ))}
              {property.features.length > 3 && (
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  +{property.features.length - 3} more
                </span>
              )}
            </>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-1/2 gap-1"
          onClick={() =>
            router.push("/dashboard/properties/" + property.id + "/edit")
          }
        >
          <Edit className="h-3.5 w-3.5" />
          تعديل
        </Button>
        <div className="text-xl font-semibold flex gap-1">
          {property.transaction_type === "sale" ||
          property.purpose === "sale" ? (
            <>
              <span>{Math.floor(parseFloat(property.price) || 0).toLocaleString()}</span>
              <img
                src="/Saudi_Riyal_Symbol.svg"
                alt="ريال سعودي"
                className="w-[1.35rem] h-[1.35rem] filter brightness-0 contrast-100 mt-0.5"
              />
            </>
          ) : (
            <>
              <span>{Math.floor(parseFloat(property.price) || 0).toLocaleString()}</span>
              <img
                src="/Saudi_Riyal_Symbol.svg"
                alt="ريال سعودي"
                className="w-[1.35rem] h-[1.35rem] filter brightness-0 contrast-100 mt-0.5"
              />
              {getPaymentMethodText(property.payment_method) && (
                <span className="text-sm">/{getPaymentMethodText(property.payment_method)}</span>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function PropertyListItem({
  property,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onShare,
  setReorderPopup,
}: PropertyCardProps) {
  const router = useRouter();
  
  const formattedAddress = formatAddress(property);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row-reverse">
        <div className="relative sm:w-1/3 md:w-1/4">
          <div className="aspect-[16/9] sm:aspect-auto sm:h-full w-full overflow-hidden">
            <img
              src={
                property.thumbnail ||
                property.featured_image ||
                "/placeholder.svg"
              }
              alt={property.title || property.contents[0].title}
              className="h-full w-full object-cover"
            />
          </div>
          {property.featured && (
            <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              مميز
            </div>
          )}
          <div
            className={`absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium ${
              property.status === "منشور"
                ? "bg-green-500 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {property.status}
          </div>
          {property.status === "منشور" && property.creator && (
            <div className="absolute right-2 top-12 rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white">
              {property.creator.name}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-row-reverse items-start justify-between">
            <div>
              <h3 className="font-semibold">
                {truncateTitle(property.title || property.contents[0].title)}
              </h3>
              <p className="text-sm text-muted-foreground flex flex-row-reverse items-center gap-1">
                <MapPin className="h-3 w-3" />{" "}
                {formattedAddress}
              </p>
            </div>
            <div className="text-lg font-semibold">
              {property.transaction_type === "sale" ||
              property.purpose === "sale" ? (
                <div className="flex gap-1">
                  <span>{Math.floor(parseFloat(property.price) || 0).toLocaleString()}</span>
                  <img
                    src="/Saudi_Riyal_Symbol.svg"
                    alt="ريال سعودي"
                    className="w-[1.15rem] h-[1.15rem] filter brightness-0 contrast-100 mt-0.5"
                  />
                </div>
              ) : (
                <div className="flex gap-1">
                  <span>{Math.floor(parseFloat(property.price) || 0).toLocaleString()}</span>
                  <img
                    src="/Saudi_Riyal_Symbol.svg"
                    alt="ريال سعودي"
                    className="w-[1.15rem] h-[1.15rem] filter brightness-0 contrast-100 mt-0.5"
                  />
                  {getPaymentMethodText(property.payment_method) && (
                    <span>/{getPaymentMethodText(property.payment_method)}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex flex-row-reverse items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span>{property.bath || 0} حمام</span>
            </div>
            <div className="flex flex-row-reverse items-center gap-1">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span>{property.size || property.area || 0} م²</span>
            </div>
            <div className="flex flex-row-reverse items-center gap-1">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{property.type || "غير محدد"}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {property.features &&
              property.features.map((feature: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                >
                  {feature}
                </span>
              ))}
          </div>
          <div className="mt-auto pt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push("/dashboard/properties/" + property.id + "/edit")
              }
            >
              <Edit className="mr-1 h-3.5 w-3.5" />
              تعديل
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const domain = useAuthStore.getState().userData?.domain || "";
                const url = domain.startsWith("http")
                  ? `${domain}property/${property.slug}`
                  : `https://${domain}/property/${property.slug}`;
                window.open(url, "_blank");
              }}
            >
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              معاينة
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="bg-muted hover:bg-muted/80">
                  <MoreHorizontal className="h-1 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* ترتيب الوحدة في الرئيسية */}
                {property.featured && (
                  <DropdownMenuItem
                    onClick={() => {
                      setReorderPopup({ open: true, type: "featured" });
                    }}
                  >
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    ترتيب الوحدة في الرئيسية
                  </DropdownMenuItem>
                )}
                {/* ترتيب الوحدة */}
                <DropdownMenuItem
                  onClick={() => {
                    /* TODO: ترتيب الوحدة */
                    setReorderPopup({ open: true, type: "normal" });
                  }}
                >
                  <List className="mr-2 h-4 w-4" />
                  ترتيب الوحدة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(property)}>
                  <Copy className="mr-2 h-4 w-4" />
                  مضاعفة
                </DropdownMenuItem>
                {property.status === "مسودة" ? (
                  <DropdownMenuItem onClick={() => onToggleStatus(property)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    نشر
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onToggleStatus(property)}>
                    <Edit className="mr-2 h-4 w-4" />
                    إلغاء النشر
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onShare(property)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  شارك
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(property.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  حذف الوحدة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}
