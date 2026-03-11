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
import { Shield, Key, Lock, BarChart3, Loader2, XCircle } from "lucide-react";
import type { RoleDetailsData } from "../../types";
import { formatDate } from "../../utils";

interface RoleDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  details: RoleDetailsData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onClose: () => void;
  translatePermission: (name: string) => string;
}

export function RoleDetailsDialog({
  open,
  onOpenChange,
  details,
  loading,
  error,
  onRetry,
  onClose,
  translatePermission,
}: RoleDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black">
            <Shield className="h-5 w-5" />
            تفاصيل الدور
          </DialogTitle>
          <DialogDescription>عرض تفاصيل الدور وصلاحياته</DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="text-gray-600 font-medium">
                جاري تحميل تفاصيل الدور...
              </span>
              <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={onRetry} variant="outline">
              إعادة المحاولة
            </Button>
          </div>
        )}

        {details && !loading && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-black rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black capitalize">
                    {details.name}
                  </h3>
                  <p className="text-gray-600">معرف الدور: {details.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">معرف الفريق:</span>
                    <span className="font-medium">{details.team_id}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">اسم الحارس:</span>
                    <span className="font-medium">{details.guard_name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">تاريخ الإنشاء:</span>
                    <span className="font-medium">
                      {formatDate(details.created_at)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-gray-600">آخر تحديث:</span>
                    <span className="font-medium">
                      {formatDate(details.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-gray-600" />
                <h4 className="text-lg font-semibold text-black">
                  الصلاحيات ({details.permissions_list?.length ?? 0})
                </h4>
              </div>
              {details.permissions_list && details.permissions_list.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {details.permissions_list.map((permission: string, index: number) => (
                    <div
                      key={index}
                      className="group border border-gray-200 rounded-lg p-4 hover:border-black hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-colors flex-shrink-0">
                          <Lock className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 group-hover:text-black transition-colors truncate">
                            {translatePermission(permission)}
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد صلاحيات لهذا الدور</p>
                </div>
              )}
            </div>

            {details.permissions && details.permissions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <h4 className="text-lg font-semibold text-black">
                    تفاصيل الصلاحيات
                  </h4>
                </div>
                <div className="space-y-3">
                  {details.permissions.map((permission: { id: number; name: string; pivot: { role_id: number; permission_id: number } }, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-black transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                            <Lock className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-medium text-gray-900 truncate">
                              {translatePermission(permission.name)}
                            </h5>
                            <p className="text-sm text-gray-600">
                              معرف الصلاحية: {permission.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right lg:text-left">
                          <p className="text-sm text-gray-600">
                            معرف الدور: {permission.pivot.role_id}
                          </p>
                          <p className="text-sm text-gray-600">
                            معرف الصلاحية: {permission.pivot.permission_id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!details && !loading && !error && (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد بيانات للعرض</p>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="text-gray-600 hover:text-black hover:border-black"
          >
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
