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
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Building2,
  DollarSign,
  User,
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface PurchaseAgreement {
  id: string;
  contractNumber: string;
  propertyDetails: {
    title: string;
    titleAr: string;
    type: string;
    typeAr: string;
    location: string;
    locationAr: string;
    area: number;
    bedrooms?: number;
    bathrooms?: number;
    features: string[];
    featuresAr: string[];
  };
  buyer: {
    name: string;
    nameAr: string;
    email: string;
    phone: string;
    nationalId: string;
  };
  seller: {
    name: string;
    nameAr: string;
    email: string;
    phone: string;
    nationalId: string;
  };
  financialDetails: {
    totalPrice: number;
    downPayment: number;
    remainingAmount: number;
    paymentSchedule: string;
    paymentScheduleAr: string;
    financingType: string;
    financingTypeAr: string;
  };
  contractDates: {
    signedDate: string;
    signedDateHijri: string;
    completionDate: string;
    completionDateHijri: string;
    handoverDate: string;
    handoverDateHijri: string;
  };
  status: "draft" | "signed" | "in_progress" | "completed" | "cancelled";
  statusAr: string;
  documents: {
    contract: boolean;
    titleDeed: boolean;
    inspection: boolean;
    financing: boolean;
    insurance: boolean;
  };
  notes: string;
  notesAr: string;
  createdDate: string;
  createdDateHijri: string;
}

export function PurchaseAgreementsService() {
  const [agreements, setAgreements] = useState<PurchaseAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAgreement, setSelectedAgreement] =
    useState<PurchaseAgreement | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const userData = useAuthStore(selectUserData);

  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchAgreements");
      return;
    }

    const fetchAgreements = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setAgreements([
        {
          id: "1",
          contractNumber: "PC-2024-001",
          propertyDetails: {
            title: "Luxury Villa in Al-Olaya",
            titleAr: "فيلا فاخرة في حي العليا",
            type: "villa",
            typeAr: "فيلا",
            location: "Riyadh - Al-Olaya District",
            locationAr: "الرياض - حي العليا",
            area: 500,
            bedrooms: 4,
            bathrooms: 3,
            features: ["Swimming Pool", "Garden", "Garage", "Maid Room"],
            featuresAr: ["مسبح", "حديقة", "مرآب", "غرفة خادمة"],
          },
          buyer: {
            name: "Ahmed Al-Rashid",
            nameAr: "أحمد الراشد",
            email: "ahmed.rashid@email.com",
            phone: "+966 50 123 4567",
            nationalId: "1234567890",
          },
          seller: {
            name: "Mohammed Al-Saud",
            nameAr: "محمد السعود",
            email: "mohammed.saud@email.com",
            phone: "+966 55 987 6543",
            nationalId: "9876543210",
          },
          financialDetails: {
            totalPrice: 2500000,
            downPayment: 500000,
            remainingAmount: 2000000,
            paymentSchedule: "monthly",
            paymentScheduleAr: "شهري",
            financingType: "mortgage",
            financingTypeAr: "تمويل عقاري",
          },
          contractDates: {
            signedDate: "2024-01-15",
            signedDateHijri: "1446/07/15",
            completionDate: "2024-03-15",
            completionDateHijri: "1446/09/15",
            handoverDate: "2024-03-20",
            handoverDateHijri: "1446/09/20",
          },
          status: "signed",
          statusAr: "موقع",
          documents: {
            contract: true,
            titleDeed: true,
            inspection: true,
            financing: false,
            insurance: false,
          },
          notes: "All documents verified, awaiting bank approval",
          notesAr: "تم التحقق من جميع الوثائق، في انتظار موافقة البنك",
          createdDate: "2024-01-10",
          createdDateHijri: "1446/07/10",
        },
        {
          id: "2",
          contractNumber: "PC-2024-002",
          propertyDetails: {
            title: "Modern Apartment in Jeddah",
            titleAr: "شقة عصرية في جدة",
            type: "apartment",
            typeAr: "شقة",
            location: "Jeddah - Al-Hamra District",
            locationAr: "جدة - حي الحمراء",
            area: 150,
            bedrooms: 2,
            bathrooms: 2,
            features: ["Sea View", "Balcony", "Parking", "Gym"],
            featuresAr: ["إطلالة بحرية", "شرفة", "موقف سيارة", "صالة رياضية"],
          },
          buyer: {
            name: "Sarah Al-Mansouri",
            nameAr: "سارة المنصوري",
            email: "sarah.mansouri@email.com",
            phone: "+966 56 345 6789",
            nationalId: "2345678901",
          },
          seller: {
            name: "Khalid Al-Otaibi",
            nameAr: "خالد العتيبي",
            email: "khalid.otaibi@email.com",
            phone: "+966 54 876 5432",
            nationalId: "8765432109",
          },
          financialDetails: {
            totalPrice: 1200000,
            downPayment: 300000,
            remainingAmount: 900000,
            paymentSchedule: "lump_sum",
            paymentScheduleAr: "دفعة واحدة",
            financingType: "cash",
            financingTypeAr: "نقداً",
          },
          contractDates: {
            signedDate: "2024-01-20",
            signedDateHijri: "1446/07/20",
            completionDate: "2024-02-20",
            completionDateHijri: "1446/08/20",
            handoverDate: "2024-02-25",
            handoverDateHijri: "1446/08/25",
          },
          status: "in_progress",
          statusAr: "قيد التنفيذ",
          documents: {
            contract: true,
            titleDeed: true,
            inspection: true,
            financing: true,
            insurance: true,
          },
          notes: "Payment completed, preparing for handover",
          notesAr: "تم إكمال الدفع، جاري التحضير للتسليم",
          createdDate: "2024-01-18",
          createdDateHijri: "1446/07/18",
        },
        {
          id: "3",
          contractNumber: "PC-2024-003",
          propertyDetails: {
            title: "Townhouse in Dammam",
            titleAr: "تاون هاوس في الدمام",
            type: "townhouse",
            typeAr: "تاون هاوس",
            location: "Dammam - Al-Faisaliyah",
            locationAr: "الدمام - الفيصلية",
            area: 280,
            bedrooms: 3,
            bathrooms: 2,
            features: ["Private Garden", "Storage", "Covered Parking"],
            featuresAr: ["حديقة خاصة", "مخزن", "موقف مغطى"],
          },
          buyer: {
            name: "Omar Al-Harbi",
            nameAr: "عمر الحربي",
            email: "omar.harbi@email.com",
            phone: "+966 53 456 7890",
            nationalId: "3456789012",
          },
          seller: {
            name: "Nora Al-Zahra",
            nameAr: "نورا الزهراء",
            email: "nora.zahra@email.com",
            phone: "+966 52 765 4321",
            nationalId: "7654321098",
          },
          financialDetails: {
            totalPrice: 1800000,
            downPayment: 360000,
            remainingAmount: 1440000,
            paymentSchedule: "quarterly",
            paymentScheduleAr: "ربع سنوي",
            financingType: "mixed",
            financingTypeAr: "مختلط",
          },
          contractDates: {
            signedDate: "2024-01-25",
            signedDateHijri: "1446/07/25",
            completionDate: "2024-04-25",
            completionDateHijri: "1446/10/25",
            handoverDate: "2024-05-01",
            handoverDateHijri: "1446/11/01",
          },
          status: "draft",
          statusAr: "مسودة",
          documents: {
            contract: false,
            titleDeed: true,
            inspection: false,
            financing: false,
            insurance: false,
          },
          notes: "Contract under review by legal team",
          notesAr: "العقد قيد المراجعة من قبل الفريق القانوني",
          createdDate: "2024-01-22",
          createdDateHijri: "1446/07/22",
        },
      ]);
      setLoading(false);
    };

    fetchAgreements();
  }, [userData?.token]);

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch =
      agreement.contractNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      agreement.buyer.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.propertyDetails.titleAr
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      agreement.propertyDetails.locationAr
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || agreement.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "signed":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4" />;
      case "signed":
        return <CheckCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentCompletionPercentage = (documents: any) => {
    const total = Object.keys(documents).length;
    const completed = Object.values(documents).filter(Boolean).length;
    return Math.round((completed / total) * 100);
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
          {[...Array(3)].map((_, i) => (
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
          <h2 className="text-2xl font-bold">إدارة عقود الشراء</h2>
          <p className="text-muted-foreground">
            إدارة ومتابعة عقود شراء العقارات
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إنشاء عقد جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إنشاء عقد شراء جديد</DialogTitle>
              <DialogDescription>إنشاء عقد شراء عقار جديد</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer-name">اسم المشتري</Label>
                  <Input id="buyer-name" placeholder="أحمد الراشد" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seller-name">اسم البائع</Label>
                  <Input id="seller-name" placeholder="محمد السعود" />
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
                      <SelectItem value="land">أرض</SelectItem>
                      <SelectItem value="commercial">تجاري</SelectItem>
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
                  <Label htmlFor="total-price">السعر الإجمالي (ر.س)</Label>
                  <Input id="total-price" type="number" placeholder="2500000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="down-payment">المقدم (ر.س)</Label>
                  <Input id="down-payment" type="number" placeholder="500000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="completion-date">تاريخ الإنجاز</Label>
                  <Input id="completion-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="handover-date">تاريخ التسليم</Label>
                  <Input id="handover-date" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-notes">ملاحظات العقد</Label>
                <Textarea
                  id="contract-notes"
                  placeholder="أي ملاحظات أو شروط خاصة..."
                  rows={3}
                />
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
                إنشاء العقد
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
            placeholder="البحث في العقود..."
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
            <SelectItem value="draft">مسودة</SelectItem>
            <SelectItem value="signed">موقع</SelectItem>
            <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agreements List */}
      <div className="space-y-4">
        {filteredAgreements.map((agreement) => (
          <Card
            key={agreement.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <h3 className="font-semibold text-lg">
                      {agreement.contractNumber}
                    </h3>
                    <Badge className={getStatusColor(agreement.status)}>
                      {getStatusIcon(agreement.status)}
                      <span className="mr-1">{agreement.statusAr}</span>
                    </Badge>
                    <Badge variant="outline">
                      الوثائق:{" "}
                      {getDocumentCompletionPercentage(agreement.documents)}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">العقار:</span>
                        <span>{agreement.propertyDetails.titleAr}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{agreement.propertyDetails.locationAr}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">المشتري:</span>
                        <span>{agreement.buyer.nameAr}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">السعر:</span>
                        <span>
                          {agreement.financialDetails.totalPrice.toLocaleString()}{" "}
                          ر.س
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">تاريخ التوقيع:</span>
                        <span>{agreement.contractDates.signedDateHijri}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">تاريخ التسليم:</span>
                        <span>{agreement.contractDates.handoverDateHijri}</span>
                      </div>
                    </div>
                  </div>

                  {agreement.notesAr && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {agreement.notesAr}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedAgreement(agreement)}
                  >
                    <Eye className="h-3 w-3 ml-1" />
                    التفاصيل
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 ml-1" />
                    تحميل العقد
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agreement Details Dialog */}
      <Dialog
        open={!!selectedAgreement}
        onOpenChange={() => setSelectedAgreement(null)}
      >
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل عقد الشراء</DialogTitle>
            <DialogDescription>
              عقد رقم {selectedAgreement?.contractNumber} -{" "}
              {selectedAgreement?.propertyDetails.titleAr}
            </DialogDescription>
          </DialogHeader>
          {selectedAgreement && (
            <Tabs defaultValue="property" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="property">العقار</TabsTrigger>
                <TabsTrigger value="parties">الأطراف</TabsTrigger>
                <TabsTrigger value="financial">المالية</TabsTrigger>
                <TabsTrigger value="documents">الوثائق</TabsTrigger>
              </TabsList>

              <TabsContent value="property" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">عنوان العقار</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.propertyDetails.titleAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">نوع العقار</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.propertyDetails.typeAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">الموقع</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.propertyDetails.locationAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">المساحة</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.propertyDetails.area} م²
                    </p>
                  </div>
                  {selectedAgreement.propertyDetails.bedrooms && (
                    <div>
                      <Label className="text-sm font-medium">غرف النوم</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.propertyDetails.bedrooms}
                      </p>
                    </div>
                  )}
                  {selectedAgreement.propertyDetails.bathrooms && (
                    <div>
                      <Label className="text-sm font-medium">
                        دورات المياه
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.propertyDetails.bathrooms}
                      </p>
                    </div>
                  )}
                </div>
                {selectedAgreement.propertyDetails.featuresAr.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">المميزات</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedAgreement.propertyDetails.featuresAr.map(
                        (feature, index) => (
                          <Badge key={index} variant="outline">
                            {feature}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="parties" className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">معلومات المشتري</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">الاسم</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.buyer.nameAr}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">رقم الهوية</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.buyer.nationalId}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">الهاتف</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.buyer.phone}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        البريد الإلكتروني
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.buyer.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">معلومات البائع</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">الاسم</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.seller.nameAr}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">رقم الهوية</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.seller.nationalId}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">الهاتف</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.seller.phone}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        البريد الإلكتروني
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.seller.email}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      السعر الإجمالي
                    </Label>
                    <p className="text-sm text-muted-foreground font-bold text-green-600">
                      {selectedAgreement.financialDetails.totalPrice.toLocaleString()}{" "}
                      ر.س
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">المقدم</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.financialDetails.downPayment.toLocaleString()}{" "}
                      ر.س
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      المبلغ المتبقي
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.financialDetails.remainingAmount.toLocaleString()}{" "}
                      ر.س
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">نوع التمويل</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.financialDetails.financingTypeAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">جدولة الدفع</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.financialDetails.paymentScheduleAr}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">تاريخ التوقيع</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.contractDates.signedDateHijri}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">تاريخ الإنجاز</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.contractDates.completionDateHijri}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">تاريخ التسليم</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedAgreement.contractDates.handoverDateHijri}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <span className="text-sm font-medium">عقد الشراء</span>
                    <Badge
                      className={
                        selectedAgreement.documents.contract
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedAgreement.documents.contract ? "مكتمل" : "مفقود"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <span className="text-sm font-medium">صك الملكية</span>
                    <Badge
                      className={
                        selectedAgreement.documents.titleDeed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedAgreement.documents.titleDeed
                        ? "مكتمل"
                        : "مفقود"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <span className="text-sm font-medium">تقرير المعاينة</span>
                    <Badge
                      className={
                        selectedAgreement.documents.inspection
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedAgreement.documents.inspection
                        ? "مكتمل"
                        : "مفقود"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <span className="text-sm font-medium">وثائق التمويل</span>
                    <Badge
                      className={
                        selectedAgreement.documents.financing
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedAgreement.documents.financing
                        ? "مكتمل"
                        : "مفقود"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <span className="text-sm font-medium">وثيقة التأمين</span>
                    <Badge
                      className={
                        selectedAgreement.documents.insurance
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedAgreement.documents.insurance
                        ? "مكتمل"
                        : "مفقود"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    نسبة اكتمال الوثائق:{" "}
                    {getDocumentCompletionPercentage(
                      selectedAgreement.documents,
                    )}
                    %
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {filteredAgreements.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">لم يتم العثور على عقود</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all"
              ? "جرب تعديل معايير البحث"
              : "لا توجد عقود شراء مسجلة حالياً"}
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إنشاء عقد جديد
          </Button>
        </div>
      )}
    </div>
  );
}
