"use client";

import React, { useState } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Phone,
  MessageSquare,
  Mail,
  Edit,
  MapPin,
  Briefcase,
  Users,
  ChevronDown,
  ChevronUp,
  Building,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus,
  Sparkles,
  Globe,
  UserPlus,
  Bot,
  ClipboardList,
  Home,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { UnifiedCustomer, PropertyInterest } from "@/types/unified-customer";
import { getStageNameAr, getStageColor } from "@/types/unified-customer";

interface CustomerDetailPageSimpleProps {
  customerId: string;
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
  className = "",
  headerAction,
  onHeaderActionClick,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  className?: string;
  headerAction?: "add" | null;
  onHeaderActionClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleHeaderClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on the action button
    if ((e.target as HTMLElement).closest('[data-action-button]')) {
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <Card className={className}>
      <CardHeader
        className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={handleHeaderClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {headerAction === "add" && onHeaderActionClick && (
              <button
                data-action-button
                onClick={(e) => {
                  e.stopPropagation();
                  onHeaderActionClick();
                }}
                className="p-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            {badge}
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </CardHeader>
      {isOpen && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

// Customer Info Card (Always visible at top)
function CustomerInfoCard({ customer }: { customer: UnifiedCustomer }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-2xl font-bold text-primary">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold">{customer.name}</h2>
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1"
                  style={{
                    borderColor: getStageColor(customer.stage),
                    color: getStageColor(customer.stage),
                  }}
                >
                  {getStageNameAr(customer.stage)}
                </Badge>
              </div>

              {/* Contact Info - Compact */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span dir="ltr">{customer.phone}</span>
                </a>
                {customer.whatsapp && (
                  <a
                    href={`https://wa.me/${customer.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-green-600 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>واتساب</span>
                  </a>
                )}
                {customer.email && (
                  <a
                    href={`mailto:${customer.email}`}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </a>
                )}
              </div>

              {/* Location & Details */}
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                {(customer.city || customer.district) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {customer.city}
                    {customer.district && ` - ${customer.district}`}
                  </span>
                )}
                {customer.occupation && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {customer.occupation}
                  </span>
                )}
                {customer.familySize && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {customer.familySize} أفراد
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 lg:border-r lg:pr-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-bold">{customer.totalInteractions || 0}</div>
                <div className="text-xs text-gray-500">تفاعل</div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-bold">{customer.totalAppointments || 0}</div>
                <div className="text-xs text-gray-500">موعد</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t">
            {customer.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Properties Section with 3 categories
function PropertiesSection({ customer }: { customer: UnifiedCustomer }) {
  // Categorize properties (in real app, this would come from backend)
  // For now, we'll simulate based on property data
  const websiteProperties = customer.properties.filter(
    (p) => p.status === "interested" && !p.notes?.includes("AI") && !p.notes?.includes("manual")
  );
  const aiMatchedProperties = customer.properties.filter(
    (p) => p.notes?.includes("AI") || p.status === "viewing_scheduled"
  );
  const manualProperties = customer.properties.filter(
    (p) => p.notes?.includes("manual") || p.status === "offer_made"
  );

  // If no categorization, show all under general
  const hasCategories =
    websiteProperties.length > 0 || aiMatchedProperties.length > 0 || manualProperties.length > 0;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "secondary" | "default" | "destructive" | "outline"; label: string }> = {
      interested: { variant: "secondary", label: "مهتم" },
      viewing_scheduled: { variant: "default", label: "معاينة مجدولة" },
      viewed: { variant: "default", label: "تمت المعاينة" },
      liked: { variant: "default", label: "أعجبه" },
      rejected: { variant: "destructive", label: "رفض" },
      offer_made: { variant: "default", label: "عرض مقدم" },
    };
    const c = config[status] || config.interested;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const PropertyCard = ({ property }: { property: PropertyInterest }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {property.propertyImage && (
        <div
          className="h-32 bg-cover bg-center"
          style={{ backgroundImage: `url(${property.propertyImage})` }}
        />
      )}
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{property.propertyTitle}</h4>
            {property.propertyLocation && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {property.propertyLocation}
              </p>
            )}
          </div>
          {getStatusBadge(property.status)}
        </div>

        {property.propertyPrice && (
          <div className="flex items-center gap-1 text-sm font-bold text-green-600">
            <DollarSign className="h-3.5 w-3.5" />
            {(property.propertyPrice / 1000).toFixed(0)}k ريال
          </div>
        )}

        <Button variant="ghost" size="sm" className="w-full mt-2 h-8 text-xs">
          <Eye className="h-3 w-3 ml-1" />
          عرض التفاصيل
        </Button>
      </CardContent>
    </Card>
  );

  const PropertyCategory = ({
    title,
    icon: Icon,
    properties,
    color,
  }: {
    title: string;
    icon: React.ElementType;
    properties: PropertyInterest[];
    color: string;
  }) => {
    const [expanded, setExpanded] = useState(properties.length <= 2);

    if (properties.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="font-medium text-sm">{title}</span>
          <Badge variant="outline" className="text-xs">
            {properties.length}
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(expanded ? properties : properties.slice(0, 2)).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {properties.length > 2 && !expanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(true)}
            className="w-full text-xs"
          >
            عرض المزيد ({properties.length - 2} عقار آخر)
            <ChevronDown className="h-3 w-3 mr-1" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Preferences Summary - Always visible */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h4 className="font-semibold text-sm mb-3">تفضيلات العميل</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block text-xs">نوع العقار</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {customer.preferences.propertyType.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type === "villa"
                    ? "فيلا"
                    : type === "apartment"
                    ? "شقة"
                    : type === "land"
                    ? "أرض"
                    : type === "commercial"
                    ? "تجاري"
                    : type}
                </Badge>
              ))}
            </div>
          </div>
          {customer.preferences.budgetMax && (
            <div>
              <span className="text-gray-500 block text-xs">الميزانية</span>
              <span className="font-medium">
                {(customer.preferences.budgetMin || 0) / 1000}k - {customer.preferences.budgetMax / 1000}k ريال
              </span>
            </div>
          )}
          {customer.preferences.bedrooms && (
            <div>
              <span className="text-gray-500 block text-xs">غرف النوم</span>
              <span className="font-medium">{customer.preferences.bedrooms}+</span>
            </div>
          )}
          {customer.preferences.preferredAreas.length > 0 && (
            <div>
              <span className="text-gray-500 block text-xs">المناطق المفضلة</span>
              <span className="font-medium">{customer.preferences.preferredAreas.slice(0, 2).join("، ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Property Categories */}
      {hasCategories ? (
        <div className="space-y-6">
          <PropertyCategory
            title="من الموقع الإلكتروني"
            icon={Globe}
            properties={websiteProperties.length > 0 ? websiteProperties : customer.properties.slice(0, 1)}
            color="text-blue-600"
          />
          <PropertyCategory
            title="مطابقة الذكاء الاصطناعي"
            icon={Bot}
            properties={aiMatchedProperties.length > 0 ? aiMatchedProperties : customer.properties.slice(1, 3)}
            color="text-purple-600"
          />
          <PropertyCategory
            title="أضافها الفريق"
            icon={UserPlus}
            properties={manualProperties.length > 0 ? manualProperties : customer.properties.slice(3)}
            color="text-green-600"
          />
        </div>
      ) : customer.properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {customer.properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Building className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>لم يتم إضافة أي عقارات بعد</p>
        </div>
      )}

      <Button variant="outline" className="w-full">
        <Plus className="h-4 w-4 ml-2" />
        إضافة عقار
      </Button>
    </div>
  );
}

// Task Types Definition
type TaskType = "contact" | "office_visit" | "property_viewing";

interface TaskTypeConfig {
  id: TaskType;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const TASK_TYPES: TaskTypeConfig[] = [
  {
    id: "contact",
    name: "تواصل مع العميل",
    icon: Phone,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200",
  },
  {
    id: "office_visit",
    name: "استقبال العميل في المكتب",
    icon: Building,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200",
  },
  {
    id: "property_viewing",
    name: "معاينة العميل للعقار",
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200",
  },
];

// Customer Task Interface
interface CustomerTask {
  id: string;
  type: TaskType;
  datetime: string;
  notes?: string;
  status: "pending" | "completed" | "cancelled";
  propertyId?: string;
  propertyTitle?: string;
  createdAt: string;
}

// Tasks Section Card with built-in header and "+" button
function TasksSectionCard({ customer }: { customer: UnifiedCustomer }) {
  const [isOpen, setIsOpen] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(null);
  const [newTaskData, setNewTaskData] = useState({
    datetime: "",
    notes: "",
    propertyTitle: "",
  });

  // Mock tasks data - in real app, this would come from customer data
  const [tasks, setTasks] = useState<CustomerTask[]>(() => {
    const convertedTasks: CustomerTask[] = [];
    
    customer.reminders.forEach((r, index) => {
      convertedTasks.push({
        id: `task_${r.id}`,
        type: index % 3 === 0 ? "contact" : index % 3 === 1 ? "office_visit" : "property_viewing",
        datetime: r.datetime,
        notes: r.description || r.title,
        status: r.status === "completed" ? "completed" : r.status === "cancelled" ? "cancelled" : "pending",
        createdAt: r.datetime,
      });
    });

    customer.appointments.forEach((a) => {
      convertedTasks.push({
        id: `task_${a.id}`,
        type: a.type === "site_visit" ? "property_viewing" : a.type === "office_meeting" ? "office_visit" : "contact",
        datetime: a.datetime || `${a.date}T${a.time}`,
        notes: a.notes,
        status: a.status === "completed" ? "completed" : a.status === "cancelled" ? "cancelled" : "pending",
        propertyId: a.propertyId,
        propertyTitle: a.propertyTitle,
        createdAt: a.createdAt,
      });
    });

    return convertedTasks;
  });

  const getTaskTypeConfig = (type: TaskType): TaskTypeConfig => {
    return TASK_TYPES.find((t) => t.id === type) || TASK_TYPES[0];
  };

  const formatDateTime = (datetime: string) => {
    try {
      const date = new Date(datetime);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString();

      const timeStr = date.toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      if (isToday) return `اليوم ${timeStr}`;
      if (isTomorrow) return `غداً ${timeStr}`;

      return date.toLocaleDateString("ar-SA", { month: "short", day: "numeric" }) + ` ${timeStr}`;
    } catch {
      return datetime;
    }
  };

  const isOverdue = (task: CustomerTask) => {
    return task.status === "pending" && new Date(task.datetime) < new Date();
  };

  const handleToggleAddForm = () => {
    if (isAddFormOpen) {
      setIsAddFormOpen(false);
      setSelectedTaskType(null);
      setNewTaskData({ datetime: "", notes: "", propertyTitle: "" });
    } else {
      setIsAddFormOpen(true);
      setIsOpen(true); // Ensure section is open when adding
    }
  };

  const handleSelectTaskType = (type: TaskType) => {
    setSelectedTaskType(type);
  };

  const handleSaveTask = () => {
    if (!selectedTaskType || !newTaskData.datetime) return;

    const newTask: CustomerTask = {
      id: `task_${Date.now()}`,
      type: selectedTaskType,
      datetime: newTaskData.datetime,
      notes: newTaskData.notes,
      propertyTitle: newTaskData.propertyTitle || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsAddFormOpen(false);
    setSelectedTaskType(null);
    setNewTaskData({ datetime: "", notes: "", propertyTitle: "" });
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "completed" as const } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Split tasks by status
  const activeTasks = tasks
    .filter((t) => t.status === "pending")
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  const completedTasks = tasks.filter((t) => t.status === "completed" || t.status === "cancelled");

  // Stats
  const overdueCount = activeTasks.filter(isOverdue).length;
  const todayCount = activeTasks.filter((t) => {
    const d = new Date(t.datetime);
    return d.toDateString() === new Date().toDateString();
  }).length;

  const TaskItem = ({ task }: { task: CustomerTask }) => {
    const config = getTaskTypeConfig(task.type);
    const Icon = config.icon;
    const taskIsOverdue = isOverdue(task);

    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
          taskIsOverdue
            ? "border-red-300 bg-red-50 dark:bg-red-950/30"
            : `${config.bgColor} ${config.borderColor}`
        }`}
      >
        <div
          className={`p-2 rounded-full ${
            taskIsOverdue ? "bg-red-100" : "bg-white dark:bg-gray-700"
          }`}
        >
          <Icon className={`h-4 w-4 ${taskIsOverdue ? "text-red-600" : config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{config.name}</span>
            {taskIsOverdue && (
              <Badge variant="destructive" className="text-xs py-0">
                متأخر
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <Clock className="h-3 w-3" />
            <span>{formatDateTime(task.datetime)}</span>
            {task.propertyTitle && (
              <>
                <span className="text-gray-300">•</span>
                <span className="truncate max-w-[150px]">{task.propertyTitle}</span>
              </>
            )}
          </div>
          {task.notes && (
            <p className="text-xs text-gray-500 mt-1 truncate">{task.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-green-100"
            onClick={() => handleCompleteTask(task.id)}
          >
            <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-100"
            onClick={() => handleDeleteTask(task.id)}
          >
            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      {/* Header with title and + button */}
      <CardHeader
        className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={(e) => {
          // Don't toggle if clicking on the add button
          if ((e.target as HTMLElement).closest('[data-add-button]')) {
            return;
          }
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">المهام</CardTitle>
            {/* Plus Button */}
            <button
              data-add-button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleAddForm();
              }}
              className={`p-1.5 rounded-full transition-colors ${
                isAddFormOpen 
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-600" 
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              <Plus className={`h-4 w-4 transition-transform ${isAddFormOpen ? "rotate-45" : ""}`} />
            </button>
            {activeTasks.length > 0 && (
              <Badge variant="default">{activeTasks.length}</Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0 space-y-4">
          {/* Inline Add Task Form */}
          {isAddFormOpen && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 space-y-4">
              {/* Task Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">نوع المهمة</Label>
                <div className="flex flex-wrap gap-2">
                  {TASK_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedTaskType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleSelectTaskType(type.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? `${type.bgColor} ${type.borderColor} border-solid`
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${type.color}`} />
                        <span className="text-sm font-medium">{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Fields - Only show after task type is selected */}
              {selectedTaskType && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="datetime" className="text-sm">التاريخ والوقت *</Label>
                      <Input
                        id="datetime"
                        type="datetime-local"
                        value={newTaskData.datetime}
                        onChange={(e) => setNewTaskData((prev) => ({ ...prev, datetime: e.target.value }))}
                        className="text-left bg-white dark:bg-gray-800"
                        dir="ltr"
                      />
                    </div>

                    {selectedTaskType === "property_viewing" && (
                      <div className="space-y-2">
                        <Label htmlFor="property" className="text-sm">العقار</Label>
                        <Input
                          id="property"
                          placeholder="اسم العقار أو العنوان"
                          value={newTaskData.propertyTitle}
                          onChange={(e) => setNewTaskData((prev) => ({ ...prev, propertyTitle: e.target.value }))}
                          className="bg-white dark:bg-gray-800"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm">ملاحظات</Label>
                    <Input
                      id="notes"
                      placeholder="أضف ملاحظات..."
                      value={newTaskData.notes}
                      onChange={(e) => setNewTaskData((prev) => ({ ...prev, notes: e.target.value }))}
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      onClick={handleSaveTask}
                      disabled={!newTaskData.datetime}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleAddForm}
                    >
                      إلغاء
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Quick Stats */}
          {(overdueCount > 0 || todayCount > 0) && (
            <div className="flex items-center gap-2">
              {overdueCount > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-950/30 rounded-full border border-red-200">
                  <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                  <span className="text-xs text-red-700 dark:text-red-400 font-medium">
                    {overdueCount} متأخر
                  </span>
                </div>
              )}
              {todayCount > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-200">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                    {todayCount} اليوم
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Active Tasks List */}
          {activeTasks.length > 0 ? (
            <div className="space-y-2">
              {activeTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          ) : !isAddFormOpen && (
            <div className="text-center py-6 text-gray-500">
              <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">لا توجد مهام نشطة</p>
            </div>
          )}

          {/* Completed Tasks Toggle */}
          {completedTasks.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-xs text-gray-500"
              >
                {showCompleted ? (
                  <>
                    <ChevronUp className="h-3 w-3 ml-1" />
                    إخفاء المكتملة
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 ml-1" />
                    عرض المكتملة ({completedTasks.length})
                  </>
                )}
              </Button>
              {showCompleted && (
                <div className="space-y-2 mt-2 opacity-60">
                  {completedTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// Customer Requests Section
function CustomerRequestsSection({ customer }: { customer: UnifiedCustomer }) {
  return (
    <div className="space-y-4">
      {/* Main Request */}
      <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">طلب العميل الرئيسي</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {customer.preferences.purpose === "buy"
                ? "يرغب في شراء عقار"
                : customer.preferences.purpose === "rent"
                ? "يرغب في استئجار عقار"
                : "يرغب في الاستثمار العقاري"}
              {customer.preferences.propertyType.length > 0 &&
                ` - ${customer.preferences.propertyType
                  .map((t) =>
                    t === "villa"
                      ? "فيلا"
                      : t === "apartment"
                      ? "شقة"
                      : t === "land"
                      ? "أرض"
                      : t === "commercial"
                      ? "تجاري"
                      : t
                  )
                  .join(" أو ")}`}
            </p>
          </div>
        </div>
      </div>

      {/* Request Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Budget */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium text-sm">الميزانية</span>
          </div>
          <div className="text-lg font-bold text-green-600">
            {customer.preferences.budgetMin && customer.preferences.budgetMax
              ? `${(customer.preferences.budgetMin / 1000).toFixed(0)}k - ${(customer.preferences.budgetMax / 1000).toFixed(0)}k ريال`
              : customer.preferences.budgetMax
              ? `حتى ${(customer.preferences.budgetMax / 1000).toFixed(0)}k ريال`
              : "غير محدد"}
          </div>
        </div>

        {/* Timeline */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">الإطار الزمني</span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            {customer.preferences.timeline === "immediate"
              ? "فوري"
              : customer.preferences.timeline === "1-3months"
              ? "1-3 أشهر"
              : customer.preferences.timeline === "3-6months"
              ? "3-6 أشهر"
              : "6+ أشهر"}
          </div>
        </div>

        {/* Property Specifications */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-sm">المواصفات</span>
          </div>
          <div className="space-y-1 text-sm">
            {customer.preferences.bedrooms && (
              <div className="flex justify-between">
                <span className="text-gray-500">غرف النوم</span>
                <span className="font-medium">{customer.preferences.bedrooms}+</span>
              </div>
            )}
            {customer.preferences.bathrooms && (
              <div className="flex justify-between">
                <span className="text-gray-500">دورات المياه</span>
                <span className="font-medium">{customer.preferences.bathrooms}+</span>
              </div>
            )}
            {customer.preferences.minArea && (
              <div className="flex justify-between">
                <span className="text-gray-500">المساحة</span>
                <span className="font-medium">
                  {customer.preferences.minArea}
                  {customer.preferences.maxArea && ` - ${customer.preferences.maxArea}`} م²
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Preferred Areas */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-orange-600" />
            <span className="font-medium text-sm">المناطق المفضلة</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {customer.preferences.preferredAreas.length > 0 ? (
              customer.preferences.preferredAreas.map((area) => (
                <Badge key={area} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">غير محدد</span>
            )}
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      {customer.preferences.notes && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-sm mb-2">ملاحظات إضافية</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{customer.preferences.notes}</p>
        </div>
      )}

      {/* Source Info */}
      {customer.sourceDetails && (
        <div className="text-xs text-gray-500 flex items-center gap-4 pt-2 border-t">
          {customer.sourceDetails.campaign && (
            <span>الحملة: {customer.sourceDetails.campaign}</span>
          )}
          {customer.sourceDetails.landingPage && (
            <span>الصفحة: {customer.sourceDetails.landingPage}</span>
          )}
          {customer.sourceDetails.inquiryId && (
            <span>رقم الاستفسار: {customer.sourceDetails.inquiryId}</span>
          )}
        </div>
      )}
    </div>
  );
}

// Main Component
export function CustomerDetailPageSimple({ customerId }: CustomerDetailPageSimpleProps) {
  const { getCustomerById } = useUnifiedCustomersStore();
  const customer = getCustomerById(customerId);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4" dir="rtl">
        <div className="text-2xl font-bold text-gray-400">العميل غير موجود</div>
        <Link href="/ar/dashboard/customers-hub">
          <Button>
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة للقائمة
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/ar/dashboard/customers-hub">
            <Button variant="ghost" size="sm">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              تفاصيل العميل
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">تعديل</span>
          </Button>
        </div>
      </div>

      {/* Customer Info - Always Visible */}
      <CustomerInfoCard customer={customer} />

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {/* Tasks Section - First after customer details */}
        <TasksSectionCard customer={customer} />

        <CollapsibleSection
          title="العقارات"
          icon={Building}
          defaultOpen={true}
          badge={
            customer.properties.length > 0 && (
              <Badge variant="secondary">{customer.properties.length}</Badge>
            )
          }
        >
          <PropertiesSection customer={customer} />
        </CollapsibleSection>

        <CollapsibleSection
          title="طلبات العميل"
          icon={Sparkles}
          defaultOpen={false}
        >
          <CustomerRequestsSection customer={customer} />
        </CollapsibleSection>
      </div>
    </div>
  );
}
