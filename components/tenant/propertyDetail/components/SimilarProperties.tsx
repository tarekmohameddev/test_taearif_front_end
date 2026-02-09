"use client";

import Link from "next/link";
import Image from "next/image";
import { BedIcon, EyeIcon } from "lucide-react";
import { Property } from "../types/types";

interface SimilarPropertiesProps {
  properties: Property[];
  loading: boolean;
  primaryColor: string;
  primaryColorFilter: string;
  logoImage: string | null;
}

export function SimilarProperties({
  properties,
  loading,
  primaryColor,
  primaryColorFilter,
  logoImage,
}: SimilarPropertiesProps) {
  if (!loading && properties.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex-1">
        <div>
          <h3
            className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
            style={{ backgroundColor: primaryColor }}
          >
            عقارات مشابهة
          </h3>

          {/* Desktop View */}
          <div className="hidden md:block space-y-8">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex mb-8 gap-x-6 h-48 w-full rounded-xl px-4 border border-gray-200 shadow-lg animate-pulse"
                  >
                    <div className="flex-[48.6%] py-8 flex flex-col gap-y-4 justify-center">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="flex-[42.4%] py-4 rounded-lg overflow-hidden w-full h-full">
                      <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              properties.map((similarProperty) => (
                <Link
                  key={similarProperty.id}
                  href={`/property/${similarProperty.slug || similarProperty.id}`}
                  className="flex mb-8 gap-x-6 h-48 w-full rounded-xl px-4 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="flex-[40%] py-8 flex flex-col gap-y-4 justify-center">
                    <h4 className="text-ellipsis overflow-hidden font-bold text-xl text-gray-600">
                      {similarProperty.title}
                    </h4>
                    <p className="text-ellipsis font-bold text-base text-gray-600 leading-5">
                      {similarProperty.district}
                    </p>
                    <div className="flex flex-row items-center justify-start">
                      <p className="flex items-center justify-center leading-6 font-bold text-xl gap-2">
                        {similarProperty.price}
                        <img
                          src="/Saudi_Riyal_Symbol.svg"
                          alt="ريال سعودي"
                          className="w-5 h-5"
                          style={{ filter: primaryColorFilter }}
                        />
                      </p>
                    </div>
                  </div>
                  <figure className="relative flex-[60%] py-4 rounded-lg overflow-hidden w-full h-full">
                    <div className="bg-white mt-3 absolute w-fit h-7 gap-x-5 md:h-9 flex items-center justify-between px-3 top-4 md:top-5 lg:top-4 right-2 rounded-md">
                      <div className="flex flex-row items-center justify-center gap-x-1">
                        <EyeIcon className="w-4 h-4 text-gray-600" />
                        <p className="text-sm md:text-base font-bold text-gray-600">
                          {similarProperty.views}
                        </p>
                      </div>
                      <div className="flex flex-row items-center justify-center gap-x-1">
                        <BedIcon className="w-4 h-4 text-gray-600" />
                        <p className="text-sm md:text-base font-bold text-gray-600">
                          {similarProperty.bedrooms || 0}
                        </p>
                      </div>
                    </div>
                    <Image
                      src={similarProperty.image}
                      alt="RealEstate Image"
                      fill
                      className="w-full h-full object-cover rounded-lg overflow-hidden relative -z-10"
                    />
                    {logoImage && (
                      <div className="absolute bottom-2 right-2 opacity-50">
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
                  </figure>
                </Link>
              ))
            )}
          </div>

          {/* Mobile View */}
          <div className="block md:hidden">
            <div className="flex gap-4 overflow-x-auto">
              {loading
                ? [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="relative h-88 md:h-91 flex flex-col justify-center min-w-[280px] animate-pulse"
                    >
                      <div className="relative w-full h-64 flex items-center justify-center rounded-2xl overflow-hidden bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mt-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
                    </div>
                  ))
                : properties.map((similarProperty) => (
                    <Link
                      key={similarProperty.id}
                      href={`/property/${similarProperty.slug || similarProperty.id}`}
                    >
                      <div className="relative h-88 md:h-91 flex flex-col justify-center min-w-[300px]">
                        <div className="bg-white z-40 absolute w-36 mt-3 h-7 md:w-46 md:h-9 flex items-center justify-between px-3 top-4 md:top-5 lg:top-4 right-2 rounded-md">
                          <div className="flex flex-row items-center justify-center gap-x-1">
                            <EyeIcon className="w-4 h-4 text-gray-600" />
                            <p className="text-sm md:text-base font-bold text-gray-600">
                              {similarProperty.views}
                            </p>
                          </div>
                          <div className="flex flex-row items-center justify-center gap-x-1">
                            <BedIcon className="w-4 h-4 text-gray-600" />
                            <p className="text-sm md:text-base font-bold text-gray-600">
                              {similarProperty.bedrooms || 0}
                            </p>
                          </div>
                        </div>
                        <figure className="relative w-full h-64 flex items-center justify-center rounded-2xl overflow-hidden">
                          <Image
                            src={similarProperty.image}
                            alt="RealEstateImage"
                            width={800}
                            height={600}
                            className="w-full h-full object-cover"
                          />
                          {logoImage && (
                            <div className="absolute bottom-2 right-2 opacity-50">
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
                        </figure>
                        <p className="text-gray-800 pt-4 text-base md:text-lg xl:text-xl font-normal leading-5 xl:leading-6 text-ellipsis overflow-hidden">
                          {similarProperty.title}
                        </p>
                        <p className="text-gray-500 pt-2 font-normal text-sm xl:text-base text-ellipsis overflow-hidden leading-4 xl:leading-5">
                          {similarProperty.district}
                        </p>
                        <div className="flex flex-row items-center justify-between pt-4">
                          <p className="text-ellipsis overflow-hidden text-gray-800 font-bold text-base leading-5 md:text-lg xl:text-xl xl:leading-6 flex items-center gap-2">
                            {similarProperty.price}
                            <img
                              src="/Saudi_Riyal_Symbol.svg"
                              alt="ريال سعودي"
                              className="w-5 h-5"
                              style={{ filter: primaryColorFilter }}
                            />
                          </p>
                          <p
                            className="font-bold text-base leading-5 xl:leading-6 xl:text-lg"
                            style={{ color: primaryColor }}
                          >
                            تفاصيل
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
