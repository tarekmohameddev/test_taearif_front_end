"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface Property {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  city: string;
  cityAr: string;
  district: string;
  districtAr: string;
  type: string;
  typeAr: string;
  units: number;
  occupiedUnits: number;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  status: "available" | "occupied" | "maintenance" | "under-construction";
  statusAr: string;
  lastUpdated: string;
  image: string;
  amenities: string[];
  amenitiesAr: string[];
}

export function PropertyListingService() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const userData = useAuthStore(selectUserData);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchProperties");
      return;
    }

    // Simulate API call to property listing microservice
    const fetchProperties = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setProperties([
        {
          id: "1",
          name: "Al-Noor Residential Complex",
          nameAr: "مجمع النور السكني",
          address: "King Fahd Road, Al-Olaya District",
          addressAr: "طريق الملك فهد، حي العليا",
          city: "Riyadh",
          cityAr: "الرياض",
          district: "Al-Olaya",
          districtAr: "العليا",
          type: "Residential Complex",
          typeAr: "مجمع سكني",
          units: 48,
          occupiedUnits: 42,
          monthlyRent: 4500,
          bedrooms: 3,
          bathrooms: 2,
          squareMeters: 180,
          status: "available",
          statusAr: "متاح",
          lastUpdated: "1446/07/15",
          image: "/placeholder.svg?height=200&width=300",
          amenities: ["Swimming Pool", "Gym", "Parking", "Security"],
          amenitiesAr: ["مسبح", "صالة رياضية", "موقف سيارات", "أمن"],
        },
        {
          id: "2",
          name: "Jeddah Towers",
          nameAr: "أبراج جدة",
          address: "Corniche Road, Al-Hamra District",
          addressAr: "طريق الكورنيش، حي الحمراء",
          city: "Jeddah",
          cityAr: "جدة",
          district: "Al-Hamra",
          districtAr: "الحمراء",
          type: "High-rise Tower",
          typeAr: "برج سكني",
          units: 96,
          occupiedUnits: 78,
          monthlyRent: 6200,
          bedrooms: 2,
          bathrooms: 2,
          squareMeters: 140,
          status: "occupied",
          statusAr: "مؤجر",
          lastUpdated: "1446/07/14",
          image: "/placeholder.svg?height=200&width=300",
          amenities: ["Sea View", "Gym", "Parking", "Concierge"],
          amenitiesAr: [
            "إطلالة بحرية",
            "صالة رياضية",
            "موقف سيارات",
            "خدمة الاستقبال",
          ],
        },
        {
          id: "3",
          name: "Dammam Gardens",
          nameAr: "حدائق الدمام",
          address: "Prince Mohammed Bin Fahd Road",
          addressAr: "طريق الأمير محمد بن فهد",
          city: "Dammam",
          cityAr: "الدمام",
          district: "Al-Faisaliyah",
          districtAr: "الفيصلية",
          type: "Villa Complex",
          typeAr: "مجمع فلل",
          units: 24,
          occupiedUnits: 20,
          monthlyRent: 8500,
          bedrooms: 4,
          bathrooms: 3,
          squareMeters: 280,
          status: "available",
          statusAr: "متاح",
          lastUpdated: "1446/07/13",
          image: "/placeholder.svg?height=200&width=300",
          amenities: ["Garden", "Maid Room", "Parking", "Private Pool"],
          amenitiesAr: ["حديقة", "غرفة خادمة", "موقف سيارات", "مسبح خاص"],
        },
        {
          id: "4",
          name: "Makkah Heights",
          nameAr: "مرتفعات مكة",
          address: "Ibrahim Al-Khalil Street",
          addressAr: "شارع إبراهيم الخليل",
          city: "Makkah",
          cityAr: "مكة المكرمة",
          district: "Al-Aziziyah",
          districtAr: "العزيزية",
          type: "Apartment Building",
          typeAr: "عمارة شقق",
          units: 32,
          occupiedUnits: 28,
          monthlyRent: 3200,
          bedrooms: 2,
          bathrooms: 1,
          squareMeters: 120,
          status: "under-construction",
          statusAr: "تحت الإنشاء",
          lastUpdated: "1446/07/12",
          image: "/placeholder.svg?height=200&width=300",
          amenities: ["Haram View", "Parking", "Elevator"],
          amenitiesAr: ["إطلالة على الحرم", "موقف سيارات", "مصعد"],
        },
      ]);
      setLoading(false);
    };

    fetchProperties();
  }, [userData?.token]);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.addressAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.cityAr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || property.status === filterStatus;
    const matchesCity =
      filterCity === "all" || property.city.toLowerCase() === filterCity;
    return matchesSearch && matchesStatus && matchesCity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "under-construction":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-gray-500">
              يرجى تسجيل الدخول لعرض المحتوى
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="h-48 bg-muted animate-pulse rounded-t-lg" />
              <CardContent className="p-4 space-y-2">
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">المشاريع العقارية</h2>
          <p className="text-muted-foreground">
            إدارة المشاريع العقارية والوحدات السكنية
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مشروع
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة مشروع عقاري جديد</DialogTitle>
              <DialogDescription>
                إنشاء مشروع عقاري جديد في النظام
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name-ar">اسم المشروع</Label>
                  <Input id="name-ar" placeholder="مجمع النور السكني" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">نوع المشروع</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential-complex">
                        مجمع سكني
                      </SelectItem>
                      <SelectItem value="tower">برج سكني</SelectItem>
                      <SelectItem value="villa-complex">مجمع فلل</SelectItem>
                      <SelectItem value="apartment-building">
                        عمارة شقق
                      </SelectItem>
                      <SelectItem value="commercial">تجاري</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="riyadh">الرياض</SelectItem>
                      <SelectItem value="jeddah">جدة</SelectItem>
                      <SelectItem value="dammam">الدمام</SelectItem>
                      <SelectItem value="makkah">مكة المكرمة</SelectItem>
                      <SelectItem value="madinah">المدينة المنورة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">الحي</Label>
                  <Input id="district" placeholder="العليا" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-ar">العنوان</Label>
                <Input
                  id="address-ar"
                  placeholder="طريق الملك فهد، حي العليا"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="units">عدد الوحدات</Label>
                  <Input id="units" type="number" placeholder="48" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">غرف النوم</Label>
                  <Input id="bedrooms" type="number" placeholder="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">دورات المياه</Label>
                  <Input id="bathrooms" type="number" placeholder="2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent">الإيجار الشهري (ر.س)</Label>
                  <Input id="rent" type="number" placeholder="4500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">المساحة (متر مربع)</Label>
                  <Input id="area" type="number" placeholder="180" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea id="description" placeholder="وصف المشروع..." />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                إضافة المشروع
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في المشاريع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="جميع المدن" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المدن</SelectItem>
            <SelectItem value="riyadh">الرياض</SelectItem>
            <SelectItem value="jeddah">جدة</SelectItem>
            <SelectItem value="dammam">الدمام</SelectItem>
            <SelectItem value="makkah">مكة المكرمة</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="available">متاح</SelectItem>
            <SelectItem value="occupied">مؤجر</SelectItem>
            <SelectItem value="maintenance">صيانة</SelectItem>
            <SelectItem value="under-construction">تحت الإنشاء</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.nameAr}
                className="w-full h-48 object-cover"
              />
              <Badge
                className={`absolute top-2 left-2 ${getStatusColor(property.status)}`}
              >
                {property.statusAr}
              </Badge>
            </div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{property.nameAr}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 ml-1" />
                    {property.addressAr}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">
                    {property.cityAr} - {property.districtAr}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="ml-2 h-4 w-4" />
                      عرض التفاصيل
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل المشروع
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الإشغال</span>
                  <span className="font-medium">
                    {property.occupiedUnits}/{property.units} وحدة
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex items-center">
                      <Bed className="h-3 w-3 ml-1 text-muted-foreground" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-3 w-3 ml-1 text-muted-foreground" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-3 w-3 ml-1 text-muted-foreground" />
                      <span>{property.squareMeters} م²</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {property.amenitiesAr.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {property.amenitiesAr.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{property.amenitiesAr.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 ml-1 text-green-600" />
                    <span className="font-semibold text-green-600">
                      {property.monthlyRent.toLocaleString()} ر.س/شهر
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    محدث {property.lastUpdated}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">لم يتم العثور على مشاريع</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all" || filterCity !== "all"
              ? "جرب تعديل معايير البحث أو التصفية"
              : "ابدأ بإضافة مشروعك الأول"}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مشروع
          </Button>
        </div>
      )}
    </div>
  );
}
