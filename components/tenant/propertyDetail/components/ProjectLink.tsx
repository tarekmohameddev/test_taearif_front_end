"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Property } from "../types/types";

interface ProjectLinkProps {
  project: Property["project"];
  primaryColor: string;
}

export function ProjectLink({ project, primaryColor }: ProjectLinkProps) {
  if (!project) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 text-right">
        <span className="text-gray-600 text-base">المشروع التابع له :</span>
        <Link
          href={`/project/${project.slug}`}
          className="inline-flex items-center gap-2 hover:underline transition-all group"
          style={{ color: primaryColor }}
        >
          <span className="font-semibold text-base">{project.title}</span>
          <ChevronLeftIcon
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            style={{ color: primaryColor }}
          />
        </Link>
      </div>
    </div>
  );
}
