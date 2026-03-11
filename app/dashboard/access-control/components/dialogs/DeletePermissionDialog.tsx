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
import { Lock, XCircle } from "lucide-react";
import type { Permission } from "../../types";

interface DeletePermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: Permission | null;
  loading: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeletePermissionDialog({
  open,
  onOpenChange,
  permission,
  loading,
  error,
  onConfirm,
  onCancel,
}: DeletePermissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            حذف الصلاحية
          </DialogTitle>
          <DialogDescription>
            هل أنت متأكد من حذف هذه الصلاحية؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>

        {permission && (
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Lock className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-red-800">{permission.name}</h4>
                  <p className="text-sm text-red-600">
                    معرف الصلاحية: {permission.id}
                  </p>
                  {permission.description && (
                    <p className="text-sm text-red-600 mt-1">
                      {permission.description}
                    </p>
                  )}
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
              <>جاري الحذف...</>
            ) : (
              <>
                <XCircle className="h-4 w-4 ml-2" />
                حذف الصلاحية
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
