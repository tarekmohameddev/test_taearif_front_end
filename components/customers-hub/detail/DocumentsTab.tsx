"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UnifiedCustomer, Document } from "@/types/unified-customer";
import { 
  FileText, Download, Eye, Trash2, Plus, Upload, 
  File, Image, CheckCircle, Clock, AlertCircle,
  Shield, Calendar, User
} from "lucide-react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";

interface DocumentsTabProps {
  customer: UnifiedCustomer;
}

export function DocumentsTab({ customer }: DocumentsTabProps) {
  const { updateCustomer } = useUnifiedCustomersStore();
  const [uploading, setUploading] = useState(false);

  const getDocumentTypeIcon = (type: string) => {
    const icons = {
      id_copy: <Shield className="h-4 w-4 text-blue-600" />,
      contract: <FileText className="h-4 w-4 text-purple-600" />,
      agreement: <FileText className="h-4 w-4 text-indigo-600" />,
      receipt: <FileText className="h-4 w-4 text-green-600" />,
      photo: <Image className="h-4 w-4 text-pink-600" />,
      other: <File className="h-4 w-4 text-gray-600" />,
    };
    return icons[type as keyof typeof icons] || icons.other;
  };

  const getDocumentTypeName = (type: string) => {
    const names: Record<string, string> = {
      id_copy: "نسخة الهوية",
      contract: "عقد",
      agreement: "اتفاقية",
      receipt: "إيصال",
      photo: "صورة",
      other: "أخرى",
    };
    return names[type] || type;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "غير معروف";
    if (bytes < 1024) return `${bytes} بايت`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} كيلوبايت`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ميجابايت`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const documentsByType = customer.documents.reduce((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const getVerificationStatus = (type: string) => {
    // This would be based on actual verification logic
    const hasDocument = documentsByType[type]?.length > 0;
    return hasDocument ? "verified" : "pending";
  };

  const requiredDocuments = [
    { type: "id_copy", name: "نسخة الهوية", required: true },
    { type: "contract", name: "العقد", required: false },
    { type: "agreement", name: "الاتفاقية", required: false },
    { type: "receipt", name: "الإيصال", required: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">المستندات</h3>
          <p className="text-sm text-gray-500">
            {customer.documents.length} مستند مرفوع
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          رفع مستند
        </Button>
      </div>

      {/* Document Requirements Checklist */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            التحقق من المستندات
          </h4>
          <div className="space-y-2">
            {requiredDocuments.map((doc) => {
              const status = getVerificationStatus(doc.type);
              const hasDoc = documentsByType[doc.type]?.length > 0;
              
              return (
                <div 
                  key={doc.type}
                  className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded"
                >
                  <div className="flex items-center gap-3">
                    {getDocumentTypeIcon(doc.type)}
                    <div>
                      <div className="font-medium text-sm">{doc.name}</div>
                      {doc.required && (
                        <span className="text-xs text-red-600">* مطلوب</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasDoc ? (
                      <>
                        <Badge variant="default" className="gap-1 bg-green-600">
                          <CheckCircle className="h-3 w-3" />
                          تم الرفع
                        </Badge>
                        {status === "verified" && (
                          <Badge variant="secondary" className="gap-1">
                            <Shield className="h-3 w-3" />
                            موثق
                          </Badge>
                        )}
                      </>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        في الانتظار
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Documents by Type */}
      {Object.entries(documentsByType).map(([type, docs]) => (
        <div key={type} className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
            {getDocumentTypeIcon(type)}
            {getDocumentTypeName(type)} ({docs.length})
          </h4>
          
          <div className="grid gap-3 md:grid-cols-2">
            {docs.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        {getDocumentTypeIcon(doc.type)}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm truncate">
                            {doc.name}
                          </h5>
                          {doc.fileSize && (
                            <p className="text-xs text-gray-500">
                              {formatFileSize(doc.fileSize)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getDocumentTypeName(doc.type)}
                      </Badge>
                    </div>

                    {/* Description */}
                    {doc.description && (
                      <p className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        {doc.description}
                      </p>
                    )}

                    {/* Tags */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>رفع بواسطة: {doc.uploadedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(doc.uploadedAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(doc.fileUrl, "_blank")}
                      >
                        <Eye className="h-3 w-3 ml-1" />
                        عرض
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = doc.fileUrl;
                          link.download = doc.name;
                          link.click();
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {customer.documents.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            لا توجد مستندات
          </h3>
          <p className="text-gray-500 mb-4">
            ابدأ برفع المستندات المطلوبة للعميل
          </p>
          <Button>
            <Upload className="h-4 w-4 ml-2" />
            رفع مستند
          </Button>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-yellow-50 dark:bg-yellow-950">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            إجراءات سريعة
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Plus className="h-3 w-3 ml-1" />
              طلب نسخة الهوية
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Plus className="h-3 w-3 ml-1" />
              إرسال العقد
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Plus className="h-3 w-3 ml-1" />
              طلب توقيع إلكتروني
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Download className="h-3 w-3 ml-1" />
              تحميل الكل
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
