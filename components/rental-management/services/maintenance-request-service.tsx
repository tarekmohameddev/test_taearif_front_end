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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Home,
  Phone,
  MessageSquare,
  Upload,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface MaintenanceRequest {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantNameAr: string;
  tenantAvatar: string;
  tenantPhone: string;
  unit: string;
  property: string;
  propertyAr: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  priority: "low" | "medium" | "high" | "urgent";
  priorityAr: string;
  status: "open" | "in-progress" | "completed" | "cancelled";
  statusAr: string;
  submittedDate: string;
  submittedDateHijri: string;
  scheduledDate?: string;
  scheduledDateHijri?: string;
  completedDate?: string;
  completedDateHijri?: string;
  assignedTo?: string;
  assignedToAr?: string;
  estimatedCost?: number;
  actualCost?: number;
  images?: string[];
  notes?: string;
  notesAr?: string;
}

export function MaintenanceRequestService() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const userData = useAuthStore(selectUserData);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchMaintenanceRequests");
      return;
    }

    // Simulate API call to maintenance request microservice
    const fetchMaintenanceRequests = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setRequests([
        {
          id: "1",
          tenantId: "1",
          tenantName: "Ahmed Al-Rashid",
          tenantNameAr: "أحمد الراشد",
          tenantAvatar: "/placeholder.svg?height=40&width=40",
          tenantPhone: "+966 50 123 4567",
          unit: "أ-204",
          property: "Al-Noor Residential Complex",
          propertyAr: "مجمع النور السكني",
          title: "Leaky Kitchen Faucet",
          titleAr: "تسريب في صنبور المطبخ",
          description:
            "The kitchen faucet has been dripping constantly for the past week. It's getting worse and wasting water.",
          descriptionAr:
            "صنبور المطبخ يقطر باستمرار منذ الأسبوع الماضي. المشكلة تزداد سوءاً وتهدر الماء.",
          category: "Plumbing",
          categoryAr: "سباكة",
          priority: "medium",
          priorityAr: "متوسط",
          status: "open",
          statusAr: "مفتوح",
          submittedDate: "2024-01-15",
          submittedDateHijri: "1446/07/15",
          estimatedCost: 300,
          images: ["/placeholder.svg?height=200&width=300"],
          notes: "Tenant reports it started after the cold snap last week",
          notesAr:
            "المستأجر يفيد أن المشكلة بدأت بعد موجة البرد الأسبوع الماضي",
        },
        {
          id: "2",
          tenantId: "2",
          tenantName: "Mohammed Al-Otaibi",
          tenantNameAr: "محمد العتيبي",
          tenantAvatar: "/placeholder.svg?height=40&width=40",
          tenantPhone: "+966 55 234 5678",
          unit: "ب-105",
          property: "Jeddah Towers",
          propertyAr: "أبراج جدة",
          title: "Air Conditioning Not Working",
          titleAr: "تكييف الهواء لا يعمل",
          description:
            "The air conditioning system stopped working yesterday. The unit is getting very hot.",
          descriptionAr:
            "نظام تكييف الهواء توقف عن العمل أمس. الوحدة أصبحت حارة جداً.",
          category: "HVAC",
          categoryAr: "تكييف وتهوية",
          priority: "urgent",
          priorityAr: "عاجل",
          status: "in-progress",
          statusAr: "قيد التنفيذ",
          submittedDate: "2024-01-14",
          submittedDateHijri: "1446/07/14",
          scheduledDate: "2024-01-16",
          scheduledDateHijri: "1446/07/16",
          assignedTo: "Eng. Khalid Al-Mutairi",
          assignedToAr: "م. خالد المطيري",
          estimatedCost: 800,
          notes: "Emergency repair scheduled for tomorrow morning",
          notesAr: "تم جدولة إصلاح طارئ لصباح الغد",
        },
        {
          id: "3",
          tenantId: "3",
          tenantName: "Sarah Al-Mansouri",
          tenantNameAr: "سارة المنصوري",
          tenantAvatar: "/placeholder.svg?height=40&width=40",
          tenantPhone: "+966 56 345 6789",
          unit: "ج-301",
          property: "Dammam Gardens",
          propertyAr: "حدائق الدمام",
          title: "Broken Window Lock",
          titleAr: "قفل النافذة مكسور",
          description:
            "The lock on the bedroom window is broken and won't secure properly.",
          descriptionAr: "قفل نافذة غرفة النوم مكسور ولا يُؤمن بشكل صحيح.",
          category: "Security",
          categoryAr: "أمان",
          priority: "high",
          priorityAr: "عالي",
          status: "open",
          statusAr: "مفتوح",
          submittedDate: "2024-01-13",
          submittedDateHijri: "1446/07/13",
          estimatedCost: 150,
          notes: "Security concern - needs prompt attention",
          notesAr: "مشكلة أمنية - تحتاج اهتمام فوري",
        },
        {
          id: "4",
          tenantId: "4",
          tenantName: "Khalid Al-Harbi",
          tenantNameAr: "خالد الحربي",
          tenantAvatar: "/placeholder.svg?height=40&width=40",
          tenantPhone: "+966 54 456 7890",
          unit: "د-102",
          property: "Makkah Heights",
          propertyAr: "مرتفعات مكة",
          title: "Light Fixture Replacement",
          titleAr: "استبدال وحدة الإضاءة",
          description:
            "The ceiling light fixture in the living room burned out and needs replacement.",
          descriptionAr:
            "وحدة الإضاءة في السقف بغرفة المعيشة احترقت وتحتاج استبدال.",
          category: "Electrical",
          categoryAr: "كهرباء",
          priority: "low",
          priorityAr: "منخفض",
          status: "completed",
          statusAr: "مكتمل",
          submittedDate: "2024-01-10",
          submittedDateHijri: "1446/07/10",
          completedDate: "2024-01-12",
          completedDateHijri: "1446/07/12",
          assignedTo: "Technician Ahmad",
          assignedToAr: "الفني أحمد",
          estimatedCost: 120,
          actualCost: 100,
          notes: "Completed - new LED fixture installed",
          notesAr: "مكتمل - تم تركيب وحدة إضاءة LED جديدة",
        },
      ]);
      setLoading(false);
    };

    fetchMaintenanceRequests();
  }, [userData?.token]);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenantNameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.categoryAr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || request.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4" />;
      case "in-progress":
        return <Wrench className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
          <h2 className="text-2xl font-bold">طلبات الصيانة</h2>
          <p className="text-muted-foreground">تتبع وإدارة طلبات الصيانة</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إنشاء طلب
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إنشاء طلب صيانة</DialogTitle>
              <DialogDescription>
                إنشاء طلب صيانة جديد للمشروع
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-select">المستأجر</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستأجر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        أحمد الراشد - الوحدة أ-204
                      </SelectItem>
                      <SelectItem value="2">
                        محمد العتيبي - الوحدة ب-105
                      </SelectItem>
                      <SelectItem value="3">
                        سارة المنصوري - الوحدة ج-301
                      </SelectItem>
                      <SelectItem value="4">
                        خالد الحربي - الوحدة د-102
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">الفئة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">سباكة</SelectItem>
                      <SelectItem value="electrical">كهرباء</SelectItem>
                      <SelectItem value="hvac">تكييف وتهوية</SelectItem>
                      <SelectItem value="appliances">أجهزة</SelectItem>
                      <SelectItem value="security">أمان</SelectItem>
                      <SelectItem value="general">عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title-ar">العنوان</Label>
                <Input id="title-ar" placeholder="وصف مختصر للمشكلة" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description-ar">الوصف</Label>
                <Textarea
                  id="description-ar"
                  placeholder="وصف تفصيلي لمشكلة الصيانة..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">الأولوية</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفض</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">عالي</SelectItem>
                      <SelectItem value="urgent">عاجل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated-cost">التكلفة المقدرة (ر.س)</Label>
                  <Input id="estimated-cost" type="number" placeholder="300" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الصور</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    انقر لرفع الصور أو اسحب وأفلت
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                إنشاء الطلب
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
            placeholder="البحث في الطلبات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="open">مفتوح</SelectItem>
            <SelectItem value="in-progress">قيد التنفيذ</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-full sm:w-48">
            <AlertTriangle className="ml-2 h-4 w-4" />
            <SelectValue placeholder="جميع الأولويات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأولويات</SelectItem>
            <SelectItem value="urgent">عاجل</SelectItem>
            <SelectItem value="high">عالي</SelectItem>
            <SelectItem value="medium">متوسط</SelectItem>
            <SelectItem value="low">منخفض</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card
            key={request.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedRequest(request)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={request.tenantAvatar || "/placeholder.svg"}
                      alt={request.tenantNameAr}
                    />
                    <AvatarFallback>
                      {request.tenantNameAr
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <h3 className="font-semibold">{request.titleAr}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="mr-1">{request.statusAr}</span>
                      </Badge>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priorityAr}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 ml-1" />
                        {request.tenantNameAr}
                      </div>
                      <div className="flex items-center">
                        <Home className="h-3 w-3 ml-1" />
                        {request.propertyAr} - الوحدة {request.unit}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        {request.submittedDateHijri}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {request.descriptionAr}
                    </p>
                    {request.notesAr && (
                      <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                        {request.notesAr}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-left space-y-2">
                  <div className="text-sm text-muted-foreground">
                    الفئة: {request.categoryAr}
                  </div>
                  {request.estimatedCost && (
                    <div className="text-sm">
                      التكلفة المقدرة: {request.estimatedCost} ر.س
                    </div>
                  )}
                  {request.assignedToAr && (
                    <div className="text-sm text-green-600">
                      مُكلف إلى: {request.assignedToAr}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 ml-1" />
                      اتصال
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 ml-1" />
                      رسالة
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request Details Dialog */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>تفاصيل طلب الصيانة</DialogTitle>
            <DialogDescription>
              الطلب رقم #{selectedRequest?.id} - {selectedRequest?.titleAr}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">المستأجر</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.tenantNameAr}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">المشروع والوحدة</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.propertyAr} - الوحدة {selectedRequest.unit}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">الفئة</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.categoryAr}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">الأولوية</Label>
                  <Badge className={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priorityAr}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">الحالة</Label>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="mr-1">{selectedRequest.statusAr}</span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">تاريخ التقديم</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.submittedDateHijri}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">الوصف</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedRequest.descriptionAr}
                </p>
              </div>

              {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">الصور</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {selectedRequest.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`صورة الطلب ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.assignedToAr && (
                <div>
                  <Label className="text-sm font-medium">مُكلف إلى</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.assignedToAr}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button>تحديث الحالة</Button>
                <Button variant="outline">تكليف فني</Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 ml-2" />
                  اتصال بالمستأجر
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            لم يتم العثور على طلبات صيانة
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all" || filterPriority !== "all"
              ? "جرب تعديل معايير البحث أو التصفية"
              : "لم يتم تقديم طلبات صيانة بعد"}
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إنشاء طلب
          </Button>
        </div>
      )}
    </div>
  );
}
