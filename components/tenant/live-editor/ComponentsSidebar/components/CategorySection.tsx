"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CategoryHeader } from "./CategoryHeader";
import { ComponentCard } from "./ComponentCard";
import { ProjectDisplayCard } from "./ProjectDisplayCard";
import { UncreatedProjectsCard } from "./UncreatedProjectsCard";
import { CompletedProjectsCard } from "./CompletedProjectsCard";
import { UnderConstructionProjectsCard } from "./UnderConstructionProjectsCard";
import { CategorySectionProps } from "../types";
import { categoryExpansionVariants, listItem } from "../constants";
import { getVariantsForSection, shouldShowEmptyCategory } from "../utils";

export function CategorySection({
  category,
  sections,
  isExpanded,
  onToggle,
  searchTerm,
  activeTab,
  t,
}: CategorySectionProps) {
  // Filter sections by search term
  const filteredSections = sections.filter(
    (section) =>
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Check if should show empty category
  const showEmpty = shouldShowEmptyCategory(category, activeTab);

  // Don't render if no sections and not allowed to show empty
  if (filteredSections.length === 0 && !showEmpty) {
    return null;
  }

  return (
    <motion.div variants={listItem} className="space-y-2">
      <CategoryHeader
        category={category}
        isExpanded={isExpanded}
        onToggle={onToggle}
        t={t}
      />

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={categoryExpansionVariants}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 pt-2">
              {/* Project Display Cards - Special cases */}
              {category === "projectDisplay" && (
                <>
                  <ProjectDisplayCard activeTab={activeTab} />
                  <UncreatedProjectsCard activeTab={activeTab} />
                  <CompletedProjectsCard activeTab={activeTab} />
                  <UnderConstructionProjectsCard activeTab={activeTab} />
                </>
              )}

              {/* Regular Components */}
              {filteredSections.length === 0 &&
              category === "projectDisplay" &&
              activeTab === "theme1" ? null : (
                <>
                  {filteredSections.map((section) => {
                    const variantsForSection = getVariantsForSection(
                      section.component,
                      activeTab,
                    );

                    // Single variant or no variant
                    if (variantsForSection.length <= 1) {
                      const variantName =
                        variantsForSection.length === 1
                          ? variantsForSection[0]
                          : undefined;

                      return (
                        <ComponentCard
                          key={`${section.type}-${variantName || "default"}`}
                          section={section}
                          variantName={variantName}
                          activeTab={activeTab}
                          t={t}
                        />
                      );
                    }

                    // Multiple variants
                    return variantsForSection.map((variantName) => (
                      <ComponentCard
                        key={`${section.type}-${variantName}`}
                        section={section}
                        variantName={variantName}
                        activeTab={activeTab}
                        t={t}
                      />
                    ));
                  })}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
