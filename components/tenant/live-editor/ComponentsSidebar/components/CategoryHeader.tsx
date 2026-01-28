"use client";

import { motion } from "framer-motion";

interface CategoryHeaderProps {
  category: string;
  isExpanded: boolean;
  onToggle: () => void;
  t: (key: string) => string;
}

export function CategoryHeader({
  category,
  isExpanded,
  onToggle,
  t,
}: CategoryHeaderProps) {
  return (
    <>
      <button
        onClick={onToggle}
        className="w-full pb-2 pt-1 flex items-center justify-between hover:bg-gray-50 rounded-md px-1 transition-colors duration-150"
      >
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {t(`categories.${category}.display_name`) || category}
        </h3>
        <motion.svg
          className="w-4 h-4 text-gray-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </motion.svg>
      </button>
      <div className="mt-1 h-px bg-gray-200"></div>
    </>
  );
}
