import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Property } from "../types/types";

interface HeroSectionProps {
  property: Property;
  mainImage: string;
  mainImageIndex: number;
  allImages: string[];
  onImageClick: (imageSrc: string, index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const HeroSection = ({
  property,
  mainImage,
  mainImageIndex,
  allImages,
  onImageClick,
  onPrevious,
  onNext,
}: HeroSectionProps) => {
  return (
    <section
      className="relative rounded-lg overflow-hidden shadow-xl"
      data-purpose="property-hero"
    >
      <div className="relative h-[600px] w-full group">
        {mainImage ? (
          <>
            <Image
              alt={property.title || "صورة العقار"}
              className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer rounded-lg"
              src={mainImage}
              fill
              priority
              onClick={() => {
                onImageClick(mainImage, mainImageIndex);
              }}
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  aria-label="الصورة السابقة"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  aria-label="الصورة التالية"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {mainImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">لا توجد صورة متاحة</p>
          </div>
        )}
      </div>
    </section>
  );
};
