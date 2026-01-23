"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Key,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Edit,
  Save,
  BarChart3,
  Plus,
  Search,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// Types
interface Role {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  guard_name: string;
  team_id: number;
  created_at: string;
  updated_at: string;
  permissions_list?: PermissionItem[];
  permissions?: Permission[];
}

interface PermissionItem {
  name: string;
  name_ar: string;
  name_en: string;
}

interface Permission {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  guard_name: string;
  team_id: number;
  created_at: string;
  updated_at: string;
  description?: string;
  pivot?: {
    role_id: number;
    permission_id: number;
  };
}

interface RolesResponse {
  status: boolean;
  message: string;
  code: number;
  data: Role[];
}

export default function RolesPage() {
  // Roles tab states
  const [rolesTabData, setRolesTabData] = useState<Role[]>([]);
  const [rolesTabLoading, setRolesTabLoading] = useState(false);
  const [rolesTabError, setRolesTabError] = useState<string | null>(null);
  const [rolesSearchQuery, setRolesSearchQuery] = useState("");

  // Role details states
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleDetails, setRoleDetails] = useState<Role | null>(null);
  const [roleDetailsLoading, setRoleDetailsLoading] = useState(false);
  const [roleDetailsError, setRoleDetailsError] = useState<string | null>(null);

  // Create role states
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [createRoleError, setCreateRoleError] = useState<string | null>(null);
  const [createRoleSuccess, setCreateRoleSuccess] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissionsForRole, setSelectedPermissionsForRole] = useState<
    string[]
  >([]);
  const [availablePermissionsForRole, setAvailablePermissionsForRole] =
    useState<any>(null);
  const [permissionsForRoleLoading, setPermissionsForRoleLoading] =
    useState(false);
  const [creatingRole, setCreatingRole] = useState(false);

  // New form states
  const [roleFormData, setRoleFormData] = useState({
    name: "",
  });
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<
    Record<string, boolean>
  >({});
  const [createRoleLoading, setCreateRoleLoading] = useState(false);

  // Edit role form states
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [editRoleFormData, setEditRoleFormData] = useState({
    name: "",
  });
  const [editSelectedRolePermissions, setEditSelectedRolePermissions] =
    useState<Record<string, boolean>>({});
  const [editRoleLoading, setEditRoleLoading] = useState(false);
  const [editRoleSuccess, setEditRoleSuccess] = useState(false);
  const [editRoleError, setEditRoleError] = useState<string | null>(null);

  // Delete role states
  const [showDeleteRoleDialog, setShowDeleteRoleDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deleteRoleLoading, setDeleteRoleLoading] = useState(false);
  const [deleteRoleError, setDeleteRoleError] = useState<string | null>(null);

  // Filter roles based on search query
  const filteredRoles = rolesTabData.filter(
    (role) =>
      (role.name_ar || role.name)
        .toLowerCase()
        .includes(rolesSearchQuery.toLowerCase()) ||
      role.permissions_list?.some(
        (permission) =>
          permission.name
            .toLowerCase()
            .includes(rolesSearchQuery.toLowerCase()) ||
          permission.name_ar
            .toLowerCase()
            .includes(rolesSearchQuery.toLowerCase()),
      ),
  );

  // Fetch roles for roles tab
  const fetchRolesForTab = async () => {
    setRolesTabLoading(true);
    setRolesTabError(null);
    try {
      const response = await axiosInstance.get<RolesResponse>("/v1/roles");
      setRolesTabData(response.data.data);
    } catch (err: any) {
      console.error("Error fetching roles for tab:", err);
      setRolesTabError("حدث خطأ في جلب الأدوار");
    } finally {
      setRolesTabLoading(false);
    }
  };

  // Fetch role details
  const fetchRoleDetails = async (roleId: number) => {
    setRoleDetailsLoading(true);
    setRoleDetailsError(null);
    try {
      const response = await axiosInstance.get(`/v1/roles/${roleId}`);
      console.log("📋 Role Details API Response:", response.data);
      setRoleDetails(response.data.data);
    } catch (error: any) {
      console.error("Error fetching role details:", error);
      setRoleDetailsError(
        error.response?.data?.message || "فشل في جلب تفاصيل الدور",
      );
    } finally {
      setRoleDetailsLoading(false);
    }
  };

  // Fetch available permissions for role creation
  const fetchAvailablePermissionsForRole = async () => {
    setPermissionsForRoleLoading(true);
    try {
      const response = await axiosInstance.get("/v1/permissions");
      console.log(
        "📋 Available Permissions for Role API Response:",
        response.data,
      );
      setAvailablePermissionsForRole(response.data);
    } catch (error: any) {
      console.error("Error fetching available permissions for role:", error);
    } finally {
      setPermissionsForRoleLoading(false);
    }
  };

  // Handle view role
  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    fetchRoleDetails(role.id);
  };

  // Handle edit role
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setEditRoleFormData({ name: role.name_ar || role.name });

    // Convert permissions list to object format
    const permissionsObj: Record<string, boolean> = {};
    if (role.permissions_list) {
      role.permissions_list.forEach((permission) => {
        permissionsObj[permission.name] = true;
      });
    }
    setEditSelectedRolePermissions(permissionsObj);

    setShowEditRoleDialog(true);
    fetchAvailablePermissionsForRole();
  };

  // Handle delete role
  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setShowDeleteRoleDialog(true);
  };

  // Create role
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      setCreateRoleError("يرجى إدخال اسم الدور");
      return;
    }

    setCreatingRole(true);
    setCreateRoleError(null);
    setCreateRoleSuccess(false);

    try {
      await axiosInstance.post("/v1/roles", {
        name: newRoleName,
        permissions: selectedPermissionsForRole,
      });

      setCreateRoleSuccess(true);
      setNewRoleName("");
      setSelectedPermissionsForRole([]);
      fetchRolesForTab();

      setTimeout(() => {
        setShowCreateRoleDialog(false);
        setCreateRoleSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error("Error creating role:", error);
      setCreateRoleError(error.response?.data?.message || "فشل في إنشاء الدور");
    } finally {
      setCreatingRole(false);
    }
  };

  // Update role
  const handleUpdateRole = async () => {
    if (!selectedRole || !newRoleName.trim()) {
      setEditRoleError("يرجى إدخال اسم الدور");
      return;
    }

    setEditRoleLoading(true);
    setEditRoleError(null);
    setEditRoleSuccess(false);

    try {
      await axiosInstance.put(`/v1/roles/${selectedRole.id}`, {
        name: newRoleName,
        permissions: selectedPermissionsForRole,
      });

      setEditRoleSuccess(true);
      fetchRolesForTab();

      setTimeout(() => {
        setShowEditRoleDialog(false);
        setEditRoleSuccess(false);
        setSelectedRole(null);
      }, 2000);
    } catch (error: any) {
      console.error("Error updating role:", error);
      setEditRoleError(error.response?.data?.message || "فشل في تحديث الدور");
    } finally {
      setEditRoleLoading(false);
    }
  };

  // Translate permission name
  const translatePermission = (permission: string): string => {
    const translations: Record<string, string> = {
      "properties.view": "عرض العقارات",
      "properties.create": "إنشاء عقارات",
      "properties.edit": "تعديل العقارات",
      "properties.delete": "حذف العقارات",
      "projects.view": "عرض المشاريع",
      "projects.create": "إنشاء مشاريع",
      "projects.edit": "تعديل المشاريع",
      "projects.delete": "حذف المشاريع",
      "customers.view": "عرض العملاء",
      "customers.create": "إنشاء عملاء",
      "customers.edit": "تعديل العملاء",
      "customers.delete": "حذف العملاء",
      "employees.view": "عرض الموظفين",
      "employees.create": "إنشاء موظفين",
      "employees.edit": "تعديل الموظفين",
      "employees.delete": "حذف الموظفين",
      "roles.view": "عرض الأدوار",
      "roles.create": "إنشاء أدوار",
      "roles.edit": "تعديل الأدوار",
      "roles.delete": "حذف الأدوار",
      "permissions.view": "عرض الصلاحيات",
      "permissions.assign": "تعيين الصلاحيات",
    };
    return translations[permission.toLowerCase()] || permission;
  };

  // Translate group name
  const translateGroupName = (groupName: string): string => {
    const translations: Record<string, string> = {
      "Live.Editor": "المحرر المباشر",
      Live: "المحرر المباشر",
      affiliate: "الشراكة",
      apps: "التطبيقات",
      content: "المحتوى",
      crm: "إدارة العملاء",
      customers: "العملاء",
      dashboard: "لوحة التحكم",
      live_editor: "المحرر المباشر",
      projects: "المشاريع",
      properties: "العقارات",
      settings: "الإعدادات",
    };
    return translations[groupName] || groupName;
  };

  // Toggle permission selection
  const togglePermission = (permission: string) => {
    setSelectedPermissionsForRole((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  // Handle role permission change
  const handleRolePermissionChange = (
    permissionName: string,
    checked: boolean,
  ) => {
    setSelectedRolePermissions((prev) => ({
      ...prev,
      [permissionName]: checked,
    }));
  };

  // Handle edit role permission change
  const handleEditRolePermissionChange = (
    permissionName: string,
    checked: boolean,
  ) => {
    setEditSelectedRolePermissions((prev) => ({
      ...prev,
      [permissionName]: checked,
    }));
  };

  // Create role function
  const createRole = async () => {
    if (!roleFormData.name.trim()) {
      setCreateRoleError("يرجى إدخال اسم الدور");
      return;
    }

    setCreateRoleLoading(true);
    setCreateRoleError(null);

    try {
      const selectedPermissions = Object.entries(selectedRolePermissions)
        .filter(([_, checked]) => checked)
        .map(([permission, _]) => permission);

      await axiosInstance.post("/v1/roles", {
        name: roleFormData.name,
        permissions: selectedPermissions,
      });

      setCreateRoleSuccess(true);
      setRoleFormData({ name: "" });
      setSelectedRolePermissions({});
      fetchRolesForTab();

      setTimeout(() => {
        setShowCreateRoleDialog(false);
        setCreateRoleSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error("Error creating role:", error);
      setCreateRoleError(error.response?.data?.message || "فشل في إنشاء الدور");
    } finally {
      setCreateRoleLoading(false);
    }
  };

  // Update role function
  const updateRole = async () => {
    if (!editRoleFormData.name.trim()) {
      setEditRoleError("يرجى إدخال اسم الدور");
      return;
    }

    if (!selectedRole) return;

    setEditRoleLoading(true);
    setEditRoleError(null);

    try {
      const selectedPermissions = Object.entries(editSelectedRolePermissions)
        .filter(([_, checked]) => checked)
        .map(([permission, _]) => permission);

      await axiosInstance.put(`/v1/roles/${selectedRole.id}`, {
        name: editRoleFormData.name,
        permissions: selectedPermissions,
      });

      setEditRoleSuccess(true);
      fetchRolesForTab();

      setTimeout(() => {
        setShowEditRoleDialog(false);
        setEditRoleSuccess(false);
        setSelectedRole(null);
      }, 2000);
    } catch (error: any) {
      console.error("Error updating role:", error);
      setEditRoleError(error.response?.data?.message || "فشل في تحديث الدور");
    } finally {
      setEditRoleLoading(false);
    }
  };

  // Delete role function
  const deleteRole = async () => {
    if (!roleToDelete) return;

    setDeleteRoleLoading(true);
    setDeleteRoleError(null);

    try {
      await axiosInstance.delete(`/v1/roles/${roleToDelete.id}`);
      fetchRolesForTab();
      setShowDeleteRoleDialog(false);
      setRoleToDelete(null);
    } catch (error: any) {
      console.error("Error deleting role:", error);
      setDeleteRoleError(error.response?.data?.message || "فشل في حذف الدور");
    } finally {
      setDeleteRoleLoading(false);
    }
  };

  // Fetch roles on mount
  useEffect(() => {
    fetchRolesForTab();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
        <div className="flex-1 overflow-auto p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-6 w-6" />
                إدارة الأدوار
              </h1>
              <p className="text-gray-600 mt-1">
                عرض وإدارة جميع الأدوار المتاحة في النظام مع صلاحياتها
              </p>
            </div>
            <Button
              onClick={() => {
                setShowCreateRoleDialog(true);
                setCreateRoleError(null);
                setCreateRoleSuccess(false);
                fetchAvailablePermissionsForRole();
              }}
              className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 ml-2" />
              إنشاء دور
            </Button>
          </div>

          {/* Edit Role Form - Legacy */}
          {false && selectedRole && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  تعديل الدور: {selectedRole?.name_ar || selectedRole?.name}
                </CardTitle>
                <CardDescription>
                  قم بتعديل اسم الدور أو الصلاحيات المخصصة له
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Success Message */}
                  {editRoleSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        تم تحديث الدور بنجاح!
                      </span>
                    </div>
                  )}

                  {/* Error Message */}
                  {editRoleError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="text-red-800 font-medium">
                        {editRoleError}
                      </span>
                    </div>
                  )}

                  {/* Role Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-role-name"
                      className="text-sm font-medium"
                    >
                      اسم الدور *
                    </Label>
                    <Input
                      id="edit-role-name"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="أدخل اسم الدور"
                      className="border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>

                  {/* Permissions */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-gray-600" />
                      <h4 className="text-lg font-semibold text-black">
                        الصلاحيات
                      </h4>
                    </div>

                    {permissionsForRoleLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    ) : availablePermissionsForRole ? (
                      <ScrollArea className="h-[300px] border border-gray-200 rounded-lg p-4">
                        <div className="space-y-4">
                          {Object.entries(availablePermissionsForRole).map(
                            ([groupName, permissions]: [string, any]) => (
                              <div key={groupName} className="space-y-2">
                                <h5 className="font-medium text-gray-900 capitalize">
                                  {translateGroupName(groupName)}
                                </h5>
                                <div className="space-y-2 pl-4">
                                  {Array.isArray(permissions) &&
                                  permissions.length > 0 ? (
                                    permissions.map((permission: any) => (
                                      <div
                                        key={permission.id}
                                        className="flex items-center space-x-2 space-x-reverse"
                                      >
                                        <Checkbox
                                          id={`edit-permission-${permission.id}`}
                                          checked={selectedPermissionsForRole.includes(
                                            permission.name,
                                          )}
                                          onCheckedChange={() =>
                                            togglePermission(permission.name)
                                          }
                                        />
                                        <Label
                                          htmlFor={`edit-permission-${permission.id}`}
                                          className="text-sm text-gray-700 cursor-pointer"
                                        >
                                          {permission.name_ar ||
                                            translatePermission(
                                              permission.name,
                                            )}
                                        </Label>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-4 text-gray-500">
                                      لا توجد صلاحيات في هذه المجموعة
                                    </div>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8 text-gray-600">
                        لا توجد صلاحيات متاحة
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setShowEditRoleDialog(false);
                        setSelectedRole(null);
                      }}
                      variant="outline"
                      disabled={editRoleLoading}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={updateRole}
                      disabled={editRoleLoading}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      {editRoleLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          جاري التحديث...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 ml-2" />
                          حفظ التغييرات
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Roles List */}
          <Card className="my-5">
            <CardContent>
              {rolesTabLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="text-gray-600 font-medium">
                      جاري تحميل الأدوار...
                    </span>
                    <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black animate-pulse rounded-full"></div>
                    </div>
                  </div>
                </div>
              ) : rolesTabError ? (
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">{rolesTabError}</p>
                  <Button onClick={fetchRolesForTab} variant="outline">
                    إعادة المحاولة
                  </Button>
                </div>
              ) : rolesTabData.length > 0 ? (
                <div className="space-y-6 py-5">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث في الأدوار والصلاحيات..."
                      value={rolesSearchQuery}
                      onChange={(e) => setRolesSearchQuery(e.target.value)}
                      className="pr-10 border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>

                  {/* Roles List */}
                  <div className="space-y-6">
                    {filteredRoles.map((role) => (
                      <div
                        key={role.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 sm:px-6 py-4">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-black rounded-lg">
                                <Shield className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-black capitalize">
                                  {role.name_ar || role.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {role.permissions_list?.length || 0} صلاحية
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className="text-gray-600"
                                >
                                  ID: {role.id}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="text-gray-600"
                                >
                                  {role.permissions_list?.length || 0} صلاحية
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewRole(role)}
                                  className="text-gray-600 hover:text-black hover:border-black"
                                >
                                  <Eye className="h-4 w-4 ml-2" />
                                  <span className="hidden sm:inline">
                                    عرض التفاصيل
                                  </span>
                                  <span className="sm:hidden">عرض</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditRole(role)}
                                  className="text-gray-600 hover:text-black hover:border-black"
                                >
                                  <Edit className="h-4 w-4 ml-2" />
                                  <span className="hidden sm:inline">
                                    تعديل
                                  </span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteRole(role)}
                                  disabled={deleteRoleLoading}
                                  className="text-red-600 hover:text-red-800 hover:border-red-800"
                                >
                                  {deleteRoleLoading ? (
                                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4 ml-2" />
                                  )}
                                  <span className="hidden sm:inline">حذف</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 sm:p-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {role.permissions_list?.map(
                              (permission: PermissionItem, index: number) => (
                                <div
                                  key={index}
                                  className="group border border-gray-200 rounded-lg p-3 hover:border-black hover:shadow-md transition-all duration-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-colors flex-shrink-0">
                                      <Lock className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-gray-900 group-hover:text-black transition-colors truncate">
                                        {permission.name_ar ||
                                          translatePermission(permission.name)}
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>

                          {(!role.permissions_list ||
                            role.permissions_list.length === 0) && (
                            <div className="text-center py-8">
                              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600">
                                لا توجد صلاحيات لهذا الدور
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* No Results */}
                  {filteredRoles.length === 0 && rolesSearchQuery && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        لا توجد نتائج
                      </h3>
                      <p className="text-gray-600">
                        لم يتم العثور على أدوار تطابق البحث: "{rolesSearchQuery}
                        "
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد أدوار
                  </h3>
                  <p className="text-gray-600">لا توجد أدوار متاحة في النظام</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Details */}
          {selectedRole && roleDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  تفاصيل الدور: {selectedRole.name_ar || selectedRole.name}
                </CardTitle>
                <CardDescription>عرض تفاصيل الدور وصلاحياته</CardDescription>
              </CardHeader>
              <CardContent>
                {roleDetailsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      <span className="text-gray-600 font-medium">
                        جاري تحميل تفاصيل الدور...
                      </span>
                    </div>
                  </div>
                ) : roleDetailsError ? (
                  <div className="text-center py-8">
                    <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{roleDetailsError}</p>
                    <Button
                      onClick={() =>
                        selectedRole && fetchRoleDetails(selectedRole.id)
                      }
                      variant="outline"
                    >
                      إعادة المحاولة
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Role Basic Info */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-black rounded-lg">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-black capitalize">
                            {roleDetails.name_ar || roleDetails.name}
                          </h3>
                          <p className="text-gray-600">
                            معرف الدور: {roleDetails.id}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-gray-600">معرف الفريق:</span>
                            <span className="font-medium">
                              {roleDetails.team_id}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-gray-600">اسم الحارس:</span>
                            <span className="font-medium">
                              {roleDetails.guard_name}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-gray-600">
                              تاريخ الإنشاء:
                            </span>
                            <span className="font-medium">
                              {new Date(
                                roleDetails.created_at,
                              ).toLocaleDateString("ar-US")}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-gray-600">آخر تحديث:</span>
                            <span className="font-medium">
                              {new Date(
                                roleDetails.updated_at,
                              ).toLocaleDateString("ar-US")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Permissions List */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-gray-600" />
                        <h4 className="text-lg font-semibold text-black">
                          الصلاحيات ({roleDetails.permissions_list?.length || 0}
                          )
                        </h4>
                      </div>

                      {roleDetails.permissions_list &&
                      roleDetails.permissions_list.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {roleDetails.permissions_list.map(
                            (permission: PermissionItem, index: number) => (
                              <div
                                key={index}
                                className="group border border-gray-200 rounded-lg p-4 hover:border-black hover:shadow-md transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-colors flex-shrink-0">
                                    <Lock className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900 group-hover:text-black transition-colors truncate">
                                      {permission.name_ar ||
                                        translatePermission(permission.name)}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            لا توجد صلاحيات لهذا الدور
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

      <Dialog
        open={showCreateRoleDialog}
        onOpenChange={setShowCreateRoleDialog}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black">
              <Shield className="h-5 w-5" />
              إنشاء دور جديد
            </DialogTitle>
            <DialogDescription>
              إنشاء دور جديد مع تحديد الصلاحيات المطلوبة
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Role Name */}
            <div className="space-y-2">
              <Label htmlFor="roleName" className="text-black font-medium">
                اسم الدور
              </Label>
              <Input
                id="roleName"
                placeholder="أدخل اسم الدور"
                value={roleFormData.name}
                onChange={(e) => {
                  setRoleFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                  if (createRoleError) {
                    setCreateRoleError(null);
                  }
                }}
                className="border-gray-300 focus:border-black focus:ring-black"
              />
            </div>

            {/* Permissions Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-gray-600" />
                <Label className="text-black font-medium">الصلاحيات</Label>
              </div>

              {permissionsForRoleLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="text-gray-600 font-medium">
                      جاري تحميل الصلاحيات...
                    </span>
                  </div>
                </div>
              ) : availablePermissionsForRole &&
                availablePermissionsForRole.grouped ? (
                <ScrollArea className="h-64 border border-gray-200 rounded-lg p-4">
                  <div className="space-y-4">
                    {Object.entries(availablePermissionsForRole.grouped).map(
                      ([groupName, groupPermissions]) => (
                        <div key={groupName} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-gray-100 rounded">
                              <Key className="h-4 w-4 text-gray-600" />
                            </div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {translateGroupName(groupName)}
                            </h4>
                          </div>
                          <div className="space-y-2 pr-4">
                            {Array.isArray(groupPermissions) &&
                              groupPermissions.map(
                                (permission: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 space-x-reverse"
                                  >
                                    <Checkbox
                                      id={`role-permission-${groupName}-${index}`}
                                      checked={
                                        selectedRolePermissions[
                                          permission.name
                                        ] || false
                                      }
                                      onCheckedChange={(checked) =>
                                        handleRolePermissionChange(
                                          permission.name,
                                          checked as boolean,
                                        )
                                      }
                                      className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                                    />
                                    <Label
                                      htmlFor={`role-permission-${groupName}-${index}`}
                                      className="text-gray-700 cursor-pointer flex-1"
                                    >
                                      {permission.name_ar ||
                                        translatePermission(permission.name)}
                                    </Label>
                                  </div>
                                ),
                              )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد صلاحيات متاحة</p>
                </div>
              )}
            </div>

            {/* Success Message */}
            {createRoleSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    تم إنشاء الدور بنجاح!
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {createRoleError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">
                    {createRoleError}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowCreateRoleDialog(false)}
              variant="outline"
              className="text-gray-600 hover:text-black hover:border-black"
            >
              إلغاء
            </Button>
            <Button
              onClick={createRole}
              disabled={createRoleLoading || !roleFormData.name.trim()}
              className="bg-black hover:bg-gray-800 text-white disabled:opacity-50"
            >
              {createRoleLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  إنشاء الدور
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={showEditRoleDialog} onOpenChange={setShowEditRoleDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black">
              <Edit className="h-5 w-5" />
              تعديل الدور
            </DialogTitle>
            <DialogDescription>تعديل بيانات الدور وصلاحياته</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Role Name */}
            <div className="space-y-2">
              <Label htmlFor="editRoleName" className="text-black font-medium">
                اسم الدور
              </Label>
              <Input
                id="editRoleName"
                placeholder="أدخل اسم الدور"
                value={editRoleFormData.name}
                onChange={(e) =>
                  setEditRoleFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-black focus:ring-black"
              />
            </div>

            {/* Permissions Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-gray-600" />
                <Label className="text-black font-medium">الصلاحيات</Label>
              </div>

              {permissionsForRoleLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="text-gray-600 font-medium">
                      جاري تحميل الصلاحيات...
                    </span>
                  </div>
                </div>
              ) : availablePermissionsForRole &&
                availablePermissionsForRole.grouped ? (
                <ScrollArea className="h-64 border border-gray-200 rounded-lg p-4">
                  <div className="space-y-4">
                    {Object.entries(availablePermissionsForRole.grouped).map(
                      ([groupName, groupPermissions]) => (
                        <div key={groupName} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-gray-100 rounded">
                              <Key className="h-4 w-4 text-gray-600" />
                            </div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {translateGroupName(groupName)}
                            </h4>
                          </div>
                          <div className="space-y-2 pr-4">
                            {Array.isArray(groupPermissions) &&
                              groupPermissions.map(
                                (permission: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 space-x-reverse"
                                  >
                                    <Checkbox
                                      id={`edit-role-permission-${groupName}-${index}`}
                                      checked={
                                        editSelectedRolePermissions[
                                          permission.name
                                        ] || false
                                      }
                                      onCheckedChange={(checked) =>
                                        handleEditRolePermissionChange(
                                          permission.name,
                                          checked as boolean,
                                        )
                                      }
                                      className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                                    />
                                    <Label
                                      htmlFor={`edit-role-permission-${groupName}-${index}`}
                                      className="text-gray-700 cursor-pointer flex-1"
                                    >
                                      {permission.name_ar ||
                                        translatePermission(permission.name)}
                                    </Label>
                                  </div>
                                ),
                              )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد صلاحيات متاحة</p>
                </div>
              )}
            </div>

            {/* Success Message */}
            {editRoleSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    تم تحديث الدور بنجاح!
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {editRoleError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">
                    {editRoleError}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowEditRoleDialog(false)}
              variant="outline"
              className="text-gray-600 hover:text-black hover:border-black"
            >
              إلغاء
            </Button>
            <Button
              onClick={updateRole}
              disabled={editRoleLoading || !editRoleFormData.name.trim()}
              className="bg-black hover:bg-gray-800 text-white disabled:opacity-50"
            >
              {editRoleLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  تحديث الدور
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog
        open={showDeleteRoleDialog}
        onOpenChange={setShowDeleteRoleDialog}
      >
        <DialogContent className="max-w-md bg-white mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              حذف الدور
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا الدور؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>

          {roleToDelete && (
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-red-800">
                      {roleToDelete.name_ar || roleToDelete.name}
                    </h4>
                    <p className="text-sm text-red-600">
                      معرف الدور: {roleToDelete.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {deleteRoleError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  {deleteRoleError}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setShowDeleteRoleDialog(false)}
              variant="outline"
              className="text-gray-600 hover:text-black hover:border-black"
            >
              إلغاء
            </Button>
            <Button
              onClick={deleteRole}
              disabled={deleteRoleLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteRoleLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 ml-2" />
                  حذف الدور
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
