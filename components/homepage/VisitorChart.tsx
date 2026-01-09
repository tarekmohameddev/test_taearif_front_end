"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/context/AuthContext";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import useStore from "@/context/Store";

function VisitorChart() {
  const {
    homepage: {
      visitorData,
      selectedTimeRange,
      fetchVisitorData,
      setSelectedTimeRange,
    },
    loading,
  } = useStore();
  const { userData, IsLoading: authLoading } = useAuthStore();

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return; // Exit early if token is not ready
    }

    const dataForSelectedRange = visitorData[selectedTimeRange];
    if (!dataForSelectedRange || !dataForSelectedRange.fetched) {
      fetchVisitorData(selectedTimeRange);
    }
  }, [userData?.token, authLoading, selectedTimeRange, visitorData, fetchVisitorData]);

  const chartData = visitorData[selectedTimeRange]?.data || [];
  const totalVisits = visitorData[selectedTimeRange]?.totalVisits || 0;
  const totalUniqueVisitors =
    visitorData[selectedTimeRange]?.totalUniqueVisitors || 0;

  // إذا لم يكن هناك token أو كان التحميل جارياً، لا نعرض المحتوى
  if (authLoading || !userData?.token) {
    return (
      <div className="w-full">
        <div className="text-center text-gray-500 py-8">
          {authLoading ? "جاري التحميل..." : "يرجى تسجيل الدخول لعرض البيانات"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* أزرار تحديد الفترة الزمنية */}
      <div className="mb-4 flex gap-2">
        {[
          { label: "7 أيام", value: "7" },
          { label: "30 يوم", value: "30" },
          { label: "3 أشهر", value: "90" },
          { label: "سنة", value: "365" },
        ].map((range) => {
          return (
            <Button
              key={range.value}
              variant={selectedTimeRange == range.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeRange(range.value)}
              className="text-sm"
            >
              {range.label}
            </Button>
          );
        })}
      </div>

      {/* عرض الإحصائيات الإجمالية */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {totalVisits}
            </div>
            <div className="text-sm sm:text-base text-gray-600">
              إجمالي الزيارات
            </div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {totalUniqueVisitors}
            </div>
            <div className="text-sm sm:text-base text-gray-600">
              إجمالي الزوار الفريدون
            </div>
          </div>
        </div>
      </div>

      {/* عرض حالة التحميل أو الرسم البياني */}
      <div className="h-[300px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-gray-500">جاري تحميل البيانات...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
                labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                content={({ payload }) => (
                  <div className="flex justify-end gap-4 text-sm mb-4">
                    {payload?.map((entry) => (
                      <div
                        key={entry.value}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>
                          {entry.value === "visits"
                            ? "الزيارات"
                            : "الزوار الفريدون"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <defs>
                <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="uniqueVisitorsFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#visitsFill)"
                dot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="uniqueVisitors"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#uniqueVisitorsFill)"
                dot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default VisitorChart;
