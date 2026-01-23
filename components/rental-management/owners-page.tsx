"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination2";
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Phone,
  Mail,
  Building2,
  Loader2,
  AlertCircle,
  MoreVertical,
  MapPin,
  Calendar,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Link2,
  ListChecks,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useStore from "@/context/Store";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface Property {
  id: number;
  featured_image?: string;
  price?: string;
  beds?: number;
  bath?: number;
  area?: string;
}

interface Owner {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  id_number: string;
  address: string;
  city: string;
  email_verified_at: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  properties: Property[];
}

export function OwnersPage() {
  const router = useRouter();

  const {
    rentalOwnerDashboard,
    setRentalOwnerDashboard,
    fetchOwnerRentals,
    fetchOwnerDetails,
    fetchAvailableProperties,
    assignPropertiesToOwner,
    updateOwnerRental,
    changeOwnerPassword,
    fetchAssignedProperties,
    removePropertyFromOwner,
    deleteOwnerRental,
    createOwnerRental,
  } = useStore();

  const {
    owners,
    pagination,
    loading,
    error,
    searchTerm,
    statusFilter,
    isInitialized,
    selectedOwnerDetails,
    loadingOwnerDetails,
    ownerDetailsError,
    availableProperties,
    loadingProperties,
    assignedProperties,
    assignedPropertiesPagination,
    loadingAssignedProperties,
    assignedPropertiesError,
  } = rentalOwnerDashboard;

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAssignPropertiesDialogOpen, setIsAssignPropertiesDialogOpen] =
    useState(false);
  const [selectedOwnerForAssign, setSelectedOwnerForAssign] =
    useState<Owner | null>(null);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);
  const [assigningProperties, setAssigningProperties] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [propertySearchTerm, setPropertySearchTerm] = useState("");

  // Edit Owner Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOwnerForEdit, setSelectedOwnerForEdit] =
    useState<Owner | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    is_active: true,
  });
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [updatingOwner, setUpdatingOwner] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // View Assigned Properties Dialog State
  const [isViewPropertiesDialogOpen, setIsViewPropertiesDialogOpen] =
    useState(false);
  const [selectedOwnerForView, setSelectedOwnerForView] =
    useState<Owner | null>(null);
  const [isRemovePropertyDialogOpen, setIsRemovePropertyDialogOpen] =
    useState(false);
  const [selectedPropertyForRemove, setSelectedPropertyForRemove] = useState<
    number | null
  >(null);
  const [removingProperty, setRemovingProperty] = useState(false);

  // Delete Owner Dialog State
  const [isDeleteOwnerDialogOpen, setIsDeleteOwnerDialogOpen] = useState(false);
  const [selectedOwnerForDelete, setSelectedOwnerForDelete] =
    useState<Owner | null>(null);
  const [deletingOwner, setDeletingOwner] = useState(false);

  // Create Owner Dialog State
  const [isCreateOwnerDialogOpen, setIsCreateOwnerDialogOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    id_number: "",
    address: "",
    city: "",
    is_active: true,
  });
  const [creatingOwner, setCreatingOwner] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Fetch owners on mount and when filters change
  useEffect(() => {
    if (!isInitialized) {
      fetchOwnerRentals(1, 15);
    }
  }, [isInitialized, fetchOwnerRentals]);

  // Refetch when search or filter changes
  useEffect(() => {
    if (isInitialized) {
      const timeoutId = setTimeout(() => {
        fetchOwnerRentals(1, 15);
      }, 500); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, statusFilter, isInitialized]);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchOwnerRentals(page, 15);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "غير متوفر";
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
          <UserCheck className="h-3 w-3 ml-1" />
          نشط
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
        <UserX className="h-3 w-3 ml-1" />
        غير نشط
      </Badge>
    );
  };

  // View owner details
  const viewOwnerDetails = (owner: Owner) => {
    setIsDetailsDialogOpen(true);
    fetchOwnerDetails(owner.id);
  };

  // Close dialog and clear details
  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setRentalOwnerDashboard({
      selectedOwnerDetails: null,
      ownerDetailsError: null,
    });
  };

  // Open assign properties dialog
  const openAssignPropertiesDialog = (owner: Owner) => {
    setSelectedOwnerForAssign(owner);
    setIsAssignPropertiesDialogOpen(true);
    setSelectedPropertyIds([]);
    setAssignError(null);
    setPropertySearchTerm("");
    fetchAvailableProperties();
  };

  // Close assign properties dialog
  const closeAssignPropertiesDialog = () => {
    setIsAssignPropertiesDialogOpen(false);
    setSelectedOwnerForAssign(null);
    setSelectedPropertyIds([]);
    setAssignError(null);
    setPropertySearchTerm("");
  };

  // Toggle property selection
  const togglePropertySelection = (propertyId: number) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId],
    );
  };

  // Handle assign properties
  const handleAssignProperties = async () => {
    if (!selectedOwnerForAssign || selectedPropertyIds.length === 0) {
      setAssignError("الرجاء اختيار عقار واحد على الأقل");
      return;
    }

    setAssigningProperties(true);
    setAssignError(null);

    const result = await assignPropertiesToOwner(
      selectedOwnerForAssign.id,
      selectedPropertyIds,
    );

    setAssigningProperties(false);

    if (result.success) {
      toast.success("تم ربط العقارات بالمالك بنجاح");
      closeAssignPropertiesDialog();
      // Refresh owner details if the details dialog is open
      if (
        selectedOwnerDetails &&
        selectedOwnerDetails.id === selectedOwnerForAssign.id
      ) {
        fetchOwnerDetails(selectedOwnerForAssign.id);
      }
      // Refresh owners list
      fetchOwnerRentals(pagination?.current_page || 1, 15);
    } else {
      setAssignError(result.error || "حدث خطأ أثناء ربط العقارات");
    }
  };

  // Filter properties based on search
  const filteredProperties = Array.isArray(availableProperties)
    ? availableProperties.filter(
        (property: any) =>
          property.id?.toString().includes(propertySearchTerm) ||
          property.price?.toString().includes(propertySearchTerm) ||
          property.beds?.toString().includes(propertySearchTerm),
      )
    : [];

  // Open edit dialog
  const openEditDialog = (owner: Owner) => {
    setSelectedOwnerForEdit(owner);
    setEditFormData({
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      city: owner.city || "",
      is_active: owner.is_active,
    });
    setPasswordData({
      password: "",
      confirmPassword: "",
    });
    setEditError(null);
    setIsEditDialogOpen(true);
  };

  // Close edit dialog
  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedOwnerForEdit(null);
    setEditError(null);
  };

  // Handle form data change
  const handleEditFormChange = (field: string, value: any) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle password change
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle update owner
  const handleUpdateOwner = async () => {
    if (!selectedOwnerForEdit) return;

    if (!editFormData.name || !editFormData.email || !editFormData.phone) {
      setEditError("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    setUpdatingOwner(true);
    setEditError(null);

    const result = await updateOwnerRental(
      selectedOwnerForEdit.id,
      editFormData,
    );

    setUpdatingOwner(false);

    if (result.success) {
      toast.success("تم تحديث بيانات المالك بنجاح");
      closeEditDialog();
      fetchOwnerRentals(pagination?.current_page || 1, 15);
    } else {
      setEditError(result.error || "حدث خطأ أثناء تحديث البيانات");
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!selectedOwnerForEdit) return;

    if (!passwordData.password) {
      setEditError("الرجاء إدخال كلمة المرور الجديدة");
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      setEditError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (passwordData.password.length < 8) {
      setEditError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }

    setUpdatingOwner(true);
    setEditError(null);

    const result = await changeOwnerPassword(
      selectedOwnerForEdit.id,
      passwordData.password,
    );

    setUpdatingOwner(false);

    if (result.success) {
      toast.success("تم تغيير كلمة المرور بنجاح");
      closeEditDialog();
    } else {
      setEditError(result.error || "حدث خطأ أثناء تغيير كلمة المرور");
    }
  };

  // Open view assigned properties dialog
  const openViewPropertiesDialog = (owner: Owner) => {
    setSelectedOwnerForView(owner);
    setIsViewPropertiesDialogOpen(true);
    fetchAssignedProperties(owner.id, 1, 15);
  };

  // Close view assigned properties dialog
  const closeViewPropertiesDialog = () => {
    setIsViewPropertiesDialogOpen(false);
    setSelectedOwnerForView(null);
    setRentalOwnerDashboard({
      assignedProperties: [],
      assignedPropertiesPagination: null,
      assignedPropertiesError: null,
    });
  };

  // Handle assigned properties page change
  const handleAssignedPropertiesPageChange = (page: number) => {
    if (selectedOwnerForView) {
      fetchAssignedProperties(selectedOwnerForView.id, page, 15);
    }
  };

  // Open remove property dialog
  const openRemovePropertyDialog = (propertyId: number) => {
    setSelectedPropertyForRemove(propertyId);
    setIsRemovePropertyDialogOpen(true);
  };

  // Close remove property dialog
  const closeRemovePropertyDialog = () => {
    setIsRemovePropertyDialogOpen(false);
    setSelectedPropertyForRemove(null);
  };

  // Handle remove property from owner
  const handleRemoveProperty = async () => {
    console.log("handleRemoveProperty called");
    console.log("selectedOwnerForView:", selectedOwnerForView);
    console.log("selectedPropertyForRemove:", selectedPropertyForRemove);

    if (!selectedOwnerForView || !selectedPropertyForRemove) {
      console.log("Missing required data");
      return;
    }

    setRemovingProperty(true);
    console.log("Calling removePropertyFromOwner...");
    const result = await removePropertyFromOwner(
      selectedOwnerForView.id,
      selectedPropertyForRemove,
    );
    console.log("Result:", result);
    setRemovingProperty(false);

    if (result.success) {
      toast.success("تم إلغاء ربط العقار بنجاح");
      closeRemovePropertyDialog();
      // Refresh if no properties left on current page
      if (
        assignedProperties.length === 1 &&
        assignedPropertiesPagination &&
        assignedPropertiesPagination.current_page > 1
      ) {
        fetchAssignedProperties(
          selectedOwnerForView.id,
          assignedPropertiesPagination.current_page - 1,
          15,
        );
      } else if (selectedOwnerForView) {
        // Refresh current page
        fetchAssignedProperties(
          selectedOwnerForView.id,
          assignedPropertiesPagination?.current_page || 1,
          15,
        );
      }
    } else {
      toast.error(result.error || "حدث خطأ أثناء إلغاء ربط العقار");
      closeRemovePropertyDialog();
    }
  };

  // Open delete owner dialog
  const openDeleteOwnerDialog = (owner: Owner) => {
    setSelectedOwnerForDelete(owner);
    setIsDeleteOwnerDialogOpen(true);
  };

  // Close delete owner dialog
  const closeDeleteOwnerDialog = () => {
    setIsDeleteOwnerDialogOpen(false);
    setSelectedOwnerForDelete(null);
  };

  // Handle delete owner
  const handleDeleteOwner = async () => {
    if (!selectedOwnerForDelete) return;

    setDeletingOwner(true);

    const result = await deleteOwnerRental(selectedOwnerForDelete.id);

    setDeletingOwner(false);

    if (result.success) {
      toast.success("تم حذف المالك بنجاح");
      closeDeleteOwnerDialog();
      fetchOwnerRentals(pagination?.current_page || 1, 15);
    } else {
      toast.error(result.error || "حدث خطأ أثناء حذف المالك");
    }
  };

  // Open create owner dialog
  const openCreateOwnerDialog = () => {
    setCreateFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      id_number: "",
      address: "",
      city: "",
      is_active: true,
    });
    setCreateError(null);
    setIsCreateOwnerDialogOpen(true);
  };

  // Close create owner dialog
  const closeCreateOwnerDialog = () => {
    setIsCreateOwnerDialogOpen(false);
    setCreateError(null);
  };

  // Handle create form change
  const handleCreateFormChange = (field: string, value: any) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle create owner
  const handleCreateOwner = async () => {
    // Validation
    if (
      !createFormData.name ||
      !createFormData.email ||
      !createFormData.phone ||
      !createFormData.password
    ) {
      setCreateError("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    if (createFormData.password !== createFormData.confirmPassword) {
      setCreateError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (createFormData.password.length < 8) {
      setCreateError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }

    setCreatingOwner(true);
    setCreateError(null);

    // Remove confirmPassword from data
    const { confirmPassword, ...ownerData } = createFormData;

    const result = await createOwnerRental(ownerData);

    setCreatingOwner(false);

    if (result.success) {
      toast.success("تم إنشاء المالك بنجاح");
      closeCreateOwnerDialog();
      fetchOwnerRentals(1, 15);
    } else {
      setCreateError(result.error || "حدث خطأ أثناء إنشاء المالك");
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="h-8 w-8" />
                  إدارة الملاك
                </h1>
                <p className="text-gray-500 mt-1">
                  إدارة وعرض معلومات الملاك في النظام
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => router.push("/dashboard/rental-management")}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowRight className="h-5 w-5" />
                  العودة لإدارة الايجارات
                </Button>
                <Button onClick={openCreateOwnerDialog} className="gap-2">
                  <Plus className="h-5 w-5" />
                  إضافة مالك جديد
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
                  value={searchTerm}
                  onChange={(e) =>
                    setRentalOwnerDashboard({ searchTerm: e.target.value })
                  }
                  className="pr-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  setRentalOwnerDashboard({ statusFilter: v })
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="ml-2 h-4 w-4" />
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        إجمالي الملاك
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {pagination?.total || 0}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        الملاك النشطون
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {owners.filter((o: Owner) => o.is_active).length}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        إجمالي العقارات
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {owners.reduce(
                          (sum: number, o: Owner) =>
                            sum + (o.properties?.length || 0),
                          0,
                        )}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Owners Table */}
            <div
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              dir="rtl"
            >
              <div className="overflow-x-auto">
                {loading && !isInitialized ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      حدث خطأ
                    </h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Button onClick={() => fetchOwnerRentals(1, 15)}>
                      إعادة المحاولة
                    </Button>
                  </div>
                ) : owners.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Users className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد بيانات
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== "all"
                        ? "جرب تعديل معايير البحث"
                        : "لا يوجد ملاك مسجلين بعد"}
                    </p>
                  </div>
                ) : (
                  <>
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-300">
                        <tr>
                          <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                            المالك
                          </th>
                          <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                            معلومات الاتصال
                          </th>
                          <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                            الموقع
                          </th>
                          <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                            العقارات
                          </th>
                          <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                            الحالة
                          </th>
                          <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                            تاريخ التسجيل
                          </th>
                          <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {owners.map((owner: Owner, index: number) => (
                          <tr
                            key={owner.id}
                            className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 hover:shadow-sm ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-25"
                            }`}
                          >
                            {/* المالك */}
                            <td className="px-6 py-5">
                              <div className="flex items-center space-x-4 space-x-reverse">
                                <div className="flex-shrink-0">
                                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                      {owner.name
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")
                                        .slice(0, 2) || "??"}
                                    </span>
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-bold text-gray-900 truncate">
                                    {owner.name}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    رقم الهوية: {owner.id_number || "غير متوفر"}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* معلومات الاتصال */}
                            <td className="px-6 py-5">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-700">
                                  <Phone className="h-3 w-3 ml-2 text-gray-400" />
                                  {owner.phone}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 truncate max-w-[200px]">
                                  <Mail className="h-3 w-3 ml-2 text-gray-400" />
                                  {owner.email}
                                </div>
                              </div>
                            </td>

                            {/* الموقع */}
                            <td className="px-6 py-5">
                              <div className="text-sm text-gray-700">
                                <div className="flex items-center mb-1">
                                  <MapPin className="h-3 w-3 ml-1 text-gray-400" />
                                  {owner.city || "غير محدد"}
                                </div>
                                {owner.address && (
                                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                    {owner.address}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* العقارات */}
                            <td className="px-6 py-5">
                              <div className="text-sm">
                                <div className="flex items-center">
                                  <Building2 className="h-4 w-4 ml-2 text-purple-500" />
                                  <span className="font-semibold text-gray-900">
                                    {owner.properties?.length || 0}
                                  </span>
                                  <span className="text-gray-500 mr-1">
                                    عقار
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* الحالة */}
                            <td className="px-6 py-5">
                              {getStatusBadge(owner.is_active)}
                            </td>

                            {/* تاريخ التسجيل */}
                            <td className="px-6 py-5">
                              <div className="text-sm text-gray-700">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 ml-2 text-gray-400" />
                                  {formatDate(owner.created_at)}
                                </div>
                                {owner.last_login_at && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    آخر دخول: {formatDate(owner.last_login_at)}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* الإجراءات */}
                            <td className="px-6 py-5">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    data-dropdown
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="text-right"
                                >
                                  <DropdownMenuItem
                                    onClick={() => viewOwnerDetails(owner)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4 ml-2" />
                                    عرض التفاصيل
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openEditDialog(owner)}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="h-4 w-4 ml-2" />
                                    تعديل
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      openAssignPropertiesDialog(owner)
                                    }
                                    className="cursor-pointer"
                                  >
                                    <Link2 className="h-4 w-4 ml-2" />
                                    ربط عقارات بالمالك
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      openViewPropertiesDialog(owner)
                                    }
                                    className="cursor-pointer"
                                  >
                                    <ListChecks className="h-4 w-4 ml-2" />
                                    عرض العقارات المرتبطة
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => openDeleteOwnerDialog(owner)}
                                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 ml-2" />
                                    حذف
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {pagination && pagination.last_page > 1 && (
                      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            عرض {pagination.from} إلى {pagination.to} من أصل{" "}
                            {pagination.total} مالك
                          </div>
                          <Pagination>
                            <PaginationContent>
                              {pagination.current_page > 1 && (
                                <PaginationItem>
                                  <PaginationPrevious
                                    onClick={() =>
                                      handlePageChange(
                                        pagination.current_page - 1,
                                      )
                                    }
                                    className="cursor-pointer"
                                  />
                                </PaginationItem>
                              )}

                              {Array.from(
                                { length: pagination.last_page },
                                (_, i) => i + 1,
                              )
                                .filter((page) => {
                                  const current = pagination.current_page;
                                  return (
                                    page === 1 ||
                                    page === pagination.last_page ||
                                    (page >= current - 1 && page <= current + 1)
                                  );
                                })
                                .map((page, index, array) => {
                                  if (
                                    index > 0 &&
                                    page - array[index - 1] > 1
                                  ) {
                                    return (
                                      <>
                                        <PaginationItem
                                          key={`ellipsis-${page}`}
                                        >
                                          <span className="px-2">...</span>
                                        </PaginationItem>
                                        <PaginationItem key={page}>
                                          <PaginationLink
                                            onClick={() =>
                                              handlePageChange(page)
                                            }
                                            isActive={
                                              page === pagination.current_page
                                            }
                                            className="cursor-pointer"
                                          >
                                            {page}
                                          </PaginationLink>
                                        </PaginationItem>
                                      </>
                                    );
                                  }
                                  return (
                                    <PaginationItem key={page}>
                                      <PaginationLink
                                        onClick={() => handlePageChange(page)}
                                        isActive={
                                          page === pagination.current_page
                                        }
                                        className="cursor-pointer"
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                })}

                              {pagination.current_page <
                                pagination.last_page && (
                                <PaginationItem>
                                  <PaginationNext
                                    onClick={() =>
                                      handlePageChange(
                                        pagination.current_page + 1,
                                      )
                                    }
                                    className="cursor-pointer"
                                  />
                                </PaginationItem>
                              )}
                            </PaginationContent>
                          </Pagination>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Owner Details Dialog */}
            <Dialog
              open={isDetailsDialogOpen}
              onOpenChange={closeDetailsDialog}
            >
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    تفاصيل المالك
                  </DialogTitle>
                  <DialogDescription>
                    معلومات تفصيلية عن المالك والعقارات المرتبطة
                  </DialogDescription>
                </DialogHeader>

                {loadingOwnerDetails ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : ownerDetailsError ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      حدث خطأ
                    </h3>
                    <p className="text-gray-500 mb-4">{ownerDetailsError}</p>
                    <Button
                      onClick={() =>
                        selectedOwnerDetails &&
                        fetchOwnerDetails(selectedOwnerDetails.id)
                      }
                    >
                      إعادة المحاولة
                    </Button>
                  </div>
                ) : (
                  selectedOwnerDetails && (
                    <div className="space-y-6">
                      {/* Owner Info */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                              {selectedOwnerDetails.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {selectedOwnerDetails.name}
                            </h3>
                            {getStatusBadge(selectedOwnerDetails.is_active)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">رقم الهوية</p>
                            <p className="font-semibold text-gray-900">
                              {selectedOwnerDetails.id_number || "غير متوفر"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              رقم المستخدم
                            </p>
                            <p className="font-semibold text-gray-900">
                              {selectedOwnerDetails.user_id}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">رقم الهاتف</p>
                            <p className="font-semibold text-gray-900">
                              {selectedOwnerDetails.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              البريد الإلكتروني
                            </p>
                            <p className="font-semibold text-gray-900 truncate">
                              {selectedOwnerDetails.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">المدينة</p>
                            <p className="font-semibold text-gray-900">
                              {selectedOwnerDetails.city || "غير محدد"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              تاريخ التسجيل
                            </p>
                            <p className="font-semibold text-gray-900">
                              {formatDate(selectedOwnerDetails.created_at)}
                            </p>
                          </div>
                        </div>

                        {selectedOwnerDetails.address && (
                          <div>
                            <p className="text-sm text-gray-500">العنوان</p>
                            <p className="font-semibold text-gray-900">
                              {selectedOwnerDetails.address}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Properties */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          العقارات (
                          {selectedOwnerDetails.properties?.length || 0})
                        </h4>
                        {selectedOwnerDetails.properties &&
                        selectedOwnerDetails.properties.length > 0 ? (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {selectedOwnerDetails.properties.map(
                              (property: Property) => (
                                <div
                                  key={property.id}
                                  className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-semibold text-gray-900">
                                        عقار #{property.id}
                                      </p>
                                      {property.beds && property.bath && (
                                        <p className="text-sm text-gray-500">
                                          {property.beds} غرف • {property.bath}{" "}
                                          حمام
                                        </p>
                                      )}
                                      {property.area && (
                                        <p className="text-xs text-gray-400">
                                          المساحة: {property.area}
                                        </p>
                                      )}
                                    </div>
                                    {property.price && (
                                      <p className="font-bold text-blue-600">
                                        {property.price} ريال
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">
                              لا توجد عقارات مرتبطة
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}

                <DialogFooter>
                  <Button onClick={closeDetailsDialog} variant="outline">
                    إغلاق
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Assign Properties Dialog */}
            <Dialog
              open={isAssignPropertiesDialogOpen}
              onOpenChange={closeAssignPropertiesDialog}
            >
              <DialogContent
                className="max-w-4xl max-h-[90vh] overflow-y-auto"
                dir="rtl"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Link2 className="h-6 w-6" />
                    ربط عقارات بالمالك
                  </DialogTitle>
                  <DialogDescription>
                    {selectedOwnerForAssign && (
                      <span>
                        ربط عقارات بـ{" "}
                        <strong>{selectedOwnerForAssign.name}</strong>
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Search Properties */}
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث عن عقار (رقم العقار، السعر، عدد الغرف...)"
                      value={propertySearchTerm}
                      onChange={(e) => setPropertySearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  {/* Error Message */}
                  {assignError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <span>{assignError}</span>
                    </div>
                  )}

                  {/* Selected Count */}
                  {selectedPropertyIds.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-blue-700">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>تم اختيار {selectedPropertyIds.length} عقار</span>
                    </div>
                  )}

                  {/* Properties List */}
                  <div className="space-y-3">
                    {loadingProperties ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : filteredProperties.length === 0 ? (
                      <div className="text-center py-20">
                        <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          لا توجد عقارات
                        </h3>
                        <p className="text-gray-500">
                          {propertySearchTerm
                            ? "لم يتم العثور على عقارات مطابقة للبحث"
                            : "لا توجد عقارات متاحة حالياً"}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1">
                        {filteredProperties.map((property: any) => {
                          const isSelected = selectedPropertyIds.includes(
                            property.id,
                          );
                          return (
                            <div
                              key={property.id}
                              onClick={() =>
                                togglePropertySelection(property.id)
                              }
                              className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50 shadow-md"
                                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                              }`}
                            >
                              {/* Selection Indicator */}
                              {isSelected && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1">
                                  <CheckCircle2 className="h-4 w-4" />
                                </div>
                              )}

                              {/* Property Image */}
                              {property.featured_image_url && (
                                <img
                                  src={property.featured_image_url}
                                  alt={`عقار ${property.id}`}
                                  className="w-full h-32 object-cover rounded-md mb-2"
                                />
                              )}

                              {/* Property Info */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                  <span className="font-semibold text-gray-900">
                                    عقار #{property.id}
                                  </span>
                                  {property.price && (
                                    <span className="text-blue-600 font-bold text-sm">
                                      {property.price} ريال
                                    </span>
                                  )}
                                </div>

                                {(property.beds || property.bath) && (
                                  <div className="text-sm text-gray-600 flex items-center gap-2">
                                    {property.beds && (
                                      <span>{property.beds} غرف</span>
                                    )}
                                    {property.beds && property.bath && (
                                      <span>•</span>
                                    )}
                                    {property.bath && (
                                      <span>{property.bath} حمام</span>
                                    )}
                                  </div>
                                )}

                                {property.area && (
                                  <div className="text-xs text-gray-500">
                                    المساحة: {property.area} م²
                                  </div>
                                )}

                                {property.property_status && (
                                  <Badge
                                    className={`text-xs ${
                                      property.property_status === "available"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {property.property_status === "available"
                                      ? "متاح"
                                      : property.property_status}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    onClick={closeAssignPropertiesDialog}
                    variant="outline"
                    disabled={assigningProperties}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleAssignProperties}
                    disabled={
                      assigningProperties || selectedPropertyIds.length === 0
                    }
                    className="gap-2"
                  >
                    {assigningProperties ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        جاري الربط...
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4" />
                        ربط العقارات ({selectedPropertyIds.length})
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Owner Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
              <DialogContent
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                dir="rtl"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Edit className="h-6 w-6" />
                    تعديل بيانات المالك
                  </DialogTitle>
                  <DialogDescription>
                    {selectedOwnerForEdit && (
                      <span>
                        تعديل بيانات{" "}
                        <strong>{selectedOwnerForEdit.name}</strong>
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">معلومات المالك</TabsTrigger>
                    <TabsTrigger value="password">
                      تغيير كلمة المرور
                    </TabsTrigger>
                  </TabsList>

                  {/* Owner Info Tab */}
                  <TabsContent value="info" className="space-y-4 mt-4">
                    {editError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-5 w-5" />
                        <span>{editError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">الاسم *</Label>
                        <Input
                          id="edit-name"
                          value={editFormData.name}
                          onChange={(e) =>
                            handleEditFormChange("name", e.target.value)
                          }
                          placeholder="أدخل اسم المالك"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-email">البريد الإلكتروني *</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editFormData.email}
                          onChange={(e) =>
                            handleEditFormChange("email", e.target.value)
                          }
                          placeholder="example@email.com"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-phone">رقم الهاتف *</Label>
                        <Input
                          id="edit-phone"
                          value={editFormData.phone}
                          onChange={(e) =>
                            handleEditFormChange("phone", e.target.value)
                          }
                          placeholder="05XXXXXXXX"
                        />
                      </div>

                      {/* City */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-city">المدينة</Label>
                        <Input
                          id="edit-city"
                          value={editFormData.city}
                          onChange={(e) =>
                            handleEditFormChange("city", e.target.value)
                          }
                          placeholder="أدخل المدينة"
                        />
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>حالة الحساب</Label>
                        <p className="text-sm text-muted-foreground">
                          {editFormData.is_active
                            ? "الحساب نشط"
                            : "الحساب غير نشط"}
                        </p>
                      </div>
                      <Switch
                        checked={editFormData.is_active}
                        onCheckedChange={(checked) =>
                          handleEditFormChange("is_active", checked)
                        }
                      />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        onClick={closeEditDialog}
                        variant="outline"
                        disabled={updatingOwner}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleUpdateOwner}
                        disabled={updatingOwner}
                        className="gap-2"
                      >
                        {updatingOwner ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            حفظ التغييرات
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </TabsContent>

                  {/* Password Tab */}
                  <TabsContent value="password" className="space-y-4 mt-4">
                    {editError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-5 w-5" />
                        <span>{editError}</span>
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">
                          تعليمات كلمة المرور:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>يجب أن تكون 8 أحرف على الأقل</li>
                          <li>يُنصح باستخدام مزيج من الأحرف والأرقام</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* New Password */}
                      <div className="space-y-2">
                        <Label htmlFor="new-password">
                          كلمة المرور الجديدة
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordData.password}
                          onChange={(e) =>
                            handlePasswordChange("password", e.target.value)
                          }
                          placeholder="أدخل كلمة المرور الجديدة"
                        />
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          تأكيد كلمة المرور
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            handlePasswordChange(
                              "confirmPassword",
                              e.target.value,
                            )
                          }
                          placeholder="أعد إدخال كلمة المرور"
                        />
                      </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        onClick={closeEditDialog}
                        variant="outline"
                        disabled={updatingOwner}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleChangePassword}
                        disabled={updatingOwner}
                        className="gap-2"
                      >
                        {updatingOwner ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            جاري التغيير...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4" />
                            تغيير كلمة المرور
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* View Assigned Properties Dialog - Custom HTML with Portal */}
            {isViewPropertiesDialogOpen &&
              typeof document !== "undefined" &&
              createPortal(
                <div
                  className="fixed inset-0 flex items-center justify-center p-4"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9998,
                  }}
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) {
                      closeViewPropertiesDialog();
                    }
                  }}
                >
                  <div
                    className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
                    dir="rtl"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                            <ListChecks className="h-6 w-6" />
                            العقارات المرتبطة
                          </h2>
                          {selectedOwnerForView && (
                            <p className="text-sm text-gray-500 mt-1">
                              عرض العقارات المرتبطة بـ{" "}
                              <strong>{selectedOwnerForView.name}</strong>
                            </p>
                          )}
                        </div>
                        <button
                          onClick={closeViewPropertiesDialog}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {loadingAssignedProperties ? (
                        <div className="flex items-center justify-center py-20">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                      ) : assignedPropertiesError ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            حدث خطأ
                          </h3>
                          <p className="text-gray-500 mb-4">
                            {assignedPropertiesError}
                          </p>
                          <button
                            onClick={() =>
                              selectedOwnerForView &&
                              fetchAssignedProperties(
                                selectedOwnerForView.id,
                                1,
                                15,
                              )
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                          >
                            إعادة المحاولة
                          </button>
                        </div>
                      ) : assignedProperties.length === 0 ? (
                        <div className="text-center py-20">
                          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            لا توجد عقارات مرتبطة
                          </h3>
                          <p className="text-gray-500">
                            لم يتم ربط أي عقارات بهذا المالك بعد
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Properties Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {assignedProperties.map((property: any) => (
                              <div
                                key={property.id}
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                              >
                                <div className="p-0">
                                  {/* Property Image */}
                                  {property.featured_image_url && (
                                    <div className="relative h-48 w-full">
                                      <img
                                        src={property.featured_image_url}
                                        alt={
                                          property.contents?.[0]?.title ||
                                          `عقار ${property.id}`
                                        }
                                        className="w-full h-full object-cover"
                                      />
                                      {property.featured && (
                                        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                          مميز
                                        </span>
                                      )}
                                      {property.property_status && (
                                        <span
                                          className={`absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded ${
                                            property.property_status ===
                                            "available"
                                              ? "bg-green-500"
                                              : "bg-gray-500"
                                          }`}
                                        >
                                          {property.property_status ===
                                          "available"
                                            ? "متاح"
                                            : property.property_status}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Property Info */}
                                  <div className="p-4 space-y-3">
                                    {/* Title */}
                                    <div>
                                      <h3 className="font-bold text-lg text-gray-900">
                                        {property.contents?.[0]?.title ||
                                          `عقار ${property.id}`}
                                      </h3>
                                      {property.category && (
                                        <p className="text-sm text-gray-500">
                                          {property.category.name}
                                        </p>
                                      )}
                                    </div>

                                    {/* Price */}
                                    {property.price && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-blue-600">
                                          {property.price} ريال
                                        </span>
                                        {property.purpose && (
                                          <span className="border border-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                                            {property.purpose === "rent"
                                              ? "للإيجار"
                                              : "للبيع"}
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {/* Property Details */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      {property.beds && (
                                        <div className="flex items-center gap-1">
                                          <Building2 className="h-4 w-4" />
                                          <span>{property.beds} غرف</span>
                                        </div>
                                      )}
                                      {property.bath && (
                                        <div className="flex items-center gap-1">
                                          <span>{property.bath} حمام</span>
                                        </div>
                                      )}
                                      {property.area && (
                                        <div className="flex items-center gap-1">
                                          <span>{property.area} م²</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Address */}
                                    {property.contents?.[0]?.address && (
                                      <div className="flex items-start gap-2 text-sm text-gray-500">
                                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2">
                                          {property.contents[0].address}
                                        </span>
                                      </div>
                                    )}

                                    {/* Features */}
                                    {property.features && (
                                      <div className="text-xs text-gray-500 line-clamp-1">
                                        المميزات: {property.features}
                                      </div>
                                    )}

                                    {/* Assignment Date */}
                                    {property.pivot?.assigned_at && (
                                      <div className="text-xs text-gray-400 pt-2 border-t">
                                        تم الربط:{" "}
                                        {formatDate(property.pivot.assigned_at)}
                                      </div>
                                    )}

                                    {/* Remove Button */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openRemovePropertyDialog(property.id)
                                      }
                                      className="w-full mt-2 px-3 py-2 border border-red-300 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                      <X className="h-4 w-4" />
                                      إلغاء الربط
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Pagination */}
                          {assignedPropertiesPagination &&
                            assignedPropertiesPagination.last_page > 1 && (
                              <div className="border-t border-gray-100 pt-4 mt-4">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                  <div className="text-sm text-gray-700">
                                    عرض {assignedPropertiesPagination.from} إلى{" "}
                                    {assignedPropertiesPagination.to} من أصل{" "}
                                    {assignedPropertiesPagination.total} عقار
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {assignedPropertiesPagination.current_page >
                                      1 && (
                                      <button
                                        onClick={() =>
                                          handleAssignedPropertiesPageChange(
                                            assignedPropertiesPagination.current_page -
                                              1,
                                          )
                                        }
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                      >
                                        السابق
                                      </button>
                                    )}

                                    {Array.from(
                                      {
                                        length:
                                          assignedPropertiesPagination.last_page,
                                      },
                                      (_, i) => i + 1,
                                    )
                                      .filter((page) => {
                                        const current =
                                          assignedPropertiesPagination.current_page;
                                        return (
                                          page === 1 ||
                                          page ===
                                            assignedPropertiesPagination.last_page ||
                                          (page >= current - 1 &&
                                            page <= current + 1)
                                        );
                                      })
                                      .map((page, index, array) => {
                                        if (
                                          index > 0 &&
                                          page - array[index - 1] > 1
                                        ) {
                                          return (
                                            <span
                                              key={`group-${page}`}
                                              className="flex items-center gap-1"
                                            >
                                              <span className="px-2">...</span>
                                              <button
                                                onClick={() =>
                                                  handleAssignedPropertiesPageChange(
                                                    page,
                                                  )
                                                }
                                                className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                                                  page ===
                                                  assignedPropertiesPagination.current_page
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                              >
                                                {page}
                                              </button>
                                            </span>
                                          );
                                        }
                                        return (
                                          <button
                                            key={page}
                                            onClick={() =>
                                              handleAssignedPropertiesPageChange(
                                                page,
                                              )
                                            }
                                            className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                                              page ===
                                              assignedPropertiesPagination.current_page
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                          >
                                            {page}
                                          </button>
                                        );
                                      })}

                                    {assignedPropertiesPagination.current_page <
                                      assignedPropertiesPagination.last_page && (
                                      <button
                                        onClick={() =>
                                          handleAssignedPropertiesPageChange(
                                            assignedPropertiesPagination.current_page +
                                              1,
                                          )
                                        }
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                      >
                                        التالي
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={closeViewPropertiesDialog}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                          إغلاق
                        </button>
                      </div>
                    </div>
                  </div>
                </div>,
                document.body,
              )}

            {/* Create Owner Dialog */}
            <Dialog
              open={isCreateOwnerDialogOpen}
              onOpenChange={closeCreateOwnerDialog}
            >
              <DialogContent
                className="max-w-3xl max-h-[90vh] overflow-y-auto"
                dir="rtl"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Plus className="h-6 w-6" />
                    إضافة مالك جديد
                  </DialogTitle>
                  <DialogDescription>
                    أدخل معلومات المالك الجديد
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {createError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <span>{createError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="create-name">الاسم *</Label>
                      <Input
                        id="create-name"
                        value={createFormData.name}
                        onChange={(e) =>
                          handleCreateFormChange("name", e.target.value)
                        }
                        placeholder="أدخل اسم المالك"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="create-email">البريد الإلكتروني *</Label>
                      <Input
                        id="create-email"
                        type="email"
                        value={createFormData.email}
                        onChange={(e) =>
                          handleCreateFormChange("email", e.target.value)
                        }
                        placeholder="example@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="create-phone">رقم الهاتف *</Label>
                      <Input
                        id="create-phone"
                        value={createFormData.phone}
                        onChange={(e) =>
                          handleCreateFormChange("phone", e.target.value)
                        }
                        placeholder="05XXXXXXXX"
                      />
                    </div>

                    {/* ID Number */}
                    <div className="space-y-2">
                      <Label htmlFor="create-id-number">رقم الهوية</Label>
                      <Input
                        id="create-id-number"
                        value={createFormData.id_number}
                        onChange={(e) =>
                          handleCreateFormChange("id_number", e.target.value)
                        }
                        placeholder="رقم الهوية الوطنية"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="create-password">كلمة المرور *</Label>
                      <Input
                        id="create-password"
                        type="password"
                        value={createFormData.password}
                        onChange={(e) =>
                          handleCreateFormChange("password", e.target.value)
                        }
                        placeholder="أدخل كلمة المرور"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="create-confirm-password">
                        تأكيد كلمة المرور *
                      </Label>
                      <Input
                        id="create-confirm-password"
                        type="password"
                        value={createFormData.confirmPassword}
                        onChange={(e) =>
                          handleCreateFormChange(
                            "confirmPassword",
                            e.target.value,
                          )
                        }
                        placeholder="أعد إدخال كلمة المرور"
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="create-city">المدينة</Label>
                      <Input
                        id="create-city"
                        value={createFormData.city}
                        onChange={(e) =>
                          handleCreateFormChange("city", e.target.value)
                        }
                        placeholder="أدخل المدينة"
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="create-address">العنوان</Label>
                      <Input
                        id="create-address"
                        value={createFormData.address}
                        onChange={(e) =>
                          handleCreateFormChange("address", e.target.value)
                        }
                        placeholder="أدخل العنوان الكامل"
                      />
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>حالة الحساب</Label>
                      <p className="text-sm text-muted-foreground">
                        {createFormData.is_active
                          ? "الحساب نشط"
                          : "الحساب غير نشط"}
                      </p>
                    </div>
                    <Switch
                      checked={createFormData.is_active}
                      onCheckedChange={(checked) =>
                        handleCreateFormChange("is_active", checked)
                      }
                    />
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                    <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">متطلبات كلمة المرور:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>يجب أن تكون 8 أحرف على الأقل</li>
                        <li>يُنصح باستخدام مزيج من الأحرف والأرقام</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    onClick={closeCreateOwnerDialog}
                    variant="outline"
                    disabled={creatingOwner}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleCreateOwner}
                    disabled={creatingOwner}
                    className="gap-2"
                  >
                    {creatingOwner ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        إنشاء المالك
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Remove Property Confirmation Dialog - Custom HTML with Portal */}
            {isRemovePropertyDialogOpen &&
              typeof document !== "undefined" &&
              createPortal(
                <div
                  className="fixed inset-0 flex items-center justify-center p-4"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 9999,
                  }}
                  onMouseDown={(e) => {
                    console.log("Backdrop clicked");
                    if (e.target === e.currentTarget) {
                      closeRemovePropertyDialog();
                    }
                  }}
                >
                  <div
                    className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                    dir="rtl"
                    onMouseDown={(e) => {
                      console.log("Dialog content clicked");
                      e.stopPropagation();
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          تأكيد إلغاء الربط
                        </h3>
                        <p className="text-sm text-gray-500">
                          هذا الإجراء سيقوم بإلغاء ربط العقار
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-gray-700 text-center">
                          هل أنت متأكد من إلغاء ربط هذا العقار بالمالك؟
                        </p>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Cancel button clicked");
                          closeRemovePropertyDialog();
                        }}
                        disabled={removingProperty}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Confirm button clicked");
                          handleRemoveProperty();
                        }}
                        disabled={removingProperty}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                      >
                        {removingProperty ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            جاري الإلغاء...
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4" />
                            تأكيد الإلغاء
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>,
                document.body,
              )}

            {/* Delete Owner Confirmation Dialog */}
            <Dialog
              open={isDeleteOwnerDialogOpen}
              onOpenChange={closeDeleteOwnerDialog}
            >
              <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-6 w-6" />
                    تأكيد الحذف
                  </DialogTitle>
                  <DialogDescription>
                    هذا الإجراء لا يمكن التراجع عنه
                  </DialogDescription>
                </DialogHeader>

                {selectedOwnerForDelete && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-gray-900 mb-2">
                        هل أنت متأكد من حذف المالك:
                      </p>
                      <p className="font-bold text-lg text-gray-900">
                        {selectedOwnerForDelete.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        البريد: {selectedOwnerForDelete.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        الهاتف: {selectedOwnerForDelete.phone}
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">تنبيه:</p>
                        <p>
                          سيتم حذف جميع البيانات المرتبطة بهذا المالك بشكل نهائي
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    onClick={closeDeleteOwnerDialog}
                    variant="outline"
                    disabled={deletingOwner}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleDeleteOwner}
                    disabled={deletingOwner}
                    className="bg-red-600 hover:bg-red-700 gap-2"
                  >
                    {deletingOwner ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        جاري الحذف...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        تأكيد الحذف
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
    </div>
  );
}
