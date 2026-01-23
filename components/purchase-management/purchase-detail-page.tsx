"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/context/Store";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  UserCheck,
} from "lucide-react";

interface PurchaseRequest {
  id: string;
  requestNumber: string;
  client: {
    name: string;
    email: string;
    phone: string;
    nationalId: string;
    rating: number;
    totalPurchases: number;
  };
  property: {
    title: string;
    type: string;
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
    location: string;
    developer: string;
    images: string[];
  };
  currentStage: "reservation" | "contract" | "completion" | "receiving";
  priority: "high" | "medium" | "low";
  progress: number;
  createdAt: string;
  assignedAgent: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  stages: {
    reservation: {
      status: "completed" | "in-progress" | "pending";
      completedAt?: string;
      documents: string[];
      notes: string;
    };
    contract: {
      status: "completed" | "in-progress" | "pending";
      completedAt?: string;
      documents: string[];
      notes: string;
    };
    completion: {
      status: "completed" | "in-progress" | "pending";
      completedAt?: string;
      documents: string[];
      notes: string;
    };
    receiving: {
      status: "completed" | "in-progress" | "pending";
      completedAt?: string;
      documents: string[];
      notes: string;
    };
  };
  notes: string;
}

interface PurchaseDetailPageProps {
  requestId: string;
}

export function PurchaseDetailPage({ requestId }: PurchaseDetailPageProps) {
  const router = useRouter();

  // Use store instead of local state
  const { clearError } = useStore();
  const { userData } = useAuthStore();

  const [request, setRequest] = useState<PurchaseRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTransitionDialogOpen, setIsTransitionDialogOpen] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState<{
    from: string;
    to: string;
    requirements: string[];
  } | null>(null);
  const [transitionForm, setTransitionForm] = useState({
    documents: [] as string[],
    notes: "",
    paymentAmount: "",
    inspectionDate: "",
    completionDate: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    inspection_date?: string[];
    expected_completion_date?: string[];
    payment_amount?: string[];
  }>({});

  // Define fixed requirements
  const FIXED_REQUIREMENTS = [
    "تأكيد دفع العربون",
    "توقيع عقد الحجز",
    "تقديم الهوية الوطنية",
    "تقديم إثبات الدخل",
  ];

  // Fetch single purchase request details from API
  const fetchSingleRequest = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchSingleRequest");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/v1/pms/purchase-requests/${requestId}`,
      );
      const data = response.data?.data || response.data;

      // Map API response to component interface
      const mapped: PurchaseRequest = {
        id: (data.id ?? "").toString(),
        requestNumber: data.request_number ?? "-",
        client: {
          name: data.client?.name ?? "غير محدد",
          email: data.client?.email ?? "",
          phone: data.client?.phone ?? "",
          nationalId: data.client?.national_id ?? "",
          rating: data.client?.rating ?? 4.5,
          totalPurchases: data.property?.total_purchases ?? 1,
        },
        property: {
          title: data.property?.title ?? "-",
          type: data.property?.type ?? "-",
          price: Number.parseFloat(
            data.property?.price ?? data.budget_amount ?? "0",
          ),
          area: Number.parseFloat(data.property?.area ?? "0"),
          bedrooms: data.property?.beds ?? 0,
          bathrooms: data.property?.bath ?? 0,
          location: data.property?.location ?? "",
          developer: data.property?.developer ?? data.project?.developer ?? "",
          images: ["/placeholder.svg"],
        },
        currentStage: mapApiStatusToStage(data.overall_status),
        priority: ((): "high" | "medium" | "low" => {
          const p = data.priority;
          if (p === "عالية") return "high";
          if (p === "منخفضة") return "low";
          return "medium";
        })(),
        progress: data.progress_percentage ?? 0,
        createdAt:
          data.request_date ?? data.created_at ?? new Date().toISOString(),
        assignedAgent: data.assigned_user
          ? {
              name: data.assigned_user.name ?? "",
              email: data.assigned_user.email ?? "",
              phone: data.assigned_user.phone ?? "",
              avatar: "/placeholder.svg",
            }
          : { name: "", email: "", phone: "", avatar: "/placeholder.svg" },
        stages: {
          reservation: {
            status:
              data.stages?.[0]?.status === "قيد التنفيذ"
                ? "in-progress"
                : data.stages?.[0]?.status === "الانتظار"
                  ? "pending"
                  : "completed",
            completedAt: data.stages?.[0]?.completed_at ?? undefined,
            documents: data.stages?.[0]?.documents ?? [],
            notes: data.stages?.[0]?.notes ?? "",
          },
          contract: {
            status:
              data.stages?.[1]?.status === "قيد التنفيذ"
                ? "in-progress"
                : data.stages?.[1]?.status === "الانتظار"
                  ? "pending"
                  : "completed",
            completedAt: data.stages?.[1]?.completed_at ?? undefined,
            documents: data.stages?.[1]?.documents ?? [],
            notes: data.stages?.[1]?.notes ?? "",
          },
          completion: {
            status:
              data.stages?.[2]?.status === "قيد التنفيذ"
                ? "in-progress"
                : data.stages?.[2]?.status === "الانتظار"
                  ? "pending"
                  : "completed",
            completedAt: data.stages?.[2]?.completed_at ?? undefined,
            documents: data.stages?.[2]?.documents ?? [],
            notes: data.stages?.[2]?.notes ?? "",
          },
          receiving: {
            status:
              data.stages?.[3]?.status === "قيد التنفيذ"
                ? "in-progress"
                : data.stages?.[3]?.status === "الانتظار"
                  ? "pending"
                  : "completed",
            completedAt: data.stages?.[3]?.completed_at ?? undefined,
            documents: data.stages?.[3]?.documents ?? [],
            notes: data.stages?.[3]?.notes ?? "",
          },
        },
        notes: data.notes ?? "",
      };

      // Check if all stages are pending, then set reservation to in-progress
      if (Object.values(mapped.stages).every((s) => s.status === "pending")) {
        mapped.stages.reservation.status = "in-progress";
      }

      setRequest(mapped);
    } catch (error) {
      console.error("Error fetching purchase request details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleRequest();
  }, [requestId, userData?.token]);

  // Helper functions to map API data to component interface
  const mapApiStatusToStage = (
    status: string,
  ): "reservation" | "contract" | "completion" | "receiving" => {
    switch (status) {
      case "pending":
        return "reservation";
      case "in_progress":
        return "contract";
      case "completed":
        return "receiving";
      default:
        return "reservation";
    }
  };

  const getStageColor = (stage: string, status: string) => {
    if (status === "completed") return "bg-green-500";
    if (status === "in-progress") return "bg-blue-500";
    return "bg-gray-300";
  };

  const getStageIcon = (status: string) => {
    if (status === "completed")
      return <CheckCircle className="h-4 w-4 text-white" />;
    if (status === "in-progress")
      return <Clock className="h-4 w-4 text-white" />;
    return <AlertCircle className="h-4 w-4 text-white" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "عالية";
      case "medium":
        return "متوسطة";
      case "low":
        return "منخفضة";
      default:
        return priority;
    }
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case "reservation":
        return "الحجز";
      case "contract":
        return "العقد";
      case "completion":
        return "الإنجاز";
      case "receiving":
        return "الاستلام";
      default:
        return stage;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "in-progress":
        return "قيد التنفيذ";
      case "pending":
        return "في الانتظار";
      default:
        return status;
    }
  };

  const handleStageTransition = (from: string) => {
    const transitions = {
      reservation: {
        from: "الحجز",
        to: "العقد",
        requirements: [
          "تأكيد دفع العربون",
          "توقيع عقد الحجز",
          "تقديم الهوية الوطنية",
          "تقديم إثبات الدخل",
        ],
      },
      contract: {
        from: "العقد",
        to: "الإنجاز",
        requirements: [
          "توقيع العقد النهائي",
          "دفع الدفعة الثانية",
          "الحصول على موافقة البنك",
          "تسليم المستندات المطلوبة",
        ],
      },
      completion: {
        from: "الإنجاز",
        to: "الاستلام",
        requirements: [
          "إنجاز البناء",
          "الحصول على شهادة الإنجاز",
          "دفع المبلغ المتبقي",
          "فحص الوحدة",
        ],
      },
      receiving: {
        from: "الاستلام",
        to: "الاستلام",
        requirements: [
          "تسجيل الملكية",
          "دفع المبلغ النهائي",
          "تسليم المستندات النهائية",
          "تسليم المفاتيح",
        ],
      },
    };

    const transition = transitions[from as keyof typeof transitions];

    console.log("11111 transition:", transition);
    if (transition) {
      console.log("Initiating transition:", transition);
      setSelectedTransition(transition);
      setIsTransitionDialogOpen(true);
    }
  };

  const handleTransitionSubmit = async () => {
    if (!request || !selectedTransition) return;

    // Reset validation errors
    setValidationErrors({});

    // Prepare requirements_met as array of booleans
    console.log("Selected requirements:", selectedTransition.requirements);
    const requirementsMet = selectedTransition.requirements.map((req) =>
      transitionForm.documents.includes(req),
    );

    // Prepare body
    const body = {
      current_stage_name: selectedTransition.from, // Next stage name in Arabic
      requirements_met: requirementsMet,
      inspection_date: transitionForm.inspectionDate || null, // If empty, send null or handle as needed
      payment_amount: transitionForm.paymentAmount
        ? Number(transitionForm.paymentAmount)
        : null,
      expected_completion_date: transitionForm.completionDate || null,
      additional_notes: transitionForm.notes || "",
    };

    try {
      // Send API request
      await axiosInstance.post(
        `/v1/pms/purchase-requests/${requestId}/simple-transition-stage`,
        body,
      );

      // On success, refetch data to update UI
      await fetchSingleRequest();

      setIsTransitionDialogOpen(false);
      setSelectedTransition(null);
      setTransitionForm({
        documents: [],
        notes: "",
        paymentAmount: "",
        inspectionDate: "",
        completionDate: "",
      });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      } else {
        console.error("Error transitioning stage:", error);
      }
    }
  };

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50" dir="rtl">
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">
                  يرجى تسجيل الدخول لعرض المحتوى
                </p>
              </div>
            </div>
          </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50" dir="rtl">
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <Skeleton className="h-8 w-24" />
                <div>
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>

            <div className="mb-6">
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))}
            </div>
          </main>
      </div>
    );
  }

  if (!request) {
    return <div className="p-6">لم يتم العثور على طلب الشراء</div>;
  }

  const getStageStatus = (
    request: PurchaseRequest | null,
    stageName: string,
  ): "completed" | "in-progress" | "pending" => {
    const stageMap: Record<string, keyof PurchaseRequest["stages"]> = {
      الحجز: "reservation",
      العقد: "contract",
      الإنجاز: "completion",
      الاستلام: "receiving",
    };
    const englishKey = stageMap[stageName];
    if (!englishKey || !request) return "pending";
    return request.stages[englishKey].status;
  };

  const stages = [
    {
      key: "reservation",
      label: "الحجز",
      status: getStageStatus(request, "الحجز"),
    },
    {
      key: "contract",
      label: "العقد",
      status: getStageStatus(request, "العقد"),
    },
    {
      key: "completion",
      label: "الإنجاز",
      status: getStageStatus(request, "الإنجاز"),
    },
    {
      key: "receiving",
      label: "الاستلام",
      status: getStageStatus(request, "الاستلام"),
    },
  ];

  const canTransition = (currentStage: string) => {
    const stageOrder = ["reservation", "contract", "completion", "receiving"];
    const currentIndex = stageOrder.indexOf(currentStage);
    return (
      currentIndex < stageOrder.length - 1 &&
      request.stages[currentStage as keyof typeof request.stages].status ===
        "in-progress"
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2 space-x-reverse"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>العودة</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  تفاصيل طلب الشراء {request.requestNumber}
                </h1>
                <p className="text-gray-600">
                  تم الإنشاء في{" "}
                  {new Date(request.createdAt).toLocaleDateString("ar-US")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Badge className={getPriorityColor(request.priority)}>
                {getPriorityText(request.priority)}
              </Badge>
              <Badge variant="outline">
                {getStageText(request.currentStage)}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">تقدم المعاملة</h3>
                <span className="text-2xl font-bold text-blue-600">
                  {request.progress}%
                </span>
              </div>
              <Progress value={request.progress} className="mb-4" />
              <div className="flex justify-between">
                {stages.map((stage, index) => (
                  <div key={stage.key} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getStageColor(stage.key, stage.status)}`}
                    >
                      {getStageIcon(stage.status)}
                    </div>
                    <span className="text-sm mt-2 text-center">
                      {stage.label}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {getStatusText(stage.status)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <User className="h-5 w-5" />
                  <span>معلومات العميل</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    الاسم
                  </Label>
                  <p className="text-lg font-semibold">{request.client.name}</p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{request.client.email}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{request.client.phone}</span>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    رقم الهوية
                  </Label>
                  <p className="text-sm">{request.client.nationalId}</p>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      التقييم
                    </Label>
                    <p className="text-lg font-semibold text-yellow-600">
                      {request.client.rating}/5
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      إجمالي المشتريات
                    </Label>
                    <p className="text-lg font-semibold">
                      {request.client.totalPurchases}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Building className="h-5 w-5" />
                  <span>معلومات العقار</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    العنوان
                  </Label>
                  <p className="text-lg font-semibold">
                    {request.property.title}
                  </p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{request.property.location}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      النوع
                    </Label>
                    <p className="text-sm">{request.property.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      المساحة
                    </Label>
                    <p className="text-sm">{request.property.area} م²</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      غرف النوم
                    </Label>
                    <p className="text-sm">{request.property.bedrooms}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      دورات المياه
                    </Label>
                    <p className="text-sm">{request.property.bathrooms}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    السعر
                  </Label>
                  <p className="text-2xl font-bold text-green-600">
                    {request.property.price.toLocaleString("ar-US")} ريال
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    المطور
                  </Label>
                  <p className="text-sm">{request.property.developer}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage Details */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stages.map((stage) => (
              <Card key={stage.key}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${getStageColor(stage.key, stage.status)}`}
                      >
                        {getStageIcon(stage.status)}
                      </div>
                      <span>{stage.label}</span>
                    </div>
                    <Badge variant="outline">
                      {getStatusText(stage.status)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.stages[stage.key as keyof typeof request.stages]
                    .completedAt && (
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        تم في{" "}
                        {new Date(
                          request.stages[
                            stage.key as keyof typeof request.stages
                          ].completedAt!,
                        ).toLocaleDateString("ar-US")}
                      </span>
                    </div>
                  )}

                  {request.stages[stage.key as keyof typeof request.stages]
                    .documents.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        المستندات
                      </Label>
                      <div className="mt-2 space-y-1">
                        {request.stages[
                          stage.key as keyof typeof request.stages
                        ].documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 space-x-reverse text-sm"
                          >
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.stages[stage.key as keyof typeof request.stages]
                    .notes && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        ملاحظات
                      </Label>
                      <p className="text-sm mt-1">
                        {
                          request.stages[
                            stage.key as keyof typeof request.stages
                          ].notes
                        }
                      </p>
                    </div>
                  )}

                  {stage.status === "in-progress" && (
                    <Button
                      onClick={() => {
                        const stageOrder = [
                          "reservation",
                          "contract",
                          "completion",
                          "receiving",
                        ];
                        const currentIndex = stageOrder.indexOf(stage.key);
                        const nextStage = stageOrder[currentIndex + 1];
                        handleStageTransition(stage.key, nextStage);
                      }}
                      className="w-full"
                    >
                      الانتقال للمرحلة التالية
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Notes */}
          {request.notes && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>ملاحظات إضافية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{request.notes}</p>
              </CardContent>
            </Card>
          )}
          {/* Stage Transition Dialog */}
          <Dialog
            open={isTransitionDialogOpen}
            onOpenChange={setIsTransitionDialogOpen}
          >
            <DialogContent
              className="max-w-2xl max-h-[90vh] overflow-y-auto"
              dir="rtl"
            >
              <DialogHeader>
                <DialogTitle>انتقال المرحلة</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* المتطلبات المطلوبة - ثابتة دائماً */}
                <div>
                  <Label className="text-base font-semibold">
                    المتطلبات المطلوبة:
                  </Label>
                  <div className="mt-3 space-y-2">
                    {selectedTransition?.requirements?.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 space-x-reverse"
                      >
                        <Checkbox
                          id={`req-${index}`}
                          checked={transitionForm.documents.includes(req)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTransitionForm((prev) => ({
                                ...prev,
                                documents: [...prev.documents, req],
                              }));
                            } else {
                              setTransitionForm((prev) => ({
                                ...prev,
                                documents: prev.documents.filter(
                                  (doc) => doc !== req,
                                ),
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`req-${index}`} className="text-sm">
                          {req}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* الحقول الأخرى - ظاهرة دائماً */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paymentAmount">مبلغ الدفع (ريال)</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      value={transitionForm.paymentAmount}
                      onChange={(e) =>
                        setTransitionForm((prev) => ({
                          ...prev,
                          paymentAmount: e.target.value,
                        }))
                      }
                      placeholder="أدخل المبلغ"
                      className={
                        validationErrors.payment_amount ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.payment_amount?.map((error, index) => (
                      <p key={index} className="text-sm text-red-500 mt-1">
                        {error}
                      </p>
                    ))}
                  </div>
                  <div>
                    <Label htmlFor="inspectionDate">تاريخ الفحص</Label>
                    <Input
                      id="inspectionDate"
                      type="date"
                      value={transitionForm.inspectionDate}
                      onChange={(e) =>
                        setTransitionForm((prev) => ({
                          ...prev,
                          inspectionDate: e.target.value,
                        }))
                      }
                      className={
                        validationErrors.inspection_date ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.inspection_date?.map((error, index) => (
                      <p key={index} className="text-sm text-red-500 mt-1">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="completionDate">تاريخ الإنجاز المتوقع</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={transitionForm.completionDate}
                    onChange={(e) =>
                      setTransitionForm((prev) => ({
                        ...prev,
                        completionDate: e.target.value,
                      }))
                    }
                    className={
                      validationErrors.expected_completion_date
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {validationErrors.expected_completion_date?.map(
                    (error, index) => (
                      <p key={index} className="text-sm text-red-500 mt-1">
                        {error}
                      </p>
                    ),
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    id="notes"
                    value={transitionForm.notes}
                    onChange={(e) =>
                      setTransitionForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="أضف أي ملاحظات مهمة..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter className="flex space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  onClick={() => setIsTransitionDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleTransitionSubmit}
                  disabled={
                    transitionForm.documents.length !==
                    selectedTransition?.requirements?.length
                  }
                >
                  تأكيد الانتقال
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
    </div>
  );
}
