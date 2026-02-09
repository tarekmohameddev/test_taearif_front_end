import type { Project } from "../types";

interface SpecsSectionProps {
  project: Project | null;
  title?: string;
  textColor?: string;
  primaryColor: string;
  showSpecs?: boolean;
}

export const SpecsSection = ({
  project,
  title = "مواصفات المشروع",
  textColor,
  primaryColor,
  showSpecs = true,
}: SpecsSectionProps) => {
  if (showSpecs === false || !project) return null;

  return (
    <section className="bg-transparent" data-purpose="property-specs">
      <h2
        className="text-3xl font-bold mb-8 text-right"
        style={{
          color: textColor || primaryColor,
        }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 text-center">
        {/* Developer */}
        {project.developer && project.developer.trim() !== "" ? (
          <div className="flex flex-col items-center justify-center">
            <div style={{ color: primaryColor }} className="mb-3">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                ></path>
              </svg>
            </div>
            <span
              className="font-bold text-lg"
              style={{
                color: textColor || primaryColor,
              }}
            >
              المطور: {project.developer}
            </span>
          </div>
        ) : null}

        {/* Units */}
        {project.units && project.units > 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div style={{ color: primaryColor }} className="mb-3">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                ></path>
              </svg>
            </div>
            <span
              className="font-bold text-lg"
              style={{
                color: textColor || primaryColor,
              }}
            >
              عدد الوحدات: {project.units}
            </span>
          </div>
        ) : null}

        {/* Completion Date */}
        {project.completionDate && project.completionDate.trim() !== "" ? (
          <div className="flex flex-col items-center justify-center">
            <div style={{ color: primaryColor }} className="mb-3">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                ></path>
              </svg>
            </div>
            <span
              className="font-bold text-lg"
              style={{
                color: textColor || primaryColor,
              }}
            >
              تاريخ التسليم:{" "}
              {new Date(project.completionDate).toLocaleDateString("ar-US")}
            </span>
          </div>
        ) : null}

        {/* Address */}
        {project.address && project.address.trim() !== "" ? (
          <div className="flex flex-col items-center justify-center">
            <div style={{ color: primaryColor }} className="mb-3">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                ></path>
                <path
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                ></path>
              </svg>
            </div>
            <span
              className="font-bold text-lg text-center"
              style={{
                color: textColor || primaryColor,
              }}
            >
              {project.address}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
};
