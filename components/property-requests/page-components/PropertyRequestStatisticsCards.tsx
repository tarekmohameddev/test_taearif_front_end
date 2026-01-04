import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Clock,
  Search,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface PropertyRequestStatisticsCardsProps {
  statistics: {
    total_requests: number;
    by_status: { [key: string]: number };
  } | null;
  loading?: boolean;
}

export const PropertyRequestStatisticsCards = ({
  statistics,
  loading = false,
}: PropertyRequestStatisticsCardsProps) => {
  // استخدام البيانات من API مباشرة
  const totalRequests = statistics?.total_requests || 0;
  const byStatus = statistics?.by_status || {};

  // الحصول على جميع الحالات من by_status
  const statusEntries = Object.entries(byStatus);

  // تعريف البطاقات - إجمالي الطلبات أولاً
  const statsCards = [
    {
      title: "إجمالي الطلبات",
      value: totalRequests,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    // إضافة بطاقات للحالات الديناميكية
    ...statusEntries.map(([statusName, count], index) => {
      // تحديد الألوان والأيقونات حسب اسم الحالة
      let icon = Clock;
      let color = "text-gray-600";
      let bgColor = "bg-gray-50";

      // تخصيص الألوان والأيقونات حسب الحالة
      if (statusName.includes("جديد") || statusName.includes("New")) {
        icon = Clock;
        color = "text-gray-600";
        bgColor = "bg-gray-50";
      } else if (
        statusName.includes("متابعة") ||
        statusName.includes("Progress") ||
        statusName.includes("بحث")
      ) {
        icon = Search;
        color = "text-yellow-600";
        bgColor = "bg-yellow-50";
      } else if (
        statusName.includes("معاينه") ||
        statusName.includes("Inspection") ||
        statusName.includes("معلق")
      ) {
        icon = Eye;
        color = "text-purple-600";
        bgColor = "bg-purple-50";
      } else if (
        statusName.includes("مكتمل") ||
        statusName.includes("Completed") ||
        statusName.includes("تمام")
      ) {
        icon = CheckCircle;
        color = "text-green-600";
        bgColor = "bg-green-50";
      } else if (
        statusName.includes("ملغي") ||
        statusName.includes("Cancelled") ||
        statusName.includes("رفض")
      ) {
        icon = XCircle;
        color = "text-red-600";
        bgColor = "bg-red-50";
      }

      return {
        title: statusName,
        value: count,
        icon,
        color,
        bgColor,
      };
    }),
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      <span className="text-gray-400 text-sm">
                        جاري التحميل...
                      </span>
                    </div>
                  ) : (
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  )}
                </div>
                <div
                  className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
