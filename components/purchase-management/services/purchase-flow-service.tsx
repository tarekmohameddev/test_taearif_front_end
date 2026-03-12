"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import useStore from "@/context/Store";
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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Building2,
  Edit,
  Eye,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";
import { selectUserData } from "@/context/auth/selectors";

interface PurchaseRequest {
  id: string;
  requestNumber: string;
  client: {
    name: string;
    nameAr: string;
    email: string;
    phone: string;
    nationalId: string;
    avatar?: string;
    rating: number;
    totalPurchases: number;
  };
  property: {
    title: string;
    titleAr: string;
    type: string;
    typeAr: string;
    location: string;
    locationAr: string;
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
    developer: string;
    developerAr: string;
    images: string[];
    features: string[];
    featuresAr: string[];
  };
  currentStage: "reservation" | "contract" | "completion" | "receiving";
  currentStageAr: string;
  stages: {
    reservation: {
      status: "completed" | "in_progress" | "pending" | "cancelled";
      statusAr: string;
      date?: string;
      dateHijri?: string;
      amount?: number;
      notes?: string;
      notesAr?: string;
      documents?: string[];
      completionPercentage: number;
    };
    contract: {
      status: "completed" | "in_progress" | "pending" | "cancelled";
      statusAr: string;
      date?: string;
      dateHijri?: string;
      contractNumber?: string;
      notes?: string;
      notesAr?: string;
      documents?: string[];
      completionPercentage: number;
      lawyer?: string;
      lawyerAr?: string;
    };
    completion: {
      status: "completed" | "in_progress" | "pending" | "cancelled";
      statusAr: string;
      date?: string;
      dateHijri?: string;
      paidAmount?: number;
      remainingAmount?: number;
      notes?: string;
      notesAr?: string;
      documents?: string[];
      completionPercentage: number;
      installments?: Array<{
        amount: number;
        dueDate: string;
        status: "paid" | "pending" | "overdue";
      }>;
    };
    receiving: {
      status: "completed" | "in_progress" | "pending" | "cancelled";
      statusAr: string;
      date?: string;
      dateHijri?: string;
      notes?: string;
      notesAr?: string;
      documents?: string[];
      completionPercentage: number;
      handoverDate?: string;
      inspectionReport?: string;
    };
  };
  priority: "low" | "medium" | "high" | "urgent";
  priorityAr: string;
  createdAt: string;
  updatedAt: string;
  totalValue: number;
  paidAmount: number;
  remainingAmount: number;
  expectedCompletion: string;
  riskLevel: "low" | "medium" | "high";
  riskLevelAr: string;
  tags: string[];
  tagsAr: string[];
  assignedAgent?: {
    name: string;
    nameAr: string;
    phone: string;
    email: string;
  };
}

interface StageTransitionDialog {
  isOpen: boolean;
  requestId: string;
  fromStage: string;
  toStage: string;
  requirements: string[];
}

interface StageRequirement {
  id: string;
  label: string;
  labelAr: string;
  type: "document" | "payment" | "approval" | "inspection";
  required: boolean;
  completed: boolean;
}

export { PurchaseFlowService };
export default function PurchaseFlowService() {
  const router = useRouter();
  const userData = useAuthStore(selectUserData);

  // Use store instead of local state
  const {
    purchaseManagement: {
      purchaseRequests: requests,
      loading,
      searchTerm,
      statusFilter,
      priorityFilter,
      isCreatingRequest,
      isUpdatingRequest,
      isTransitioningStage,
      isDeletingRequest,
      deleteConfirmDialog,
      properties,
      projects,
      loadingProperties,
      loadingProjects,
      error,
    },
    fetchPurchaseRequests,
    fetchProperties,
    fetchProjects,
    createPurchaseRequest,
    updatePurchaseRequest,
    transitionToNextStage,
    deletePurchaseRequest,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    openDeleteConfirmDialog,
    closeDeleteConfirmDialog,
    clearError,
  } = useStore();
  const [selectedRequest, setSelectedRequest] =
    useState<PurchaseRequest | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "timeline" | "analytics">(
    "cards",
  );
  const [stageTransition, setStageTransition] = useState<StageTransitionDialog>(
    {
      isOpen: false,
      requestId: "",
      fromStage: "",
      toStage: "",
      requirements: [],
    },
  );
  const [transitionForm, setTransitionForm] = useState<any>({});
  // Zod: form validation schemas
  const addRequestSchema = z
    .object({
      clientNameAr: z.string().min(1, "الاسم بالعربية مطلوب").or(z.literal("")),
      clientName: z
        .string()
        .min(1, "الاسم بالإنجليزية مطلوب")
        .or(z.literal("")),
      clientEmail: z.string().email("بريد إلكتروني غير صالح"),

      // رقم الهاتف مطلوب
      clientPhone: z.string().min(1, "رقم الهاتف مطلوب"),

      clientNationalId: z.string(),
      selectedPropertyId: z.string().min(1, "اختيار العقار مطلوب"),
      propertyLocationAr: z.string().optional(),
      propertyDeveloperAr: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"], {
        required_error: "الأولوية مطلوبة",
      }),
      notes: z.string().optional(),
    })
    .refine((data) => data.clientNameAr || data.clientName, {
      message: "الاسم مطلوب (العربية أو الإنجليزية)",
      path: ["clientNameAr"],
    });

  const editRequestSchema = addRequestSchema;

  // Field-level errors
  const [newRequestErrors, setNewRequestErrors] = useState<
    Record<string, string>
  >({});
  const [editRequestErrors, setEditRequestErrors] = useState<
    Record<string, string>
  >({});
  const [stageFilter, setStageFilter] = useState("all");
  // const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<PurchaseRequest | null>(
    null,
  );
  const [editRequestForm, setEditRequestForm] = useState({
    clientName: "",
    clientNameAr: "",
    clientEmail: "",
    clientPhone: "",
    clientNationalId: "",
    selectedPropertyId: "",
    selectedProjectId: "",
    propertyLocation: "",
    propertyLocationAr: "",
    propertyDeveloper: "",
    propertyDeveloperAr: "",
    priority: "medium",
    notes: "",
  });
  const [newRequestForm, setNewRequestForm] = useState({
    clientName: "",
    clientNameAr: "",
    clientEmail: "",
    clientPhone: "",
    clientNationalId: "",
    selectedPropertyId: "",
    selectedProjectId: "",
    propertyLocation: "",
    propertyLocationAr: "",
    propertyDeveloper: "",
    propertyDeveloperAr: "",
    priority: "medium",
    notes: "",
  });

  // Fetch properties
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Fetch properties
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchPurchaseRequests();
  }, [fetchPurchaseRequests]);

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

  const mapApiStatusToStageAr = (status: string): string => {
    switch (status) {
      case "pending":
        return "الحجز";
      case "in_progress":
        return "العقد";
      case "completed":
        return "الاستلام";
      default:
        return "الحجز";
    }
  };

  const mapApiPriorityToPriority = (
    priority: string,
  ): "low" | "medium" | "high" | "urgent" => {
    switch (priority) {
      case "عاجل":
        return "urgent";
      case "متوسطة":
        return "medium";
      default:
        return "medium";
    }
  };

  const mapStageStatus = (
    status: string | undefined,
  ): "completed" | "in_progress" | "pending" | "cancelled" => {
    if (!status) return "pending";
    switch (status) {
      case "مكتمل":
        return "completed";
      case "قيد التنفيذ":
        return "in_progress";
      case "الانتظار":
        return "pending";
      default:
        return "pending";
    }
  };

  const filteredRequests = requests.filter((request: any) => {
    const matchesSearch =
      request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.client.nameAr || request.client.name || "").includes(
        searchTerm,
      ) ||
      request.property.titleAr.includes(searchTerm);

    const matchesStage =
      stageFilter === "all" || request.currentStage === stageFilter;
    const matchesPriority =
      priorityFilter === "all" || request.priority === priorityFilter;

    return matchesSearch && matchesStage && matchesPriority;
  });

  const analytics = {
    totalRequests: requests.length,
    totalValue: requests.reduce(
      (sum: any, req: any) => sum + req.totalValue,
      0,
    ),
    totalPaid: requests.reduce((sum: any, req: any) => sum + req.paidAmount, 0),
    averageProgress:
      requests.reduce((sum: any, req: any) => sum + getStageProgress(req), 0) /
      requests.length,
    stageDistribution: {
      reservation: requests.filter((r: any) => r.currentStage === "reservation")
        .length,
      contract: requests.filter((r: any) => r.currentStage === "contract")
        .length,
      completion: requests.filter((r: any) => r.currentStage === "completion")
        .length,
      receiving: requests.filter((r: any) => r.currentStage === "receiving")
        .length,
    },
    riskDistribution: {
      low: requests.filter((r: any) => r.riskLevel === "low").length,
      medium: requests.filter((r: any) => r.riskLevel === "medium").length,
      high: requests.filter((r: any) => r.riskLevel === "high").length,
    },
  };

  function getStageProgress(request: PurchaseRequest): number {
    const stages: Array<keyof PurchaseRequest["stages"]> = [
      "reservation",
      "contract",
      "completion",
      "receiving",
    ];
    const currentStageKey =
      request.currentStage as keyof PurchaseRequest["stages"];
    const currentIndexRaw = stages.indexOf(currentStageKey);
    const currentIndex = currentIndexRaw >= 0 ? currentIndexRaw : 0;
    const stageObj = request.stages?.[currentStageKey];
    const currentStageProgress = stageObj?.completionPercentage ?? 0;

    return (currentIndex * 100 + currentStageProgress) / stages.length;
  }

  function getStageColor(status: string): string {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  function getPriorityAr(priority: string): string {
    switch (priority) {
      case "high":
        return "عالية";
      case "medium":
        return "متوسطة";
      case "low":
        return "منخفضة";
      case "urgent":
        return "عاجل";
      default:
        return priority;
    }
  }

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  function getRiskColor(risk: string): string {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  function getStageRequirements(
    fromStage: string,
    toStage: string,
  ): StageRequirement[] {
    const requirements: { [key: string]: StageRequirement[] } = {
      "reservation-contract": [
        {
          id: "id_copy",
          label: "ID Copy",
          labelAr: "صورة الهوية",
          type: "document",
          required: true,
          completed: false,
        },
        {
          id: "salary_certificate",
          label: "Salary Certificate",
          labelAr: "شهادة راتب",
          type: "document",
          required: true,
          completed: false,
        },
        {
          id: "bank_statement",
          label: "Bank Statement",
          labelAr: "كشف حساب بنكي",
          type: "document",
          required: true,
          completed: false,
        },
        {
          id: "reservation_payment",
          label: "Reservation Payment",
          labelAr: "دفع مبلغ الحجز",
          type: "payment",
          required: true,
          completed: false,
        },
        {
          id: "credit_approval",
          label: "Credit Approval",
          labelAr: "موافقة ائتمانية",
          type: "approval",
          required: true,
          completed: false,
        },
      ],
      "contract-completion": [
        {
          id: "signed_contract",
          label: "Signed Contract",
          labelAr: "العقد الموقع",
          type: "document",
          required: true,
          completed: false,
        },
        {
          id: "down_payment",
          label: "Down Payment",
          labelAr: "الدفعة المقدمة",
          type: "payment",
          required: true,
          completed: false,
        },
        {
          id: "insurance_policy",
          label: "Insurance Policy",
          labelAr: "وثيقة التأمين",
          type: "document",
          required: true,
          completed: false,
        },
        {
          id: "legal_review",
          label: "Legal Review",
          labelAr: "المراجعة القانونية",
          type: "approval",
          required: true,
          completed: false,
        },
      ],
      "completion-receiving": [
        {
          id: "final_payment",
          label: "Final Payment",
          labelAr: "الدفعة الأخيرة",
          type: "payment",
          required: true,
          completed: false,
        },
        {
          id: "property_inspection",
          label: "Property Inspection",
          labelAr: "معاينة العقار",
          type: "inspection",
          required: true,
          completed: false,
        },
        {
          id: "title_deed",
          label: "Title Deed",
          labelAr: "صك الملكية",
          type: "document",
          required: true,
          completed: false,
        },
        {
          id: "handover_approval",
          label: "Handover Approval",
          labelAr: "موافقة التسليم",
          type: "approval",
          required: true,
          completed: false,
        },
      ],
    };
    return requirements[`${fromStage}-${toStage}`] || [];
  }

  function canTransitionToStage(
    request: PurchaseRequest,
    targetStage: string,
  ): boolean {
    const stages = ["reservation", "contract", "completion", "receiving"];
    const currentIndex = stages.indexOf(request.currentStage);
    const targetIndex = stages.indexOf(targetStage);

    // Can only move to next stage or stay in current stage
    return targetIndex <= currentIndex + 1 && targetIndex >= currentIndex;
  }

  function getNextStage(currentStage: string): string | null {
    const stages = ["reservation", "contract", "completion", "receiving"];
    const currentIndex = stages.indexOf(currentStage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  }

  function handleStageTransition(
    requestId: string,
    fromStage: string,
    toStage: string,
  ) {
    const requirements = getStageRequirements(fromStage, toStage);
    setStageTransition({
      isOpen: true,
      requestId,
      fromStage,
      toStage,
      requirements: requirements.map((req) => req.id),
    });
    setTransitionForm({
      requirements: requirements.reduce(
        (acc, req) => ({ ...acc, [req.id]: false }),
        {},
      ),
      notes: "",
      documents: [],
      amount: 0,
      date: new Date().toISOString().split("T")[0],
    });
  }

  async function completeStageTransition() {
    const request = requests.find(
      (r: any) => r.id === stageTransition.requestId,
    );
    if (!request) return;

    try {
      // Prepare data for API
      const transitionData = {
        current_stage_name: getStageNameAr(stageTransition.fromStage),
        requirements_met: Object.values(transitionForm.requirements),
        inspection_date: transitionForm.date,
        payment_amount: transitionForm.amount || 0,
        expected_completion_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
        additional_notes: transitionForm.notes,
      };

      // Transition to next stage via store
      await transitionToNextStage(stageTransition.requestId, transitionData);

      // Close dialog and reset form
      setStageTransition({
        isOpen: false,
        requestId: "",
        fromStage: "",
        toStage: "",
        requirements: [],
      });
      setTransitionForm({});

      // Show success message
      toast.success(
        `تم الانتقال من ${stageTransition.fromStage} إلى ${stageTransition.toStage} بنجاح`,
      );
    } catch (error) {
      console.error("Error transitioning stage:", error);
      // Show error message
      toast.success(
        "حدث خطأ أثناء الانتقال إلى المرحلة التالية. يرجى المحاولة مرة أخرى",
      );
    }
  }

  function getStageNameAr(stage: string): string {
    const stageNames: { [key: string]: string } = {
      reservation: "الحجز",
      contract: "العقد",
      completion: "الإنجاز",
      receiving: "الاستلام",
    };
    return stageNames[stage] || stage;
  }

  function handleEditRequest(request: PurchaseRequest) {
    setEditingRequest(request);
    // تعبئة النموذج ببيانات الطلب المحدد
    console.log("Editing request:", request);
    setEditRequestForm({
      clientName: request.client.name || "",
      clientNameAr: request.client.name || "",
      clientEmail: request.client.email || "",
      clientPhone: request.client.phone || "",
      clientNationalId: request.client.nationalId || "",
      selectedPropertyId: request.property?.id?.toString() || "", // معرف العقار
      propertyLocation: request.property.location || "",
      propertyLocationAr: request.property.locationAr || "",
      propertyDeveloper: request.property.developer || "",
      propertyDeveloperAr: request.property.developerAr || "",
      priority: request.priority || "medium",
      notes: "",
    });
    setIsEditDialogOpen(true);
  }

  async function handleSaveEdit() {
    if (!editingRequest) return;

    try {
      // Validate
      const result = editRequestSchema.safeParse(editRequestForm);
      if (!result.success) {
        const fe = result.error.flatten().fieldErrors as Record<
          string,
          string[]
        >;
        const mapped: Record<string, string> = {};
        (Object.keys(fe) as Array<keyof typeof fe>).forEach((k) => {
          if (fe[k]?.[0]) mapped[k as string] = fe[k]![0];
        });
        setEditRequestErrors(mapped);
        return;
      } else {
        setEditRequestErrors({});
      }
      // Get selected property
      if (!Array.isArray(properties) || properties.length === 0) {
        toast.error("لا توجد عقارات متاحة");
        return;
      }

      const selectedProperty = properties.find(
        (p) => p.id.toString() === editRequestForm.selectedPropertyId,
      );
      if (!selectedProperty) {
        toast.error("يرجى اختيار عقار صحيح");
        return;
      }
      // عرّف المتغير خارج الشرط
      let selectedProject: any = null;

      if (editRequestForm.selectedProjectId) {
        selectedProject = projects.find(
          (p) => p.id.toString() === editRequestForm.selectedProjectId,
        );

        if (!selectedProject) {
          toast.error("يرجى اختيار مشروع صحيح");
          return;
        }
      }

      if (!editRequestForm.clientPhone) {
        toast.error("يرجى إدخال رقم هاتف العميل");
        return;
      }

      // Prepare data for API
      const requestData = {
        client_name: editRequestForm.clientNameAr || editRequestForm.clientName,
        client_email: editRequestForm.clientEmail,
        client_phone: editRequestForm.clientPhone,
        client_national_id: editRequestForm.clientNationalId,
        property_id: selectedProperty.id,
        project_id: selectedProject.id || null, // Default to null - you might want to make this selectable
        priority:
          editRequestForm.priority === "high"
            ? "عالية"
            : editRequestForm.priority === "medium"
              ? "متوسطة"
              : editRequestForm.priority === "urgent"
                ? "عاجل"
                : "منخفضة",
        budget_amount: parseFloat(selectedProperty.price),
        notes: editRequestForm.notes,
        additional_notes: `العقار: ${selectedProperty.title}, الموقع: ${editRequestForm.propertyLocationAr}`,
        assigned_to: null,
        overall_status: "in_progress",
        expected_completion_date: new Date(
          Date.now() + 180 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };

      // Update the request via store
      await updatePurchaseRequest(editingRequest.id, requestData);
      setIsEditDialogOpen(false);

      setEditingRequest(null);
      toast.success("تم تحديث طلب الشراء بنجاح");
    } catch (error) {
      console.error("Error updating purchase request:", error);
      toast.error("حدث خطأ أثناء تحديث طلب الشراء");
    }
  }

  async function handleAddNewRequest() {
    try {
      // Validate with Zod
      const result = addRequestSchema.safeParse(newRequestForm);
      if (!result.success) {
        const fe = result.error.flatten().fieldErrors as Record<
          string,
          string[]
        >;
        const mapped: Record<string, string> = {};
        (Object.keys(fe) as Array<keyof typeof fe>).forEach((k) => {
          if (fe[k]?.[0]) mapped[k as string] = fe[k]![0];
        });
        setNewRequestErrors(mapped);
        return;
      } else {
        setNewRequestErrors({});
      }

      // Get selected property
      if (!Array.isArray(properties) || properties.length === 0) {
        toast.error("لا توجد عقارات متاحة");
        return;
      }

      const selectedProperty = properties.find(
        (p) => p.id.toString() === newRequestForm.selectedPropertyId,
      );
      if (!selectedProperty) {
        toast.error("يرجى اختيار عقار صحيح");
        return;
      }

      // عرّف المتغير خارج الشرط
      let selectedProject: any = null;

      if (newRequestForm.selectedProjectId) {
        selectedProject = projects.find(
          (p) => p.id.toString() === newRequestForm.selectedProjectId,
        );

        if (!selectedProject) {
          toast.error("يرجى اختيار مشروع صحيح");
          return;
        }
      }

      if (!newRequestForm.clientPhone) {
        toast.error("يرجى إدخال رقم هاتف العميل");
        return;
      }

      // Prepare data for API
      const requestData = {
        client_name: newRequestForm.clientNameAr || newRequestForm.clientName,
        client_email: newRequestForm.clientEmail,
        client_phone: newRequestForm.clientPhone,
        client_national_id: newRequestForm.clientNationalId,
        property_id: selectedProperty.id,
        project_id: selectedProject ? selectedProject.id : null, // ✅ الآن آمن
        priority:
          newRequestForm.priority === "high"
            ? "عالية"
            : newRequestForm.priority === "medium"
              ? "متوسطة"
              : newRequestForm.priority === "urgent"
                ? "عاجل"
                : "منخفضة",
        budget_amount: parseFloat(selectedProperty.price),
        notes: newRequestForm.notes,
        additional_notes: `العقار: ${selectedProperty.title}, الموقع: ${newRequestForm.propertyLocationAr}`,
        assigned_to: null,
        expected_completion_date: new Date(
          Date.now() + 180 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };

      // Create the request via store
      const response = await createPurchaseRequest(requestData);

      if (response && (response.status === 200 || response.status === 201)) {
        setIsAddDialogOpen(false);
        setNewRequestForm({
          clientName: "",
          clientNameAr: "",
          clientEmail: "",
          clientPhone: "",
          clientNationalId: "",
          selectedPropertyId: "",
          propertyLocation: "",
          propertyLocationAr: "",
          propertyDeveloper: "",
          propertyDeveloperAr: "",
          priority: "medium",
          notes: "",
        });

        toast.success("تم إنشاء طلب الشراء الجديد بنجاح");
      } else {
        toast.error(response?.data?.message || "فشل إنشاء الطلب");
      }
    } catch (error: any) {
      console.error("Error creating purchase request:", error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إنشاء طلب الشراء",
      );
    }
  }

  const handleRowClick = (requestId: string) => {
    router.push(`/purchase-management/${requestId}`);
  };

  function handleDeleteRequest(requestId: string) {
    const request = requests.find((req: any) => req.id === requestId);
    if (!request) return;

    openDeleteConfirmDialog(
      requestId,
      request.requestNumber,
      request.client.nameAr || request.client.name,
    );
  }

  async function confirmDeleteRequest() {
    if (!deleteConfirmDialog.requestId) return;

    try {
      // Delete the request via store
      await deletePurchaseRequest(deleteConfirmDialog.requestId);

      // Close dialog
      closeDeleteConfirmDialog();

      // Show success message
      toast.success(
        `تم حذف طلب الشراء ${deleteConfirmDialog.requestNumber} بنجاح`,
      );
    } catch (error) {
      console.error("Error deleting purchase request:", error);
      // Show error message
      toast.error("حدث خطأ أثناء حذف طلب الشراء. يرجى المحاولة مرة أخرى.");
    }
  }

  function cancelDeleteRequest() {
    closeDeleteConfirmDialog();
  }

  // Helper functions for stage and priority badges
  const getStageVariant = (stage: string) => {
    switch (stage) {
      case "reservation":
        return "secondary";
      case "contract":
        return "outline";
      case "completion":
        return "default";
      case "receiving":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStageLabel = (stage: string) => {
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
        return "غير معروف";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "low":
        return "secondary";
      case "medium":
        return "outline";
      case "high":
        return "default";
      case "urgent":
        return "destructive";
      default:
        return "secondary";
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

  return (
    <div className="space-y-6">
      {/* Header with filters and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">إدارة طلبات الشراء</h2>
          <p className="text-muted-foreground">
            تتبع ومتابعة عمليات شراء العقارات
          </p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="تصفية حسب المرحلة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              <SelectItem value="reservation">الحجز</SelectItem>
              <SelectItem value="contract">العقد</SelectItem>
              <SelectItem value="completion">الإنجاز</SelectItem>
              <SelectItem value="receiving">الاستلام</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأولويات</SelectItem>
              <SelectItem value="urgent">عاجل</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="low">منخفضة</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            طلب جديد
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="البحث في طلبات الشراء..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">العقار</TableHead>
                <TableHead className="text-right">المرحلة الحالية</TableHead>
                <TableHead className="text-right">التقدم</TableHead>
                <TableHead className="text-right">القيمة</TableHead>
                <TableHead className="text-right">الأولوية</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request: PurchaseRequest) => (
                <>
                  <TableRow
                    key={request.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleRowClick(request.id)}
                  >
                    <TableCell className="font-medium">
                      {request.requestNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={request.client.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {(
                              request.client.nameAr ||
                              request.client.name ||
                              ""
                            ).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {request.client.nameAr || request.client.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {request.property.title ||
                            request.property.titleAr ||
                            ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.property.location ||
                            request.property.locationAr ||
                            ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getStageNameAr(request.currentStage)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress
                          value={getStageProgress(request)}
                          className="h-2 w-16"
                        />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(getStageProgress(request))}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {(() => {
                          const total =
                            (request as any).totalValue ??
                            (typeof request.property.price === "number"
                              ? request.property.price
                              : 0);
                          const paid = (request as any).paidAmount ?? 0;
                          return (
                            <>
                              <p className="text-sm font-medium">
                                {(Number(total) / 1000).toLocaleString()}ك
                              </p>
                              <p className="text-xs text-muted-foreground">
                                مدفوع: {(Number(paid) / 1000).toLocaleString()}ك
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getPriorityColor(request.priority)}
                        variant="outline"
                      >
                        {getPriorityAr(request.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(request.id);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRequest(request);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest(request.id);
                          }}
                          disabled={
                            isDeletingRequest &&
                            deleteConfirmDialog.requestId === request.id
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Removed expanded row content as it's now on a separate detail page */}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {filteredRequests.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">لا توجد عمليات شراء</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || stageFilter !== "all" || priorityFilter !== "all"
              ? "جرب تعديل معايير البحث"
              : "لا توجد عمليات شراء مسجلة حالياً"}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة عملية شراء
          </Button>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل طلب الشراء</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">معلومات العميل</h3>

              <div className="space-y-2">
                <Label htmlFor="editClientNameAr">اسم العميل </Label>
                <Input
                  id="editClientNameAr"
                  value={editRequestForm.clientNameAr}
                  onChange={(e) =>
                    setEditRequestForm({
                      ...editRequestForm,
                      clientNameAr: e.target.value,
                    })
                  }
                  placeholder="أدخل اسم العميل بالعربية"
                />
                {editRequestErrors.clientNameAr && (
                  <p className="text-xs text-red-500 mt-1">
                    {editRequestErrors.clientNameAr}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="editClientEmail">البريد الإلكتروني</Label>
                <Input
                  id="editClientEmail"
                  type="email"
                  value={editRequestForm.clientEmail}
                  onChange={(e) =>
                    setEditRequestForm({
                      ...editRequestForm,
                      clientEmail: e.target.value,
                    })
                  }
                  placeholder="client@example.com"
                />
                {editRequestErrors.clientEmail && (
                  <p className="text-xs text-red-500 mt-1">
                    {editRequestErrors.clientEmail}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="editClientPhone">رقم الهاتف</Label>
                <Input
                  id="editClientPhone"
                  value={editRequestForm.clientPhone}
                  onChange={(e) =>
                    setEditRequestForm({
                      ...editRequestForm,
                      clientPhone: e.target.value,
                    })
                  }
                  placeholder="+966 50 123 4567"
                />
                {editRequestErrors.clientPhone && (
                  <p className="text-xs text-red-500 mt-1">
                    {editRequestErrors.clientPhone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="editClientNationalId">رقم الهوية</Label>
                <Input
                  id="editClientNationalId"
                  value={editRequestForm.clientNationalId}
                  onChange={(e) =>
                    setEditRequestForm({
                      ...editRequestForm,
                      clientNationalId: e.target.value,
                    })
                  }
                  placeholder="1234567890"
                />
                {editRequestErrors.clientNationalId && (
                  <p className="text-xs text-red-500 mt-1">
                    {editRequestErrors.clientNationalId}
                  </p>
                )}
              </div>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">معلومات العقار</h3>

              <div className="space-y-2">
                <Label htmlFor="editSelectedProperty">اختيار العقار</Label>
                <Select
                  value={editRequestForm.selectedPropertyId}
                  onValueChange={(value) =>
                    setEditRequestForm({
                      ...editRequestForm,
                      selectedPropertyId: value,
                    })
                  }
                  disabled={loadingProperties}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingProperties
                          ? "جاري تحميل العقارات..."
                          : "اختر العقار"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(properties) && properties.length > 0 ? (
                      properties.map((property) => (
                        <SelectItem
                          key={property.id}
                          value={property.id.toString()}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {property.title}
                            </span>
                            <span className="text-sm text-gray-500">
                              {property.type} - {property.price} ر.س -{" "}
                              {property.area} م²
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-properties" disabled>
                        لا توجد عقارات متاحة
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {editRequestErrors.selectedPropertyId && (
                  <p className="text-xs text-red-500 mt-1">
                    {editRequestErrors.selectedPropertyId}
                  </p>
                )}
                {editRequestForm.selectedPropertyId &&
                  Array.isArray(properties) && (
                    <div className="text-sm text-gray-600">
                      {(() => {
                        const selectedProperty = properties.find(
                          (p) =>
                            p.id.toString() ===
                            editRequestForm.selectedPropertyId,
                        );
                        return selectedProperty ? (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p>
                              <strong>العقار:</strong> {selectedProperty.title}
                            </p>
                            <p>
                              <strong>النوع:</strong> {selectedProperty.type}
                            </p>
                            <p>
                              <strong>السعر:</strong> {selectedProperty.price}{" "}
                              ر.س
                            </p>
                            <p>
                              <strong>المساحة:</strong> {selectedProperty.area}{" "}
                              م²
                            </p>
                            <p>
                              <strong>الغرف:</strong> {selectedProperty.beds}
                            </p>
                            <p>
                              <strong>الحمامات:</strong> {selectedProperty.bath}
                            </p>
                            <p>
                              <strong>العنوان:</strong>{" "}
                              {selectedProperty.address}
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
              </div>

              {/* project */}
              <div className="space-y-2">
                <Label htmlFor="selectedProject">اختيار المشروع</Label>
                <Select
                  value={editRequestForm.selectedProjectId}
                  onValueChange={(value) =>
                    setEditRequestForm({
                      ...editRequestForm,
                      selectedProjectId: value,
                    })
                  }
                  disabled={loadingProjects}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingProjects
                          ? "جاري تحميل المشاريع..."
                          : "اختر المشروع"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(projects) && projects.length > 0 ? (
                      projects.map((Project) => (
                        <SelectItem
                          key={Project.id}
                          value={Project.id.toString()}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {Project?.contents[0]?.title}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-projects" disabled>
                        لا توجد عقارات متاحة
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {newRequestErrors.selectedProjectId && (
                  <p className="text-xs text-red-500 mt-1">
                    {newRequestErrors.selectedProjectId}
                  </p>
                )}
                {editRequestForm.selectedProjectId &&
                  Array.isArray(projects) && (
                    <div className="text-sm text-gray-600">
                      {(() => {
                        const selectedProject = projects.find(
                          (p) =>
                            p.id.toString() ===
                            editRequestForm.selectedProjectId,
                        );
                        return selectedProject ? (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p>
                              <strong>المشروع:</strong>{" "}
                              {selectedProject?.contents[0]?.title}
                            </p>
                            <p>
                              <strong>العنوان:</strong>{" "}
                              {selectedProject?.contents[0]?.address}
                            </p>
                            <p>
                              <strong>الوصف:</strong>{" "}
                              {selectedProject?.contents[0]?.description}
                            </p>
                            <p>
                              <strong>المطور:</strong>{" "}
                              {selectedProject?.developer}
                            </p>
                            <p>
                              <strong>الأسعار المتفاوتة فيها:</strong>{" "}
                              {selectedProject?.price_range}
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
              </div>

              {/* الاولوية */}
              <div className="space-y-2">
                <Label htmlFor="editPriority">الأولوية</Label>
                <Select
                  value={editRequestForm.priority}
                  onValueChange={(value) =>
                    setEditRequestForm({ ...editRequestForm, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">عالية</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="low">منخفضة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUpdatingRequest}
            >
              إلغاء
            </Button>
            <Button onClick={handleSaveEdit} disabled={isUpdatingRequest}>
              {isUpdatingRequest ? "جاري التحديث..." : "حفظ التعديلات"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إضافة طلب شراء جديد</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">معلومات العميل</h3>

              <div className="space-y-2">
                <Label htmlFor="clientName">اسم العميل </Label>
                <Input
                  id="clientName"
                  value={newRequestForm.clientName}
                  onChange={(e) =>
                    setNewRequestForm({
                      ...newRequestForm,
                      clientName: e.target.value,
                    })
                  }
                  placeholder="أدخل اسم العميل بالعربية"
                />
                {newRequestErrors.clientName && (
                  <p className="text-xs text-red-500 mt-1">
                    {newRequestErrors.clientName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">البريد الإلكتروني</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={newRequestForm.clientEmail}
                  onChange={(e) =>
                    setNewRequestForm({
                      ...newRequestForm,
                      clientEmail: e.target.value,
                    })
                  }
                  placeholder="client@example.com"
                />
                {newRequestErrors.clientEmail && (
                  <p className="text-xs text-red-500 mt-1">
                    {newRequestErrors.clientEmail}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">رقم الهاتف</Label>
                <Input
                  id="clientPhone"
                  value={newRequestForm.clientPhone}
                  onChange={(e) =>
                    setNewRequestForm({
                      ...newRequestForm,
                      clientPhone: e.target.value,
                    })
                  }
                  placeholder="+966 50 123 4567"
                />
                {newRequestErrors.clientPhone && (
                  <p className="text-xs text-red-500 mt-1">
                    {newRequestErrors.clientPhone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientNationalId">رقم الهوية</Label>
                <Input
                  id="clientNationalId"
                  value={newRequestForm.clientNationalId}
                  onChange={(e) =>
                    setNewRequestForm({
                      ...newRequestForm,
                      clientNationalId: e.target.value,
                    })
                  }
                  placeholder="1234567890"
                />
                {newRequestErrors.clientNationalId && (
                  <p className="text-xs text-red-500 mt-1">
                    {newRequestErrors.clientNationalId}
                  </p>
                )}
              </div>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">معلومات العقار</h3>

              <div className="space-y-2">
                <Label htmlFor="selectedProperty">اختيار العقار</Label>
                <Select
                  value={newRequestForm.selectedPropertyId}
                  onValueChange={(value) =>
                    setNewRequestForm({
                      ...newRequestForm,
                      selectedPropertyId: value,
                    })
                  }
                  disabled={loadingProperties}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingProperties
                          ? "جاري تحميل العقارات..."
                          : "اختر العقار"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(properties) && properties.length > 0 ? (
                      properties.map((property) => (
                        <SelectItem
                          key={property.id}
                          value={property.id.toString()}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {property.title}
                            </span>
                            <span className="text-sm text-gray-500">
                              {property.type} - {property.price} ر.س -{" "}
                              {property.area} م²
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-properties" disabled>
                        لا توجد عقارات متاحة
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {newRequestErrors.selectedPropertyId && (
                  <p className="text-xs text-red-500 mt-1">
                    {newRequestErrors.selectedPropertyId}
                  </p>
                )}
                {newRequestForm.selectedPropertyId &&
                  Array.isArray(properties) && (
                    <div className="text-sm text-gray-600">
                      {(() => {
                        const selectedProperty = properties.find(
                          (p) =>
                            p.id.toString() ===
                            newRequestForm.selectedPropertyId,
                        );
                        return selectedProperty ? (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p>
                              <strong>العقار:</strong> {selectedProperty.title}
                            </p>
                            <p>
                              <strong>النوع:</strong> {selectedProperty.type}
                            </p>
                            <p>
                              <strong>السعر:</strong> {selectedProperty.price}{" "}
                              ر.س
                            </p>
                            <p>
                              <strong>المساحة:</strong> {selectedProperty.area}{" "}
                              م²
                            </p>
                            <p>
                              <strong>الغرف:</strong> {selectedProperty.beds}
                            </p>
                            <p>
                              <strong>الحمامات:</strong> {selectedProperty.bath}
                            </p>
                            <p>
                              <strong>العنوان:</strong>{" "}
                              {selectedProperty.address}
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
              </div>

              {/* project */}
              <div className="space-y-2">
                <Label htmlFor="selectedProject">اختيار المشروع</Label>
                <Select
                  value={newRequestForm.selectedProjectId}
                  onValueChange={(value) =>
                    setNewRequestForm({
                      ...newRequestForm,
                      selectedProjectId: value,
                    })
                  }
                  disabled={loadingProjects}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingProjects
                          ? "جاري تحميل المشاريع..."
                          : "اختر المشروع"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(projects) && projects.length > 0 ? (
                      projects.map((Project) => (
                        <SelectItem
                          key={Project.id}
                          value={Project.id.toString()}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {Project?.contents[0]?.title}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-projects" disabled>
                        لا توجد عقارات متاحة
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {newRequestErrors.selectedProjectId && (
                  <p className="text-xs text-red-500 mt-1">
                    {newRequestErrors.selectedProjectId}
                  </p>
                )}
                {newRequestForm.selectedProjectId &&
                  Array.isArray(projects) && (
                    <div className="text-sm text-gray-600">
                      {(() => {
                        const selectedProject = projects.find(
                          (p) =>
                            p.id.toString() ===
                            newRequestForm.selectedProjectId,
                        );
                        return selectedProject ? (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p>
                              <strong>المشروع:</strong>{" "}
                              {selectedProject?.contents[0]?.title}
                            </p>
                            <p>
                              <strong>العنوان:</strong>{" "}
                              {selectedProject?.contents[0]?.address}
                            </p>
                            <p>
                              <strong>الوصف:</strong>{" "}
                              {selectedProject?.contents[0]?.description}
                            </p>
                            <p>
                              <strong>المطور:</strong>{" "}
                              {selectedProject?.developer}
                            </p>
                            <p>
                              <strong>الأسعار المتفاوتة فيها:</strong>{" "}
                              {selectedProject?.price_range}
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="priority">الأولوية</Label>
              <Select
                value={newRequestForm.priority}
                onValueChange={(value) =>
                  setNewRequestForm({ ...newRequestForm, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفضة</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="urgent">عاجل</SelectItem>
                </SelectContent>
              </Select>
              {editRequestErrors.priority && (
                <p className="text-xs text-red-500 mt-1">
                  {editRequestErrors.priority}
                </p>
              )}
              {newRequestErrors.priority && (
                <p className="text-xs text-red-500 mt-1">
                  {newRequestErrors.priority}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات إضافية</Label>
              <Textarea
                id="notes"
                value={newRequestForm.notes}
                onChange={(e) =>
                  setNewRequestForm({
                    ...newRequestForm,
                    notes: e.target.value,
                  })
                }
                placeholder="أدخل أي ملاحظات إضافية..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse mt-6">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isCreatingRequest}
            >
              إلغاء
            </Button>
            <Button onClick={handleAddNewRequest} disabled={isCreatingRequest}>
              {isCreatingRequest ? "جاري الإنشاء..." : "إضافة الطلب"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={stageTransition.isOpen}
        onOpenChange={(open) =>
          !open &&
          setStageTransition({
            isOpen: false,
            requestId: "",
            fromStage: "",
            toStage: "",
            requirements: [],
          })
        }
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              الانتقال من {getStageNameAr(stageTransition.fromStage)} إلى{" "}
              {getStageNameAr(stageTransition.toStage)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Requirements Checklist */}
            <div className="space-y-4">
              <h3 className="font-semibold">المتطلبات المطلوبة:</h3>
              <div className="space-y-3">
                {getStageRequirements(
                  stageTransition.fromStage,
                  stageTransition.toStage,
                ).map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <input
                      type="checkbox"
                      id={req.id}
                      checked={transitionForm.requirements?.[req.id] || false}
                      onChange={(e) =>
                        setTransitionForm({
                          ...transitionForm,
                          requirements: {
                            ...transitionForm.requirements,
                            [req.id]: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor={req.id} className="text-sm">
                      {req.labelAr}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transitionDate">التاريخ</Label>
                <Input
                  id="transitionDate"
                  type="date"
                  value={transitionForm.date || ""}
                  onChange={(e) =>
                    setTransitionForm({
                      ...transitionForm,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transitionAmount">المبلغ (ر.س)</Label>
                <Input
                  id="transitionAmount"
                  type="number"
                  value={transitionForm.amount || ""}
                  onChange={(e) =>
                    setTransitionForm({
                      ...transitionForm,
                      amount: Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transitionNotes">ملاحظات</Label>
              <Textarea
                id="transitionNotes"
                value={transitionForm.notes || ""}
                onChange={(e) =>
                  setTransitionForm({
                    ...transitionForm,
                    notes: e.target.value,
                  })
                }
                placeholder="أدخل أي ملاحظات..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse mt-6">
            <Button
              variant="outline"
              onClick={() =>
                setStageTransition({
                  isOpen: false,
                  requestId: "",
                  fromStage: "",
                  toStage: "",
                  requirements: [],
                })
              }
              disabled={isTransitioningStage}
            >
              إلغاء
            </Button>
            <Button
              onClick={completeStageTransition}
              disabled={isTransitioningStage}
            >
              {isTransitioningStage ? "جاري الانتقال..." : "تأكيد الانتقال"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog.isOpen}
        onOpenChange={cancelDeleteRequest}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              تأكيد حذف طلب الشراء
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-red-800 font-medium">
                    ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه!
                  </p>
                  <p className="text-red-700 text-sm">
                    سيتم حذف طلب الشراء التالي نهائياً من النظام:
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">رقم الطلب:</span>
                  <span className="text-gray-900">
                    {deleteConfirmDialog.requestNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">اسم العميل:</span>
                  <span className="text-gray-900">
                    {deleteConfirmDialog.clientName}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>ملاحظة مهمة:</strong> جميع البيانات المرتبطة بهذا الطلب
                بما في ذلك المراحل والمستندات والملاحظات ستتم إزالتها نهائياً.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse mt-6">
            <Button
              variant="outline"
              onClick={cancelDeleteRequest}
              disabled={isDeletingRequest}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteRequest}
              disabled={isDeletingRequest}
            >
              {isDeletingRequest ? "جاري الحذف..." : "تأكيد الحذف"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
