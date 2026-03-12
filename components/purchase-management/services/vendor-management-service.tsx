"use client";

import { useState, useEffect } from "react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Star,
  Eye,
  MessageSquare,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  nameAr: string;
  type: "developer" | "individual" | "company" | "broker";
  typeAr: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    addressAr: string;
    website?: string;
  };
  businessInfo: {
    licenseNumber: string;
    establishedYear: number;
    specialization: string[];
    specializationAr: string[];
    rating: number;
    totalDeals: number;
    totalValue: number;
  };
  properties: {
    active: number;
    sold: number;
    avgPrice: number;
    locations: string[];
    locationsAr: string[];
  };
  status: "active" | "inactive" | "pending" | "blacklisted";
  statusAr: string;
  notes: string;
  notesAr: string;
  lastContact: string;
  lastContactHijri: string;
  createdDate: string;
  createdDateHijri: string;
  avatar?: string;
}

export function VendorManagementService() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const userData = useAuthStore(selectUserData);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchVendors");
      return;
    }

    const fetchVendors = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setVendors([
        {
          id: "1",
          name: "Al-Rashid Development Company",
          nameAr: "شركة الراشد للتطوير العقاري",
          type: "developer",
          typeAr: "مطور",
          contact: {
            email: "info@rashid-dev.com",
            phone: "+966 11 234 5678",
            address: "King Fahd Road, Riyadh",
            addressAr: "طريق الملك فهد، الرياض",
            website: "www.rashid-dev.com",
          },
          businessInfo: {
            licenseNumber: "DEV-2020-001",
            establishedYear: 2015,
            specialization: ["Residential", "Commercial", "Mixed-use"],
            specializationAr: ["سكني", "تجاري", "مختلط"],
            rating: 4.8,
            totalDeals: 45,
            totalValue: 125000000,
          },
          properties: {
            active: 12,
            sold: 33,
            avgPrice: 2800000,
            locations: ["Riyadh", "Jeddah", "Dammam"],
            locationsAr: ["الرياض", "جدة", "الدمام"],
          },
          status: "active",
          statusAr: "نشط",
          notes: "Reliable developer with high-quality projects",
          notesAr: "مطور موثوق مع مشاريع عالية الجودة",
          lastContact: "2024-01-15",
          lastContactHijri: "1446/07/15",
          createdDate: "2023-03-10",
          createdDateHijri: "1444/08/18",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "2",
          name: "Mohammed Al-Saud",
          nameAr: "محمد السعود",
          type: "individual",
          typeAr: "فرد",
          contact: {
            email: "mohammed.saud@email.com",
            phone: "+966 50 987 6543",
            address: "Al-Olaya District, Riyadh",
            addressAr: "حي العليا، الرياض",
          },
          businessInfo: {
            licenseNumber: "IND-2021-045",
            establishedYear: 2018,
            specialization: ["Luxury Villas", "Investment Properties"],
            specializationAr: ["فلل فاخرة", "عقارات استثمارية"],
            rating: 4.5,
            totalDeals: 28,
            totalValue: 67500000,
          },
          properties: {
            active: 8,
            sold: 20,
            avgPrice: 2400000,
            locations: ["Riyadh", "Makkah"],
            locationsAr: ["الرياض", "مكة"],
          },
          status: "active",
          statusAr: "نشط",
          notes: "Specializes in luxury properties",
          notesAr: "متخصص في العقارات الفاخرة",
          lastContact: "2024-01-12",
          lastContactHijri: "1446/07/12",
          createdDate: "2023-06-20",
          createdDateHijri: "1444/12/02",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "3",
          name: "Jeddah Properties Brokerage",
          nameAr: "وساطة عقارات جدة",
          type: "broker",
          typeAr: "وسيط",
          contact: {
            email: "info@jeddah-properties.com",
            phone: "+966 12 345 6789",
            address: "Al-Hamra District, Jeddah",
            addressAr: "حي الحمراء، جدة",
            website: "www.jeddah-properties.com",
          },
          businessInfo: {
            licenseNumber: "BRK-2019-078",
            establishedYear: 2012,
            specialization: ["Residential", "Commercial", "Rental"],
            specializationAr: ["سكني", "تجاري", "إيجار"],
            rating: 4.2,
            totalDeals: 156,
            totalValue: 89200000,
          },
          properties: {
            active: 25,
            sold: 131,
            avgPrice: 1800000,
            locations: ["Jeddah", "Makkah", "Taif"],
            locationsAr: ["جدة", "مكة", "الطائف"],
          },
          status: "active",
          statusAr: "نشط",
          notes: "Large brokerage with extensive network",
          notesAr: "وساطة كبيرة مع شبكة واسعة",
          lastContact: "2024-01-10",
          lastContactHijri: "1446/07/10",
          createdDate: "2022-11-15",
          createdDateHijri: "1444/04/21",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "4",
          name: "Eastern Province Construction Co.",
          nameAr: "شركة المنطقة الشرقية للإنشاء",
          type: "company",
          typeAr: "شركة",
          contact: {
            email: "sales@epc-construction.com",
            phone: "+966 13 456 7890",
            address: "King Abdul Aziz Road, Dammam",
            addressAr: "طريق الملك عبدالعزيز، الدمام",
            website: "www.epc-construction.com",
          },
          businessInfo: {
            licenseNumber: "CON-2017-023",
            establishedYear: 2010,
            specialization: ["Residential Compounds", "Commercial Buildings"],
            specializationAr: ["مجمعات سكنية", "مباني تجارية"],
            rating: 4.6,
            totalDeals: 67,
            totalValue: 156800000,
          },
          properties: {
            active: 15,
            sold: 52,
            avgPrice: 2340000,
            locations: ["Dammam", "Khobar", "Dhahran"],
            locationsAr: ["الدمام", "الخبر", "الظهران"],
          },
          status: "active",
          statusAr: "نشط",
          notes: "Strong presence in Eastern Province",
          notesAr: "حضور قوي في المنطقة الشرقية",
          lastContact: "2024-01-08",
          lastContactHijri: "1446/07/08",
          createdDate: "2023-01-25",
          createdDateHijri: "1444/06/03",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "5",
          name: "Sarah Al-Mansouri",
          nameAr: "سارة المنصوري",
          type: "individual",
          typeAr: "فرد",
          contact: {
            email: "sarah.mansouri@email.com",
            phone: "+966 56 789 0123",
            address: "Al-Faisaliyah District, Dammam",
            addressAr: "حي الفيصلية، الدمام",
          },
          businessInfo: {
            licenseNumber: "IND-2022-089",
            establishedYear: 2020,
            specialization: ["Apartments", "Townhouses"],
            specializationAr: ["شقق", "تاون هاوس"],
            rating: 4.0,
            totalDeals: 15,
            totalValue: 23400000,
          },
          properties: {
            active: 5,
            sold: 10,
            avgPrice: 1560000,
            locations: ["Dammam", "Khobar"],
            locationsAr: ["الدمام", "الخبر"],
          },
          status: "pending",
          statusAr: "قيد المراجعة",
          notes: "New vendor, under evaluation",
          notesAr: "بائع جديد، قيد التقييم",
          lastContact: "2024-01-05",
          lastContactHijri: "1446/07/05",
          createdDate: "2024-01-01",
          createdDateHijri: "1446/07/01",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ]);
      setLoading(false);
    };

    fetchVendors();
  }, [userData?.token]);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact.phone.includes(searchTerm) ||
      vendor.businessInfo.licenseNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || vendor.type === filterType;
    const matchesStatus =
      filterStatus === "all" || vendor.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "blacklisted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "developer":
        return "bg-blue-100 text-blue-800";
      case "individual":
        return "bg-purple-100 text-purple-800";
      case "company":
        return "bg-green-100 text-green-800";
      case "broker":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
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
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  </div>
                </div>
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
          <h2 className="text-2xl font-bold">إدارة البائعين والمطورين</h2>
          <p className="text-muted-foreground">
            إدارة معلومات البائعين والمطورين والوسطاء
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة بائع
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة بائع جديد</DialogTitle>
              <DialogDescription>
                تسجيل بائع أو مطور جديد في النظام
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor-name">اسم البائع/الشركة</Label>
                  <Input id="vendor-name" placeholder="شركة الراشد للتطوير" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-type">نوع البائع</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">مطور</SelectItem>
                      <SelectItem value="individual">فرد</SelectItem>
                      <SelectItem value="company">شركة</SelectItem>
                      <SelectItem value="broker">وسيط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor-email">البريد الإلكتروني</Label>
                  <Input
                    id="vendor-email"
                    type="email"
                    placeholder="info@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-phone">رقم الهاتف</Label>
                  <Input id="vendor-phone" placeholder="+966 11 234 5678" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor-address">العنوان</Label>
                <Input
                  id="vendor-address"
                  placeholder="طريق الملك فهد، الرياض"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license-number">رقم الترخيص</Label>
                  <Input id="license-number" placeholder="DEV-2024-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established-year">سنة التأسيس</Label>
                  <Input
                    id="established-year"
                    type="number"
                    placeholder="2015"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">الموقع الإلكتروني (اختياري)</Label>
                <Input id="website" placeholder="www.company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">التخصص</Label>
                <Textarea
                  id="specialization"
                  placeholder="سكني، تجاري، مختلط..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor-notes">ملاحظات</Label>
                <Textarea
                  id="vendor-notes"
                  placeholder="أي ملاحظات حول البائع..."
                  rows={3}
                />
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
                إضافة البائع
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في البائعين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue placeholder="نوع البائع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="developer">مطور</SelectItem>
            <SelectItem value="individual">فرد</SelectItem>
            <SelectItem value="company">شركة</SelectItem>
            <SelectItem value="broker">وسيط</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
            <SelectItem value="pending">قيد المراجعة</SelectItem>
            <SelectItem value="blacklisted">محظور</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vendors List */}
      <div className="space-y-4">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 space-x-reverse flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={vendor.avatar || "/placeholder.svg"}
                      alt={vendor.nameAr}
                    />
                    <AvatarFallback>
                      {vendor.nameAr
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <h3 className="font-semibold text-lg">{vendor.nameAr}</h3>
                      <Badge className={getStatusColor(vendor.status)}>
                        {vendor.statusAr}
                      </Badge>
                      <Badge className={getTypeColor(vendor.type)}>
                        {vendor.typeAr}
                      </Badge>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        {getRatingStars(vendor.businessInfo.rating)}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({vendor.businessInfo.rating})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{vendor.contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{vendor.contact.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{vendor.contact.addressAr}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">العقارات النشطة:</span>
                          <span>{vendor.properties.active}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">إجمالي الصفقات:</span>
                          <span>{vendor.businessInfo.totalDeals}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <TrendingUp className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">متوسط السعر:</span>
                          <span>
                            {vendor.properties.avgPrice.toLocaleString()} ر.س
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {vendor.businessInfo.specializationAr.map(
                        (spec, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {spec}
                          </Badge>
                        ),
                      )}
                    </div>

                    {vendor.notesAr && (
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                          {vendor.notesAr}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <Eye className="h-3 w-3 ml-1" />
                    التفاصيل
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-3 w-3 ml-1" />
                    رسالة
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3 ml-1" />
                    اتصال
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vendor Details Dialog */}
      <Dialog
        open={!!selectedVendor}
        onOpenChange={() => setSelectedVendor(null)}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل البائع</DialogTitle>
            <DialogDescription>
              معلومات كاملة عن {selectedVendor?.nameAr}
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">المعلومات</TabsTrigger>
                <TabsTrigger value="business">الأعمال</TabsTrigger>
                <TabsTrigger value="properties">العقارات</TabsTrigger>
                <TabsTrigger value="history">السجل</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="flex items-center space-x-4 space-x-reverse mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedVendor.avatar || "/placeholder.svg"}
                      alt={selectedVendor.nameAr}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedVendor.nameAr
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedVendor.nameAr}
                    </h3>
                    <div className="flex items-center space-x-2 space-x-reverse mt-1">
                      <Badge className={getTypeColor(selectedVendor.type)}>
                        {selectedVendor.typeAr}
                      </Badge>
                      <Badge className={getStatusColor(selectedVendor.status)}>
                        {selectedVendor.statusAr}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      البريد الإلكتروني
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.contact.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">رقم الهاتف</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.contact.phone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">العنوان</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.contact.addressAr}
                    </p>
                  </div>
                  {selectedVendor.contact.website && (
                    <div className="col-span-2">
                      <Label className="text-sm font-medium">
                        الموقع الإلكتروني
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedVendor.contact.website}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">رقم الترخيص</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.businessInfo.licenseNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">سنة التأسيس</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.businessInfo.establishedYear}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">التقييم</Label>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="flex">
                        {getRatingStars(selectedVendor.businessInfo.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({selectedVendor.businessInfo.rating})
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      إجمالي الصفقات
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.businessInfo.totalDeals}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">
                      إجمالي قيمة الصفقات
                    </Label>
                    <p className="text-sm text-muted-foreground font-bold text-green-600">
                      {selectedVendor.businessInfo.totalValue.toLocaleString()}{" "}
                      ر.س
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">التخصصات</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedVendor.businessInfo.specializationAr.map(
                      (spec, index) => (
                        <Badge key={index} variant="outline">
                          {spec}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="properties" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedVendor.properties.active}
                    </div>
                    <div className="text-sm text-blue-700">عقارات نشطة</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedVendor.properties.sold}
                    </div>
                    <div className="text-sm text-green-700">عقارات مباعة</div>
                  </div>
                  <div className="col-span-2 text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedVendor.properties.avgPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-purple-700">
                      متوسط السعر (ر.س)
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">المناطق النشطة</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedVendor.properties.locationsAr.map(
                      (location, index) => (
                        <Badge key={index} variant="outline">
                          <MapPin className="h-3 w-3 ml-1" />
                          {location}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">تاريخ التسجيل</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.createdDateHijri}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">آخر تواصل</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedVendor.lastContactHijri}
                    </p>
                  </div>
                </div>
                {selectedVendor.notesAr && (
                  <div>
                    <Label className="text-sm font-medium">ملاحظات</Label>
                    <div className="p-3 bg-blue-50 rounded-md mt-2">
                      <p className="text-sm text-blue-800">
                        {selectedVendor.notesAr}
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">لم يتم العثور على بائعين</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "جرب تعديل معايير البحث"
              : "لا يوجد بائعين مسجلين حالياً"}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة بائع
          </Button>
        </div>
      )}
    </div>
  );
}
