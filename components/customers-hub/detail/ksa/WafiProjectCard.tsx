"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UnifiedCustomer } from "@/types/unified-customer";
import { Building2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface WafiProjectCardProps {
  customer: UnifiedCustomer;
}

export function WafiProjectCard({ customer }: WafiProjectCardProps) {
  const wafiLicense = customer.ksaCompliance?.wafiLicense;
  const escrowMilestones = customer.ksaCompliance?.escrowMilestones || [];
  const handoverDefects = customer.ksaCompliance?.handoverDefects || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">مكتمل</Badge>;
      case 'construction':
        return <Badge className="bg-blue-500">قيد الإنشاء</Badge>;
      case 'licensed':
        return <Badge className="bg-purple-500">مرخص</Badge>;
      case 'planning':
        return <Badge variant="secondary">تخطيط</Badge>;
      case 'handed_over':
        return <Badge className="bg-green-600">تم التسليم</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMilestoneStatusBadge = (status: string) => {
    switch (status) {
      case 'released':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 ml-1" />مُفرج</Badge>;
      case 'certified':
        return <Badge className="bg-blue-500">معتمد</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 ml-1" />جاري</Badge>;
      case 'overdue':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 ml-1" />متأخر</Badge>;
      case 'pending':
        return <Badge variant="outline">معلق</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!wafiLicense) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            مشروع وافي (Off-Plan)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            لا توجد معلومات مشروع وافي
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedMilestones = escrowMilestones.filter(m => m.status === 'released').length;
  const totalMilestones = escrowMilestones.length;
  const progressPercentage = totalMilestones > 0 
    ? (completedMilestones / totalMilestones) * 100 
    : 0;

  return (
    <div className="space-y-4">
      {/* Wafi License Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              معلومات المشروع (وافي)
            </CardTitle>
            {getStatusBadge(wafiLicense.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">رقم الترخيص</label>
              <p className="font-medium">{wafiLicense.licenseNumber || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">اسم المشروع</label>
              <p className="font-medium">{wafiLicense.projectName || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">المطور</label>
              <p className="font-medium">{wafiLicense.developerName || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">إجمالي الوحدات</label>
              <p className="font-medium">{wafiLicense.totalUnits || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">الوحدات المباعة</label>
              <p className="font-medium text-green-600">{wafiLicense.soldUnits || 0}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">الوحدات المحجوزة</label>
              <p className="font-medium text-blue-600">{wafiLicense.reservedUnits || 0}</p>
            </div>
          </div>

          {wafiLicense.issuedDate && (
            <div>
              <label className="text-sm text-gray-500">تاريخ الترخيص</label>
              <p className="font-medium">
                {new Date(wafiLicense.issuedDate).toLocaleDateString('ar-SA')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Escrow Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>مراحل الضمان (Escrow)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {escrowMilestones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد مراحل ضمان محددة
            </div>
          ) : (
            <>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>التقدم الإجمالي</span>
                  <span className="font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {completedMilestones} من {totalMilestones} مراحل مكتملة
                </p>
              </div>

              <div className="space-y-3">
                {escrowMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            المرحلة {milestone.milestoneNumber}
                          </span>
                          {getMilestoneStatusBadge(milestone.status)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{milestone.title}</p>
                      </div>
                      <Badge variant="outline">{milestone.percentage}%</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                      <div>
                        <span className="text-gray-500">التاريخ المستهدف: </span>
                        <span className="font-medium">
                          {new Date(milestone.targetDate).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      {milestone.completionDate && (
                        <div>
                          <span className="text-gray-500">تاريخ الإكمال: </span>
                          <span className="font-medium">
                            {new Date(milestone.completionDate).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      )}
                      {milestone.amount && (
                        <div>
                          <span className="text-gray-500">المبلغ: </span>
                          <span className="font-medium">
                            {milestone.amount.toLocaleString()} ريال
                          </span>
                        </div>
                      )}
                      {milestone.certifiedBy && (
                        <div>
                          <span className="text-gray-500">معتمد من: </span>
                          <span className="font-medium text-xs">{milestone.certifiedBy}</span>
                        </div>
                      )}
                    </div>

                    {milestone.isOverdue && (
                      <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        هذه المرحلة متأخرة
                      </div>
                    )}

                    {milestone.status === 'in_progress' && (
                      <Button variant="outline" size="sm" className="mt-3">
                        طلب إفراج الضمان
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Handover Defects */}
      {handoverDefects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>عيوب التسليم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {handoverDefects.map((defect) => (
                <div
                  key={defect.id}
                  className={`p-3 border rounded-lg ${
                    defect.severity === 'critical' ? 'border-red-300 bg-red-50 dark:bg-red-950/20' :
                    defect.severity === 'major' ? 'border-orange-300 bg-orange-50 dark:bg-orange-950/20' :
                    'border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            defect.severity === 'critical' ? 'destructive' :
                            defect.severity === 'major' ? 'default' : 'secondary'
                          }
                        >
                          {defect.severity === 'critical' ? 'حرج' :
                           defect.severity === 'major' ? 'رئيسي' : 'ثانوي'}
                        </Badge>
                        <Badge variant="outline">
                          {defect.category === 'structural' ? 'إنشائي' :
                           defect.category === 'electrical' ? 'كهربائي' :
                           defect.category === 'plumbing' ? 'سباكة' :
                           defect.category === 'finishing' ? 'تشطيبات' :
                           defect.category === 'hvac' ? 'تكييف' : 'أخرى'}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2">{defect.description}</p>
                    </div>
                    <Badge
                      variant={
                        defect.status === 'resolved' ? 'default' :
                        defect.status === 'in_progress' ? 'secondary' : 'outline'
                      }
                    >
                      {defect.status === 'resolved' ? 'محلول' :
                       defect.status === 'in_progress' ? 'جاري الحل' :
                       defect.status === 'deferred' ? 'مؤجل' : 'مفتوح'}
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    تم الإبلاغ في: {new Date(defect.reportedAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
