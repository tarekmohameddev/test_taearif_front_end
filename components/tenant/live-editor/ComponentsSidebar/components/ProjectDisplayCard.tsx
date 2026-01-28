"use client";

import { motion } from "framer-motion";
import { DraggableDrawerItem } from "@/services/live-editor/dragDrop";
import { listItem } from "../constants";

interface ProjectDisplayCardProps {
  activeTab: string;
}

export function ProjectDisplayCard({ activeTab }: ProjectDisplayCardProps) {
  if (activeTab !== "theme1") {
    return null;
  }

  return (
    <motion.div variants={listItem} className="group relative">
      <DraggableDrawerItem
        componentType="grid"
        section="homepage"
        data={{
          label: "معرض كل المشاريع",
          description: "عرض جميع المشاريع من API",
          icon: "🏗️",
          variant: "grid1",
          dataSource: {
            apiUrl: "https://bigrises.com/api/v1/tenant-website/kkkkk/projects",
            enabled: true,
          },
          content: {
            title: "المشاريع المتاحة",
            subtitle: "اكتشف أفضل المشاريع العقارية المتاحة",
          },
        }}
      >
        <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-xl">🏗️</div>
            <h3 className="font-medium text-gray-900 text-[11px] leading-tight">
              معرض كل المشاريع
            </h3>
          </div>
        </div>
      </DraggableDrawerItem>
    </motion.div>
  );
}
