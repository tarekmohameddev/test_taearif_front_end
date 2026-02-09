import {
  MapPinIcon,
  BuildingIcon,
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  WrenchIcon,
  StarIcon,
  TagIcon,
} from "lucide-react";
import { Project, ProjectDetailsProps } from "../types";
import { getCompleteStatusText } from "../utils/projectUtils";
import { getDarkerColor } from "../utils/colorUtils";

interface ProjectDetailsGridProps {
  project: Project;
  mergedData: ProjectDetailsProps;
  primaryColor: string;
}

export const ProjectDetailsGrid = ({
  project,
  mergedData,
  primaryColor,
}: ProjectDetailsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
      {mergedData.displaySettings?.showAddress &&
        project.address &&
        project.address.trim() !== "" && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <MapPinIcon className="w-4 h-4" style={{ color: primaryColor }} />
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                العنوان:
              </p>
            </div>
            <p
              className="font-bold leading-4 text-xs xs:text-sm md:text-base"
              style={{ color: mergedData.styling?.textColor }}
            >
              {project.address}
            </p>
          </div>
        )}

      {mergedData.displaySettings?.showDeveloper &&
        project.developer &&
        project.developer.trim() !== "" && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <BuildingIcon
                className="w-4 h-4"
                style={{ color: primaryColor }}
              />
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                المطور:
              </p>
            </div>
            <p
              className="font-bold leading-4 text-xs xs:text-sm md:text-base"
              style={{ color: mergedData.styling?.textColor }}
            >
              {project.developer}
            </p>
          </div>
        )}

      {mergedData.displaySettings?.showUnits &&
        project.units &&
        project.units > 0 && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <HomeIcon className="w-4 h-4" style={{ color: primaryColor }} />
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                عدد الوحدات:
              </p>
            </div>
            <p
              className="font-bold leading-4 text-xs xs:text-sm md:text-base"
              style={{ color: mergedData.styling?.textColor }}
            >
              {project.units} وحدة
            </p>
          </div>
        )}

      {mergedData.displaySettings?.showCompletionDate &&
        project.completionDate &&
        project.completionDate.trim() !== "" && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <CalendarIcon
                className="w-4 h-4"
                style={{ color: primaryColor }}
              />
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                تاريخ التسليم:
              </p>
            </div>
            <p
              className="font-bold leading-4 text-xs xs:text-sm md:text-base"
              style={{ color: mergedData.styling?.textColor }}
            >
              {new Date(project.completionDate).toLocaleDateString("ar-US")}
            </p>
          </div>
        )}

      {mergedData.displaySettings?.showCompleteStatus &&
        project.completeStatus !== undefined &&
        project.completeStatus !== null &&
        String(project.completeStatus).trim() !== "" && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <WrenchIcon
                className="w-4 h-4"
                style={{ color: primaryColor }}
              />
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                حالة الإكمال:
              </p>
            </div>
            <p
              className="font-bold leading-4 text-xs xs:text-sm md:text-base"
              style={{ color: mergedData.styling?.textColor }}
            >
              {getCompleteStatusText(project.completeStatus)}
            </p>
          </div>
        )}

      {mergedData.displaySettings?.showMinPrice &&
        project.minPrice &&
        project.minPrice.trim() !== "" &&
        parseFloat(project.minPrice) > 0 && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                السعر الأدنى:
              </p>
            </div>
            <p
              className="font-bold leading-4 text-xs xs:text-sm md:text-base"
              style={{ color: mergedData.styling?.textColor }}
            >
              {project.minPrice} ريال
            </p>
          </div>
        )}

      {mergedData.displaySettings?.showMaxPrice &&
        project.maxPrice &&
        project.maxPrice.trim() !== "" &&
        parseFloat(project.maxPrice) > 0 && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                السعر الأعلى:
              </p>
            </div>
            <p
              className="font-bold leading-4 text-xs xs:text-sm md:text-base"
              style={{ color: mergedData.styling?.textColor }}
            >
              {project.maxPrice} ريال
            </p>
          </div>
        )}

      {mergedData.displaySettings?.showVideoUrl &&
        project.videoUrl &&
        project.videoUrl.trim() !== "" && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <PlayIcon className="w-4 h-4" style={{ color: primaryColor }} />
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                فيديو المشروع:
              </p>
            </div>
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold leading-4 text-xs xs:text-sm md:text-base underline"
              style={{ color: primaryColor }}
            >
              مشاهدة الفيديو
            </a>
          </div>
        )}

      {mergedData.displaySettings?.showLocation &&
        project.location &&
        ((project.location.lat && project.location.lng) ||
          (project.location.address &&
            project.location.address.trim() !== "")) && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <MapPinIcon
                className="w-4 h-4"
                style={{ color: primaryColor }}
              />
            </div>
            {project.location.lat && project.location.lng ? (
              <a
                href={`https://maps.google.com/?q=${project.location.lat},${project.location.lng}&entry=gps`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold leading-4 text-xs xs:text-sm md:text-base underline"
                style={{ color: primaryColor }}
              >
                عرض الموقع
              </a>
            ) : (
              <span
                className="font-bold leading-4 text-xs xs:text-sm md:text-base"
                style={{ color: mergedData.styling?.textColor }}
              >
                {project.location.address}
              </span>
            )}
          </div>
        )}

      {mergedData.displaySettings?.showCreatedAt &&
        project.createdAt &&
        project.createdAt.trim() !== "" && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <CalendarIcon
                className="w-4 h-4"
                style={{ color: primaryColor }}
              />
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                تاريخ الإنشاء:
              </p>
            </div>
            <p
              className="font-bold leading-4 text-xs xs:text-sm md:text-base"
              style={{ color: mergedData.styling?.textColor }}
            >
              {new Date(project.createdAt).toLocaleDateString("ar-US")}
            </p>
          </div>
        )}

      {mergedData.displaySettings?.showUpdatedAt &&
        project.updatedAt &&
        project.updatedAt.trim() !== "" && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <ClockIcon className="w-4 h-4" style={{ color: primaryColor }} />
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                آخر تحديث:
              </p>
            </div>
            <p
              className="font-bold leading-4 text-xs xs:text-sm md:text-base"
              style={{ color: mergedData.styling?.textColor }}
            >
              {new Date(project.updatedAt).toLocaleDateString("ar-US")}
            </p>
          </div>
        )}

      {mergedData.displaySettings?.showAmenities &&
        project.amenities &&
        project.amenities.length > 0 && (
          <div className="col-span-2">
            <div className="flex flex-row gap-x-2 md:gap-x-6">
              <div className="flex flex-row gap-x-2">
                <StarIcon className="w-4 h-4" style={{ color: primaryColor }} />
                <p
                  className="font-normal text-xs xs:text-sm md:text-base leading-4"
                  style={{ color: primaryColor }}
                >
                  المرافق:
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: `${primaryColor}20`,
                      color: getDarkerColor(primaryColor, 40),
                    }}
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      {mergedData.displaySettings?.showSpecifications &&
        project.specifications &&
        project.specifications.length > 0 && (
          <div className="col-span-2">
            <div className="flex flex-row gap-x-2 md:gap-x-6">
              <div className="flex flex-row gap-x-2">
                <WrenchIcon
                  className="w-4 h-4"
                  style={{ color: primaryColor }}
                />
                <p
                  className="font-normal text-xs xs:text-sm md:text-base leading-4"
                  style={{ color: primaryColor }}
                >
                  المواصفات:
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.specifications.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {typeof spec === "object"
                      ? spec.name || spec.title
                      : spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      {mergedData.displaySettings?.showTypes &&
        project.types &&
        project.types.length > 0 && (
          <div className="col-span-2">
            <div className="flex flex-row gap-x-2 md:gap-x-6">
              <div className="flex flex-row gap-x-2">
                <TagIcon className="w-4 h-4" style={{ color: primaryColor }} />
                <p
                  className="font-normal text-xs xs:text-sm md:text-base leading-4"
                  style={{ color: primaryColor }}
                >
                  الأنواع:
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.types.map((type, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {typeof type === "object" ? type.name || type.title : type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      {mergedData.displaySettings?.showFeatures &&
        project.features &&
        project.features.length > 0 && (
          <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
            <div className="flex flex-row gap-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <p
                className="font-normal text-xs xs:text-sm md:text-base leading-4"
                style={{ color: primaryColor }}
              >
                المميزات:
              </p>
            </div>
            <p
              className="font-bold leading-4 text-xs xs:text-sm md:text-base"
              style={{ color: mergedData.styling?.textColor }}
            >
              {project.features.join(", ")}
            </p>
          </div>
        )}

      {mergedData.displaySettings?.showStatus && project.status && (
        <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
          <div className="flex flex-row gap-x-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: primaryColor }}
            ></div>
            <p
              className="font-normal text-xs xs:text-sm md:text-base leading-4"
              style={{ color: primaryColor }}
            >
              الحالة:
            </p>
          </div>
          <p
            className="font-bold leading-4 text-xs xs:text-sm md:text-base"
            style={{ color: mergedData.styling?.textColor }}
          >
            {project.status === "available" ? "متاح" : project.status}
          </p>
        </div>
      )}
    </div>
  );
};
