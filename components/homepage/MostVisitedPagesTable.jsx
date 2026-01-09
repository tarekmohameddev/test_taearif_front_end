"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function MostVisitedPagesTable() {
  const [pagesData, setPagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData, IsLoading: authLoading } = useAuthStore();

  // دالة جلب البيانات من API
  const fetchMostVisitedPages = async () => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      setLoading(false);
      return; // Exit early if token is not ready
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/most-visited-pages`,
      );
      setPagesData(response.data.pages);
    } catch (err) {
      console.error("Error fetching most visited pages:", err);
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      // إعادة تعيين البيانات عند عدم وجود token
      setPagesData([]);
      setError(null);
      setLoading(false);
      return; // Exit early if token is not ready
    }

    fetchMostVisitedPages();
  }, [userData?.token, authLoading]);

  // إذا لم يكن هناك token أو كان التحميل جارياً، لا نعرض المحتوى
  if (authLoading || !userData?.token) {
    return (
      <Card className="w-full">
        <CardHeader className="px-3 sm:px-4 md:px-6">
          <CardTitle className="text-base sm:text-lg md:text-xl">
            أكثر الصفحات زيارة
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            تحليل أداء صفحات الموقع
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 md:px-6">
          <div className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
            يرجى تسجيل الدخول لعرض البيانات
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading || error) {
    return (
      <Card className="w-full">
        {/* هيكل التحميل للعنوان */}
        <CardHeader className="px-3 sm:px-4 md:px-6">
          <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 mb-2" />
          <Skeleton className="h-3 sm:h-4 w-32 sm:w-40" />
        </CardHeader>

        {/* هيكل التحميل للجدول */}
        <CardContent className="px-3 sm:px-4 md:px-6">
          <div className="rounded-md border overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
            <div className="min-w-[600px] sm:min-w-full">
              <Table>
                {/* هيكل رأس الجدول */}
                <TableHeader>
                  <TableRow>
                    {[...Array(6)].map((_, i) => (
                      <TableHead
                        key={i}
                        className="px-2 sm:px-4 whitespace-nowrap"
                      >
                        <Skeleton className="h-4 w-full max-w-[80px] sm:max-w-none" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                {/* هيكل بيانات الجدول */}
                <TableBody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {[...Array(6)].map((_, cellIndex) => (
                        <TableCell key={cellIndex} className="px-2 sm:px-4">
                          <Skeleton
                            className={`h-4 ${
                              cellIndex === 0
                                ? "w-24 sm:w-32 md:w-40"
                                : "w-12 sm:w-16 md:w-20"
                            }`}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="px-3 sm:px-4 md:px-6">
        <CardTitle className="text-base sm:text-lg md:text-xl">
          أكثر الصفحات زيارة
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          تحليل أداء صفحات الموقع
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 md:px-6">
        <div className="rounded-md border overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
          <div className="min-w-[600px] sm:min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                    الصفحة
                  </TableHead>
                  <TableHead className="px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                    المشاهدات
                  </TableHead>
                  <TableHead className="px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm hidden sm:table-cell">
                    الزوار الفريدون
                  </TableHead>
                  <TableHead className="px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm hidden md:table-cell">
                    معدل الارتداد
                  </TableHead>
                  <TableHead className="px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm hidden lg:table-cell">
                    متوسط وقت التصفح
                  </TableHead>
                  <TableHead className="px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                    نسبة المشاهدات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagesData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium px-2 sm:px-4 text-xs sm:text-sm">
                      <div className="max-w-[120px] sm:max-w-[200px] md:max-w-none truncate">
                        {row.path}
                      </div>
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                      {row.views}
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">
                      {row.unique_visitors}
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 text-xs sm:text-sm hidden md:table-cell">
                      {row.bounce_rate}
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 text-xs sm:text-sm hidden lg:table-cell">
                      {row.avg_time !== undefined &&
                      row.avg_time !== null &&
                      row.avg_time !== "N/A"
                        ? row.avg_time
                        : "0:00"}
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                      {row.percentage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MostVisitedPagesTable;
