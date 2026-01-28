"use client";

import { motion } from "framer-motion";
import { listItem } from "../constants";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <motion.div
      variants={listItem}
      className="text-center py-8 text-gray-500"
    >
      <svg
        className="w-12 h-12 mx-auto mb-3 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <p>{message}</p>
    </motion.div>
  );
}
