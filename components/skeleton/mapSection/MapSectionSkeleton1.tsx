"use client";

export default function MapSectionSkeleton1() {
  return (
    <section className="container mx-auto px-4 py-8 animate-pulse">
      {/* Enhanced Background Shimmer Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative z-10">
          {/* Title Skeleton - "تواصل معنا" */}
          <div className="text-center mb-4">
            <div className="h-8 md:h-9 bg-gray-200 rounded animate-pulse mx-auto w-32 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          {/* Subtitle Skeleton - Long description text */}
          <div className="text-center mb-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              {/* First line of subtitle */}
              <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse mx-auto w-full relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.2s" }}
                ></div>
              </div>

              {/* Second line of subtitle */}
              <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse mx-auto w-5/6 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.3s" }}
                ></div>
              </div>

              {/* Third line of subtitle */}
              <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse mx-auto w-4/5 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.4s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Map Container Skeleton */}
          <div className="w-full max-w-[1600px] mx-auto">
            <div
              className="w-full bg-gray-200 rounded-lg animate-pulse relative overflow-hidden"
              style={{ height: "450px" }}
            >
              {/* Map Background Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>

              {/* Map Elements Simulation */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Map Pin/Marker Skeleton */}
                <div className="relative">
                  {/* Main Map Pin */}
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.6s" }}
                    ></div>
                  </div>

                  {/* Pin Shadow */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gray-300 rounded-full opacity-30 animate-pulse"></div>
                </div>
              </div>

              {/* Map Controls Simulation (Top Right) */}
              <div className="absolute top-4 right-4 space-y-2">
                {/* Zoom In Button */}
                <div className="w-8 h-8 bg-white border border-gray-300 rounded animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.7s" }}
                  ></div>
                </div>

                {/* Zoom Out Button */}
                <div className="w-8 h-8 bg-white border border-gray-300 rounded animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.8s" }}
                  ></div>
                </div>
              </div>

              {/* Map Controls Simulation (Bottom Right) */}
              <div className="absolute bottom-4 right-4 space-y-1">
                {/* Street View Button */}
                <div className="w-10 h-8 bg-white border border-gray-300 rounded animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "0.9s" }}
                  ></div>
                </div>

                {/* Fullscreen Button */}
                <div className="w-8 h-8 bg-white border border-gray-300 rounded animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.0s" }}
                  ></div>
                </div>
              </div>

              {/* Google Maps Logo Simulation (Bottom Left) */}
              <div className="absolute bottom-4 left-4">
                <div className="w-16 h-6 bg-white border border-gray-300 rounded animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.1s" }}
                  ></div>
                </div>
              </div>

              {/* Map Roads/Paths Simulation */}
              <div className="absolute inset-0 opacity-20">
                {/* Horizontal Road */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400 animate-pulse"></div>

                {/* Vertical Road */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400 animate-pulse"></div>

                {/* Diagonal Roads */}
                <div className="absolute top-1/4 left-1/4 w-32 h-0.5 bg-gray-400 rotate-45 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-0.5 bg-gray-400 -rotate-45 animate-pulse"></div>
              </div>

              {/* Loading Indicator */}
              <div className="absolute top-4 left-4">
                <div className="flex items-center space-x-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm">
                  {/* Loading Spinner */}
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>

                  {/* Loading Text */}
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
