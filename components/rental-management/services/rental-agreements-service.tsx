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
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Calendar,
  DollarSign,
  Building2,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface RentalAgreement {
  id: string;
  contractNumber: string;
  propertyId: string;
  propertyTitle: string;
  propertyTitleAr: string;
  propertyAddress: string;
  propertyAddressAr: string;
  tenant: {
    name: string;
    nameAr: string;
    email: string;
    phone: string;
    nationalId: string;
    nationality: string;
    nationalityAr: string;
  };
  landlord: {
    name: string;
    nameAr: string;
    email: string;
    phone: string;
    nationalId: string;
  };
  contractDetails: {
    startDate: string;
    startDateHijri: string;
    endDate: string;
    endDateHijri: string;
    duration: number;
    durationUnit: string;
    durationUnitAr: string;
    monthlyRent: number;
    securityDeposit: number;
    brokerageCommission: number;
    renewalOption: boolean;
    renewalOptionAr: string;
  };
  paymentTerms: {
    paymentMethod: string;
    paymentMethodAr: string;
    paymentFrequency: string;
    paymentFrequencyAr: string;
    dueDate: number;
    lateFee: number;
    gracePeriod: number;
  };
  status: "draft" | "active" | "expired" | "terminated" | "renewed";
  statusAr: string;
  signedDate: string;
  signedDateHijri: string;
  documents: Array<{
    type: string;
    typeAr: string;
    url: string;
    uploadedDate: string;
  }>;
  terms: string[];
  termsAr: string[];
  notes: string;
  notesAr: string;
  createdBy: string;
  createdByAr: string;
}

export function RentalAgreementsService() {
  const [agreements, setAgreements] = useState<RentalAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAgreement, setSelectedAgreement] =
    useState<RentalAgreement | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const userData = useAuthStore(selectUserData);

  // Available approved rental requests for creating contracts
  const approvedRequests = [
    {
      id: "1",
      applicantName: "أحمد الراشد",
      propertyTitle: "شقة فاخرة في حي العليا",
      rent: 4500,
    },
    {
      id: "2",
      applicantName: "سارة المنصوري",
      propertyTitle: "فيلا واسعة في جدة",
      rent: 8500,
    },
    {
      id: "3",
      applicantName: "خالد الحربي",
      propertyTitle: "استوديو حديث في الدمام",
      rent: 2200,
    },
  ];

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
          contractNumber: "RC-2024-001",
          propertyId: "1",
          propertyTitle: "Luxury Apartment in Al-Olaya",
          propertyTitleAr: "شقة فاخرة في حي العليا",
          propertyAddress: "King Fahd Road, Al-Olaya District",
          propertyAddressAr: "طريق الملك فهد، حي العليا",
          tenant: {
            name: "Ahmed Al-Rashid",
            nameAr: "أحمد الراشد",
            email: "ahmed.rashid@email.com",
            phone: "+966 50 123 4567",
            nationalId: "1234567890",
            nationality: "Saudi",
            nationalityAr: "سعودي",
          },
          landlord: {
            name: "Abdullah Al-Saud",
            nameAr: "عبدالله آل سعود",
            email: "abdullah@email.com",
            phone: "+966 50 123 4567",
            nationalId: "9876543210",
          },
          contractDetails: {
            startDate: "2024-02-01",
            startDateHijri: "1446/08/01",
            endDate: "2025-02-01",
            endDateHijri: "1447/08/01",
            duration: 12,
            durationUnit: "months",
            durationUnitAr: "شهر",
            monthlyRent: 4500,
            securityDeposit: 9000,
            brokerageCommission: 2250,
            renewalOption: true,
            renewalOptionAr: "قابل للتجديد",
          },
          paymentTerms: {
            paymentMethod: "bank_transfer",
            paymentMethodAr: "تحويل بنكي",
            paymentFrequency: "monthly",
            paymentFrequencyAr: "شهري",
            dueDate: 1,
            lateFee: 100,
            gracePeriod: 5,
          },
          status: "active",
          statusAr: "نشط",
          signedDate: "2024-01-20",
          signedDateHijri: "1446/07/20",
          documents: [
            {
              type: "Signed Contract",
              typeAr: "العقد الموقع",
              url: "/contracts/RC-2024-001.pdf",
              uploadedDate: "2024-01-20",
            },
            {
              type: "Tenant ID Copy",
              typeAr: "صورة هوية المستأجر",
              url: "/docs/tenant-id-001.pdf",
              uploadedDate: "2024-01-20",
            },
          ],
          terms: [
            "Monthly rent payment due on 1st of each month",
            "Security deposit refundable upon contract termination",
            "Tenant responsible for utilities",
            "No pets allowed",
            "Property inspection allowed with 24-hour notice",
          ],
          termsAr: [
            "دفع الإيجار الشهري في اليوم الأول من كل شهر",
            "مبلغ التأمين قابل للاسترداد عند انتهاء العقد",
            "المستأجر مسؤول عن فواتير الخدمات",
            "لا يُسمح بالحيوانات الأليفة",
            "يُسمح بتفتيش العقار بإشعار مسبق 24 ساعة",
          ],
          notes: "Excellent tenant with stable income",
          notesAr: "مستأجر ممتاز بدخل مستقر",
          createdBy: "Property Manager",
          createdByAr: "مدير العقارات",
        },
        {
          id: "2",
          contractNumber: "RC-2024-002",
          propertyId: "2",
          propertyTitle: "Spacious Villa in Jeddah",
          propertyTitleAr: "فيلا واسعة في جدة",
          propertyAddress: "Prince Mohammed Bin Abdulaziz Road",
          propertyAddressAr: "طريق الأمير محمد بن عبدالعزيز",
          tenant: {
            name: "Sarah Al-Mansouri",
            nameAr: "سارة المنصوري",
            email: "sarah.mansouri@email.com",
            phone: "+966 56 345 6789",
            nationalId: "2345678901",
            nationality: "Emirati",
            nationalityAr: "إماراتي",
          },
          landlord: {
            name: "Fahad Al-Otaibi",
            nameAr: "فهد العتيبي",
            email: "fahad@email.com",
            phone: "+966 56 789 0123",
            nationalId: "8765432109",
          },
          contractDetails: {
            startDate: "2024-02-15",
            startDateHijri: "1446/08/15",
            endDate: "2026-02-15",
            endDateHijri: "1448/08/15",
            duration: 24,
            durationUnit: "months",
            durationUnitAr: "شهر",
            monthlyRent: 8500,
            securityDeposit: 17000,
            brokerageCommission: 4250,
            renewalOption: true,
            renewalOptionAr: "قابل للتجديد",
          },
          paymentTerms: {
            paymentMethod: "bank_transfer",
            paymentMethodAr: "تحويل بنكي",
            paymentFrequency: "monthly",
            paymentFrequencyAr: "شهري",
            dueDate: 5,
            lateFee: 200,
            gracePeriod: 7,
          },
          status: "active",
          statusAr: "نشط",
          signedDate: "2024-02-10",
          signedDateHijri: "1446/08/10",
          documents: [
            {
              type: "Signed Contract",
              typeAr: "العقد الموقع",
              url: "/contracts/RC-2024-002.pdf",
              uploadedDate: "2024-02-10",
            },
          ],
          terms: [
            "Monthly rent payment due on 5th of each month",
            "Tenant responsible for garden maintenance",
            "Pool maintenance included in rent",
            "Annual rent increase of 5%",
          ],
          termsAr: [
            "دفع الإيجار الشهري في اليوم الخامس من كل شهر",
            "المستأجر مسؤول عن صيانة الحديقة",
            "صيانة المسبح مشمولة في الإيجار",
            "زيادة سنوية في الإيجار بنسبة 5%",
          ],
          notes: "Long-term tenant, excellent payment history",
          notesAr: "مستأجر طويل الأمد، سجل دفع ممتاز",
          createdBy: "Property Manager",
          createdByAr: "مدير العقارات",
        },
        {
          id: "3",
          contractNumber: "RC-2024-003",
          propertyId: "3",
          propertyTitle: "Modern Studio in Dammam",
          propertyTitleAr: "استوديو حديث في الدمام",
          propertyAddress: "King Saud Road, Al-Faisaliyah",
          propertyAddressAr: "طريق الملك سعود، الفيصلية",
          tenant: {
            name: "Khalid Al-Harbi",
            nameAr: "خالد الحربي",
            email: "khalid.harbi@email.com",
            phone: "+966 54 456 7890",
            nationalId: "3456789012",
            nationality: "Saudi",
            nationalityAr: "سعودي",
          },
          landlord: {
            name: "Nasser Al-Qahtani",
            nameAr: "ناصر القحطاني",
            email: "nasser@email.com",
            phone: "+966 54 456 7890",
            nationalId: "7654321098",
          },
          contractDetails: {
            startDate: "2024-03-01",
            startDateHijri: "1446/09/01",
            endDate: "2024-09-01",
            endDateHijri: "1447/03/01",
            duration: 6,
            durationUnit: "months",
            durationUnitAr: "شهر",
            monthlyRent: 2200,
            securityDeposit: 4400,
            brokerageCommission: 1100,
            renewalOption: true,
            renewalOptionAr: "قابل للتجديد",
          },
          paymentTerms: {
            paymentMethod: "cash",
            paymentMethodAr: "نقداً",
            paymentFrequency: "monthly",
            paymentFrequencyAr: "شهري",
            dueDate: 1,
            lateFee: 50,
            gracePeriod: 3,
          },
          status: "draft",
          statusAr: "مسودة",
          signedDate: "",
          signedDateHijri: "",
          documents: [],
          terms: [
            "Short-term rental agreement",
            "Furnished studio apartment",
            "Internet and utilities included",
          ],
          termsAr: [
            "عقد إيجار قصير الأمد",
            "شقة استوديو مفروشة",
            "الإنترنت والخدمات مشمولة",
          ],
          notes: "Temporary accommodation for work assignment",
          notesAr: "إقامة مؤقتة لمهمة عمل",
          createdBy: "Property Manager",
          createdByAr: "مدير العقارات",
        },
      ]);
      setLoading(false);
    };

    fetchAgreements();
  }, [userData?.token]);

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch =
      agreement.tenant.nameAr
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      agreement.propertyTitleAr
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      agreement.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || agreement.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "terminated":
        return "bg-orange-100 text-orange-800";
      case "renewed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Edit className="h-4 w-4" />;
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "expired":
        return <AlertTriangle className="h-4 w-4" />;
      case "terminated":
        return <AlertTriangle className="h-4 w-4" />;
      case "renewed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
          <h2 className="text-2xl font-bold">طلبات الإيجار</h2>
          <p className="text-muted-foreground">
            إدارة طلبات الإيجار النشطة والمنتهية
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
              <DialogTitle>إنشاء عقد إيجار جديد</DialogTitle>
              <DialogDescription>
                إنشاء عقد إيجار من طلب موافق عليه
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="approved-request">الطلب الموافق عليه</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الطلب الموافق عليه" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedRequests.map((request) => (
                      <SelectItem key={request.id} value={request.id}>
                        {request.applicantName} - {request.propertyTitle} (
                        {request.rent.toLocaleString()} ر.س/شهر)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contract-number">رقم العقد</Label>
                  <Input id="contract-number" placeholder="RC-2024-004" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">تاريخ بداية العقد</Label>
                  <Input id="start-date" type="date" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">مدة العقد</Label>
                  <div className="flex gap-2">
                    <Input
                      id="duration"
                      type="number"
                      placeholder="12"
                      className="flex-1"
                    />
                    <Select>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="شهر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="months">شهر</SelectItem>
                        <SelectItem value="years">سنة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="security-deposit">مبلغ التأمين (ر.س)</Label>
                  <Input
                    id="security-deposit"
                    type="number"
                    placeholder="9000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-method">طريقة الدفع</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                      <SelectItem value="cash">نقداً</SelectItem>
                      <SelectItem value="check">شيك</SelectItem>
                      <SelectItem value="online">دفع إلكتروني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">تاريخ استحقاق الدفع</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اليوم من الشهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(28)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="late-fee">رسوم التأخير (ر.س)</Label>
                  <Input id="late-fee" type="number" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grace-period">فترة السماح (أيام)</Label>
                  <Input id="grace-period" type="number" placeholder="5" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="renewal-option">خيار التجديد</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر خيار التجديد" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">قابل للتجديد</SelectItem>
                    <SelectItem value="no">غير قابل للتجديد</SelectItem>
                    <SelectItem value="negotiable">قابل للتفاوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-terms">شروط خاصة</Label>
                <Textarea
                  id="special-terms"
                  placeholder="أي شروط خاصة للعقد..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea id="notes" placeholder="ملاحظات إضافية..." rows={2} />
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

      {/* Search and Filter */}
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
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="expired">منتهي</SelectItem>
            <SelectItem value="terminated">منهي</SelectItem>
            <SelectItem value="renewed">مجدد</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agreements List */}
      <div className="space-y-4">
        {filteredAgreements.map((agreement) => {
          const daysUntilExpiry = getDaysUntilExpiry(
            agreement.contractDetails.endDate,
          );
          const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

          return (
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
                      {isExpiringSoon && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          <AlertTriangle className="h-3 w-3 ml-1" />
                          ينتهي خلال {daysUntilExpiry} يوم
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">المستأجر:</span>
                          <span>{agreement.tenant.nameAr}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">العقار:</span>
                          <span>{agreement.propertyTitleAr}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">الإيجار الشهري:</span>
                          <span className="font-bold text-green-600">
                            {agreement.contractDetails.monthlyRent.toLocaleString()}{" "}
                            ر.س
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">تاريخ البداية:</span>
                          <span>
                            {agreement.contractDetails.startDateHijri}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">تاريخ الانتهاء:</span>
                          <span>{agreement.contractDetails.endDateHijri}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">المدة:</span>
                          <span>
                            {agreement.contractDetails.duration}{" "}
                            {agreement.contractDetails.durationUnitAr}
                          </span>
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

                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className="text-sm text-muted-foreground text-right">
                      <div>
                        مبلغ التأمين:{" "}
                        {agreement.contractDetails.securityDeposit.toLocaleString()}{" "}
                        ر.س
                      </div>
                      <div>
                        إجمالي القيمة:{" "}
                        {(
                          agreement.contractDetails.monthlyRent *
                          agreement.contractDetails.duration
                        ).toLocaleString()}{" "}
                        ر.س
                      </div>
                    </div>
                    <div className="flex gap-2">
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
                        تحميل
                      </Button>
                      {agreement.status === "draft" && (
                        <Button size="sm">
                          <Edit className="h-3 w-3 ml-1" />
                          تعديل
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agreement Details Dialog */}
      <Dialog
        open={!!selectedAgreement}
        onOpenChange={() => setSelectedAgreement(null)}
      >
        <DialogContent
          className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto text-right"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="text-right" dir="rtl">
              تفاصيل طلب الإيجار
            </DialogTitle>
            <DialogDescription>
              عقد رقم {selectedAgreement?.contractNumber} -{" "}
              {selectedAgreement?.tenant.nameAr}
            </DialogDescription>
          </DialogHeader>
          {selectedAgreement && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">تفاصيل العقد</TabsTrigger>
                <TabsTrigger value="parties">الأطراف</TabsTrigger>
                <TabsTrigger value="terms">الشروط</TabsTrigger>
                <TabsTrigger value="documents">المستندات</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">معلومات العقد</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">رقم العقد</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.contractNumber}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الحالة</Label>
                        <Badge
                          className={getStatusColor(selectedAgreement.status)}
                        >
                          {selectedAgreement.statusAr}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          تاريخ البداية
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.contractDetails.startDateHijri}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          تاريخ الانتهاء
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.contractDetails.endDateHijri}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">مدة العقد</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.contractDetails.duration}{" "}
                          {selectedAgreement.contractDetails.durationUnitAr}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          خيار التجديد
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.contractDetails.renewalOptionAr}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">التفاصيل المالية</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">
                          الإيجار الشهري
                        </Label>
                        <p className="text-sm text-muted-foreground font-bold text-green-600">
                          {selectedAgreement.contractDetails.monthlyRent.toLocaleString()}{" "}
                          ر.س
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          مبلغ التأمين
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.contractDetails.securityDeposit.toLocaleString()}{" "}
                          ر.س
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          عمولة الوساطة
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.contractDetails.brokerageCommission.toLocaleString()}{" "}
                          ر.س
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          إجمالي القيمة
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {(
                            selectedAgreement.contractDetails.monthlyRent *
                            selectedAgreement.contractDetails.duration
                          ).toLocaleString()}{" "}
                          ر.س
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">شروط الدفع</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">طريقة الدفع</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.paymentTerms.paymentMethodAr}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">تكرار الدفع</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.paymentTerms.paymentFrequencyAr}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        تاريخ الاستحقاق
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        اليوم {selectedAgreement.paymentTerms.dueDate} من كل شهر
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        رسوم التأخير
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.paymentTerms.lateFee} ر.س
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="parties" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">معلومات المستأجر</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">
                          الاسم الكامل
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.tenant.nameAr}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          رقم الهوية
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.tenant.nationalId}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الجنسية</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.tenant.nationalityAr}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          رقم الهاتف
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.tenant.phone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          البريد الإلكتروني
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.tenant.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">معلومات المؤجر</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">
                          الاسم الكامل
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.landlord.nameAr}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          رقم الهوية
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.landlord.nationalId}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          رقم الهاتف
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.landlord.phone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          البريد الإلكتروني
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedAgreement.landlord.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">معلومات العقار</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">اسم العقار</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.propertyTitleAr}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">العنوان</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgreement.propertyAddressAr}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="terms" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">شروط وأحكام العقد</h4>
                  <div className="space-y-2">
                    {selectedAgreement.termsAr.map((term, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 space-x-reverse p-3 bg-muted rounded-md"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm">{term}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedAgreement.notesAr && (
                  <div>
                    <h4 className="font-semibold mb-2">ملاحظات إضافية</h4>
                    <div className="p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">
                        {selectedAgreement.notesAr}
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                {selectedAgreement.documents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedAgreement.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-sm font-medium">
                              {doc.typeAr}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              تم الرفع في: {doc.uploadedDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">مرفوع</Badge>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 ml-1" />
                            تحميل
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    لم يتم رفع مستندات بعد
                  </p>
                )}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedAgreement(null)}
            >
              إغلاق
            </Button>
            <Button variant="outline">
              <Download className="ml-2 h-4 w-4" />
              تحميل العقد
            </Button>
            {selectedAgreement?.status === "draft" && (
              <Button>
                <Edit className="ml-2 h-4 w-4" />
                تعديل العقد
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredAgreements.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">لم يتم العثور على عقود</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all"
              ? "جرب تعديل معايير البحث"
              : "لا توجد عقود إيجار حالياً"}
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
