"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { 
  Shield, Home, Building2, FileCheck, Landmark, 
  AlertTriangle, CheckCircle, Clock, TrendingUp
} from "lucide-react";

export function KSAComplianceKPIs() {
  const { customers } = useUnifiedCustomersStore();

  const ksaMetrics = useMemo(() => {
    const customersWithKSA = customers.filter(c => c.ksaCompliance);
    
    // Brokerage License Metrics
    const brokerageLicenses = customers.filter(c => c.ksaCompliance?.brokerageLicense);
    const activeLicenses = brokerageLicenses.filter(
      c => c.ksaCompliance?.brokerageLicense?.status === 'active'
    ).length;
    const expiredLicenses = brokerageLicenses.filter(
      c => c.ksaCompliance?.brokerageLicense?.status === 'expired'
    ).length;
    
    // Brokerage Contract Metrics
    const allContracts = customers.flatMap(c => c.ksaCompliance?.brokerageContracts || []);
    const activeContracts = allContracts.filter(c => c.status === 'active').length;
    const pendingApprovalContracts = allContracts.filter(c => c.status === 'pending_approval').length;
    
    // EJAR Contract Metrics
    const allEjarContracts = customers.flatMap(c => c.ksaCompliance?.ejarContracts || []);
    const activeEjarContracts = allEjarContracts.filter(c => c.status === 'active').length;
    const expiredEjarContracts = allEjarContracts.filter(c => c.status === 'expired').length;
    const ejarCreatedInPlatform = allEjarContracts.filter(c => c.createdInEjar).length;
    
    // Wafi Project Metrics
    const wafiProjects = customers.filter(c => c.ksaCompliance?.wafiLicense);
    const constructionProjects = wafiProjects.filter(
      c => c.ksaCompliance?.wafiLicense?.status === 'construction'
    ).length;
    const completedProjects = wafiProjects.filter(
      c => c.ksaCompliance?.wafiLicense?.status === 'completed'
    ).length;
    
    // Escrow Milestone Metrics
    const allMilestones = customers.flatMap(c => c.ksaCompliance?.escrowMilestones || []);
    const overdueMilestones = allMilestones.filter(m => m.isOverdue).length;
    const releasedMilestones = allMilestones.filter(m => m.status === 'released').length;
    const pendingReleaseMilestones = allMilestones.filter(
      m => m.status === 'certified' && m.releaseRequested
    ).length;
    const escrowCompletionRate = allMilestones.length > 0
      ? (releasedMilestones / allMilestones.length) * 100
      : 0;
    
    // Handover Defects Metrics
    const allDefects = customers.flatMap(c => c.ksaCompliance?.handoverDefects || []);
    const openDefects = allDefects.filter(d => d.status === 'open').length;
    const criticalDefects = allDefects.filter(d => d.severity === 'critical' && d.status !== 'resolved').length;
    const resolvedDefects = allDefects.filter(d => d.status === 'resolved').length;
    const defectResolutionRate = allDefects.length > 0
      ? (resolvedDefects / allDefects.length) * 100
      : 0;
    
    // Sakani Eligibility Metrics
    const eligibilityChecked = customers.filter(
      c => c.ksaCompliance?.sakaniEligibility && 
      c.ksaCompliance.sakaniEligibility.status !== 'not_checked'
    ).length;
    const eligibleCustomers = customers.filter(
      c => c.ksaCompliance?.sakaniEligibility?.status === 'eligible'
    ).length;
    const eligibilityRate = eligibilityChecked > 0
      ? (eligibleCustomers / eligibilityChecked) * 100
      : 0;
    
    // Mortgage Metrics
    const mortgageApplications = customers.filter(
      c => c.ksaCompliance?.mortgageInfo && 
      c.ksaCompliance.mortgageInfo.status !== 'not_applied'
    );
    const approvedMortgages = mortgageApplications.filter(
      c => c.ksaCompliance?.mortgageInfo?.status === 'approved' ||
      c.ksaCompliance?.mortgageInfo?.status === 'disbursed'
    ).length;
    const preApprovedMortgages = mortgageApplications.filter(
      c => c.ksaCompliance?.mortgageInfo?.status === 'pre_approved'
    ).length;
    const mortgageApprovalRate = mortgageApplications.length > 0
      ? (approvedMortgages / mortgageApplications.length) * 100
      : 0;
    
    // Total approved loan amount
    const totalApprovedLoanAmount = mortgageApplications.reduce((sum, c) => {
      return sum + (c.ksaCompliance?.mortgageInfo?.approvedAmount || 0);
    }, 0);
    
    // Payment Schedule Metrics
    const allPayments = customers.flatMap(c => c.ksaCompliance?.paymentSchedule || []);
    const overduePayments = allPayments.filter(p => p.status === 'overdue').length;
    const paidPayments = allPayments.filter(p => p.status === 'paid').length;
    const paymentCompletionRate = allPayments.length > 0
      ? (paidPayments / allPayments.length) * 100
      : 0;
    
    return {
      // License & Contracts
      activeLicenses,
      expiredLicenses,
      activeContracts,
      pendingApprovalContracts,
      totalContracts: allContracts.length,
      
      // EJAR
      activeEjarContracts,
      expiredEjarContracts,
      ejarCreatedInPlatform,
      totalEjarContracts: allEjarContracts.length,
      
      // Wafi
      wafiProjectsCount: wafiProjects.length,
      constructionProjects,
      completedProjects,
      
      // Escrow
      totalMilestones: allMilestones.length,
      overdueMilestones,
      releasedMilestones,
      pendingReleaseMilestones,
      escrowCompletionRate,
      
      // Defects
      totalDefects: allDefects.length,
      openDefects,
      criticalDefects,
      resolvedDefects,
      defectResolutionRate,
      
      // Sakani
      eligibilityChecked,
      eligibleCustomers,
      eligibilityRate,
      
      // Mortgage
      mortgageApplicationsCount: mortgageApplications.length,
      approvedMortgages,
      preApprovedMortgages,
      mortgageApprovalRate,
      totalApprovedLoanAmount,
      
      // Payments
      totalPayments: allPayments.length,
      overduePayments,
      paidPayments,
      paymentCompletionRate,
    };
  }, [customers]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">مؤشرات الامتثال السعودية (KSA)</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          مقاييس الأداء للامتثال التنظيمي والعمليات الخاصة بالمملكة العربية السعودية
        </p>
      </div>

      {/* Key Compliance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">رخص السمسرة النشطة</span>
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold">{ksaMetrics.activeLicenses}</div>
            {ksaMetrics.expiredLicenses > 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                <AlertTriangle className="h-3 w-3" />
                <span>{ksaMetrics.expiredLicenses} منتهية</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">عقود إيجار نشطة</span>
              <Home className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold">{ksaMetrics.activeEjarContracts}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
              <CheckCircle className="h-3 w-3" />
              <span>{ksaMetrics.ejarCreatedInPlatform} عبر إيجار</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">مشاريع وافي</span>
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold">{ksaMetrics.wafiProjectsCount}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
              <Clock className="h-3 w-3" />
              <span>{ksaMetrics.constructionProjects} قيد الإنشاء</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">عملاء مؤهلون لسكني</span>
              <FileCheck className="h-5 w-5 text-teal-600" />
            </div>
            <div className="text-3xl font-bold">{ksaMetrics.eligibleCustomers}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
              <span>{Math.round(ksaMetrics.eligibilityRate)}% من المحقق</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escrow & Milestones */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">مراحل الضمان (Escrow)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>معدل الإكمال</span>
                <span className="font-bold">{Math.round(ksaMetrics.escrowCompletionRate)}%</span>
              </div>
              <Progress value={ksaMetrics.escrowCompletionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
                <div className="text-xl font-bold text-green-600">
                  {ksaMetrics.releasedMilestones}
                </div>
                <div className="text-xs text-gray-600">مُفرج</div>
              </div>
              <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                <div className="text-xl font-bold text-orange-600">
                  {ksaMetrics.pendingReleaseMilestones}
                </div>
                <div className="text-xs text-gray-600">قيد الإفراج</div>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded">
                <div className="text-xl font-bold text-red-600">
                  {ksaMetrics.overdueMilestones}
                </div>
                <div className="text-xs text-gray-600">متأخر</div>
              </div>
            </div>

            {ksaMetrics.overdueMilestones > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded text-sm text-red-800 dark:text-red-300">
                <AlertTriangle className="h-4 w-4" />
                <span>يوجد {ksaMetrics.overdueMilestones} مراحل متأخرة تحتاج متابعة</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">عيوب التسليم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>معدل الحل</span>
                <span className="font-bold">{Math.round(ksaMetrics.defectResolutionRate)}%</span>
              </div>
              <Progress value={ksaMetrics.defectResolutionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
                <div className="text-xl font-bold text-green-600">
                  {ksaMetrics.resolvedDefects}
                </div>
                <div className="text-xs text-gray-600">محلول</div>
              </div>
              <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                <div className="text-xl font-bold text-orange-600">
                  {ksaMetrics.openDefects}
                </div>
                <div className="text-xs text-gray-600">مفتوح</div>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded">
                <div className="text-xl font-bold text-red-600">
                  {ksaMetrics.criticalDefects}
                </div>
                <div className="text-xs text-gray-600">حرج</div>
              </div>
            </div>

            {ksaMetrics.criticalDefects > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded text-sm text-red-800 dark:text-red-300">
                <AlertTriangle className="h-4 w-4" />
                <span>يوجد {ksaMetrics.criticalDefects} عيوب حرجة تحتاج حل فوري</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mortgage & Payments */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">التمويل العقاري</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">طلبات التمويل</div>
                <div className="text-2xl font-bold">{ksaMetrics.mortgageApplicationsCount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">معدل الموافقة</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(ksaMetrics.mortgageApprovalRate)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded text-center">
                <div className="text-lg font-bold text-green-600">
                  {ksaMetrics.approvedMortgages}
                </div>
                <div className="text-xs text-gray-600">معتمد</div>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-center">
                <div className="text-lg font-bold text-blue-600">
                  {ksaMetrics.preApprovedMortgages}
                </div>
                <div className="text-xs text-gray-600">معتمد مسبقًا</div>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded">
              <div className="text-xs text-gray-600">إجمالي القروض المعتمدة</div>
              <div className="text-xl font-bold text-blue-600">
                {(ksaMetrics.totalApprovedLoanAmount / 1000000).toFixed(1)} مليون ريال
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">جدول المدفوعات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>معدل السداد</span>
                <span className="font-bold">{Math.round(ksaMetrics.paymentCompletionRate)}%</span>
              </div>
              <Progress value={ksaMetrics.paymentCompletionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
                <div className="text-xl font-bold text-green-600">
                  {ksaMetrics.paidPayments}
                </div>
                <div className="text-xs text-gray-600">مدفوع</div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="text-xl font-bold text-gray-600">
                  {ksaMetrics.totalPayments - ksaMetrics.paidPayments - ksaMetrics.overduePayments}
                </div>
                <div className="text-xs text-gray-600">معلق</div>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded">
                <div className="text-xl font-bold text-red-600">
                  {ksaMetrics.overduePayments}
                </div>
                <div className="text-xs text-gray-600">متأخر</div>
              </div>
            </div>

            {ksaMetrics.overduePayments > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded text-sm text-red-800 dark:text-red-300">
                <AlertTriangle className="h-4 w-4" />
                <span>يوجد {ksaMetrics.overduePayments} مدفوعات متأخرة</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contracts Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">نظرة عامة على العقود</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">عقود السمسرة</span>
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{ksaMetrics.totalContracts}</div>
              <div className="flex gap-2 text-xs">
                <Badge className="bg-green-500">{ksaMetrics.activeContracts} نشط</Badge>
                {ksaMetrics.pendingApprovalContracts > 0 && (
                  <Badge variant="secondary">{ksaMetrics.pendingApprovalContracts} قيد الموافقة</Badge>
                )}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">عقود إيجار (EJAR)</span>
                <Home className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{ksaMetrics.totalEjarContracts}</div>
              <div className="flex gap-2 text-xs">
                <Badge className="bg-green-500">{ksaMetrics.activeEjarContracts} نشط</Badge>
                {ksaMetrics.expiredEjarContracts > 0 && (
                  <Badge variant="destructive">{ksaMetrics.expiredEjarContracts} منتهي</Badge>
                )}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">مشاريع وافي</span>
                <Building2 className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{ksaMetrics.wafiProjectsCount}</div>
              <div className="flex gap-2 text-xs">
                <Badge className="bg-blue-500">{ksaMetrics.constructionProjects} إنشاء</Badge>
                {ksaMetrics.completedProjects > 0 && (
                  <Badge className="bg-green-500">{ksaMetrics.completedProjects} مكتمل</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
