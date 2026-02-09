import Image from "next/image";
import SwiperCarousel from "@/components/ui/swiper-carousel2";
import type { Project } from "../types";

interface GalleryThumbnailsProps {
  project: Project | null;
  projectImages: string[];
  mainImage: string;
  primaryColor: string;
  showThumbnails?: boolean;
  onThumbnailClick: (imageSrc: string, index: number) => void;
}

export const GalleryThumbnails = ({
  project,
  projectImages,
  mainImage,
  primaryColor,
  showThumbnails = true,
  onThumbnailClick,
}: GalleryThumbnailsProps) => {
  if (showThumbnails === false || projectImages.length === 0 || !project) {
    return null;
  }

  return (
    <section className="pt-10" data-purpose="image-gallery">
      <SwiperCarousel
        items={projectImages
          .filter((imageSrc) => imageSrc && imageSrc.trim() !== "")
          .map((imageSrc, index) => (
            <div key={index} className="relative h-[12rem] md:h-[180px]">
              <Image
                src={imageSrc}
                alt={`${project.title || "المشروع"} - صورة ${index + 1}`}
                fill
                className={`w-full h-full object-cover cursor-pointer rounded-lg transition-all duration-300 border-2 ${
                  mainImage === imageSrc ? "" : "border-transparent"
                }`}
                style={
                  mainImage === imageSrc
                    ? {
                        borderColor: primaryColor,
                        borderWidth: "2px",
                      }
                    : {}
                }
                onClick={() => onThumbnailClick(imageSrc, index)}
              />
            </div>
          ))}
        space={16}
        autoplay={true}
        desktopCount={4}
        slideClassName="!h-[12rem] md:!h-[180px]"
      />
    </section>
  );
};
