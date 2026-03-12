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
import { CheckCircle, User, ArrowRight, Loader2 } from "lucide-react";
import {
  getCrmStages,
  updateCustomerStage,
} from "@/lib/api/property-requests-dashboard-api";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";

interface Stage {
  id: number;
  stage_name: string;
  color: string | null;
  icon: string | null;
  description: string | null;
  order: number;
}

interface Customer {
  id: number;
  name: string;
  stage_id?: number;
}

interface StageAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onStageUpdated: (customerId: number, newStageId: number) => void;
}

export const PropertyRequestStageAssignmentDialog = ({
  open,
  onOpenChange,
  customer,
  onStageUpdated,
}: StageAssignmentDialogProps) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingStages, setFetchingStages] = useState(false);
  const { userData } = useAuthStore();

  // جلب المراحل من الAPI
  useEffect(() => {
    if (open && userData?.token) {
      fetchStages();
    }
  }, [open, userData?.token]);

  // تعيين المرحلة الافتراضية عند فتح الDialog
  useEffect(() => {
    if (stages.length > 0 && customer) {
      // إذا كان للعميل مرحلة موجودة، استخدمها، وإلا استخدم أول مرحلة
      const defaultStage = customer.stage_id
        ? stages.find((stage) => stage.id === customer.stage_id)?.id ||
          stages[0].id
        : stages[0].id;
      setSelectedStageId(defaultStage);
    }
  }, [stages, customer]);

  const fetchStages = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchStages");
      return;
    }

    setFetchingStages(true);
    try {
      const sortedStages = await getCrmStages();
      setStages(sortedStages as Stage[]);
    } catch (error) {
      console.error("Error fetching stages:", error);
      toast.error("حدث خطأ أثناء تحميل المراحل", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setFetchingStages(false);
    }
  };

  const handleSave = async () => {
    if (!customer || !selectedStageId) return;

    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping handleSave");
      return;
    }

    setLoading(true);
    try {
      await updateCustomerStage(customer.id, {
        stage_id: selectedStageId,
      });

      toast.success("تم تحديث مرحلة العميل بنجاح!", {
        duration: 4000,
        position: "top-center",
      });

      onStageUpdated(customer.id, selectedStageId);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating customer stage:", error);
      toast.error("حدث خطأ أثناء تحديث المرحلة", {
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
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedStage = stages.find((stage) => stage.id === selectedStageId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">تعيين المرحلة</div>
              <div className="text-sm text-muted-foreground font-normal">
                اختر المرحلة المناسبة للعميل
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* معلومات العميل */}
          {customer && (
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-muted-foreground">
                  عميل رقم #{customer.id}
                </div>
              </div>
            </div>
          )}

          {/* اختيار المرحلة */}
          <div className="space-y-3">
            <label className="text-sm font-medium">اختر المرحلة:</label>
            {fetchingStages ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="mr-2 text-sm text-muted-foreground">
                  جاري تحميل المراحل...
                </span>
              </div>
            ) : (
              <Select
                value={selectedStageId?.toString()}
                onValueChange={(value) => setSelectedStageId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر المرحلة" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id.toString()}>
                      <div className="flex items-center gap-2">
                        {stage.color && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                        )}
                        <span>{stage.stage_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* معاينة المرحلة المختارة */}
          {selectedStage && (
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">المرحلة المختارة:</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {selectedStage.color && (
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedStage.color }}
                  />
                )}
                <Badge variant="outline" className="font-medium">
                  {selectedStage.stage_name}
                </Badge>
              </div>
              {selectedStage.description && (
                <p className="text-xs text-muted-foreground">
                  {selectedStage.description}
                </p>
              )}
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
            disabled={loading || !selectedStageId || fetchingStages}
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
