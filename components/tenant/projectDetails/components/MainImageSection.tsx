import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Project } from "../types";

interface MainImageSectionProps {
  project: Project | null;
  mainImage: string;
  mainImageIndex: number;
  allImages: string[];
  logoImage: string | null;
  primaryColor: string;
  onImageClick: (imageSrc: string, index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const MainImageSection = ({
  project,
  mainImage,
  mainImageIndex,
  allImages,
  logoImage,
  primaryColor,
  onImageClick,
  onPrevious,
  onNext,
}: MainImageSectionProps) => {
  return (
    <section
      className="relative rounded-lg overflow-hidden shadow-xl"
      data-purpose="property-hero"
    >
      <div className="relative h-[600px] w-full group">
        {mainImage && project ? (
          <>
            <Image
              src={mainImage}
              alt={project.title || "صورة المشروع"}
              fill
              className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer rounded-lg"
              priority
              onClick={() => {
                onImageClick(mainImage, mainImageIndex);
              }}
            />

            {/* Navigation arrows - show only if there's more than one image */}
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

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {mainImageIndex + 1} / {allImages.length}
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
                alt="Logo"
                width={160}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
