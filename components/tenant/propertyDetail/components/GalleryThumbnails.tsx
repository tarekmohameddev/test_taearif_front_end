import Image from "next/image";
import SwiperCarousel from "@/components/ui/swiper-carousel2";
import type { Property } from "../types/types";

interface GalleryThumbnailsProps {
  property: Property;
  propertyImages: string[];
  mainImage: string;
  primaryColor: string;
  onThumbnailClick: (imageSrc: string, index: number) => void;
  showThumbnails?: boolean;
}

export const GalleryThumbnails = ({
  property,
  propertyImages,
  mainImage,
  primaryColor,
  onThumbnailClick,
  showThumbnails = true,
}: GalleryThumbnailsProps) => {
  if (!showThumbnails || propertyImages.length === 0) {
    return null;
  }

  return (
    <section className="pt-10" data-purpose="image-gallery">
      <SwiperCarousel
        items={propertyImages
          .filter((imageSrc) => imageSrc && imageSrc.trim() !== "")
          .map((imageSrc, index) => (
            <div key={index} className="relative h-[12rem] md:h-[180px]">
              <Image
                src={imageSrc}
                alt={`${property.title || "العقار"} - صورة ${index + 1}`}
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
