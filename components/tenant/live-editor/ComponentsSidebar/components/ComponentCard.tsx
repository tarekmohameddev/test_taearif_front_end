"use client";

import { motion } from "framer-motion";
import { DraggableDrawerItem } from "@/services/live-editor/dragDrop";
import { getSectionIconTranslated } from "@/components/tenant/live-editor/EditorSidebar/constants";
import {
  getVariantSuffix,
  buildDisplayLabel,
  getCustomDataForComponent,
  getComponentTypeAndVariant,
} from "../utils";
import { ComponentCardProps } from "../types";
import { listItem } from "../constants";

export function ComponentCard({
  section,
  variantName,
  activeTab,
  t,
}: ComponentCardProps) {
  const variantSuffix = variantName
    ? getVariantSuffix(variantName, section.component)
    : "";

  const displayLabel = buildDisplayLabel(section.name, variantSuffix);

  const { componentType, variant } = getComponentTypeAndVariant(
    section.component,
    variantName,
  );

  const customData = getCustomDataForComponent(section.component, variantName);

  // Special handling for blogPosts
  const finalComponentType =
    section.component === "blogPosts" && variantName === "blogPosts1"
      ? "grid"
      : componentType;

  const finalVariant =
    variantName === "blogPosts1" && section.component === "blogPosts"
      ? "grid1"
      : variantName || "";

  return (
    <motion.div
      key={`${section.type}-${variantName || "default"}`}
      variants={listItem}
      className="group relative"
    >
      <DraggableDrawerItem
        componentType={finalComponentType}
        section={section.section}
        data={{
          label: displayLabel,
          description: section.description,
          icon: section.type,
          ...(finalVariant ? { variant: finalVariant } : {}),
          ...customData,
        }}
      >
        <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-xl">
              {getSectionIconTranslated(section.type, t)}
            </div>
            <h3 className="font-medium text-gray-900 text-[11px] leading-tight">
              {displayLabel}
            </h3>
          </div>
        </div>
      </DraggableDrawerItem>
    </motion.div>
  );
}
