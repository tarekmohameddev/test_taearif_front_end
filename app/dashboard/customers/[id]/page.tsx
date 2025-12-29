"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Mail,
  Phone,
  Tag,
  MessageSquare,
  X,
  User,
  ArrowRight,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params?.id as string;

  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // دالة لجلب تفاصيل العميل مع الاستفسارات
  const fetchCustomerDetails = async (customerId: string) => {
    setLoadingDetails(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `/customers/${customerId}/with-inquiries`,
      );
      if (response.data.status === "success") {
        setCustomerDetails(response.data.data);
      } else {
        setError("فشل تحميل بيانات العميل");
      }
    } catch (error: any) {
      console.error("Error fetching customer details:", error);
      setError(
        error.response?.data?.message || "حدث خطأ أثناء تحميل بيانات العميل",
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails(customerId);
    }
  }, [customerId]);

  return (
    <div className="flex h-screen overflow-hidden">
      <EnhancedSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6 max-w-6xl" dir="rtl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="h-10 w-10"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  تفاصيل العميل
                </h1>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/customers")}
              >
                <X className="ml-2 h-4 w-4" />
                إغلاق
              </Button>
            </div>

            {/* Content */}
            {loadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <p className="text-red-500 dark:text-red-400 mb-4">
                      {error}
                    </p>
                    <Button onClick={() => fetchCustomerDetails(customerId)}>
                      إعادة المحاولة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : customerDetails ? (
              <div className="space-y-6">
                {/* Customer Info Section */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Activity className="ml-2 h-5 w-5 text-blue-600" />
                      معلومات العميل
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      {customerDetails.customer?.name && (
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              الاسم
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {customerDetails.customer.name}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      {customerDetails.customer?.email && (
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Mail className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              البريد الإلكتروني
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {customerDetails.customer.email}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Phone */}
                      {customerDetails.customer?.phone_number && (
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Phone className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              رقم الهاتف
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {customerDetails.customer.phone_number}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* District */}
                      {customerDetails.customer?.district?.name_ar && (
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <Tag className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              الحي
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {customerDetails.customer.district.name_ar}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* City */}
                      {customerDetails.customer?.district?.city_name_ar && (
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                            <Tag className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              المدينة
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {customerDetails.customer.district.city_name_ar}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Type */}
                      {customerDetails.customer?.type && (
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <Tag className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              النوع
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {customerDetails.customer.type?.name ||
                                customerDetails.customer.type}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Stage */}
                      {customerDetails.customer?.stage && (
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <div className="flex-shrink-0 w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                            <Tag className="h-4 w-4 text-pink-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              المرحلة
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {customerDetails.customer.stage?.name ||
                                customerDetails.customer.stage}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Priority */}
                      {customerDetails.customer?.priority && (
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <Tag className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              الأولوية
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {customerDetails.customer.priority?.name ||
                                customerDetails.customer.priority}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Responsible Employee Section */}
                {customerDetails.customer?.responsible_employee && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <User className="ml-2 h-5 w-5 text-blue-600" />
                        الموظف المسؤول
                      </h3>
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={
                              customerDetails.customer.responsible_employee
                                .photo || "/placeholder.svg"
                            }
                          />
                          <AvatarFallback>
                            {customerDetails.customer.responsible_employee.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {
                              customerDetails.customer.responsible_employee
                                .name
                            }
                          </h4>
                          <div className="space-y-2">
                            {customerDetails.customer.responsible_employee
                              .email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {
                                    customerDetails.customer
                                      .responsible_employee.email
                                  }
                                </span>
                              </div>
                            )}
                            {customerDetails.customer.responsible_employee
                              .whatsapp_number && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-green-600" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {
                                    customerDetails.customer
                                      .responsible_employee.whatsapp_number
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Inquiries Section */}
                {customerDetails.inquiries &&
                  customerDetails.inquiries.length > 0 && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <MessageSquare className="ml-2 h-5 w-5 text-indigo-600" />
                          الاستفسارات ({customerDetails.inquiries.length})
                        </h3>
                        <div className="space-y-4">
                          {customerDetails.inquiries.map(
                            (inquiry: any, index: number) => (
                              <div
                                key={inquiry.id || index}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="space-y-3">
                                  {/* Message */}
                                  {inquiry.message && (
                                    <div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                        الرسالة
                                      </p>
                                      <p className="text-base text-gray-900 dark:text-white">
                                        {inquiry.message}
                                      </p>
                                    </div>
                                  )}

                                  {/* Inquiry Details in Grid */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    {/* Inquiry Type */}
                                    {inquiry.inquiry_type && (
                                      <div className="flex items-center">
                                        <Badge
                                          variant="outline"
                                          className="border-blue-500 text-blue-700"
                                        >
                                          {inquiry.inquiry_type}
                                        </Badge>
                                      </div>
                                    )}

                                    {/* Property Type */}
                                    {inquiry.property_type && (
                                      <div className="flex items-center">
                                        <Badge
                                          variant="outline"
                                          className="border-green-500 text-green-700"
                                        >
                                          {inquiry.property_type}
                                        </Badge>
                                      </div>
                                    )}

                                    {/* Budget */}
                                    {inquiry.budget && (
                                      <div className="text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                          الميزانية:{" "}
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                          {inquiry.budget}{" "}
                                          {inquiry.currency || ""}
                                        </span>
                                      </div>
                                    )}

                                    {/* Location */}
                                    {inquiry.location && (
                                      <div className="text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                          الموقع:{" "}
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                          {inquiry.location}
                                        </span>
                                      </div>
                                    )}

                                    {/* City */}
                                    {inquiry.city && (
                                      <div className="text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                          المدينة:{" "}
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                          {inquiry.city}
                                        </span>
                                      </div>
                                    )}

                                    {/* District */}
                                    {inquiry.district && (
                                      <div className="text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                          الحي:{" "}
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                          {inquiry.district}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      لا توجد بيانات متاحة
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

