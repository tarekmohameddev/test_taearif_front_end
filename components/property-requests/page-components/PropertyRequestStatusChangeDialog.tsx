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
  status?: {
    id: number;
    name_ar: string;
    name_en: string;
  } | null;
}

interface Status {
  id: number;
  name_ar: string;
  name_en: string;
}

interface PropertyRequestStatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyRequest: PropertyRequest | null;
  onStatusUpdated: (propertyRequestId: number, newStatus: string) => void;
}

export const PropertyRequestStatusChangeDialog = ({
  open,
  onOpenChange,
  propertyRequest,
  onStatusUpdated,
}: PropertyRequestStatusChangeDialogProps) => {
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingStatuses, setFetchingStatuses] = useState(false);
  const { userData } = useAuthStore();

  // Fetch statuses from API
  useEffect(() => {
    const fetchStatuses = async () => {
      if (!userData?.token) {
        console.log("No token available, skipping fetchStatuses");
        return;
      }

      setFetchingStatuses(true);
      try {
        const response = await axiosInstance.get<{
          status: string;
          data: {
            status?: Status[];
            cities?: any[];
            districts?: any[];
            categories?: any[];
            property_types?: string[];
            purchase_goals?: string[];
            seriousness_options?: string[];
            employees?: any[];
          };
        }>("/v1/property-requests/filters");
        if (response.data.data?.status) {
          setStatuses(response.data.data.status);
        }
      } catch (error) {
        console.error("Error fetching statuses:", error);
        toast.error("حدث خطأ أثناء تحميل الحالات", {
          duration: 4000,
          position: "top-center",
        });
      } finally {
        setFetchingStatuses(false);
      }
    };

    if (open) {
      fetchStatuses();
    }
  }, [open, userData?.token]);

  // Set initial status when dialog opens
  useEffect(() => {
    if (open && propertyRequest && statuses.length > 0) {
      setSelectedStatusId(propertyRequest.status?.id || statuses[0]?.id || null);
    }
  }, [open, propertyRequest, statuses]);

  const handleSave = async () => {
    if (!propertyRequest || !selectedStatusId) return;

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
      await axiosInstance.put(`/v1/property-requests/${propertyRequest.id}/status`, {
        status_id: selectedStatusId,
      });

      const selectedStatus = statuses.find((s) => s.id === selectedStatusId);
      const statusName = selectedStatus?.name_ar || "";

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

      onStatusUpdated(propertyRequest.id, statusName);
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

  const selectedStatusOption = statuses.find(
    (status) => status.id === selectedStatusId,
  );

  // Helper function to get color based on status name
  const getStatusColor = (statusName: string): string => {
    if (statusName.includes("جديد") || statusName.includes("New")) {
      return "bg-gray-500";
    } else if (
      statusName.includes("متابعة") ||
      statusName.includes("Progress") ||
      statusName.includes("بحث")
    ) {
      return "bg-yellow-500";
    } else if (
      statusName.includes("معاينه") ||
      statusName.includes("Inspection") ||
      statusName.includes("معلق")
    ) {
      return "bg-purple-500";
    } else if (
      statusName.includes("مكتمل") ||
      statusName.includes("Completed") ||
      statusName.includes("تمام")
    ) {
      return "bg-green-500";
    } else if (
      statusName.includes("ملغي") ||
      statusName.includes("Cancelled") ||
      statusName.includes("رفض")
    ) {
      return "bg-red-500";
    }
    return "bg-gray-500";
  };

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
            {fetchingStatuses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="mr-2 text-sm text-muted-foreground">
                  جاري تحميل الحالات...
                </span>
              </div>
            ) : (
              <Select
                value={selectedStatusId?.toString() || ""}
                onValueChange={(value) =>
                  setSelectedStatusId(Number(value))
                }
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(status.name_ar)}`}
                        />
                        <span>{status.name_ar}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
                  className={`w-4 h-4 rounded-full ${getStatusColor(selectedStatusOption.name_ar)}`}
                />
                <Badge variant="outline" className="font-medium">
                  {selectedStatusOption.name_ar}
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
            disabled={loading || !selectedStatusId || fetchingStatuses}
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

