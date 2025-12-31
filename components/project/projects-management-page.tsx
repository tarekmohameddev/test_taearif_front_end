"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";
import {
  Activity,
  Building2,
  Calendar,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  Grid3X3,
  List,
  MapPin,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmptyState from "@/components/empty-state";

export interface IProject {
  id: number;
  visits: number;
  featured_image: string;
  price_range: string;
  latitude: string;
  longitude: string;
  featured: boolean | number; // يمكن أن يكون boolean أو number (1/0)
  complete_status: string;
  units: number;
  completion_date: string;
  developer: string;
  published: boolean | number; // يمكن أن يكون boolean أو number (1/0)
  created_at: string;
  updated_at: string;
  amenities: any[] | string; // يمكن أن يكون array أو string
  contents: Array<{
    id: number;
    title: string;
    address: string;
    description: string;
    meta_keyword: string | null;
    meta_description: string | null;
    slug: string;
  }>;
  specifications: any[];
  types: any[];
  creator?: {
    id: number;
    name: string;
    type: string;
  } | null;
}

export interface IPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface IProjectsApiResponse {
  status: string;
  data: {
    projects: IProject[];
    pagination: IPagination;
  };
}

// مكون SkeletonProjectCard لعرض بطاقة تحميل تحاكي شكل بطاقة المشروع
function SkeletonProjectCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative">
        <div className="aspect-[16/9] w-full bg-gray-300"></div>
      </div>
      <CardHeader className="p-4">
        <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <div className="h-8 w-full bg-gray-300 rounded"></div>
        <div className="h-8 w-full bg-gray-300 rounded"></div>
      </CardFooter>
    </Card>
  );
}

export function ProjectsManagementPage() {
  const [isLimitReached, setIsLimitReached] = useState(false);
  const router = useRouter();
  const { userData } = useAuthStore();
  const {
    projectsManagement: {
      viewMode,
      projects,
      pagination,
      loadingProjects,
      error,
      isInitialized,
    },
    setProjectsManagement,
    fetchProjects,
  } = useStore();

  // Debug logging for state
  console.log("=== COMPONENT STATE DEBUGGING ===");
  console.log("projects from store:", projects);
  console.log("projects length:", projects?.length);
  console.log("loadingProjects:", loadingProjects);
  console.log("isInitialized:", isInitialized);

  // تحديث وضع العرض
  const setViewMode = (mode: "grid" | "list") => {
    setProjectsManagement({ viewMode: mode });
  };

  const handleDelete = async (id: number) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      alert("Authentication required. Please login.");
      return;
    }

    try {
      const response = await axiosInstance.delete(`/projects/${id}`);
    } catch (error) {
      console.error("حدث خطأ أثناء الحذف:", error);
    }
  };

  useEffect(() => {
    console.log(
      "useEffect triggered - isInitialized:",
      isInitialized,
      "loadingProjects:",
      loadingProjects,
    );

    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchProjects");
      return;
    }

    // Always fetch projects when component mounts if not initialized
    if (!isInitialized) {
      console.log("Calling fetchProjects...");
      fetchProjects();
    }
  }, [fetchProjects, isInitialized, userData?.token]);

  const renderSkeletons = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <SkeletonProjectCard key={idx} />
      ))}
    </div>
  );

  const renderProjectCards = (projectsToRender: IProject[]) => {
    console.log("renderProjectCards called with:", projectsToRender);
    console.log("projectsToRender length:", projectsToRender?.length);

    return viewMode === "grid" ? (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projectsToRender.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {projectsToRender.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </div>
    );
  };

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab="projects" setActiveTab={() => {}} />
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
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="projects" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header and Controls */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  إدارة المشاريع
                </h1>
                <p className="text-muted-foreground">
                  إضافة وإدارة مشاريع التطوير العقاري لموقعك الإلكتروني
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-muted" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="sr-only">عرض الشبكة</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">عرض القائمة</span>
                </Button>
                {/* <Button
                  variant="outline"
                  className="gap-1"
                  onClick={() => {
                  }}
                >
                  <Filter className="h-4 w-4" />
                  تصفية
                </Button> */}
                <Button
                  className="gap-1"
                  onClick={() => {
                    const projectsLength = projects?.length || 0;
                    const limit =
                      useAuthStore.getState().userData?.project_limit_number;

                    if (projectsLength >= limit) {
                      toast.error(`لا يمكنك إضافة أكثر من ${limit} مشاريع`);
                      setIsLimitReached(true);
                    } else {
                      router.push("projects/add");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                  إضافة مشروع
                </Button>
              </div>
            </div>

            {/* نافذة منبثقة عند الوصول للحد الأقصى */}
            <Dialog open={isLimitReached} onOpenChange={setIsLimitReached}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center text-red-500">
                    لقد وصلت للحد الأقصى للإضافة
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    برجاء ترقية الباقة لإضافة المزيد من المشاريع.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsLimitReached(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={() => router.push("/dashboard/settings")}>
                    اشتراك
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {loadingProjects ? (
              renderSkeletons()
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-lg text-red-500">خطأ في تحميل المشاريع</p>
                  <p className="text-sm text-gray-500 mt-2">{error}</p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="all">
                {/* <TabsList> */}
                {/* <TabsTrigger value="all">جميع المشاريع</TabsTrigger> */}
                {/* <TabsTrigger value="1">منشور</TabsTrigger>
                  <TabsTrigger value="0">مسودات</TabsTrigger>
                  <TabsTrigger value="featured">مميز</TabsTrigger> */}
                {/* </TabsList> */}
                <TabsContent value="all" className="mt-4">
                  {(() => {
                    console.log("TabsContent all - projects:", projects);
                    console.log(
                      "TabsContent all - projects length:",
                      projects?.length,
                    );
                    console.log(
                      "TabsContent all - isArray:",
                      Array.isArray(projects),
                    );

                    if (
                      projects &&
                      Array.isArray(projects) &&
                      projects.length > 0
                    ) {
                      console.log("Rendering project cards");
                      return renderProjectCards(projects);
                    } else {
                      console.log("Rendering empty state");
                      return <EmptyState type="مشاريع" />;
                    }
                  })()}
                </TabsContent>
                <TabsContent value="1" className="mt-4">
                  {(() => {
                    if (
                      !projects ||
                      !Array.isArray(projects) ||
                      projects.length === 0
                    ) {
                      return <EmptyState type="مشاريع" />;
                    }
                    const publishedProjects = projects.filter(
                      (project: IProject) => {
                        if (typeof project.published === "boolean") {
                          return project.published === true;
                        } else {
                          return project.published === 1;
                        }
                      },
                    );
                    return publishedProjects.length === 0 ? (
                      <EmptyState type="مشاريع" />
                    ) : (
                      renderProjectCards(publishedProjects)
                    );
                  })()}
                </TabsContent>
                <TabsContent value="0" className="mt-4">
                  {(() => {
                    if (
                      !projects ||
                      !Array.isArray(projects) ||
                      projects.length === 0
                    ) {
                      return <EmptyState type="مشاريع" />;
                    }
                    const draftProjects = projects.filter(
                      (project: IProject) => {
                        if (typeof project.published === "boolean") {
                          return project.published === false;
                        } else {
                          return project.published === 0;
                        }
                      },
                    );
                    return draftProjects.length === 0 ? (
                      <EmptyState type="مشاريع" />
                    ) : (
                      renderProjectCards(draftProjects)
                    );
                  })()}
                </TabsContent>
                <TabsContent value="featured" className="mt-4">
                  {(() => {
                    if (
                      !projects ||
                      !Array.isArray(projects) ||
                      projects.length === 0
                    ) {
                      return <EmptyState type="مشاريع" />;
                    }
                    const featuredProjects = projects.filter(
                      (project: IProject) => {
                        if (typeof project.featured === "boolean") {
                          return project.featured === true;
                        } else {
                          return project.featured === 1;
                        }
                      },
                    );
                    return featuredProjects.length === 0 ? (
                      <EmptyState type="مشاريع" />
                    ) : (
                      renderProjectCards(featuredProjects)
                    );
                  })()}
                </TabsContent>
              </Tabs>
            )}

            {pagination && pagination.total !== 0 && (
              <div className="mt-6">
                <span className="text-sm text-muted-foreground">
                  Showing {pagination.from} to {pagination.to} of{" "}
                  {pagination.total} projects
                </span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: IProject }) {
  const router = useRouter();
  const { userData } = useAuthStore();

  const handleDelete = async (id: number) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping handleDelete");
      alert("Authentication required. Please login.");
      return;
    }

    try {
      const response = await axiosInstance.delete(`/projects/${id}`);
      // يمكنك تحديث الحالة (state) أو إعادة تحميل الصفحة هنا بعد الحذف
    } catch (error) {
      console.error("حدث خطأ أثناء الحذف:", error);
    }
  };
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={project.featured_image || "/placeholder.svg"}
            alt={project.contents?.[0]?.title}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
        {typeof project.published === "number" ? (
          /* إذا كانت قيمة published رقم (مثلاً 1) */
          project.featured == 1 ? (
            <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              مميز
            </div>
          ) : (
            ""
          )
        ) : /* خلاف ذلك نفترض أنها boolean */
        project.featured === true ? (
          <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            مميز
          </div>
        ) : (
          ""
        )}
        <div
          className={`absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium ${
            typeof project.published === "number"
              ? /* إذا كانت قيمة published رقم (مثلاً 1) */
                project.published == 1
                ? "bg-green-500 text-white"
                : "bg-amber-500 text-white"
              : /* خلاف ذلك نفترض أنها boolean */
                project.published === true
                ? "bg-green-500 text-white"
                : "bg-amber-500 text-white"
          }`}
        >
          {typeof project.published === "number"
            ? /* إذا كانت قيمة published رقم (مثلاً 1) */
              project.published == 1
              ? "منشور"
              : "مسودة"
            : /* خلاف ذلك نفترض أنها boolean */
              project.published === true
              ? "منشور"
              : "مسودة"}
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="whitespace-nowrap mb-2">
              {project.contents?.[0]?.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3  " /> {project.contents?.[0]?.address}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push("/dashboard/projects/" + project.id + "/edit")
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const domain = useAuthStore.getState().userData?.domain || "";
                  const url = domain.startsWith("http")
                    ? `${domain}project/${project.contents?.[0]?.slug}`
                    : `https://${domain}/project/${project.contents?.[0]?.slug}`;
                  window.open(url, "_blank");
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                معاينة
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                نسخ
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const url = `/dashboard/activity-logs/project/${project.id}`;
                  window.open(url, "_blank");
                }}
              >
                <Activity className="mr-2 h-4 w-4" />
                سجل النشاطات
              </DropdownMenuItem>
              {project.published === false ? (
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  نشر
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  إلغاء النشر
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(project.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-lg font-semibold">
            {project.price_range || ""}
          </div>
          {((typeof project.published === "number" && project.published == 1) ||
            project.published === true) &&
            project.creator && (
              <div className="rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                {project.creator.name === "User"
                  ? userData?.first_name && userData?.last_name
                    ? `${userData.first_name} ${userData.last_name}`
                    : userData?.username || userData?.first_name || "User"
                  : project.creator.name}
              </div>
            )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.contents?.[0]?.description || ""}
        </p>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">المشاهدات</span>
            <span className="font-medium flex items-center gap-1">
              <Eye className="h-3 w-3" /> {project.visits || 0}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">وحدات</span>
            <span className="font-medium flex items-center gap-1">
              <Users className="h-3 w-3" /> {project.units || 0}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">الإنجاز</span>
            <span className="font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {project.completion_date || ""}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">المطور</span>
            <span className="font-medium flex items-center gap-1">
              <Building2 className="h-3 w-3" />{" "}
              {project.developer?.split(" ")[0] || ""}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1"
          onClick={() =>
            router.push("/dashboard/projects/" + project.id + "/edit")
          }
        >
          <Edit className="h-3.5 w-3.5" />
          تعديل
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="w-full gap-1"
          onClick={() => {
            const domain = useAuthStore.getState().userData?.domain || "";
            const url = domain.startsWith("http")
              ? `${domain}project/${project.contents?.[0]?.slug}`
              : `https://${domain}/project/${project.contents?.[0]?.slug}`;
            window.open(url, "_blank");
          }}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          معاينة
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProjectListItem({ project }: { project: IProject }) {
  const router = useRouter();
  const { userData } = useAuthStore();

  return (
    <Card>
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-1/3 md:w-1/4">
          <div className="aspect-[16/9] sm:aspect-auto sm:h-full w-full overflow-hidden">
            <img
              src={project.featured_image || "/placeholder.svg"}
              alt={project.contents?.[0]?.title}
              className="h-full w-full object-cover"
            />
          </div>

          {typeof project.published === "number" ? (
            /* إذا كانت قيمة published رقم (مثلاً 1) */
            project.featured == 1 ? (
              <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                مميز
              </div>
            ) : (
              ""
            )
          ) : /* خلاف ذلك نفترض أنها boolean */
          project.featured === true ? (
            <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              مميز
            </div>
          ) : (
            ""
          )}
          <div
            className={`absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium ${
              project.published === true
                ? "bg-green-500 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {project.published === true ? "منشور" : "مسودة"}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{project.contents?.[0]?.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 mt-10" />{" "}
                {project.contents?.[0]?.address}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-lg font-semibold">{project.price_range}</div>
              {project.published === true && project.creator && (
                <div className="rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                  {project.creator.name === "User"
                    ? userData?.first_name && userData?.last_name
                      ? `${userData.first_name} ${userData.last_name}`
                      : userData?.username || userData?.first_name || "User"
                    : project.creator.name}
                </div>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {project.contents?.[0]?.description}
          </p>
          <div className="mt-auto pt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>{project.visits} زيارة</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{project.units} وحدات</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>الإنجاز: {project.completion_date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{project.developer}</span>
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push("/dashboard/projects/" + project.id + "/edit")
                }
              >
                <Edit className="mr-1 h-3.5 w-3.5" />
                تعديل
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const domain = useAuthStore.getState().userData?.domain || "";
                  const url = domain.startsWith("http")
                    ? `${domain}project/${project.contents?.[0]?.slug}`
                    : `https://${domain}/project/${project.contents?.[0]?.slug}`;
                  window.open(url, "_blank");
                }}
              >
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                معاينة
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    نسخ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const url = `/dashboard/activity-logs/project/${project.id}`;
                      window.open(url, "_blank");
                    }}
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    سجل النشاطات
                  </DropdownMenuItem>
                  {project.published === false ? (
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      نشر
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      إلغاء النشر
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      // Handle delete functionality here
                      console.log("Delete project:", project.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProjectsManagementPage;
