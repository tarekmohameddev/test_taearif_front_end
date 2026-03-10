"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, TrendingUp, BarChart3, AlertCircle } from "lucide-react";

interface EmployeesData {
  max_employees?: number;
  quota?: number;
  total_count?: number;
  usage?: number;
  active_count?: number;
  is_over_limit?: boolean;
}

interface AccessControlStatsCardsProps {
  employeesData: EmployeesData | null | undefined;
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div
            className={`h-12 w-12 rounded-lg flex items-center justify-center ${iconBg}`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AccessControlStatsCards({
  employeesData,
}: AccessControlStatsCardsProps) {
  if (!employeesData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const max = employeesData.max_employees ?? employeesData.quota ?? 0;
  const usage =
    employeesData.usage ?? employeesData.total_count ?? 0;
  const usagePercent = max ? Math.round((usage / max) * 100) : 0;
  const isOverLimit = employeesData.is_over_limit ?? false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="الحد من الاستخدام"
        value={<span className="text-blue-600">{max}</span>}
        icon={TrendingUp}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        label="عدد الموظفين"
        value={employeesData.total_count ?? usage ?? 0}
        icon={Users}
        iconBg="bg-gray-100"
        iconColor="text-gray-900"
      />
      <StatCard
        label="الموظفين النشطين"
        value={<span className="text-green-600">{employeesData.active_count ?? 0}</span>}
        icon={UserCheck}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />
      <Card
        className={`hover:shadow-lg transition-all duration-300 ${
          isOverLimit ? "border-red-300" : ""
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                حالة الاستخدام
              </p>
              {isOverLimit ? (
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-red-600">{usagePercent}%</p>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-700">{usagePercent}%</p>
              )}
              {isOverLimit && (
                <p className="text-xs text-red-600 mt-1">تجاوز الحد المسموح</p>
              )}
              {!isOverLimit && max && usage / max >= 1 && (
                <p className="text-xs text-orange-600 mt-1">الحد الأقصى</p>
              )}
            </div>
            <div
              className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                isOverLimit ? "bg-red-100" : "bg-gray-100"
              }`}
            >
              {isOverLimit ? (
                <AlertCircle className="h-6 w-6 text-red-600" />
              ) : (
                <BarChart3 className="h-6 w-6 text-gray-700" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
