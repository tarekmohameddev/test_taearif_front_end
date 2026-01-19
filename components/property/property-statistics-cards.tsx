"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, Key, Building } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

interface PropertyStatistics {
  for_sale: number;
  for_rent: number;
  complete_count: number;
}

export const PropertyStatisticsCards = () => {
  const [statistics, setStatistics] = useState<PropertyStatistics | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      const { userData } = useAuthStore.getState();
      if (!userData?.token) {
        console.log("No token available, skipping fetchStatistics");
        setLoading(false);
        setError("Authentication required. Please login.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/properties/cards");
        const { data } = response.data;

        if (data && typeof data === "object") {
          setStatistics({
            for_sale: data.complete?.for_sale || 0,
            for_rent: data.complete?.for_rent || 0,
            complete_count: data.complete_count || 0,
          });
        } else {
          setError("Invalid response format");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء جلب الإحصائيات";
        setError(errorMessage);
        console.error("Error fetching property statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const statsCards = [
    {
      title: "إجمالي الوحدات",
      value: statistics?.complete_count || 0,
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "للإيجار",
      value: statistics?.for_rent || 0,
      icon: Key,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "للبيع",
      value: statistics?.for_sale || 0,
      icon: Tag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  if (error && !loading) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
