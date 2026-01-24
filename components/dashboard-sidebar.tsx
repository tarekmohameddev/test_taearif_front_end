"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Building2,
  Download,
  FileText,
  House,
  Globe,
  Home,
  LayoutTemplate,
  LogOut,
  MessageSquareShare,
  SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: "websites",
      label: "Websites",
      icon: Globe,
      path: "/",
    },
    {
      id: "projects",
      label: "Projects",
      icon: Building2,
      path: "/projects",
    },
    {
      id: "properties",
      label: "Properties",
      icon: Home,
      path: "/properties",
    },
    {
      id: "content",
      label: "Content",
      icon: FileText,
      path: "/content",
    },
    {
      id: "blogs",
      label: "Blogs",
      icon: BookOpen,
      path: "/dashboard/blogs",
    },
    {
      id: "apps",
      label: "Apps",
      icon: Download,
      path: "/apps",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      id: "templates",
      label: "Templates",
      icon: LayoutTemplate,
      path: "/templates",
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      path: "/dashboard/settings",
    },
    {
      id: "property-requests",
      label: "Property Requests",
      icon: House,
      path: "/property-requests",
    },
    {
      id: "whatsapp-center",
      label: "WhatsApp Center",
      icon: MessageSquareShare,
      path: "/dashboard/whatsapp-center",
    },
  ];

  // Determine active tab from pathname
  const currentPath = pathname || "/";
  const isContentSection = currentPath.startsWith("/content");
  const isBlogsSection = currentPath.startsWith("/dashboard/blogs");
  const currentTab = isContentSection
    ? "content"
    : isBlogsSection
    ? "blogs"
    : navItems.find((item) => item.path === currentPath)?.id || "websites";

  const NavContent = () => (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 md:h-[60px]">
        <span className="text-lg font-semibold">Dashboard</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentTab === item.id ? "secondary" : "ghost"}
              className="justify-start gap-2"
              asChild
            >
              <Link href={item.path}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Button variant="outline" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="hidden w-[240px] flex-col border-r md:flex">
      <NavContent />
    </div>
  );
}
