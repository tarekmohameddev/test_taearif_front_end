import Image from "next/image";
import { Project, ProjectDetailsProps } from "../types";

interface ProjectFloorplansProps {
  project: Project;
  mergedData: ProjectDetailsProps;
  primaryColor: string;
  onFloorplanClick: (floorplan: string) => void;
}

export const ProjectFloorplans = ({
  project,
  mergedData,
  primaryColor,
  onFloorplanClick,
}: ProjectFloorplansProps) => {
  if (
    !mergedData.displaySettings?.showFloorplans ||
    !project.floorplans ||
    project.floorplans.length === 0 ||
    !project.floorplans.some((plan) => plan && plan.trim() !== "")
  ) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3
        className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
        style={{ backgroundColor: primaryColor }}
      >
        {mergedData.content?.floorplansTitle || "مخططات الأرضية"}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {project.floorplans
          .filter((plan) => plan && plan.trim() !== "")
          .map((floorplan, index) => (
            <div key={index} className="relative group">
              <Image
                src={floorplan}
                alt={`مخطط الأرضية ${index + 1}`}
                width={200}
                height={150}
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onFloorplanClick(floorplan)}
              />
              <div className="absolute bottom-1 right-1 opacity-50">
                <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-white text-xs">مخطط</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
