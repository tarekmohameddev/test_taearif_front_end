"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XCircle, Loader2 } from "lucide-react";
import type { Employee } from "../../types";
import { getInitials } from "../../utils";

interface DeleteEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  loading: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteEmployeeDialog({
  open,
  onOpenChange,
  employee,
  loading,
  error,
  onConfirm,
  onCancel,
}: DeleteEmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            حذف الموظف
          </DialogTitle>
          <DialogDescription>
            هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>

        {employee && (
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={employee.photo ?? ""} />
                  <AvatarFallback>
                    {getInitials(employee.first_name, employee.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-red-800">
                    {employee.first_name} {employee.last_name}
                  </h4>
                  <p className="text-sm text-red-600">{employee.email}</p>
                  <p className="text-sm text-red-600">معرف الموظف: {employee.id}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={onCancel}
            variant="outline"
            className="text-gray-600 hover:text-black hover:border-black"
          >
            إلغاء
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 ml-2" />
                حذف الموظف
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
