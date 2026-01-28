"use client";

import { motion } from "framer-motion";
import { DraggableDrawerItem } from "@/services/live-editor/dragDrop";
import { listItem } from "../constants";

interface UnderConstructionProjectsCardProps {
  activeTab: string;
}

export function UnderConstructionProjectsCard({ activeTab }: UnderConstructionProjectsCardProps) {
  if (activeTab !== "theme1") {
    return null;
  }

  return (
    <motion.div variants={listItem} className="group relative">
      <DraggableDrawerItem
        componentType="grid"
        section="homepage"
        data={{
          label: "مشاريع قيد الانشاء",
          description: "عرض المشاريع قيد الإنشاء من API",
          icon: "🏗️",
          variant: "grid1",
          dataSource: {
            apiUrl: "/v1/tenant-website/kkkkk/projects",
            enabled: true,
          },
          content: {
            title: "مشاريع قيد الإنشاء",
            subtitle: "اكتشف المشاريع التي قيد الإنشاء حالياً",
          },
        }}
      >
        <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-xl">🏗️</div>
            <h3 className="font-medium text-gray-900 text-[11px] leading-tight">
              مشاريع قيد الانشاء
            </h3>
          </div>
        </div>
      </DraggableDrawerItem>
    </motion.div>
  );
}
