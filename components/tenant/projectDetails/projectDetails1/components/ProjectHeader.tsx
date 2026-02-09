import { ShareIcon } from "lucide-react";
import { ProjectDetailsProps } from "../types";

interface ProjectHeaderProps {
  mergedData: ProjectDetailsProps;
  primaryColor: string;
  onShareClick: () => void;
}

export const ProjectHeader = ({
  mergedData,
  primaryColor,
  onShareClick,
}: ProjectHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <h1
        className="font-bold text-xs xs:text-sm leading-4 rounded-md text-white px-3 py-2 flex items-center justify-center md:text-xl lg:text-2xl md:px-4 md:py-3 whitespace-nowrap"
        style={{ backgroundColor: primaryColor }}
      >
        {mergedData.content?.badgeText || "مشروع عقاري"}
      </h1>
      {mergedData.displaySettings?.showShareButton && (
        <div className="sharesocials flex flex-row gap-x-6" dir="ltr">
          <button className="cursor-pointer" onClick={onShareClick}>
            <ShareIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};
