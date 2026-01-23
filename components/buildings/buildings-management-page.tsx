"use client";
import { useMemo, useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Search,
  Grid3X3,
  List,
  ArrowLeft,
} from "lucide-react";
import BuildingCard from "./building-card";
import BuildingsStats from "./buildings-stats";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { DashboardSidebar } from "@/components/mainCOMP/DashboardSidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

import { Building, BuildingsResponse } from "./types";

export default function BuildingsManagementPage() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBuildings, setSelectedBuildings] = useState<number[]>([]);
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalProperties: 0,
    availableProperties: 0,
    rentedProperties: 0,
  });

  // Fetch buildings data
  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<BuildingsResponse>("/buildings");

      if (response.data.status === "success") {
        setBuildings(response.data.data.data);

        // Calculate stats
        const totalProperties = response.data.data.data.reduce(
          (acc, building) => acc + building.properties.length,
          0,
        );
        const availableProperties = response.data.data.data.reduce(
          (acc, building) =>
            acc +
            building.properties.filter((p) => p.property_status === "available")
              .length,
          0,
        );
        const rentedProperties = response.data.data.data.reduce(
          (acc, building) =>
            acc +
            building.properties.filter((p) => p.property_status === "rented")
              .length,
          0,
        );

        setStats({
          totalBuildings: response.data.data.data.length,
          totalProperties,
          availableProperties,
          rentedProperties,
        });
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
      toast.error("فشل في تحميل بيانات العمارات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  // Filter and sort buildings
  const filteredBuildings = useMemo(() => {
    let filtered = buildings.filter((building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((building) => {
        const hasAvailableProperties = building.properties.some(
          (p) => p.property_status === "available",
        );
        return filterStatus === "available"
          ? hasAvailableProperties
          : !hasAvailableProperties;
      });
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "properties":
          return b.properties.length - a.properties.length;
        case "created":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });
  }, [buildings, searchTerm, filterStatus, sortBy]);

  const handleSelectBuilding = (buildingId: number) => {
    setSelectedBuildings((prev) =>
      prev.includes(buildingId)
        ? prev.filter((id) => id !== buildingId)
        : [...prev, buildingId],
    );
  };

  const handleSelectAll = () => {
    if (selectedBuildings.length === filteredBuildings.length) {
      setSelectedBuildings([]);
    } else {
      setSelectedBuildings(filteredBuildings.map((b) => b.id));
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <DashboardSidebar />
        <div className="p-6 space-y-6 bg-white flex-1">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Button
              onClick={() => router.push("/dashboard/properties")}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة للعقارات
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-black mb-2 text-center">
                إدارة العمارات
              </h1>
              <p className="text-gray-600  text-center">
                إدارة جميع العمارات والعقارات التابعة لها
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/dashboard/buildings/add")}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة عمارة جديدة
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <BuildingsStats buildings={buildings} loading={loading} />

          {/* Filters and Search */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="البحث في العمارات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 border-gray-300 focus:border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع العمارات</SelectItem>
                      <SelectItem value="available">عمارات متاحة</SelectItem>
                      <SelectItem value="occupied">عمارات مشغولة</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 border-gray-300 focus:border-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">الاسم</SelectItem>
                      <SelectItem value="properties">عدد العقارات</SelectItem>
                      <SelectItem value="created">تاريخ الإنشاء</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border border-gray-300 rounded-md">
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none border-r"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buildings Grid/List */}
          {filteredBuildings.length === 0 ? (
            <Card className="border border-gray-200">
              <CardContent className="p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  لا توجد عمارات
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "لم يتم العثور على عمارات تطابق البحث"
                    : "لم يتم إضافة أي عمارات بعد"}
                </p>
                <Button
                  onClick={() => router.push("/dashboard/buildings/add")}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة عمارة جديدة
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredBuildings.map((building) => (
                <BuildingCard
                  key={building.id}
                  building={building}
                  viewMode={viewMode}
                  onSelect={handleSelectBuilding}
                  isSelected={selectedBuildings.includes(building.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
