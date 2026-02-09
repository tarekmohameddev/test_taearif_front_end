import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import type { Property } from "../types/types";

interface ProjectLinkProps {
  property: Property | null;
  textColor: string;
  primaryColor: string;
}

export const ProjectLink = ({
  property,
  textColor,
  primaryColor,
}: ProjectLinkProps) => {
  if (!property || !property.project) {
    return null;
  }

  return (
    <section className="bg-transparent py-4" data-purpose="project-section">
      <div className="flex items-center gap-2 text-right">
        <span className="text-base" style={{ color: textColor }}>
          المشروع التابع له :
        </span>
        <Link
          href={`/project/${property.project.slug}`}
          className="inline-flex items-center gap-2 hover:underline transition-all group"
          style={{ color: primaryColor }}
        >
          <span className="font-semibold text-base">{property.project.title}</span>
          <ChevronLeftIcon
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            style={{ color: primaryColor }}
          />
        </Link>
      </div>
    </section>
  );
};
