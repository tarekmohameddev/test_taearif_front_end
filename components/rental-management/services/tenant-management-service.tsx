"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Home,
  DollarSign,
  AlertCircle,
  MessageSquare,
  FileText,
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

interface Tenant {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  nationalId: string;
  unit: string;
  property: string;
  propertyAr: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  status: "active" | "pending" | "expired" | "terminated";
  statusAr: string;
  paymentStatus: "current" | "late" | "overdue";
  paymentStatusAr: string;
  avatar: string;
  nationality: string;
  nationalityAr: string;
  emergencyContact: {
    name: string;
    nameAr: string;
    phone: string;
    relationship: string;
    relationshipAr: string;
  };
  notes: string;
  notesAr: string;
}

export function TenantManagementService() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterNationality, setFilterNationality] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const userData = useAuthStore(selectUserData);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchTenants");
      return;
    }

    // Simulate API call to tenant management microservice
    const fetchTenants = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setTenants([
        {
          id: "1",
          name: "Ahmed Al-Rashid",
          nameAr: "أحمد الراشد",
          email: "ahmed.rashid@email.com",
          phone: "+966 50 123 4567",
          nationalId: "1234567890",
          unit: "أ-204",
          property: "Al-Noor Residential Complex",
          propertyAr: "مجمع النور السكني",
          leaseStart: "1446/01/01",
          leaseEnd: "1446/12/30",
          monthlyRent: 4500,
          status: "active",
          statusAr: "نشط",
          paymentStatus: "current",
          paymentStatusAr: "محدث",
          avatar: "/placeholder.svg?height=40&width=40",
          nationality: "Saudi",
          nationalityAr: "سعودي",
          emergencyContact: {
            name: "Fatima Al-Rashid",
            nameAr: "فاطمة الراشد",
            phone: "+966 50 987 6543",
            relationship: "Wife",
            relationshipAr: "الزوجة",
          },
          notes: "Excellent tenant, always pays on time",
          notesAr: "مستأجر ممتاز، يدفع دائماً في الوقت المحدد",
        },
        {
          id: "2",
          name: "Mohammed Al-Otaibi",
          nameAr: "محمد العتيبي",
          email: "mohammed.otaibi@email.com",
          phone: "+966 55 234 5678",
          nationalId: "2345678901",
          unit: "ب-105",
          property: "Jeddah Towers",
          propertyAr: "أبراج جدة",
          leaseStart: "1445/06/01",
          leaseEnd: "1446/05/30",
          monthlyRent: 6200,
          status: "active",
          statusAr: "نشط",
          paymentStatus: "late",
          paymentStatusAr: "متأخر",
          avatar: "/placeholder.svg?height=40&width=40",
          nationality: "Saudi",
          nationalityAr: "سعودي",
          emergencyContact: {
            name: "Nora Al-Otaibi",
            nameAr: "نورا العتيبي",
            phone: "+966 55 876 5432",
            relationship: "Sister",
            relationshipAr: "الأخت",
          },
          notes: "Payment is 5 days late this month",
          notesAr: "الدفعة متأخرة 5 أيام هذا الشهر",
        },
        {
          id: "3",
          name: "Sarah Al-Mansouri",
          nameAr: "سارة المنصوري",
          email: "sarah.mansouri@email.com",
          phone: "+966 56 345 6789",
          nationalId: "3456789012",
          unit: "ج-301",
          property: "Dammam Gardens",
          propertyAr: "حدائق الدمام",
          leaseStart: "1446/02/01",
          leaseEnd: "1447/01/30",
          monthlyRent: 8500,
          status: "pending",
          statusAr: "قيد الانتظار",
          paymentStatus: "current",
          paymentStatusAr: "محدث",
          avatar: "/placeholder.svg?height=40&width=40",
          nationality: "Emirati",
          nationalityAr: "إماراتي",
          emergencyContact: {
            name: "Ali Al-Mansouri",
            nameAr: "علي المنصوري",
            phone: "+971 50 765 4321",
            relationship: "Father",
            relationshipAr: "الوالد",
          },
          notes: "New tenant, lease starts next month",
          notesAr: "مستأجر جديد، العقد يبدأ الشهر القادم",
        },
        {
          id: "4",
          name: "Khalid Al-Harbi",
          nameAr: "خالد الحربي",
          email: "khalid.harbi@email.com",
          phone: "+966 54 456 7890",
          nationalId: "4567890123",
          unit: "د-102",
          property: "Makkah Heights",
          propertyAr: "مرتفعات مكة",
          leaseStart: "1445/03/01",
          leaseEnd: "1446/02/28",
          monthlyRent: 3200,
          status: "expired",
          statusAr: "منتهي الصلاحية",
          paymentStatus: "overdue",
          paymentStatusAr: "متأخر جداً",
          avatar: "/placeholder.svg?height=40&width=40",
          nationality: "Saudi",
          nationalityAr: "سعودي",
          emergencyContact: {
            name: "Maryam Al-Harbi",
            nameAr: "مريم الحربي",
            phone: "+966 54 654 3210",
            relationship: "Mother",
            relationshipAr: "الوالدة",
          },
          notes: "Lease expired, needs renewal discussion",
          notesAr: "انتهى العقد، يحتاج مناقشة التجديد",
        },
      ]);
      setLoading(false);
    };

    fetchTenants();
  }, [userData?.token]);

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || tenant.status === filterStatus;
    const matchesNationality =
      filterNationality === "all" ||
      tenant.nationality.toLowerCase() === filterNationality;
    return matchesSearch && matchesStatus && matchesNationality;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "terminated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
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
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
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
          <h2 className="text-2xl font-bold">إدارة المستأجرين</h2>
          <p className="text-muted-foreground">
            إدارة معلومات المستأجرين والتواصل معهم
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مستأجر
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة مستأجر جديد</DialogTitle>
              <DialogDescription>تسجيل مستأجر جديد في النظام</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-name-ar">الاسم الكامل</Label>
                  <Input id="tenant-name-ar" placeholder="أحمد الراشد" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="national-id">رقم الهوية</Label>
                  <Input id="national-id" placeholder="1234567890" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-email">البريد الإلكتروني</Label>
                  <Input
                    id="tenant-email"
                    type="email"
                    placeholder="ahmed@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant-phone">رقم الهاتف</Label>
                  <Input id="tenant-phone" placeholder="+966 50 123 4567" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">الجنسية</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجنسية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saudi">سعودي</SelectItem>
                      <SelectItem value="emirati">إماراتي</SelectItem>
                      <SelectItem value="kuwaiti">كويتي</SelectItem>
                      <SelectItem value="qatari">قطري</SelectItem>
                      <SelectItem value="bahraini">بحريني</SelectItem>
                      <SelectItem value="omani">عماني</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant-unit">رقم الوحدة</Label>
                  <Input id="tenant-unit" placeholder="أ-204" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant-property">المشروع</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المشروع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="al-noor">مجمع النور السكني</SelectItem>
                    <SelectItem value="jeddah-towers">أبراج جدة</SelectItem>
                    <SelectItem value="dammam-gardens">حدائق الدمام</SelectItem>
                    <SelectItem value="makkah-heights">مرتفعات مكة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lease-start">بداية العقد</Label>
                  <Input id="lease-start" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lease-end">نهاية العقد</Label>
                  <Input id="lease-end" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-rent">الإيجار الشهري (ر.س)</Label>
                <Input id="monthly-rent" type="number" placeholder="4500" />
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
                إضافة المستأجر
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
            placeholder="البحث في المستأجرين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={filterNationality} onValueChange={setFilterNationality}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="جميع الجنسيات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الجنسيات</SelectItem>
            <SelectItem value="saudi">سعودي</SelectItem>
            <SelectItem value="emirati">إماراتي</SelectItem>
            <SelectItem value="kuwaiti">كويتي</SelectItem>
            <SelectItem value="other">أخرى</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="expired">منتهي الصلاحية</SelectItem>
            <SelectItem value="terminated">منهي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tenants List */}
      <div className="space-y-4">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={tenant.avatar || "/placeholder.svg"}
                      alt={tenant.nameAr}
                    />
                    <AvatarFallback>
                      {tenant.nameAr
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <h3 className="font-semibold">{tenant.nameAr}</h3>
                      <Badge className={getStatusColor(tenant.status)}>
                        {tenant.statusAr}
                      </Badge>
                      <Badge
                        className={getPaymentStatusColor(tenant.paymentStatus)}
                      >
                        {tenant.paymentStatusAr}
                      </Badge>
                      <Badge variant="outline">{tenant.nationalityAr}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Home className="h-3 w-3 ml-1" />
                        {tenant.propertyAr} - الوحدة {tenant.unit}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 ml-1" />
                        {tenant.monthlyRent.toLocaleString()} ر.س/شهر
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 ml-1" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 ml-1" />
                        {tenant.phone}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        العقد: {tenant.leaseStart} إلى {tenant.leaseEnd}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 ml-1" />
                    رسالة
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setSelectedTenant(tenant)}
                      >
                        <FileText className="ml-2 h-4 w-4" />
                        عرض التفاصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="ml-2 h-4 w-4" />
                        إرسال بريد إلكتروني
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="ml-2 h-4 w-4" />
                        جدولة زيارة
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {tenant.notesAr && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {tenant.notesAr}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tenant Details Dialog */}
      <Dialog
        open={!!selectedTenant}
        onOpenChange={() => setSelectedTenant(null)}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>تفاصيل المستأجر</DialogTitle>
            <DialogDescription>
              معلومات كاملة عن {selectedTenant?.nameAr}
            </DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">المعلومات</TabsTrigger>
                <TabsTrigger value="lease">تفاصيل العقد</TabsTrigger>
                <TabsTrigger value="history">السجل</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">الاسم الكامل</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedTenant.nameAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">رقم الهوية</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedTenant.nationalId}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      البريد الإلكتروني
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedTenant.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">رقم الهاتف</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedTenant.phone}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">الجنسية</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedTenant.nationalityAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">رقم الوحدة</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedTenant.unit}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    جهة الاتصال في حالات الطوارئ
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedTenant.emergencyContact.nameAr} (
                    {selectedTenant.emergencyContact.relationshipAr}) -{" "}
                    {selectedTenant.emergencyContact.phone}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="lease" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">المشروع</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedTenant.propertyAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      الإيجار الشهري
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedTenant.monthlyRent.toLocaleString()} ر.س
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">بداية العقد</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedTenant.leaseStart}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">نهاية العقد</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedTenant.leaseEnd}
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  سيتم عرض سجل المدفوعات وسجل التواصل هنا.
                </p>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            لم يتم العثور على مستأجرين
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all" || filterNationality !== "all"
              ? "جرب تعديل معايير البحث أو التصفية"
              : "ابدأ بإضافة مستأجرك الأول"}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مستأجر
          </Button>
        </div>
      )}
    </div>
  );
}
