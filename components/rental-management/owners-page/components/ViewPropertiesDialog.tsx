"use client";

import { createPortal } from "react-dom";
import { Loader2, AlertCircle, Building2, ListChecks, X, MapPin } from "lucide-react";
import { Owner, Property } from "../types/owners.types";
import { formatDate } from "../utils/formatters";
import { PAGE_SIZE } from "../constants/owners.constants";

interface PaginationData {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
}

interface ViewPropertiesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  owner: Owner | null;
  properties: Property[];
  loading: boolean;
  error: string | null;
  pagination: PaginationData | null;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onRemoveProperty: (propertyId: number) => void;
}

export function ViewPropertiesDialog({
  isOpen,
  onClose,
  owner,
  properties,
  loading,
  error,
  pagination,
  onPageChange,
  onRetry,
  onRemoveProperty,
}: ViewPropertiesDialogProps) {
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9998,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                <ListChecks className="h-6 w-6" />
                العقارات المرتبطة
              </h2>
              {owner && (
                <p className="text-sm text-gray-500 mt-1">
                  عرض العقارات المرتبطة بـ <strong>{owner.name}</strong>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
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
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد عقارات مرتبطة
              </h3>
              <p className="text-gray-500">
                لم يتم ربط أي عقارات بهذا المالك بعد
              </p>
            </div>
          ) : (
            <>
              {/* Properties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property: any) => (
                  <div
                    key={property.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="p-0">
                      {/* Property Image */}
                      {property.featured_image_url && (
                        <div className="relative h-48 w-full">
                          <img
                            src={property.featured_image_url}
                            alt={
                              property.contents?.[0]?.title || `عقار ${property.id}`
                            }
                            className="w-full h-full object-cover"
                          />
                          {property.featured && (
                            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                              مميز
                            </span>
                          )}
                          {property.property_status && (
                            <span
                              className={`absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded ${
                                property.property_status === "available"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                              }`}
                            >
                              {property.property_status === "available"
                                ? "متاح"
                                : property.property_status}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Property Info */}
                      <div className="p-4 space-y-3">
                        {/* Title */}
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {property.contents?.[0]?.title || `عقار ${property.id}`}
                          </h3>
                          {property.category && (
                            <p className="text-sm text-gray-500">
                              {property.category.name}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        {property.price && (
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-blue-600">
                              {property.price} ريال
                            </span>
                            {property.purpose && (
                              <span className="border border-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                                {property.purpose === "rent" ? "للإيجار" : "للبيع"}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Property Details */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {property.beds && (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{property.beds} غرف</span>
                            </div>
                          )}
                          {property.bath && (
                            <div className="flex items-center gap-1">
                              <span>{property.bath} حمام</span>
                            </div>
                          )}
                          {property.area && (
                            <div className="flex items-center gap-1">
                              <span>{property.area} م²</span>
                            </div>
                          )}
                        </div>

                        {/* Address */}
                        {property.contents?.[0]?.address && (
                          <div className="flex items-start gap-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">
                              {property.contents[0].address}
                            </span>
                          </div>
                        )}

                        {/* Features */}
                        {property.features && (
                          <div className="text-xs text-gray-500 line-clamp-1">
                            المميزات: {property.features}
                          </div>
                        )}

                        {/* Assignment Date */}
                        {property.pivot?.assigned_at && (
                          <div className="text-xs text-gray-400 pt-2 border-t">
                            تم الربط: {formatDate(property.pivot.assigned_at)}
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => onRemoveProperty(property.id)}
                          className="w-full mt-2 px-3 py-2 border border-red-300 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          إلغاء الربط
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="text-sm text-gray-700">
                      عرض {pagination.from} إلى {pagination.to} من أصل{" "}
                      {pagination.total} عقار
                    </div>
                    <div className="flex items-center gap-1">
                      {pagination.current_page > 1 && (
                        <button
                          onClick={() =>
                            onPageChange(pagination.current_page - 1)
                          }
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          السابق
                        </button>
                      )}

                      {Array.from(
                        { length: pagination.last_page },
                        (_, i) => i + 1,
                      )
                        .filter((page) => {
                          const current = pagination.current_page;
                          return (
                            page === 1 ||
                            page === pagination.last_page ||
                            (page >= current - 1 && page <= current + 1)
                          );
                        })
                        .map((page, index, array) => {
                          if (index > 0 && page - array[index - 1] > 1) {
                            return (
                              <span
                                key={`group-${page}`}
                                className="flex items-center gap-1"
                              >
                                <span className="px-2">...</span>
                                <button
                                  onClick={() => onPageChange(page)}
                                  className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                                    page === pagination.current_page
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {page}
                                </button>
                              </span>
                            );
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => onPageChange(page)}
                              className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                                page === pagination.current_page
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}

                      {pagination.current_page < pagination.last_page && (
                        <button
                          onClick={() =>
                            onPageChange(pagination.current_page + 1)
                          }
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          التالي
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
