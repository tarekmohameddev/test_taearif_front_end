import {
  Building2,
  Settings,
  Users,
  UserCog,
  FileText,
  Home,
  Briefcase,
  MessageSquare,
  LayoutTemplate,
  Download,
  Grid,
} from "lucide-react";

export type MainNavItem = {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  isAPP?: boolean;
  isDirectPath?: boolean;
};

export const staticMenuItems: MainNavItem[] = [
  {
    id: "dashboard",
    label: "لوحة التحكم",
    description: "نظره عامه عن الموقع",
    icon: FileText,
    path: "/dashboard",
  },
  {
    id: "settings",
    label: "اعدادات الموقع",
    description: "تكوين اعدادات الموقع",
    icon: Settings,
    path: "/dashboard/settings",
  },
  {
    id: "customers",
    label: "ادارة العملاء",
    description: "ادارة عملائك",
    icon: Users,
    path: "/dashboard/customers",
  },
  {
    id: "crm",
    label: "CRM",
    description: "تكوين اعدادات ادارة علاقات العملاء",
    icon: UserCog,
    path: "/dashboard/crm",
  },
  {
    id: "projects",
    label: "المشاريع",
    description: "ادارة المشاريع",
    icon: Building2,
    path: "/dashboard/projects",
  },
  {
    id: "buildings",
    label: "العمارات",
    description: "ادارة العمارات والعقارات",
    icon: Building2,
    path: "/dashboard/buildings",
  },
  {
    id: "properties",
    label: "العقارات",
    description: "ادارة العقارات",
    icon: Home,
    path: "/dashboard/properties",
  },
  {
    id: "property-requests",
    label: "طلبات العملاء",
    description: "ادارة طلبات العملاء العقارية",
    icon: FileText,
    path: "/dashboard/property-requests",
  },
  {
    id: "job-applications",
    label: "المتقدمين للوظائف",
    description: "ادارة المتقدمين للوظائف",
    icon: Briefcase,
    path: "/dashboard/job-applications",
  },
  {
    id: "matching",
    label: "مركز توافق الطلبات الذكائي",
    description: "احصل على توافق ذكي مع الطلبات",
    icon: MessageSquare,
    path: "/dashboard/matching",
  },
  {
    id: "live-editor",
    label: "تعديل تصميم الموقع",
    description: "ادارة محتوى الموقع",
    icon: LayoutTemplate,
    path: "/live-editor",
    isDirectPath: true,
  },
  {
    id: "access-control",
    label: "ادارة الموظفين",
    description: "ادارة الموظفين",
    icon: Users,
    path: "/dashboard/access-control",
  },
  {
    id: "rental-management",
    label: "ادارة الايجارات",
    description: "ادارة ايجارتك",
    icon: Download,
    path: "/dashboard/rental-management",
  },
  {
    id: "apps",
    label: "التطبيقات",
    description: "ادارة التطبيقات",
    icon: Grid,
    path: "/dashboard/apps",
  },
];
