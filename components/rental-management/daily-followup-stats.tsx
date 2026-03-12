"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  FileText,
  AlertTriangle,
  Loader2,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import useDailyFollowupStore from "@/context/store/dailyFollowup";

// مكون بطاقة الإحصائية
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  onClick: () => void;
  loading?: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  onClick,
  loading,
}: StatCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : value}
            </p>
          </div>
          <div
            className={`h-12 w-12 ${bgColor} rounded-lg flex items-center justify-center`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// المكون الرئيسي
export function DailyFollowupStats() {
  const userData = useAuthStore(selectUserData);
  const {
    summaryData,
    loading,
    error,
    fetchDailyFollowupData,
    formatCurrency,
  } = useDailyFollowupStore();

  useEffect(() => {
    if (userData?.token) {
      fetchDailyFollowupData();
    }
  }, [userData?.token]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchDailyFollowupData()}>
            <Loader2 className="ml-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات المستحقات المالية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المبلغ المستحق"
          value={formatCurrency(summaryData?.total_amount_due || 0)}
          icon={DollarSign}
          color="text-blue-600"
          bgColor="bg-blue-50"
          onClick={() => {}}
          loading={loading}
        />

        <StatCard
          title="إجمالي المتأخرات"
          value={formatCurrency(summaryData?.total_arrears || 0)}
          icon={AlertTriangle}
          color="text-red-600"
          bgColor="bg-red-50"
          onClick={() => {}}
          loading={loading}
        />

        <StatCard
          title="المتأخرات المستحقة"
          value={formatCurrency(summaryData?.total_overdue_arrears || 0)}
          icon={CreditCard}
          color="text-orange-600"
          bgColor="bg-orange-50"
          onClick={() => {}}
          loading={loading}
        />

        <StatCard
          title="إجمالي السجلات"
          value={summaryData?.total_records || 0}
          icon={FileText}
          color="text-green-600"
          bgColor="bg-green-50"
          onClick={() => {}}
          loading={loading}
        />
      </div>
    </div>
  );
}
