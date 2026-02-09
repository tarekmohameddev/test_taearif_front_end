import Link from "next/link";
import Image from "next/image";
import {
  BuildingIcon,
  HomeIcon,
  CalendarIcon,
} from "lucide-react";
import { Eye, MapPin } from "lucide-react";
import { Project, ProjectDetailsProps } from "../types";
import { SimilarProjectsDesktop } from "./SimilarProjectsDesktop";
import { SimilarProjectsMobile } from "./SimilarProjectsMobile";

interface SimilarProjectsProps {
  mergedData: ProjectDetailsProps;
  primaryColor: string;
  similarProjects: Project[];
  loadingSimilar: boolean;
}

export const SimilarProjects = ({
  mergedData,
  primaryColor,
  similarProjects,
  loadingSimilar,
}: SimilarProjectsProps) => {
  if (
    !mergedData.displaySettings?.showSimilarProjects ||
    !mergedData.similarProjects?.enabled
  ) {
    return null;
  }

  return (
    <div className="flex-1">
      <div>
        <h3
          className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
          style={{ backgroundColor: primaryColor }}
        >
          {mergedData.content?.similarProjectsTitle || "مشاريع مشابهة"}
        </h3>

        <div className="hidden md:block">
          <SimilarProjectsDesktop
            similarProjects={similarProjects}
            loadingSimilar={loadingSimilar}
          />
        </div>

        <div className="block md:hidden">
          <SimilarProjectsMobile
            similarProjects={similarProjects}
            loadingSimilar={loadingSimilar}
          />
        </div>
      </div>
    </div>
  );
};
