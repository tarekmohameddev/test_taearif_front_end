"use client";

import { motion } from "framer-motion";
import { CategorySection } from "./CategorySection";
import { EmptyState } from "./EmptyState";
import { CategoriesListProps } from "../types";
import { listContainer } from "../constants";

export function CategoriesList({
  componentsByCategory,
  expandedCategories,
  toggleCategory,
  searchTerm,
  activeTab,
  t,
}: CategoriesListProps) {
  const hasCategories = Object.keys(componentsByCategory).length > 0;

  if (!hasCategories) {
    return (
      <EmptyState message={t("live_editor.no_components_found")} />
    );
  }

  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {Object.entries(componentsByCategory).map(([category, sections]) => (
        <CategorySection
          key={category}
          category={category}
          sections={sections}
          isExpanded={expandedCategories.has(category)}
          onToggle={() => toggleCategory(category)}
          searchTerm={searchTerm}
          activeTab={activeTab}
          t={t}
        />
      ))}
    </motion.div>
  );
}
