"use client";

import { DesktopSidebar } from "./sidebarComponents/DesktopSidebar";

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

      {/* Mobile Sidebar تم إزالته من هنا لأنه موجود في الهيدر مع زر القائمة */}
    </>
  );
}
