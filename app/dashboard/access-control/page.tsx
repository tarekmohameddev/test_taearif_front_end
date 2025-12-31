"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye,
  Users,
  Shield,
  Key,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Plus,
  UserPlus,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  Save,
  Search,
  BarChart3,
  Database,
  UserCheck,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/store/userStore";
import PaymentPopup from "@/components/popup/PopupForWhatsapp";

// Types
interface Employee {
  id: number;
  tenant_id: number;
  account_type: string;
  active: boolean;
  last_login_at: string | null;
  google_id: string | null;
  first_name: string;
  last_name: string;
  photo: string | null;
  username: string | null;
  email: string;
  subscribed: boolean;
  subscription_amount: string;
  referral_code: string;
  referred_by: string | null;
  company_name: string | null;
  phone: string;
  message: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  country: string | null;
  rbac_version: number;
  rbac_seeded_at: string | null;
  featured: number;
  status: number;
  online_status: number;
  verification_link: string | null;
  email_verified: number;
  subdomain_status: number;
  created_at: string;
  updated_at: string;
  preview_template: number;
  template_img: string | null;
  template_serial_number: number;
  pm_type: string | null;
  pm_last_four: string | null;
  trial_ends_at: string | null;
  template_name: string | null;
  show_home: string | null;
  onboarding_completed: boolean;
  industry_type: string | null;
  short_description: string | null;
  logo: string | null;
  icon: string | null;
  primary_color: string;
  show_even_if_empty: boolean;
  roles: Role[];
  permissions: Permission[];
}

interface Role {
  id: number;
  team_id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_id: number;
    role_id: number;
    model_type: string;
    team_id: number;
  };
  permissions_list?: string[];
  permissions?: Array<{
    id: number;
    name: string;
    pivot: {
      role_id: number;
      permission_id: number;
    };
  }>;
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  team_id: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot: {
    model_id: number;
    permission_id: number;
    model_type: string;
    team_id: number;
  };
}

interface EmployeesResponse {
  current_page: number;
  data: Employee[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface EmployeeDetailsResponse {
  status: string;
  data: Employee;
}

interface Permission {
  id: number;
  name: string;
  description: string | null;
  team_id: number | null;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_id: number;
    permission_id: number;
    model_type: string;
    team_id: number;
  };
}

interface PermissionsResponse {
  status: string;
  data: Permission[];
  grouped: {
    [key: string]: Permission[];
  };
  templates: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

interface AvailablePermissionsResponse {
  status: string;
  data: string[];
}

interface CreateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  active: boolean;
  role_ids: number[];
  permissions: string[];
}

interface RolesResponse {
  status: string;
  data: Role[];
}

interface AvailableRolesResponse {
  status: string;
  data: Array<{
    id: number;
    name: string;
    permissions_list?: string[];
    permissions?: Array<{
      id: number;
      name: string;
      pivot: {
        role_id: number;
        permission_id: number;
      };
    }>;
  }>;
}

interface UpdateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password?: string;
  active: boolean;
  role_ids: number[];
  permissions: string[];
}

export default function AccessControlPage() {
  const router = useRouter();
  const userData = useUserStore((state) => state.userData);
  const employeesData = userData?.employees;
  
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [employeeDetails, setEmployeeDetails] = useState<Employee | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // New employee creation states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [permissions, setPermissions] = useState<PermissionsResponse | null>(
    null,
  );
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  // Available permissions for translation
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);

  // Function to translate permission names
  const translatePermission = (permissionName: string): string => {
    console.log("🔍 Translating permission:", permissionName);
    console.log(
      "📋 Available permissions count:",
      availablePermissions?.length || 0,
    );

    if (!availablePermissions || availablePermissions.length === 0) {
      console.log("❌ No available permissions, returning original name");
      return permissionName;
    }

    const permission = availablePermissions.find(
      (p) => p.name === permissionName,
    );
    console.log("🔍 Found permission:", permission);

    if (permission) {
      const translatedName =
        permission.name_ar || permission.name_en || permission.name;
      console.log("✅ Translated to:", translatedName);
      console.log("🔍 Translation details:", {
        original: permissionName,
        name_ar: permission.name_ar,
        name_en: permission.name_en,
        name: permission.name,
        final: translatedName,
      });
      return translatedName;
    }

    console.log("❌ Permission not found, returning original name");
    return permissionName;
  };

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Edit employee states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    active: true,
    role_ids: [],
    permissions: [],
  });
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedRoles, setSelectedRoles] = useState<{
    [key: number]: boolean;
  }>({});

  // Edit form states
  const [editFormData, setEditFormData] = useState<UpdateEmployeeRequest>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    active: true,
    role_ids: [],
    permissions: [],
  });
  const [editSelectedPermissions, setEditSelectedPermissions] = useState<{
    [key: string]: boolean;
  }>({});
  const [editSelectedRoles, setEditSelectedRoles] = useState<{
    [key: number]: boolean;
  }>({});

  // Permissions tab states
  const [permissionsTabData, setPermissionsTabData] =
    useState<PermissionsResponse | null>(null);
  const [permissionsTabLoading, setPermissionsTabLoading] = useState(false);
  const [permissionsTabError, setPermissionsTabError] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Roles tab states
  const [rolesTabData, setRolesTabData] = useState<Role[]>([]);
  const [rolesTabLoading, setRolesTabLoading] = useState(false);
  const [rolesTabError, setRolesTabError] = useState<string | null>(null);
  const [rolesSearchQuery, setRolesSearchQuery] = useState("");

  // Role details dialog state
  const [showRoleDetailsDialog, setShowRoleDetailsDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleDetails, setRoleDetails] = useState<any>(null);
  const [roleDetailsLoading, setRoleDetailsLoading] = useState(false);
  const [roleDetailsError, setRoleDetailsError] = useState<string | null>(null);

  // Create role dialog state
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [createRoleLoading, setCreateRoleLoading] = useState(false);
  const [createRoleError, setCreateRoleError] = useState<string | null>(null);
  const [createRoleSuccess, setCreateRoleSuccess] = useState(false);
  const [roleFormData, setRoleFormData] = useState({
    name: "",
    permissions: [] as string[],
  });
  const [availablePermissionsForRole, setAvailablePermissionsForRole] =
    useState<any>(null);
  const [permissionsForRoleLoading, setPermissionsForRoleLoading] =
    useState(false);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<{
    [key: string]: boolean;
  }>({});

  // Edit role dialog state
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editRoleLoading, setEditRoleLoading] = useState(false);
  const [editRoleError, setEditRoleError] = useState<string | null>(null);
  const [editRoleSuccess, setEditRoleSuccess] = useState(false);
  const [editRoleFormData, setEditRoleFormData] = useState({
    name: "",
    permissions: [] as string[],
  });
  const [editSelectedRolePermissions, setEditSelectedRolePermissions] =
    useState<{ [key: string]: boolean }>({});

  // Delete role state
  const [showDeleteRoleDialog, setShowDeleteRoleDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deleteRoleLoading, setDeleteRoleLoading] = useState(false);
  const [deleteRoleError, setDeleteRoleError] = useState<string | null>(null);

  // Delete permission state
  const [showDeletePermissionDialog, setShowDeletePermissionDialog] =
    useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<any>(null);
  const [deletePermissionLoading, setDeletePermissionLoading] = useState(false);
  const [deletePermissionError, setDeletePermissionError] = useState<
    string | null
  >(null);

  // Delete employee state
  const [showDeleteEmployeeDialog, setShowDeleteEmployeeDialog] =
    useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );
  const [deleteEmployeeLoading, setDeleteEmployeeLoading] = useState(false);
  const [deleteEmployeeError, setDeleteEmployeeError] = useState<string | null>(
    null,
  );

  // Payment popup state
  const [paymentPopupOpen, setPaymentPopupOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [isPurchasingAddon, setIsPurchasingAddon] = useState(false);

  // Filter permissions based on search query
  const filteredPermissions = permissionsTabData
    ? Object.entries(permissionsTabData.grouped).reduce(
        (acc, [groupName, groupPermissions]) => {
          const filtered = groupPermissions.filter(
            (permission) =>
              permission.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              (permission.description &&
                permission.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())),
          );
          if (filtered.length > 0) {
            acc[groupName] = filtered;
          }
          return acc;
        },
        {} as { [key: string]: Permission[] },
      )
    : {};

  // Get total permissions count
  const totalPermissions = permissionsTabData
    ? permissionsTabData.data.length
    : 0;
  const totalGroups = permissionsTabData
    ? Object.keys(permissionsTabData.grouped).length
    : 0;

  // Filter roles based on search query
  const filteredRoles = rolesTabData.filter(
    (role) =>
      role.name.toLowerCase().includes(rolesSearchQuery.toLowerCase()) ||
      role.permissions_list?.some((permission) =>
        permission.toLowerCase().includes(rolesSearchQuery.toLowerCase()),
      ),
  );

  // Get total roles count
  const totalRoles = rolesTabData.length;
  const totalRolesPermissions = rolesTabData.reduce(
    (total, role) => total + (role.permissions_list?.length || 0),
    0,
  );

  // Fetch employees data
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await axiosInstance.get<EmployeesResponse>("/v1/employees");
      setEmployees(response.data.data);
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      setError(err.response?.data?.message || "حدث خطأ في جلب بيانات الموظفين");
    } finally {
      setLoading(false);
    }
  };

  // Fetch employee details
  const fetchEmployeeDetails = async (employeeId: number) => {
    setDetailsLoading(true);
    try {
      const response = await axiosInstance.get<EmployeeDetailsResponse>(
        `/v1/employees/${employeeId}`,
      );
      setEmployeeDetails(response.data.data);
    } catch (err: any) {
      console.error("Error fetching employee details:", err);
      setError(err.response?.data?.message || "حدث خطأ في جلب تفاصيل الموظف");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fetch available permissions for translation
  const fetchAvailablePermissions = async () => {
    try {
      const response = await axiosInstance.get(
        "/v1/employees/available-permissions",
      );
      console.log("🔍 Available Permissions Response:", response.data);

      if (response.data.status && response.data.data) {
        // Check if data is array of objects with name_ar property
        if (
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          const firstItem = response.data.data[0];
          if (
            firstItem &&
            typeof firstItem === "object" &&
            "name_ar" in firstItem
          ) {
            // Data is already in the correct format
            setAvailablePermissions(response.data.data);
            console.log(
              "✅ Available Permissions Set (objects):",
              response.data.data,
            );
            console.log("🔍 First permission example:", response.data.data[0]);

            // Test immediate translation
            const testPermission = response.data.data.find(
              (p: any) => p.name === "properties.view",
            );
            if (testPermission) {
              console.log(
                "🧪 Found properties.view permission:",
                testPermission,
              );
              console.log("🧪 Arabic name:", testPermission.name_ar);
            } else {
              console.log("❌ properties.view permission not found in data");
            }
          } else {
            // Data is array of strings, we need to fetch the full permissions
            console.log(
              "⚠️ Data is array of strings, fetching full permissions...",
            );
            const fullResponse = await axiosInstance.get("/v1/permissions");
            if (fullResponse.data.status && fullResponse.data.data) {
              setAvailablePermissions(fullResponse.data.data);
              console.log("✅ Full Permissions Set:", fullResponse.data.data);
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Error fetching available permissions:", err);
    }
  };

  // Fetch roles data
  const fetchRoles = async () => {
    console.log("🔍 Fetching roles from /v1/employees/available-roles");
    setRolesLoading(true);
    try {
      const response = await axiosInstance.get<AvailableRolesResponse>(
        "/v1/employees/available-roles",
      );
      console.log("✅ Roles response:", response.data);

      // Use the data directly from backend with all permissions
      const rolesData: Role[] = response.data.data.map((role) => ({
        id: role.id,
        name: role.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        team_id: 0,
        guard_name: "sanctum",
        pivot: {
          model_id: 0,
          role_id: role.id,
          model_type: "App\\Models\\User",
          team_id: 0,
        },
        permissions_list: role.permissions_list || [],
        permissions: role.permissions || [],
      }));

      setRoles(rolesData);
    } catch (err: any) {
      console.error("Error fetching roles:", err);
      setEditError("حدث خطأ في جلب الأدوار");
    } finally {
      setRolesLoading(false);
    }
  };

  // Fetch permissions for permissions tab
  const fetchPermissionsForTab = async () => {
    setPermissionsTabLoading(true);
    setPermissionsTabError(null);
    try {
      const response =
        await axiosInstance.get<PermissionsResponse>("/v1/permissions");
      setPermissionsTabData(response.data);
    } catch (err: any) {
      console.error("Error fetching permissions for tab:", err);
      setPermissionsTabError("حدث خطأ في جلب الصلاحيات");
    } finally {
      setPermissionsTabLoading(false);
    }
  };

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

  // Create new employee
  const createEmployee = async () => {
    setCreateLoading(true);
    setCreateError(null);

    try {
      // Convert selected permissions to array
      const selectedPermissionsArray = Object.entries(selectedPermissions)
        .filter(([_, selected]) => selected)
        .map(([permissionName, _]) => permissionName);

      // Convert selected roles to array
      const selectedRolesArray = Object.entries(selectedRoles)
        .filter(([_, selected]) => selected)
        .map(([roleId, _]) => parseInt(roleId));

      const requestData = {
        ...formData,
        permissions: selectedPermissionsArray,
        role_ids: selectedRolesArray,
      };

      await axiosInstance.post("/v1/employees", requestData);

      setCreateSuccess(true);
      setShowCreateDialog(false);

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        active: true,
        role_ids: [],
        permissions: [],
      });
      setSelectedPermissions({});
      setSelectedRoles({});

      // Refresh employees list
      await fetchEmployees();

      // Hide success message after 3 seconds
      setTimeout(() => setCreateSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error creating employee:", err);
      setCreateError(err.response?.data?.message || "حدث خطأ في إنشاء الموظف");
    } finally {
      setCreateLoading(false);
    }
  };

  // Update employee
  const updateEmployee = async () => {
    if (!editingEmployee) return;

    setEditLoading(true);
    setEditError(null);

    try {
      // Convert selected permissions to array
      const selectedPermissionsArray = Object.entries(editSelectedPermissions)
        .filter(([_, selected]) => selected)
        .map(([permissionName, _]) => permissionName);

      const requestData = {
        ...editFormData,
        permissions: selectedPermissionsArray,
        role_ids: [], // إزالة الأدوار
      };

      // Remove password if empty
      if (!requestData.password) {
        delete requestData.password;
      }

      await axiosInstance.put(
        `/v1/employees/${editingEmployee.id}`,
        requestData,
      );

      setEditSuccess(true);
      setShowEditDialog(false);

      // Reset form
      setEditFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        active: true,
        role_ids: [],
        permissions: [],
      });
      setEditSelectedPermissions({});
      setEditSelectedRoles({});
      setEditingEmployee(null);

      // Refresh employees list
      await fetchEmployees();

      // Hide success message after 3 seconds
      setTimeout(() => setEditSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error updating employee:", err);
      setEditError(err.response?.data?.message || "حدث خطأ في تحديث الموظف");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle edit employee
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      password: "",
      active: employee.status === 1,
      role_ids: employee.roles.map((role) => role.id),
      permissions: employee.permissions.map((perm) => perm.name),
    });

    // Set selected permissions
    const permissionsMap: { [key: string]: boolean } = {};
    employee.permissions.forEach((perm) => {
      permissionsMap[perm.name] = true;
    });
    setEditSelectedPermissions(permissionsMap);

    // Set selected roles
    const rolesMap: { [key: number]: boolean } = {};
    employee.roles.forEach((role) => {
      rolesMap[role.id] = true;
    });
    setEditSelectedRoles(rolesMap);

    setShowEditDialog(true);
  };

  // Handle view role details
  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setShowRoleDetailsDialog(true);
    fetchRoleDetails(role.id);
  };

  // Handle edit role
  const handleEditRole = async (role: Role) => {
    setEditingRole(role);
    setEditRoleFormData({
      name: role.name,
      permissions: [],
    });

    // Fetch role details to get current permissions
    try {
      const response = await axiosInstance.get(`/v1/roles/${role.id}`);
      const roleData = response.data.data;

      // Set selected permissions based on current role permissions
      const permissionsMap: { [key: string]: boolean } = {};
      if (
        roleData.permissions_list &&
        Array.isArray(roleData.permissions_list)
      ) {
        roleData.permissions_list.forEach((permission: string) => {
          permissionsMap[permission] = true;
        });
      }
      setEditSelectedRolePermissions(permissionsMap);

      setShowEditRoleDialog(true);
    } catch (error: any) {
      console.error("Error fetching role details for edit:", error);
      setEditRoleError("فشل في جلب تفاصيل الدور");
    }
  };

  // Handle delete role
  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setShowDeleteRoleDialog(true);
  };

  // Handle delete permission
  const handleDeletePermission = (permission: any) => {
    setPermissionToDelete(permission);
    setShowDeletePermissionDialog(true);
  };

  // Handle delete employee
  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteEmployeeDialog(true);
  };

  // Handle role permission selection
  const handleRolePermissionChange = (
    permissionName: string,
    checked: boolean,
  ) => {
    setSelectedRolePermissions((prev) => ({
      ...prev,
      [permissionName]: checked,
    }));
  };

  // Handle edit role permission selection
  const handleEditRolePermissionChange = (
    permissionName: string,
    checked: boolean,
  ) => {
    setEditSelectedRolePermissions((prev) => ({
      ...prev,
      [permissionName]: checked,
    }));
  };

  // Create new role
  const createRole = async () => {
    setCreateRoleLoading(true);
    setCreateRoleError(null);

    try {
      // Convert selected permissions to array
      const selectedPermissions = Object.entries(selectedRolePermissions)
        .filter(([_, isSelected]) => isSelected)
        .map(([permissionName, _]) => permissionName);

      const requestData = {
        name: roleFormData.name,
        permissions: selectedPermissions,
      };

      console.log("📋 Creating role with data:", requestData);

      const response = await axiosInstance.post("/v1/roles", requestData);
      console.log("📋 Create Role API Response:", response.data);

      setCreateRoleSuccess(true);
      setRoleFormData({ name: "", permissions: [] });
      setSelectedRolePermissions({});

      // Refresh roles list
      fetchRolesForTab();

      // Close dialog after success
      setTimeout(() => {
        setShowCreateRoleDialog(false);
        setCreateRoleSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error("❌ Error creating role:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error data:", error.response?.data);

      // Handle different types of errors
      let errorMessage = "فشل في إنشاء الدور";

      if (error.response?.data?.message) {
        // Translate common English error messages to Arabic
        const message = error.response.data.message;
        if (message === "Validation failed") {
          errorMessage = "فشل في التحقق من صحة البيانات";
        } else if (message === "Unauthorized") {
          errorMessage = "غير مصرح لك بالوصول";
        } else if (message === "Forbidden") {
          errorMessage = "ممنوع الوصول";
        } else if (message === "Not Found") {
          errorMessage = "غير موجود";
        } else if (message === "Server Error") {
          errorMessage = "خطأ في الخادم";
        } else if (message === "Role already exists") {
          errorMessage = "اسم الدور موجود بالفعل";
        } else if (message === "Invalid permissions") {
          errorMessage = "الصلاحيات المحددة غير صحيحة";
        } else if (message === "Permission denied") {
          errorMessage = "ليس لديك صلاحية للقيام بهذا الإجراء";
        } else if (message === "Network error") {
          errorMessage = "خطأ في الاتصال بالشبكة";
        } else if (message === "Timeout") {
          errorMessage = "انتهت مهلة الاتصال";
        } else {
          errorMessage = message;
        }
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (errors.name) {
          const nameError = errors.name[0];
          if (nameError.includes("required")) {
            errorMessage = "اسم الدور مطلوب";
          } else if (nameError.includes("unique")) {
            errorMessage = "اسم الدور موجود بالفعل";
          } else if (nameError.includes("min")) {
            errorMessage = "اسم الدور قصير جداً";
          } else if (nameError.includes("max")) {
            errorMessage = "اسم الدور طويل جداً";
          } else {
            errorMessage = `اسم الدور: ${nameError}`;
          }
        } else if (errors.permissions) {
          const permissionError = errors.permissions[0];
          if (permissionError.includes("required")) {
            errorMessage = "يجب تحديد صلاحية واحدة على الأقل";
          } else if (permissionError.includes("invalid")) {
            errorMessage = "الصلاحيات المحددة غير صحيحة";
          } else {
            errorMessage = `الصلاحيات: ${permissionError}`;
          }
        } else {
          // Translate common validation error messages
          const allErrors = Object.values(errors).flat();
          const translatedErrors = allErrors.map((error) => {
            const errorStr = String(error);
            if (errorStr.includes("required")) return "مطلوب";
            if (errorStr.includes("unique")) return "موجود بالفعل";
            if (errorStr.includes("min")) return "قصير جداً";
            if (errorStr.includes("max")) return "طويل جداً";
            if (errorStr.includes("invalid")) return "غير صحيح";
            if (errorStr.includes("email")) return "البريد الإلكتروني غير صحيح";
            if (errorStr.includes("password")) return "كلمة المرور غير صحيحة";
            return errorStr;
          });
          errorMessage = translatedErrors.join(", ");
        }
      } else if (error.response?.status === 422) {
        errorMessage = "البيانات المرسلة غير صحيحة";
      } else if (error.response?.status === 409) {
        errorMessage = "اسم الدور موجود بالفعل";
      } else if (error.response?.status === 403) {
        errorMessage = "ليس لديك صلاحية لإنشاء أدوار";
      } else if (error.response?.status === 500) {
        errorMessage = "خطأ في الخادم، يرجى المحاولة لاحقاً";
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage = "خطأ في الاتصال بالخادم";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى";
      }

      setCreateRoleError(errorMessage);
    } finally {
      setCreateRoleLoading(false);
    }
  };

  // Update role
  const updateRole = async () => {
    if (!editingRole) return;

    setEditRoleLoading(true);
    setEditRoleError(null);

    try {
      // Convert selected permissions to array
      const selectedPermissions = Object.entries(editSelectedRolePermissions)
        .filter(([_, isSelected]) => isSelected)
        .map(([permissionName, _]) => permissionName);

      const requestData = {
        name: editRoleFormData.name,
        permissions: selectedPermissions,
      };

      console.log("📋 Updating role with data:", requestData);

      const response = await axiosInstance.put(
        `/v1/roles/${editingRole.id}`,
        requestData,
      );
      console.log("📋 Update Role API Response:", response.data);

      setEditRoleSuccess(true);

      // Refresh roles list
      fetchRolesForTab();

      // Close dialog after success
      setTimeout(() => {
        setShowEditRoleDialog(false);
        setEditRoleSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error("Error updating role:", error);
      setEditRoleError(error.response?.data?.message || "فشل في تحديث الدور");
    } finally {
      setEditRoleLoading(false);
    }
  };

  // Delete role
  const deleteRole = async () => {
    if (!roleToDelete) return;

    setDeleteRoleLoading(true);
    setDeleteRoleError(null);

    try {
      console.log("📋 Deleting role:", roleToDelete.id);

      const response = await axiosInstance.delete(
        `/v1/roles/${roleToDelete.id}`,
      );
      console.log("📋 Delete Role API Response:", response.data);

      // Refresh roles list
      fetchRolesForTab();

      // Close dialog
      setShowDeleteRoleDialog(false);
      setRoleToDelete(null);
    } catch (error: any) {
      console.error("Error deleting role:", error);
      setDeleteRoleError(error.response?.data?.message || "فشل في حذف الدور");
    } finally {
      setDeleteRoleLoading(false);
    }
  };

  // Delete permission
  const deletePermission = async () => {
    if (!permissionToDelete) return;

    setDeletePermissionLoading(true);
    setDeletePermissionError(null);

    try {
      console.log("📋 Deleting permission:", permissionToDelete.id);

      const response = await axiosInstance.delete(
        `/v1/permissions/${permissionToDelete.id}`,
      );
      console.log("📋 Delete Permission API Response:", response.data);

      // Refresh permissions list
      fetchPermissionsForTab();

      // Close dialog
      setShowDeletePermissionDialog(false);
      setPermissionToDelete(null);
    } catch (error: any) {
      console.error("Error deleting permission:", error);
      setDeletePermissionError(
        error.response?.data?.message || "فشل في حذف الصلاحية",
      );
    } finally {
      setDeletePermissionLoading(false);
    }
  };

  // Delete employee
  const deleteEmployee = async () => {
    if (!employeeToDelete) return;

    setDeleteEmployeeLoading(true);
    setDeleteEmployeeError(null);

    try {
      console.log("📋 Deleting employee:", employeeToDelete.id);

      const response = await axiosInstance.delete(
        `/v1/employees/${employeeToDelete.id}`,
      );
      console.log("📋 Delete Employee API Response:", response.data);

      // Refresh employees list
      fetchEmployees();

      // Close dialog
      setShowDeleteEmployeeDialog(false);
      setEmployeeToDelete(null);
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      setDeleteEmployeeError(
        error.response?.data?.message || "فشل في حذف الموظف",
      );
    } finally {
      setDeleteEmployeeLoading(false);
    }
  };

  // Purchase employee addon (increase limit)
  const handlePurchaseEmployeeAddon = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    setIsPurchasingAddon(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/employee/addons", {
        qty: 1,
        plan_id: 1,
      });

      if (response.data.status === "success" && response.data.payment_url) {
        setPaymentUrl(response.data.payment_url);
        setPaymentPopupOpen(true);
      } else {
        setError("فشل في إنشاء طلب الشراء");
      }
    } catch (err: any) {
      console.error("Error purchasing employee addon:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء شراء الحد الإضافي");
    } finally {
      setIsPurchasingAddon(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    setPaymentPopupOpen(false);
    setPaymentUrl("");
    
    // Refresh user data to get updated employees quota
    const userStore = useUserStore.getState();
    await userStore.refreshUserData();
    
    // Refresh employees list
    await fetchEmployees();
  };

  // Navigate to create employee page (only if within limit)
  const handleNavigateToCreateEmployee = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we can add employee (within limit)
    if (!employeesData || !employeesData.max_employees) {
      // No limit set, can add employee
      router.push("/dashboard/access-control/create-employee");
      return;
    }
    
    const usage = employeesData.usage || employeesData.total_count || 0;
    const maxEmployees = employeesData.max_employees;
    const usagePercentage = usage / maxEmployees;
    const isAtLimit = usagePercentage >= 1;
    
    // Only navigate if not at limit
    if (!isAtLimit) {
      router.push("/dashboard/access-control/create-employee");
    }
  };

  // Handle permission selection
  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionName]: checked,
    }));
  };

  // Handle group permission selection
  const handleGroupPermissionChange = (groupName: string, checked: boolean) => {
    if (!permissions) return;

    const groupPermissions = permissions.grouped[groupName] || [];
    const newPermissions = { ...selectedPermissions };

    groupPermissions.forEach((permission) => {
      newPermissions[permission.name] = checked;
    });

    setSelectedPermissions(newPermissions);
  };

  // Check if all permissions in a group are selected
  const isGroupFullySelected = (groupName: string) => {
    if (!permissions) return false;
    const groupPermissions = permissions.grouped[groupName] || [];
    return groupPermissions.every(
      (permission) => selectedPermissions[permission.name],
    );
  };

  // Check if some permissions in a group are selected
  const isGroupPartiallySelected = (groupName: string) => {
    if (!permissions) return false;
    const groupPermissions = permissions.grouped[groupName] || [];
    const selectedCount = groupPermissions.filter(
      (permission) => selectedPermissions[permission.name],
    ).length;
    return selectedCount > 0 && selectedCount < groupPermissions.length;
  };

  // Handle role selection for create
  const handleCreateRoleChange = (roleId: number, checked: boolean) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [roleId]: checked,
    }));
  };

  // Handle role selection for edit
  const handleRoleChange = (roleId: number, checked: boolean) => {
    setEditSelectedRoles((prev) => ({
      ...prev,
      [roleId]: checked,
    }));
  };

  // Handle edit permission selection
  const handleEditPermissionChange = (
    permissionName: string,
    checked: boolean,
  ) => {
    setEditSelectedPermissions((prev) => ({
      ...prev,
      [permissionName]: checked,
    }));
  };

  // Handle edit group permission selection
  const handleEditGroupPermissionChange = (
    groupName: string,
    checked: boolean,
  ) => {
    if (!permissions) return;

    const groupPermissions = permissions.grouped[groupName] || [];
    const newPermissions = { ...editSelectedPermissions };

    groupPermissions.forEach((permission) => {
      newPermissions[permission.name] = checked;
    });

    setEditSelectedPermissions(newPermissions);
  };

  // Check if all permissions in a group are selected for edit
  const isEditGroupFullySelected = (groupName: string) => {
    if (!permissions) return false;
    const groupPermissions = permissions.grouped[groupName] || [];
    return groupPermissions.every(
      (permission) => editSelectedPermissions[permission.name],
    );
  };

  // Check if some permissions in a group are selected for edit
  const isEditGroupPartiallySelected = (groupName: string) => {
    if (!permissions) return false;
    const groupPermissions = permissions.grouped[groupName] || [];
    const selectedCount = groupPermissions.filter(
      (permission) => editSelectedPermissions[permission.name],
    ).length;
    return selectedCount > 0 && selectedCount < groupPermissions.length;
  };

  useEffect(() => {
    fetchEmployees();
    fetchAvailablePermissions();
    // Fetch user data if not already loaded
    const userStore = useUserStore.getState();
    if (!userStore.userData || !userStore.userData.employees) {
      userStore.fetchUserData();
    }
  }, []);

  // Monitor availablePermissions changes
  useEffect(() => {
    console.log("🔄 Available permissions changed:", availablePermissions);
    if (availablePermissions.length > 0) {
      console.log(
        "✅ Available permissions loaded:",
        availablePermissions.length,
        "permissions",
      );
      console.log("🔍 Sample permission:", availablePermissions[0]);

      // Test translation
      const testTranslation = translatePermission("properties.view");
      console.log(
        "🧪 Test translation for 'properties.view':",
        testTranslation,
      );
    }
  }, [availablePermissions]);

  // Fetch permissions for create dialog
  const fetchPermissions = async () => {
    setPermissionsLoading(true);
    try {
      const response =
        await axiosInstance.get<PermissionsResponse>("/v1/permissions");
      setPermissions(response.data);
    } catch (err: any) {
      console.error("Error fetching permissions:", err);
      setCreateError("حدث خطأ في جلب الصلاحيات");
    } finally {
      setPermissionsLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 Create dialog useEffect:", {
      showCreateDialog,
      permissions: !!permissions,
      rolesLength: roles.length,
    });
    if (showCreateDialog) {
      if (!permissions) {
        console.log("🔑 Fetching permissions for create dialog");
        fetchPermissions();
      }
    }
  }, [showCreateDialog]);

  useEffect(() => {
    console.log("🔄 Edit dialog useEffect:", {
      showEditDialog,
      permissions: !!permissions,
    });
    if (showEditDialog && !permissions) {
      console.log("🔑 Fetching permissions for edit dialog");
      fetchPermissions();
    }
  }, [showEditDialog]);

  useEffect(() => {
    if (activeTab === "permissions" && !permissionsTabData) {
      fetchPermissionsForTab();
    }
    if (activeTab === "roles" && rolesTabData.length === 0) {
      fetchRolesForTab();
    }
  }, [activeTab]);

  useEffect(() => {
    if (showCreateRoleDialog && !availablePermissionsForRole) {
      fetchAvailablePermissionsForRole();
    }
  }, [showCreateRoleDialog]);

  useEffect(() => {
    if (showEditRoleDialog && !availablePermissionsForRole) {
      fetchAvailablePermissionsForRole();
    }
  }, [showEditRoleDialog]);

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    fetchEmployeeDetails(employee.id);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-US");
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 0:
        return <Badge className="bg-red-100 text-red-800">غير نشط</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col h-screen bg-white">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <EnhancedSidebar />

        <div className="flex-1 overflow-auto p-6">
          <div className=" mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                إدارة الموظفين
              </h1>
            </div>

            {/* Employee Stats Cards */}
            {employeesData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Quota Card */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          الحد من الاستخدام
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {employeesData.max_employees || employeesData.quota || 0}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Total Employees Card */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          عدد الموظفين
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {employeesData.total_count || employeesData.usage || 0}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-900" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Employees Card */}
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          الموظفين النشطين
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {employeesData.active_count || 0}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Status Card */}
                <Card className={`hover:shadow-lg transition-all duration-300 ${employeesData.is_over_limit ? 'border-red-300' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          حالة الاستخدام
                        </p>
                        {employeesData.is_over_limit ? (
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-red-600">
                              {employeesData.max_employees ? 
                                Math.round(((employeesData.usage || employeesData.total_count || 0) / employeesData.max_employees) * 100) : 0
                              }%
                            </p>
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          </div>
                        ) : (
                          <p className="text-2xl font-bold text-gray-700">
                            {employeesData.max_employees ? 
                              Math.round(((employeesData.usage || employeesData.total_count || 0) / employeesData.max_employees) * 100) : 0
                            }%
                          </p>
                        )}
                        {employeesData.is_over_limit && (
                          <p className="text-xs text-red-600 mt-1">
                            تجاوز الحد المسموح
                          </p>
                        )}
                        {!employeesData.is_over_limit && employeesData.max_employees && 
                         ((employeesData.usage || employeesData.total_count || 0) / employeesData.max_employees) >= 1 && (
                          <p className="text-xs text-orange-600 mt-1">
                            الحد الأقصى
                          </p>
                        )}
                      </div>
                      <div className={`h-12 w-12 ${employeesData.is_over_limit ? 'bg-red-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                        {employeesData.is_over_limit ? (
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        ) : (
                          <BarChart3 className="h-6 w-6 text-gray-700" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                          <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </div>
                        <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Employees Content */}
            <div className="mt-6">
                <Card className="border-0 shadow-none">
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : error ? (
                      <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={fetchEmployees} variant="outline">
                          إعادة المحاولة
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            إجمالي الموظفين: {employees.length}
                          </p>
                          <div className="flex gap-2">
                            {/* <Button
                              onClick={() =>
                                router.push("/dashboard/access-control/roles")
                              }
                              variant="outline"
                              className="border-black text-black hover:bg-black hover:text-white"
                            >
                              <Shield className="h-4 w-4 ml-2" />
                              إدارة الأدوار
                            </Button> */}
                            {(() => {
                              if (!employeesData || !employeesData.max_employees) {
                                return (
                                  <Button
                                    type="button"
                                    className="bg-black hover:bg-gray-800 text-white"
                                    onClick={handleNavigateToCreateEmployee}
                                  >
                                    <UserPlus className="h-4 w-4 ml-2" />
                                    إضافة موظف جديد
                                  </Button>
                                );
                              }
                              
                              const usage = employeesData.usage || employeesData.total_count || 0;
                              const maxEmployees = employeesData.max_employees;
                              const usagePercentage = usage / maxEmployees;
                              const isAtLimit = usagePercentage >= 1;
                              
                              if (isAtLimit) {
                                return (
                                  <Button
                                    type="button"
                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (e.nativeEvent) {
                                        e.nativeEvent.stopImmediatePropagation();
                                      }
                                      handlePurchaseEmployeeAddon(e);
                                      return false;
                                    }}
                                    disabled={isPurchasingAddon}
                                  >
                                    {isPurchasingAddon ? (
                                      <>
                                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                        جاري المعالجة...
                                      </>
                                    ) : (
                                      <>
                                        <TrendingUp className="h-4 w-4 ml-2" />
                                        زيادة الحد المسموح
                                      </>
                                    )}
                                  </Button>
                                );
                              }
                              
                              return (
                                <Button
                                  type="button"
                                  className="bg-black hover:bg-gray-800 text-white"
                                  onClick={handleNavigateToCreateEmployee}
                                >
                                  <UserPlus className="h-4 w-4 ml-2" />
                                  إضافة موظف جديد
                                </Button>
                              );
                            })()}
                          </div>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right">
                                الموظف
                              </TableHead>
                              <TableHead className="text-right">
                                البريد الإلكتروني
                              </TableHead>
                              <TableHead className="text-right">
                                الهاتف
                              </TableHead>
                              <TableHead className="text-right">
                                الأدوار
                              </TableHead>
                              <TableHead className="text-right">
                                الحالة
                              </TableHead>
                              <TableHead className="text-right">
                                تاريخ الإنشاء
                              </TableHead>
                              <TableHead className="text-right">
                                الإجراءات
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {employees.map((employee) => (
                              <TableRow key={employee.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={employee.photo || ""} />
                                      <AvatarFallback>
                                        {getInitials(
                                          employee.first_name,
                                          employee.last_name,
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        {employee.first_name}{" "}
                                        {employee.last_name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {employee.company_name || "بدون شركة"}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    {employee.email}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    {employee.phone}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {employee.roles.map((role) => (
                                      <Badge key={role.id} variant="outline">
                                        {role.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(employee.status)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {formatDate(employee.created_at)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/access-control/edit-employee/${employee.id}`,
                                        )
                                      }
                                      className="flex items-center gap-2"
                                    >
                                      <Edit className="h-4 w-4" />
                                      تعديل
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteEmployee(employee)
                                      }
                                      className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:border-red-800"
                                    >
                                      <XCircle className="h-4 w-4" />
                                      حذف
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/access-control/view-employee/${employee.id}`,
                                        )
                                      }
                                      className="flex items-center gap-2"
                                    >
                                      <Eye className="h-4 w-4" />
                                      عرض التفاصيل
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Role Details Dialog */}
      <Dialog
        open={showRoleDetailsDialog}
        onOpenChange={setShowRoleDetailsDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black">
              <Shield className="h-5 w-5" />
              تفاصيل الدور
            </DialogTitle>
            <DialogDescription>عرض تفاصيل الدور وصلاحياته</DialogDescription>
          </DialogHeader>

          {roleDetailsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="text-gray-600 font-medium">
                  جاري تحميل تفاصيل الدور...
                </span>
                <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-black animate-pulse rounded-full"></div>
                </div>
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
          ) : roleDetails ? (
            <div className="space-y-6">
              {/* Role Basic Info */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-black rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black capitalize">
                      {roleDetails.name}
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
                      <span className="font-medium">{roleDetails.team_id}</span>
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
                      <span className="text-gray-600">تاريخ الإنشاء:</span>
                      <span className="font-medium">
                        {new Date(roleDetails.created_at).toLocaleDateString(
                          "ar-US",
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-gray-600">آخر تحديث:</span>
                      <span className="font-medium">
                        {new Date(roleDetails.updated_at).toLocaleDateString(
                          "ar-US",
                        )}
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
                    الصلاحيات ({roleDetails.permissions_list?.length || 0})
                  </h4>
                </div>

                {roleDetails.permissions_list &&
                roleDetails.permissions_list.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {roleDetails.permissions_list.map(
                      (permission: string, index: number) => (
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
                                {translatePermission(permission)}
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
                    <p className="text-gray-600">لا توجد صلاحيات لهذا الدور</p>
                  </div>
                )}
              </div>

              {/* Detailed Permissions */}
              {roleDetails.permissions &&
                roleDetails.permissions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-gray-600" />
                      <h4 className="text-lg font-semibold text-black">
                        تفاصيل الصلاحيات
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {roleDetails.permissions.map(
                        (permission: any, index: number) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 hover:border-black transition-colors"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                                  <Lock className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-medium text-gray-900 truncate">
                                    {translatePermission(permission.name)}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    معرف الصلاحية: {permission.id}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right lg:text-left">
                                <p className="text-sm text-gray-600">
                                  معرف الدور: {permission.pivot.role_id}
                                </p>
                                <p className="text-sm text-gray-600">
                                  معرف الصلاحية:{" "}
                                  {permission.pivot.permission_id}
                                </p>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد بيانات للعرض</p>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setShowRoleDetailsDialog(false)}
              variant="outline"
              className="text-gray-600 hover:text-black hover:border-black"
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Role Dialog */}
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
                              {groupName}
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
                                      {translatePermission(permission.name)}
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
                              {groupName}
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
                                      {translatePermission(permission.name)}
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
                      {roleToDelete.name}
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

      {/* Delete Permission Dialog */}
      <Dialog
        open={showDeletePermissionDialog}
        onOpenChange={setShowDeletePermissionDialog}
      >
        <DialogContent className="max-w-md bg-white mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              حذف الصلاحية
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذه الصلاحية؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>

          {permissionToDelete && (
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Lock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-red-800">
                      {permissionToDelete.name}
                    </h4>
                    <p className="text-sm text-red-600">
                      معرف الصلاحية: {permissionToDelete.id}
                    </p>
                    {permissionToDelete.description && (
                      <p className="text-sm text-red-600 mt-1">
                        {permissionToDelete.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {deletePermissionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  {deletePermissionError}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setShowDeletePermissionDialog(false)}
              variant="outline"
              className="text-gray-600 hover:text-black hover:border-black"
            >
              إلغاء
            </Button>
            <Button
              onClick={deletePermission}
              disabled={deletePermissionLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletePermissionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 ml-2" />
                  حذف الصلاحية
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Employee Dialog */}
      <Dialog
        open={showDeleteEmployeeDialog}
        onOpenChange={setShowDeleteEmployeeDialog}
      >
        <DialogContent className="max-w-md bg-white mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              حذف الموظف
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>

          {employeeToDelete && (
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={employeeToDelete.photo || ""} />
                    <AvatarFallback>
                      {getInitials(
                        employeeToDelete.first_name,
                        employeeToDelete.last_name,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-red-800">
                      {employeeToDelete.first_name} {employeeToDelete.last_name}
                    </h4>
                    <p className="text-sm text-red-600">
                      {employeeToDelete.email}
                    </p>
                    <p className="text-sm text-red-600">
                      معرف الموظف: {employeeToDelete.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {deleteEmployeeError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  {deleteEmployeeError}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setShowDeleteEmployeeDialog(false)}
              variant="outline"
              className="text-gray-600 hover:text-black hover:border-black"
            >
              إلغاء
            </Button>
            <Button
              onClick={deleteEmployee}
              disabled={deleteEmployeeLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteEmployeeLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 ml-2" />
                  حذف الموظف
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Popup */}
      {paymentPopupOpen && (
        <PaymentPopup
          paymentUrl={paymentUrl}
          onClose={() => {
            setPaymentPopupOpen(false);
            setPaymentUrl("");
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}


