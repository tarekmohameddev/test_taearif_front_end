"use client";

import { Button } from "@/components/ui/button";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import {
  CustomDropdown,
  DropdownItem,
} from "@/components/customComponents/customDropdown";
import { User, UserPlus, Loader2, Phone } from "lucide-react";
import type { CustomerAction } from "@/types/unified-customer";
import type { EmployeeOption } from "../types/incomingCardTypes";

function formatEmployeeLabel(emp: EmployeeOption | undefined): string {
  if (!emp) return "اختر الموظف";
  const name =
    emp.first_name && emp.last_name
      ? `${emp.first_name} ${emp.last_name}`
      : emp.name ?? emp.email ?? `موظف #${emp.id}`;
  const phone = emp.phone
    ? emp.phone.replace(/^\+20/, "0").replace(/^\+966/, "0").replace(/^\+/, "")
    : null;
  return phone ? `${name} (${phone})` : name;
}

function getRequestSubtitle(action: CustomerAction): string {
  if (action.objectType === "property_request" && action.sourceId) {
    return `طلب عقار رقم #${action.sourceId}`;
  }
  if (action.objectType === "inquiry" && action.sourceId) {
    return `استفسار رقم #${action.sourceId}`;
  }
  return action.title ?? "";
}

interface AssignEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: CustomerAction;
  employees: EmployeeOption[];
  loadingEmployees: boolean;
  selectedEmployeeId: number | null;
  onSelectedEmployeeChange: (id: number | null) => void;
  onSubmit: () => Promise<void>;
  saving: boolean;
}

export function AssignEmployeeDialog({
  open,
  onOpenChange,
  action,
  employees,
  loadingEmployees,
  selectedEmployeeId,
  onSelectedEmployeeChange,
  onSubmit,
  saving,
}: AssignEmployeeDialogProps) {
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <CustomDialogContent className="p-3">
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">تعيين الموظف المسؤول</div>
              <div className="text-sm text-muted-foreground font-normal">
                اختر الموظف المسؤول عن الطلب
              </div>
            </div>
          </CustomDialogTitle>
          <CustomDialogClose
            onClose={() => {
              onOpenChange(false);
              onSelectedEmployeeChange(null);
            }}
          />
        </CustomDialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-medium">{action.customerName}</span>
                {action.customerPhone && (
                  <a
                    href={`tel:${action.customerPhone}`}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary dir-ltr"
                    dir="ltr"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {action.customerPhone}
                  </a>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {getRequestSubtitle(action)}
              </div>
            </div>
          </div>

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
                <CustomDropdown
                  trigger={
                    <span className="flex items-center gap-2">
                      {formatEmployeeLabel(selectedEmployee)}
                    </span>
                  }
                  triggerClassName="w-full justify-between"
                >
                  <DropdownItem onClick={() => onSelectedEmployeeChange(null)}>
                    لا يوجد موظف
                  </DropdownItem>
                  {employees.map((employee) => (
                    <DropdownItem
                      key={employee.id}
                      onClick={() => onSelectedEmployeeChange(employee.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{formatEmployeeLabel(employee)}</span>
                      </div>
                    </DropdownItem>
                  ))}
                </CustomDropdown>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onSelectedEmployeeChange(null);
            }}
            disabled={saving}
          >
            إلغاء
          </Button>
          <Button
            onClick={onSubmit}
            disabled={saving || loadingEmployees}
            className="min-w-[100px]"
          >
            {saving ? (
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
}
