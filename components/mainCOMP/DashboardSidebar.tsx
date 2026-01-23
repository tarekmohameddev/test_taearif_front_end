"use client";

import { DesktopSidebar } from "./sidebarComponents/DesktopSidebar";
import { MobileSidebar } from "./sidebarComponents/MobileSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar - يظهر من 1200px فما فوق */}
      <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Mobile Sidebar - يظهر للشاشات الأصغر من 1200 بكسل */}
      <div className="max-[1199px]:block min-[1200px]:hidden">
        <MobileSidebar activeTab={activeTab} setActiveTab={setActiveTab}>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">فتح قائمة التنقل</span>
          </Button>
        </MobileSidebar>
      </div>
    </>
  );
}
