import Image from "next/image";
import type { Project } from "../types";

interface HeroSectionProps {
  project: Project;
  heroHeight?: string;
  maxWidth?: string;
  primaryColor: string;
  heroBackgroundType?: "colorOnly" | "imageAndColor" | "imageOnly";
  heroImageSrc?: string;
  getHeroBackgroundColor?: () => string;
  getHeroOverlayColor?: () => string;
  heroOverlayOpacity?: number;
}

export const HeroSection = ({
  project,
  heroHeight = "500px",
  maxWidth,
  primaryColor,
  heroBackgroundType = "imageAndColor",
  heroImageSrc = "/images/placeholders/projectDetails2/hero.jpg",
  getHeroBackgroundColor,
  getHeroOverlayColor,
  heroOverlayOpacity = 0.8,
}: HeroSectionProps) => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: heroHeight }}
    >
      {heroBackgroundType === "colorOnly" && getHeroBackgroundColor && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: getHeroBackgroundColor() }}
        />
      )}
      {(heroBackgroundType === "imageOnly" || heroBackgroundType === "imageAndColor") && (
        <Image
          src={heroImageSrc}
          alt={project.title || "صورة المشروع"}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      {heroBackgroundType === "imageAndColor" && getHeroOverlayColor && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: getHeroOverlayColor(),
            opacity: heroOverlayOpacity,
          }}
        />
      )}

      {/* Overlay Text */}
      <div className="container mx-auto px-4 absolute top-[13rem] left-0 right-0">
        <div
          className="flex flex-row justify-between items-center"
          dir="rtl"
          style={{ maxWidth }}
        >
          <div className="text-white z-[10]">
            <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md text-right">
              {project.title}
            </h1>
          </div>
          {/* Price Badge */}
          {((project.minPrice &&
            project.minPrice.trim() !== "" &&
            parseFloat(project.minPrice) > 0) ||
            (project.maxPrice &&
              project.maxPrice.trim() !== "" &&
              parseFloat(project.maxPrice) > 0) ||
            (project.price && project.price.trim() !== "")) && (
            <div className="z-[2]">
              <span
                className="text-white py-2 px-4 rounded font-bold text-xl"
                style={{ backgroundColor: primaryColor }}
              >
                {project.minPrice &&
                project.maxPrice &&
                parseFloat(project.minPrice) > 0 &&
                parseFloat(project.maxPrice) > 0
                  ? `${project.minPrice} - ${project.maxPrice}`
                  : project.price
                    ? project.price
                    : project.minPrice && parseFloat(project.minPrice) > 0
                      ? project.minPrice
                      : project.maxPrice && parseFloat(project.maxPrice) > 0
                        ? project.maxPrice
                        : ""}{" "}
                ريال سعودي
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
