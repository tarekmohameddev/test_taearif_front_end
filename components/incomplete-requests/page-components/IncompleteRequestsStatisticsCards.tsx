import { Card, CardContent } from "@/components/ui/card";
import { FileX, Globe, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";

interface IncompleteRequestsStatisticsCardsProps {
  statistics: {
    total: number;
    by_source?: {
      web?: number;
      whatsapp?: number;
    };
    by_purpose?: {
      rent?: number;
      sale?: number;
    };
  } | null;
  loading?: boolean;
}

export const IncompleteRequestsStatisticsCards = ({
  statistics,
  loading = false,
}: IncompleteRequestsStatisticsCardsProps) => {
  const total = statistics?.total || 0;
  const webCount = statistics?.by_source?.web || 0;
  const whatsappCount = statistics?.by_source?.whatsapp || 0;
  const rentCount = statistics?.by_purpose?.rent || 0;
  const saleCount = statistics?.by_purpose?.sale || 0;

  const statsCards = [
    {
      title: "إجمالي الطلبات الغير مكتملة",
      value: total,
      icon: FileX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "طلبات الويب",
      value: webCount,
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "طلبات واتساب",
      value: whatsappCount,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "للإيجار",
      value: rentCount,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "للبيع",
      value: saleCount,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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
