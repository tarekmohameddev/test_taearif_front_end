"use client";

import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import SwiperCarousel from "@/components/ui/swiper-carousel2";
import { Property } from "../types/types";

interface PropertyGalleryProps {
  property: Property;
  mainImage: string;
  mainImageIndex: number;
  propertyImages: string[];
  logoImage: string | null;
  primaryColor: string;
  primaryColorFilter: string;
  getAllImages: () => string[];
  handleImageClick: (imageSrc: string, index?: number) => void;
  handleThumbnailClick: (imageSrc: string, index: number) => void;
  handleMainImagePrevious: () => void;
  handleMainImageNext: () => void;
}

export function PropertyGallery({
  property,
  mainImage,
  mainImageIndex,
  propertyImages,
  logoImage,
  primaryColor,
  primaryColorFilter,
  getAllImages,
  handleImageClick,
  handleThumbnailClick,
  handleMainImagePrevious,
  handleMainImageNext,
}: PropertyGalleryProps) {
  return (
    <div className="md:w-1/2 order-1 md:order-2">
      <div className="gallery w-full mx-auto px-4 md:px-6 order-1 md:order-2 relative">
        {/* الصورة الأساسية */}
        <div className="relative h-80 md:h-80 xl:h-96 mb-6 group">
          {mainImage && property ? (
            <>
              <Image
                src={mainImage}
                alt={property.title || "صورة العقار"}
                fill
                className="w-full h-full object-cover cursor-pointer rounded-lg"
                onClick={() => handleImageClick(mainImage, mainImageIndex)}
              />

              {getAllImages().length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMainImagePrevious();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMainImageNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label="الصورة التالية"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {mainImageIndex + 1} / {getAllImages().length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">لا توجد صورة متاحة</p>
              </div>
            </div>
          )}
          {logoImage && (
            <div className="absolute bottom-2 right-2 opacity-80">
              <div className="w-24 h-fit bg-white/20 rounded flex items-center justify-center">
                <Image
                  src={logoImage}
                  alt="تعاريف العقارية"
                  width={160}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {propertyImages.length > 1 && (
          <p className="text-xs text-gray-500 mb-2 text-center">
            اضغط على أي صورة لفتحها في نافذة منبثقة
          </p>
        )}

        {propertyImages.length > 0 && property && (
          <SwiperCarousel
            items={propertyImages
              .filter((imageSrc) => imageSrc && imageSrc.trim() !== "")
              .map((imageSrc, index) => (
                <div key={index} className="relative h-[10rem] md:h-24">
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
                    onClick={() => handleThumbnailClick(imageSrc, index)}
                  />
                  {logoImage && (
                    <div className="absolute bottom-2 right-2 opacity-80">
                      <div className="w-12 h-fit bg-white/20 rounded flex items-center justify-center">
                        <Image
                          src={logoImage}
                          alt="تعاريف العقارية"
                          width={160}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            space={16}
            autoplay={true}
            desktopCount={4}
            slideClassName="!h-[10rem] md:!h-[96px]"
          />
        )}
      </div>
    </div>
  );
}
