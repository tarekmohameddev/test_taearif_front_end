import Image from "next/image";
import type { Property } from "../types/types";

interface TopHeroSectionProps {
  property: Property | null;
  primaryColor: string;
  heroHeight?: string;
  titleFontSize?: string;
}

export const TopHeroSection = ({
  property,
  primaryColor,
  heroHeight = "500px",
  titleFontSize,
}: TopHeroSectionProps) => {
  if (!property) {
    return null;
  }

  return (
    <>
      <section
        className="relative w-full overflow-hidden"
        style={{ height: heroHeight }}
      >
        <Image
          src="/images/placeholders/projectDetails2/hero.jpg"
          alt={property?.title || "صورة خلفية"}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#361c16",
            opacity: 0.8,
          }}
        />
      </section>

      <div className="max-w-[1250px] mx-auto px-4 absolute top-[8rem] md:top-[13rem] left-0 right-0">
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0"
          dir="rtl"
        >
          <div className="text-white z-[10] w-full md:w-auto">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md text-right"
              style={{
                fontSize: titleFontSize,
              }}
            >
              {property.title}
            </h1>
          </div>
          <div className="z-[2] w-full md:w-auto">
            <span
              className="text-white py-2 px-4 rounded font-bold text-base sm:text-lg md:text-xl inline-block"
              style={{ backgroundColor: primaryColor }}
            >
              {property.price} ريال سعودي
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
