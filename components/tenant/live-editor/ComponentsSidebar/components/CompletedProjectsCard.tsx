"use client";

import { motion } from "framer-motion";
import { DraggableDrawerItem } from "@/services/live-editor/dragDrop";
import { listItem } from "../constants";

interface CompletedProjectsCardProps {
  activeTab: string;
}

export function CompletedProjectsCard({ activeTab }: CompletedProjectsCardProps) {
  if (activeTab !== "theme1") {
    return null;
  }

  return (
    <motion.div variants={listItem} className="group relative">
      <DraggableDrawerItem
        componentType="grid"
        section="homepage"
        data={{
          label: "مشاريع مكتملة فقط",
          description: "عرض المشاريع المكتملة فقط من API",
          icon: "✅",
          variant: "grid1",
          dataSource: {
            apiUrl: "https://bigrises.com/api/v1/tenant-website/kkkkk/projects?status=1",
            enabled: true,
          },
          content: {
            title: "المشاريع المكتملة",
            subtitle: "اكتشف المشاريع المكتملة والمتاحة",
          },
        }}
      >
        <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-xl">✅</div>
            <h3 className="font-medium text-gray-900 text-[11px] leading-tight">
              مشاريع مكتملة فقط
            </h3>
          </div>
        </div>
      </DraggableDrawerItem>
    </motion.div>
  );
}
