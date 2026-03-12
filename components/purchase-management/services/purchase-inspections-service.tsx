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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Building2,
  User,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Phone,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface PropertyInspection {
  id: string;
  inspectionNumber: string;
  propertyDetails: {
    title: string;
    titleAr: string;
    type: string;
    typeAr: string;
    location: string;
    locationAr: string;
    area: number;
    price: number;
  };
  client: {
    name: string;
    nameAr: string;
    email: string;
    phone: string;
    type: "buyer" | "investor";
    typeAr: string;
  };
  inspector: {
    name: string;
    nameAr: string;
    phone: string;
    specialization: string;
    specializationAr: string;
  };
  scheduledDate: string;
  scheduledDateHijri: string;
  scheduledTime: string;
  status:
    | "scheduled"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "rescheduled";
  statusAr: string;
  inspectionType: "initial" | "detailed" | "final" | "follow_up";
  inspectionTypeAr: string;
  findings?: {
    overallCondition: string;
    overallConditionAr: string;
    structuralIssues: string[];
    structuralIssuesAr: string[];
    recommendations: string;
    recommendationsAr: string;
    estimatedRepairCost?: number;
  };
  notes: string;
  notesAr: string;
  createdDate: string;
  createdDateHijri: string;
}

export function PurchaseInspectionsService() {
  const [inspections, setInspections] = useState<PropertyInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const userData = useAuthStore(selectUserData);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedInspection, setSelectedInspection] =
    useState<PropertyInspection | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchInspections");
      return;
    }

    const fetchInspections = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setInspections([
        {
          id: "1",
          inspectionNumber: "INS-2024-001",
          propertyDetails: {
            title: "Luxury Villa in Al-Olaya",
            titleAr: "فيلا فاخرة في حي العليا",
            type: "villa",
            typeAr: "فيلا",
            location: "Riyadh - Al-Olaya District",
            locationAr: "الرياض - حي العليا",
            area: 500,
            price: 2500000,
          },
          client: {
            name: "Ahmed Al-Rashid",
            nameAr: "أحمد الراشد",
            email: "ahmed.rashid@email.com",
            phone: "+966 50 123 4567",
            type: "buyer",
            typeAr: "مشتري",
          },
          inspector: {
            name: "Eng. Mohammed Al-Saud",
            nameAr: "م. محمد السعود",
            phone: "+966 55 987 6543",
            specialization: "Structural Engineering",
            specializationAr: "هندسة إنشائية",
          },
          scheduledDate: "2024-01-20",
          scheduledDateHijri: "1446/07/20",
          scheduledTime: "10:00 AM",
          status: "scheduled",
          statusAr: "مجدولة",
          inspectionType: "initial",
          inspectionTypeAr: "معاينة أولية",
          notes: "Client interested in purchasing, needs thorough inspection",
          notesAr: "العميل مهتم بالشراء، يحتاج معاينة شاملة",
          createdDate: "2024-01-15",
          createdDateHijri: "1446/07/15",
        },
        {
          id: "2",
          inspectionNumber: "INS-2024-002",
          propertyDetails: {
            title: "Modern Apartment in Jeddah",
            titleAr: "شقة عصرية في جدة",
            type: "apartment",
            typeAr: "شقة",
            location: "Jeddah - Al-Hamra District",
            locationAr: "جدة - حي الحمراء",
            area: 150,
            price: 1200000,
          },
          client: {
            name: "Sarah Al-Mansouri",
            nameAr: "سارة المنصوري",
            email: "sarah.mansouri@email.com",
            phone: "+966 56 345 6789",
            type: "investor",
            typeAr: "مستثمر",
          },
          inspector: {
            name: "Eng. Khalid Al-Otaibi",
            nameAr: "م. خالد العتيبي",
            phone: "+966 54 876 5432",
            specialization: "Building Systems",
            specializationAr: "أنظمة المباني",
          },
          scheduledDate: "2024-01-18",
          scheduledDateHijri: "1446/07/18",
          scheduledTime: "2:00 PM",
          status: "completed",
          statusAr: "مكتملة",
          inspectionType: "detailed",
          inspectionTypeAr: "معاينة تفصيلية",
          findings: {
            overallCondition: "Good",
            overallConditionAr: "جيدة",
            structuralIssues: [
              "Minor wall cracks",
              "Outdated electrical outlets",
            ],
            structuralIssuesAr: [
              "شقوق طفيفة في الجدران",
              "مقابس كهربائية قديمة",
            ],
            recommendations:
              "Property is in good condition with minor repairs needed",
            recommendationsAr: "العقار في حالة جيدة مع الحاجة لإصلاحات طفيفة",
            estimatedRepairCost: 15000,
          },
          notes: "Investment property inspection completed successfully",
          notesAr: "تم إكمال معاينة العقار الاستثماري بنجاح",
          createdDate: "2024-01-16",
          createdDateHijri: "1446/07/16",
        },
        {
          id: "3",
          inspectionNumber: "INS-2024-003",
          propertyDetails: {
            title: "Townhouse in Dammam",
            titleAr: "تاون هاوس في الدمام",
            type: "townhouse",
            typeAr: "تاون هاوس",
            location: "Dammam - Al-Faisaliyah",
            locationAr: "الدمام - الفيصلية",
            area: 280,
            price: 1800000,
          },
          client: {
            name: "Omar Al-Harbi",
            nameAr: "عمر الحربي",
            email: "omar.harbi@email.com",
            phone: "+966 53 456 7890",
            type: "buyer",
            typeAr: "مشتري",
          },
          inspector: {
            name: "Eng. Nora Al-Zahra",
            nameAr: "م. نورا الزهراء",
            phone: "+966 52 765 4321",
            specialization: "Architecture",
            specializationAr: "عمارة",
          },
          scheduledDate: "2024-01-22",
          scheduledDateHijri: "1446/07/22",
          scheduledTime: "11:30 AM",
          status: "in_progress",
          statusAr: "قيد التنفيذ",
          inspectionType: "initial",
          inspectionTypeAr: "معاينة أولية",
          notes: "Family looking for their first home",
          notesAr: "عائلة تبحث عن منزلها الأول",
          createdDate: "2024-01-19",
          createdDateHijri: "1446/07/19",
        },
        {
          id: "4",
          inspectionNumber: "INS-2024-004",
          propertyDetails: {
            title: "Commercial Building in Riyadh",
            titleAr: "عمارة تجاري في الرياض",
            type: "commercial",
            typeAr: "تجاري",
            location: "Riyadh - King Fahd Road",
            locationAr: "الرياض - طريق الملك فهد",
            area: 800,
            price: 5000000,
          },
          client: {
            name: "Al-Rashid Investment Group",
            nameAr: "مجموعة الراشد للاستثمار",
            email: "info@rashid-group.com",
            phone: "+966 11 234 5678",
            type: "investor",
            typeAr: "مستثمر",
          },
          inspector: {
            name: "Eng. Fahad Al-Saud",
            nameAr: "م. فهد السعود",
            phone: "+966 50 987 1234",
            specialization: "Commercial Properties",
            specializationAr: "عقارات تجارية",
          },
          scheduledDate: "2024-01-25",
          scheduledDateHijri: "1446/07/25",
          scheduledTime: "9:00 AM",
          status: "rescheduled",
          statusAr: "معاد جدولتها",
          inspectionType: "detailed",
          inspectionTypeAr: "معاينة تفصيلية",
          notes: "Rescheduled due to client availability",
          notesAr: "تم إعادة الجدولة بسبب توفر العميل",
          createdDate: "2024-01-20",
          createdDateHijri: "1446/07/20",
        },
      ]);
      setLoading(false);
    };

    fetchInspections();
  }, [userData?.token]);

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      inspection.client.nameAr
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inspection.propertyDetails.titleAr
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inspection.inspectionNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inspection.propertyDetails.locationAr
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || inspection.status === filterStatus;
    const matchesType =
      filterType === "all" || inspection.inspectionType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Calendar className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />;
      case "rescheduled":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "initial":
        return "bg-blue-100 text-blue-800";
      case "detailed":
        return "bg-purple-100 text-purple-800";
      case "final":
        return "bg-green-100 text-green-800";
      case "follow_up":
        return "bg-orange-100 text-orange-800";
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
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
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
          <h2 className="text-2xl font-bold">إدارة معاينات العقارات</h2>
          <p className="text-muted-foreground">
            جدولة ومتابعة معاينات العقارات للعملاء
          </p>
        </div>
        <Dialog
          open={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              جدولة معاينة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>جدولة معاينة عقار</DialogTitle>
              <DialogDescription>
                جدولة معاينة عقار جديدة للعميل
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">اسم العميل</Label>
                  <Input id="client-name" placeholder="أحمد الراشد" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-phone">رقم الهاتف</Label>
                  <Input id="client-phone" placeholder="+966 50 123 4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-title">عنوان العقار</Label>
                <Input
                  id="property-title"
                  placeholder="فيلا فاخرة في حي العليا"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-type">نوع العقار</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="villa">فيلا</SelectItem>
                      <SelectItem value="apartment">شقة</SelectItem>
                      <SelectItem value="townhouse">تاون هاوس</SelectItem>
                      <SelectItem value="commercial">تجاري</SelectItem>
                      <SelectItem value="land">أرض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property-area">المساحة (م²)</Label>
                  <Input id="property-area" type="number" placeholder="500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-location">موقع العقار</Label>
                <Input
                  id="property-location"
                  placeholder="الرياض - حي العليا"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inspection-date">تاريخ المعاينة</Label>
                  <Input id="inspection-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspection-time">وقت المعاينة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوقت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 صباحاً</SelectItem>
                      <SelectItem value="10:00">10:00 صباحاً</SelectItem>
                      <SelectItem value="11:00">11:00 صباحاً</SelectItem>
                      <SelectItem value="14:00">2:00 مساءً</SelectItem>
                      <SelectItem value="15:00">3:00 مساءً</SelectItem>
                      <SelectItem value="16:00">4:00 مساءً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inspection-type">نوع المعاينة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">معاينة أولية</SelectItem>
                      <SelectItem value="detailed">معاينة تفصيلية</SelectItem>
                      <SelectItem value="final">معاينة نهائية</SelectItem>
                      <SelectItem value="follow_up">معاينة متابعة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspector">المهندس المعاين</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المهندس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mohammed-saud">
                        م. محمد السعود - هندسة إنشائية
                      </SelectItem>
                      <SelectItem value="khalid-otaibi">
                        م. خالد العتيبي - أنظمة المباني
                      </SelectItem>
                      <SelectItem value="nora-zahra">
                        م. نورا الزهراء - عمارة
                      </SelectItem>
                      <SelectItem value="fahad-saud">
                        م. فهد السعود - عقارات تجارية
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspection-notes">ملاحظات المعاينة</Label>
                <Textarea
                  id="inspection-notes"
                  placeholder="أي ملاحظات أو متطلبات خاصة..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsScheduleDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button onClick={() => setIsScheduleDialogOpen(false)}>
                جدولة المعاينة
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
            placeholder="البحث في المعاينات..."
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
            <SelectItem value="scheduled">مجدولة</SelectItem>
            <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
            <SelectItem value="completed">مكتملة</SelectItem>
            <SelectItem value="cancelled">ملغية</SelectItem>
            <SelectItem value="rescheduled">معاد جدولتها</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="نوع المعاينة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="initial">معاينة أولية</SelectItem>
            <SelectItem value="detailed">معاينة تفصيلية</SelectItem>
            <SelectItem value="final">معاينة نهائية</SelectItem>
            <SelectItem value="follow_up">معاينة متابعة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inspections List */}
      <div className="space-y-4">
        {filteredInspections.map((inspection) => (
          <Card
            key={inspection.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <h3 className="font-semibold text-lg">
                      {inspection.inspectionNumber}
                    </h3>
                    <Badge className={getStatusColor(inspection.status)}>
                      {getStatusIcon(inspection.status)}
                      <span className="mr-1">{inspection.statusAr}</span>
                    </Badge>
                    <Badge className={getTypeColor(inspection.inspectionType)}>
                      {inspection.inspectionTypeAr}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">العقار:</span>
                        <span>{inspection.propertyDetails.titleAr}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{inspection.propertyDetails.locationAr}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">العميل:</span>
                        <span>{inspection.client.nameAr}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">التاريخ:</span>
                        <span>{inspection.scheduledDateHijri}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">الوقت:</span>
                        <span>{inspection.scheduledTime}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">المهندس:</span>
                        <span>{inspection.inspector.nameAr}</span>
                      </div>
                    </div>
                  </div>

                  {inspection.findings && (
                    <div className="p-3 bg-green-50 rounded-md">
                      <p className="text-sm font-medium text-green-800 mb-1">
                        نتائج المعاينة:
                      </p>
                      <p className="text-sm text-green-700">
                        {inspection.findings.recommendationsAr}
                      </p>
                      {inspection.findings.estimatedRepairCost && (
                        <p className="text-sm text-green-600 mt-1">
                          تكلفة الإصلاحات المقدرة:{" "}
                          {inspection.findings.estimatedRepairCost.toLocaleString()}{" "}
                          ر.س
                        </p>
                      )}
                    </div>
                  )}

                  {inspection.notesAr && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {inspection.notesAr}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedInspection(inspection)}
                  >
                    <Eye className="h-3 w-3 ml-1" />
                    التفاصيل
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

      {/* Inspection Details Dialog */}
      <Dialog
        open={!!selectedInspection}
        onOpenChange={() => setSelectedInspection(null)}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل المعاينة</DialogTitle>
            <DialogDescription>
              معاينة رقم {selectedInspection?.inspectionNumber} -{" "}
              {selectedInspection?.propertyDetails.titleAr}
            </DialogDescription>
          </DialogHeader>
          {selectedInspection && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">التفاصيل</TabsTrigger>
                <TabsTrigger value="property">العقار</TabsTrigger>
                <TabsTrigger value="client">العميل</TabsTrigger>
                <TabsTrigger value="findings">النتائج</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">رقم المعاينة</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.inspectionNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">نوع المعاينة</Label>
                    <Badge
                      className={getTypeColor(
                        selectedInspection.inspectionType,
                      )}
                    >
                      {selectedInspection.inspectionTypeAr}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      التاريخ المجدول
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.scheduledDateHijri}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">الوقت المجدول</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.scheduledTime}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">الحالة</Label>
                    <Badge
                      className={getStatusColor(selectedInspection.status)}
                    >
                      {selectedInspection.statusAr}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      المهندس المعاين
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.inspector.nameAr}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">التخصص</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.inspector.specializationAr}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="property" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">عنوان العقار</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.propertyDetails.titleAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">نوع العقار</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.propertyDetails.typeAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">الموقع</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.propertyDetails.locationAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">المساحة</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.propertyDetails.area} م²
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">السعر</Label>
                    <p className="text-sm text-muted-foreground font-bold text-green-600">
                      {selectedInspection.propertyDetails.price.toLocaleString()}{" "}
                      ر.س
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="client" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">اسم العميل</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.client.nameAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">نوع العميل</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.client.typeAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">رقم الهاتف</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.client.phone}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      البريد الإلكتروني
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedInspection.client.email}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="findings" className="space-y-4">
                {selectedInspection.findings ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">
                        الحالة العامة
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedInspection.findings.overallConditionAr}
                      </p>
                    </div>
                    {selectedInspection.findings.structuralIssuesAr.length >
                      0 && (
                      <div>
                        <Label className="text-sm font-medium">
                          المشاكل المكتشفة
                        </Label>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          {selectedInspection.findings.structuralIssuesAr.map(
                            (issue, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2 space-x-reverse"
                              >
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                                <span>{issue}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium">التوصيات</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedInspection.findings.recommendationsAr}
                      </p>
                    </div>
                    {selectedInspection.findings.estimatedRepairCost && (
                      <div>
                        <Label className="text-sm font-medium">
                          تكلفة الإصلاحات المقدرة
                        </Label>
                        <p className="text-sm text-muted-foreground font-bold text-orange-600">
                          {selectedInspection.findings.estimatedRepairCost.toLocaleString()}{" "}
                          ر.س
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      لم يتم إكمال المعاينة بعد
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {filteredInspections.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            لم يتم العثور على معاينات
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all" || filterType !== "all"
              ? "جرب تعديل معايير البحث"
              : "لا توجد معاينات مجدولة حالياً"}
          </p>
          <Button onClick={() => setIsScheduleDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            جدولة معاينة
          </Button>
        </div>
      )}
    </div>
  );
}
