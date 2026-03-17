"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building, Plus, ChevronDown, ChevronUp, MapPin, DollarSign, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import {
  attachPropertiesToRequest,
  detachPropertyFromRequest,
} from "@/lib/api/propertyRequests";
import {
  CustomDropdown,
  DropdownItem,
} from "@/components/customComponents/customDropdown";

interface PropertyOption {
  id: number;
  title: string;
  address?: string;
  price?: number;
  transaction_type?: string;
  // قد تحتوي الـ API على حقل للصورة باسم مختلف
  imageUrl?: string;
  image?: string;
  thumbnailUrl?: string;
  main_image_url?: string;
  featured_image?: string;
}

interface RequestPropertiesCardProps {
  propertyRequestId: number;
  propertyIds: number[];
  onRefetch?: () => Promise<void>;
}

export function RequestPropertiesCard({
  propertyRequestId,
  propertyIds,
  onRefetch,
}: RequestPropertiesCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [availableProperties, setAvailableProperties] = useState<PropertyOption[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detachingId, setDetachingId] = useState<number | null>(null);

  const linkedIds = propertyIds ?? [];

  useEffect(() => {
    if (isAddFormOpen && availableProperties.length === 0) {
      fetchAvailableProperties();
    }
  }, [isAddFormOpen]);

  useEffect(() => {
    if (!isAddFormOpen) {
      setSelectedPropertyId("");
    }
  }, [isAddFormOpen]);

  const fetchAvailableProperties = async () => {
    setIsLoadingProperties(true);
    try {
      const response = await axiosInstance.get("/properties");
      if (response.data.status === "success") {
        setAvailableProperties(response.data.data.properties || []);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      toast.error("فشل في تحميل العقارات");
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const handleToggleAddForm = () => {
    setIsAddFormOpen(!isAddFormOpen);
    if (!isAddFormOpen && availableProperties.length === 0) {
      fetchAvailableProperties();
    }
  };

  const handleSubmitProperty = async () => {
    if (!selectedPropertyId) {
      toast.error("الرجاء اختيار عقار");
      return;
    }

    setIsSubmitting(true);
    try {
      await attachPropertiesToRequest(propertyRequestId, [parseInt(selectedPropertyId, 10)]);
      toast.success("تم ربط العقار بالطلب بنجاح");
      setIsAddFormOpen(false);
      setSelectedPropertyId("");
      if (onRefetch) await onRefetch();
    } catch (error: any) {
      console.error("Error attaching property:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.errors?.propertyIds?.[0] ||
        error.message ||
        "حدث خطأ أثناء ربط العقار";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetach = async (propertyId: number) => {
    setDetachingId(propertyId);
    try {
      await detachPropertyFromRequest(propertyRequestId, propertyId);
      toast.success("تم إزالة العقار من الطلب");
      if (onRefetch) await onRefetch();
    } catch (error: any) {
      console.error("Error detaching property:", error);
      toast.error(
        error.response?.data?.message || error.message || "حدث خطأ أثناء إزالة العقار"
      );
    } finally {
      setDetachingId(null);
    }
  };

  const propertyMap = availableProperties.length
    ? Object.fromEntries(availableProperties.map((p) => [p.id, p]))
    : {};
  const needFetchForList = linkedIds.length > 0 && availableProperties.length === 0;

  useEffect(() => {
    if (needFetchForList && isOpen) {
      fetchAvailableProperties();
    }
  }, [needFetchForList, isOpen]);

  const linkedProperties = linkedIds.map((id) => {
    const prop = propertyMap[id] as PropertyOption | undefined;
    const anyProp = prop as any;
    const imageUrl =
      anyProp?.imageUrl ??
      anyProp?.featured_image ??
      anyProp?.main_image_url ??
      anyProp?.thumbnailUrl ??
      anyProp?.thumbnail ??
      anyProp?.image;

    return {
      id,
      title: prop?.title ?? `عقار #${id}`,
      address: prop?.address,
      price: prop?.price,
      imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
    };
  });

  const availableToAdd = availableProperties.filter(
    (p) => !linkedIds.includes(p.id)
  );

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-add-button]")) return;
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">عقارات الطلب</CardTitle>
            <button
              data-add-button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleAddForm();
              }}
              className={`p-1.5 rounded-full transition-colors ${
                isAddFormOpen
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-600"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              <Plus
                className={`h-4 w-4 transition-transform ${isAddFormOpen ? "rotate-45" : ""}`}
              />
            </button>
            {linkedIds.length > 0 && (
              <Badge variant="default">{linkedIds.length}</Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0 space-y-4">
          {isAddFormOpen && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">اختر العقار</Label>
                {isLoadingProperties ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    <span className="mr-2 text-sm text-gray-500">
                      جاري تحميل العقارات...
                    </span>
                  </div>
                ) : availableToAdd.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 border border-gray-200 rounded-md">
                    {availableProperties.length === 0
                      ? "لا توجد عقارات متاحة"
                      : "جميع العقارات مضافة بالفعل للطلب"}
                  </div>
                ) : (
                  <CustomDropdown
                    trigger={
                      <span className="text-sm">
                        {selectedPropertyId
                          ? availableToAdd.find(
                              (p) => p.id.toString() === selectedPropertyId
                            )?.title || "اختر العقار"
                          : "اختر العقار"}
                      </span>
                    }
                    triggerClassName="w-full justify-between"
                    dropdownWidth="w-[20rem]"
                    maxHeight="280px"
                  >
                    {availableToAdd.map((property) => (
                      <DropdownItem
                        key={property.id}
                        onClick={() =>
                          setSelectedPropertyId(property.id.toString())
                        }
                        className={
                          selectedPropertyId === property.id.toString()
                            ? "bg-gray-100 font-medium"
                            : ""
                        }
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{property.title}</span>
                          {property.address && (
                            <span className="text-xs text-gray-500">
                              {property.address}
                            </span>
                          )}
                          {property.price != null && (
                            <span className="text-xs text-green-600">
                              {property.price.toLocaleString("ar-SA")} ريال
                            </span>
                          )}
                        </div>
                      </DropdownItem>
                    ))}
                  </CustomDropdown>
                )}
                {selectedPropertyId && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                    <span className="text-gray-600">العقار المختار: </span>
                    <span className="font-medium">
                      {
                        availableToAdd.find(
                          (p) => p.id.toString() === selectedPropertyId
                        )?.title
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setIsAddFormOpen(false);
                    setSelectedPropertyId("");
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8"
                  onClick={handleSubmitProperty}
                  disabled={
                    !selectedPropertyId ||
                    isSubmitting ||
                    isLoadingProperties
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    "إضافة"
                  )}
                </Button>
              </div>
            </div>
          )}

          {linkedIds.length === 0 && !isAddFormOpen ? (
            <div className="p-6 text-center text-gray-500 text-sm border border-dashed rounded-lg">
              لم يتم ربط أي عقارات بهذا الطلب. استخدم زر (+) لإضافة عقار.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {linkedProperties.map((prop) => (
                <Card
                  key={prop.id}
                  className="overflow-hidden hover:shadow-md transition-shadow w-full"
                >
                  <CardContent className="p-3">
                    <div className="flex flex-row items-stretch gap-3">
                    {prop.imageUrl && (
                        <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={prop.imageUrl}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-between text-right">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {prop.title}
                            </h4>
                            {prop.address && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3" />
                                {prop.address}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDetach(prop.id)}
                            disabled={detachingId === prop.id}
                            title="إزالة من الطلب"
                          >
                            {detachingId === prop.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {prop.price != null && (
                          <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                            <DollarSign className="h-3.5 w-3.5" />
                            {(prop.price / 1000).toFixed(0)}k ريال
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 h-8 text-xs"
                          asChild
                        >
                          <Link href={`/dashboard/properties/${prop.id}`}>
                            <Eye className="h-3 w-3 ml-1" />
                            عرض التفاصيل
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
