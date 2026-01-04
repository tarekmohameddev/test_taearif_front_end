import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Clock,
  Search,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface PropertyRequest {
  id: number;
  status?: string;
}

interface PropertyRequestStatisticsCardsProps {
  propertyRequests: PropertyRequest[];
  loading?: boolean;
}

export const PropertyRequestStatisticsCards = ({
  propertyRequests,
  loading = false,
}: PropertyRequestStatisticsCardsProps) => {
  // حساب الإحصائيات
  const totalRequests = propertyRequests.length;
  const newCount = propertyRequests.filter(
    (req) => req.status === "جديد",
  ).length;
  const searchingCount = propertyRequests.filter(
    (req) => req.status === "بحث عن عقار",
  ).length;
  const inspectionCount = propertyRequests.filter(
    (req) => req.status === "في المعاينه",
  ).length;
  const completedCount = propertyRequests.filter(
    (req) => req.status === "تم اتمام الصفقه",
  ).length;
  const rejectedCount = propertyRequests.filter(
    (req) => req.status === "رفض الصفقه",
  ).length;

  // تعريف البطاقات
  const statsCards = [
    {
      title: "إجمالي الطلبات",
      value: totalRequests,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "جديد",
      value: newCount,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "بحث عن عقار",
      value: searchingCount,
      icon: Search,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "في المعاينه",
      value: inspectionCount,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "تم اتمام الصفقه",
      value: completedCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "رفض الصفقه",
      value: rejectedCount,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
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
