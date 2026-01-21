"use client";

export default function ContactMapSectionSkeleton1() {
  return (
    <section className="w-full bg-background py-14 sm:py-16 animate-pulse">
      {/* Enhanced Background Shimmer Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="mx-auto max-w-[1600px] px-4 relative z-10" dir="rtl">
          {/* العنوان والوصف - Header Section */}
          <header className="mb-10 text-right">
            {/* Title Skeleton - "شاركنا تقييمك معنا" */}
            <div className="mb-4">
              <div className="h-8 md:h-10 lg:h-12 bg-gray-200 rounded animate-pulse w-64 md:w-80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>

            {/* Description Skeleton - Long description text */}
            <div className="max-w-4xl leading-7 mt-4 space-y-2">
              {/* First line of description */}
              <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse w-full relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.2s" }}
                ></div>
              </div>

              {/* Second line of description */}
              <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse w-5/6 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                  style={{ animationDelay: "1.3s" }}
                ></div>
              </div>

              {/* Third line of description */}
              <div className="h-5 md:h-6 bg-gray-100 rounded animate-pulse w-4/5 relative overflow-hidden">
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
          </header>

          {/* التقسيم 50/50 - Grid Layout */}
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            {/* النموذج - Form Section (Right Side) */}
            <div className="order-1 lg:order-1">
              <div className="space-y-6">
                {/* Name and Country Fields - Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Name Field */}
                  <div>
                    {/* Label Skeleton */}
                    <div className="mb-2 block">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12 relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div
                          className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                          style={{ animationDelay: "1.5s" }}
                        ></div>
                      </div>
                    </div>
                    {/* Input Skeleton */}
                    <div className="h-12 bg-gray-100 border border-gray-200 rounded-md animate-pulse relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                        style={{ animationDelay: "0.6s" }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                        style={{ animationDelay: "1.6s" }}
                      ></div>
                    </div>
                  </div>

                  {/* Country Field */}
                  <div>
                    {/* Label Skeleton */}
                    <div className="mb-2 block">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-10 relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                          style={{ animationDelay: "0.7s" }}
                        ></div>
                        <div
                          className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                          style={{ animationDelay: "1.7s" }}
                        ></div>
                      </div>
                    </div>
                    {/* Input Skeleton */}
                    <div className="h-12 bg-gray-100 border border-gray-200 rounded-md animate-pulse relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                        style={{ animationDelay: "0.8s" }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                        style={{ animationDelay: "1.8s" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Feedback Textarea */}
                <div>
                  {/* Label Skeleton */}
                  <div className="mb-2 block">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                        style={{ animationDelay: "0.9s" }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                        style={{ animationDelay: "1.9s" }}
                      ></div>
                    </div>
                  </div>
                  {/* Textarea Skeleton */}
                  <div className="min-h-[120px] bg-gray-100 border border-gray-200 rounded-md animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer"
                      style={{ animationDelay: "1.0s" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer"
                      style={{ animationDelay: "2.0s" }}
                    ></div>
                  </div>
                </div>

                {/* Rating Section */}
                <div>
                  {/* Rating Label Skeleton */}
                  <div className="mb-3 block">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-14 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                        style={{ animationDelay: "1.1s" }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                        style={{ animationDelay: "2.1s" }}
                      ></div>
                    </div>
                  </div>

                  {/* Stars Rating Skeleton */}
                  <div className="flex items-center gap-2">
                    {/* 5 Stars */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded animate-pulse relative overflow-hidden ${
                          i < 3 ? "bg-gray-200" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r from-transparent ${
                            i < 3 ? "via-gray-300/60" : "via-gray-300/60"
                          } to-transparent animate-shimmer`}
                          style={{ animationDelay: `${1.2 + i * 0.1}s` }}
                        ></div>
                        <div
                          className={`absolute inset-0 bg-gradient-to-l from-transparent ${
                            i < 3 ? "via-gray-200/40" : "via-gray-200/40"
                          } to-transparent animate-shimmer`}
                          style={{ animationDelay: `${2.2 + i * 0.1}s` }}
                        ></div>
                      </div>
                    ))}

                    {/* Rating Text */}
                    <div className="mr-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-8 relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                          style={{ animationDelay: "1.7s" }}
                        ></div>
                        <div
                          className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                          style={{ animationDelay: "2.7s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="w-full py-6 bg-gray-200 rounded-xl animate-pulse relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                    style={{ animationDelay: "1.8s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                    style={{ animationDelay: "2.8s" }}
                  ></div>

                  {/* Button Text Skeleton */}
                  <div className="flex items-center justify-center">
                    <div className="h-5 bg-gray-300 rounded animate-pulse w-12 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer"
                        style={{ animationDelay: "1.9s" }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                        style={{ animationDelay: "2.9s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* الخريطة - Map Section (Left Side) */}
            <div className="order-2 lg:order-2">
              <div className="h-[400px] lg:h-[500px] w-full overflow-hidden rounded-xl border bg-gray-200 animate-pulse relative">
                {/* Map Background Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                    style={{ animationDelay: "2.0s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                    style={{ animationDelay: "3.0s" }}
                  ></div>
                </div>

                {/* Map Elements Simulation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Map Pin/Marker */}
                  <div className="relative">
                    {/* Main Map Pin */}
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer"
                        style={{ animationDelay: "2.1s" }}
                      ></div>
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer"
                        style={{ animationDelay: "3.1s" }}
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
                      style={{ animationDelay: "2.2s" }}
                    ></div>
                  </div>

                  {/* Zoom Out Button */}
                  <div className="w-8 h-8 bg-white border border-gray-300 rounded animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "2.3s" }}
                    ></div>
                  </div>
                </div>

                {/* Map Controls Simulation (Bottom Right) */}
                <div className="absolute bottom-4 right-4 space-y-1">
                  {/* Street View Button */}
                  <div className="w-10 h-8 bg-white border border-gray-300 rounded animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "2.4s" }}
                    ></div>
                  </div>

                  {/* Fullscreen Button */}
                  <div className="w-8 h-8 bg-white border border-gray-300 rounded animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "2.5s" }}
                    ></div>
                  </div>
                </div>

                {/* Google Maps Logo Simulation (Bottom Left) */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-16 h-6 bg-white border border-gray-300 rounded animate-pulse relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer"
                      style={{ animationDelay: "2.6s" }}
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
                        style={{ animationDelay: "2.7s" }}
                      ></div>
                    </div>
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
