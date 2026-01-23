"use client";

import { useState, useEffect } from "react";
import useStore from "@/context/Store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sparkles,
  TrendingUp,
  Users,
  Home,
  CheckCircle,
  ArrowRight,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Ruler,
  Star,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  Building,
  Target,
  Zap,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for customer requests
const customerRequests = [
  {
    id: 1,
    customerName: "أحمد محمد العلي",
    customerEmail: "ahmed.alali@email.com",
    customerPhone: "+966 50 123 4567",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    requestDate: "2023-11-12",
    status: "جديد",
    priority: "عالية",
    propertyType: "فيلا",
    location: "الرياض - العليا",
    budget: { min: 800000, max: 1200000 },
    bedrooms: { min: 4, max: 5 },
    bathrooms: { min: 3, max: 4 },
    size: { min: 300, max: 400 },
    features: ["حديقة", "مسبح", "موقف سيارات", "مجلس رجال"],
  },
  {
    id: 2,
    customerName: "فاطمة عبدالله السعد",
    customerEmail: "fatima.alsaad@email.com",
    customerPhone: "+966 55 987 6543",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    requestDate: "2023-11-11",
    status: "قيد المعالجة",
    priority: "متوسطة",
    propertyType: "شقة",
    location: "جدة - الروضة",
    budget: { min: 3000, max: 5000 },
    bedrooms: { min: 2, max: 3 },
    bathrooms: { min: 2, max: 2 },
    size: { min: 120, max: 150 },
    features: ["مفروشة", "قريبة من المدارس", "موقف سيارات"],
  },
  {
    id: 4,
    customerName: "نورا سعد الغامدي",
    customerEmail: "nora.alghamdi@email.com",
    customerPhone: "+966 54 234 5678",
    customerAvatar: "/placeholder.svg?height=40&width=40",
    requestDate: "2023-11-09",
    status: "جديد",
    priority: "عالية",
    propertyType: "دوبلكس",
    location: "الرياض - الملقا",
    budget: { min: 600000, max: 900000 },
    bedrooms: { min: 3, max: 4 },
    bathrooms: { min: 3, max: 3 },
    size: { min: 200, max: 250 },
    features: ["حديثة", "مطبخ مجهز", "شرفة"],
  },
];

// Mock data for properties
const properties = [
  {
    id: "1",
    title: "فيلا فاخرة في العليا",
    address: "طريق الملك فهد، حي العليا",
    city: "الرياض",
    district: "العليا",
    type: "فيلا",
    price: 950000,
    listingType: "للبيع",
    bedrooms: 5,
    bathrooms: 4,
    size: 350,
    features: ["حديقة", "مسبح", "موقف سيارات", "مجلس رجال", "مطبخ حديث"],
    thumbnail: "/luxury-villa.png",
    status: "published",
  },
  {
    id: "2",
    title: "فيلا عصرية مع حديقة واسعة",
    address: "شارع التخصصي، حي العليا",
    city: "الرياض",
    district: "العليا",
    type: "فيلا",
    price: 1100000,
    listingType: "للبيع",
    bedrooms: 4,
    bathrooms: 3,
    size: 380,
    features: ["حديقة", "مسبح", "موقف سيارات", "غرفة خادمة", "مجلس رجال"],
    thumbnail: "/modern-villa.png",
    status: "published",
  },
  {
    id: "3",
    title: "شقة مفروشة في الروضة",
    address: "شارع الأمير سلطان، حي الروضة",
    city: "جدة",
    district: "الروضة",
    type: "شقة",
    price: 4200,
    listingType: "للإيجار",
    bedrooms: 3,
    bathrooms: 2,
    size: 140,
    features: ["مفروشة", "قريبة من المدارس", "موقف سيارات", "مصعد", "أمن"],
    thumbnail: "/furnished-apartment.png",
    status: "published",
  },
  {
    id: "4",
    title: "شقة حديثة قريبة من المدارس",
    address: "طريق المدينة، حي الروضة",
    city: "جدة",
    district: "الروضة",
    type: "شقة",
    price: 3800,
    listingType: "للإيجار",
    bedrooms: 2,
    bathrooms: 2,
    size: 130,
    features: ["مفروشة", "قريبة من المدارس", "موقف سيارات", "شرفة"],
    thumbnail: "/modern-apartment-living.png",
    status: "published",
  },
  {
    id: "5",
    title: "دوبلكس فاخر في الملقا",
    address: "طريق الملك عبدالله، حي الملقا",
    city: "الرياض",
    district: "الملقا",
    type: "دوبلكس",
    price: 750000,
    listingType: "للبيع",
    bedrooms: 4,
    bathrooms: 3,
    size: 230,
    features: ["حديثة", "مطبخ مجهز", "شرفة", "موقف سيارات", "مصعد"],
    thumbnail: "/duplex-apartment.png",
    status: "published",
  },
  {
    id: "6",
    title: "دوبلكس حديث مع إطلالة",
    address: "شارع العروبة، حي الملقا",
    city: "الرياض",
    district: "الملقا",
    type: "دوبلكس",
    price: 820000,
    listingType: "للبيع",
    bedrooms: 3,
    bathrooms: 3,
    size: 210,
    features: ["حديثة", "مطبخ مجهز", "شرفة", "إطلالة جميلة"],
    thumbnail: "/modern-duplex.jpg",
    status: "published",
  },
];

// AI Matching Algorithm
function calculateMatchScore(request: any, property: any) {
  let score = 0;
  let maxScore = 0;
  const reasons = [];

  // Budget matching (weight: 25)
  maxScore += 25;
  if (
    property.price >= request.budget.min &&
    property.price <= request.budget.max
  ) {
    score += 25;
    reasons.push("السعر ضمن الميزانية المحددة");
  } else if (
    property.price < request.budget.max * 1.1 &&
    property.price > request.budget.min * 0.9
  ) {
    score += 15;
    reasons.push("السعر قريب من الميزانية");
  }

  // Property type matching (weight: 20)
  maxScore += 20;
  if (property.type === request.propertyType) {
    score += 20;
    reasons.push("نوع العقار مطابق تماماً");
  }

  // Location matching (weight: 15)
  maxScore += 15;
  const requestLocation = request.location.split(" - ");
  if (
    property.city === requestLocation[0] &&
    property.district === requestLocation[1]
  ) {
    score += 15;
    reasons.push("الموقع مطابق تماماً");
  } else if (property.city === requestLocation[0]) {
    score += 8;
    reasons.push("نفس المدينة");
  }

  // Bedrooms matching (weight: 15)
  maxScore += 15;
  if (
    property.bedrooms >= request.bedrooms.min &&
    property.bedrooms <= request.bedrooms.max
  ) {
    score += 15;
    reasons.push("عدد غرف النوم مناسب");
  } else if (Math.abs(property.bedrooms - request.bedrooms.min) <= 1) {
    score += 8;
    reasons.push("عدد غرف النوم قريب من المطلوب");
  }

  // Bathrooms matching (weight: 10)
  maxScore += 10;
  if (
    property.bathrooms >= request.bathrooms.min &&
    property.bathrooms <= request.bathrooms.max
  ) {
    score += 10;
    reasons.push("عدد الحمامات مناسب");
  }

  // Size matching (weight: 10)
  maxScore += 10;
  if (property.size >= request.size.min && property.size <= request.size.max) {
    score += 10;
    reasons.push("المساحة مناسبة");
  } else if (
    property.size >= request.size.min * 0.9 &&
    property.size <= request.size.max * 1.1
  ) {
    score += 5;
    reasons.push("المساحة قريبة من المطلوب");
  }

  // Features matching (weight: 5)
  maxScore += 5;
  const matchingFeatures = property.features.filter((f: string) =>
    request.features.some((rf: string) => f.includes(rf) || rf.includes(f)),
  );
  if (matchingFeatures.length > 0) {
    const featureScore = Math.min(
      5,
      (matchingFeatures.length / request.features.length) * 5,
    );
    score += featureScore;
    reasons.push(`${matchingFeatures.length} من المميزات المطلوبة متوفرة`);
  }

  const percentage = Math.round((score / maxScore) * 100);
  return { score: percentage, reasons, matchingFeatures };
}

export function AIMatchingPage() {
  const router = useRouter();
  const {
    matchingPage: {
      customers,
      loading,
      loadingProperties,
      matchingProperties,
      selectedCustomerId,
      matchDetails,
      loadingMatchDetails,
      searchTerm,
      statusFilter,
      priorityFilter,
      isCreatingCustomer,
      isUpdatingCustomer,
      isDeletingCustomer,
      deleteConfirmDialog,
      error,
    },
    fetchCustomers,
    fetchCustomerStats,
    fetchMatchingProperties,
    fetchMatchDetails,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    openDeleteConfirmDialog,
    closeDeleteConfirmDialog,
    clearError,
  } = useStore();

  // Fetch customers when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCustomers();
        await fetchCustomerStats();
      } catch (error) {
        console.error("Error loading matching data:", error);
      }
    };

    loadData();
  }, []);

  const [activeTab, setActiveTab] = useState("matching");
  const [selectedRequest, setSelectedRequest] = useState(customerRequests[0]);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [showMatchDialog, setShowMatchDialog] = useState(false);

  // Calculate matches for selected request
  const matches = properties
    .map((property) => ({
      property,
      ...calculateMatchScore(selectedRequest, property),
    }))
    .filter((match) => match.score >= 40) // Only show matches with 40% or higher
    .sort((a, b) => b.score - a.score);

  // Statistics
  const totalMatches = matches.length;
  const excellentMatches = matches.filter((m) => m.score >= 80).length;
  const goodMatches = matches.filter(
    (m) => m.score >= 60 && m.score < 80,
  ).length;
  const avgMatchScore =
    matches.length > 0
      ? Math.round(
          matches.reduce((sum, m) => sum + m.score, 0) / matches.length,
        )
      : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 60) return "text-blue-600 bg-blue-100 border-blue-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-gray-600 bg-gray-100 border-gray-200";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "مطابقة ممتازة";
    if (score >= 60) return "مطابقة جيدة";
    if (score >= 40) return "مطابقة مقبولة";
    return "مطابقة ضعيفة";
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  المطابقة الذكية بالذكاء الاصطناعي
                </h1>
                <p className="text-muted-foreground">
                  ربط طلبات العملاء تلقائياً مع العقارات المناسبة من المخزون
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => router.push("/dashboard/incomplete-requests")}
                  variant="outline"
                  className="gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  الطلبات الغير مكتملة
                </Button>
                <Badge variant="outline" className="gap-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  مدعوم بالذكاء الاصطناعي
                </Badge>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Customer Requests List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    طلبات العملاء
                  </CardTitle>
                  <CardDescription>اختر طلباً لعرض المطابقات</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="text-sm text-muted-foreground">
                        جاري التحميل...
                      </div>
                    </div>
                  ) : customers.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="text-sm text-muted-foreground">
                        لا توجد بيانات عملاء
                      </div>
                    </div>
                  ) : (
                    customers.map((customer: any) => (
                      <Card
                        key={customer.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedRequest?.id === customer.id
                            ? "ring-2 ring-purple-500"
                            : ""
                        }`}
                        onClick={async () => {
                          try {
                            // Convert customer data to match the expected format
                            const requestData = {
                              id: customer.id,
                              customerName: customer.name,
                              customerEmail: customer.email,
                              customerPhone: customer.phone,
                              customerAvatar:
                                customer.assignedAgent?.avatar ||
                                "/placeholder.svg",
                              requestDate: customer.createdAt,
                              status: customer.status,
                              priority: "متوسطة", // Default priority
                              propertyType: "عقار", // Default property type
                              location: "موقع غير محدد", // Default location
                              budget: { min: 0, max: 0 },
                              bedrooms: { min: 0, max: 0 },
                              bathrooms: { min: 0, max: 0 },
                              size: { min: 0, max: 0 },
                              features: [],
                            };
                            setSelectedRequest(requestData);

                            // Fetch matching properties for this customer using phone number
                            await fetchMatchingProperties(customer.phone);
                          } catch (error) {
                            console.error(
                              "Error fetching matching properties:",
                              error,
                            );
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={
                                  customer.assignedAgent?.avatar ||
                                  "/placeholder.svg"
                                }
                              />
                              <AvatarFallback>
                                {customer.name
                                  ?.split(" ")
                                  ?.slice(0, 2)
                                  ?.map((n: string) => n?.[0] || "")
                                  ?.join("") || "ع"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {customer.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Phone className="h-3 w-3" />
                                {customer.phone}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {customer.totalPurchases} طلب
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                {customer.matchingProperties} عقار مطابق
                              </div>
                              <Badge className="mt-2" variant="outline">
                                {customer.status === "active"
                                  ? "نشط"
                                  : "غير نشط"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Matching Results */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        العقارات المطابقة
                      </CardTitle>
                      <CardDescription>
                        {loadingProperties
                          ? "جاري البحث عن العقارات المطابقة..."
                          : `تم العثور على ${matchingProperties.length} عقار مطابق لـ ${selectedRequest?.customerName || "العميل"}`}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingProperties ? (
                    <div className="space-y-4">
                      {/* Skeleton Loading */}
                      {[1, 2, 3].map((index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative sm:w-48 h-48 sm:h-auto">
                              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                            </div>
                            <div className="flex-1 p-4">
                              <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                <div className="flex gap-2">
                                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : matchingProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        لا توجد مطابقات
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        لم يتم العثور على عقارات تطابق متطلبات هذا العميل
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {matchingProperties.map(
                        (property: any, index: number) => (
                          <Card
                            key={property.id}
                            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                            onClick={async () => {
                              try {
                                // Fetch match details using match_id
                                const matchDetails = await fetchMatchDetails(
                                  property.id,
                                );

                                // Set selected match with the fetched details
                                setSelectedMatch({
                                  property: matchDetails.property,
                                  score: matchDetails.match.matchingScore,
                                  reasons: matchDetails.match.matchExplanation,
                                  matchingFeatures:
                                    matchDetails.match.matchedCriteria,
                                  request: matchDetails.request,
                                });

                                setShowMatchDialog(true);
                              } catch (error) {
                                console.error(
                                  "Error fetching match details:",
                                  error,
                                );
                              }
                            }}
                          >
                            <div className="flex flex-col sm:flex-row">
                              <div className="relative sm:w-48 h-48 sm:h-auto">
                                <img
                                  src={property.thumbnail || "/placeholder.svg"}
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                                <Badge
                                  className={`absolute top-2 left-2 ${getScoreColor(property.matchingScore)}`}
                                >
                                  <Star className="h-3 w-3 ml-1" />
                                  {property.matchingScore}%
                                </Badge>
                                {index === 0 && (
                                  <Badge className="absolute top-2 right-2 bg-purple-600 text-white">
                                    <Sparkles className="h-3 w-3 ml-1" />
                                    الأفضل
                                  </Badge>
                                )}
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {property.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {property.address}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mb-3 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Bed className="h-4 w-4 text-muted-foreground" />
                                    <span>{property.bedrooms} غرف</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Bath className="h-4 w-4 text-muted-foreground" />
                                    <span>{property.bathrooms} حمام</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Ruler className="h-4 w-4 text-muted-foreground" />
                                    <span>{property.size} م²</span>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium">
                                      {getScoreLabel(property.matchingScore)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {property.matchingScore}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={property.matchingScore}
                                    className="h-2"
                                  />
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                  {property.matchedCriteria
                                    ?.slice(0, 3)
                                    .map((criteria: string, idx: number) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        <CheckCircle className="h-3 w-3 ml-1" />
                                        {criteria}
                                      </Badge>
                                    ))}
                                  {property.matchedCriteria?.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{property.matchedCriteria.length - 3}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                                    {property.price.toLocaleString()} ريال
                                    <span className="text-xs text-muted-foreground font-normal">
                                      {property.listingType}
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={async (e) => {
                                      e.stopPropagation(); // منع تنفيذ onClick للكارد
                                      try {
                                        // Fetch match details using match_id
                                        const matchDetails =
                                          await fetchMatchDetails(property.id);

                                        // Set selected match with the fetched details
                                        setSelectedMatch({
                                          property: matchDetails.property,
                                          score:
                                            matchDetails.match.matchingScore,
                                          reasons:
                                            matchDetails.match.matchExplanation,
                                          matchingFeatures:
                                            matchDetails.match.matchedCriteria,
                                          request: matchDetails.request,
                                        });

                                        setShowMatchDialog(true);
                                      } catch (error) {
                                        console.error(
                                          "Error fetching match details:",
                                          error,
                                        );
                                      }
                                    }}
                                  >
                                    <Eye className="ml-2 h-4 w-4" />
                                    عرض التفاصيل
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Match Detail Dialog */}
            <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                {selectedMatch && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        تفاصيل المطابقة
                      </DialogTitle>
                      <DialogDescription>
                        تحليل شامل لمدى توافق العقار مع متطلبات العميل
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Match Score */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            نسبة التوافق
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl font-bold">
                                  {selectedMatch?.score || 0}%
                                </span>
                                <Badge
                                  className={getScoreColor(
                                    selectedMatch?.score || 0,
                                  )}
                                >
                                  {getScoreLabel(selectedMatch?.score || 0)}
                                </Badge>
                              </div>
                              <Progress
                                value={selectedMatch?.score || 0}
                                className="h-3"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Property Details */}
                      <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Home className="h-5 w-5" />
                              تفاصيل العقار
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <img
                              src={
                                selectedMatch?.property?.thumbnail ||
                                selectedMatch?.property?.featuredImage ||
                                "/placeholder.svg"
                              }
                              alt={
                                selectedMatch?.property?.title ||
                                selectedMatch?.property?.name ||
                                "عقار"
                              }
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div>
                              <h3 className="font-semibold text-lg">
                                {selectedMatch?.property?.title ||
                                  selectedMatch?.property?.name ||
                                  "عقار غير محدد"}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {selectedMatch?.property?.address ||
                                  "موقع غير محدد"}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  النوع
                                </div>
                                <div className="font-medium">
                                  {selectedMatch?.property?.type ||
                                    selectedMatch?.property?.forRentOrSale ||
                                    "غير محدد"}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  السعر
                                </div>
                                <div className="font-medium text-green-600">
                                  {selectedMatch?.property?.price?.toLocaleString() ||
                                    selectedMatch?.property?.rentOrBuyAmount?.toLocaleString() ||
                                    "غير محدد"}{" "}
                                  ريال
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  غرف النوم
                                </div>
                                <div className="font-medium">
                                  {selectedMatch?.property?.bedrooms ||
                                    "غير محدد"}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  الحمامات
                                </div>
                                <div className="font-medium">
                                  {selectedMatch?.property?.bathrooms ||
                                    selectedMatch?.property?.baths ||
                                    "غير محدد"}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  المساحة
                                </div>
                                <div className="font-medium">
                                  {selectedMatch?.property?.size ||
                                    selectedMatch?.property?.area ||
                                    "غير محدد"}{" "}
                                  م²
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  الحالة
                                </div>
                                <div className="font-medium">
                                  {selectedMatch?.property?.listingType ||
                                    (selectedMatch?.property?.forRentOrSale ===
                                    "rent"
                                      ? "للإيجار"
                                      : "للبيع") ||
                                    "غير محدد"}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-2">
                                المميزات
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(
                                  selectedMatch?.property?.features ||
                                  selectedMatch?.property?.matchedCriteria ||
                                  []
                                ).map((feature: string, idx: number) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Users className="h-5 w-5" />
                              متطلبات العميل
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={
                                    selectedRequest.customerAvatar ||
                                    "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback>
                                  {selectedRequest.customerName
                                    .split(" ")
                                    .slice(0, 2)
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">
                                  {selectedMatch?.request?.fullName ||
                                    selectedRequest.customerName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {selectedMatch?.request?.phone ||
                                    selectedRequest.customerPhone}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  المنطقة
                                </div>
                                <div className="font-medium">
                                  {selectedMatch?.request?.region || "غير محدد"}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  نوع العقار
                                </div>
                                <div className="font-medium">
                                  {selectedMatch?.request?.propertyType ||
                                    "غير محدد"}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  المساحة المطلوبة
                                </div>
                                <div className="font-medium text-sm">
                                  {selectedMatch?.request?.areaFrom?.toLocaleString() ||
                                    "0"}{" "}
                                  -{" "}
                                  {selectedMatch?.request?.areaTo?.toLocaleString() ||
                                    "0"}{" "}
                                  م²
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  طريقة الشراء
                                </div>
                                <div className="font-medium">
                                  {selectedMatch?.request?.purchaseMethod ||
                                    "غير محدد"}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  الميزانية
                                </div>
                                <div className="font-medium text-sm">
                                  {selectedMatch?.request?.budgetFrom?.toLocaleString() ||
                                    "0"}{" "}
                                  -{" "}
                                  {selectedMatch?.request?.budgetTo?.toLocaleString() ||
                                    "0"}{" "}
                                  ريال
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  هدف الشراء
                                </div>
                                <div className="font-medium">
                                  {selectedMatch?.request?.purchaseGoal ||
                                    "غير محدد"}
                                </div>
                              </div>
                            </div>
                            {selectedMatch?.request?.notes && (
                              <div>
                                <div className="text-xs text-muted-foreground mb-2">
                                  ملاحظات
                                </div>
                                <div className="text-sm bg-gray-50 p-2 rounded-lg">
                                  {selectedMatch.request.notes}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Match Reasons */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            أسباب المطابقة
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            {(() => {
                              // Handle different data structures from API
                              let reasonsArray = [];

                              if (selectedMatch?.reasons) {
                                // If reasons is a string, split it or use as single item
                                if (typeof selectedMatch.reasons === "string") {
                                  reasonsArray = [selectedMatch.reasons];
                                } else if (
                                  Array.isArray(selectedMatch.reasons)
                                ) {
                                  reasonsArray = selectedMatch.reasons;
                                }
                              } else if (
                                selectedMatch?.matchingFeatures &&
                                Array.isArray(selectedMatch.matchingFeatures)
                              ) {
                                reasonsArray = selectedMatch.matchingFeatures;
                              }

                              return reasonsArray.map(
                                (reason: string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 p-2 bg-green-50 rounded-lg"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-sm">{reason}</span>
                                  </div>
                                ),
                              );
                            })()}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const phoneNumber =
                              selectedMatch?.request?.phone ||
                              selectedMatch?.property?.phone;
                            if (phoneNumber) {
                              // إضافة + إذا لم تكن موجودة
                              const formattedPhone = phoneNumber.startsWith("+")
                                ? phoneNumber
                                : `+${phoneNumber}`;
                              window.open(`tel:${formattedPhone}`, "_self");
                            } else {
                              console.error("رقم الهاتف غير متوفر");
                            }
                          }}
                        >
                          <Phone className="ml-2 h-4 w-4" />
                          اتصال بالعميل
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
    </div>
  );
}
