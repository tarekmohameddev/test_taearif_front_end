import type { Project } from "../types";

interface AmenitiesSectionProps {
  project: Project | null;
  textColor?: string;
  primaryColor: string;
}

export const AmenitiesSection = ({
  project,
  textColor,
  primaryColor,
}: AmenitiesSectionProps) => {
  if (!project?.amenities || project.amenities.length === 0) return null;

  return (
    <section className="bg-transparent" data-purpose="amenities-section">
      <h2
        className="text-3xl font-bold mb-8 text-right"
        style={{
          color: textColor || primaryColor,
        }}
      >
        مميزات المشروع
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {project.amenities.map((amenity, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-6 py-4 rounded-3xl"
            style={{
              backgroundColor: `${primaryColor}20`,
              border: `2px solid ${primaryColor}40`,
            }}
          >
            <span
              className="font-bold text-lg text-center"
              style={{
                color: textColor || primaryColor,
              }}
            >
              {amenity}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
