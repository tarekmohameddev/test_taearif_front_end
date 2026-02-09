import Link from "next/link";
import Image from "next/image";
import { BuildingIcon, HomeIcon, CalendarIcon } from "lucide-react";
import { Eye, MapPin } from "lucide-react";
import { Project } from "../types";

interface SimilarProjectsMobileProps {
  similarProjects: Project[];
  loadingSimilar: boolean;
}

export const SimilarProjectsMobile = ({
  similarProjects,
  loadingSimilar,
}: SimilarProjectsMobileProps) => {
  if (loadingSimilar) {
    return (
      <div className="flex gap-4 overflow-x-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 min-w-[300px] animate-pulse"
          >
            <div className="relative w-full h-64 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto">
      {similarProjects.map((similarProject) => (
        <Link
          key={similarProject.id}
          href={`/project/${similarProject.slug || similarProject.id}`}
          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 cursor-pointer min-w-[300px]"
        >
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={similarProject.image ?? "/placeholder.jpg"}
              alt={similarProject.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            {similarProject.views && (
              <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs backdrop-blur-sm">
                <Eye className="w-3 h-3" />
                <span>{similarProject.views}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-lg font-bold mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
                {similarProject.title}
              </h3>
              {similarProject.district &&
                similarProject.district.trim() !== "" && (
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-blue-300" />
                    <span className="text-xs text-gray-200">
                      {similarProject.district}
                    </span>
                  </div>
                )}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {similarProject.developer &&
                  similarProject.developer.trim() !== "" &&
                  similarProject.developer !== "Unknown Developer" && (
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                      <BuildingIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        {similarProject.developer}
                      </span>
                    </div>
                  )}
                {similarProject.units &&
                  typeof similarProject.units === "number" &&
                  similarProject.units > 0 && (
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                      <HomeIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        {similarProject.units} وحدة
                      </span>
                    </div>
                  )}
                {similarProject.completionDate && (
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      {new Date(
                        similarProject.completionDate,
                      ).toLocaleDateString("ar-US")}
                    </span>
                  </div>
                )}
              </div>
              {((similarProject.minPrice &&
                similarProject.minPrice.trim() !== "" &&
                parseFloat(similarProject.minPrice) > 0) ||
                (similarProject.maxPrice &&
                  similarProject.maxPrice.trim() !== "" &&
                  parseFloat(similarProject.maxPrice) > 0) ||
                (similarProject.price &&
                  similarProject.price.trim() !== "")) && (
                <div className="flex items-center gap-1">
                  <p className="text-lg font-bold text-white">
                    {similarProject.minPrice &&
                    similarProject.maxPrice &&
                    parseFloat(similarProject.minPrice) > 0 &&
                    parseFloat(similarProject.maxPrice) > 0
                      ? `${similarProject.minPrice} - ${similarProject.maxPrice}`
                      : similarProject.price
                        ? similarProject.price
                        : similarProject.minPrice &&
                            parseFloat(similarProject.minPrice) > 0
                          ? similarProject.minPrice
                          : similarProject.maxPrice &&
                              parseFloat(similarProject.maxPrice) > 0
                            ? similarProject.maxPrice
                            : null}
                  </p>
                  <img
                    src="/Saudi_Riyal_Symbol.svg"
                    alt="ريال سعودي"
                    className="w-4 h-4"
                    style={{
                      filter: "brightness(0) saturate(100%)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
