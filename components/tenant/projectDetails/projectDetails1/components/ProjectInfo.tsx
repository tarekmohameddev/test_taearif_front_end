import { Project, ProjectDetailsProps } from "../types";

interface ProjectInfoProps {
  project: Project;
  mergedData: ProjectDetailsProps;
  primaryColor: string;
}

export const ProjectInfo = ({
  project,
  mergedData,
  primaryColor,
}: ProjectInfoProps) => {
  return (
    <div className="space-y-4">
      <p
        className="font-bold text-gray-600 text-xs xs:text-sm leading-4 md:text-2xl md:leading-7"
        style={{ color: mergedData.styling?.textColor }}
      >
        {project.district}
      </p>
      <p
        className="font-bold text-gray-600 text-xl leading-6 md:leading-7"
        style={{ color: mergedData.styling?.textColor }}
      >
        {project.title}
      </p>
      {((project.minPrice &&
        project.minPrice.trim() !== "" &&
        parseFloat(project.minPrice) > 0) ||
        (project.maxPrice &&
          project.maxPrice.trim() !== "" &&
          parseFloat(project.maxPrice) > 0) ||
        (project.price && project.price.trim() !== "")) &&
      (mergedData.displaySettings?.showMinPrice ||
        mergedData.displaySettings?.showMaxPrice) ? (
        <p
          className="text-2xl leading-7 font-bold md:text-3xl lg:leading-9 flex items-center gap-2"
          style={{ color: primaryColor }}
        >
          {project.minPrice &&
          project.maxPrice &&
          parseFloat(project.minPrice) > 0 &&
          parseFloat(project.maxPrice) > 0 ? (
            <>
              {project.minPrice} - {project.maxPrice}
              <img
                src="/Saudi_Riyal_Symbol.svg"
                alt="ريال سعودي"
                className="w-6 h-6"
              />
            </>
          ) : project.price ? (
            <>
              {project.price}
              <img
                src="/Saudi_Riyal_Symbol.svg"
                alt="ريال سعودي"
                className="w-6 h-6"
              />
            </>
          ) : null}
        </p>
      ) : null}

      <p
        className="text-gray-600 text-sm leading-6 font-normal md:text-base lg:text-xl lg:leading-7 whitespace-pre-line"
        style={{ color: mergedData.styling?.secondaryTextColor }}
      >
        {project.description || "لا يوجد وصف متاح لهذا المشروع"}
      </p>
    </div>
  );
};
