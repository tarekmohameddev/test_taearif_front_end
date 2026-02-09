"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle, Users, Building2 } from "lucide-react";
import { Owner, Property } from "../types/owners.types";
import { formatDate, getStatusBadge } from "../utils/formatters";

interface OwnerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  owner: Owner | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function OwnerDetailsDialog({
  isOpen,
  onClose,
  owner,
  loading,
  error,
  onRetry,
}: OwnerDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            تفاصيل المالك
          </DialogTitle>
          <DialogDescription>
            معلومات تفصيلية عن المالك والعقارات المرتبطة
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              حدث خطأ
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={onRetry}>إعادة المحاولة</Button>
          </div>
        ) : (
          owner && (
            <div className="space-y-6">
              {/* Owner Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {owner.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {owner.name}
                    </h3>
                    {getStatusBadge(owner.is_active)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">رقم الهوية</p>
                    <p className="font-semibold text-gray-900">
                      {owner.id_number || "غير متوفر"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">رقم المستخدم</p>
                    <p className="font-semibold text-gray-900">
                      {owner.user_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="font-semibold text-gray-900">{owner.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {owner.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">المدينة</p>
                    <p className="font-semibold text-gray-900">
                      {owner.city || "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تاريخ التسجيل</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(owner.created_at)}
                    </p>
                  </div>
                </div>

                {owner.address && (
                  <div>
                    <p className="text-sm text-gray-500">العنوان</p>
                    <p className="font-semibold text-gray-900">
                      {owner.address}
                    </p>
                  </div>
                )}
              </div>

              {/* Properties */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  العقارات ({owner.properties?.length || 0})
                </h4>
                {owner.properties && owner.properties.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {owner.properties.map((property: Property) => (
                      <div
                        key={property.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">
                              عقار #{property.id}
                            </p>
                            {property.beds && property.bath && (
                              <p className="text-sm text-gray-500">
                                {property.beds} غرف • {property.bath} حمام
                              </p>
                            )}
                            {property.area && (
                              <p className="text-xs text-gray-400">
                                المساحة: {property.area}
                              </p>
                            )}
                          </div>
                          {property.price && (
                            <p className="font-bold text-blue-600">
                              {property.price} ريال
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">لا توجد عقارات مرتبطة</p>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
