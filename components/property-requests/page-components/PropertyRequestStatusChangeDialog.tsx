import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, User, Tag, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";

interface PropertyRequest {
  id: number;
  full_name: string;
  status?: string;
}

interface PropertyRequestStatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyRequest: PropertyRequest | null;
  onStatusUpdated: (propertyRequestId: number, newStatus: string) => void;
}

// Available statuses for property requests
const STATUS_OPTIONS = [
  { value: "جديد", label: "جديد", color: "bg-gray-500" },
  { value: "بحث عن عقار", label: "بحث عن عقار", color: "bg-yellow-500" },
  { value: "في المعاينه", label: "في المعاينه", color: "bg-purple-500" },
  { value: "تم اتمام الصفقه", label: "تم اتمام الصفقه", color: "bg-green-500" },
  { value: "رفض الصفقه", label: "رفض الصفقه", color: "bg-red-500" },
];

export const PropertyRequestStatusChangeDialog = ({
  open,
  onOpenChange,
  propertyRequest,
  onStatusUpdated,
}: PropertyRequestStatusChangeDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { userData } = useAuthStore();

  // Set initial status when dialog opens
  useEffect(() => {
    if (open && propertyRequest) {
      setSelectedStatus(propertyRequest.status || "جديد");
    }
  }, [open, propertyRequest]);

  const handleSave = async () => {
    if (!propertyRequest || !selectedStatus) return;

    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      toast.error("يجب تسجيل الدخول أولاً", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(`/v1/property-requests/${propertyRequest.id}`, {
        status: selectedStatus,
      });

      toast.success("تم تحديث حالة طلب العقار بنجاح!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "12px 20px",
          borderRadius: "8px",
        },
      });

      onStatusUpdated(propertyRequest.id, selectedStatus);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating property request status:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تحديث الحالة",
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#EF4444",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "8px",
          },
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedStatusOption = STATUS_OPTIONS.find(
    (option) => option.value === selectedStatus,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">تغيير الحالة</div>
              <div className="text-sm text-muted-foreground font-normal">
                اختر الحالة المناسبة لطلب العقار
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* معلومات طلب العقار */}
          {propertyRequest && (
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{propertyRequest.full_name}</div>
                <div className="text-sm text-muted-foreground">
                  طلب عقار رقم #{propertyRequest.id}
                </div>
              </div>
            </div>
          )}

          {/* اختيار الحالة */}
          <div className="space-y-3">
            <label className="text-sm font-medium">اختر الحالة:</label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${option.color}`}
                      />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* معاينة الحالة المختارة */}
          {selectedStatusOption && (
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">الحالة المختارة:</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full ${selectedStatusOption.color}`}
                />
                <Badge variant="outline" className="font-medium">
                  {selectedStatusOption.label}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !selectedStatus}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <CheckCircle className="ml-2 h-4 w-4" />
                حفظ
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

