import { useState, useEffect } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";

interface PropertyRequest {
  id: number;
  full_name: string;
}

interface Employee {
  id: number;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
}

interface PropertyRequestEmployeeAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyRequest: PropertyRequest | null;
  onEmployeeAssigned: (propertyRequestId: number, employeeId: number | null) => void;
}

export const PropertyRequestEmployeeAssignmentDialog = ({
  open,
  onOpenChange,
  propertyRequest,
  onEmployeeAssigned,
}: PropertyRequestEmployeeAssignmentDialogProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null,
  );
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);
  const { userData } = useAuthStore();

  // جلب الموظفين عند فتح dialog
  useEffect(() => {
    if (open && userData?.token) {
      fetchEmployees();
    }
  }, [open, userData?.token]);

  // تعيين الموظف الحالي عند فتح dialog
  useEffect(() => {
    if (propertyRequest && open) {
      // TODO: إذا كان هناك موظف مسؤول حالياً، قم بتعيينه
      // setSelectedEmployeeId(propertyRequest.responsible_employee_id);
    }
  }, [propertyRequest, open]);

  const fetchEmployees = async () => {
    if (!userData?.token) {
      console.log("No token available, skipping fetchEmployees");
      return;
    }

    setLoadingEmployees(true);
    try {
      const response = await axiosInstance.get("/employees");
      if (response.data.status === "success") {
        setEmployees(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("حدث خطأ أثناء تحميل الموظفين", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setLoadingEmployees(false);
    }
  };

  // دالة لحفظ تعيين الموظف
  const handleAssignEmployee = async () => {
    if (!propertyRequest) return;

    if (!userData?.token) {
      toast.error("يجب تسجيل الدخول أولاً", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setSavingEmployee(true);
    try {
      // إرسال طلب التحديث
      // إذا كان selectedEmployeeId هو null أو "none"، نرسل null
      const employeeIdToSend =
        selectedEmployeeId === null || selectedEmployeeId === undefined
          ? null
          : selectedEmployeeId;

      await axiosInstance.put(
        `/v1/property-requests/${propertyRequest.id}/employee`,
        {
          responsible_employee_id: employeeIdToSend,
        },
      );

      toast.success("تم تعيين الموظف المسؤول بنجاح!", {
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

      onEmployeeAssigned(propertyRequest.id, selectedEmployeeId);
      onOpenChange(false);
      setSelectedEmployeeId(null);
    } catch (error: any) {
      console.error("Error assigning employee:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تعيين الموظف المسؤول",
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
      setSavingEmployee(false);
    }
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <CustomDialogContent className="p-3">
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">تعيين الموظف المسؤول</div>
              <div className="text-sm text-muted-foreground font-normal">
                اختر الموظف المسؤول عن هذا طلب العقار
              </div>
            </div>
          </CustomDialogTitle>
          <CustomDialogClose
            onClose={() => {
              onOpenChange(false);
              setSelectedEmployeeId(null);
            }}
          />
        </CustomDialogHeader>

        <div className="space-y-6">
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

          {/* اختيار الموظف */}
          <div className="space-y-3">
            <label className="text-sm font-medium">اختر الموظف:</label>
            {loadingEmployees ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="mr-2 text-sm text-muted-foreground">
                  جاري تحميل الموظفين...
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <Select
                    value={
                      selectedEmployeeId
                        ? selectedEmployeeId.toString()
                        : "none"
                    }
                    onValueChange={(value) =>
                      setSelectedEmployeeId(
                        value === "none" ? null : Number(value),
                      )
                    }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">لا يوجد موظف</SelectItem>
                    {employees.map((employee) => {
                      // استخدام first_name و last_name إذا كانا متوفرين
                      const employeeName =
                        employee.first_name && employee.last_name
                          ? `${employee.first_name} ${employee.last_name}`
                          : employee.name ||
                            employee.email ||
                            `موظف #${employee.id}`;

                      return (
                        <SelectItem
                          key={employee.id}
                          value={employee.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <span>{employeeName}</span>
                            {employee.email && (
                              <span className="text-xs text-muted-foreground">
                                ({employee.email})
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedEmployeeId(null);
            }}
            disabled={savingEmployee}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleAssignEmployee}
            disabled={savingEmployee || loadingEmployees}
            className="min-w-[100px]"
          >
            {savingEmployee ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ"
            )}
          </Button>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
};

